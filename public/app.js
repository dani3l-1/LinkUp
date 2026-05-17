// ── Toast notification system ───────────────────────────────────
const toastContainer = document.getElementById('toast-container');

function showToast(message, type = 'info', duration = 3800) {
  if (!toastContainer) return;
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  const icon = type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ';
  toast.innerHTML = `<span aria-hidden="true">${icon}</span><span>${message}</span>`;
  toastContainer.appendChild(toast);
  const remove = () => {
    toast.classList.add('removing');
    toast.addEventListener('animationend', () => toast.remove(), { once: true });
  };
  const timer = setTimeout(remove, duration);
  toast.addEventListener('click', () => { clearTimeout(timer); remove(); });
}

// ── Button loading helper ───────────────────────────────────────
function setButtonLoading(button, loading) {
  if (!button) return;
  if (loading) {
    button.dataset.originalText = button.textContent;
    button.classList.add('btn-loading');
    button.disabled = true;
  } else {
    button.classList.remove('btn-loading');
    button.disabled = false;
    if (button.dataset.originalText) button.textContent = button.dataset.originalText;
  }
}

const rideTransition = document.getElementById('ride-transition');
const authSection = document.getElementById('auth-section');
const dashboard = document.getElementById('dashboard');
const siteLogo = document.querySelector('.site-logo');
const headerActions = document.getElementById('header-actions');
const headerLeftActions = document.getElementById('header-left-actions');
const signinForm = document.getElementById('signin-form');
const signupForm = document.getElementById('signup-form');
const privacyPage = document.getElementById('privacy-page');
const termsPage = document.getElementById('terms-page');
const privacyContent = document.getElementById('privacy-content');
const termsContent = document.getElementById('terms-content');
const releaseNoteFeed = document.getElementById('release-note-feed');
const privacyLink = document.getElementById('privacy-link');
const termsLink = document.getElementById('terms-link');
const legalBackButtons = document.querySelectorAll('.legal-back');
const legalModal = document.getElementById('legal-modal');
const legalModalTitle = document.getElementById('legal-modal-title');
const legalModalContent = document.getElementById('legal-modal-content');
const legalInlineLinks = document.querySelectorAll('[data-legal-modal]');
const tabButtons = document.querySelectorAll('.tab-button');
const tabContents = document.querySelectorAll('.tab-content');

const welcomeMessage = document.getElementById('welcome-message');
const studentUniversityLabel = document.getElementById('student-university-label');
const signoutButton = document.getElementById('signout');
const chatButton = document.getElementById('chat-button');
const chatPage = document.getElementById('chat-page');
const chatBackHomeButton = document.getElementById('chat-back-home');
const chatRideList = document.getElementById('chat-ride-list');
const chatConversation = document.getElementById('chat-conversation');
const offerForm = document.getElementById('offer-form');
const ridesList = document.getElementById('rides-list');
const profileRides = document.getElementById('profile-rides');
const dashboardHome = document.getElementById('dashboard-home');
const browseTitle = document.getElementById('browse-title');
const browseSubtitle = document.getElementById('browse-subtitle');
const browseControls = document.getElementById('browse-controls');
const browseResultsTitle = document.getElementById('browse-results-title');
const browseDriverButton = document.getElementById('browse-driver-button');
const browseRiderButton = document.getElementById('browse-rider-button');
const waitlistPage = document.getElementById('waitlist-page');
const waitlistMessage = document.getElementById('waitlist-message');
const listRidePage = document.getElementById('list-ride-page');
const requestRidePage = document.getElementById('request-ride-page');
const cartPage = document.getElementById('cart-page');
const requestRideButton = document.getElementById('request-ride-button');
const requestRideBackHomeButton = document.getElementById('request-ride-back-home');
const requestRideForm = document.getElementById('request-ride-form');
const requestRideMessage = document.getElementById('request-ride-message');
const requestRideError = document.getElementById('request-ride-error');
const listRideButton = document.getElementById('list-ride-button');
const listRideBackHomeButton = document.getElementById('list-ride-back-home');
const cartButton = document.getElementById('cart-button');
const yourRidesButton = document.getElementById('your-rides-button');
const yourRidesPage = document.getElementById('your-rides-page');
const yourRidesList = document.getElementById('your-rides-list');
const yourRidesCurrentTab = document.getElementById('your-rides-current-tab');
const yourRidesRequestsTab = document.getElementById('your-rides-requests-tab');
const yourRidesHistoryTab = document.getElementById('your-rides-history-tab');
const yourRidesBackHomeButton = document.getElementById('your-rides-back-home');
const profileButton = document.getElementById('profile-button');
const leaderboardButton = document.getElementById('leaderboard-button');
const leaderboardPage = document.getElementById('leaderboard-page');
const leaderboardBackHomeButton = document.getElementById('leaderboard-back-home');
const leaderboardSummary = document.getElementById('leaderboard-summary');
const leaderboardSavedMiles = document.getElementById('leaderboard-saved-miles');
const schoolLeaderboardChart = document.getElementById('school-leaderboard-chart');
const milesLeaderboardSummary = document.getElementById('miles-leaderboard-summary');
const milesLeaderboardChart = document.getElementById('miles-leaderboard-chart');
const leaderboardError = document.getElementById('leaderboard-error');
const publicProfilePage = document.getElementById('public-profile-page');
const publicProfileTitle = document.getElementById('public-profile-title');
const publicProfileSubtitle = document.getElementById('public-profile-subtitle');
const publicProfileContent = document.getElementById('public-profile-content');
const publicProfileError = document.getElementById('public-profile-error');
const publicProfileBackHomeButton = document.getElementById('public-profile-back-home');
const profilePage = document.getElementById('profile-page');
const profileForm = document.getElementById('profile-form');
const profileBackHomeButton = document.getElementById('profile-back-home');
const profileMessage = document.getElementById('profile-message');
const profileError = document.getElementById('profile-error');
const profileSidebarButtons = document.querySelectorAll('.profile-sidebar-button');
const profilePanels = document.querySelectorAll('[data-profile-panel]');
const profilePictureInput = document.getElementById('profile-picture-input');
const profilePicturePreview = document.getElementById('profile-picture-preview');
const profilePictureRemoveButton = document.getElementById('profile-picture-remove');
const driverPayoutForm = document.getElementById('driver-payout-form');
const payoutMessage = document.getElementById('payout-message');
const payoutError = document.getElementById('payout-error');
const defaultPaymentForm = document.getElementById('default-payment-form');
const defaultPaymentSummary = document.getElementById('default-payment-summary');
const defaultPaymentMessage = document.getElementById('default-payment-message');
const defaultPaymentError = document.getElementById('default-payment-error');
const stripePayoutSummary = document.getElementById('stripe-payout-summary');
const driverWalletSummary = document.getElementById('driver-wallet-summary');
const stripePayoutConnectButton = document.getElementById('stripe-payout-connect');
const payoutCommissionLabel = document.getElementById('payout-commission-label');
const LINKUP_COMMISSION_RATE = 0.15;
const cartCount = document.getElementById('cart-count');
const cartItems = document.getElementById('cart-items');
const cartSubtotal = document.getElementById('cart-subtotal');
const cartSelectAllCheckbox = document.getElementById('cart-select-all');
const cartTermsAgreement = document.getElementById('cart-terms-agreement');
const cartTermsCheckbox = document.getElementById('cart-terms-checkbox');
const checkoutCartButton = document.getElementById('checkout-cart');
const continueShoppingButton = document.getElementById('continue-shopping');
const cartMessage = document.getElementById('cart-message');
const cartError = document.getElementById('cart-error');
const paymentPage = document.getElementById('payment-page');
const paymentSummary = document.getElementById('payment-summary');
const linkupWalletCheckout = document.getElementById('linkup-wallet-checkout');
const paymentBackToCartButton = document.getElementById('payment-back-to-cart');
const paymentMessage = document.getElementById('payment-message');
const paymentError = document.getElementById('payment-error');
const stripeCheckoutContainer = document.getElementById('stripe-checkout-container');
const defaultPaymentStripeContainer = document.getElementById('default-payment-stripe-container');
const stripePaymentElementNode = document.getElementById('stripe-payment-element');
const stripeExpressCheckoutWrap = document.getElementById('stripe-express-checkout-wrap');
const stripeExpressCheckoutNode = document.getElementById('stripe-express-checkout-element');
const cardholderNameInput = document.getElementById('cardholder-name');
const confirmPaymentButton = document.getElementById('confirm-payment');
const defaultPaymentElementNode = document.getElementById('default-payment-element');
const defaultPaymentConfirmButton = document.getElementById('default-payment-confirm');
const trackTripButton = document.getElementById('track-trip-button');
const trackTripPage = document.getElementById('track-trip-page');
const trackBackHomeButton = document.getElementById('track-back-home');
const startTrackingButton = document.getElementById('start-tracking');
const stopTrackingButton = document.getElementById('stop-tracking');
const copyTrackingLinkButton = document.getElementById('copy-tracking-link');
const sendTrackingInviteButton = document.getElementById('send-tracking-invite');
const trackingStatus = document.getElementById('tracking-status');
const trackingDriverInfo = document.getElementById('tracking-driver-info');
const trackingDriverDetails = document.getElementById('tracking-driver-details');
const trackingRecipientEmail = document.getElementById('tracking-recipient-email');
const trackingMessage = document.getElementById('tracking-message');
const trackingError = document.getElementById('tracking-error');
const trackingLastUpdate = document.getElementById('tracking-last-update');
const trackingMapDiv = document.getElementById('tracking-map');
const sharedTrackPage = document.getElementById('shared-track-page');
const sharedTrackTitle = document.getElementById('shared-track-title');
const sharedTrackStatus = document.getElementById('shared-track-status');
const sharedTrackDetails = document.getElementById('shared-track-details');
const sharedTrackMapDiv = document.getElementById('shared-tracking-map');
const sharedTrackMapLink = document.getElementById('shared-track-map-link');
const sharedTrackError = document.getElementById('shared-track-error');

const signinError = document.getElementById('signin-error');
const signupError = document.getElementById('signup-error');
const signupPassword = document.getElementById('signup-password');
const forgotAuthLink = document.getElementById('forgot-auth-link');
const recoveryForm = document.getElementById('recovery-form');
const resetPasswordForm = document.getElementById('reset-password-form');
const verificationForm = document.getElementById('verification-form');
const verificationCode = document.getElementById('verification-code');
const verificationEmailLabel = document.getElementById('verification-email-label');
const resendVerificationButton = document.getElementById('resend-verification');
const verificationBackToSigninButton = document.getElementById('verification-back-to-signin');
const sendPasswordResetButton = document.getElementById('send-password-reset');
const backToSigninButton = document.getElementById('back-to-signin');
const resetBackToSigninButton = document.getElementById('reset-back-to-signin');
const recoveryMessage = document.getElementById('recovery-message');
const recoveryError = document.getElementById('recovery-error');
const resetMessage = document.getElementById('reset-message');
const resetError = document.getElementById('reset-error');
const verificationMessage = document.getElementById('verification-message');
const verificationError = document.getElementById('verification-error');
const policyConsentForm = document.getElementById('policy-consent-form');
const policyMessage = document.getElementById('policy-message');
const policyError = document.getElementById('policy-error');
const policyVersionSummary = document.getElementById('policy-version-summary');
const policyRequiredMessage = document.getElementById('policy-required-message');
const policyScrollbox = document.getElementById('policy-scrollbox');
const policyScrollHint = document.getElementById('policy-scroll-hint');
const policyAgreeButton = document.getElementById('policy-agree-button');
const policyTermsButton = document.getElementById('policy-terms-button');
const policyPrivacyButton = document.getElementById('policy-privacy-button');
const policyCollapseButton = document.getElementById('policy-collapse-button');
const policyReleaseCard = document.querySelector('.policy-release-card');

let currentUser = null;
let originMap = null;
let originMarker = null;
let destinationMarker = null;
let offerRouteRenderer = null;
let offerRouteLine = null;
let offerPickupRadiusCircle = null;
let offerDropoffRadiusCircle = null;
let originAutocomplete = null;
let destinationAutocomplete = null;
let requestOriginAutocomplete = null;
let requestDestinationAutocomplete = null;
let requestOriginMap = null;
let requestOriginMarker = null;
let requestDestinationMarker = null;
let requestRouteRenderer = null;
let requestRouteLine = null;
let requestPickupRadiusCircle = null;
let requestDropoffRadiusCircle = null;
let pickupRadiusAutocomplete = null;
let dropoffRadiusAutocomplete = null;
let cartRideIds = new Set();
let selectedCartRideIds = new Set();
let pendingExpiredCartRideNoticeCount = 0;
let pendingProfilePictureDataUrl;
let pendingVerificationEmail = '';
let activeTrackingTripId = null;
let activeTrackingViewerUrl = '';
let trackingWatchId = null;
let trackingMap = null;
let trackingMarker = null;
let trackingPath = null;
let trackingRouteRenderer = null;
let trackingRouteLine = null;
let trackingRouteKey = '';
let trackingOriginMarker = null;
let trackingDestinationMarker = null;
let lastTrackingLocation = null;
let lastTrackingLocations = [];
let lastTrackingRideRoute = null;
let trackingMapLoadPending = false;
let sharedTrackingMap = null;
let sharedTrackingMarker = null;
let sharedTrackingPath = null;
let sharedTrackingRouteRenderer = null;
let sharedTrackingRouteLine = null;
let sharedTrackingRouteKey = '';
let sharedTrackingOriginMarker = null;
let sharedTrackingDestinationMarker = null;
let sharedTrackingPollId = null;
let currentVehicleSeatCount = 5;
let driverAvailableSeatIds = new Set();
let isRestoringRoute = false;
let legalReturnRoute = '';

function getAppRoute() {
  return decodeURIComponent(window.location.hash.replace(/^#/, '')).trim();
}

function setAppRoute(route) {
  if (isRestoringRoute || !route) return;
  const nextUrl = window.location.pathname + window.location.search + '#' + encodeURIComponent(route);
  window.history.replaceState({}, document.title, nextUrl);
}

function clearAppRoute() {
  window.history.replaceState({}, document.title, window.location.pathname + window.location.search);
}

function finishAppBoot() {
  document.body.classList.remove('app-booting');
}

function isLegalRoute(route) {
  return route === 'privacy' || route === 'terms';
}

function profileRouteForTab(tabName = 'info') {
  return tabName === 'info' ? 'profile' : 'profile-' + tabName;
}

function publicProfileRoute(userId) {
  return 'user-profile-' + userId;
}
let browseRole = null;
let yourRidesView = 'current';
let selectedChatRideId = '';
let browseRadiusMap = null;
let browsePickupCircle = null;
let browseDropoffCircle = null;
let browsePickupMarker = null;
let browseDropoffMarker = null;
let browseRouteRenderer = null;
let browseRouteLine = null;
let browseResultMarkers = [];
let browseRideRoutes = [];        // per-ride/request polylines
let browseRideOriginMarkers = []; // small pickup dot per ride/request
let browsePinLabels = new Map();
let stripeInstance = null;
let stripePaymentElements = null;
let stripeCardElements = null;
let stripeSetupElements = null;
let activeExpressCheckoutElement = null;
let activePaymentElement = null;
let activeSetupElement = null;
let activePaymentIntentId = '';
let activePaymentClientSecret = '';
let activeSetupIntentId = '';
const selectedSeatByRide = new Map();

// ── Uber-style dark map theme ───────────────────────────────────
const UBER_MAP_STYLES = [
  { elementType: 'geometry',        stylers: [{ color: '#1a1a2e' }] },
  { elementType: 'labels.text.fill',stylers: [{ color: '#7a8fa6' }] },
  { elementType: 'labels.text.stroke',stylers:[{ color: '#0d1117' }] },
  { featureType: 'road',             elementType: 'geometry',       stylers: [{ color: '#2d2d44' }] },
  { featureType: 'road',             elementType: 'geometry.stroke', stylers: [{ color: '#1a1a2e' }] },
  { featureType: 'road.highway',     elementType: 'geometry',       stylers: [{ color: '#3a3a5c' }] },
  { featureType: 'road.highway',     elementType: 'geometry.stroke', stylers: [{ color: '#1a1a2e' }] },
  { featureType: 'water',            elementType: 'geometry',       stylers: [{ color: '#0f1923' }] },
  { featureType: 'water',            elementType: 'labels.text.fill',stylers:[{ color: '#3d5a73' }] },
  { featureType: 'poi',              elementType: 'geometry',       stylers: [{ color: '#1c1c30' }] },
  { featureType: 'poi.park',         elementType: 'geometry',       stylers: [{ color: '#1a2e1a' }] },
  { featureType: 'transit',          elementType: 'geometry',       stylers: [{ color: '#22223a' }] },
  { featureType: 'administrative',   elementType: 'geometry',       stylers: [{ color: '#2a2a40' }] },
  { featureType: 'landscape',        elementType: 'geometry',       stylers: [{ color: '#16162a' }] },
];

// Custom SVG marker icons
function makeOriginIcon() {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28">
    <circle cx="14" cy="14" r="10" fill="#3ecfcf" opacity="0.18"/>
    <circle cx="14" cy="14" r="6"  fill="#3ecfcf"/>
    <circle cx="14" cy="14" r="3"  fill="#0d1517"/>
  </svg>`;
  return { url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg), anchor: new google.maps.Point(14, 14) };
}
function makeDestinationIcon() {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="40" viewBox="0 0 32 40">
    <path d="M16 0C7.163 0 0 7.163 0 16c0 10 16 24 16 24S32 26 32 16C32 7.163 24.837 0 16 0z" fill="#4d9ef5"/>
    <circle cx="16" cy="16" r="7" fill="#fff"/>
    <circle cx="16" cy="16" r="4" fill="#4d9ef5"/>
  </svg>`;
  return { url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg), anchor: new google.maps.Point(16, 40) };
}
function makeCarIcon() {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 36 36">
    <circle cx="18" cy="18" r="17" fill="#1e2d30" stroke="#3ecfcf" stroke-width="1.5"/>
    <path d="M10 21l2-6h12l2 6H10z" fill="#3ecfcf"/>
    <rect x="11" y="21" width="14" height="5" rx="2" fill="#3ecfcf"/>
    <circle cx="13.5" cy="26.5" r="2" fill="#0d1517"/>
    <circle cx="22.5" cy="26.5" r="2" fill="#0d1517"/>
    <path d="M13 18h10" stroke="#0d1517" stroke-width="1.5" stroke-linecap="round"/>
  </svg>`;
  return { url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg), anchor: new google.maps.Point(18, 18) };
}
function makeLetterIcon(letter) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="30" height="38" viewBox="0 0 30 38">
    <path d="M15 0C6.716 0 0 6.716 0 15c0 9.375 15 23 15 23S30 24.375 30 15C30 6.716 23.284 0 15 0z" fill="#4d9ef5"/>
    <text x="15" y="20" font-family="sans-serif" font-size="13" font-weight="700" fill="#fff" text-anchor="middle">${letter}</text>
  </svg>`;
  return { url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg), anchor: new google.maps.Point(15, 38) };
}

// Small dot at each ride/request pickup location
function makeRideOriginDot() {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20">
    <circle cx="10" cy="10" r="8" fill="#a78bfa" opacity="0.22"/>
    <circle cx="10" cy="10" r="5" fill="#a78bfa"/>
    <circle cx="10" cy="10" r="2.5" fill="#0d1517"/>
  </svg>`;
  return { url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg), anchor: new google.maps.Point(10, 10) };
}


const originSearchInput = document.getElementById('origin-search');
const originMapDiv = document.getElementById('origin-map');
const destinationSearchInput = document.getElementById('destination-search');
const sameGenderOnlyRideCheckbox = document.getElementById('same-gender-only-ride');
const sameSchoolOnlyRideCheckbox = document.getElementById('same-school-only-ride');
const sameSchoolOnlyFilter = document.getElementById('same-school-only');
const sameGenderDriversOnlyFilter = document.getElementById('same-gender-drivers-only');
const browseSearchLabel = document.getElementById('browse-search-label');
const pickupLocationLabel = document.getElementById('pickup-location-label');
const pickupRadiusLabel = document.getElementById('pickup-radius-label');
const dropoffLocationLabel = document.getElementById('dropoff-location-label');
const dropoffRadiusLabel = document.getElementById('dropoff-radius-label');
const rideSearchInput = document.getElementById('ride-search');
const pickupRadiusLocationInput = document.getElementById('pickup-radius-location');
const pickupRadiusMilesInput = document.getElementById('pickup-radius-miles');
const dropoffRadiusLocationInput = document.getElementById('dropoff-radius-location');
const dropoffRadiusMilesInput = document.getElementById('dropoff-radius-miles');
const browseRadiusMapDiv = document.getElementById('browse-radius-map');
const browseMapHint = document.getElementById('browse-map-hint');
const browseMapPanel = document.getElementById('browse-map-panel');
const browseMapHintPanel = document.getElementById('browse-map-hint-panel');
const browseRiderLayout = document.getElementById('browse-rider-layout');
const rideFilterDateInput = document.getElementById('ride-filter-date');
const rideFilterSeatsInput = document.getElementById('ride-filter-seats');
const rideFilterMaxPriceInput = document.getElementById('ride-filter-max-price');
const rideSortSelect = document.getElementById('ride-sort');
const resetRideFiltersButton = document.getElementById('reset-ride-filters');
const driverSeatLayout = document.getElementById('driver-seat-layout');
const selectedSeatCount = document.getElementById('selected-seat-count');
const vehicleSeatCountSelect = document.getElementById('vehicle-seat-count');
const rideProviderTypeSelect = document.getElementById('ride-provider-type');
const rideProviderStep = document.getElementById('ride-provider-step');
const rideProviderChoices = document.querySelectorAll('.ride-provider-choice');
const rideProviderSummaryText = document.getElementById('ride-provider-summary-text');
const changeRideProviderButton = document.getElementById('change-ride-provider');
const personalCarFields = document.getElementById('personal-car-fields');
const personalSeatSelection = document.getElementById('personal-seat-selection');
const vehicleLayoutField = document.getElementById('vehicle-layout-field');
const rideshareServiceFields = document.getElementById('rideshare-service-fields');
const rideshareServiceSelect = document.getElementById('rideshare-service');
const rideshareSeatCountInput = document.getElementById('rideshare-seat-count');
const offerPickupRadiusInput = document.getElementById('offer-pickup-radius');
const offerDropoffRadiusInput = document.getElementById('offer-dropoff-radius');
const requestPickupRadiusInput = document.getElementById('request-pickup-radius');
const requestDropoffRadiusInput = document.getElementById('request-dropoff-radius');
const CAR_SEATS = [
  { id: 'driver', label: 'Driver', role: 'Driver' },
  { id: 'front_passenger', label: 'Passenger' },
  { id: 'back_left', label: 'Back Left' },
  { id: 'back_middle', label: 'Back Middle' },
  { id: 'back_right', label: 'Back Right' },
  { id: 'third_left', label: 'Third Row Left' },
  { id: 'third_right', label: 'Third Row Right' },
];
const VEHICLE_SEAT_LAYOUTS = {
  2: ['front_passenger'],
  4: ['front_passenger', 'back_left', 'back_right'],
  5: ['front_passenger', 'back_left', 'back_middle', 'back_right'],
  6: ['front_passenger', 'back_left', 'back_right', 'third_left', 'third_right'],
  7: ['front_passenger', 'back_left', 'back_middle', 'back_right', 'third_left', 'third_right'],
};

const KNOWN_LOCATION_ALIASES = new Map([
  ['ucla', { name: 'University of California, Los Angeles', lat: 34.06892, lng: -118.44518 }],
  ['uc los angeles', { name: 'University of California, Los Angeles', lat: 34.06892, lng: -118.44518 }],
  ['university of california los angeles', { name: 'University of California, Los Angeles', lat: 34.06892, lng: -118.44518 }],
  ['uci', { name: 'University of California, Irvine', lat: 33.64050, lng: -117.84430 }],
  ['uc irvine', { name: 'University of California, Irvine', lat: 33.64050, lng: -117.84430 }],
  ['university of california irvine', { name: 'University of California, Irvine', lat: 33.64050, lng: -117.84430 }],
]);

const LOCATION_REGIONS = {
  CA: { state: 'CA', minLat: 32.45, maxLat: 42.1, minLng: -124.6, maxLng: -114.0 },
  ON: { state: 'ON', minLat: 41.6, maxLat: 56.9, minLng: -95.2, maxLng: -74.3 },
};

const UNIVERSITY_LOCATION_REGIONS = {
  'berkeley.edu': LOCATION_REGIONS.CA,
  'ucla.edu': LOCATION_REGIONS.CA,
  'uci.edu': LOCATION_REGIONS.CA,
  'ivc.edu': LOCATION_REGIONS.CA,
  'saddleback.edu': LOCATION_REGIONS.CA,
  'ucsd.edu': LOCATION_REGIONS.CA,
  'ucdavis.edu': LOCATION_REGIONS.CA,
  'ucsb.edu': LOCATION_REGIONS.CA,
  'ucsc.edu': LOCATION_REGIONS.CA,
  'ucr.edu': LOCATION_REGIONS.CA,
  'ucmerced.edu': LOCATION_REGIONS.CA,
  'usc.edu': LOCATION_REGIONS.CA,
  'stanford.edu': LOCATION_REGIONS.CA,
  'caltech.edu': LOCATION_REGIONS.CA,
  'uwaterloo.ca': LOCATION_REGIONS.ON,
};

const LIVE_TRACKING_POLL_MS = 5000;

let _googleMapsPromise = null;

async function loadGoogleMapsAPI() {
  if (window.google?.maps) return;
  if (_googleMapsPromise) return _googleMapsPromise;
  _googleMapsPromise = (async () => {
    try {
      const response = await fetch('/api/config/google-maps-key');
      if (!response.ok) throw new Error('Failed to fetch Maps key: ' + response.status);
      const config = await response.json();
      if (!config.apiKey) throw new Error('No API key returned');
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${config.apiKey}&libraries=places`;
      document.head.appendChild(script);
      await new Promise((resolve, reject) => {
        script.onload = resolve;
        script.onerror = () => reject(new Error('Google Maps script failed to load'));
      });
    } catch (error) {
      _googleMapsPromise = null;
      console.error('Failed to load Google Maps API:', error);
      throw error;
    }
  })();
  return _googleMapsPromise;
}

function initializeOriginMap() {
  const center = { lat: 34.069, lng: -118.445 };
  originMap = new google.maps.Map(originMapDiv, {
    zoom: 13,
    center,
    styles: UBER_MAP_STYLES,
    disableDefaultUI: false,
    zoomControl: true,
    mapTypeControl: false,
    streetViewControl: false,
    fullscreenControl: false,
  });
  originMarker = new google.maps.Marker({ map: originMap, position: center, icon: makeOriginIcon() });
  originSearchInput?.addEventListener('input', () => clearOfferLocationCoordinates('origin'));
  wireTypedLocationLookup(originSearchInput, (result) => updateOriginLocation(result.name, result.lat, result.lng));
  originAutocomplete = new google.maps.places.Autocomplete(originSearchInput, { componentRestrictions: { country: 'us' } });
  originAutocomplete.addListener('place_changed', () => {
    const place = originAutocomplete.getPlace();
    if (place.geometry) updateOriginLocation(place.name || originSearchInput.value, place.geometry.location.lat(), place.geometry.location.lng());
  });
}

function getLocationAliasKey(value) {
  return String(value || '').trim().toLowerCase().replace(/&/g, ' and ').replace(/[^a-z0-9]+/g, ' ').replace(/\s+/g, ' ').trim();
}

function getKnownLocationAlias(value) {
  return KNOWN_LOCATION_ALIASES.get(getLocationAliasKey(value)) || null;
}

function getSouthernCaliforniaBounds() {
  if (!window.google?.maps?.LatLngBounds) return null;
  return new google.maps.LatLngBounds(
    new google.maps.LatLng(32.45, -119.10),
    new google.maps.LatLng(34.55, -116.55)
  );
}

function getActiveLocationRegion() {
  return UNIVERSITY_LOCATION_REGIONS[String(currentUser?.universityDomain || '').toLowerCase()] || LOCATION_REGIONS.CA;
}

function isCoordinateInRegion(location, region) {
  if (!location || !region) return false;
  const lat = Number(location.lat);
  const lng = Number(location.lng);
  return Number.isFinite(lat)
    && Number.isFinite(lng)
    && lat >= region.minLat
    && lat <= region.maxLat
    && lng >= region.minLng
    && lng <= region.maxLng;
}

function getResultState(result) {
  const state = (result.address_components || []).find((part) => part.types?.includes('administrative_area_level_1'));
  return state?.short_name || '';
}

function queryHasExplicitRegion(query) {
  return /,\s*[A-Z]{2}\b/i.test(query) || /\b(?:california|ca|colorado|co|ontario|on|arizona|az|nevada|nv|oregon|or|washington|wa)\b/i.test(query);
}

function normalizeGeocodeResult(result, fallbackName) {
  const location = result.geometry.location;
  return {
    name: result.formatted_address || fallbackName,
    lat: location.lat(),
    lng: location.lng(),
  };
}

function chooseGeocodeResult(query, results) {
  if (!results?.length) return null;
  const region = getActiveLocationRegion();
  const regionalResult = results.find((result) => {
    if (!result.geometry?.location) return false;
    const candidate = {
      lat: result.geometry.location.lat(),
      lng: result.geometry.location.lng(),
    };
    return getResultState(result) === region.state || isCoordinateInRegion(candidate, region);
  });
  if (regionalResult) return normalizeGeocodeResult(regionalResult, query);
  if (queryHasExplicitRegion(query)) return normalizeGeocodeResult(results[0], query);
  return null;
}

function initializeDestinationMap() {
  destinationSearchInput?.addEventListener('input', () => clearOfferLocationCoordinates('destination'));
  wireTypedLocationLookup(destinationSearchInput, (result) => updateDestinationLocation(result.name, result.lat, result.lng));
  destinationAutocomplete = new google.maps.places.Autocomplete(destinationSearchInput, { componentRestrictions: { country: 'us' } });
  destinationAutocomplete.addListener('place_changed', () => {
    const place = destinationAutocomplete.getPlace();
    if (place.geometry) updateDestinationLocation(place.name || destinationSearchInput.value, place.geometry.location.lat(), place.geometry.location.lng());
  });
}


function getLatLngFromInputs(latId, lngId) {
  const latValue = document.getElementById(latId)?.value;
  const lngValue = document.getElementById(lngId)?.value;
  if (latValue === undefined || lngValue === undefined || latValue === '' || lngValue === '') return null;
  const lat = Number(latValue);
  const lng = Number(lngValue);
  return Number.isFinite(lat) && Number.isFinite(lng) ? { lat, lng } : null;
}

function clearMapRoute(rendererRef, lineRef) {
  if (lineRef.current) lineRef.current.setMap(null);
  lineRef.current = null;
  if (rendererRef.current) rendererRef.current.setMap(null);
  rendererRef.current = null;
}

function drawRouteOnMap(map, origin, destination, rendererRef, lineRef) {
  clearMapRoute(rendererRef, lineRef);
  if (!map || !origin || !destination || !window.google?.maps) return;
  if (google.maps.DirectionsService && google.maps.DirectionsRenderer) {
    const service = new google.maps.DirectionsService();
    rendererRef.current = new google.maps.DirectionsRenderer({
      map,
      suppressMarkers: true,
      preserveViewport: true,
      polylineOptions: { strokeColor: '#67d7d9', strokeOpacity: 0.95, strokeWeight: 5 },
    });
    service.route({ origin, destination, travelMode: google.maps.TravelMode.DRIVING }, (result, status) => {
      if (status === 'OK') {
        rendererRef.current.setDirections(result);
      } else {
        lineRef.current = new google.maps.Polyline({ map, path: [origin, destination], strokeColor: '#67d7d9', strokeOpacity: 0.9, strokeWeight: 4 });
      }
    });
  } else {
    lineRef.current = new google.maps.Polyline({ map, path: [origin, destination], strokeColor: '#67d7d9', strokeOpacity: 0.9, strokeWeight: 4 });
  }
}

