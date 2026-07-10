(() => {
  const demoParams = new URLSearchParams(window.location.search);
  if (demoParams.get('demo') !== '1') return;

  const originalFetch = window.fetch.bind(window);
  const isoDate = (daysFromNow) => {
    const date = new Date();
    date.setDate(date.getDate() + daysFromNow);
    return date.toISOString().slice(0, 10);
  };

  const demoUser = {
    id: 'demo-user',
    firstName: 'Xnonymous',
    middleName: '',
    lastName: '',
    birthday: '2003-08-12',
    gender: 'Prefer not to say',
    email: 'xnonymous@xnoyms.edu',
    university: 'Xnoyms University',
    universityDomain: 'xnoyms.edu',
    classYear: '2027',
    major: 'Exploring majors',
    interests: ['Travel', 'Campus life'],
    socialLinks: {},
    campusGroups: [],
    themePreference: 'dark',
    serviceApproved: true,
    waitlisted: false,
    emailVerified: true,
    memberNumber: 1001,
    isAdmin: false,
    defaultPaymentMethod: null,
    payoutInfo: null,
    paymentProvider: 'stripe',
    paymentProviderLabel: 'Stripe',
    payoutProvider: 'stripe',
    payoutProviderLabel: 'Stripe',
    termsVersion: 'current',
    privacyVersion: 'current',
    requiredTermsVersion: 'current',
    requiredPrivacyVersion: 'current',
    requiresPolicyConsent: false,
    missingRequiredSettings: [],
    requiresRequiredSettings: false,
    createdAt: '2026-01-15T12:00:00.000Z',
    rideServicesPaused: false,
    notificationPreferences: { weeklyRecapEmail: true, rideAlertEmail: true },
    twoFactorEnabled: false,
    emailTwoFactorEnabled: false,
    friendInviteCount: 0,
    followerCount: 2,
    followingCount: 3,
    wallet: { availableCents: 0, pendingCents: 0 },
  };

  const seatMap = (takenSeatId = '') => ['front_passenger', 'back_left', 'back_middle', 'back_right'].map((id) => ({
    id,
    available: id !== takenSeatId,
    reserved: id === takenSeatId,
    studentId: id === takenSeatId ? 'demo-passenger' : null,
  }));

  const rides = [
    {
      id: 'demo-ride-maya', driverId: 'demo-driver-maya', driverFirstName: 'Maya', driverLastName: 'R.',
      university: 'Xnoyms University', origin: 'Campus Union', destination: 'San Francisco International Airport (SFO)',
      originLat: 37.7219, originLng: -122.4782, destinationLat: 37.6213, destinationLng: -122.379,
      date: isoDate(2), time: '15:30', estimatedDurationMinutes: 70, distanceMiles: 36,
      seatsAvailable: 3, priceCents: 1800, price: 18, rideProviderType: 'personal_car',
      carMaker: 'Tesla', carModel: 'Model S', carColor: 'Black', sameSchoolOnly: true,
      sameGenderOnly: false, noSmoking: true, notes: 'One carry-on per rider. Music requests welcome.',
      driverRatingAverage: 4.9, driverRatingCount: 32, vehicleSeatCount: 5, seatMap: seatMap('back_left'),
      passengers: [{ studentId: 'demo-passenger', firstName: 'Alex', lastName: 'T.', seatId: 'back_left', paid: true }],
    },
    {
      id: 'demo-ride-jordan', driverId: 'demo-driver-jordan', driverFirstName: 'Jordan', driverLastName: 'P.',
      university: 'Xnoyms University', origin: 'North Dorms', destination: 'NYC · Port Authority',
      originLat: 42.366, originLng: -71.1, destinationLat: 40.757, destinationLng: -73.99,
      date: isoDate(3), time: '09:00', estimatedDurationMinutes: 255, distanceMiles: 212,
      seatsAvailable: 2, priceCents: 3200, price: 32, rideProviderType: 'personal_car',
      carMaker: 'Toyota', carModel: 'Camry', carColor: 'Blue', sameSchoolOnly: true,
      sameGenderOnly: false, noSmoking: true, notes: 'Quiet ride with one rest stop.',
      driverRatingAverage: 4.8, driverRatingCount: 57, vehicleSeatCount: 5, seatMap: seatMap('back_middle'), passengers: [],
    },
    {
      id: 'demo-ride-sam', driverId: 'demo-driver-sam', driverFirstName: 'Sam', driverLastName: 'K.',
      university: 'Xnoyms University', origin: 'Library Lot', destination: 'Boston South Station',
      originLat: 42.35, originLng: -71.11, destinationLat: 42.3523, destinationLng: -71.0552,
      date: isoDate(2), time: '17:15', estimatedDurationMinutes: 65, distanceMiles: 31,
      seatsAvailable: 4, priceCents: 1400, price: 14, rideProviderType: 'personal_car',
      carMaker: 'Mazda', carModel: '3', carColor: 'Red', sameSchoolOnly: false,
      sameGenderOnly: false, noSmoking: true, notes: 'Snacks are okay.',
      driverRatingAverage: null, driverRatingCount: 0, vehicleSeatCount: 5, seatMap: seatMap(), passengers: [],
    },
  ];

  const requests = [{
    id: 'demo-request-priya', riderId: 'demo-rider-priya', riderFirstName: 'Priya', riderLastName: 'N.',
    riderGender: 'Female', university: 'Xnoyms University', origin: 'Campus Union',
    destination: 'Providence Place Mall', date: isoDate(4), time: '11:00',
    willingToPayCents: 1800, estimatedDurationMinutes: 45, distanceMiles: 34,
    sameSchoolDriverOnly: true, sameGenderDriverOnly: false, status: 'open', notes: 'Flexible by about 30 minutes.',
  }];

  const cart = new Map();
  if (demoParams.get('tour') === 'book') {
    const bookingRide = rides[0];
    cart.set(bookingRide.id, {
      ...bookingRide,
      selectedSeatId: 'front_passenger',
      cartTermsAccepted: true,
    });
  }
  const json = (body, status = 200) => Promise.resolve(new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  }));
  const bodyJson = (options) => {
    try { return JSON.parse(options?.body || '{}'); } catch (_) { return {}; }
  };

  window.__LINKUP_DEMO_MODE__ = true;
  document.documentElement.classList.add('linkup-demo-mode');
  if (demoParams.get('embed') === '1') document.documentElement.classList.add('linkup-demo-embed');

  window.fetch = (input, options = {}) => {
    const requestUrl = typeof input === 'string' ? input : input.url;
    const url = new URL(requestUrl, window.location.origin);
    if (url.origin !== window.location.origin || !url.pathname.startsWith('/api/')) {
      return originalFetch(input, options);
    }
    const method = String(options.method || (typeof input !== 'string' && input.method) || 'GET').toUpperCase();
    const path = url.pathname;

    // Configuration is not user data. Let the production UI load the normal
    // browser-safe Maps key so sample routes and pins render in the demo.
    if (path === '/api/config/google-maps-key') {
      return originalFetch('/api/demo/config/google-maps-key', { credentials: 'same-origin' });
    }

    if (path === '/api/auth/me') return json(demoUser);
    if (path === '/api/auth/signout') return json({ message: 'Demo closed.' });
    if (path === '/api/notifications') return json({ notifications: [] });
    if (path === '/api/rides' && method === 'GET') return json(rides);
    if (path === '/api/ride-requests' && method === 'GET') return json(requests);
    if (path === '/api/cart' && method === 'GET') {
      return json({ rides: [...cart.values()], expiredRideCount: 0 });
    }
    const cartMatch = path.match(/^\/api\/cart\/([^/]+)$/);
    if (cartMatch && method === 'POST') {
      const ride = rides.find((item) => item.id === decodeURIComponent(cartMatch[1]));
      if (!ride) return json({ error: 'Sample ride not found.' }, 404);
      const payload = bodyJson(options);
      cart.set(ride.id, { ...ride, selectedSeatId: payload.seatId || '', cartTermsAccepted: true });
      return json({ message: 'Added to your demo cart.' }, 201);
    }
    if (cartMatch && method === 'DELETE') {
      cart.delete(decodeURIComponent(cartMatch[1]));
      return json({ message: 'Removed from your demo cart.' });
    }
    if (path === '/api/profile' && method === 'GET') {
      const joinedRide = {
        ...rides[0],
        licensePlate: '4KE-7723',
        selectedSeatId: 'front_passenger',
        seatsAvailable: 2,
        passengers: [
          ...rides[0].passengers,
          { studentId: demoUser.id, firstName: demoUser.firstName, lastName: demoUser.lastName, seatId: 'front_passenger', paid: true },
        ],
      };
      return json({
        ...demoUser,
        createdRides: [], joinedRides: [joinedRide], riderRequests: [], driverOffers: [],
        wallet: demoUser.wallet,
      });
    }
    if (path === '/api/users/suggestions') return json({ users: [] });
    if (path === '/api/leaderboard/schools') return json({ schools: [] });

    if (method !== 'GET') return json({ message: 'Demo action completed locally. No production data was changed.' });
    return json({ error: 'This sample area has no demo data yet.' }, 404);
  };

  document.addEventListener('DOMContentLoaded', () => {
    const leftActions = document.getElementById('header-left-actions');
    if (leftActions) {
      const back = document.createElement('a');
      back.className = 'demo-production-back';
      back.href = '/';
      back.textContent = '← Back to waitlist';
      back.setAttribute('aria-label', 'Return to the LinkUp waitlist');
      leftActions.prepend(back);
    }
    const signout = document.getElementById('signout');
    signout?.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopImmediatePropagation();
      window.location.assign('/');
    }, true);
  });
})();
