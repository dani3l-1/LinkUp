// ─────────────────────────────────────────────────────────────────────────────
// payment-routes.js
// Drop-in Stripe Elements payment routes for LinkUp
//
// HOW TO USE:
//   1. Copy this file next to server.js
//   2. Add this line near the top of server.js (after stripe is initialised):
//        require('./payment-routes')(app, stripe, requireAuth, requireServiceAccess, sensitiveWriteRateLimit, loadDb, saveDb, finalizePaidCheckoutByPaymentIntent);
//
// ROUTES ADDED:
//   GET  /api/payments/config              → returns publishable key for frontend
//   POST /api/payments/create-intent       → creates a PaymentIntent
//   POST /api/payments/confirm             → (optional) server-side confirm fallback
//   GET  /api/payments/intent/:intentId    → poll intent status after confirmCardPayment
// ─────────────────────────────────────────────────────────────────────────────

'use strict';

module.exports = function registerPaymentRoutes(
  app,
  stripe,
  requireAuth,
  requireServiceAccess,
  sensitiveWriteRateLimit,
  loadDb,
  saveDb,
  finalizePaidCheckoutByPaymentIntent  // existing helper already in server.js
) {
  if (!stripe) {
    console.warn('[payment-routes] Stripe is not configured — payment routes will return 503.');
  }

  // ── 1. Expose publishable key to frontend ──────────────────────────────────
  app.get('/api/payments/config', (req, res) => {
    res.json({
      publishableKey: process.env.STRIPE_PUBLISHABLE_KEY || '',
      paymentProvider: process.env.PAYMENT_PROVIDER || 'stripe',
    });
  });

  // ── 2. Create a PaymentIntent ──────────────────────────────────────────────
  //
  // Body: { rideIds: string[], selectedSeatIds?: Record<string,string> }
  //
  // We look up the rides in the cart / by ID, compute the total, and create
  // the intent.  The clientSecret is returned to the browser so Stripe.js can
  // confirm it without the card number ever hitting your server.
  app.post(
    '/api/payments/create-intent',
    requireAuth,
    requireServiceAccess,
    sensitiveWriteRateLimit,
    async (req, res) => {
      if (!stripe) {
        return res.status(503).json({ error: 'Stripe is not configured on this server.' });
      }

      try {
        const db = loadDb();
        const studentId = req.session.userId;
        const student = (db.users || []).find((u) => u.id === studentId);
        if (!student) {
          return res.status(404).json({ error: 'User not found.' });
        }

        // Accept an explicit list of rideIds or fall back to the user's cart
        const requestedRideIds = Array.isArray(req.body.rideIds) ? req.body.rideIds : null;
        const cartEntries = (db.carts?.[studentId] || []).filter((e) =>
          requestedRideIds ? requestedRideIds.includes(e.rideId) : true
        );

        if (!cartEntries.length) {
          return res.status(400).json({ error: 'No rides selected for checkout.' });
        }

        // Sum up ride prices
        let totalCents = 0;
        const rideLabels = [];
        for (const entry of cartEntries) {
          const ride = (db.rides || []).find((r) => r.id === entry.rideId);
          if (!ride) {
            return res.status(400).json({ error: `Ride not found: ${entry.rideId}` });
          }
          totalCents += ride.priceCents || 0;
          rideLabels.push(`${ride.origin} → ${ride.destination}`);
        }

        if (totalCents < 50) {
          return res.status(400).json({ error: 'Minimum payment is $0.50.' });
        }

        // Create a Stripe PaymentIntent
        const paymentIntent = await stripe.paymentIntents.create({
          amount: totalCents,
          currency: 'usd',
          payment_method_types: ['card'],
          description: rideLabels.join(' | '),
          metadata: {
            studentId,
            rideIds: (cartEntries.map((e) => e.rideId)).join(','),
          },
        });

        // Persist a pending checkout record so the webhook / poll can finalise it
        db.checkoutSessions = db.checkoutSessions || [];
        db.checkoutSessions.push({
          id: paymentIntent.id,
          provider: 'stripe',
          stripePaymentIntentId: paymentIntent.id,
          studentId,
          cartEntries,
          expectedAmountCents: totalCents,
          status: 'pending',
          createdAt: new Date().toISOString(),
        });
        saveDb(db);

        return res.json({ clientSecret: paymentIntent.client_secret });
      } catch (err) {
        console.error('[payment-routes] create-intent error:', err);
        return res.status(500).json({ error: err.message || 'Failed to create payment intent.' });
      }
    }
  );

  // ── 3. Poll intent status (frontend calls this after confirmCardPayment) ───
  //
  // The frontend calls Stripe.js confirmCardPayment() which talks directly to
  // Stripe.  Once it resolves, the frontend hits this endpoint so the server
  // can verify the result and finalise the booking.
  app.get(
    '/api/payments/intent/:intentId/status',
    requireAuth,
    requireServiceAccess,
    async (req, res) => {
      if (!stripe) {
        return res.status(503).json({ error: 'Stripe is not configured.' });
      }

      try {
        const { intentId } = req.params;

        // Retrieve from Stripe (source of truth)
        const intent = await stripe.paymentIntents.retrieve(intentId);

        const db = loadDb();
        const session = (db.checkoutSessions || []).find(
          (s) => s.stripePaymentIntentId === intentId && s.studentId === req.session.userId
        );

        if (!session) {
          return res.status(404).json({ error: 'Checkout session not found.' });
        }

        if (intent.status === 'succeeded' && session.status !== 'paid') {
          // Finalise the booking (reserves seats, records payment)
          finalizePaidCheckoutByPaymentIntent(db, intent);
          saveDb(db);
        }

        const updatedSession = (db.checkoutSessions || []).find(
          (s) => s.stripePaymentIntentId === intentId
        );

        return res.json({
          intentStatus: intent.status,
          bookingStatus: updatedSession?.status || session.status,
          paid: updatedSession?.status === 'paid' || session.status === 'paid',
        });
      } catch (err) {
        console.error('[payment-routes] intent status error:', err);
        return res.status(500).json({ error: err.message || 'Failed to retrieve payment status.' });
      }
    }
  );
};