function fitRouteBounds(map, origin, destination, circles = []) {
  if (!map || !origin || !destination || !window.google?.maps) return;
  const bounds = new google.maps.LatLngBounds();
  bounds.extend(origin);
  bounds.extend(destination);
  circles.forEach((circle) => {
    const circleBounds = circle?.getBounds?.();
    if (circleBounds) bounds.union(circleBounds);
  });
  map.fitBounds(bounds);
}

function getRadiusInputMiles(input) {
  const miles = Number(input?.value);
  return Number.isFinite(miles) && miles > 0 ? miles : 0;
}

function drawMapFlexCircle(existingCircle, map, center, miles, color) {
  if (!map || !center || !(miles > 0) || !window.google?.maps) {
    if (existingCircle) existingCircle.setMap(null);
    return null;
  }
  const options = {
    map,
    center,
    radius: milesToMeters(miles),
    fillColor: color,
    fillOpacity: 0.12,
    strokeColor: color,
    strokeOpacity: 0.85,
    strokeWeight: 2,
  };
  if (existingCircle) {
    existingCircle.setOptions(options);
    return existingCircle;
  }
  return new google.maps.Circle(options);
}

function updateOfferRouteMap() {
  const origin = getLatLngFromInputs('origin-lat', 'origin-lng');
  const destination = getLatLngFromInputs('destination-lat', 'destination-lng');
  drawRouteOnMap(originMap, origin, destination, { get current() { return offerRouteRenderer; }, set current(value) { offerRouteRenderer = value; } }, { get current() { return offerRouteLine; }, set current(value) { offerRouteLine = value; } });
  offerPickupRadiusCircle = drawMapFlexCircle(offerPickupRadiusCircle, originMap, origin, getRadiusInputMiles(offerPickupRadiusInput), '#3ecfcf');
  offerDropoffRadiusCircle = drawMapFlexCircle(offerDropoffRadiusCircle, originMap, destination, getRadiusInputMiles(offerDropoffRadiusInput), '#4d9ef5');
  fitRouteBounds(originMap, origin, destination, [offerPickupRadiusCircle, offerDropoffRadiusCircle]);
}

function updateRequestRouteMap() {
  const origin = getLatLngFromInputs('request-origin-lat', 'request-origin-lng');
  const destination = getLatLngFromInputs('request-destination-lat', 'request-destination-lng');
  drawRouteOnMap(requestOriginMap, origin, destination, { get current() { return requestRouteRenderer; }, set current(value) { requestRouteRenderer = value; } }, { get current() { return requestRouteLine; }, set current(value) { requestRouteLine = value; } });
  requestPickupRadiusCircle = drawMapFlexCircle(requestPickupRadiusCircle, requestOriginMap, origin, getRadiusInputMiles(requestPickupRadiusInput), '#3ecfcf');
  requestDropoffRadiusCircle = drawMapFlexCircle(requestDropoffRadiusCircle, requestOriginMap, destination, getRadiusInputMiles(requestDropoffRadiusInput), '#4d9ef5');
  fitRouteBounds(requestOriginMap, origin, destination, [requestPickupRadiusCircle, requestDropoffRadiusCircle]);
}

function updateOriginLocation(name, lat, lng) {
  document.getElementById('origin').value = name;
  document.getElementById('origin-lat').value = lat;
  document.getElementById('origin-lng').value = lng;
  document.getElementById('origin-selected').textContent = `Selected: ${name}`;
  document.getElementById('origin-selected').classList.add('active');
  if (originMap && originMarker) {
    const position = { lat, lng };
    originMarker.setLabel('P');
    originMarker.setTitle('Pick-up');
    originMarker.setPosition(position);
    originMap.setCenter(position);
    updateOfferRouteMap();
  }
}

function updateRequestOriginLocation(name, lat, lng) {
  document.getElementById('request-origin').value = name;
  document.getElementById('request-origin-lat').value = lat;
  document.getElementById('request-origin-lng').value = lng;
  const selected = document.getElementById('request-origin-selected');
  if (selected) {
    selected.textContent = 'Selected: ' + name + ' (' + Number(lat).toFixed(5) + ', ' + Number(lng).toFixed(5) + ')';
    selected.classList.add('active');
  }
  if (requestOriginMap && requestOriginMarker) {
    const position = { lat: Number(lat), lng: Number(lng) };
    requestOriginMarker.setLabel('P');
    requestOriginMarker.setTitle('Pick-up');
    requestOriginMarker.setPosition(position);
    requestOriginMap.setCenter(position);
    updateRequestRouteMap();
  }
}

function updateRequestDestinationLocation(name, lat, lng) {
  document.getElementById('request-destination').value = name;
  document.getElementById('request-destination-lat').value = lat;
  document.getElementById('request-destination-lng').value = lng;
  const selected = document.getElementById('request-destination-selected');
  if (selected) {
    selected.textContent = 'Selected: ' + name + ' (' + Number(lat).toFixed(5) + ', ' + Number(lng).toFixed(5) + ')';
    selected.classList.add('active');
  }
  const position = { lat: Number(lat), lng: Number(lng) };
  if (requestOriginMap) {
    if (!requestDestinationMarker) requestDestinationMarker = new google.maps.Marker({ map: requestOriginMap, icon: makeDestinationIcon(), title: 'Drop-off' });
    requestDestinationMarker.setMap(requestOriginMap);
    requestDestinationMarker.setPosition(position);
    requestOriginMap.setCenter(position);
    updateRequestRouteMap();
  }
}

function setRadiusLocation(input, place) {
  if (!input || !place?.geometry) return;
  input.value = place.name || input.value;
  input.dataset.lat = String(place.geometry.location.lat());
  input.dataset.lng = String(place.geometry.location.lng());
  refreshActiveBrowse();
}

function initializeRadiusAutocomplete() {
  if (!window.google?.maps?.places) return;
  if (pickupRadiusLocationInput && !pickupRadiusAutocomplete) {
    wireTypedLocationLookup(pickupRadiusLocationInput, (result) => setRadiusLocationFromGeocode(pickupRadiusLocationInput, result));
    pickupRadiusAutocomplete = new google.maps.places.Autocomplete(pickupRadiusLocationInput, { componentRestrictions: { country: 'us' } });
    pickupRadiusAutocomplete.addListener('place_changed', () => setRadiusLocation(pickupRadiusLocationInput, pickupRadiusAutocomplete.getPlace()));
  }
  if (dropoffRadiusLocationInput && !dropoffRadiusAutocomplete) {
    wireTypedLocationLookup(dropoffRadiusLocationInput, (result) => setRadiusLocationFromGeocode(dropoffRadiusLocationInput, result));
    dropoffRadiusAutocomplete = new google.maps.places.Autocomplete(dropoffRadiusLocationInput, { componentRestrictions: { country: 'us' } });
    dropoffRadiusAutocomplete.addListener('place_changed', () => setRadiusLocation(dropoffRadiusLocationInput, dropoffRadiusAutocomplete.getPlace()));
  }
}

function clearRequestLocationCoordinates(kind) {
  document.getElementById('request-' + kind + '-lat').value = '';
  document.getElementById('request-' + kind + '-lng').value = '';
  const selected = document.getElementById('request-' + kind + '-selected');
  if (selected) {
    selected.textContent = '';
    selected.classList.remove('active');
  }
}

function geocodeAddress(address) {
  return new Promise((resolve) => {
    const knownLocation = getKnownLocationAlias(address);
    if (knownLocation) {
      resolve(knownLocation);
      return;
    }
    if (!address || !window.google?.maps?.Geocoder) {
      resolve(null);
      return;
    }
    const geocoder = new google.maps.Geocoder();
    const request = {
      address,
      bounds: getSouthernCaliforniaBounds(),
      componentRestrictions: { country: 'US' },
      region: 'US',
    };
    geocoder.geocode(request, (results, status) => {
      if (status !== 'OK' || !results?.[0]?.geometry) {
        resolve(null);
        return;
      }
      resolve(chooseGeocodeResult(address, results));
    });
  });
}

function showLocationLookupError(input, message) {
  const id = input?.id || '';
  const selectedId = {
    'origin-search': 'origin-selected',
    'destination-search': 'destination-selected',
    'request-origin': 'request-origin-selected',
    'request-destination': 'request-destination-selected',
  }[id];
  const selected = document.getElementById(selectedId);
  if (selected) {
    selected.textContent = message;
    selected.classList.add('active');
  }
}

async function lookupTypedLocation(input, onResolved) {
  const query = input?.value?.trim();
  if (!query) return null;
  await loadGoogleMapsAPI();
  const result = await geocodeAddress(query);
  if (result) {
    onResolved(result);
  } else {
    showLocationLookupError(input, 'Location not found. Try a more specific address from the suggestions.');
  }
  return result;
}

function wireTypedLocationLookup(input, onResolved) {
  if (!input || input.dataset.lookupWired === 'true') return;
  input.dataset.lookupWired = 'true';
  const lookup = () => lookupTypedLocation(input, onResolved);
  input.addEventListener('keydown', (event) => {
    if (event.key !== 'Enter') return;
    event.preventDefault();
    lookup();
  });
  input.addEventListener('blur', () => lookup());
}

function clearOfferLocationCoordinates(kind) {
  const lat = document.getElementById(kind + '-lat');
  const lng = document.getElementById(kind + '-lng');
  const hidden = document.getElementById(kind);
  const selected = document.getElementById(kind + '-selected');
  if (lat) lat.value = '';
  if (lng) lng.value = '';
  if (hidden) hidden.value = '';
  if (selected) {
    selected.textContent = '';
    selected.classList.remove('active');
  }
}

function setRadiusLocationFromGeocode(input, result) {
  if (!input || !result) return;
  input.value = result.name;
  input.dataset.lat = String(result.lat);
  input.dataset.lng = String(result.lng);
  refreshActiveBrowse();
}

async function ensureRequestCoordinates() {
  await loadGoogleMapsAPI();
  initializeRequestAutocomplete();
  const originInput = document.getElementById('request-origin');
  const destinationInput = document.getElementById('request-destination');

  if (!document.getElementById('request-origin-lat').value || !document.getElementById('request-origin-lng').value) {
    const origin = await geocodeAddress(originInput.value.trim());
    if (origin) updateRequestOriginLocation(origin.name, origin.lat, origin.lng);
  }

  if (!document.getElementById('request-destination-lat').value || !document.getElementById('request-destination-lng').value) {
    const destination = await geocodeAddress(destinationInput.value.trim());
    if (destination) updateRequestDestinationLocation(destination.name, destination.lat, destination.lng);
  }
}

function initializeRequestMaps() {
  if (!window.google?.maps) return;
  const center = { lat: 34.069, lng: -118.445 };
  const requestOriginMapDiv = document.getElementById('request-origin-map');
  if (requestOriginMapDiv && !requestOriginMap) {
    requestOriginMap = new google.maps.Map(requestOriginMapDiv, {
      zoom: 13, center,
      styles: UBER_MAP_STYLES,
      mapTypeControl: false, streetViewControl: false, fullscreenControl: false,
    });
    requestOriginMarker = new google.maps.Marker({ map: requestOriginMap, position: center, icon: makeOriginIcon(), title: 'Pick-up' });
  }
}

function initializeRequestAutocomplete() {
  if (!window.google?.maps?.places) return;
  initializeRequestMaps();
  const requestOriginInput = document.getElementById('request-origin');
  const requestDestinationInput = document.getElementById('request-destination');
  requestOriginInput?.addEventListener('input', () => clearRequestLocationCoordinates('origin'));
  requestDestinationInput?.addEventListener('input', () => clearRequestLocationCoordinates('destination'));
  wireTypedLocationLookup(requestOriginInput, (result) => updateRequestOriginLocation(result.name, result.lat, result.lng));
  wireTypedLocationLookup(requestDestinationInput, (result) => updateRequestDestinationLocation(result.name, result.lat, result.lng));
  if (requestOriginInput && !requestOriginAutocomplete) {
    requestOriginAutocomplete = new google.maps.places.Autocomplete(requestOriginInput, { componentRestrictions: { country: 'us' } });
    requestOriginAutocomplete.addListener('place_changed', () => {
      const place = requestOriginAutocomplete.getPlace();
      if (place.geometry) updateRequestOriginLocation(place.name || requestOriginInput.value, place.geometry.location.lat(), place.geometry.location.lng());
    });
  }
  if (requestDestinationInput && !requestDestinationAutocomplete) {
    requestDestinationAutocomplete = new google.maps.places.Autocomplete(requestDestinationInput, { componentRestrictions: { country: 'us' } });
    requestDestinationAutocomplete.addListener('place_changed', () => {
      const place = requestDestinationAutocomplete.getPlace();
      if (place.geometry) updateRequestDestinationLocation(place.name || requestDestinationInput.value, place.geometry.location.lat(), place.geometry.location.lng());
    });
  }
}

function updateDestinationLocation(name, lat, lng) {
  document.getElementById('destination').value = name;
  document.getElementById('destination-lat').value = lat;
  document.getElementById('destination-lng').value = lng;
  document.getElementById('destination-selected').textContent = `Selected: ${name}`;
  document.getElementById('destination-selected').classList.add('active');
  const position = { lat: Number(lat), lng: Number(lng) };
  if (originMap) {
    if (!destinationMarker) destinationMarker = new google.maps.Marker({ map: originMap, icon: makeDestinationIcon(), title: 'Drop-off' });
    destinationMarker.setMap(originMap);
    destinationMarker.setPosition(position);
    originMap.setCenter(position);
    updateOfferRouteMap();
  }
}

function validatePasswordRequirements(password) {
  const hasMinimumLength = String(password || '').length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
  document.getElementById('req-length').classList.toggle('met', hasMinimumLength);
  document.getElementById('req-uppercase').classList.toggle('met', hasUppercase);
  document.getElementById('req-lowercase').classList.toggle('met', hasLowercase);
  document.getElementById('req-number').classList.toggle('met', hasNumber);
  document.getElementById('req-special').classList.toggle('met', hasSpecialChar);
  return hasMinimumLength && hasUppercase && hasLowercase && hasNumber && hasSpecialChar;
}

async function fetchJson(url, options = {}) {
  const res = await fetch(url, options);
  const contentType = res.headers.get('content-type') || '';
  let data;
  if (contentType.includes('application/json')) {
    data = await res.json();
  } else {
    const text = await res.text();
    const error = new Error(text.trim().startsWith('<')
      ? 'Server returned a webpage instead of API data. The running server may be missing this route or needs to be updated.'
      : text || 'Server returned an unexpected response.');
    error.status = res.status;
    error.responseText = text;
    throw error;
  }
  if (!res.ok) {
    const error = new Error(data.error || 'Request failed');
    Object.assign(error, data);
    if (data.code === 'POLICY_CONSENT_REQUIRED' && currentUser) {
      currentUser = {
        ...currentUser,
        requiresPolicyConsent: true,
        requiredTermsVersion: data.requiredTermsVersion || currentUser.requiredTermsVersion,
        requiredPrivacyVersion: data.requiredPrivacyVersion || currentUser.requiredPrivacyVersion,
      };
      showPolicyConsentRequired();
    }
    if (data.code === 'REQUIRED_SETTINGS_INCOMPLETE' && currentUser) {
      currentUser = {
        ...currentUser,
        requiresRequiredSettings: true,
        missingRequiredSettings: data.missingRequiredSettings || currentUser.missingRequiredSettings || [],
      };
      showRequiredSettingsRequired();
    }
    throw error;
  }
  return data;
}

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, (char) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  }[char]));
}

function renderInlineMarkdown(value) {
  return escapeHtml(value)
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
}

async function loadHtmlFragment(file, target, sourceId) {
  if (!target) return;
  try {
    const response = await fetch(file);
    if (!response.ok) throw new Error('Failed to load ' + file);
    const html = await response.text();
    const doc = new DOMParser().parseFromString(html, 'text/html');
    const source = doc.getElementById(sourceId) || doc.body;
    target.innerHTML = source.innerHTML;
  } catch (error) {
    target.innerHTML = '<p class="error-message show">Unable to load document. Please try again later.</p>';
    console.error('Document load error:', error);
  }
}

