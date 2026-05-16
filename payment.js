// ─────────────────────────────────────────────────────────────────────────────
// payment.js  –  Stripe Elements inline card payment for LinkUp
//
// HOW TO USE:
//   1. Add this script to public/ and load it in index.html AFTER stripe.js:
//        <script src="https://js.stripe.com/v3/"></script>
//        <script src="/payment.js"></script>
//
//   2. Include the payment modal markup from payment.html in your index.html.
//
//   3. To open the payment sheet for the current cart call:
//        window.LinkUpPayment.openCheckout();
//
//      Or pass a specific list of rideIds:
//        window.LinkUpPayment.openCheckout(['ride-id-1', 'ride-id-2']);
// ─────────────────────────────────────────────────────────────────────────────

(function () {
  'use strict';

  // ── Internal state ────────────────────────────────────────────────────────
  let stripeInstance = null;
  let cardElement = null;
  let currentClientSecret = null;
  let currentIntentId = null;
  let onSuccessCallback = null;

  // ── DOM refs (resolved lazily so the module can load before the DOM) ──────
  function el(id) { return document.getElementById(id); }

  // ── Bootstrap Stripe.js ───────────────────────────────────────────────────
  async function initStripe() {
    if (stripeInstance) return stripeInstance;

    const res = await fetch('/api/payments/config');
    if (!res.ok) throw new Error('Could not load payment configuration.');
    const { publishableKey } = await res.json();
    if (!publishableKey) throw new Error('Stripe publishable key not configured.');

    // eslint-disable-next-line no-undef
    stripeInstance = Stripe(publishableKey);
    return stripeInstance;
  }

  // ── Mount (or re-mount) the card Element ──────────────────────────────────
  function mountCardElement(stripe) {
    const mountPoint = el('linkup-card-element');
    if (!mountPoint) return;

    // Destroy previous instance to avoid duplicate mount errors
    if (cardElement) {
      cardElement.destroy();
      cardElement = null;
    }

    const elements = stripe.elements();
    cardElement = elements.create('card', {
      style: {
        base: {
          fontFamily: '"Inter", system-ui, sans-serif',
          fontSize: '16px',
          color: '#1a1a2e',
          '::placeholder': { color: '#9ca3af' },
          iconColor: '#4f46e5',
        },
        invalid: { color: '#ef4444', iconColor: '#ef4444' },
      },
      hidePostalCode: false,
    });

    cardElement.mount('#linkup-card-element');

    // Live validation feedback
    cardElement.on('change', (event) => {
      const errEl = el('linkup-card-errors');
      if (errEl) errEl.textContent = event.error ? event.error.message : '';
    });
  }

  // ── Open the payment modal ────────────────────────────────────────────────
  async function openCheckout(rideIds, onSuccess) {
    onSuccessCallback = onSuccess || null;

    const modal = el('linkup-payment-modal');
    if (!modal) {
      console.error('[LinkUpPayment] #linkup-payment-modal not found in DOM. Did you add payment.html?');
      return;
    }

    // Reset UI
    setStatus('');
    setError('');
    setLoading(false);
    modal.classList.remove('hidden');
    modal.setAttribute('aria-hidden', 'false');

    try {
      const stripe = await initStripe();
      mountCardElement(stripe);

      // Ask server for a PaymentIntent
      const body = rideIds && rideIds.length ? { rideIds } : {};
      const res = await fetch('/api/payments/create-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        credentials: 'include',
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Could not start payment. Please try again.');
        return;
      }

      currentClientSecret = data.clientSecret;
      // Extract the PaymentIntent id from the secret (format: pi_xxx_secret_yyy)
      currentIntentId = data.clientSecret.split('_secret_')[0];
    } catch (err) {
      console.error('[LinkUpPayment] openCheckout error:', err);
      setError(err.message || 'Unexpected error. Please refresh and try again.');
    }
  }

  // ── Submit (called by Pay button) ─────────────────────────────────────────
  async function submitPayment() {
    if (!stripeInstance || !cardElement || !currentClientSecret) {
      setError('Payment not ready. Please close and try again.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      // confirmCardPayment sends card data directly to Stripe — never your server
      const { error, paymentIntent } = await stripeInstance.confirmCardPayment(
        currentClientSecret,
        { payment_method: { card: cardElement } }
      );

      if (error) {
        setError(error.message || 'Payment failed. Please check your card details.');
        setLoading(false);
        return;
      }

      if (paymentIntent.status === 'succeeded') {
        // Tell the server to finalise the booking
        await pollIntentStatus(currentIntentId);
      } else {
        setError('Unexpected payment status: ' + paymentIntent.status);
        setLoading(false);
      }
    } catch (err) {
      console.error('[LinkUpPayment] submitPayment error:', err);
      setError(err.message || 'An unexpected error occurred.');
      setLoading(false);
    }
  }

  // ── Poll server to confirm booking was finalised ──────────────────────────
  async function pollIntentStatus(intentId, attempts = 0) {
    if (attempts > 8) {
      setStatus('Payment received! Your booking may take a moment to confirm.');
      setLoading(false);
      closeCheckout();
      if (typeof window.showToast === 'function') {
        window.showToast('Payment received! Check your rides shortly.', 'success');
      }
      return;
    }

    try {
      const res = await fetch(`/api/payments/intent/${intentId}/status`, {
        credentials: 'include',
      });
      const data = await res.json();

      if (data.paid) {
        setLoading(false);
        closeCheckout();
        if (typeof window.showToast === 'function') {
          window.showToast('Payment successful! Seats reserved.', 'success');
        }
        if (typeof onSuccessCallback === 'function') onSuccessCallback();
        // Refresh relevant app state if the global helpers exist
        if (typeof window.loadCart === 'function') window.loadCart();
        if (typeof window.loadRides === 'function') window.loadRides();
      } else {
        // Wait and retry
        await new Promise((r) => setTimeout(r, 1000));
        await pollIntentStatus(intentId, attempts + 1);
      }
    } catch (err) {
      console.error('[LinkUpPayment] pollIntentStatus error:', err);
      await new Promise((r) => setTimeout(r, 1500));
      await pollIntentStatus(intentId, attempts + 1);
    }
  }

  // ── Close modal ───────────────────────────────────────────────────────────
  function closeCheckout() {
    const modal = el('linkup-payment-modal');
    if (modal) {
      modal.classList.add('hidden');
      modal.setAttribute('aria-hidden', 'true');
    }
    currentClientSecret = null;
    currentIntentId = null;
    setLoading(false);
    setError('');
    setStatus('');
  }

  // ── UI helpers ────────────────────────────────────────────────────────────
  function setLoading(loading) {
    const btn = el('linkup-pay-button');
    const spinner = el('linkup-pay-spinner');
    if (!btn) return;
    btn.disabled = loading;
    btn.textContent = loading ? 'Processing…' : 'Pay now';
    if (spinner) spinner.style.display = loading ? 'inline-block' : 'none';
  }

  function setError(msg) {
    const errEl = el('linkup-card-errors');
    if (errEl) errEl.textContent = msg;
  }

  function setStatus(msg) {
    const statusEl = el('linkup-payment-status');
    if (statusEl) statusEl.textContent = msg;
  }

  // ── Wire up DOM events after page load ────────────────────────────────────
  document.addEventListener('DOMContentLoaded', () => {
    const payBtn = el('linkup-pay-button');
    if (payBtn) payBtn.addEventListener('click', submitPayment);

    const cancelBtn = el('linkup-payment-cancel');
    if (cancelBtn) cancelBtn.addEventListener('click', closeCheckout);

    // Close on backdrop click
    const modal = el('linkup-payment-modal');
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) closeCheckout();
      });
    }

    // Close on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeCheckout();
    });
  });

  // ── Public API ────────────────────────────────────────────────────────────
  window.LinkUpPayment = {
    openCheckout,
    closeCheckout,
    submitPayment,
  };
})();