function renderDocumentMarkdown(markdown, target) {
  if (!target) return;
  target.replaceChildren();
  let currentList = null;

  const appendBlock = (element) => {
    target.appendChild(element);
    currentList = null;
  };

  markdown.split(/\r?\n/).forEach((rawLine) => {
    const line = rawLine.trim();
    if (!line || line === '---') {
      currentList = null;
      return;
    }
    if (line.startsWith('# ')) {
      const heading = document.createElement('h3');
      heading.innerHTML = renderInlineMarkdown(line.replace(/^#\s+/, ''));
      appendBlock(heading);
      return;
    }
    if (line.startsWith('## ')) {
      const heading = document.createElement('h4');
      heading.innerHTML = renderInlineMarkdown(line.replace(/^##\s+/, ''));
      appendBlock(heading);
      return;
    }
    if (line.startsWith('### ')) {
      const heading = document.createElement('h5');
      heading.innerHTML = renderInlineMarkdown(line.replace(/^###\s+/, ''));
      appendBlock(heading);
      return;
    }
    if (line.startsWith('- ')) {
      if (!currentList) {
        currentList = document.createElement('ul');
        target.appendChild(currentList);
      }
      const item = document.createElement('li');
      item.innerHTML = renderInlineMarkdown(line.replace(/^-\s+/, ''));
      currentList.appendChild(item);
      return;
    }
    const paragraph = document.createElement('p');
    paragraph.innerHTML = renderInlineMarkdown(line);
    appendBlock(paragraph);
  });
}

async function loadMarkdownDocument(file, target) {
  if (!target) return;
  try {
    const response = await fetch(file);
    if (!response.ok) throw new Error('Failed to load ' + file);
    renderDocumentMarkdown(await response.text(), target);
  } catch (error) {
    target.innerHTML = '<p class="error-message show">Unable to load document. Please try again later.</p>';
    console.error('Document load error:', error);
  }
}

function renderReleaseNotesMarkdown(markdown, target) {
  if (!target) return;
  target.replaceChildren();
  let currentSection = null;
  let currentFeatures = null;
  let currentList = null;

  const ensureSection = () => {
    if (!currentSection) {
      currentSection = document.createElement('section');
      currentSection.className = 'release-note-entry';
      currentFeatures = document.createElement('div');
      currentFeatures.className = 'release-note-features';
      currentSection.appendChild(currentFeatures);
      target.appendChild(currentSection);
    }
    return currentFeatures;
  };

  markdown.split(/\r?\n/).forEach((rawLine) => {
    const line = rawLine.trim();
    if (!line || line === '---') {
      currentList = null;
      return;
    }
    if (line.startsWith('# ')) {
      currentList = null;
      return;
    }
    if (line.startsWith('## ')) {
      currentSection = document.createElement('section');
      currentSection.className = 'release-note-entry';
      const version = document.createElement('div');
      version.className = 'release-note-version';
      version.textContent = line.replace(/^##\s+/, '');
      currentFeatures = document.createElement('div');
      currentFeatures.className = 'release-note-features';
      currentSection.append(version, currentFeatures);
      target.appendChild(currentSection);
      currentList = null;
      return;
    }
    if (line.startsWith('### ')) {
      const heading = document.createElement('h4');
      heading.textContent = line.replace(/^###\s+/, '');
      ensureSection().appendChild(heading);
      currentList = null;
      return;
    }
    if (line.startsWith('- ')) {
      if (!currentList) {
        currentList = document.createElement('ul');
        ensureSection().appendChild(currentList);
      }
      const item = document.createElement('li');
      item.innerHTML = renderInlineMarkdown(line.replace(/^-\s+/, ''));
      currentList.appendChild(item);
      return;
    }
    const paragraph = document.createElement('p');
    paragraph.innerHTML = renderInlineMarkdown(line);
    ensureSection().appendChild(paragraph);
    currentList = null;
  });
}

async function loadReleaseNotes() {
  if (!releaseNoteFeed) return;
  try {
    const response = await fetch('release-notes.md');
    if (!response.ok) throw new Error('Failed to load release-notes.md');
    renderReleaseNotesMarkdown(await response.text(), releaseNoteFeed);
  } catch (error) {
    releaseNoteFeed.innerHTML = '<p class="error-message show">Unable to load release notes. Please try again later.</p>';
    console.error('Release notes load error:', error);
  }
}

function loadExternalDocuments() {
  loadMarkdownDocument('privacy-notice.md', privacyContent);
  loadMarkdownDocument('terms-and-conditions.md', termsContent);
  loadReleaseNotes();
}

async function openLegalModal(type) {
  const isPrivacy = type === 'privacy';
  const file = isPrivacy ? 'privacy-notice.md' : 'terms-and-conditions.md';
  const existingContent = isPrivacy ? privacyContent : termsContent;
  legalModalTitle.textContent = isPrivacy ? 'Privacy Notice' : 'Terms and Conditions';
  legalModalContent.innerHTML = existingContent?.innerHTML || '<p class="legal-loading">Loading document...</p>';
  legalModal.classList.remove('hidden');
  document.body.classList.add('modal-open');
  legalModalContent.scrollTop = 0;
  if (!existingContent || existingContent.querySelector('.legal-loading')) {
    await loadMarkdownDocument(file, legalModalContent);
  }
  legalModal.querySelector('.legal-modal-close')?.focus();
}

function closeLegalModal() {
  legalModal.classList.add('hidden');
  document.body.classList.remove('modal-open');
}

async function checkAuth() {
  try {
    currentUser = await fetchJson('/api/auth/me');
    showDashboard(currentUser);
  } catch (error) {
    const route = getAppRoute();
    if (route === 'privacy' || route === 'terms') showLegalPage(route);
    else showAuthSection();
  }
}

function hideLegalPages() {
  privacyPage.classList.add('hidden');
  termsPage.classList.add('hidden');
}

function showLegalPage(pageName) {
  if (!isRestoringRoute) {
    const currentRoute = getAppRoute();
    if (currentRoute && !isLegalRoute(currentRoute)) {
      legalReturnRoute = currentRoute;
    } else if (!legalReturnRoute && browseRole) {
      legalReturnRoute = 'browse-' + browseRole;
    }
  }
  setAppRoute(pageName);
  authSection.classList.add('hidden');
  dashboard.classList.add('hidden');
  sharedTrackPage.classList.add('hidden');
  hideLegalPages();
  document.body.classList.remove('dashboard-mode');
  headerLeftActions.classList.add('hidden');
  headerActions.classList.add('hidden');
  if (pageName === 'privacy') privacyPage.classList.remove('hidden');
  if (pageName === 'terms') termsPage.classList.remove('hidden');
}

function showAuthSection() {
  hideLegalPages();
  sharedTrackPage.classList.add('hidden');
  siteLogo.src = 'assets/images/LinkUp-header.png';
  siteLogo.alt = 'LinkUp - Ride Connect Save';
  siteLogo.removeAttribute('role');
  siteLogo.removeAttribute('aria-label');
  siteLogo.removeAttribute('tabindex');
  document.body.classList.remove('dashboard-mode');
  headerLeftActions.classList.add('hidden');
  headerActions.classList.add('hidden');
  authSection.classList.remove('hidden');
  dashboard.classList.add('hidden');
  dashboardHome?.classList.remove('hidden');
  waitlistPage?.classList.add('hidden');
  cartPage?.classList.add('hidden');
  paymentPage?.classList.add('hidden');
  listRidePage?.classList.add('hidden');
  trackTripPage?.classList.add('hidden');
  sharedTrackPage?.classList.add('hidden');
  cartRideIds = new Set();
  currentUser = null;
}

function showDashboardShell(user = currentUser) {
  if (!user) return;
  hideLegalPages();
  sharedTrackPage.classList.add('hidden');
  siteLogo.src = 'assets/images/LinkUp-wordmark.png';
  siteLogo.alt = 'LinkUp';
  siteLogo.setAttribute('role', 'button');
  siteLogo.setAttribute('aria-label', 'Go to home');
  siteLogo.tabIndex = 0;
  document.body.classList.add('dashboard-mode');
  headerLeftActions.classList.remove('hidden');
  headerActions.classList.remove('hidden');
  authSection.classList.add('hidden');
  dashboard.classList.remove('hidden');
  updateUserHeader(user);
}

function showAuthForm(formId) {
  tabButtons.forEach((button) => button.classList.remove('active'));
  tabContents.forEach((content) => content.classList.remove('active'));
  const form = document.getElementById(formId);
  if (form) form.classList.add('active');
  const tabName = formId.replace('-form', '');
  const matchingTab = document.querySelector('[data-tab="' + tabName + '"]');
  if (matchingTab) matchingTab.classList.add('active');
}

function clearRecoveryMessages() {
  [recoveryMessage, recoveryError, resetMessage, resetError, verificationMessage, verificationError].forEach((element) => {
    element.textContent = '';
    element.classList.remove('show');
  });
}

function showVerificationForm(email, message) {
  pendingVerificationEmail = email;
  clearRecoveryMessages();
  verificationForm.reset();
  verificationEmailLabel.textContent = `Enter the 6-digit code sent to ${email}.`;
  if (message) {
    verificationMessage.textContent = message;
    verificationMessage.classList.add('show');
  }
  showAuthForm('verification-form');
}

function getDisplayName(user) {
  if (user.firstName) return user.firstName;
  if (user.name) return user.name.split(' ')[0];
  return 'there';
}

function playRideTransition() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return Promise.resolve();
  }
  rideTransition.classList.remove('hidden');
  rideTransition.classList.remove('leaving');
  rideTransition.setAttribute('aria-hidden', 'false');
  return new Promise((resolve) => {
    window.setTimeout(() => {
      rideTransition.classList.add('leaving');
      window.setTimeout(() => {
        rideTransition.classList.add('hidden');
        rideTransition.classList.remove('leaving');
        rideTransition.setAttribute('aria-hidden', 'true');
        resolve();
      }, 260);
    }, 1050);
  });
}

function clearRequestRideMessages() {
  requestRideMessage.textContent = '';
  requestRideMessage.classList.remove('show');
  requestRideError.textContent = '';
  requestRideError.classList.remove('show');
}

function clearCartMessages() {
  cartMessage.textContent = '';
  cartMessage.classList.remove('show');
  cartError.textContent = '';
  cartError.classList.remove('show');
  paymentMessage.textContent = '';
  paymentMessage.classList.remove('show');
  paymentError.textContent = '';
  paymentError.classList.remove('show');
}

function clearTrackingMessages() {
  trackingMessage.textContent = '';
  trackingMessage.classList.remove('show');
  trackingError.textContent = '';
  trackingError.classList.remove('show');
}

function hideDashboardPages() {
  hideLegalPages();
  dashboardHome.classList.add('hidden');
  waitlistPage.classList.add('hidden');
  requestRidePage.classList.add('hidden');
  listRidePage.classList.add('hidden');
  cartPage.classList.add('hidden');
  yourRidesPage.classList.add('hidden');
  chatPage.classList.add('hidden');
  paymentPage.classList.add('hidden');
  leaderboardPage.classList.add('hidden');
  publicProfilePage.classList.add('hidden');
  profilePage.classList.add('hidden');
  trackTripPage.classList.add('hidden');
}


function updateUserHeader(user) {
  welcomeMessage.textContent = `Welcome, ${getDisplayName(user)}`;
  studentUniversityLabel.textContent = user.rideServicesPaused
    ? 'Ride services temporarily paused'
    : user.serviceApproved ? `${user.university} Ride Network` : `${user.university || user.universityDomain} Waitlist`;
}

function clearProfileMessages() {
  profileMessage.textContent = '';
  profileMessage.classList.remove('show');
  profileError.textContent = '';
  profileError.classList.remove('show');
}

function fillProfileForm(user) {
  const birthdayInput = document.getElementById('profile-birthday');
  const genderInput = document.getElementById('profile-gender');
  document.getElementById('profile-first-name').value = user.firstName || '';
  document.getElementById('profile-middle-name').value = user.middleName || '';
  document.getElementById('profile-last-name').value = user.lastName || '';
  document.getElementById('profile-class-year').value = user.classYear || '';
  document.getElementById('profile-major').value = user.major || '';
  birthdayInput.value = user.birthday || '';
  genderInput.value = user.gender || '';
  document.getElementById('profile-email').value = user.email || '';
  pendingProfilePictureDataUrl = user.profilePictureDataUrl || '';
  renderProfilePicturePreview(user);
  birthdayInput.disabled = Boolean(user.birthday);
  genderInput.disabled = Boolean(user.gender);
}

function getProfileInitials(user = currentUser) {
  const first = String(user?.firstName || user?.name || 'U').trim();
  const last = String(user?.lastName || '').trim();
  return ((first.charAt(0) || 'U') + (last.charAt(0) || '')).toUpperCase();
}

function renderProfilePicturePreview(user = currentUser) {
  if (!profilePicturePreview) return;
  const picture = pendingProfilePictureDataUrl !== undefined ? pendingProfilePictureDataUrl : user?.profilePictureDataUrl || '';
  profilePicturePreview.innerHTML = '';
  profilePicturePreview.classList.toggle('has-image', Boolean(picture));
  if (picture) {
    const image = document.createElement('img');
    image.src = picture;
    image.alt = 'Profile picture preview';
    profilePicturePreview.appendChild(image);
  } else {
    profilePicturePreview.textContent = getProfileInitials(user);
  }
}

function userNeedsPolicyConsent(user) {
  return Boolean(user?.requiresPolicyConsent);
}

function userNeedsRequiredSettings(user) {
  return Boolean(user?.requiresRequiredSettings);
}

function getMissingRequiredSettings(user = currentUser) {
  return Array.isArray(user?.missingRequiredSettings) ? user.missingRequiredSettings : [];
}

function getRequiredSettingsTab(user = currentUser) {
  const missing = getMissingRequiredSettings(user);
  const identityMissing = missing.some((setting) => setting.profileTab === 'info');
  if (identityMissing) return 'info';
  const firstMissing = missing.find((setting) => setting.profileTab);
  return firstMissing?.profileTab || 'payment';
}

function getRequiredSettingsMessage(user = currentUser) {
  const missing = getMissingRequiredSettings(user);
  if (!missing.length) return '';
  return 'Complete these required settings before using LinkUp ride services: ' + missing.map((setting) => setting.label).join(', ') + '.';
}

function clearPolicyMessages() {
  policyMessage.textContent = '';
  policyMessage.classList.remove('show');
  policyError.textContent = '';
  policyError.classList.remove('show');
}

function hasScrolledPolicyToBottom() {
  if (!policyScrollbox) return false;
  return policyScrollbox.scrollTop + policyScrollbox.clientHeight >= policyScrollbox.scrollHeight - 4;
}

function getProfilePolicyControls() {
  const termsCheckbox = document.getElementById('profile-terms-agree');
  const privacyCheckbox = document.getElementById('profile-privacy-agree');
  return {
    termsCheckbox,
    privacyCheckbox,
    termsLabel: termsCheckbox?.closest('label'),
    privacyLabel: privacyCheckbox?.closest('label'),
  };
}

function updatePolicyAgreeButtonState() {
  if (!policyAgreeButton || !policyScrollHint) return;
  const isFullPolicyView = policyReleaseCard?.classList.contains('policy-full-view') === true;
  if (!userNeedsPolicyConsent(currentUser)) {
    policyAgreeButton.disabled = true;
    policyScrollHint.textContent = isFullPolicyView
      ? 'Full policy view is open. Use the back button above when you are done reading.'
      : 'You are current. Agreement is only required when LinkUp publishes a new required update.';
    return;
  }

  if (isFullPolicyView) {
    policyAgreeButton.disabled = true;
    policyScrollHint.textContent = 'Full policy view is open. Use the back button above to return to the agreement.';
    return;
  }

  const { termsCheckbox, privacyCheckbox } = getProfilePolicyControls();
  const termsChecked = termsCheckbox?.checked === true;
  const privacyChecked = privacyCheckbox?.checked === true;
  const scrolledToBottom = hasScrolledPolicyToBottom();
  policyAgreeButton.disabled = !(termsChecked && privacyChecked && scrolledToBottom);
  policyScrollHint.textContent = scrolledToBottom
    ? 'You reached the bottom. Check both boxes to continue.'
    : 'Scroll to the bottom to unlock the agreement button.';
}

function setPolicyFullView(mode = '') {
  const expanded = mode === 'terms' || mode === 'privacy';
  policyReleaseCard?.classList.toggle('policy-full-view', expanded);
  policyReleaseCard?.classList.toggle('policy-terms-view', mode === 'terms');
  policyReleaseCard?.classList.toggle('policy-privacy-view', mode === 'privacy');
  policyTermsButton?.classList.toggle('hidden', expanded);
  policyPrivacyButton?.classList.toggle('hidden', expanded);
  policyCollapseButton?.classList.toggle('hidden', !expanded);
  if (expanded && policyScrollbox) policyScrollbox.scrollTop = 0;
  updatePolicyAgreeButtonState();
}

function fillPolicyConsentForm(user) {
  setPolicyFullView('');
  const { termsCheckbox, privacyCheckbox, termsLabel, privacyLabel } = getProfilePolicyControls();
  const needsConsent = userNeedsPolicyConsent(user);
  if (termsCheckbox) termsCheckbox.checked = false;
  if (privacyCheckbox) privacyCheckbox.checked = false;
  termsLabel?.classList.toggle('hidden', !needsConsent);
  privacyLabel?.classList.toggle('hidden', !needsConsent);
  policyAgreeButton?.classList.toggle('hidden', !needsConsent);
  policyScrollHint?.classList.toggle('hidden', !needsConsent);
  if (policyScrollbox) policyScrollbox.scrollTop = 0;
  const termsVersion = user.requiredTermsVersion || 'current';
  const privacyVersion = user.requiredPrivacyVersion || 'current';
  policyVersionSummary.textContent = needsConsent
    ? 'Required Terms version: ' + termsVersion + ' | Required Privacy Notice version: ' + privacyVersion
    : 'Accepted Terms version: ' + (user.termsVersion || termsVersion) + ' | Accepted Privacy Notice version: ' + (user.privacyVersion || privacyVersion);
  policyRequiredMessage.textContent = needsConsent
    ? 'Review and agree to the latest LinkUp policies to continue.'
    : 'You\'re up to date. No new agreement needed until LinkUp publishes an update.';
  updatePolicyAgreeButtonState();
}

function showProfileTab(tabName) {
  if (!profilePage.classList.contains('hidden')) setAppRoute(profileRouteForTab(tabName));
  profileSidebarButtons.forEach((button) => button.classList.toggle('active', button.dataset.profileTab === tabName));
  profilePanels.forEach((panel) => panel.classList.toggle('hidden', panel.dataset.profilePanel !== tabName));
  if (tabName === 'payment') fillDefaultPaymentForm(currentUser || {});
  if (tabName === 'payouts') fillDriverPayoutForm(currentUser || {});
  if (tabName === 'policies') fillPolicyConsentForm(currentUser || {});
}

function clearDefaultPaymentMessages() {
  defaultPaymentMessage.textContent = '';
  defaultPaymentMessage.classList.remove('show');
  defaultPaymentError.textContent = '';
  defaultPaymentError.classList.remove('show');
}

async function getStripeInstance() {
  if (stripeInstance) return stripeInstance;
  if (!window.Stripe) {
    throw new Error('Stripe could not load. Check your internet connection and refresh.');
  }
  const config = await fetchJson('/api/stripe/config');
  stripeInstance = window.Stripe(config.publishableKey);
  return stripeInstance;
}

function getStripeAppearance() {
  return {
    theme: 'stripe',
    variables: {
      colorPrimary: '#1f8f8f',
      colorBackground: '#ffffff',
      colorText: '#1e2429',
      colorDanger: '#ff6b6b',
      colorTextSecondary: '#5c626a',
      fontFamily: 'Sora, Inter, system-ui, sans-serif',
      borderRadius: '10px',
      spacingUnit: '5px',
    },
    rules: {
      '.Input': {
        backgroundColor: '#f4f4f5',
        borderColor: '#f4f4f5',
        color: '#1e2429',
        fontSize: '16px',
        padding: '14px 16px',
      },
      '.Block': {
        backgroundColor: '#ffffff',
        borderColor: 'transparent',
      },
      '.Tab': {
        backgroundColor: '#f4f4f5',
        borderColor: '#f4f4f5',
      },
      '.Tab--selected': {
        borderColor: '#1f8f8f',
      },
    },
  };
}

function destroyStripePaymentElements() {
  if (activeExpressCheckoutElement) {
    try { activeExpressCheckoutElement.unmount(); } catch (_) {}
    activeExpressCheckoutElement = null;
  }
  if (activePaymentElement) {
    try { activePaymentElement.unmount(); } catch (_) {}
    activePaymentElement = null;
  }
  stripePaymentElements = null;
  stripeCardElements = null;
  activePaymentIntentId = '';
  activePaymentClientSecret = '';
  stripeCheckoutContainer?.classList.add('hidden');
  stripeExpressCheckoutWrap?.classList.add('hidden');
  if (stripeExpressCheckoutNode) stripeExpressCheckoutNode.innerHTML = '';
  confirmPaymentButton?.classList.add('hidden');
  if (stripePaymentElementNode) stripePaymentElementNode.innerHTML = '';
}

function destroyStripeSetupElements() {
  if (activeSetupElement) {
    try { activeSetupElement.unmount(); } catch (_) {}
    activeSetupElement = null;
  }
  stripeSetupElements = null;
  activeSetupIntentId = '';
  defaultPaymentStripeContainer?.classList.add('hidden');
  defaultPaymentConfirmButton?.classList.add('hidden');
  if (defaultPaymentElementNode) defaultPaymentElementNode.innerHTML = '';
}

function destroyEmbeddedCheckout() {
  destroyStripePaymentElements();
  destroyStripeSetupElements();
}

async function mountStripePaymentElement(clientSecret, paymentIntentId) {
  if (!clientSecret) throw new Error('Stripe payment could not be started.');
  if (!stripeCheckoutContainer || !stripePaymentElementNode) throw new Error('Stripe payment container is missing.');
  destroyStripePaymentElements();
  const stripe = await getStripeInstance();
  stripePaymentElements = stripe.elements({ clientSecret, appearance: getStripeAppearance() });
  stripeCardElements = stripe.elements();
  if (stripeExpressCheckoutNode) {
    activeExpressCheckoutElement = stripePaymentElements.create('expressCheckout', {
      buttonHeight: 48,
      layout: {
        maxColumns: 1,
        maxRows: 2,
        overflow: 'never',
      },
      paymentMethods: {
        applePay: 'auto',
        googlePay: 'auto',
        link: 'never',
        paypal: 'never',
        amazonPay: 'never',
        klarna: 'never',
      },
      buttonTheme: {
        applePay: 'black',
        googlePay: 'black',
      },
      buttonType: {
        applePay: 'buy',
        googlePay: 'buy',
      },
    });
    activeExpressCheckoutElement.on('ready', (event = {}) => {
      const availableMethods = event.availablePaymentMethods || {};
      const hasWallet = Object.values(availableMethods).some(Boolean);
      stripeExpressCheckoutWrap?.classList.toggle('hidden', !hasWallet);
      stripeExpressCheckoutNode.classList.toggle('hidden', !hasWallet);
    });
    activeExpressCheckoutElement.on('confirm', async (event) => {
      paymentMessage.textContent = '';
      paymentMessage.classList.remove('show');
      paymentError.textContent = '';
      paymentError.classList.remove('show');
      try {
        const result = await stripe.confirmPayment({
          elements: stripePaymentElements,
          confirmParams: { return_url: window.location.origin + window.location.pathname + '?checkout=success' },
          redirect: 'if_required',
        });
        if (result.error) {
          if (typeof event.paymentFailed === 'function') event.paymentFailed({ reason: 'fail' });
          throw new Error(result.error.message || 'Unable to complete wallet payment.');
        }
        if (result.paymentIntent?.status !== 'succeeded') {
          paymentMessage.textContent = 'Stripe is still processing this payment. Refresh the cart in a moment.';
          paymentMessage.classList.add('show');
          return;
        }
        await completeStripeCheckout(result.paymentIntent.id);
      } catch (err) {
        paymentError.textContent = err.message;
        paymentError.classList.add('show');
      }
    });
  }
  activePaymentElement = stripeCardElements.create('card', {
    disableLink: true,
    hidePostalCode: false,
    style: {
      base: {
        color: '#1e2429',
        fontFamily: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        fontSize: '18px',
        fontWeight: '700',
        lineHeight: '52px',
        '::placeholder': { color: '#789ca3' },
      },
      invalid: {
        color: '#b8323a',
        iconColor: '#b8323a',
      },
    },
  });
  stripeCheckoutContainer.classList.remove('hidden');
  activeExpressCheckoutElement?.mount(stripeExpressCheckoutNode);
  activePaymentElement.mount(stripePaymentElementNode);
  activePaymentIntentId = paymentIntentId || '';
  activePaymentClientSecret = clientSecret;
  confirmPaymentButton?.classList.remove('hidden');
}

async function mountStripeSetupElement(clientSecret, setupIntentId) {
  if (!clientSecret) throw new Error('Stripe setup could not be started.');
  if (!defaultPaymentStripeContainer || !defaultPaymentElementNode) throw new Error('Stripe setup container is missing.');
  destroyStripeSetupElements();
  const stripe = await getStripeInstance();
  stripeSetupElements = stripe.elements({ clientSecret, appearance: getStripeAppearance() });
  activeSetupElement = stripeSetupElements.create('payment', { layout: 'tabs' });
  defaultPaymentStripeContainer.classList.remove('hidden');
  activeSetupElement.mount(defaultPaymentElementNode);
  activeSetupIntentId = setupIntentId || '';
  defaultPaymentConfirmButton?.classList.remove('hidden');
}

function fillDefaultPaymentForm(user) {
  const method = user.defaultPaymentMethod || null;
  defaultPaymentSummary.textContent = method
    ? (method.provider === 'stripe' ? 'Stripe ' : '') + method.brand + ' ending in ' + method.last4 + (method.expiry ? ' - expires ' + method.expiry : '')
    : 'No default payment method saved.';
}

function clearPayoutMessages() {
  payoutMessage.textContent = '';
  payoutMessage.classList.remove('show');
  payoutError.textContent = '';
  payoutError.classList.remove('show');
}

function renderStripePayoutSummary(user) {
  if (!stripePayoutSummary) return;
  const stripeInfo = user?.payoutInfo?.stripe || null;
  if (!stripeInfo?.accountId) {
    stripePayoutSummary.textContent = 'Stripe cash-out not connected. You can still earn and spend wallet balance inside LinkUp.';
    return;
  }
  if (stripeInfo.payoutsEnabled) {
    stripePayoutSummary.textContent = 'Stripe cash-out connected and ready for weekly bank payouts.';
    return;
  }
  if (stripeInfo.detailsSubmitted) {
    stripePayoutSummary.textContent = 'Stripe cash-out details submitted. Stripe is finishing verification.';
    return;
  }
  stripePayoutSummary.textContent = 'Stripe cash-out started. Finish onboarding when you want bank payouts.';
}

function renderDriverWalletSummary(user) {
  if (!driverWalletSummary) return;
  const wallet = user?.wallet || {};
  const commissionPercent = Math.round(Number(wallet.commissionRate ?? LINKUP_COMMISSION_RATE) * 100);
  driverWalletSummary.innerHTML = `
    <div class="wallet-card wallet-card-primary">
      <span>Wallet balance</span>
      <strong>${formatCents(wallet.availableCents || 0)}</strong>
      <small>Available for rides now. Stripe is only needed for bank cash-out.</small>
    </div>
    <div class="wallet-card">
      <span>This week earned</span>
      <strong>${formatCents(wallet.thisWeek?.netCents || 0)}</strong>
      <small>${formatCents(wallet.thisWeek?.commissionCents || 0)} LinkUp commission withheld.</small>
    </div>
    <div class="wallet-card">
      <span>Pending rides</span>
      <strong>${formatCents(wallet.pendingRideCompletion?.netCents || 0)}</strong>
      <small>Unlocks after completed rides end.</small>
    </div>
    <div class="wallet-card">
      <span>Weekly payout</span>
      <strong>${formatCents(wallet.payoutScheduledCents || 0)}</strong>
      <small>Only paid to a bank when Stripe cash-out is connected.</small>
    </div>
    <div class="wallet-card wallet-card-wide">
      <span>Wallet rules</span>
      <small>Drivers keep ${100 - commissionPercent}% of each paid seat. Available wallet money is automatically used before charging your card.</small>
    </div>
  `;
}

function fillDriverPayoutForm(user) {
  renderDriverWalletSummary(user);
  renderStripePayoutSummary(user);
  if (payoutCommissionLabel) payoutCommissionLabel.textContent = Math.round(LINKUP_COMMISSION_RATE * 100) + '%';
}

function getDriverPayoutPayload() {
  return {
    legalName: [currentUser?.firstName, currentUser?.lastName].filter(Boolean).join(' '),
    method: 'stripe',
    email: currentUser?.email || '',
    phone: '',
    handle: '',
    address: '',
    notes: '',
    confirmed: true,
  };
}

function renderLeaderboardRows(items, chartElement, valueLabel, valueFormatter) {
  chartElement.innerHTML = '';
  if (!items.length) return;

  const maxValue = Math.max(...items.map((item) => Number(item[valueLabel]) || 0));
  const valueCounts = items.reduce((counts, item) => {
    const value = Number(item[valueLabel]) || 0;
    counts.set(value, (counts.get(value) || 0) + 1);
    return counts;
  }, new Map());

  let previousValue = null;
  let currentRank = 0;
  items.forEach((item, index) => {
    const value = Number(item[valueLabel]) || 0;
    if (previousValue === null || value !== previousValue) currentRank = index + 1;
    previousValue = value;
    const row = document.createElement('div');
    row.className = 'leaderboard-row';

    const rank = document.createElement('div');
    rank.className = 'leaderboard-rank';
    rank.textContent = valueCounts.get(value) > 1 ? 'T-' + currentRank : String(currentRank);

    const content = document.createElement('div');
    content.className = 'leaderboard-school';

    const header = document.createElement('div');
    header.className = 'leaderboard-school-header';

    const name = document.createElement('span');
    name.textContent = item.school;

    const count = document.createElement('strong');
    count.textContent = valueFormatter(item);

    header.append(name, count);

    const track = document.createElement('div');
    track.className = 'leaderboard-bar-track';

    const bar = document.createElement('div');
    bar.className = 'leaderboard-bar';
    bar.style.width = Math.max(8, Math.round((value / maxValue) * 100)) + '%';

    track.appendChild(bar);

    const meta = document.createElement('div');
    meta.className = 'leaderboard-meta';
    const schoolLocation = item.location || [item.city, item.state].filter(Boolean).join(', ');
    meta.textContent = [schoolLocation, item.domain, item.serviceApproved ? 'Service active' : 'Waitlist'].filter(Boolean).join(' - ');

    content.append(header, track, meta);
    row.append(rank, content);
    chartElement.appendChild(row);
  });
}

function renderSchoolLeaderboard(data) {
  const schools = data.schools || [];
  schoolLeaderboardChart.innerHTML = '';
  milesLeaderboardSummary.textContent = 'Loading miles...';
  milesLeaderboardChart.innerHTML = '';
  if (leaderboardSavedMiles) {
    const savedMilesValue = leaderboardSavedMiles.querySelector('strong');
    if (savedMilesValue) savedMilesValue.textContent = formatMiles(data.totalMilesSaved || 0);
  }
  leaderboardSummary.textContent = schools.length
    ? `${data.totalUsers} total user${data.totalUsers === 1 ? '' : 's'} across ${schools.length} school${schools.length === 1 ? '' : 's'}.`
    : 'No users have signed up yet.';

  if (!schools.length) return;

  renderLeaderboardRows(schools, schoolLeaderboardChart, 'userCount', (school) => school.userCount + ' user' + (school.userCount === 1 ? '' : 's'));

  const mileageSchools = data.mileageSchools || [];
  const totalMiles = mileageSchools.reduce((sum, school) => sum + (Number(school.miles) || 0), 0);
  milesLeaderboardChart.innerHTML = '';
  milesLeaderboardSummary.textContent = mileageSchools.length
    ? formatMiles(totalMiles) + ' traveled across ' + mileageSchools.length + ' school' + (mileageSchools.length === 1 ? '' : 's') + '.'
    : 'No ride miles have been posted yet.';
  renderLeaderboardRows(mileageSchools, milesLeaderboardChart, 'miles', (school) => formatMiles(school.miles) + ' across ' + school.tripCount + ' trip' + (school.tripCount === 1 ? '' : 's'));
}

async function loadLeaderboard() {
  leaderboardError.textContent = '';
  leaderboardError.classList.remove('show');
  leaderboardSummary.textContent = 'Loading schools...';
  if (leaderboardSavedMiles) {
    const savedMilesValue = leaderboardSavedMiles.querySelector('strong');
    if (savedMilesValue) savedMilesValue.textContent = 'Loading...';
  }
  schoolLeaderboardChart.innerHTML = '';
  try {
    const data = await fetchJson('/api/leaderboard/schools');
    renderSchoolLeaderboard(data);
  } catch (err) {
    leaderboardSummary.textContent = '';
    milesLeaderboardSummary.textContent = '';
    if (leaderboardSavedMiles) {
      const savedMilesValue = leaderboardSavedMiles.querySelector('strong');
      if (savedMilesValue) savedMilesValue.textContent = '--';
    }
    leaderboardError.textContent = err.message;
    leaderboardError.classList.add('show');
  }
}

function showLeaderboardPage() {
  setAppRoute('leaderboard');
  clearCartMessages();
  hideDashboardPages();
  leaderboardPage.classList.remove('hidden');
  loadLeaderboard();
}

function formatPublicProfileDate(value) {
  if (!value) return 'Recently joined';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Recently joined';
  return date.toLocaleDateString(undefined, { month: 'short', year: 'numeric' });
}

function formatPublicRating(profile) {
  const average = profile?.stats?.driverRatingAverage;
  const count = profile?.stats?.driverRatingCount || 0;
  return average ? average.toFixed(1) + ' / 5 from ' + count + ' rating' + (count === 1 ? '' : 's') : 'No driver ratings yet';
}

async function toggleUserBlock(profile) {
  if (!profile?.id || profile.isCurrentUser) return;
  const blocking = !profile.isBlockedByCurrentUser;
  if (blocking) {
    const confirmed = window.confirm('Block ' + (profile.name || 'this user') + '? You will not see each other\'s ride listings or ride requests.');
    if (!confirmed) return;
  }
  try {
    const response = await fetchJson('/api/users/' + encodeURIComponent(profile.id) + '/block', {
      method: blocking ? 'POST' : 'DELETE',
    });
    showToast(response.message || (blocking ? 'User blocked.' : 'User unblocked.'), 'success');
    await showPublicProfilePage(profile.id);
    loadRides();
    loadRideRequests();
    loadCart();
  } catch (err) {
    showToast(err.message || 'Unable to update block setting.', 'error');
  }
}

function renderPublicProfile(profile) {
  const stats = profile.stats || {};
  const profileDetails = [
    profile.major ? 'Major: ' + profile.major : '',
    profile.classYear ? 'Class of ' + profile.classYear : '',
  ].filter(Boolean);
  const avatarMarkup = profile.profilePictureDataUrl
    ? `<img class="public-profile-avatar-image" src="${esc(profile.profilePictureDataUrl)}" alt="${esc(profile.name || 'Profile')} profile picture" />`
    : esc((profile.firstName || profile.name || 'U').charAt(0).toUpperCase());
  publicProfileTitle.textContent = profile.name || 'User profile';
  publicProfileSubtitle.textContent = [profile.university || profile.universityDomain, 'Member since ' + formatPublicProfileDate(profile.memberSince)].filter(Boolean).join(' - ');
  publicProfileContent.innerHTML = `
    <div class="public-profile-hero">
      <div class="public-profile-avatar">${avatarMarkup}</div>
      <div>
        <h4>${esc(profile.name || 'LinkUp user')}</h4>
        <p>${esc(profile.university || profile.universityDomain || 'University rider')}</p>
        ${profileDetails.length ? `<p class="public-profile-academic">${esc(profileDetails.join(' | '))}</p>` : ''}
        <span class="public-profile-status">${profile.serviceApproved ? 'Verified university network' : 'Waitlist account'}</span>
      </div>
    </div>
    <div class="public-profile-stats">
      <div><strong>${esc(stats.ridesOffered || 0)}</strong><span>Rides offered</span></div>
      <div><strong>${esc(stats.ridesDrivenCompleted || 0)}</strong><span>Completed as driver</span></div>
      <div><strong>${esc(stats.ridesJoined || 0)}</strong><span>Rides joined</span></div>
      <div><strong>${esc(stats.openRideRequests || 0)}</strong><span>Open ride requests</span></div>
    </div>
    <div class="public-profile-rating">
      <strong>Driver rating</strong>
      <span>${esc(formatPublicRating(profile))}</span>
    </div>
    ${profile.isCurrentUser ? '' : `
      <div class="public-profile-actions">
        <button id="public-profile-block-button" type="button" class="${profile.isBlockedByCurrentUser ? 'secondary-action-button' : 'block-user-button'}">
          ${profile.isBlockedByCurrentUser ? 'Unblock user' : 'Block user'}
        </button>
        <p>${profile.isBlockedByCurrentUser ? 'You blocked this user. Your listings and requests are hidden from each other.' : 'Blocking hides your listings and requests from each other.'}</p>
      </div>
    `}
  `;
  document.getElementById('public-profile-block-button')?.addEventListener('click', () => toggleUserBlock(profile));
}

async function showPublicProfilePage(userId) {
  if (!userId) return;
  setAppRoute(publicProfileRoute(userId));
  clearCartMessages();
  hideDashboardPages();
  publicProfileTitle.textContent = 'User profile';
  publicProfileSubtitle.textContent = 'Public LinkUp profile and ride stats.';
  publicProfileContent.textContent = 'Loading profile...';
  publicProfileError.textContent = '';
  publicProfileError.classList.remove('show');
  publicProfilePage.classList.remove('hidden');
  try {
    const profile = await fetchJson('/api/users/' + encodeURIComponent(userId) + '/profile');
    renderPublicProfile(profile);
  } catch (err) {
    publicProfileContent.textContent = '';
    publicProfileError.textContent = err.message || 'Unable to load this profile.';
    publicProfileError.classList.add('show');
  }
}

function showProfilePage(tabName = 'info') {
  setAppRoute(profileRouteForTab(tabName));
  clearCartMessages();
  clearProfileMessages();
  clearPolicyMessages();
  hideDashboardPages();
  fillProfileForm(currentUser || {});
  fillDefaultPaymentForm(currentUser || {});
  fillDriverPayoutForm(currentUser || {});
  fillPolicyConsentForm(currentUser || {});
  showProfileTab(tabName);
  profilePage.classList.remove('hidden');
}

function showPolicyConsentRequired() {
  setAppRoute('profile-policies');
  showProfilePage('policies');
  policyError.textContent = 'Please agree to the latest Terms and Privacy Notice to continue.';
  policyError.classList.add('show');
}

function showRequiredSettingsRequired(prefixMessage = '') {
  const tabName = getRequiredSettingsTab(currentUser);
  showProfilePage(tabName);
  const message = [prefixMessage, getRequiredSettingsMessage(currentUser)].filter(Boolean).join(' ');
  if (tabName === 'payment') {
    defaultPaymentError.textContent = message;
    defaultPaymentError.classList.add('show');
  } else {
    profileError.textContent = message;
    profileError.classList.add('show');
  }
}

function showDashboardHome() {
  setAppRoute('home');
  clearCartMessages();
  if (currentUser && !currentUser.serviceApproved) {
    showWaitlistPage(currentUser);
    return;
  }
  if (userNeedsPolicyConsent(currentUser)) {
    showPolicyConsentRequired();
    return;
  }
  if (userNeedsRequiredSettings(currentUser)) {
    showRequiredSettingsRequired();
    return;
  }
  hideDashboardPages();
  dashboardHome.classList.remove('hidden');
  renderBrowseRoleChoice();
  if (currentUser?.rideServicesPaused) renderRideServicesPausedState();
}

function returnToBrowseRides() {
  const roleToRestore = browseRole;
  showDashboardShell();
  showDashboardHome();
  if (roleToRestore === 'driver') showDriverBrowse();
  else if (roleToRestore === 'rider') showRiderBrowse();
}

function returnFromLegalPage() {
  if (!currentUser) {
    showAuthSection();
    return;
  }

  const routeToRestore = legalReturnRoute;
  legalReturnRoute = '';
  if (routeToRestore && !isLegalRoute(routeToRestore)) {
    showDashboardShell();
    setAppRoute(routeToRestore);
    restoreAppRoute();
    return;
  }

  returnToBrowseRides();
}

function showWaitlistPage(user) {
  setAppRoute('waitlist');
  hideDashboardPages();
  waitlistPage.classList.remove('hidden');
  waitlistMessage.textContent = 'We saved your account for ' + (user.university || user.universityDomain || 'your university') + '. We will notify you when LinkUp launches at your university.';
}

function showCartPage() {
  if (!ensureServiceAccess()) return;
  setAppRoute('cart');
  clearCartMessages();
  hideDashboardPages();
  cartPage.classList.remove('hidden');
  loadCart();
}

function showYourRidesPage() {
  if (!ensureServiceAccess()) return;
  setAppRoute('your-rides');
  clearCartMessages();
  hideDashboardPages();
  yourRidesPage.classList.remove('hidden');
  loadYourRides();
}

function showChatPage() {
  if (!ensureServiceAccess()) return;
  setAppRoute('chat');
  clearCartMessages();
  hideDashboardPages();
  chatPage.classList.remove('hidden');
  loadChatPage();
}

function showRequestRidePage() {
  if (!ensureServiceAccess()) return;
  setAppRoute('request-ride');
  clearCartMessages();
  clearRequestRideMessages();
  hideDashboardPages();
  requestRidePage.classList.remove('hidden');
  loadGoogleMapsAPI().then(() => initializeRequestAutocomplete());
}

function showListRidePage() {
  if (!ensureServiceAccess()) return;
  setAppRoute('list-ride');
  clearCartMessages();
  hideDashboardPages();
  listRidePage.classList.remove('hidden');
  loadProfile();
  loadGoogleMapsAPI().then(() => {
    setTimeout(() => {
      if (!originMap) initializeOriginMap();
      if (!destinationAutocomplete) initializeDestinationMap();
    }, 100);
  });
}

function showTrackTripPage() {
  if (!ensureServiceAccess()) return;
  setAppRoute('track-trip');
  clearCartMessages();
  clearTrackingMessages();
  hideDashboardPages();
  trackTripPage.classList.remove('hidden');
  loadGoogleMapsAPI().then(() => {
    if (lastTrackingLocation) {
      updateTrackingMap(lastTrackingLocation, lastTrackingLocations, lastTrackingRideRoute);
    }
  });
}

function ensureServiceAccess() {
  if (!currentUser?.serviceApproved) {
    showWaitlistPage(currentUser || {});
    return false;
  }
  if (userNeedsPolicyConsent(currentUser)) {
    showPolicyConsentRequired();
    return false;
  }
  if (userNeedsRequiredSettings(currentUser)) {
    showRequiredSettingsRequired();
    return false;
  }
  if (currentUser?.rideServicesPaused) {
    showDashboardHome();
    return false;
  }
  return true;
}

function showPaymentPage(preselectedRideIds = null) {
  const visibleRideIds = syncCartStateFromDom();
  const selectedRideIds = Array.isArray(preselectedRideIds) && preselectedRideIds.length
    ? preselectedRideIds
    : getSelectedCartRideIds();
  selectedCartRideIds = new Set(selectedRideIds);
  if (!cartRideIds.size && !visibleRideIds.length && !selectedRideIds.length) {
    showCartPage();
    cartError.textContent = 'Your cart is empty. Add a ride before checking out.';
    cartError.classList.add('show');
    return;
  }
  if (!selectedRideIds.length) {
    showCartPage();
    cartError.textContent = 'Select at least one trip before checking out.';
    cartError.classList.add('show');
    return;
  }
  setAppRoute('payment');
  clearCartMessages();
  hideDashboardPages();
  paymentPage.classList.remove('hidden');
  if (paymentSummary) paymentSummary.textContent = `${selectedRideIds.length} trip${selectedRideIds.length === 1 ? '' : 's'} ready for payment`;
  document.getElementById('pay-cart')?.classList.remove('hidden');
  destroyStripePaymentElements();

  // Populate right-panel order summary from selected cart cards
  const orderSummaryEl = document.getElementById('payment-order-summary');
  let totalCents = 0;
  if (orderSummaryEl) {
    const selectedCards = [...cartItems.querySelectorAll('.cart-item-card')]
      .filter((card) => selectedRideIds.includes(card.dataset.rideId));
    totalCents = selectedCards.reduce((sum, card) => sum + Number(card.dataset.priceCents || 0), 0);

    const rows = selectedCards.map((card) => {
      const title = card.querySelector('h4')?.textContent?.trim() || 'Ride';
      const priceCents = Number(card.dataset.priceCents || 0);
      return `<div class="cart-summary-row">
        <span class="cart-summary-row-label">${esc(title)}</span>
        <span class="cart-summary-row-price">${formatCents(priceCents)}</span>
      </div>`;
    }).join('');

    orderSummaryEl.innerHTML = `
      <div class="cart-summary-rows">${rows}</div>
      <div class="cart-summary-divider"></div>
      <div class="cart-summary-total-row">
        <div class="cart-summary-total-copy">
          <span>Total</span>
          <p class="cart-summary-tax-note">Service fee included</p>
        </div>
        <strong>${formatCents(totalCents)}</strong>
      </div>
    `;
    orderSummaryEl.classList.remove('hidden');
  }
  renderLinkUpWalletCheckout(totalCents);
}

function renderLinkUpWalletCheckout(totalCents) {
  if (!linkupWalletCheckout) return;
  const availableCents = Math.max(0, Number(currentUser?.wallet?.availableCents || 0));
  const appliedCents = Math.min(availableCents, Math.max(0, Number(totalCents || 0)));
  const remainingCents = Math.max(0, Number(totalCents || 0) - appliedCents);
  const payCartButton = document.getElementById('pay-cart');
  if (payCartButton) {
    payCartButton.textContent = appliedCents > 0 && remainingCents === 0
      ? 'Pay with LinkUp Wallet'
      : appliedCents > 0
        ? 'Use Wallet + Card'
        : 'Check Out';
  }

  if (availableCents <= 0) {
    linkupWalletCheckout.innerHTML = `
      <div class="wallet-checkout-copy">
        <span>LinkUp Wallet</span>
        <strong>${formatCents(0)}</strong>
        <small>No wallet balance available for this checkout.</small>
      </div>
    `;
    linkupWalletCheckout.classList.remove('hidden');
    return;
  }

  linkupWalletCheckout.innerHTML = `
    <div class="wallet-checkout-copy">
      <span>LinkUp Wallet</span>
      <strong>${formatCents(availableCents)}</strong>
      <small>${appliedCents > 0 ? `${formatCents(appliedCents)} will be applied before your card.` : 'Available for future LinkUp rides.'}</small>
    </div>
    <div class="wallet-checkout-breakdown">
      <div><span>Trip total</span><strong>${formatCents(totalCents || 0)}</strong></div>
      <div><span>Wallet applied</span><strong>-${formatCents(appliedCents)}</strong></div>
      <div><span>${remainingCents > 0 ? 'Card due' : 'Due today'}</span><strong>${formatCents(remainingCents)}</strong></div>
    </div>
  `;
  linkupWalletCheckout.classList.remove('hidden');
}

function restoreAppRoute() {
  const route = getAppRoute();
  isRestoringRoute = true;
  try {
    if (route === 'privacy' || route === 'terms') showLegalPage(route);
    else if (route === 'cart') showCartPage();
    else if (route === 'payment') showPaymentPage();
    else if (route === 'your-rides') showYourRidesPage();
    else if (route === 'chat') showChatPage();
    else if (route === 'request-ride') showRequestRidePage();
    else if (route === 'list-ride') showListRidePage();
    else if (route === 'track-trip') showTrackTripPage();
    else if (route === 'leaderboard') showLeaderboardPage();
    else if (route.startsWith('user-profile-')) showPublicProfilePage(route.replace(/^user-profile-/, ''));
    else if (route === 'profile-payment') showProfilePage('payment');
    else if (route === 'profile-payouts') showProfilePage('payouts');
    else if (route === 'profile-policies') showProfilePage('policies');
    else if (route === 'profile-release-notes') showProfilePage('release-notes');
    else if (route === 'profile-about') showProfilePage('about');
    else if (route === 'profile') showProfilePage('info');
    else if (route === 'browse-driver') {
      showDashboardHome();
      showDriverBrowse();
    } else if (route === 'browse-rider') {
      showDashboardHome();
      showRiderBrowse();
    } else {
      showDashboardHome();
    }
  } finally {
    isRestoringRoute = false;
  }
}

function showDashboard(user) {
  hideLegalPages();
  sharedTrackPage.classList.add('hidden');
  siteLogo.src = 'assets/images/LinkUp-wordmark.png';
  siteLogo.alt = 'LinkUp';
  siteLogo.setAttribute('role', 'button');
  siteLogo.setAttribute('aria-label', 'Go to home');
  siteLogo.tabIndex = 0;
  document.body.classList.add('dashboard-mode');
  headerLeftActions.classList.remove('hidden');
  headerActions.classList.remove('hidden');
  authSection.classList.add('hidden');
  dashboard.classList.remove('hidden');
  welcomeMessage.textContent = `Welcome, ${getDisplayName(user)}`;
  updateUserHeader(user);
  if (!user.serviceApproved) {
    showWaitlistPage(user);
    return;
  }
  if (userNeedsPolicyConsent(user)) {
    showPolicyConsentRequired();
    return;
  }
  if (userNeedsRequiredSettings(user)) {
    showRequiredSettingsRequired();
    return;
  }
  if (!user.rideServicesPaused) loadCart();
  loadProfile();
  restoreAppRoute();
}

function updateTrackingDriverInfo() {
  if (!currentUser) {
    trackingDriverInfo.classList.add('hidden');
    trackingDriverDetails.textContent = '';
    return;
  }
  const fullName = [currentUser.firstName, currentUser.middleName, currentUser.lastName].filter(Boolean).join(' ');
  trackingDriverDetails.innerHTML = `
    <div><strong>Name:</strong> ${esc(fullName || getDisplayName(currentUser))}</div>
    <div><strong>Email:</strong> ${esc(currentUser.email)}</div>
    <div><strong>University:</strong> ${esc(currentUser.university)}</div>
  `;
  trackingDriverInfo.classList.remove('hidden');
}

function resetTrackingPage() {
  activeTrackingTripId = null;
  trackingRecipientEmail.disabled = false;
  trackingRecipientEmail.value = '';
  activeTrackingViewerUrl = '';
  copyTrackingLinkButton?.classList.add('hidden');
  sendTrackingInviteButton?.classList.add('hidden');
  setTrackingActive(false);
  trackingLastUpdate.textContent = 'No location shared yet.';
  trackingMapDiv.textContent = '';
  trackingDriverInfo.classList.add('hidden');
  trackingDriverDetails.textContent = '';
  if (trackingRouteRenderer) trackingRouteRenderer.setMap(null);
  if (trackingRouteLine) trackingRouteLine.setMap(null);
  if (trackingOriginMarker) trackingOriginMarker.setMap(null);
  if (trackingDestinationMarker) trackingDestinationMarker.setMap(null);
  trackingMap = null;
  trackingMarker = null;
  trackingPath = null;
  trackingRouteRenderer = null;
  trackingRouteLine = null;
  trackingRouteKey = '';
  trackingOriginMarker = null;
  trackingDestinationMarker = null;
}


function getVehicleSeatIds(vehicleSeatCount) {
  return VEHICLE_SEAT_LAYOUTS[Number(vehicleSeatCount)] || VEHICLE_SEAT_LAYOUTS[5];
}

function getDefaultSeatSet(vehicleSeatCount) {
  return new Set(getVehicleSeatIds(vehicleSeatCount));
}

function getSeatLayoutCountForRide(ride) {
  if (ride.vehicleSeatCount) return Number(ride.vehicleSeatCount);
  const seatIds = new Set((ride.seatMap || []).map((seat) => seat.id));
  if (seatIds.has('third_left') || seatIds.has('third_right')) return seatIds.has('back_middle') ? 7 : 6;
  if (seatIds.has('back_middle')) return 5;
  if (seatIds.has('back_left') || seatIds.has('back_right')) return 4;
  return 2;
}

function getSeatLayoutIdsForMode(mode, ride) {
  if (mode === 'driver') return getVehicleSeatIds(currentVehicleSeatCount);
  return getVehicleSeatIds(getSeatLayoutCountForRide(ride || {}));
}

function getSeatLabel(seatId) {
  return CAR_SEATS.find((seat) => seat.id === seatId)?.label || seatId;
}

function getSeatDisplayLabel(seatId) {
  const labels = {
    driver: 'Driver',
    front_passenger: 'Front',
    back_left: 'Back Left',
    back_middle: 'Back Middle',
    back_right: 'Back Right',
    third_left: 'Third Left',
    third_right: 'Third Right',
  };
  return labels[seatId] || getSeatLabel(seatId);
}

function createSeatLayout({ seatMap = [], selectedSeatId = '', onSelect = null, mode = 'rider', ride = null } = {}) {
  const layout = document.createElement('div');
  layout.className = 'seat-layout ' + (mode === 'driver' ? 'driver-seat-layout' : 'rider-seat-layout');
  const seatState = new Map(seatMap.map((seat) => [seat.id, seat]));
  const layoutSeatIds = getSeatLayoutIdsForMode(mode, ride);
  const visibleSeatIds = new Set(['driver', ...layoutSeatIds]);
  layout.dataset.vehicleSeats = String(mode === 'driver' ? currentVehicleSeatCount : getSeatLayoutCountForRide(ride || {}));

  CAR_SEATS.filter((seat) => visibleSeatIds.has(seat.id)).forEach((seat) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'seat-rect seat-' + seat.id;
    button.textContent = getSeatDisplayLabel(seat.id);
    button.setAttribute('aria-label', seat.label);

    if (seat.role === 'driver') {
      button.classList.add('driver-seat', 'unavailable');
      button.disabled = true;
    } else if (mode === 'driver') {
      const isSelected = driverAvailableSeatIds.has(seat.id);
      button.classList.toggle('selected', isSelected);
      button.setAttribute('aria-pressed', String(isSelected));
      button.addEventListener('click', () => {
        if (driverAvailableSeatIds.has(seat.id)) {
          driverAvailableSeatIds.delete(seat.id);
        } else {
          driverAvailableSeatIds.add(seat.id);
        }
        renderDriverSeatLayout();
      });
    } else {
      const state = seatState.get(seat.id) || { available: false, reserved: false };
      const isPurchasedSeat = selectedSeatId === seat.id;
      if (isPurchasedSeat) {
        button.classList.add('purchased-seat', 'selected');
      }
      if (!state.available) {
        button.classList.add('unavailable');
        button.disabled = true;
      } else if (state.reserved) {
        button.classList.add('reserved');
        button.disabled = true;
      } else {
        button.classList.add('available');
        if (onSelect) {
          button.addEventListener('click', () => onSelect(seat.id));
        } else {
          button.disabled = true;
        }
      }
    }

    layout.appendChild(button);
  });

  return layout;
}

function renderDriverSeatLayout() {
  if (!driverSeatLayout) return;
  const validSeatIds = new Set(getVehicleSeatIds(currentVehicleSeatCount));
  driverAvailableSeatIds = new Set([...driverAvailableSeatIds].filter((seatId) => validSeatIds.has(seatId)));
  driverSeatLayout.dataset.vehicleSeats = String(currentVehicleSeatCount);
  driverSeatLayout.replaceChildren(...createSeatLayout({ mode: 'driver' }).childNodes);
  const count = driverAvailableSeatIds.size;
  document.getElementById('seats').value = String(count);
  selectedSeatCount.textContent = count + ' selected';
}

function setRequired(element, required) {
  if (element) element.required = Boolean(required);
}

function updateOfferProviderFields() {
  const providerType = rideProviderTypeSelect?.value || '';
  const isPersonalCar = providerType === 'personal_car';
  const isRideshare = providerType === 'rideshare_service';
  offerForm?.classList.toggle('hidden', !providerType);
  rideProviderStep?.classList.toggle('hidden', Boolean(providerType));
  rideProviderChoices.forEach((button) => button.classList.toggle('active', button.dataset.providerType === providerType));
  if (rideProviderSummaryText) {
    rideProviderSummaryText.textContent = isPersonalCar
      ? 'Personal Car'
      : (isRideshare ? 'Rideshare Service' : 'Ride type selected');
  }
  personalCarFields?.classList.toggle('hidden', !isPersonalCar);
  personalSeatSelection?.classList.toggle('hidden', !isPersonalCar);
  vehicleLayoutField?.classList.toggle('hidden', !isPersonalCar);
  rideshareServiceFields?.classList.toggle('hidden', !isRideshare);

  ['car-maker', 'car-model', 'car-color', 'license-plate'].forEach((id) => {
    setRequired(document.getElementById(id), isPersonalCar);
  });
  setRequired(vehicleSeatCountSelect, isPersonalCar);
  setRequired(document.getElementById('seats'), isPersonalCar);
  setRequired(rideshareServiceSelect, isRideshare);
  setRequired(rideshareSeatCountInput, isRideshare);
}

function chooseOfferProviderType(providerType) {
  if (!rideProviderTypeSelect) return;
  rideProviderTypeSelect.value = providerType;
  if (providerType === 'personal_car') renderDriverSeatLayout();
  updateOfferProviderFields();
}

function resetOfferProviderSelection() {
  if (!rideProviderTypeSelect) return;
  rideProviderTypeSelect.value = '';
  updateOfferProviderFields();
}

function renderRideSeatPicker(ride, actionButton) {
  const wrapper = document.createElement('div');
  wrapper.className = 'ride-seat-picker';

  const label = document.createElement('div');
  label.className = 'seat-picker-title';
  label.textContent = 'Choose your seat';
  wrapper.appendChild(label);

  const selectedSeatId = selectedSeatByRide.get(ride.id) || ride.selectedSeatId || '';
  const layout = createSeatLayout({
    seatMap: ride.seatMap || [],
    selectedSeatId,
    ride,
    onSelect: (seatId) => {
      selectedSeatByRide.set(ride.id, seatId);
      actionButton.disabled = false;
      actionButton.textContent = 'Add ' + getSeatLabel(seatId) + ' to cart';
      const nextPicker = renderRideSeatPicker(ride, actionButton);
      wrapper.replaceWith(nextPicker);
    },
  });
  wrapper.appendChild(layout);

  const hint = document.createElement('div');
  hint.className = 'seat-picker-hint';
  hint.textContent = selectedSeatId ? 'Selected: ' + getSeatLabel(selectedSeatId) : 'Grey seats are already reserved or unavailable.';
  wrapper.appendChild(hint);

  return wrapper;
}

function formatTrackingTime(timestamp) {
  if (!timestamp) return 'No update yet';
  return new Date(timestamp).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', second: '2-digit' });
}

function getRoutePoints(route) {
  if (!route) return null;
  const origin = { lat: Number(route.originLat), lng: Number(route.originLng) };
  const destination = { lat: Number(route.destinationLat), lng: Number(route.destinationLng) };
  return [origin.lat, origin.lng, destination.lat, destination.lng].every(Number.isFinite) ? { origin, destination } : null;
}

function getRouteKey(route) {
  const points = getRoutePoints(route);
  return points ? [points.origin.lat, points.origin.lng, points.destination.lat, points.destination.lng].join(',') : '';
}

function getTrackingMapUrl(route, location = null) {
  const points = getRoutePoints(route);
  if (points) {
    const destination = points.destination.lat + ',' + points.destination.lng;
    const origin = location && Number.isFinite(Number(location.lat)) && Number.isFinite(Number(location.lng))
      ? Number(location.lat) + ',' + Number(location.lng)
      : points.origin.lat + ',' + points.origin.lng;
    return 'https://www.google.com/maps/dir/?api=1&origin=' + encodeURIComponent(origin) + '&destination=' + encodeURIComponent(destination) + '&travelmode=driving';
  }
  if (location && Number.isFinite(Number(location.lat)) && Number.isFinite(Number(location.lng))) {
    return 'https://www.google.com/maps?q=' + location.lat + ',' + location.lng;
  }
  return '#';
}

function renderTrackingMapFallback(container, position, label = 'Current location') {
  if (!container || !position || !Number.isFinite(position.lat) || !Number.isFinite(position.lng)) return;
  const url = getTrackingMapUrl(null, position);
  container.innerHTML = `
    <div class="tracking-fallback-pin" aria-hidden="true"></div>
    <div class="tracking-fallback-content">
      <span>${label}</span>
      <strong>${position.lat.toFixed(5)}, ${position.lng.toFixed(5)}</strong>
      <a href="${url}" target="_blank" rel="noopener">Open location in Google Maps</a>
    </div>
  `;
}

function clearRouteOverlay(state) {
  if (state.renderer.current) state.renderer.current.setMap(null);
  if (state.line.current) state.line.current.setMap(null);
  if (state.originMarker.current) state.originMarker.current.setMap(null);
  if (state.destinationMarker.current) state.destinationMarker.current.setMap(null);
  state.renderer.current = null;
  state.line.current = null;
  state.originMarker.current = null;
  state.destinationMarker.current = null;
}

function drawTrackingRouteOverlay(map, route, state) {
  const points = getRoutePoints(route);
  if (!map || !points || !window.google?.maps) {
    if (state.key.current) {
      clearRouteOverlay(state);
      state.key.current = '';
    }
    return null;
  }
  const key = getRouteKey(route);
  if (state.key.current === key) return points;
  clearRouteOverlay(state);
  state.key.current = key;
  state.originMarker.current = new google.maps.Marker({ map, position: points.origin, icon: makeOriginIcon(), title: 'Ride pick-up: ' + (route.origin || '') });
  state.destinationMarker.current = new google.maps.Marker({ map, position: points.destination, icon: makeDestinationIcon(), title: 'Ride drop-off: ' + (route.destination || '') });
  if (google.maps.DirectionsService && google.maps.DirectionsRenderer) {
    state.renderer.current = new google.maps.DirectionsRenderer({
      map,
      suppressMarkers: true,
      preserveViewport: true,
      polylineOptions: { strokeColor: '#67d7d9', strokeOpacity: 0.9, strokeWeight: 5 },
    });
    new google.maps.DirectionsService().route(
      { origin: points.origin, destination: points.destination, travelMode: google.maps.TravelMode.DRIVING },
      (result, status) => {
        if (status === 'OK' && state.renderer.current) {
          state.renderer.current.setDirections(result);
        } else {
          if (state.renderer.current) state.renderer.current.setMap(null);
          state.renderer.current = null;
          state.line.current = new google.maps.Polyline({ map, path: [points.origin, points.destination], strokeColor: '#67d7d9', strokeOpacity: 0.85, strokeWeight: 4 });
        }
      }
    );
  } else {
    state.line.current = new google.maps.Polyline({ map, path: [points.origin, points.destination], strokeColor: '#67d7d9', strokeOpacity: 0.85, strokeWeight: 4 });
  }
  return points;
}

function fitTrackingMapToTrip(map, position, routePoints, pathLocations = []) {
  if (!map || !window.google?.maps) return;
  const bounds = new google.maps.LatLngBounds();
  let hasBounds = false;
  [routePoints?.origin, routePoints?.destination, position].forEach((point) => {
    if (point && Number.isFinite(point.lat) && Number.isFinite(point.lng)) {
      bounds.extend(point);
      hasBounds = true;
    }
  });
  pathLocations.forEach((entry) => {
    const point = { lat: Number(entry.lat), lng: Number(entry.lng) };
    if (Number.isFinite(point.lat) && Number.isFinite(point.lng)) {
      bounds.extend(point);
      hasBounds = true;
    }
  });
  if (hasBounds) map.fitBounds(bounds, { top: 56, right: 48, bottom: 56, left: 48 });
}

function updateTrackingMap(location, pathLocations = [], rideRoute = null) {
  if (!location) return;
  const position = { lat: Number(location.lat), lng: Number(location.lng) };
  if (!window.google?.maps || !trackingMapDiv) {
    renderTrackingMapFallback(trackingMapDiv, position, 'Your live location');
    if (!trackingMapLoadPending) {
      trackingMapLoadPending = true;
      loadGoogleMapsAPI().then(() => {
        trackingMapLoadPending = false;
        if (window.google?.maps && lastTrackingLocation) {
          updateTrackingMap(lastTrackingLocation, lastTrackingLocations, lastTrackingRideRoute);
        }
      });
    }
    return;
  }
  trackingMapLoadPending = false;

  if (!trackingMap) {
    trackingMap = new google.maps.Map(trackingMapDiv, {
      zoom: 15, center: position,
      styles: UBER_MAP_STYLES,
      mapTypeControl: false, streetViewControl: false, fullscreenControl: false,
    });
    trackingMarker = new google.maps.Marker({ map: trackingMap, position, icon: makeCarIcon(), title: 'Your current location' });
    trackingPath = new google.maps.Polyline({ map: trackingMap, path: [], strokeColor: '#8fb8ff', strokeOpacity: 0.9, strokeWeight: 4 });
  } else {
    trackingMarker.setPosition(position);
  }
  const routePoints = drawTrackingRouteOverlay(trackingMap, rideRoute, {
    renderer: { get current() { return trackingRouteRenderer; }, set current(value) { trackingRouteRenderer = value; } },
    line: { get current() { return trackingRouteLine; }, set current(value) { trackingRouteLine = value; } },
    originMarker: { get current() { return trackingOriginMarker; }, set current(value) { trackingOriginMarker = value; } },
    destinationMarker: { get current() { return trackingDestinationMarker; }, set current(value) { trackingDestinationMarker = value; } },
    key: { get current() { return trackingRouteKey; }, set current(value) { trackingRouteKey = value; } },
  });
  if (trackingPath) {
    trackingPath.setPath(pathLocations.map((entry) => ({ lat: Number(entry.lat), lng: Number(entry.lng) })));
  }
  fitTrackingMapToTrip(trackingMap, position, routePoints, pathLocations);
}

function updateTrackingUi(location, locations = [], rideRoute = null) {
  if (!location) return;
  lastTrackingLocation = location;
  lastTrackingLocations = locations || [];
  lastTrackingRideRoute = rideRoute || null;
  updateTrackingMap(location, locations, rideRoute);
  const accuracy = location.accuracy ? ' within about ' + Math.round(location.accuracy) + ' meters' : '';
  trackingLastUpdate.textContent = 'Last update: ' + formatTrackingTime(location.recordedAt) + accuracy;
}

function setTrackingActive(isActive) {
  startTrackingButton.disabled = isActive;
  stopTrackingButton.disabled = !isActive;
  trackingStatus.textContent = isActive ? 'Sharing live location.' : 'Location sharing is off.';
  trackingRecipientEmail.disabled = false;
  sendTrackingInviteButton?.classList.toggle('hidden', !isActive);
}

async function sendTrackingLocation(position) {
  if (!activeTrackingTripId) return;
  const coords = position.coords;
  const data = await fetchJson('/api/trips/track/' + activeTrackingTripId + '/location', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      lat: coords.latitude,
      lng: coords.longitude,
      accuracy: coords.accuracy,
      speed: coords.speed,
      heading: coords.heading,
    }),
  });
  updateTrackingUi(data.trip.lastLocation, data.trip.locations || [], data.trip.rideRoute || null);
}

async function startTripTracking() {
  clearTrackingMessages();
  if (!navigator.geolocation) {
    trackingError.textContent = 'Location sharing is not supported in this browser.';
    trackingError.classList.add('show');
    return;
  }

  try {
    const trustedEmail = trackingRecipientEmail.value.trim();
    const data = await fetchJson('/api/trips/track/start', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ trustedEmail }) });
    activeTrackingTripId = data.id;
    activeTrackingViewerUrl = data.viewerUrl || '';
    copyTrackingLinkButton?.classList.toggle('hidden', !activeTrackingViewerUrl);
    updateTrackingDriverInfo();
    setTrackingActive(true);
    trackingMessage.textContent = data.rideRoute
      ? (data.message || 'Invite sent. Keep this page open while riding.')
      : 'Tracking started, but no active reserved ride route was found to draw yet.';
    trackingMessage.classList.add('show');
    trackingWatchId = navigator.geolocation.watchPosition(
      (position) => sendTrackingLocation(position).catch((err) => {
        trackingError.textContent = err.message;
        trackingError.classList.add('show');
      }),
      (error) => {
        trackingError.textContent = error.message || 'Unable to access your location.';
        trackingError.classList.add('show');
      },
      { enableHighAccuracy: true, maximumAge: 5000, timeout: 15000 }
    );
  } catch (err) {
    trackingError.textContent = err.message;
    trackingError.classList.add('show');
  }
}

async function sendTrackingInvite() {
  clearTrackingMessages();
  if (!activeTrackingTripId) {
    trackingError.textContent = 'No active tracking session. Start sharing your location first.';
    trackingError.classList.add('show');
    return;
  }
  const trustedEmail = trackingRecipientEmail.value.trim();
  if (!trustedEmail) {
    trackingError.textContent = 'Enter a trusted email to send an invite.';
    trackingError.classList.add('show');
    return;
  }
  try {
    const data = await fetchJson('/api/trips/track/' + activeTrackingTripId + '/trusted-email', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ trustedEmail }),
    });
    trackingRecipientEmail.value = data.trustedEmail || trustedEmail;
    trackingMessage.textContent = data.message || 'Tracking invite sent.';
    trackingMessage.classList.add('show');
  } catch (err) {
    trackingError.textContent = err.message;
    trackingError.classList.add('show');
  }
}

async function copyTrackingLink() {
  clearTrackingMessages();
  if (!activeTrackingViewerUrl) {
    trackingError.textContent = 'No tracking link available. Start sharing your location first.';
    trackingError.classList.add('show');
    return;
  }
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(activeTrackingViewerUrl);
    } else {
      const tempInput = document.createElement('input');
      tempInput.value = activeTrackingViewerUrl;
      document.body.appendChild(tempInput);
      tempInput.select();
      document.execCommand('copy');
      tempInput.remove();
    }
    trackingMessage.textContent = 'Tracking link copied.';
    trackingMessage.classList.add('show');
  } catch (err) {
    trackingError.textContent = 'Unable to copy link. ' + activeTrackingViewerUrl;
    trackingError.classList.add('show');
  }
}

async function stopTripTracking() {
  clearTrackingMessages();
  if (trackingWatchId !== null) {
    navigator.geolocation.clearWatch(trackingWatchId);
    trackingWatchId = null;
  }
  if (!activeTrackingTripId) {
    resetTrackingPage();
    return;
  }
  try {
    await fetchJson('/api/trips/track/' + activeTrackingTripId + '/stop', { method: 'POST' });
    resetTrackingPage();
    trackingMessage.textContent = 'Trip ended. Location sharing stopped.';
    trackingMessage.classList.add('show');
  } catch (err) {
    trackingError.textContent = err.message;
    trackingError.classList.add('show');
  }
}

function updateSharedTrackingMap(location, pathLocations = [], rideRoute = null) {
  const routePoints = getRoutePoints(rideRoute);
  const position = location ? { lat: Number(location.lat), lng: Number(location.lng) } : null;
  const hasPosition = position && Number.isFinite(position.lat) && Number.isFinite(position.lng);
  if (!hasPosition && !routePoints) {
    if (sharedTrackMapDiv) sharedTrackMapDiv.textContent = 'Waiting for live location...';
    return;
  }
  if (!window.google?.maps || !sharedTrackMapDiv) {
    if (hasPosition) {
      renderTrackingMapFallback(sharedTrackMapDiv, position, 'Shared live location');
    } else {
      sharedTrackMapDiv.textContent = 'Route: ' + (rideRoute?.origin || 'Pick-up') + ' to ' + (rideRoute?.destination || 'Drop-off');
    }
    return;
  }
  const center = hasPosition ? position : {
    lat: (routePoints.origin.lat + routePoints.destination.lat) / 2,
    lng: (routePoints.origin.lng + routePoints.destination.lng) / 2,
  };

  if (!sharedTrackingMap) {
    sharedTrackingMap = new google.maps.Map(sharedTrackMapDiv, {
      zoom: hasPosition ? 15 : 10, center,
      styles: UBER_MAP_STYLES,
      mapTypeControl: false, streetViewControl: false, fullscreenControl: false,
    });
    sharedTrackingPath = new google.maps.Polyline({ map: sharedTrackingMap, path: [], strokeColor: '#8fb8ff', strokeOpacity: 0.9, strokeWeight: 4 });
  } else if (hasPosition) {
    sharedTrackingMap.setCenter(position);
  }
  if (hasPosition && !sharedTrackingMarker) {
    sharedTrackingMarker = new google.maps.Marker({ map: sharedTrackingMap, position, icon: makeCarIcon(), title: 'Current rider location' });
  } else if (hasPosition) {
    sharedTrackingMarker.setPosition(position);
  }
  const drawnRoutePoints = drawTrackingRouteOverlay(sharedTrackingMap, rideRoute, {
    renderer: { get current() { return sharedTrackingRouteRenderer; }, set current(value) { sharedTrackingRouteRenderer = value; } },
    line: { get current() { return sharedTrackingRouteLine; }, set current(value) { sharedTrackingRouteLine = value; } },
    originMarker: { get current() { return sharedTrackingOriginMarker; }, set current(value) { sharedTrackingOriginMarker = value; } },
    destinationMarker: { get current() { return sharedTrackingDestinationMarker; }, set current(value) { sharedTrackingDestinationMarker = value; } },
    key: { get current() { return sharedTrackingRouteKey; }, set current(value) { sharedTrackingRouteKey = value; } },
  });
  if (sharedTrackingPath) {
    const path = pathLocations
      .map((entry) => ({ lat: Number(entry.lat), lng: Number(entry.lng) }))
      .filter((entry) => Number.isFinite(entry.lat) && Number.isFinite(entry.lng));
    if (hasPosition && !path.some((entry) => entry.lat === position.lat && entry.lng === position.lng)) {
      path.push(position);
    }
    sharedTrackingPath.setPath(path);
  }
  fitTrackingMapToTrip(sharedTrackingMap, hasPosition ? position : null, drawnRoutePoints, pathLocations);
}

async function loadSharedTrackingPage(viewerToken) {
  hideLegalPages();
  authSection.classList.add('hidden');
  dashboard.classList.add('hidden');
  sharedTrackPage.classList.remove('hidden');
  document.body.classList.remove('dashboard-mode');
  if (sharedTrackingPollId) {
    clearInterval(sharedTrackingPollId);
    sharedTrackingPollId = null;
  }

  const refresh = async () => {
    try {
      const trip = await fetchJson('/api/track/' + viewerToken);
      sharedTrackTitle.textContent = trip.ownerFirstName + '\'s live trip location';
      sharedTrackStatus.textContent = trip.status === 'active'
        ? 'Location sharing is active and updates every few seconds.'
        : 'Location sharing has stopped.';
      sharedTrackError.classList.remove('show');
      if (!trip.lastLocation) {
        updateSharedTrackingMap(null, [], trip.rideRoute || null);
        sharedTrackDetails.textContent = trip.rideRoute
          ? 'Route: ' + trip.rideRoute.origin + ' to ' + trip.rideRoute.destination + '. Waiting for the first live location update.'
          : 'Waiting for the rider to share their first location.';
        const routeUrl = getTrackingMapUrl(trip.rideRoute || null);
        sharedTrackMapLink.href = routeUrl;
        sharedTrackMapLink.textContent = trip.rideRoute ? 'Open route in Google Maps' : 'Open in Google Maps';
        sharedTrackMapLink.classList.toggle('hidden', routeUrl === '#');
        return;
      }
      const location = trip.lastLocation;
      updateSharedTrackingMap(location, trip.locations || [], trip.rideRoute || null);
      const routeLabel = trip.rideRoute ? ' · Route: ' + trip.rideRoute.origin + ' to ' + trip.rideRoute.destination : '';
      sharedTrackDetails.textContent = 'Last update: ' + formatTrackingTime(location.recordedAt) + routeLabel;
      sharedTrackMapLink.href = getTrackingMapUrl(null, location);
      sharedTrackMapLink.textContent = 'Open location in Google Maps';
      sharedTrackMapLink.classList.remove('hidden');
    } catch (err) {
      sharedTrackStatus.textContent = 'Location sharing unavailable.';
      sharedTrackError.textContent = err.message;
      sharedTrackError.classList.add('show');
      if (sharedTrackingPollId) {
        clearInterval(sharedTrackingPollId);
        sharedTrackingPollId = null;
      }
    }
  };

  await loadGoogleMapsAPI();
  await refresh();
  sharedTrackingPollId = setInterval(refresh, LIVE_TRACKING_POLL_MS);
}
function formatCents(cents) {
  return '$' + ((cents || 0) / 100).toFixed(2);
}

function formatMiles(miles) {
  const value = Number(miles) || 0;
  return value.toLocaleString(undefined, { maximumFractionDigits: value % 1 === 0 ? 0 : 1 }) + ' mi';
}

function formatRidePrice(ride) {
  return formatCents(ride.priceCents != null ? ride.priceCents : 500);
}

function formatDriverRating(ride) {
  const count = Number(ride.driverRatingCount || 0);
  const average = Number(ride.driverRatingAverage);
  if (!count || !Number.isFinite(average)) return 'No ratings yet';
  return average.toFixed(1) + '★ (' + count + ' rating' + (count === 1 ? '' : 's') + ')';
}

function formatDuration(minutes) {
  const value = Number(minutes);
  if (!Number.isFinite(value) || value <= 0) return 'About 90 min';
  const rounded = Math.round(value);
  if (rounded < 60) return rounded + ' min';
  const hours = Math.floor(rounded / 60);
  const remainder = rounded % 60;
  return hours + ' hr' + (hours === 1 ? '' : 's') + (remainder ? ' ' + remainder + ' min' : '');
}

function getTripEndTime(ride) {
  return getRideStartTime(ride) + (Number(ride.estimatedDurationMinutes || 90) * 60 * 1000);
}

async function estimateRideDurationMinutes(origin, destination, departureDate = '', departureTime = '') {
  const metrics = await estimateRideMetrics(origin, destination, departureDate, departureTime);
  return metrics.durationMinutes;
}

async function estimateRideMetrics(origin, destination, departureDate = '', departureTime = '') {
  await loadGoogleMapsAPI();
  if (!window.google?.maps?.DistanceMatrixService || !origin || !destination) {
    return { durationMinutes: null, distanceMiles: null };
  }
  return new Promise((resolve) => {
    const service = new google.maps.DistanceMatrixService();
    const request = {
      origins: [origin],
      destinations: [destination],
      travelMode: google.maps.TravelMode.DRIVING,
    };
    const departure = new Date(String(departureDate || '') + 'T' + String(departureTime || '00:00'));
    if (Number.isFinite(departure.getTime()) && departure.getTime() > Date.now()) {
      request.drivingOptions = { departureTime: departure };
    }
    service.getDistanceMatrix(request, (response, status) => {
      const element = response?.rows?.[0]?.elements?.[0];
      if (status !== 'OK' || element?.status !== 'OK') {
        resolve({ durationMinutes: null, distanceMiles: null });
        return;
      }
      const seconds = element.duration_in_traffic?.value || element.duration?.value;
      const meters = element.distance?.value;
      resolve({
        durationMinutes: seconds ? Math.max(5, Math.ceil(seconds / 60)) : null,
        distanceMiles: meters ? Math.round((meters / 1609.344) * 10) / 10 : null,
      });
    });
  });
}

function getRideMiles(ride) {
  const oneWayMiles = Number(ride.distanceMiles);
  const totalMiles = Number(ride.totalDistanceMiles);
  if (Number.isFinite(totalMiles)) return totalMiles;
  return Number.isFinite(oneWayMiles) ? oneWayMiles * (ride.returnRide ? 2 : 1) : 0;
}

function formatRideTime(time) {
  if (!time) return '';
  const [hours, minutes] = String(time).split(':');
  const date = new Date();
  date.setHours(Number(hours), Number(minutes || 0), 0, 0);
  return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
}
function formatRideDateTime(ride) {
  if (!ride?.date) return 'Date not set';
  const dateLabel = new Date(ride.date + 'T00:00:00').toLocaleDateString();
  const timeLabel = formatRideTime(ride.time);
  return timeLabel ? dateLabel + ' at ' + timeLabel : dateLabel;
}

function getRideStartTime(ride) {
  if (!ride?.date) return 0;
  const ts = new Date(ride.date + 'T' + (ride.time || '00:00')).getTime();
  return Number.isFinite(ts) ? ts : 0;
}

function hasRideDeparted(ride) {
  const start = getRideStartTime(ride);
  return Boolean(start && start <= Date.now());
}

function getCoordinateFromText(value) {
  const match = String(value || '').match(/Location \((-?\d+(?:\.\d+)?),\s*(-?\d+(?:\.\d+)?)\)/);
  return match ? { lat: Number(match[1]), lng: Number(match[2]) } : null;
}

function distanceBetweenCoordinates(start, end) {
  if (!start || !end) return null;
  const startLat = Number(start.lat);
  const startLng = Number(start.lng);
  const endLat = Number(end.lat);
  const endLng = Number(end.lng);
  if (![startLat, startLng, endLat, endLng].every(Number.isFinite)) return null;
  const earthRadiusMiles = 3958.8;
  const toRadians = (degrees) => degrees * Math.PI / 180;
  const latDelta = toRadians(endLat - startLat);
  const lngDelta = toRadians(endLng - startLng);
  const a = Math.sin(latDelta / 2) ** 2
    + Math.cos(toRadians(startLat)) * Math.cos(toRadians(endLat)) * Math.sin(lngDelta / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(earthRadiusMiles * c * 10) / 10;
}

function formatCoordinates(coordinate) {
  if (!coordinate) return 'Not set';
  return Number(coordinate.lat).toFixed(5) + ', ' + Number(coordinate.lng).toFixed(5);
}

function getCoordinateMarkup(item) {
  return `
    <div><strong>Pick-up coordinates:</strong> ${formatCoordinates(getRideOriginCoordinate(item))}</div>
    <div><strong>Drop-off coordinates:</strong> ${formatCoordinates(getRideDestinationCoordinate(item))}</div>
  `;
}

function getRideOriginCoordinate(ride) {
  if (Number.isFinite(Number(ride.originLat)) && Number.isFinite(Number(ride.originLng))) return { lat: Number(ride.originLat), lng: Number(ride.originLng) };
  return getCoordinateFromText(ride.origin);
}

function getRideDestinationCoordinate(ride) {
  if (Number.isFinite(Number(ride.destinationLat)) && Number.isFinite(Number(ride.destinationLng))) return { lat: Number(ride.destinationLat), lng: Number(ride.destinationLng) };
  return getCoordinateFromText(ride.destination);
}

function getRadiusCenter(input) {
  if (Number.isFinite(Number(input.dataset.lat)) && Number.isFinite(Number(input.dataset.lng))) {
    return { lat: Number(input.dataset.lat), lng: Number(input.dataset.lng) };
  }
  return getCoordinateFromText(input.value);
}

function milesToMeters(miles) {
  return Number(miles) * 1609.344;
}

function getAlphabetLabel(index) {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  if (index < alphabet.length) return alphabet[index];
  return alphabet[index % alphabet.length] + Math.floor(index / alphabet.length + 1);
}


function ensureBrowseRadiusMap() {
  if (!window.google?.maps || !browseRadiusMapDiv) return null;
  if (!browseRadiusMap) {
    browseRadiusMap = new google.maps.Map(browseRadiusMapDiv, {
      zoom: 12,
      center: { lat: 34.069, lng: -118.445 },
      styles: UBER_MAP_STYLES,
      mapTypeControl: false, streetViewControl: false, fullscreenControl: false,
    });
  }
  return browseRadiusMap;
}

function clearBrowseResultMarkers() {
  browseResultMarkers.forEach((marker) => marker.setMap(null));
  browseResultMarkers = [];
  browseRideRoutes.forEach((r) => { try { r.setMap(null); } catch (_) {} });
  browseRideRoutes = [];
  browseRideOriginMarkers.forEach((m) => m.setMap(null));
  browseRideOriginMarkers = [];
  browsePinLabels = new Map();
}

function clearBrowseRoute() {
  if (browseRouteLine) browseRouteLine.setMap(null);
  browseRouteLine = null;
  if (browseRouteRenderer) browseRouteRenderer.setMap(null);
  browseRouteRenderer = null;
}

function drawBrowseRoute(map, pickupCenter, dropoffCenter) {
  clearBrowseRoute();
  if (!map || !pickupCenter || !dropoffCenter || browseRole !== 'rider') return;
  if (google.maps.DirectionsService && google.maps.DirectionsRenderer) {
    const service = new google.maps.DirectionsService();
    browseRouteRenderer = new google.maps.DirectionsRenderer({
      map,
      suppressMarkers: true,
      preserveViewport: true,
      polylineOptions: { strokeColor: '#67d7d9', strokeOpacity: 0.95, strokeWeight: 5 },
    });
    service.route({ origin: pickupCenter, destination: dropoffCenter, travelMode: google.maps.TravelMode.DRIVING }, (result, status) => {
      if (status === 'OK') {
        browseRouteRenderer.setDirections(result);
      } else {
        browseRouteLine = new google.maps.Polyline({ map, path: [pickupCenter, dropoffCenter], strokeColor: '#67d7d9', strokeOpacity: 0.9, strokeWeight: 4 });
      }
    });
    return;
  }
  browseRouteLine = new google.maps.Polyline({ map, path: [pickupCenter, dropoffCenter], strokeColor: '#67d7d9', strokeOpacity: 0.9, strokeWeight: 4 });
}

function drawRadiusCircle(existingCircle, center, miles, color) {
  const map = ensureBrowseRadiusMap();
  if (!map || !center || !(Number(miles) > 0)) {
    if (existingCircle) existingCircle.setMap(null);
    return null;
  }
  const options = {
    map,
    center,
    radius: milesToMeters(miles),
    fillColor: color,
    fillOpacity: 0.13,
    strokeColor: color,
    strokeOpacity: 0.85,
    strokeWeight: 2,
  };
  if (existingCircle) {
    existingCircle.setOptions(options);
    return existingCircle;
  }
  return new google.maps.Circle(options);
}

function drawRideRouteOnMap(map, originPos, destPos, onRendererReady) {
  const routeColor = '#a78bfa';
  if (google.maps.DirectionsService && google.maps.DirectionsRenderer) {
    const renderer = new google.maps.DirectionsRenderer({
      map,
      suppressMarkers: true,
      preserveViewport: true,
      polylineOptions: { strokeColor: routeColor, strokeOpacity: 0.72, strokeWeight: 4 },
    });
    new google.maps.DirectionsService().route(
      { origin: originPos, destination: destPos, travelMode: google.maps.TravelMode.DRIVING },
      (result, status) => {
        if (status === 'OK') {
          renderer.setDirections(result);
        } else {
          renderer.setMap(null);
          const line = new google.maps.Polyline({
            map, path: [originPos, destPos],
            strokeColor: routeColor, strokeOpacity: 0.65, strokeWeight: 3,
            icons: [{ icon: { path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW, scale: 3 }, offset: '60%' }],
          });
          browseRideRoutes.push(line);
        }
      }
    );
    browseRideRoutes.push(renderer);
    if (onRendererReady) onRendererReady(renderer);
  } else {
    const line = new google.maps.Polyline({
      map, path: [originPos, destPos],
      strokeColor: routeColor, strokeOpacity: 0.65, strokeWeight: 3,
    });
    browseRideRoutes.push(line);
  }
}

function placePinForItem(map, item, index, originPos, destPos, pickupCenter, dropoffCenter, cardSelector) {
  const pinLabel = getAlphabetLabel(index);
  const pickupDistance = pickupCenter && originPos ? distanceBetweenCoordinates(pickupCenter, originPos) : null;
  const dropoffDistance = dropoffCenter && destPos ? distanceBetweenCoordinates(dropoffCenter, destPos) : null;
  browsePinLabels.set(item.id, { label: pinLabel, pickupDistance, dropoffDistance });

  // Route line: pickup → destination
  if (originPos && destPos) {
    drawRideRouteOnMap(map, originPos, destPos);
  }

  // Small dot at pickup
  if (originPos) {
    const dot = new google.maps.Marker({
      map, position: originPos, icon: makeRideOriginDot(),
      title: 'Pickup: ' + (item.origin || ''), zIndex: 5,
    });
    browseRideOriginMarkers.push(dot);
  }

  // Lettered pin at destination
  const pinPos = destPos || originPos;
  if (!pinPos) return null;
  const marker = new google.maps.Marker({
    map, position: pinPos, icon: makeLetterIcon(pinLabel),
    title: pinLabel + ': ' + (item.origin || '') + ' → ' + (item.destination || '')
      + (dropoffDistance !== null ? ' (' + formatMiles(dropoffDistance) + ' from your destination)' : ''),
    zIndex: 10 + index,
  });
  marker.addListener('click', () => {
    const cardEl = document.querySelector(cardSelector);
    if (cardEl) {
      cardEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      cardEl.classList.add('map-pin-highlight');
      setTimeout(() => cardEl.classList.remove('map-pin-highlight'), 1800);
    }
  });
  browseResultMarkers.push(marker);
  return marker;
}

function updateBrowseRadiusMap(items = []) {
  const map = ensureBrowseRadiusMap();
  if (!map) return;

  const pickupCenter = getRadiusCenter(pickupRadiusLocationInput);
  const dropoffCenter = getRadiusCenter(dropoffRadiusLocationInput);
  const pickupMiles = Number(pickupRadiusMilesInput.value);
  const dropoffMiles = Number(dropoffRadiusMilesInput.value);
  const hasPickupRadius = pickupCenter && pickupMiles > 0;
  const hasDropoffRadius = dropoffCenter && dropoffMiles > 0;

  // Always draw radius circles for both modes
  browsePickupCircle = drawRadiusCircle(browsePickupCircle, pickupCenter, pickupMiles, '#3ecfcf');
  browseDropoffCircle = drawRadiusCircle(browseDropoffCircle, dropoffCenter, dropoffMiles, '#4d9ef5');

  clearBrowseResultMarkers();
  drawBrowseRoute(map, pickupCenter, dropoffCenter);

  // User pickup marker (teal origin dot) — show in both modes
  if (pickupCenter) {
    if (!browsePickupMarker) browsePickupMarker = new google.maps.Marker({ map, icon: makeOriginIcon(), title: browseRole === 'driver' ? 'Your willing pickup area' : 'Your pickup area' });
    browsePickupMarker.setMap(map);
    browsePickupMarker.setPosition(pickupCenter);
    browsePickupMarker.setTitle(browseRole === 'driver' ? 'Driver pickup detour area' : 'How far you will walk to pickup');
  } else if (browsePickupMarker) {
    browsePickupMarker.setMap(null);
  }

  // User dropoff marker (blue destination) — show in both modes
  if (dropoffCenter) {
    if (!browseDropoffMarker) browseDropoffMarker = new google.maps.Marker({ map, icon: makeDestinationIcon(), title: browseRole === 'driver' ? 'Your willing drop-off area' : 'Your desired destination' });
    browseDropoffMarker.setMap(map);
    browseDropoffMarker.setPosition(dropoffCenter);
    browseDropoffMarker.setTitle(browseRole === 'driver' ? 'Driver drop-off detour area' : 'How far you will walk from drop-off');
  } else if (browseDropoffMarker) {
    browseDropoffMarker.setMap(null);
  }

  const bounds = new google.maps.LatLngBounds();
  let hasBounds = false;
  [pickupCenter, dropoffCenter].forEach((pt) => { if (pt) { bounds.extend(pt); hasBounds = true; } });

  // Sort items by proximity to dropoff center
  const sortedItems = [...items].sort((a, b) => {
    if (!dropoffCenter) return getRideStartTime(a) - getRideStartTime(b);
    const aDist = distanceBetweenCoordinates(dropoffCenter, getRideDestinationCoordinate(a));
    const bDist = distanceBetweenCoordinates(dropoffCenter, getRideDestinationCoordinate(b));
    return (aDist ?? Infinity) - (bDist ?? Infinity);
  });

  // Place pins + routes for every visible item (both rider and driver mode)
  sortedItems.forEach((item, index) => {
    const originPos = getRideOriginCoordinate(item);
    const destPos = getRideDestinationCoordinate(item);
    placePinForItem(map, item, index, originPos, destPos, pickupCenter, dropoffCenter, '[data-ride-id="' + item.id + '"]');
    [originPos, destPos].forEach((pt) => { if (pt) { bounds.extend(pt); hasBounds = true; } });
  });

  if (hasBounds) map.fitBounds(bounds, { top: 48, right: 32, bottom: 48, left: 32 });

  // Map hint
  let hintText = '';
  if (sortedItems.length) {
    if (browseRole === 'rider') {
      hintText = 'Teal circle = how far you will walk to pickup · Blue circle = how far you will walk from drop-off · pins A B C… = rides';
    } else {
      hintText = 'Teal circle = pickup detour you will drive · Blue circle = drop-off detour you will drive · pins A B C… = rider requests';
    }
  } else if (hasPickupRadius || hasDropoffRadius) {
    hintText = browseRole === 'driver' ? 'Teal circle = pickup detour you will drive · Blue circle = drop-off detour you will drive' : 'Teal circle = how far you will walk to pickup · Blue circle = how far you will walk from drop-off';
  }
  if (browseMapHintPanel) browseMapHintPanel.textContent = hintText;
  if (browseMapHint) {
    browseMapHint.textContent = hintText;
    browseMapHint.classList.toggle('active', !!hintText);
  }
}

function matchesRadiusFilter(item, type) {
  const pickupMiles = Number(pickupRadiusMilesInput.value);
  const dropoffMiles = Number(dropoffRadiusMilesInput.value);
  const itemPickupFlexMiles = Number(item.pickupRadiusMiles || 0);
  const itemDropoffFlexMiles = Number(item.dropoffRadiusMiles || 0);
  const hasPickupRadius = Number.isFinite(pickupMiles) && pickupMiles > 0;
  const hasDropoffRadius = Number.isFinite(dropoffMiles) && dropoffMiles > 0;
  if (!hasPickupRadius && !hasDropoffRadius) return true;

  const pickupCenter = getRadiusCenter(pickupRadiusLocationInput);
  const dropoffCenter = getRadiusCenter(dropoffRadiusLocationInput);
  if (hasPickupRadius && !pickupCenter) return true;
  if (hasDropoffRadius && !dropoffCenter) return true;

  const originCoordinate = getRideOriginCoordinate(item);
  const destinationCoordinate = getRideDestinationCoordinate(item);
  if (hasPickupRadius) {
    const pickupDistance = distanceBetweenCoordinates(pickupCenter, originCoordinate);
    if (pickupDistance === null || pickupDistance > pickupMiles + (Number.isFinite(itemPickupFlexMiles) ? itemPickupFlexMiles : 0)) return false;
  }
  if (hasDropoffRadius) {
    const dropoffDistance = distanceBetweenCoordinates(dropoffCenter, destinationCoordinate);
    if (dropoffDistance === null || dropoffDistance > dropoffMiles + (Number.isFinite(itemDropoffFlexMiles) ? itemDropoffFlexMiles : 0)) return false;
  }
  return true;
}


function canMatchSameGender(riderGender, driverGender) {
  const hiddenValues = ['', 'prefer-not-to-say', undefined, null];
  if (hiddenValues.includes(riderGender) || hiddenValues.includes(driverGender)) return false;
  return riderGender === driverGender;
}

function canCurrentUserSeeRide(ride) {
  if (ride.driverId === currentUser?.id) return false;
  if (hasRideDeparted(ride)) return false;
  if (Number(ride.seatsAvailable || 0) <= 0) return false;
  if (sameSchoolOnlyFilter?.checked && ride.university !== currentUser.university) return false;
  if (ride.sameSchoolOnly && ride.university !== currentUser.university) return false;
  const sameGenderMatch = canMatchSameGender(currentUser.gender, ride.driverGender);
  if (ride.sameGenderOnly && !sameGenderMatch) return false;
  if (sameGenderDriversOnlyFilter.checked && !sameGenderMatch) return false;
  return true;
}

function rideMatchesBrowseFilters(ride) {
  const search = rideSearchInput.value.trim().toLowerCase();
  if (search) {
    const haystack = [ride.origin, ride.destination, ride.driverFirstName, ride.driverLastName, ride.notes].join(' ').toLowerCase();
    if (!haystack.includes(search)) return false;
  }

  if (rideFilterDateInput.value && ride.date !== rideFilterDateInput.value) return false;

  const minSeats = Number(rideFilterSeatsInput.value);
  if (Number.isFinite(minSeats) && minSeats > 0 && Number(ride.seatsAvailable) < minSeats) return false;

  const maxPriceCents = Math.round(Number(rideFilterMaxPriceInput.value) * 100);
  if (Number.isFinite(maxPriceCents) && maxPriceCents > 0 && Number(ride.priceCents || 0) > maxPriceCents) return false;

  return true;
}

function sortVisibleRides(rides) {
  const sorted = [...rides];
  if (rideSortSelect.value === 'price-low') {
    return sorted.sort((a, b) => (a.priceCents || 0) - (b.priceCents || 0));
  }
  if (rideSortSelect.value === 'price-high') {
    return sorted.sort((a, b) => (b.priceCents || 0) - (a.priceCents || 0));
  }
  if (rideSortSelect.value === 'seats-high') {
    return sorted.sort((a, b) => Number(b.seatsAvailable || 0) - Number(a.seatsAvailable || 0));
  }
  return sorted.sort((a, b) => getRideStartTime(a) - getRideStartTime(b));
}


function getFlexRadiusMarkup(item, mode = 'driver') {
  const pickup = Number(item.pickupRadiusMiles || 0);
  const dropoff = Number(item.dropoffRadiusMiles || 0);
  if (!(pickup > 0) && !(dropoff > 0)) return '';
  const pickupLabel = mode === 'rider' ? 'Pickup walking radius' : 'Pickup detour radius';
  const dropoffLabel = mode === 'rider' ? 'Drop-off walking radius' : 'Drop-off detour radius';
  return [
    '<div><strong>' + pickupLabel + ':</strong> ' + esc(pickup > 0 ? formatMiles(pickup) : 'Exact') + '</div>',
    '<div><strong>' + dropoffLabel + ':</strong> ' + esc(dropoff > 0 ? formatMiles(dropoff) : 'Exact') + '</div>',
  ].join('');
}

function rideNeedsRiderPickup(ride) {
  return ride?.rideProviderType === 'personal_car' && Number(ride?.pickupRadiusMiles || 0) > 0;
}

function rideNeedsRiderDropoff(ride) {
  return ride?.rideProviderType === 'personal_car' && Number(ride?.dropoffRadiusMiles || 0) > 0;
}

function getRiderStopFieldsMarkup(ride) {
  if (!rideNeedsRiderPickup(ride) && !rideNeedsRiderDropoff(ride)) return '';
  return `
    <div class="rider-stop-fields" data-rider-stop-fields="${esc(ride.id)}">
      <div class="rider-stop-fields-title">Your exact ride spots</div>
      ${rideNeedsRiderPickup(ride) ? `<label>Actual pickup spot <input type="text" data-rider-pickup="${esc(ride.id)}" maxlength="180" placeholder="Dorm, building, address, or landmark" value="${esc(ride.actualPickup || '')}" /></label>` : ''}
      ${rideNeedsRiderDropoff(ride) ? `<label>Actual drop-off spot <input type="text" data-rider-dropoff="${esc(ride.id)}" maxlength="180" placeholder="Exact address, terminal, or landmark" value="${esc(ride.actualDropoff || '')}" /></label>` : ''}
    </div>
  `;
}

function getRiderStopPayload(ride) {
  const rideId = String(ride.id || '').replace(/"/g, '\\"');
  return {
    actualPickup: rideNeedsRiderPickup(ride) ? (document.querySelector(`[data-rider-pickup="${rideId}"]`)?.value || '').trim() : '',
    actualDropoff: rideNeedsRiderDropoff(ride) ? (document.querySelector(`[data-rider-dropoff="${rideId}"]`)?.value || '').trim() : '',
  };
}

function getRiderStopDetailMarkup(item) {
  const rows = [];
  if (item.actualPickup) rows.push(`<div><strong>Actual pickup:</strong> ${esc(item.actualPickup)}</div>`);
  if (item.actualDropoff) rows.push(`<div><strong>Actual drop-off:</strong> ${esc(item.actualDropoff)}</div>`);
  return rows.join('');
}

function appendPassengerStopDetails(container, passenger) {
  const details = [];
  if (passenger?.actualPickup) details.push('Pickup: ' + passenger.actualPickup);
  if (passenger?.actualDropoff) details.push('Drop-off: ' + passenger.actualDropoff);
  if (!details.length) return;
  const note = document.createElement('span');
  note.className = 'seat-manifest-stop-note';
  note.textContent = details.join(' · ');
  container.appendChild(note);
}

function esc(str) {
  return String(str ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

async function reportUser({ reportedUserId, reportedUserName = 'this user', rideId }) {
  if (!reportedUserId || !rideId) return;
  const reason = window.prompt('Why are you reporting ' + reportedUserName + '?');
  if (reason === null) return;
  const trimmedReason = reason.trim();
  if (!trimmedReason) {
    showToast('Add a short reason before submitting a report.', 'error');
    return;
  }
  const details = window.prompt('Add any details LinkUp should review. This is optional.') || '';
  try {
    const response = await fetchJson('/api/reports', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        reportedUserId,
        rideId,
        reason: trimmedReason,
        details: details.trim(),
      }),
    });
    showToast(response.message || 'Report submitted.', 'success');
  } catch (err) {
    showToast(err.message || 'Unable to submit report.', 'error');
  }
}

function createReportUserButton({ reportedUserId, reportedUserName, rideId, label = 'Report user' }) {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'report-user-button';
  button.textContent = label;
  button.addEventListener('click', () => {
    reportUser({ reportedUserId, reportedUserName, rideId });
  });
  return button;
}

function publicProfileLinkMarkup(userId, label) {
  const name = label || 'LinkUp user';
  if (!userId) return esc(name);
  return '<button type="button" class="user-profile-link" data-user-id="' + esc(userId) + '">' + esc(name) + '</button>';
}

function createPublicProfileLink(userId, label) {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'user-profile-link';
  button.dataset.userId = userId || '';
  button.textContent = label || 'LinkUp user';
  return button;
}

function renderRideCard(ride) {
  const card = document.createElement('div');
  card.className = 'ride-card';
  card.dataset.rideId = ride.id;
  const pinInfo = browsePinLabels.get(ride.id);
  if (pinInfo) {
    const pinBadge = document.createElement('div');
    pinBadge.className = 'browse-ride-pin-badge';
    const pickupPart = pinInfo.pickupDistance !== null && pinInfo.pickupDistance !== undefined ? formatMiles(pinInfo.pickupDistance) + ' from your pickup point' : '';
    const dropoffPart = pinInfo.dropoffDistance !== null && pinInfo.dropoffDistance !== undefined ? formatMiles(pinInfo.dropoffDistance) + ' from your destination' : '';
    const distParts = [pickupPart, dropoffPart].filter(Boolean).join(' · ');
    pinBadge.innerHTML = '<span class="request-pin-label">' + esc(pinInfo.label) + '</span><span>Pin ' + esc(pinInfo.label) + (distParts ? ' · ' + esc(distParts) : '') + '</span>';
    card.appendChild(pinBadge);
  }
  const title = document.createElement('h4');
  title.textContent = `${ride.origin} → ${ride.destination}`;
  card.appendChild(title);
  const details = document.createElement('div');
  details.className = 'ride-details';
  const driverName = [ride.driverFirstName, ride.driverLastName].filter(Boolean).join(' ') || 'Driver';
  details.innerHTML = `
    <div><strong>Driver:</strong> ${publicProfileLinkMarkup(ride.driverId, driverName)}</div>
    <div><strong>School:</strong> ${esc(ride.university || 'Unknown school')}</div>
    <div><strong>Driver rating:</strong> ${esc(formatDriverRating(ride))}</div>
    <div><strong>Preference:</strong> ${ride.sameGenderOnly ? 'Same gender riders only' : 'Open to all riders'}</div>
    ${ride.sameSchoolOnly ? '<div><strong>School restriction:</strong> Same school riders only</div>' : ''}
    ${getFlexRadiusMarkup(ride, 'driver')}
    <div><strong>Departure:</strong> ${esc(formatRideDateTime(ride))}</div>
    <div><strong>Estimated ride time:</strong> ${esc(formatDuration(ride.estimatedDurationMinutes))}</div>
    ${ride.returnRide ? `<div><strong>Return:</strong> ${esc(formatRideDateTime(ride.returnRide))}</div>` : ''}
    <div><strong>Seats left:</strong> ${esc(ride.seatsAvailable)}</div>
    ${ride.seatingChartUnavailable ? '<div><strong>Seats:</strong> Seating chart unavailable</div>' : ''}
    <div><strong>Miles:</strong> ${esc(formatMiles(getRideMiles(ride)))}</div>
    <div><strong>Price:</strong> ${esc(formatRidePrice(ride))}</div>
    ${getVehicleDetailMarkup(ride)}
    ${ride.notes ? `<div><strong>Notes:</strong> ${esc(ride.notes)}</div>` : ''}
  `;
  card.appendChild(details);
  if (ride.driverId === currentUser.id) {
    if (ride.seatingChartUnavailable) {
      const notice = document.createElement('div');
      notice.className = 'seat-picker-hint shared-seat-notice';
      notice.textContent = ride.rideProviderType === 'rideshare_service'
        ? 'Rideshare service — riders reserve general spots.'
        : 'Seating chart unavailable for this shared ride.';
      card.appendChild(notice);
    } else {
      const readonlyPicker = document.createElement('div');
      readonlyPicker.className = 'ride-seat-picker';
      const label = document.createElement('div');
      label.className = 'seat-picker-title';
      label.textContent = 'Seat layout';
      readonlyPicker.appendChild(label);
      readonlyPicker.appendChild(createSeatLayout({ seatMap: ride.seatMap || [], ride }));
      card.appendChild(readonlyPicker);
    }
  } else {
    const cartActionButton = document.createElement('button');
    const isInCart = cartRideIds.has(ride.id);
    const selectedSeatId = selectedSeatByRide.get(ride.id) || '';
    const cardError = document.createElement('div');
    cardError.className = 'error-message';
    if (ride.seatingChartUnavailable) {
      cartActionButton.textContent = isInCart ? 'In cart' : 'Reserve shared spot';
      cartActionButton.disabled = isInCart || ride.seatsAvailable <= 0;
      const notice = document.createElement('div');
      notice.className = 'seat-picker-hint shared-seat-notice';
      notice.textContent = ride.rideProviderType === 'rideshare_service'
        ? 'Rideshare service — reserving a general rider spot.'
        : 'Seating chart unavailable — reserving a general shared spot.';
      card.appendChild(notice);
    } else {
      cartActionButton.textContent = isInCart ? 'In cart' : (selectedSeatId ? 'Reserve ' + getSeatLabel(selectedSeatId) : 'Select a seat');
      cartActionButton.disabled = isInCart || !selectedSeatId || ride.seatsAvailable <= 0;
      card.appendChild(renderRideSeatPicker(ride, cartActionButton));
    }
    if (!isInCart && (rideNeedsRiderPickup(ride) || rideNeedsRiderDropoff(ride))) {
      const stops = document.createElement('div');
      stops.innerHTML = getRiderStopFieldsMarkup(ride);
      card.appendChild(stops.firstElementChild);
    }
    const riderTermsLabel = document.createElement('label');
    riderTermsLabel.className = 'checkbox-label terms-agreement rider-terms-agreement';
    const riderTermsCheckbox = document.createElement('input');
    riderTermsCheckbox.type = 'checkbox';
    riderTermsLabel.append(
      riderTermsCheckbox,
      document.createTextNode(' I agree to LinkUp\'s Terms for this ride.')
    );
    card.appendChild(riderTermsLabel);

    cartActionButton.onclick = async () => {
      cardError.textContent = '';
      cardError.classList.remove('show');
      if (!riderTermsCheckbox.checked) {
        cardError.textContent = 'You must agree to the Terms and Conditions before adding this ride.';
        cardError.classList.add('show');
        return;
      }
      try {
        const seatId = ride.seatingChartUnavailable ? '' : selectedSeatByRide.get(ride.id);
        const riderStops = getRiderStopPayload(ride);
        if (rideNeedsRiderPickup(ride) && !riderStops.actualPickup) {
          cardError.textContent = 'Enter your actual pickup spot for this ride.';
          cardError.classList.add('show');
          return;
        }
        if (rideNeedsRiderDropoff(ride) && !riderStops.actualDropoff) {
          cardError.textContent = 'Enter your actual drop-off spot for this ride.';
          cardError.classList.add('show');
          return;
        }
        await fetchJson(`/api/cart/${ride.id}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ seatId, ...riderStops, termsAccepted: true }) });
        await loadCart();
        loadRides();
      } catch (err) {
        cardError.textContent = err.message;
        cardError.classList.add('show');
      }
    };
    card.appendChild(cartActionButton);
    card.appendChild(createReportUserButton({
      reportedUserId: ride.driverId,
      reportedUserName: [ride.driverFirstName, ride.driverLastName].filter(Boolean).join(' ') || 'the driver',
      rideId: ride.id,
      label: 'Report driver',
    }));
    card.appendChild(cardError);
  }
  const riders = document.createElement('div');
  riders.className = 'ride-card-passengers';
  const passengerCount = (ride.passengers || []).length;
  riders.textContent = passengerCount === 0 ? 'No passengers yet' : passengerCount + ' passenger' + (passengerCount === 1 ? '' : 's');
  card.appendChild(riders);
  return card;
}
function getCurrentUserSeatId(ride) {
  if (ride.selectedSeatId) return ride.selectedSeatId;
  const passenger = getCurrentUserPassenger(ride);
  return passenger?.seatId || '';
}

function getCurrentUserPassenger(ride) {
  return (ride.passengers || []).find((p) => p.studentId === currentUser?.id) || null;
}

function canSeeRideLicensePlate(ride) {
  return ride.driverId === currentUser?.id || Boolean(getCurrentUserSeatId(ride));
}

function getVehicleDetailMarkup(ride) {
  if (ride.rideProviderType === 'rideshare_service') {
    return `<div><strong>Ride provider:</strong> ${esc(ride.rideshareService || 'Rideshare service')}</div>`;
  }
  const vehicleName = [ride.carColor, ride.carMaker, ride.carModel].filter(Boolean).join(' ');
  const licenseMarkup = canSeeRideLicensePlate(ride) && ride.licensePlate
    ? `<div><strong>License plate:</strong> ${ride.licensePlate}</div>`
    : '';
  return `${vehicleName ? `<div><strong>Vehicle:</strong> ${vehicleName}</div>` : ''}${licenseMarkup}`;
}

function formatChatTime(value) {
  if (!value) return '';
  return new Date(value).toLocaleString([], { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
}

function setRideChatDisabledState(form, disabled, disabledAt) {
  if (!form) return;
  const input = form.querySelector('input');
  const button = form.querySelector('button');
  let notice = form.parentElement?.querySelector('.ride-chat-disabled-note');
  if (!notice && form.parentElement) {
    notice = document.createElement('div');
    notice.className = 'ride-chat-disabled-note';
    form.parentElement.insertBefore(notice, form);
  }
  if (input) input.disabled = disabled;
  if (button) button.disabled = disabled;
  if (disabled) {
    const dateText = disabledAt ? formatChatTime(disabledAt) : 'after the ride ended';
    if (input) input.placeholder = 'Chat disabled';
    if (notice) notice.textContent = 'Chat disabled. This ride chat closed on ' + dateText + '.';
  } else {
    if (input) input.placeholder = 'Message the driver and riders...';
    if (notice) notice.textContent = '';
  }
}

async function loadRideChat(rideId, listElement, errorElement, formElement) {
  listElement.textContent = 'Loading chat...';
  if (errorElement) {
    errorElement.textContent = '';
    errorElement.classList.remove('show');
  }
  try {
    const data = await fetchJson('/api/rides/' + rideId + '/messages');
    setRideChatDisabledState(formElement, data.chatDisabled, data.chatDisabledAt);
    listElement.innerHTML = '';
    if (!data.messages.length) {
      listElement.textContent = 'No messages yet.';
      return;
    }
    data.messages.forEach((message) => {
      const item = document.createElement('div');
      item.className = 'chat-message' + (message.senderId === currentUser?.id ? ' mine' : '');
      const meta = document.createElement('div');
      meta.className = 'chat-message-meta';
      meta.append(
        createPublicProfileLink(message.senderId, message.senderFirstName || 'Student'),
        document.createTextNode(' · ' + (message.senderRole || 'Rider') + ' · ' + formatChatTime(message.createdAt))
      );
      const textDiv = document.createElement('div');
      textDiv.className = 'chat-message-text';
      textDiv.textContent = message.text;
      item.append(meta, textDiv);
      listElement.appendChild(item);
    });
    listElement.scrollTop = listElement.scrollHeight;
  } catch (err) {
    listElement.textContent = '';
    if (errorElement) {
      errorElement.textContent = err.message;
      errorElement.classList.add('show');
    }
  }
}

function createChatRideDetails(ride) {
  const details = document.createElement('div');
  details.className = 'chat-ride-details';
  const driverName = [ride.driverFirstName, ride.driverLastName].filter(Boolean).join(' ') || 'Driver';
  const riderCount = (ride.passengers || []).length;
  details.innerHTML = `
    <h4>${esc(ride.origin)} → ${esc(ride.destination)}</h4>
    <div class="chat-ride-detail-grid">
      <div><strong>Date:</strong> ${esc(new Date(ride.date + 'T00:00:00').toLocaleDateString())}</div>
      <div><strong>Time:</strong> ${esc(formatRideTime(ride.time) || 'Time not set')}</div>
      <div><strong>Driver:</strong> ${publicProfileLinkMarkup(ride.driverId, driverName)}</div>
      <div><strong>Riders:</strong> ${esc(riderCount)}</div>
      <div><strong>Estimated ride time:</strong> ${esc(formatDuration(ride.estimatedDurationMinutes))}</div>
      <div><strong>Your role:</strong> ${esc(getChatRideRole(ride))}</div>
    </div>
  `;
  return details;
}

function createRideChat(ride, options = {}) {
  const wrapper = document.createElement('div');
  wrapper.className = 'ride-chat' + (options.fullPage ? ' ride-chat-full' : '');

  const header = document.createElement('div');
  header.className = 'ride-chat-header';

  const title = document.createElement('strong');
  title.textContent = options.title || 'Ride chat';

  const refreshButton = document.createElement('button');
  refreshButton.type = 'button';
  refreshButton.textContent = 'Refresh';

  header.append(title, refreshButton);

  const messages = document.createElement('div');
  messages.className = 'ride-chat-messages';

  const form = document.createElement('form');
  form.className = 'ride-chat-form';

  const input = document.createElement('input');
  input.type = 'text';
  input.maxLength = 500;
  input.placeholder = 'Message the driver and riders...';

  const sendButton = document.createElement('button');
  sendButton.type = 'submit';
  sendButton.textContent = 'Send';

  const error = document.createElement('div');
  error.className = 'error-message';

  form.append(input, sendButton);
  if (options.fullPage) {
    wrapper.append(header, createChatRideDetails(ride), messages, form, error);
  } else {
    wrapper.append(header, messages, form, error);
  }

  refreshButton.addEventListener('click', () => loadRideChat(ride.id, messages, error, form));
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const text = input.value.trim();
    if (!text) return;
    try {
      await fetchJson('/api/rides/' + ride.id + '/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });
      input.value = '';
      loadRideChat(ride.id, messages, error, form);
    } catch (err) {
      error.textContent = err.message;
      error.classList.add('show');
    }
  });

  loadRideChat(ride.id, messages, error, form);
  return wrapper;
}

function getChatRideRole(ride) {
  return ride.driverId === currentUser?.id ? 'Driver' : 'Rider';
}

function getChatRideTitle(ride) {
  return ride.origin + ' to ' + ride.destination + ' - ' + formatRideDateTime(ride);
}

async function loadChatPage() {
  chatRideList.textContent = 'Loading ride chats...';
  chatConversation.innerHTML = '<p>Select a ride to open its chat.</p>';
  try {
    const data = await fetchJson('/api/profile');
    const rides = [
      ...(data.createdRides || []),
      ...(data.joinedRides || []),
    ].sort((a, b) => getRideStartTime(a) - getRideStartTime(b));
    chatRideList.innerHTML = '';
    if (!rides.length) {
      chatRideList.textContent = 'No confirmed ride chats yet.';
      return;
    }
    rides.forEach((ride) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'chat-ride-button' + (selectedChatRideId === ride.id ? ' active' : '');
      button.dataset.rideId = ride.id;
      button.textContent = getChatRideTitle(ride);
      button.addEventListener('click', () => {
        selectedChatRideId = ride.id;
        chatRideList.querySelectorAll('.chat-ride-button').forEach((item) => item.classList.remove('active'));
        button.classList.add('active');
        chatConversation.innerHTML = '';
        chatConversation.appendChild(createRideChat(ride, { fullPage: true, title: 'Group chat - ' + getChatRideTitle(ride) }));
      });
      chatRideList.appendChild(button);
    });
    const initialRide = rides.find((ride) => ride.id === selectedChatRideId) || rides[0];
    if (initialRide) {
      selectedChatRideId = initialRide.id;
      const firstButton = chatRideList.querySelector('[data-ride-id="' + initialRide.id + '"]');
      firstButton?.click();
    }
  } catch (err) {
    chatRideList.textContent = 'Unable to load ride chats.';
  }
}

function buildDriverSeatManifest(ride) {
  const manifest = document.createElement('div');
  manifest.className = 'seat-manifest';
  const title = document.createElement('div');
  title.className = 'seat-manifest-title';
  title.textContent = ride.seatingChartUnavailable ? 'Rider assignments' : 'Seat assignments';
  manifest.appendChild(title);

  if (ride.seatingChartUnavailable) {
    const list = document.createElement('div');
    list.className = 'seat-manifest-list';
    const passengers = ride.passengers || [];
    if (!passengers.length) {
      const row = document.createElement('div');
      row.className = 'seat-manifest-row';
      row.innerHTML = '<span class="seat-manifest-seat">Riders</span><span class="seat-manifest-empty">No riders yet</span>';
      list.appendChild(row);
    }
    passengers.forEach((passenger, index) => {
      const row = document.createElement('div');
      row.className = 'seat-manifest-row';

      const spot = document.createElement('span');
      spot.className = 'seat-manifest-seat';
      spot.textContent = 'Spot ' + (index + 1);

      const rider = document.createElement('span');
      rider.className = 'seat-manifest-rider';
      const passengerName = [passenger.studentFirstName, passenger.studentLastName].filter(Boolean).join(' ') || 'Rider';
      rider.appendChild(createPublicProfileLink(passenger.studentId, passengerName));
      if (passenger.email) rider.appendChild(document.createTextNode(' · ' + passenger.email));
      appendPassengerStopDetails(rider, passenger);

      row.append(spot, rider);
      if (passenger.studentId && passenger.studentId !== currentUser?.id) {
        row.appendChild(createReportUserButton({
          reportedUserId: passenger.studentId,
          reportedUserName: [passenger.studentFirstName, passenger.studentLastName].filter(Boolean).join(' ') || 'this rider',
          rideId: ride.id,
          label: 'Report rider',
        }));
      }
      list.appendChild(row);
    });
    manifest.appendChild(list);
    return manifest;
  }

  const passengerBySeat = new Map((ride.passengers || [])
    .filter((passenger) => passenger.seatId)
    .map((passenger) => [passenger.seatId, passenger]));
  const seatStateById = new Map((ride.seatMap || []).map((seat) => [seat.id, seat]));

  const list = document.createElement('div');
  list.className = 'seat-manifest-list';
  getVehicleSeatIds(getSeatLayoutCountForRide(ride)).forEach((seatId) => {
    const passenger = passengerBySeat.get(seatId);
    const seatState = seatStateById.get(seatId) || {};
    const isForSale = Boolean(seatState.available);
    const row = document.createElement('div');
    row.className = 'seat-manifest-row';

    const seat = document.createElement('span');
    seat.className = 'seat-manifest-seat';
    seat.textContent = getSeatLabel(seatId);

    const rider = document.createElement('span');
    rider.className = passenger ? 'seat-manifest-rider' : (isForSale ? 'seat-manifest-empty' : 'seat-manifest-unavailable');
    if (passenger) {
      const passengerName = [passenger.studentFirstName, passenger.studentLastName].filter(Boolean).join(' ') || 'Rider';
      rider.appendChild(createPublicProfileLink(passenger.studentId, passengerName));
      if (passenger.email) rider.appendChild(document.createTextNode(' · ' + passenger.email));
      appendPassengerStopDetails(rider, passenger);
    } else {
      rider.textContent = isForSale ? 'Available' : 'Unavailable';
    }

    row.append(seat, rider);
    if (passenger?.studentId && passenger.studentId !== currentUser?.id) {
      row.appendChild(createReportUserButton({
        reportedUserId: passenger.studentId,
        reportedUserName: [passenger.studentFirstName, passenger.studentLastName].filter(Boolean).join(' ') || 'this rider',
        rideId: ride.id,
        label: 'Report rider',
      }));
    }
    list.appendChild(row);
  });

  manifest.appendChild(list);
  return manifest;
}

function buildRequestSummary(request) {
  const container = document.createElement('div');
  container.className = 'ride-card request-summary-card';
  container.dataset.rideId = request.id;

  // Show map pin badge if this request is pinned on the map
  const pinInfo = browsePinLabels.get(request.id);
  if (pinInfo) {
    const pinBadge = document.createElement('div');
    pinBadge.className = 'browse-ride-pin-badge';
    const pickupPart = pinInfo.pickupDistance !== null && pinInfo.pickupDistance !== undefined ? formatMiles(pinInfo.pickupDistance) + ' from your pickup detour center' : '';
    const dropoffPart = pinInfo.dropoffDistance !== null && pinInfo.dropoffDistance !== undefined ? formatMiles(pinInfo.dropoffDistance) + ' from your drop-off detour center' : '';
    const distParts = [pickupPart, dropoffPart].filter(Boolean).join(' · ');
    pinBadge.innerHTML = '<span class="request-pin-label">' + esc(pinInfo.label) + '</span><span>Pin ' + esc(pinInfo.label) + (distParts ? ' · ' + esc(distParts) : '') + '</span>';
    container.appendChild(pinBadge);
  }

  const title = document.createElement('h4');
  title.textContent = request.origin + ' → ' + request.destination;
  container.appendChild(title);

  const requestTime = formatRideDateTime({ date: request.date, time: request.time });
  const riderName = [request.riderFirstName || 'Student', request.riderLastName || ''].filter(Boolean).join(' ');
  const details = document.createElement('div');
  details.className = 'ride-details';
  details.innerHTML = `
    <div><strong>Rider:</strong> ${publicProfileLinkMarkup(request.riderId, riderName)}</div>
    <div><strong>School:</strong> ${esc(request.university || 'Unknown school')}</div>
    <div><strong>Preference:</strong> ${request.sameGenderDriverOnly ? 'Same gender driver only' : 'Open to all drivers'}</div>
    ${request.sameSchoolDriverOnly ? '<div><strong>School restriction:</strong> Same school drivers only</div>' : ''}
    ${getFlexRadiusMarkup(request, 'rider')}
    <div><strong>Requested time:</strong> ${esc(requestTime)}</div>
    <div><strong>Estimated ride time:</strong> ${esc(formatDuration(request.estimatedDurationMinutes))}</div>
    <div><strong>Riders:</strong> ${esc(request.riderCount || 1)}</div>
    <div><strong>Share with others:</strong> ${request.shareRideWithOthers === undefined ? 'Not specified' : (request.shareRideWithOthers ? 'Yes' : 'No')}</div>
    <div><strong>Willing to pay:</strong> ${esc(formatCents(request.willingToPayCents))}</div>
    <div><strong>Status:</strong> ${esc(request.status || 'open')}</div>
    <div><strong>Driver offers:</strong> ${esc((request.driverOffers || []).length)}</div>
    ${request.notes ? `<div><strong>Notes:</strong> ${esc(request.notes)}</div>` : ''}
  `;
  container.appendChild(details);
  return container;
}

function buildRequestBrowseCard(request) {
  const card = buildRequestSummary(request);
  const alreadyOffered = (request.driverOffers || []).some((offer) => offer.driverId === currentUser.id);
  const cardError = document.createElement('div');
  cardError.className = 'error-message';

  const offerButton = document.createElement('button');
  offerButton.type = 'button';
  offerButton.textContent = alreadyOffered ? 'Offer sent' : 'Offer to drive';
  offerButton.disabled = alreadyOffered;
  offerButton.addEventListener('click', async () => {
    cardError.textContent = '';
    cardError.classList.remove('show');
    try {
      await fetchJson('/api/ride-requests/' + request.id + '/offer', { method: 'POST' });
      offerButton.textContent = 'Offer sent';
      offerButton.disabled = true;
      loadRideRequests();
      loadProfile();
    } catch (err) {
      cardError.textContent = err.message;
      cardError.classList.add('show');
    }
  });
  card.appendChild(offerButton);

  if (request.shareRideWithOthers && alreadyOffered) {
    // Inline form instead of window.prompt
    const sharedForm = document.createElement('div');
    sharedForm.className = 'shared-ride-post-form';

    const seatsInput = document.createElement('input');
    seatsInput.type = 'number';
    seatsInput.min = '1';
    seatsInput.max = '7';
    seatsInput.value = '1';
    seatsInput.className = 'shared-form-seats-input';
    seatsInput.setAttribute('aria-label', 'Additional shared seats');
    const seatsLabel = document.createElement('label');
    seatsLabel.textContent = 'Seats:';
    seatsLabel.className = 'shared-form-label';

    const priceInput = document.createElement('input');
    priceInput.type = 'number';
    priceInput.min = '0.50';
    priceInput.step = '0.01';
    priceInput.value = ((request.willingToPayCents || 500) / 100).toFixed(2);
    priceInput.className = 'shared-form-price-input';
    priceInput.setAttribute('aria-label', 'Price per spot');
    const priceLabel = document.createElement('label');
    priceLabel.textContent = 'Price ($):';
    priceLabel.className = 'shared-form-label';

    const postSharedButton = document.createElement('button');
    postSharedButton.type = 'button';
    postSharedButton.textContent = 'Post shared ride';
    postSharedButton.addEventListener('click', async () => {
      cardError.textContent = '';
      cardError.classList.remove('show');
      try {
        await fetchJson('/api/ride-requests/' + request.id + '/post-shared-ride', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ seatsAvailable: Number(seatsInput.value), price: Number(priceInput.value) }),
        });
        postSharedButton.textContent = 'Shared ride posted';
        postSharedButton.disabled = true;
        seatsInput.disabled = true;
        priceInput.disabled = true;
        loadRides();
        loadProfile();
      } catch (err) {
        cardError.textContent = err.message;
        cardError.classList.add('show');
      }
    });

    sharedForm.append(seatsLabel, seatsInput, priceLabel, priceInput, postSharedButton);
    card.appendChild(sharedForm);
  }

  card.appendChild(cardError);
  return card;
}

function buildDriverRideSummary(ride) {
  const container = buildRideSummary(ride);
  container.classList.add('driver-pinned-ride');

  const badge = document.createElement('div');
  badge.className = 'driver-pinned-badge';
  badge.textContent = 'Pinned driving ride';
  container.prepend(badge);

  if (!ride.seatingChartUnavailable) {
    container.appendChild(buildDriverSeatManifest(ride));
  } else if ((ride.passengers || []).length) {
    container.appendChild(buildDriverSeatManifest(ride));
  }
  return container;
}

function buildRideSummary(ride, options = {}) {
  const selectedSeatId = getCurrentUserSeatId(ride);
  const currentPassenger = getCurrentUserPassenger(ride);
  const driverName = [ride.driverFirstName, ride.driverLastName].filter(Boolean).join(' ') || 'Driver';
  const container = document.createElement('div');
  container.className = 'ride-card';
  container.innerHTML = `
    <h4>${esc(ride.origin)} → ${esc(ride.destination)}</h4>
    <div class="ride-details">
      <div><strong>Driver:</strong> ${publicProfileLinkMarkup(ride.driverId, driverName)}</div>
      <div><strong>School:</strong> ${esc(ride.university || 'Unknown school')}</div>
      <div><strong>Driver rating:</strong> ${esc(formatDriverRating(ride))}</div>
      <div><strong>Preference:</strong> ${ride.sameGenderOnly ? 'Same gender only' : 'Open to all'}</div>
      ${ride.sameSchoolOnly ? '<div><strong>School restriction:</strong> Same school riders only</div>' : ''}
      ${getCoordinateMarkup(ride)}
      <div><strong>Departure:</strong> ${esc(formatRideDateTime(ride))}</div>
      <div><strong>Estimated ride time:</strong> ${esc(formatDuration(ride.estimatedDurationMinutes))}</div>
      ${ride.returnRide ? `<div><strong>Return:</strong> ${esc(formatRideDateTime(ride.returnRide))}</div>` : ''}
      <div><strong>Seats available:</strong> ${esc(ride.seatsAvailable)}</div>
      ${selectedSeatId ? `<div><strong>Seat:</strong> ${esc(getSeatLabel(selectedSeatId))}</div>` : ''}
      ${getRiderStopDetailMarkup(currentPassenger || ride)}
      <div><strong>Miles:</strong> ${esc(formatMiles(getRideMiles(ride)))}</div>
      <div><strong>Price:</strong> ${esc(formatRidePrice(ride))}</div>
      ${getVehicleDetailMarkup(ride)}
      <div><strong>Passengers:</strong> ${esc((ride.passengers || []).length)}</div>
    </div>
  `;
  if (ride.seatingChartUnavailable) {
    const notice = document.createElement('div');
    notice.className = 'seat-picker-hint shared-seat-notice';
    notice.textContent = ride.rideProviderType === 'rideshare_service'
      ? 'Rideshare service — riders reserve general spots.'
      : 'Seating chart unavailable for this shared ride.';
    container.appendChild(notice);
  } else {
    const readonlyPicker = document.createElement('div');
    readonlyPicker.className = 'ride-seat-picker';
    const label = document.createElement('div');
    label.className = 'seat-picker-title';
    label.textContent = selectedSeatId ? 'Reserved seat' : 'Seat layout';
    readonlyPicker.appendChild(label);
    readonlyPicker.appendChild(createSeatLayout({ seatMap: ride.seatMap || [], selectedSeatId, ride }));
    container.appendChild(readonlyPicker);
  }
  if (options.includeReportDriver !== false && ride.driverId && ride.driverId !== currentUser?.id) {
    container.appendChild(createReportUserButton({
      reportedUserId: ride.driverId,
      reportedUserName: [ride.driverFirstName, ride.driverLastName].filter(Boolean).join(' ') || 'the driver',
      rideId: ride.id,
      label: 'Report driver',
    }));
  }
  return container;
}

function renderCartItem(ride) {
  const item = buildRideSummary(ride, { includeChat: false, includeReportDriver: false });
  item.classList.add('cart-item-card');
  item.dataset.rideId = ride.id;
  item.dataset.priceCents = String(ride.priceCents || 0);
  item.dataset.cartTermsAccepted = ride.cartTermsAccepted ? 'true' : 'false';
  item.dataset.actualPickup = ride.actualPickup || '';
  item.dataset.actualDropoff = ride.actualDropoff || '';

  // Strip elements that clutter the cart view — the cart-item-detail
  // strip below already shows all the key info cleanly.
  ['.ride-details', '.ride-seat-picker', '.seat-picker-block',
   '.ride-card-passengers', '.shared-seat-notice', '.report-user-button']
    .forEach(sel => item.querySelectorAll(sel).forEach(el => el.remove()));

  const selectLabel = document.createElement('label');
  selectLabel.className = 'cart-item-select';
  const selectCheckbox = document.createElement('input');
  selectCheckbox.type = 'checkbox';
  selectCheckbox.className = 'cart-item-select-checkbox';
  selectCheckbox.checked = selectedCartRideIds.has(ride.id);
  selectCheckbox.addEventListener('change', () => {
    if (selectCheckbox.checked) selectedCartRideIds.add(ride.id);
    else selectedCartRideIds.delete(ride.id);
    updateCartSelectionSummary();
  });
  selectLabel.append(selectCheckbox, document.createTextNode(' Checkout'));
  const title = item.querySelector('h4');
  let routeRow = null;
  if (title) {
    routeRow = document.createElement('div');
    routeRow.className = 'cart-route-row';
    title.before(routeRow);
    routeRow.append(selectLabel, title);
  } else {
    item.prepend(selectLabel);
  }

  const detail = document.createElement('div');
  detail.className = 'cart-item-detail';
  const driverName = [ride.driverFirstName, ride.driverLastName].filter(Boolean).join(' ') || 'Driver';
  detail.innerHTML = `
    <div><strong>Seat:</strong> ${ride.seatingChartUnavailable ? 'General shared spot' : (ride.selectedSeatId ? esc(getSeatLabel(ride.selectedSeatId)) : 'Seat selected')}</div>
    <div><strong>Driver:</strong> ${publicProfileLinkMarkup(ride.driverId, driverName)}</div>
    <div><strong>School:</strong> ${esc(ride.university || 'Unknown school')}</div>
    <div><strong>Rating:</strong> ${esc(formatDriverRating(ride))}</div>
    <div><strong>Departure:</strong> ${esc(formatRideDateTime(ride))}</div>
    ${getRiderStopDetailMarkup(ride)}
    <div><strong>Estimated ride time:</strong> ${esc(formatDuration(ride.estimatedDurationMinutes))}</div>
    <div><strong>Price:</strong> ${esc(formatRidePrice(ride))}</div>
  `;
  (routeRow || item.querySelector('h4'))?.after(detail);

  const removeButton = document.createElement('button');
  removeButton.textContent = 'Remove';
  removeButton.onclick = async () => {
    try {
      await fetchJson(`/api/cart/${ride.id}`, { method: 'DELETE' });
      await loadCart();
      loadRides();
    } catch (err) {
      cartError.textContent = err.message;
      cartError.classList.add('show');
    }
  };
  item.appendChild(removeButton);
  return item;
}

function getSelectedCartRideIds() {
  return [...cartItems.querySelectorAll('.cart-item-select-checkbox:checked')]
    .map((checkbox) => checkbox.closest('.cart-item-card')?.dataset.rideId)
    .filter(Boolean);
}

function syncCartStateFromDom() {
  const visibleRideIds = [...cartItems.querySelectorAll('.cart-item-card')]
    .map((card) => card.dataset.rideId)
    .filter(Boolean);
  if (visibleRideIds.length) {
    cartRideIds = new Set(visibleRideIds);
    selectedCartRideIds = new Set(getSelectedCartRideIds());
  }
  return visibleRideIds;
}

function updateCartSelectionSummary() {
  syncCartStateFromDom();
  const selectedRideIds = getSelectedCartRideIds();
  selectedCartRideIds = new Set(selectedRideIds);
  const totalRideCount = cartRideIds.size;
  if (cartSelectAllCheckbox) {
    cartSelectAllCheckbox.checked = totalRideCount > 0 && selectedRideIds.length === totalRideCount;
    cartSelectAllCheckbox.indeterminate = selectedRideIds.length > 0 && selectedRideIds.length < totalRideCount;
    cartSelectAllCheckbox.disabled = totalRideCount === 0;
  }
  const selectedSet = new Set(selectedRideIds);
  // Apply visual selected/deselected state to each card
  [...cartItems.querySelectorAll('.cart-item-card')].forEach((card) => {
    const isSelected = selectedSet.has(card.dataset.rideId);
    card.classList.toggle('cart-item-selected', isSelected);
    card.classList.toggle('cart-item-deselected', !isSelected);
  });
  const selectedCards = [...cartItems.querySelectorAll('.cart-item-card')]
    .filter((card) => selectedSet.has(card.dataset.rideId));
  const selectedNeedsTerms = selectedCards.some((card) => card.dataset.cartTermsAccepted !== 'true');
  if (cartTermsAgreement) {
    cartTermsAgreement.classList.toggle('hidden', !selectedNeedsTerms);
  }
  if (cartTermsCheckbox) {
    cartTermsCheckbox.disabled = !selectedNeedsTerms;
    if (!selectedNeedsTerms) cartTermsCheckbox.checked = false;
  }
  const subtotalCents = selectedCards.reduce((sum, card) => sum + Number(card.dataset.priceCents || 0), 0);
  if (cartSubtotal && totalRideCount > 0) {
    const rideRows = selectedCards.map(card => {
      const title = card.querySelector('h4')?.textContent?.trim() || 'Trip';
      const price = formatCents(Number(card.dataset.priceCents || 0));
      return `<div class="cart-summary-row"><span class="cart-summary-row-label">${esc(title)}</span><span class="cart-summary-row-price">${price}</span></div>`;
    }).join('');
    const selectionNote = selectedRideIds.length < totalRideCount
      ? `<p class="cart-summary-selection-note">${selectedRideIds.length} of ${totalRideCount} trip${totalRideCount === 1 ? '' : 's'} selected</p>`
      : '';
    cartSubtotal.innerHTML = `
      ${selectionNote}
      <div class="cart-summary-rows">${rideRows || '<p class="cart-summary-empty">No trips selected</p>'}</div>
      <div class="cart-summary-divider"></div>
      <div class="cart-summary-total-row">
        <div class="cart-summary-total-copy">
          <span>Subtotal</span>
          <p class="cart-summary-tax-note">Service fee calculated at checkout</p>
        </div>
        <strong>${formatCents(subtotalCents)}</strong>
      </div>
    `;
    cartSubtotal.classList.remove('hidden');
  } else if (cartSubtotal) {
    cartSubtotal.innerHTML = `<p class="cart-summary-empty">Your cart is empty.</p>`;
    cartSubtotal.classList.toggle('hidden', totalRideCount === 0);
  }
  if (checkoutCartButton) checkoutCartButton.disabled = selectedRideIds.length === 0;
}

async function saveMissingCartTerms(selectedRideIds = getSelectedCartRideIds()) {
  const selectedSet = new Set(selectedRideIds);
  const missingTermsItems = [...cartItems.querySelectorAll('.cart-item-card')]
    .filter((item) => selectedSet.has(item.dataset.rideId) && item.dataset.cartTermsAccepted !== 'true');
  if (!missingTermsItems.length) return true;

  if (!cartTermsCheckbox?.checked) {
    cartError.textContent = 'Please agree to the Terms and Conditions for the selected rides before checkout.';
    cartError.classList.add('show');
    return false;
  }

  for (const item of missingTermsItems) {
    const rideId = item.dataset.rideId;
    const selectedSeatId = selectedSeatByRide.get(rideId) || '';
    await fetchJson(`/api/cart/${rideId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        seatId: selectedSeatId,
        actualPickup: item.dataset.actualPickup || '',
        actualDropoff: item.dataset.actualDropoff || '',
        termsAccepted: true,
      }),
    });
    item.dataset.cartTermsAccepted = 'true';
  }
  if (cartTermsCheckbox) cartTermsCheckbox.checked = false;
  await loadCart();
  return true;
}

async function loadCart() {
  try {
    const data = await fetchJson('/api/cart');
    const expiredRideCount = Number(data.expiredRideCount || 0);
    const previousSelection = new Set(selectedCartRideIds);
    cartRideIds = new Set(data.rides.map((ride) => ride.id));
    const hasExistingSelection = previousSelection.size > 0;
    selectedCartRideIds = new Set(data.rides
      .map((ride) => ride.id)
      .filter((rideId) => hasExistingSelection ? previousSelection.has(rideId) : true));
    data.rides.forEach((ride) => { if (ride.selectedSeatId) selectedSeatByRide.set(ride.id, ride.selectedSeatId); });
    cartCount.textContent = data.rides.length;
    cartItems.innerHTML = '';
    cartSubtotal.classList.add('hidden');
    cartSubtotal.innerHTML = '';
    if (!data.rides.length) {
      cartItems.textContent = 'Your cart is empty.';
      selectedCartRideIds.clear();
      updateCartSelectionSummary();
      checkoutCartButton.disabled = true;
      showExpiredCartNotice(expiredRideCount);
      return;
    }
    data.rides.forEach((ride) => cartItems.appendChild(renderCartItem(ride)));
    updateCartSelectionSummary();
    if (cartError.textContent.includes('Your cart is empty')) {
      cartError.textContent = '';
      cartError.classList.remove('show');
    }
    showExpiredCartNotice(expiredRideCount);
  } catch (err) {
    cartItems.textContent = 'Unable to load your cart.';
    cartSubtotal.classList.add('hidden');
    cartSubtotal.innerHTML = '';
    if (cartSelectAllCheckbox) {
      cartSelectAllCheckbox.checked = false;
      cartSelectAllCheckbox.indeterminate = false;
      cartSelectAllCheckbox.disabled = true;
    }
  }
}

function showExpiredCartNotice(expiredRideCount = 0) {
  const currentExpiredCount = Number(expiredRideCount || 0);
  if (currentExpiredCount && cartPage.classList.contains('hidden')) {
    pendingExpiredCartRideNoticeCount += currentExpiredCount;
    return;
  }
  const noticeCount = currentExpiredCount + pendingExpiredCartRideNoticeCount;
  if (!noticeCount || cartPage.classList.contains('hidden')) return;
  pendingExpiredCartRideNoticeCount = 0;
  cartMessage.textContent = noticeCount === 1
    ? 'A ride in your cart has expired and was removed.'
    : `${noticeCount} rides in your cart have expired and were removed.`;
  cartMessage.classList.add('show');
}

function clearBrowseFilters() {
  rideSearchInput.value = '';
  pickupRadiusMilesInput.value = '';
  dropoffRadiusMilesInput.value = '';
  rideFilterDateInput.value = '';
  rideFilterSeatsInput.value = '';
  rideFilterMaxPriceInput.value = '';
  rideSortSelect.value = 'soonest';
  pickupRadiusLocationInput.value = '';
  dropoffRadiusLocationInput.value = '';
  delete pickupRadiusLocationInput.dataset.lat;
  delete pickupRadiusLocationInput.dataset.lng;
  delete dropoffRadiusLocationInput.dataset.lat;
  delete dropoffRadiusLocationInput.dataset.lng;
  if (sameSchoolOnlyFilter) sameSchoolOnlyFilter.checked = true;
  sameGenderDriversOnlyFilter.checked = false;
}

function setBrowseRole(role) {
  const roleChanged = browseRole !== role;
  browseRole = role;
  if (roleChanged && role) clearBrowseFilters();
  browseDriverButton.classList.toggle('active', role === 'driver');
  browseRiderButton.classList.toggle('active', role === 'rider');
}

function renderBrowseRoleChoice() {
  setBrowseRole(null);
  browseDriverButton.disabled = Boolean(currentUser?.rideServicesPaused);
  browseRiderButton.disabled = Boolean(currentUser?.rideServicesPaused);
  listRideButton.disabled = Boolean(currentUser?.rideServicesPaused);
  requestRideButton.disabled = Boolean(currentUser?.rideServicesPaused);
  cartButton.disabled = Boolean(currentUser?.rideServicesPaused);
  browseTitle.textContent = 'Browse rides';
  browseSubtitle.textContent = 'Are you a driver looking for riders, or a rider looking for a seat?';
  browseControls.classList.add('hidden');
  browseMapPanel?.classList.add('hidden');
  browseRiderLayout?.classList.remove('rider-active');
  clearBrowseResultMarkers();
  if (browsePickupCircle) { browsePickupCircle.setMap(null); browsePickupCircle = null; }
  if (browseDropoffCircle) { browseDropoffCircle.setMap(null); browseDropoffCircle = null; }
  if (browsePickupMarker) { browsePickupMarker.setMap(null); browsePickupMarker = null; }
  if (browseDropoffMarker) { browseDropoffMarker.setMap(null); browseDropoffMarker = null; }
  browseResultsTitle.textContent = 'Choose a role to start';
  ridesList.innerHTML = '<p class="browse-start-message">Select <strong>I\'m a Driver</strong> to see ride requests from students, or <strong>I\'m a Rider</strong> to browse available seats.</p>';
}

function renderRideServicesPausedState() {
  browseTitle.textContent = 'Ride services paused';
  browseSubtitle.textContent = 'We are finishing payment, wallet, and weekly payout setup before allowing new rides.';
  browseControls.classList.add('hidden');
  browseMapPanel?.classList.add('hidden');
  browseResultsTitle.textContent = 'Temporarily unavailable';
  ridesList.innerHTML = '<div class="ride-empty-state"><p>Listing rides, requesting rides, reserving seats, chat, tracking, and checkout are paused for now. Your profile and account settings still work.</p></div>';
}

function showRiderBrowse() {
  if (currentUser?.rideServicesPaused) {
    showDashboardHome();
    return;
  }
  setAppRoute('browse-rider');
  setBrowseRole('rider');
  loadGoogleMapsAPI().then(() => {
    initializeRadiusAutocomplete();
    loadRides();
    // Show map immediately; trigger resize after layout settles
    browseMapPanel?.classList.remove('hidden');
    browseRiderLayout?.classList.add('rider-active');
    setTimeout(() => {
      const map = ensureBrowseRadiusMap();
      if (map) google.maps.event.trigger(map, 'resize');
    }, 100);
  });
  browseTitle.textContent = 'Browse available rides';
  browseSubtitle.textContent = 'Find rides near your pickup and drop-off.';
  browseSearchLabel.firstChild.textContent = 'Search destination or meetup';
  pickupLocationLabel.firstChild.textContent = 'Where you are starting from ';
  pickupRadiusLabel.firstChild.textContent = 'Max walk to pick-up (mi) ';
  dropoffLocationLabel.firstChild.textContent = 'Your final destination area ';
  dropoffRadiusLabel.firstChild.textContent = 'Max walk from drop-off (mi) ';
  rideSearchInput.placeholder = 'Where do you want to go?';
  pickupRadiusLocationInput.placeholder = 'Where are you starting from?';
  dropoffRadiusLocationInput.placeholder = 'Where is your final destination?';
  browseControls.classList.remove('hidden');
  browseResultsTitle.textContent = 'Available rides';
  loadRides();
}

function showDriverBrowse() {
  if (currentUser?.rideServicesPaused) {
    showDashboardHome();
    return;
  }
  setAppRoute('browse-driver');
  setBrowseRole('driver');
  loadGoogleMapsAPI().then(() => {
    initializeRadiusAutocomplete();
    loadRideRequests();
    browseMapPanel?.classList.remove('hidden');
    browseRiderLayout?.classList.add('rider-active');
    setTimeout(() => {
      const map = ensureBrowseRadiusMap();
      if (map) google.maps.event.trigger(map, 'resize');
    }, 100);
  });
  browseTitle.textContent = 'Browse requested rides';
  browseSubtitle.textContent = 'Find riders near your route.';
  browseSearchLabel.firstChild.textContent = 'Search requested route';
  pickupLocationLabel.firstChild.textContent = 'Pickup detour center ';
  pickupRadiusLabel.firstChild.textContent = 'Max drive to pick up rider (mi) ';
  dropoffLocationLabel.firstChild.textContent = 'Drop-off detour center ';
  dropoffRadiusLabel.firstChild.textContent = 'Max drive to drop off rider (mi) ';
  rideSearchInput.placeholder = 'Search rider request';
  pickupRadiusLocationInput.placeholder = 'Where can you drive to pick up riders?';
  dropoffRadiusLocationInput.placeholder = 'Where can you drive to drop riders off?';
  browseControls.classList.remove('hidden');
  browseResultsTitle.textContent = 'Requested rides';
  loadRideRequests();
}

function renderRideRequestPrompt(message) {
  ridesList.innerHTML = '';
  const emptyState = document.createElement('div');
  emptyState.className = 'ride-empty-state';

  const text = document.createElement('p');
  text.textContent = message;

  const question = document.createElement('strong');
  question.textContent = 'Do you want to request a ride instead?';

  const button = document.createElement('button');
  button.type = 'button';
  button.textContent = 'Request a ride';
  button.addEventListener('click', () => showRequestRidePage());

  emptyState.append(text, question, button);
  ridesList.appendChild(emptyState);
}

async function loadRides() {
  if (browseRole !== 'rider') return;
  ridesList.textContent = 'Loading rides...';
  try {
    const rides = await fetchJson('/api/rides');
    ridesList.innerHTML = '';
    if (!rides.length) {
      updateBrowseRadiusMap([]);
      renderRideRequestPrompt('No rides are posted yet.');
      return;
    }
    const visibleRides = rides.filter((ride) => canCurrentUserSeeRide(ride) && rideMatchesBrowseFilters(ride) && matchesRadiusFilter(ride, 'ride'));
    updateBrowseRadiusMap(visibleRides);
    if (!visibleRides.length) {
      renderRideRequestPrompt('No rides match your search or filters right now.');
      return;
    }
    sortVisibleRides(visibleRides)
      .forEach((ride) => ridesList.appendChild(renderRideCard(ride)));
  } catch (err) {
    ridesList.textContent = 'Unable to load rides.';
  }
}

function hasActiveDriverRequestFilters() {
  const pickupMiles = Number(pickupRadiusMilesInput.value);
  const dropoffMiles = Number(dropoffRadiusMilesInput.value);
  return Boolean(
    rideSearchInput.value.trim()
    || rideFilterDateInput.value
    || (Number.isFinite(Number(rideFilterMaxPriceInput.value)) && Number(rideFilterMaxPriceInput.value) > 0)
    || (Number.isFinite(pickupMiles) && pickupMiles > 0 && getRadiusCenter(pickupRadiusLocationInput))
    || (Number.isFinite(dropoffMiles) && dropoffMiles > 0 && getRadiusCenter(dropoffRadiusLocationInput))
  );
}

function requestMatchesDriverFilters(request) {
  const search = rideSearchInput.value.trim().toLowerCase();
  if (search) {
    const haystack = [request.origin, request.destination, request.riderFirstName, request.riderLastName, request.notes].join(' ').toLowerCase();
    if (!haystack.includes(search)) return false;
  }
  if (rideFilterDateInput.value && request.date !== rideFilterDateInput.value) return false;
  const maxPriceCents = Math.round(Number(rideFilterMaxPriceInput.value) * 100);
  if (Number.isFinite(maxPriceCents) && maxPriceCents > 0 && Number(request.willingToPayCents || 0) > maxPriceCents) return false;
  return matchesRadiusFilter(request, 'request');
}

function canCurrentUserSeeRequest(request) {
  if (sameSchoolOnlyFilter?.checked && request.university !== currentUser.university) return false;
  if (request.sameSchoolDriverOnly && request.university !== currentUser.university) return false;
  if (request.riderId === currentUser.id) return false;
  if (request.sameGenderDriverOnly && !canMatchSameGender(request.riderGender, currentUser.gender)) return false;
  return (request.status || 'open') === 'open';
}

async function loadRideRequests() {
  if (browseRole !== 'driver') return;
  ridesList.textContent = 'Loading requested rides...';
  try {
    const requests = await fetchJson('/api/ride-requests');
    const baseRequests = requests.filter((request) => canCurrentUserSeeRequest(request));
    const filtersActive = hasActiveDriverRequestFilters();
    const visibleRequests = filtersActive
      ? baseRequests.filter((request) => requestMatchesDriverFilters(request))
      : baseRequests;
    ridesList.innerHTML = '';
    updateBrowseRadiusMap(visibleRequests);
    if (!visibleRequests.length) {
      ridesList.innerHTML = '<div class="ride-empty-state"><p>' + (filtersActive ? 'No student ride requests match your current filters.' : 'No students have requested rides yet.') + '</p></div>';
      return;
    }
    visibleRequests
      .sort((a, b) => getRideStartTime(a) - getRideStartTime(b))
      .forEach((request) => ridesList.appendChild(buildRequestBrowseCard(request)));
  } catch (err) {
    ridesList.textContent = 'Unable to load requested rides.';
  }
}

function isPastRide(ride) {
  return getTripEndTime(ride) < Date.now();
}

function isExpiredRideActivity(ride) {
  return hasRideDeparted(ride);
}

function setYourRidesView(view) {
  yourRidesView = view;
  yourRidesCurrentTab.classList.toggle('active', view === 'current');
  yourRidesRequestsTab.classList.toggle('active', view === 'requests');
  yourRidesHistoryTab.classList.toggle('active', view === 'history');
}

function appendRideSection(container, title, rides, builder) {
  if (!rides.length) return;
  const label = document.createElement('h4');
  label.textContent = title;
  container.appendChild(label);
  rides.forEach((ride) => container.appendChild(builder(ride)));
}

function createStarDisplay(rating, interactive = false) {
  const stars = document.createElement('div');
  stars.className = 'star-rating' + (interactive ? ' interactive' : '');
  stars.setAttribute('aria-label', rating ? rating + ' out of 5 stars' : 'No rating selected');
  for (let index = 1; index <= 5; index += 1) {
    const star = document.createElement(interactive ? 'button' : 'span');
    star.className = 'rating-star' + (index <= rating ? ' selected' : '');
    star.textContent = '★';
    star.dataset.rating = String(index);
    if (interactive) {
      star.type = 'button';
      star.setAttribute('aria-label', index + ' out of 5 stars');
    }
    stars.appendChild(star);
  }
  return stars;
}

function updateStarDisplay(stars, rating) {
  stars.setAttribute('aria-label', rating ? rating + ' out of 5 stars' : 'No rating selected');
  stars.querySelectorAll('.rating-star').forEach((star) => {
    star.classList.toggle('selected', Number(star.dataset.rating) <= rating);
  });
}

function buildDriverRatingForm(ride) {
  const wrapper = document.createElement('form');
  wrapper.className = 'driver-rating-form';

  const existingRating = Number(ride.driverRatingByCurrentUser);
  if (existingRating) {
    const summary = document.createElement('div');
    summary.className = 'driver-rating-summary';
    summary.innerHTML = '<strong>Your rating:</strong> <span>' + existingRating + ' out of 5</span>';
    summary.appendChild(createStarDisplay(existingRating));
    wrapper.appendChild(summary);
    return wrapper;
  }

  let selectedRating = 0;
  const label = document.createElement('div');
  label.className = 'driver-rating-label';
  label.textContent = 'Rate your driver';
  const stars = createStarDisplay(0, true);
  stars.addEventListener('click', (event) => {
    const star = event.target.closest('.rating-star');
    if (!star) return;
    selectedRating = Number(star.dataset.rating);
    updateStarDisplay(stars, selectedRating);
  });

  const comment = document.createElement('input');
  comment.type = 'text';
  comment.maxLength = 300;
  comment.placeholder = 'Optional note';

  const button = document.createElement('button');
  button.type = 'submit';
  button.textContent = 'Submit rating';

  const message = document.createElement('div');
  message.className = 'success-message';
  const error = document.createElement('div');
  error.className = 'error-message';

  wrapper.append(label, stars, comment, button, message, error);
  wrapper.addEventListener('submit', async (event) => {
    event.preventDefault();
    message.classList.remove('show');
    error.classList.remove('show');
    if (!selectedRating) {
      error.textContent = 'Choose a star rating first';
      error.classList.add('show');
      return;
    }
    try {
      await fetchJson('/api/rides/' + ride.id + '/rating', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating: selectedRating, comment: comment.value.trim() }),
      });
      message.textContent = 'Rating saved.';
      message.classList.add('show');
      loadYourRides();
    } catch (err) {
      error.textContent = err.message;
      error.classList.add('show');
    }
  });
  return wrapper;
}

function buildHistoryRideCard(ride, role) {
  const item = role === 'Driver' ? buildDriverRideSummary(ride) : buildRideSummary(ride);
  item.classList.add('history-ride-card');
  const badge = document.createElement('div');
  badge.className = 'ride-role-badge ' + (role === 'Driver' ? 'driver-role' : 'rider-role');
  badge.textContent = role;
  item.prepend(badge);
  if (role === 'Rider') item.appendChild(buildDriverRatingForm(ride));
  return item;
}

function buildHistoryRequestCard(request) {
  const item = buildRequestSummary(request);
  item.classList.add('history-ride-card');
  const badge = document.createElement('div');
  badge.className = 'ride-role-badge rider-role';
  badge.textContent = 'Expired request';
  item.prepend(badge);
  return item;
}

async function loadYourRides() {
  yourRidesList.textContent = 'Loading your rides...';
  try {
    const data = await fetchJson('/api/profile');
    yourRidesList.innerHTML = '';
    setYourRidesView(yourRidesView);
    const drivingRides = data.createdRides || [];
    const reservedRides = data.joinedRides || [];
    const riderRequests = data.riderRequests || [];
    const requestedRides = riderRequests
      .filter((request) => (request.status || 'open') === 'open')
      .filter((request) => !isExpiredRideActivity(request))
      .sort((a, b) => getRideStartTime(a) - getRideStartTime(b));
    const expiredRequests = riderRequests
      .filter((request) => request.status === 'expired' || isExpiredRideActivity(request))
      .sort((a, b) => getRideStartTime(b) - getRideStartTime(a));
    const currentDrivingRides = drivingRides
      .filter((ride) => !isExpiredRideActivity(ride))
      .sort((a, b) => getRideStartTime(a) - getRideStartTime(b));
    const currentReservedRides = reservedRides
      .filter((ride) => !isExpiredRideActivity(ride))
      .sort((a, b) => getRideStartTime(a) - getRideStartTime(b));
    const historyRides = [
      ...drivingRides.filter(isExpiredRideActivity).map((ride) => ({ type: 'ride', ride, role: 'Driver', sortTime: getRideStartTime(ride) })),
      ...reservedRides.filter(isExpiredRideActivity).map((ride) => ({ type: 'ride', ride, role: 'Rider', sortTime: getRideStartTime(ride) })),
      ...expiredRequests.map((request) => ({ type: 'request', request, sortTime: getRideStartTime(request) })),
    ].sort((a, b) => b.sortTime - a.sortTime);

    if (yourRidesView === 'requests') {
      if (!requestedRides.length) {
        yourRidesList.textContent = 'No ride requests posted yet.';
        return;
      }
      appendRideSection(yourRidesList, 'Ride requests you posted', requestedRides, (request) => buildRequestSummary(request));
      return;
    }

    if (yourRidesView === 'history') {
      if (!historyRides.length) {
        yourRidesList.textContent = 'No past rides yet.';
        return;
      }
      appendRideSection(yourRidesList, 'Ride history', historyRides, (entry) => (
        entry.type === 'request' ? buildHistoryRequestCard(entry.request) : buildHistoryRideCard(entry.ride, entry.role)
      ));
      return;
    }

    if (!currentDrivingRides.length && !currentReservedRides.length) {
      yourRidesList.textContent = 'No current rides.';
      return;
    }

    appendRideSection(yourRidesList, "Rides you're driving", currentDrivingRides, (ride) => buildDriverRideSummary(ride));
    appendRideSection(yourRidesList, 'Rides you reserved', currentReservedRides, (ride) => {
      const item = buildRideSummary(ride);
      item.classList.add('your-ride-reservation');
      return item;
    });
  } catch (err) {
    yourRidesList.textContent = 'Unable to load your rides.';
  }
}

async function loadProfile() {
  profileRides.textContent = 'Loading your rides...';
  try {
    const data = await fetchJson('/api/profile');
    if (currentUser) {
      currentUser.wallet = data.wallet || currentUser.wallet || null;
      fillDriverPayoutForm(currentUser);
    }
    profileRides.innerHTML = '';
    const currentCreatedRides = (data.createdRides || []).filter((ride) => !isExpiredRideActivity(ride));
    const currentJoinedRides = (data.joinedRides || []).filter((ride) => !isExpiredRideActivity(ride));
    const currentRiderRequests = (data.riderRequests || []).filter((request) => (request.status || 'open') === 'open' && !isExpiredRideActivity(request));
    const currentDriverOffers = (data.driverOffers || []).filter((request) => (request.status || 'open') === 'open' && !isExpiredRideActivity(request));
    const createdLabel = document.createElement('h4');
    createdLabel.textContent = 'Your posted rides';
    profileRides.appendChild(createdLabel);
    if (!currentCreatedRides.length) {
      const empty = document.createElement('p');
      empty.textContent = 'You have not offered any rides yet.';
      profileRides.appendChild(empty);
    } else {
      currentCreatedRides.forEach((ride) => profileRides.appendChild(buildDriverRideSummary(ride)));
    }
    const joinedLabel = document.createElement('h4');
    joinedLabel.textContent = 'Rides you joined';
    profileRides.appendChild(joinedLabel);
    if (!currentJoinedRides.length) {
      const empty = document.createElement('p');
      empty.textContent = 'You have not joined any rides yet.';
      profileRides.appendChild(empty);
    } else {
      currentJoinedRides.forEach((ride) => profileRides.appendChild(buildRideSummary(ride)));
    }

    const requestsLabel = document.createElement('h4');
    requestsLabel.textContent = 'Your trip requests';
    profileRides.appendChild(requestsLabel);
    if (!currentRiderRequests.length) {
      const empty = document.createElement('p');
      empty.textContent = 'You have not requested any rides yet.';
      profileRides.appendChild(empty);
    } else {
      currentRiderRequests.forEach((request) => profileRides.appendChild(buildRequestSummary(request)));
    }

    const offersLabel = document.createElement('h4');
    offersLabel.textContent = 'Requests you offered to drive';
    profileRides.appendChild(offersLabel);
    if (!currentDriverOffers.length) {
      const empty = document.createElement('p');
      empty.textContent = 'You have not offered to drive any rider requests yet.';
      profileRides.appendChild(empty);
    } else {
      currentDriverOffers.forEach((request) => profileRides.appendChild(buildRequestSummary(request)));
    }
  } catch (err) {
    profileRides.textContent = 'Unable to load your ride history.';
  }
}

tabButtons.forEach((button) => {
  button.addEventListener('click', () => {
    clearRecoveryMessages();
    showAuthForm(button.dataset.tab + '-form');
  });
});

signupPassword.addEventListener('input', (event) => validatePasswordRequirements(event.target.value));
forgotAuthLink.addEventListener('click', () => { clearRecoveryMessages(); showAuthForm('recovery-form'); });
backToSigninButton.addEventListener('click', () => { clearRecoveryMessages(); recoveryForm.reset(); showAuthForm('signin-form'); });
resetBackToSigninButton.addEventListener('click', () => { clearRecoveryMessages(); resetPasswordForm.reset(); window.history.replaceState({}, document.title, window.location.pathname); showAuthForm('signin-form'); });
verificationBackToSigninButton.addEventListener('click', () => { clearRecoveryMessages(); verificationForm.reset(); showAuthForm('signin-form'); });

vehicleSeatCountSelect.addEventListener('change', () => {
  currentVehicleSeatCount = Number(vehicleSeatCountSelect.value);
  driverAvailableSeatIds = new Set();
  renderDriverSeatLayout();
});
rideProviderChoices.forEach((button) => {
  button.addEventListener('click', () => chooseOfferProviderType(button.dataset.providerType));
});
changeRideProviderButton?.addEventListener('click', () => resetOfferProviderSelection());
renderDriverSeatLayout();
updateOfferProviderFields();
browseDriverButton.addEventListener('click', () => showDriverBrowse());
browseRiderButton.addEventListener('click', () => showRiderBrowse());
sameGenderDriversOnlyFilter.addEventListener('change', () => refreshActiveBrowse());
sameSchoolOnlyFilter?.addEventListener('change', () => refreshActiveBrowse());
function refreshActiveBrowse() {
  if (browseRole === 'driver') loadRideRequests();
  if (browseRole === 'rider') loadRides();
}
[rideSearchInput, pickupRadiusMilesInput, dropoffRadiusMilesInput, rideFilterDateInput, rideFilterSeatsInput, rideFilterMaxPriceInput].forEach((input) => {
  input.addEventListener('input', () => refreshActiveBrowse());
});
[pickupRadiusLocationInput, dropoffRadiusLocationInput].forEach((input) => {
  input.addEventListener('input', () => {
    delete input.dataset.lat;
    delete input.dataset.lng;
    refreshActiveBrowse();
  });
});
rideSortSelect.addEventListener('change', () => refreshActiveBrowse());
resetRideFiltersButton?.addEventListener('click', () => {
  clearBrowseFilters();
  refreshActiveBrowse();
});
[offerPickupRadiusInput, offerDropoffRadiusInput].forEach((input) => input?.addEventListener('input', updateOfferRouteMap));
[requestPickupRadiusInput, requestDropoffRadiusInput].forEach((input) => input?.addEventListener('input', updateRequestRouteMap));

resendVerificationButton.addEventListener('click', async () => {
  clearRecoveryMessages();
  try {
    const data = await fetchJson('/api/auth/resend-verification', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: pendingVerificationEmail }) });
    verificationMessage.textContent = data.message;
    verificationMessage.classList.add('show');
  } catch (err) {
    verificationError.textContent = err.message;
    verificationError.classList.add('show');
  }
});

verificationForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  clearRecoveryMessages();
  try {
    const user = await fetchJson('/api/auth/verify-email', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: pendingVerificationEmail, code: verificationCode.value.trim() }) });
    currentUser = user;
    verificationForm.reset();
    showDashboard(user);
  } catch (err) {
    verificationError.textContent = err.message;
    verificationError.classList.add('show');
  }
});

async function sendRecoveryRequest(endpoint) {
  clearRecoveryMessages();
  const email = document.getElementById('recovery-email').value.trim();
  try {
    const data = await fetchJson(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email }) });
    recoveryMessage.textContent = data.message;
    if (data.previewResetUrl) {
      const resetLink = document.createElement('a');
      resetLink.href = data.previewResetUrl;
      resetLink.textContent = 'Open local reset link';
      resetLink.className = 'inline-link';
      recoveryMessage.appendChild(document.createElement('br'));
      recoveryMessage.appendChild(resetLink);
    }
    recoveryMessage.classList.add('show');
  } catch (err) {
    recoveryError.textContent = err.message;
    recoveryError.classList.add('show');
  }
}

sendPasswordResetButton.addEventListener('click', () => sendRecoveryRequest('/api/auth/forgot-password'));

resetPasswordForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  clearRecoveryMessages();
  const token = new URLSearchParams(window.location.search).get('resetToken');
  const password = document.getElementById('reset-password').value.trim();
  try {
    const data = await fetchJson('/api/auth/reset-password', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ token, password }) });
    resetPasswordForm.reset();
    window.history.replaceState({}, document.title, window.location.pathname);
    resetMessage.textContent = data.message;
    resetMessage.classList.add('show');
  } catch (err) {
    resetError.textContent = err.message;
    resetError.classList.add('show');
  }
});

signupForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  signupError.textContent = '';
  signupError.classList.remove('show');
  const firstName = document.getElementById('signup-first-name').value.trim();
  const middleName = document.getElementById('signup-middle-name').value.trim();
  const lastName = document.getElementById('signup-last-name').value.trim();
  const birthday = document.getElementById('signup-birthday').value;
  const gender = document.getElementById('signup-gender').value;
  const email = document.getElementById('signup-email').value.trim();
  const password = document.getElementById('signup-password').value;
  const termsAccepted = document.getElementById('signup-terms-agree').checked;
  const privacyAccepted = document.getElementById('signup-privacy-agree').checked;
  if (!termsAccepted || !privacyAccepted) {
    signupError.textContent = 'You must agree to the Terms and Conditions and Privacy Notice before creating an account.';
    signupError.classList.add('show');
    return;
  }
  try {
    const data = await fetchJson('/api/auth/signup', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ firstName, middleName, lastName, birthday, gender, email, password, termsAccepted, privacyAccepted }) });
    signupForm.reset();
    if (data.requiresVerification === false) {
      currentUser = data.user || await fetchJson('/api/auth/me');
      showDashboard(currentUser);
      return;
    }
    showVerificationForm(data.email, data.message);
  } catch (err) {
    signupError.textContent = err.message;
    signupError.classList.add('show');
    if (err.message === 'This email is already associated with an account') {
      document.getElementById('signin-email').value = email;
      setTimeout(() => {
        signupError.textContent = '';
        signupError.classList.remove('show');
        showAuthForm('signin-form');
        signinError.textContent = 'That email already has an account. Sign in below.';
        signinError.classList.add('show');
      }, 900);
    }
  }
});

signinForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  signinError.textContent = '';
  signinError.classList.remove('show');
  const email = document.getElementById('signin-email').value.trim();
  const password = document.getElementById('signin-password').value;
  try {
    await fetchJson('/api/auth/signin', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) });
    currentUser = await fetchJson('/api/auth/me');
    signinForm.reset();
    await playRideTransition();
    showDashboard(currentUser);
  } catch (err) {
    if (err.message === 'Please verify your email before signing in') {
      showVerificationForm(email, err.message);
      return;
    }
    signinError.textContent = err.message;
    signinError.classList.add('show');
  }
});

offerForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const origin = document.getElementById('origin').value.trim();
  const destination = document.getElementById('destination').value.trim();
  const originLat = document.getElementById('origin-lat').value;
  const originLng = document.getElementById('origin-lng').value;
  const destinationLat = document.getElementById('destination-lat').value;
  const destinationLng = document.getElementById('destination-lng').value;
  const date = document.getElementById('ride-date').value;
  const time = document.getElementById('ride-time').value;
  const sameGenderOnly = sameGenderOnlyRideCheckbox.checked;
  const sameSchoolOnly = sameSchoolOnlyRideCheckbox.checked;
  const rideProviderType = rideProviderTypeSelect.value;
  const seats = document.getElementById('seats').value;
  const vehicleSeatCount = Number(vehicleSeatCountSelect.value);
  const availableSeatIds = [...driverAvailableSeatIds];
  const rideshareService = rideshareServiceSelect.value.trim();
  const rideshareSeatCount = Number(rideshareSeatCountInput.value);
  const price = document.getElementById('ride-price').value;
  const carMaker = document.getElementById('car-maker').value.trim();
  const carModel = document.getElementById('car-model').value.trim();
  const carColor = document.getElementById('car-color').value.trim();
  const licensePlate = document.getElementById('license-plate').value.trim();
  const termsAccepted = document.getElementById('ride-terms-agree').checked;
  const pickupRadiusMiles = getRadiusInputMiles(offerPickupRadiusInput);
  const dropoffRadiusMiles = getRadiusInputMiles(offerDropoffRadiusInput);
  const notes = document.getElementById('notes').value.trim();
  const rideMetrics = await estimateRideMetrics(
    { lat: Number(originLat), lng: Number(originLng) },
    { lat: Number(destinationLat), lng: Number(destinationLng) },
    date,
    time
  );
  if (!origin || !destination || !date || !time || !rideProviderType || !price || !termsAccepted) {
    showToast('Fill in all required fields and select both locations.', 'error');
    return;
  }
  if (!originLat || !originLng || !destinationLat || !destinationLng) {
    showToast('Select pick-up and drop-off locations from the suggestions so coordinates are set.', 'error');
    return;
  }
  if (rideProviderType === 'personal_car' && (!seats || !carMaker || !carModel || !carColor || !licensePlate || !availableSeatIds.length)) {
    showToast('Personal car rides require vehicle details and at least one available seat.', 'error');
    return;
  }
  if (rideProviderType === 'rideshare_service' && (!rideshareService || !Number.isInteger(rideshareSeatCount) || rideshareSeatCount < 1 || rideshareSeatCount > 7)) {
    showToast('Enter a rideshare service name and 1–7 available spots.', 'error');
    return;
  }
  if (Number(price) < 0.5) {
    showToast('Price per seat must be at least $0.50.', 'error');
    return;
  }
  if (sameGenderOnly && (!currentUser.gender || currentUser.gender === 'prefer-not-to-say')) {
    showToast('Set a visible gender on your profile before offering same-gender rides.', 'error');
    return;
  }
  try {
    await fetchJson('/api/rides', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        origin,
        destination,
        originLat: parseFloat(originLat),
        originLng: parseFloat(originLng),
        destinationLat: parseFloat(destinationLat),
        destinationLng: parseFloat(destinationLng),
        pickupRadiusMiles,
        dropoffRadiusMiles,
        date,
        time,
        sameGenderOnly,
        sameSchoolOnly,
        rideProviderType,
        rideshareService,
        rideshareSeatCount,
        vehicleSeatCount,
        seatsAvailable: Number(seats),
        availableSeatIds,
        price: Number(price),
        carMaker,
        carModel,
        carColor,
        licensePlate,
        termsAccepted,
        estimatedDurationMinutes: rideMetrics.durationMinutes,
        distanceMiles: rideMetrics.distanceMiles,
        notes,
      }),
    });
    offerForm.reset();
    offerPickupRadiusCircle = drawMapFlexCircle(offerPickupRadiusCircle, originMap, null, 0, '#3ecfcf');
    offerDropoffRadiusCircle = drawMapFlexCircle(offerDropoffRadiusCircle, originMap, null, 0, '#4d9ef5');
    currentVehicleSeatCount = 5;
    vehicleSeatCountSelect.value = '5';
    driverAvailableSeatIds = new Set();
    renderDriverSeatLayout();
    resetOfferProviderSelection();
    document.getElementById('origin-selected').textContent = '';
    document.getElementById('origin-selected').classList.remove('active');
    document.getElementById('destination-selected').textContent = '';
    document.getElementById('destination-selected').classList.remove('active');
    loadRides();
    loadProfile();
    showDashboardHome();
  } catch (err) {
    showToast(err.message, 'error');
  }
});

requestRideButton.addEventListener('click', () => showRequestRidePage());
requestRideBackHomeButton.addEventListener('click', () => returnToBrowseRides());
requestRideForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  clearRequestRideMessages();
  await ensureRequestCoordinates();
  const requestOriginCoordinate = getRideOriginCoordinate({
    origin: document.getElementById('request-origin').value.trim(),
    originLat: document.getElementById('request-origin-lat').value,
    originLng: document.getElementById('request-origin-lng').value,
  });
  const requestDestinationCoordinate = getRideDestinationCoordinate({
    destination: document.getElementById('request-destination').value.trim(),
    destinationLat: document.getElementById('request-destination-lat').value,
    destinationLng: document.getElementById('request-destination-lng').value,
  });
  const requestRideMetrics = await estimateRideMetrics(
    requestOriginCoordinate,
    requestDestinationCoordinate,
    document.getElementById('request-date').value,
    document.getElementById('request-time').value
  );
  const payload = {
    origin: document.getElementById('request-origin').value.trim(),
    destination: document.getElementById('request-destination').value.trim(),
    originLat: document.getElementById('request-origin-lat').value || null,
    originLng: document.getElementById('request-origin-lng').value || null,
    destinationLat: document.getElementById('request-destination-lat').value || null,
    destinationLng: document.getElementById('request-destination-lng').value || null,
    pickupRadiusMiles: getRadiusInputMiles(requestPickupRadiusInput),
    dropoffRadiusMiles: getRadiusInputMiles(requestDropoffRadiusInput),
    date: document.getElementById('request-date').value,
    time: document.getElementById('request-time').value,
    riderCount: Number(document.getElementById('request-rider-count').value),
    willingToPay: Number(document.getElementById('request-price').value),
    estimatedDurationMinutes: requestRideMetrics.durationMinutes,
    distanceMiles: requestRideMetrics.distanceMiles,
    shareRideWithOthers: document.getElementById('request-share-ride').checked,
    sameGenderDriverOnly: document.getElementById('request-same-gender-driver').checked,
    sameSchoolDriverOnly: document.getElementById('request-same-school-driver').checked,
    notes: document.getElementById('request-notes').value.trim(),
  };
  try {
    await fetchJson('/api/ride-requests', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    requestRideForm.reset();
    requestPickupRadiusCircle = drawMapFlexCircle(requestPickupRadiusCircle, requestOriginMap, null, 0, '#3ecfcf');
    requestDropoffRadiusCircle = drawMapFlexCircle(requestDropoffRadiusCircle, requestOriginMap, null, 0, '#4d9ef5');
    ['request-origin-selected', 'request-destination-selected'].forEach((id) => {
      const element = document.getElementById(id);
      if (element) {
        element.textContent = '';
        element.classList.remove('active');
      }
    });
    document.getElementById('request-rider-count').value = '1';
    requestRideMessage.textContent = 'Request posted. Drivers can now see it.';
    requestRideMessage.classList.add('show');
    loadProfile();
  } catch (err) {
    requestRideError.textContent = err.message;
    requestRideError.classList.add('show');
  }
});
listRideButton.addEventListener('click', () => showListRidePage());
listRideBackHomeButton.addEventListener('click', () => returnToBrowseRides());
chatButton.addEventListener('click', () => showChatPage());
chatBackHomeButton.addEventListener('click', () => returnToBrowseRides());
cartButton.addEventListener('click', () => showCartPage());
yourRidesButton.addEventListener('click', () => showYourRidesPage());
yourRidesCurrentTab.addEventListener('click', () => { setYourRidesView('current'); loadYourRides(); });
yourRidesRequestsTab.addEventListener('click', () => { setYourRidesView('requests'); loadYourRides(); });
yourRidesHistoryTab.addEventListener('click', () => { setYourRidesView('history'); loadYourRides(); });
yourRidesBackHomeButton.addEventListener('click', () => returnToBrowseRides());
leaderboardButton.addEventListener('click', () => showLeaderboardPage());
leaderboardBackHomeButton.addEventListener('click', () => returnToBrowseRides());
publicProfileBackHomeButton.addEventListener('click', () => returnToBrowseRides());
profileButton.addEventListener('click', () => showProfilePage());
profileBackHomeButton.addEventListener('click', () => returnToBrowseRides());
privacyLink.addEventListener('click', () => showLegalPage('privacy'));
termsLink.addEventListener('click', () => showLegalPage('terms'));
legalInlineLinks.forEach((link) => {
  link.addEventListener('click', (event) => {
    event.preventDefault();
    event.stopPropagation();
    openLegalModal(link.dataset.legalModal);
  });
});
legalModal?.addEventListener('click', (event) => {
  if (event.target.closest('[data-legal-modal-close]')) closeLegalModal();
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && !legalModal?.classList.contains('hidden')) closeLegalModal();
});
legalBackButtons.forEach((button) => {
  button.addEventListener('click', () => returnFromLegalPage());
});
document.addEventListener('click', (event) => {
  const profileLink = event.target.closest('.user-profile-link');
  if (!profileLink) return;
  event.preventDefault();
  showPublicProfilePage(profileLink.dataset.userId);
});
profileSidebarButtons.forEach((button) => {
  button.addEventListener('click', () => {
    clearDefaultPaymentMessages();
    clearPayoutMessages();
    showProfileTab(button.dataset.profileTab);
  });
});

profilePictureInput?.addEventListener('change', () => {
  clearProfileMessages();
  const file = profilePictureInput.files?.[0];
  if (!file) return;
  handleProfilePictureFile(file);
});

// Drag-and-drop on the dropzone
(function () {
  const dropzone = document.getElementById('profile-picture-dropzone');
  if (!dropzone) return;

  function preventDefaults(e) { e.preventDefault(); e.stopPropagation(); }

  ['dragenter', 'dragover'].forEach(evt => {
    dropzone.addEventListener(evt, e => { preventDefaults(e); dropzone.classList.add('drag-over'); });
  });
  ['dragleave', 'dragend', 'drop'].forEach(evt => {
    dropzone.addEventListener(evt, e => { preventDefaults(e); dropzone.classList.remove('drag-over'); });
  });

  dropzone.addEventListener('drop', e => {
    const file = e.dataTransfer?.files?.[0];
    if (file) handleProfilePictureFile(file);
  });

  // Keyboard accessibility — label's `for` handles Enter natively in most browsers,
  // but Space needs a nudge since labels don't respond to Space by default
  dropzone.addEventListener('keydown', e => {
    if (e.key === ' ') {
      e.preventDefault();
      profilePictureInput?.click();
    }
  });
})();

// ── Profile picture crop modal ──────────────────────────────
(function () {
  const modal      = document.getElementById('pic-crop-modal');
  const canvas     = document.getElementById('pic-crop-canvas');
  const zoomSlider = document.getElementById('pic-crop-zoom');
  const btnCancel  = document.getElementById('pic-crop-cancel');
  const btnConfirm = document.getElementById('pic-crop-confirm');
  if (!modal || !canvas) return;

  const ctx = canvas.getContext('2d');

  // ── State ─────────────────────────────────────────────────
  // All coordinates are in CSS pixels (logical). Canvas is sized
  // at devicePixelRatio internally, but we think in CSS px throughout.
  let img = null;
  let dpr = 1;
  let size = 400;      // canvas CSS size (square)
  let cropR = 170;     // circle radius in CSS px
  let cx = 200;        // circle centre x (always size/2)
  let cy = 200;        // circle centre y (always size/2)

  // Image position: (imgX, imgY) = top-left corner of the image in CSS px
  let imgX = 0, imgY = 0;
  let scale = 1;       // px per image-natural-pixel

  let minScale = 1;    // scale where image exactly fills the crop circle

  let dragging = false;
  let dragStartX = 0, dragStartY = 0;
  let imgStartX = 0, imgStartY = 0;

  let lastPinchDist = null;
  let lastPinchMidX = 0, lastPinchMidY = 0;

  // ── Draw ──────────────────────────────────────────────────
  // Everything is drawn on one canvas in logical (CSS) pixel space.
  // We scale the context by dpr once after resize.
  function draw() {
    if (!img) return;
    const W = size, H = size;

    ctx.clearRect(0, 0, W, H);

    // 1. Draw image
    ctx.drawImage(img, imgX, imgY, img.naturalWidth * scale, img.naturalHeight * scale);

    // 2. Dark overlay covering everything outside the circle
    ctx.save();
    ctx.fillStyle = 'rgba(0,0,0,0.55)';
    // full rect minus circle
    ctx.beginPath();
    ctx.rect(0, 0, W, H);
    ctx.arc(cx, cy, cropR, 0, Math.PI * 2, true); // true = counterclockwise (hole)
    ctx.fill('evenodd');
    ctx.restore();

    // 3. Circle border + subtle grid
    ctx.save();
    // Clip to circle for grid lines
    ctx.beginPath();
    ctx.arc(cx, cy, cropR, 0, Math.PI * 2);
    ctx.clip();

    // Rule-of-thirds grid
    ctx.strokeStyle = 'rgba(255,255,255,0.15)';
    ctx.lineWidth = 1;
    for (let i = 1; i <= 2; i++) {
      const x = cx - cropR + (cropR * 2 * i / 3);
      const y = cy - cropR + (cropR * 2 * i / 3);
      ctx.beginPath(); ctx.moveTo(x, cy - cropR); ctx.lineTo(x, cy + cropR); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(cx - cropR, y); ctx.lineTo(cx + cropR, y); ctx.stroke();
    }
    ctx.restore();

    // 4. Circle ring (drawn on top, no clip)
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, cropR, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(62,207,207,0.9)';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.restore();
  }

  // ── Scale / pan helpers ───────────────────────────────────
  // minScale: image must be large enough to fully cover the crop circle
  function calcMinScale() {
    if (!img) return 1;
    const scaleW = (cropR * 2) / img.naturalWidth;
    const scaleH = (cropR * 2) / img.naturalHeight;
    return Math.max(scaleW, scaleH);
  }

  // Clamp so image always covers the crop circle
  function clamp() {
    const iw = img.naturalWidth  * scale;
    const ih = img.naturalHeight * scale;
    // Left edge of image must be ≤ cx - cropR
    imgX = Math.min(imgX, cx - cropR);
    // Right edge must be ≥ cx + cropR
    imgX = Math.max(imgX, cx + cropR - iw);
    // Top edge must be ≤ cy - cropR
    imgY = Math.min(imgY, cy - cropR);
    // Bottom edge must be ≥ cy + cropR
    imgY = Math.max(imgY, cy + cropR - ih);
  }

  // Apply a new scale, keeping a given CSS-px point (pivX, pivY) stationary
  function applyScale(newScale, pivX, pivY) {
    const clamped = Math.max(minScale, Math.min(minScale * 4, newScale));
    // The image point under the pivot stays fixed
    // imagePoint = (pivX - imgX) / scale
    const ipx = (pivX - imgX) / scale;
    const ipy = (pivY - imgY) / scale;
    scale = clamped;
    imgX = pivX - ipx * scale;
    imgY = pivY - ipy * scale;
    clamp();
  }

  function syncSlider() {
    // slider 100–400 maps to minScale–minScale*4
    const pct = Math.round(((scale - minScale) / (minScale * 3)) * 300 + 100);
    zoomSlider.value = Math.max(100, Math.min(400, pct));
    zoomSlider.style.setProperty('--val', zoomSlider.value);
  }

  // ── Pointer helpers ───────────────────────────────────────
  function clientToCanvas(clientX, clientY) {
    const r = canvas.getBoundingClientRect();
    return {
      x: (clientX - r.left) * (size / r.width),
      y: (clientY - r.top)  * (size / r.height),
    };
  }

  function touchDist(e) {
    return Math.hypot(
      e.touches[0].clientX - e.touches[1].clientX,
      e.touches[0].clientY - e.touches[1].clientY
    );
  }

  function touchMid(e) {
    return clientToCanvas(
      (e.touches[0].clientX + e.touches[1].clientX) / 2,
      (e.touches[0].clientY + e.touches[1].clientY) / 2
    );
  }

  // ── Mouse events ─────────────────────────────────────────
  canvas.addEventListener('mousedown', e => {
    if (e.button !== 0) return;
    e.preventDefault();
    dragging = true;
    const pos = clientToCanvas(e.clientX, e.clientY);
    dragStartX = pos.x; dragStartY = pos.y;
    imgStartX = imgX;   imgStartY = imgY;
  });

  window.addEventListener('mousemove', e => {
    if (!dragging) return;
    const pos = clientToCanvas(e.clientX, e.clientY);
    imgX = imgStartX + (pos.x - dragStartX);
    imgY = imgStartY + (pos.y - dragStartY);
    clamp(); draw();
  });

  window.addEventListener('mouseup', () => { dragging = false; });

  canvas.addEventListener('wheel', e => {
    e.preventDefault();
    const pos = clientToCanvas(e.clientX, e.clientY);
    const factor = e.deltaY < 0 ? 1.08 : 0.93;
    applyScale(scale * factor, pos.x, pos.y);
    draw(); syncSlider();
  }, { passive: false });

  // ── Touch events ─────────────────────────────────────────
  canvas.addEventListener('touchstart', e => {
    e.preventDefault();
    if (e.touches.length === 1) {
      dragging = true;
      lastPinchDist = null;
      const pos = clientToCanvas(e.touches[0].clientX, e.touches[0].clientY);
      dragStartX = pos.x; dragStartY = pos.y;
      imgStartX = imgX;   imgStartY = imgY;
    } else if (e.touches.length === 2) {
      dragging = false;
      lastPinchDist = touchDist(e);
      const mid = touchMid(e);
      lastPinchMidX = mid.x; lastPinchMidY = mid.y;
    }
  }, { passive: false });

  canvas.addEventListener('touchmove', e => {
    e.preventDefault();
    if (e.touches.length === 1 && dragging) {
      const pos = clientToCanvas(e.touches[0].clientX, e.touches[0].clientY);
      imgX = imgStartX + (pos.x - dragStartX);
      imgY = imgStartY + (pos.y - dragStartY);
      clamp(); draw();
    } else if (e.touches.length === 2 && lastPinchDist) {
      const dist = touchDist(e);
      const mid  = touchMid(e);
      applyScale(scale * (dist / lastPinchDist), mid.x, mid.y);
      lastPinchDist = dist;
      draw(); syncSlider();
    }
  }, { passive: false });

  canvas.addEventListener('touchend', e => {
    if (e.touches.length < 2) lastPinchDist = null;
    if (e.touches.length === 0) dragging = false;
  });

  // ── Zoom slider ───────────────────────────────────────────
  zoomSlider.addEventListener('input', () => {
    const pct = Number(zoomSlider.value); // 100–400
    const newScale = minScale + (pct - 100) / 300 * (minScale * 3);
    applyScale(newScale, cx, cy); // zoom around circle centre
    draw();
    zoomSlider.style.setProperty('--val', pct);
  });

  // ── Canvas resize ─────────────────────────────────────────
  function resizeCanvas() {
    dpr = window.devicePixelRatio || 1;
    size = canvas.clientWidth || 400;
    cropR = size * 0.42;
    cx = size / 2;
    cy = size / 2;
    canvas.width  = size * dpr;
    canvas.height = size * dpr;
    ctx.setTransform(1, 0, 0, 1, 0, 0); // reset before re-scaling
    ctx.scale(dpr, dpr);
  }

  // ── Open / close ──────────────────────────────────────────
  window.openPicCropModal = function (src) {
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';

    img = new Image();
    img.onload = () => {
      resizeCanvas();
      minScale = calcMinScale();
      scale = minScale; // start fully fitted
      // Centre the image over the crop circle
      imgX = cx - (img.naturalWidth  * scale) / 2;
      imgY = cy - (img.naturalHeight * scale) / 2;
      clamp(); draw(); syncSlider();
    };
    img.src = src;
  };

  function closeModal() {
    modal.classList.add('hidden');
    document.body.style.overflow = '';
    img = null; dragging = false; lastPinchDist = null;
  }

  btnCancel.addEventListener('click', closeModal);
  modal.querySelector('.pic-crop-backdrop').addEventListener('click', closeModal);
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) closeModal();
  });

  // ── Confirm: export 512×512 JPEG ─────────────────────────
  btnConfirm.addEventListener('click', () => {
    const OUT = 512;
    const off = document.createElement('canvas');
    off.width = off.height = OUT;
    const oc = off.getContext('2d');

    // Clip to circle
    oc.beginPath();
    oc.arc(OUT / 2, OUT / 2, OUT / 2, 0, Math.PI * 2);
    oc.clip();

    // The crop circle in CSS px: centre (cx,cy) radius cropR
    // Map that region from the image source
    const srcX = (cx - cropR - imgX) / scale;
    const srcY = (cy - cropR - imgY) / scale;
    const srcW = (cropR * 2) / scale;
    const srcH = (cropR * 2) / scale;

    oc.drawImage(img, srcX, srcY, srcW, srcH, 0, 0, OUT, OUT);

    pendingProfilePictureDataUrl = off.toDataURL('image/jpeg', 0.92);
    renderProfilePicturePreview();
    closeModal();
  });
})();

function handleProfilePictureFile(file) {
  const allowedTypes = ['image/png', 'image/jpeg', 'image/webp'];
  if (!allowedTypes.includes(file.type)) {
    profileError.textContent = 'Profile picture must be a PNG, JPG, or WebP image.';
    profileError.classList.add('show');
    if (profilePictureInput) profilePictureInput.value = '';
    return;
  }
  // 10 MB raw limit — crop will compress the result down
  if (file.size > 10 * 1024 * 1024) {
    profileError.textContent = 'Image must be 10 MB or smaller.';
    profileError.classList.add('show');
    if (profilePictureInput) profilePictureInput.value = '';
    return;
  }
  const reader = new FileReader();
  reader.onload = () => {
    window.openPicCropModal(String(reader.result || ''));
  };
  reader.onerror = () => {
    profileError.textContent = 'Unable to read that image. Try a different file.';
    profileError.classList.add('show');
  };
  reader.readAsDataURL(file);
}

profilePictureRemoveButton?.addEventListener('click', () => {
  clearProfileMessages();
  pendingProfilePictureDataUrl = '';
  if (profilePictureInput) profilePictureInput.value = '';
  renderProfilePicturePreview();
});
defaultPaymentForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  clearDefaultPaymentMessages();
  try {
    const data = await fetchJson('/api/profile/payment-method/setup-session', { method: 'POST' });
    defaultPaymentMessage.textContent = 'Enter your card below, then save it securely with Stripe.';
    defaultPaymentMessage.classList.add('show');
    await mountStripeSetupElement(data.clientSecret, data.setupIntentId);
  } catch (err) {
    defaultPaymentError.textContent = err.message;
    defaultPaymentError.classList.add('show');
  }
});

defaultPaymentConfirmButton?.addEventListener('click', async () => {
  clearDefaultPaymentMessages();
  if (!stripeSetupElements || !activeSetupIntentId) {
    defaultPaymentError.textContent = 'Start payment method setup first.';
    defaultPaymentError.classList.add('show');
    return;
  }
  try {
    defaultPaymentConfirmButton.disabled = true;
    const stripe = await getStripeInstance();
    const result = await stripe.confirmSetup({
      elements: stripeSetupElements,
      confirmParams: { return_url: window.location.origin + window.location.pathname + '?setup=payment' },
      redirect: 'if_required',
    });
    if (result.error) throw new Error(result.error.message || 'Unable to save payment method.');
    const setupIntentId = result.setupIntent?.id || activeSetupIntentId;
    currentUser = await fetchJson('/api/profile/payment-method/complete-setup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ setupIntentId }),
    });
    destroyStripeSetupElements();
    fillDefaultPaymentForm(currentUser);
    defaultPaymentMessage.textContent = 'Default payment method saved.';
    defaultPaymentMessage.classList.add('show');
  } catch (err) {
    defaultPaymentError.textContent = err.message;
    defaultPaymentError.classList.add('show');
  } finally {
    defaultPaymentConfirmButton.disabled = false;
  }
});
policyScrollbox?.addEventListener('scroll', updatePolicyAgreeButtonState);
policyTermsButton?.addEventListener('click', () => setPolicyFullView('terms'));
policyPrivacyButton?.addEventListener('click', () => setPolicyFullView('privacy'));
policyCollapseButton?.addEventListener('click', () => setPolicyFullView(''));
document.getElementById('profile-terms-agree')?.addEventListener('change', updatePolicyAgreeButtonState);
document.getElementById('profile-privacy-agree')?.addEventListener('change', updatePolicyAgreeButtonState);

policyConsentForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  clearPolicyMessages();
  if (!userNeedsPolicyConsent(currentUser)) {
    policyMessage.textContent = 'Already up to date.';
    policyMessage.classList.add('show');
    fillPolicyConsentForm(currentUser || {});
    return;
  }
  const { termsCheckbox, privacyCheckbox } = getProfilePolicyControls();
  const payload = {
    termsAccepted: termsCheckbox?.checked === true,
    privacyAccepted: privacyCheckbox?.checked === true,
  };
  if (!hasScrolledPolicyToBottom()) {
    policyError.textContent = 'Scroll to the bottom of the policy updates before agreeing.';
    policyError.classList.add('show');
    return;
  }
  if (!payload.termsAccepted || !payload.privacyAccepted) {
    policyError.textContent = 'You must agree to both policies before continuing.';
    policyError.classList.add('show');
    return;
  }
  try {
    currentUser = await fetchJson('/api/profile/policies', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    fillPolicyConsentForm(currentUser);
    updateUserHeader(currentUser);
    policyMessage.textContent = currentUser.requiresRequiredSettings
      ? 'Policies saved. Complete your remaining required profile settings.'
      : 'Policies saved. You\'re all set.';
    policyMessage.classList.add('show');
    if (currentUser.requiresRequiredSettings) {
      showRequiredSettingsRequired('Profile saved.');
      return;
    }
    loadCart();
  } catch (err) {
    policyError.textContent = err.message;
    policyError.classList.add('show');
  }
});

driverPayoutForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  clearPayoutMessages();
  try {
    currentUser = await fetchJson('/api/profile/payout', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(getDriverPayoutPayload()),
    });
    fillDriverPayoutForm(currentUser);
    payoutMessage.textContent = 'Payout information saved.';
    payoutMessage.classList.add('show');
  } catch (err) {
    payoutError.textContent = err.message;
    payoutError.classList.add('show');
  }
});
stripePayoutConnectButton?.addEventListener('click', async () => {
  clearPayoutMessages();
  try {
    setButtonLoading(stripePayoutConnectButton, true);
    const data = await fetchJson('/api/profile/payout/onboarding', { method: 'POST' });
    window.location.href = data.url;
  } catch (err) {
    payoutError.textContent = err.message.includes('Stripe is not configured')
      ? 'Stripe cash-out is not configured on this server. Add Stripe keys and restart with updated environment variables.'
      : err.message;
    payoutError.classList.add('show');
    setButtonLoading(stripePayoutConnectButton, false);
  }
});
trackTripButton.addEventListener('click', () => showTrackTripPage());
trackBackHomeButton.addEventListener('click', () => returnToBrowseRides());
copyTrackingLinkButton?.addEventListener('click', () => copyTrackingLink());
sendTrackingInviteButton?.addEventListener('click', () => sendTrackingInvite());
startTrackingButton.addEventListener('click', () => startTripTracking());
stopTrackingButton.addEventListener('click', () => stopTripTracking());
continueShoppingButton.addEventListener('click', () => returnToBrowseRides());
cartSelectAllCheckbox?.addEventListener('change', () => {
  const checked = cartSelectAllCheckbox.checked;
  cartItems.querySelectorAll('.cart-item-select-checkbox').forEach((checkbox) => {
    checkbox.checked = checked;
    const rideId = checkbox.closest('.cart-item-card')?.dataset.rideId;
    if (rideId) {
      if (checked) selectedCartRideIds.add(rideId);
      else selectedCartRideIds.delete(rideId);
    }
  });
  updateCartSelectionSummary();
});
siteLogo.addEventListener('click', () => {
  if (document.body.classList.contains('dashboard-mode')) showDashboardHome();
});
siteLogo.addEventListener('keydown', (event) => {
  if (!document.body.classList.contains('dashboard-mode')) return;
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    showDashboardHome();
  }
});

profileForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  clearProfileMessages();
  const payload = {
    firstName: document.getElementById('profile-first-name').value.trim(),
    middleName: document.getElementById('profile-middle-name').value.trim(),
    lastName: document.getElementById('profile-last-name').value.trim(),
    classYear: document.getElementById('profile-class-year').value.trim(),
    major: document.getElementById('profile-major').value.trim(),
    birthday: document.getElementById('profile-birthday').value,
    gender: document.getElementById('profile-gender').value,
    profilePictureDataUrl: pendingProfilePictureDataUrl ?? currentUser?.profilePictureDataUrl ?? '',
  };
  try {
    currentUser = await fetchJson('/api/profile', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    updateUserHeader(currentUser);
    fillProfileForm(currentUser);
    profileMessage.textContent = currentUser.requiresRequiredSettings
      ? 'Profile updated. Complete remaining required settings.'
      : 'Profile saved.';
    profileMessage.classList.add('show');
    if (currentUser.requiresRequiredSettings) {
      showRequiredSettingsRequired();
      return;
    }
    if (currentUser.serviceApproved) {
      loadRides();
      loadProfile();
    }
  } catch (err) {
    profileError.textContent = err.message;
    profileError.classList.add('show');
  }
});

checkoutCartButton.addEventListener('click', async () => {
  clearCartMessages();
  const visibleRideIds = syncCartStateFromDom();
  if (!cartRideIds.size && !visibleRideIds.length) {
    cartError.textContent = 'Your cart is empty.';
    cartError.classList.add('show');
    return;
  }
  const selectedRideIds = getSelectedCartRideIds();
  if (!selectedRideIds.length) {
    cartError.textContent = 'Select at least one trip before checking out.';
    cartError.classList.add('show');
    return;
  }
  try {
    const termsReady = await saveMissingCartTerms(selectedRideIds);
    if (!termsReady) return;
  } catch (err) {
    cartError.textContent = err.message;
    cartError.classList.add('show');
    return;
  }
  showPaymentPage(selectedRideIds);
});
paymentBackToCartButton.addEventListener('click', () => {
  destroyEmbeddedCheckout();
  showCartPage();
});
document.getElementById('pay-cart').addEventListener('click', async () => {
  clearCartMessages();
  paymentMessage.textContent = '';
  paymentMessage.classList.remove('show');
  paymentError.textContent = '';
  paymentError.classList.remove('show');
  try {
    // Use the authoritative in-memory set rather than re-querying possibly stale DOM checkboxes
    const selectedRideIds = [...selectedCartRideIds];
    if (!selectedRideIds.length) {
      showCartPage();
      cartError.textContent = 'Select at least one trip before checking out.';
      cartError.classList.add('show');
      return;
    }
    const termsReady = await saveMissingCartTerms(selectedRideIds);
    if (!termsReady) {
      showCartPage();
      return;
    }
    const data = await fetchJson('/api/cart/create-checkout-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rideIds: selectedRideIds }),
    });
    if (data.walletOnly) {
      paymentSummary.textContent = 'Your LinkUp wallet covers this checkout.';
      paymentMessage.textContent = formatCents(data.walletCreditCents || 0) + ' in wallet credit will be used.';
      paymentMessage.classList.add('show');
      await completeStripeCheckout(data.paymentIntentId);
      return;
    }
    paymentSummary.textContent = data.walletCreditCents
      ? formatCents(data.walletCreditCents) + ' in wallet credit applied. Enter payment details for the remaining balance.'
      : 'Enter your payment details below. Your card details stay with Stripe.';
    document.getElementById('pay-cart').classList.add('hidden');
    await mountStripePaymentElement(data.clientSecret, data.paymentIntentId);
  } catch (err) {
    paymentError.textContent = err.message;
    paymentError.classList.add('show');
  }
});

confirmPaymentButton?.addEventListener('click', async () => {
  paymentMessage.textContent = '';
  paymentMessage.classList.remove('show');
  paymentError.textContent = '';
  paymentError.classList.remove('show');
  if (!activePaymentElement || !activePaymentClientSecret || !activePaymentIntentId) {
    paymentError.textContent = 'Load the payment form first.';
    paymentError.classList.add('show');
    return;
  }
  try {
    confirmPaymentButton.disabled = true;
    const stripe = await getStripeInstance();
    const cardholderName = cardholderNameInput?.value.trim() || '';
    const result = await stripe.confirmCardPayment(activePaymentClientSecret, {
      payment_method: {
        card: activePaymentElement,
        billing_details: cardholderName ? { name: cardholderName } : {},
      },
    });
    if (result.error) throw new Error(result.error.message || 'Unable to complete payment.');
    if (result.paymentIntent?.status !== 'succeeded') {
      paymentMessage.textContent = 'Stripe is still processing this payment. Refresh the cart in a moment.';
      paymentMessage.classList.add('show');
      return;
    }
    await completeStripeCheckout(result.paymentIntent.id);
  } catch (err) {
    paymentError.textContent = err.message;
    paymentError.classList.add('show');
  } finally {
    confirmPaymentButton.disabled = false;
  }
});

signoutButton.addEventListener('click', async () => {
  try {
    if (activeTrackingTripId) {
      try {
        await stopTripTracking();
      } catch (_) {
        // Don't let a tracking stop failure block sign-out
      }
    }
    await fetchJson('/api/auth/signout', { method: 'POST' });
    clearAppRoute();
    showAuthSection();
  } catch (err) {
    console.error('Sign out error:', err);
  }
});

async function completeStripeCheckout(sessionId) {
  try {
    currentUser = await fetchJson('/api/auth/me');
    showDashboard(currentUser);
    setAppRoute('payment');
    hideDashboardPages();
    paymentPage.classList.remove('hidden');
    paymentSummary.textContent = String(sessionId || '').startsWith('wallet_')
      ? 'Applying your LinkUp wallet payment...'
      : 'Verifying your Stripe payment...';
    destroyEmbeddedCheckout();
    const data = await fetchJson('/api/cart/checkout/complete', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ sessionId }) });
    paymentMessage.textContent = data.message;
    paymentMessage.classList.add('show');
    await loadCart();
    loadRides();
    loadProfile();
    window.history.replaceState({}, document.title, window.location.pathname);
    clearAppRoute();
  } catch (err) {
    if (!currentUser) {
      showAuthSection();
      signinError.textContent = err.message;
      signinError.classList.add('show');
      return;
    }
    showDashboard(currentUser);
    showPaymentPage();
    paymentError.textContent = err.message;
    paymentError.classList.add('show');
  }
}

async function completeStripePaymentSetup(setupIntentId) {
  try {
    currentUser = await fetchJson('/api/auth/me');
    showDashboard(currentUser);
    showProfilePage('payment');
    defaultPaymentSummary.textContent = 'Verifying your saved Stripe payment method...';
    destroyEmbeddedCheckout();
    currentUser = await fetchJson('/api/profile/payment-method/complete-setup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ setupIntentId }),
    });
    fillDefaultPaymentForm(currentUser);
    defaultPaymentMessage.textContent = 'Default payment method saved.';
    defaultPaymentMessage.classList.add('show');
    window.history.replaceState({}, document.title, window.location.pathname);
  } catch (err) {
    if (!currentUser) {
      showAuthSection();
      signinError.textContent = err.message;
      signinError.classList.add('show');
      return;
    }
    showDashboard(currentUser);
    showProfilePage('payment');
    defaultPaymentError.textContent = err.message;
    defaultPaymentError.classList.add('show');
  }
}

async function refreshStripePayoutStatus(status) {
  try {
    currentUser = await fetchJson('/api/auth/me');
    showDashboard(currentUser);
    showProfilePage('payouts');
    if (status === 'refresh') {
      payoutError.textContent = 'Stripe payout onboarding needs a little more information.';
      payoutError.classList.add('show');
    }
    currentUser = await fetchJson('/api/profile/payout/status', { method: 'POST' });
    fillDriverPayoutForm(currentUser);
    if (status !== 'refresh') {
      payoutMessage.textContent = currentUser.payoutInfo?.stripe?.payoutsEnabled
        ? 'Stripe payouts are connected.'
        : 'Stripe payout details saved. Stripe may still be verifying your account.';
      payoutMessage.classList.add('show');
    }
    window.history.replaceState({}, document.title, window.location.pathname);
  } catch (err) {
    if (!currentUser) {
      showAuthSection();
      signinError.textContent = err.message;
      signinError.classList.add('show');
      return;
    }
    showDashboard(currentUser);
    showProfilePage('payouts');
    payoutError.textContent = err.message;
    payoutError.classList.add('show');
  }
}

loadExternalDocuments();

const params = new URLSearchParams(window.location.search);
const resetToken = params.get('resetToken');
const trackingViewerToken = params.get('trackToken');
const checkoutStatus = params.get('checkout');
const setupStatus = params.get('setup');
const connectTarget = params.get('connect');
const connectStatus = params.get('status');
const checkoutSessionId = params.get('session_id');
const checkoutPaymentIntentId = params.get('payment_intent');
const setupIntentId = params.get('setup_intent');
if (trackingViewerToken) {
  loadSharedTrackingPage(trackingViewerToken).finally(finishAppBoot);
} else if (resetToken) {
  showAuthSection();
  showAuthForm('reset-password-form');
  finishAppBoot();
} else if (checkoutStatus === 'success' && (checkoutSessionId || checkoutPaymentIntentId)) {
  completeStripeCheckout(checkoutSessionId || checkoutPaymentIntentId).finally(finishAppBoot);
} else if (checkoutStatus === 'cancel') {
  checkAuth().then(() => {
    showCartPage();
    cartError.textContent = 'Checkout was canceled. Your cart is still saved.';
    cartError.classList.add('show');
    window.history.replaceState({}, document.title, window.location.pathname);
  }).finally(finishAppBoot);
} else if (setupStatus === 'payment' && (checkoutSessionId || setupIntentId)) {
  completeStripePaymentSetup(checkoutSessionId || setupIntentId).finally(finishAppBoot);
} else if (setupStatus === 'cancel') {
  checkAuth().then(() => {
    showProfilePage('payment');
    defaultPaymentError.textContent = 'Payment method setup was canceled.';
    defaultPaymentError.classList.add('show');
    window.history.replaceState({}, document.title, window.location.pathname);
  }).finally(finishAppBoot);
} else if (connectTarget === 'payout') {
  refreshStripePayoutStatus(connectStatus).finally(finishAppBoot);
} else {
  checkAuth().finally(finishAppBoot);
}
