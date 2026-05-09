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
const privacyLink = document.getElementById('privacy-link');
const termsLink = document.getElementById('terms-link');
const legalBackButtons = document.querySelectorAll('.legal-back');
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
const schoolLeaderboardChart = document.getElementById('school-leaderboard-chart');
const milesLeaderboardSummary = document.getElementById('miles-leaderboard-summary');
const milesLeaderboardChart = document.getElementById('miles-leaderboard-chart');
const leaderboardError = document.getElementById('leaderboard-error');
const profilePage = document.getElementById('profile-page');
const profileForm = document.getElementById('profile-form');
const profileBackHomeButton = document.getElementById('profile-back-home');
const profileMessage = document.getElementById('profile-message');
const profileError = document.getElementById('profile-error');
const profileSidebarButtons = document.querySelectorAll('.profile-sidebar-button');
const profilePanels = document.querySelectorAll('[data-profile-panel]');
const driverPayoutForm = document.getElementById('driver-payout-form');
const payoutMessage = document.getElementById('payout-message');
const payoutError = document.getElementById('payout-error');
const defaultPaymentForm = document.getElementById('default-payment-form');
const defaultPaymentSummary = document.getElementById('default-payment-summary');
const defaultPaymentMessage = document.getElementById('default-payment-message');
const defaultPaymentError = document.getElementById('default-payment-error');
const payoutCommissionLabel = document.getElementById('payout-commission-label');
const LINKUP_COMMISSION_RATE = 0.15;
const cartCount = document.getElementById('cart-count');
const cartItems = document.getElementById('cart-items');
const cartSubtotal = document.getElementById('cart-subtotal');
const checkoutCartButton = document.getElementById('checkout-cart');
const continueShoppingButton = document.getElementById('continue-shopping');
const cartMessage = document.getElementById('cart-message');
const cartError = document.getElementById('cart-error');
const paymentPage = document.getElementById('payment-page');
const paymentSummary = document.getElementById('payment-summary');
const paymentBackToCartButton = document.getElementById('payment-back-to-cart');
const paymentMessage = document.getElementById('payment-message');
const paymentError = document.getElementById('payment-error');
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
const sendUsernameButton = document.getElementById('send-username');
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
let destinationMap = null;
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
let requestDestinationMap = null;
let requestOriginMarker = null;
let requestDestinationMarker = null;
let requestRouteRenderer = null;
let requestRouteLine = null;
let requestPickupRadiusCircle = null;
let requestDropoffRadiusCircle = null;
let pickupRadiusAutocomplete = null;
let dropoffRadiusAutocomplete = null;
let cartRideIds = new Set();
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

function isLegalRoute(route) {
  return route === 'privacy' || route === 'terms';
}

function profileRouteForTab(tabName = 'info') {
  return tabName === 'info' ? 'profile' : 'profile-' + tabName;
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
const destinationMapDiv = document.getElementById('destination-map');
const sameGenderOnlyRideCheckbox = document.getElementById('same-gender-only-ride');
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
    showLocationLookupError(input, 'Choose a more specific location from suggestions. LinkUp ignored an ambiguous out-of-region match.');
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
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
  document.getElementById('req-uppercase').classList.toggle('met', hasUppercase);
  document.getElementById('req-lowercase').classList.toggle('met', hasLowercase);
  document.getElementById('req-number').classList.toggle('met', hasNumber);
  document.getElementById('req-special').classList.toggle('met', hasSpecialChar);
  return hasUppercase && hasLowercase && hasNumber && hasSpecialChar;
}

async function fetchJson(url, options = {}) {
  const res = await fetch(url, options);
  const data = await res.json();
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
  profilePage.classList.add('hidden');
  trackTripPage.classList.add('hidden');
}


function updateUserHeader(user) {
  welcomeMessage.textContent = `Welcome, ${getDisplayName(user)}`;
  studentUniversityLabel.textContent = user.serviceApproved ? `${user.university} Ride Network` : `${user.university || user.universityDomain} Waitlist`;
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
  birthdayInput.value = user.birthday || '';
  genderInput.value = user.gender || '';
  document.getElementById('profile-email').value = user.email || '';
  birthdayInput.disabled = Boolean(user.birthday);
  genderInput.disabled = Boolean(user.gender);
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
    ? 'A new LinkUp policy or required profile feature is available. Please review and agree before using ride services.'
    : 'You have accepted the latest required LinkUp policies. No new agreement is needed until LinkUp publishes a required update.';
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

function fillDefaultPaymentForm(user) {
  const method = user.defaultPaymentMethod || null;
  document.getElementById('default-payment-name').value = method?.billingName || [user.firstName, user.lastName].filter(Boolean).join(' ');
  document.getElementById('default-payment-card').value = '';
  document.getElementById('default-payment-expiry').value = method?.expiry || '';
  document.getElementById('default-payment-cvv').value = '';
  document.getElementById('default-payment-zip').value = method?.billingZip || '';
  defaultPaymentSummary.textContent = method
    ? method.brand + ' ending in ' + method.last4 + (method.expiry ? ' - expires ' + method.expiry : '')
    : 'No default payment method saved.';
}

function getDefaultPaymentPayload() {
  return {
    name: document.getElementById('default-payment-name').value.trim(),
    cardNumber: document.getElementById('default-payment-card').value.trim(),
    expiry: document.getElementById('default-payment-expiry').value.trim(),
    cvv: document.getElementById('default-payment-cvv').value.trim(),
    billingZip: document.getElementById('default-payment-zip').value.trim(),
  };
}

function clearPayoutMessages() {
  payoutMessage.textContent = '';
  payoutMessage.classList.remove('show');
  payoutError.textContent = '';
  payoutError.classList.remove('show');
}

function fillDriverPayoutForm(user) {
  const info = user.payoutInfo || {};
  document.getElementById('payout-legal-name').value = info.legalName || [user.firstName, user.lastName].filter(Boolean).join(' ');
  document.getElementById('payout-method').value = info.method || '';
  document.getElementById('payout-email').value = info.email || user.email || '';
  document.getElementById('payout-phone').value = info.phone || '';
  document.getElementById('payout-handle').value = info.handle || '';
  document.getElementById('payout-address').value = info.address || '';
  document.getElementById('payout-notes').value = info.notes || '';
  document.getElementById('payout-confirm').checked = Boolean(info.confirmedAt);
  if (payoutCommissionLabel) payoutCommissionLabel.textContent = Math.round(LINKUP_COMMISSION_RATE * 100) + '%';
}

function getDriverPayoutPayload() {
  return {
    legalName: document.getElementById('payout-legal-name').value.trim(),
    method: document.getElementById('payout-method').value,
    email: document.getElementById('payout-email').value.trim(),
    phone: document.getElementById('payout-phone').value.trim(),
    handle: document.getElementById('payout-handle').value.trim(),
    address: document.getElementById('payout-address').value.trim(),
    notes: document.getElementById('payout-notes').value.trim(),
    confirmed: document.getElementById('payout-confirm').checked,
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
  schoolLeaderboardChart.innerHTML = '';
  try {
    const data = await fetchJson('/api/leaderboard/schools');
    renderSchoolLeaderboard(data);
  } catch (err) {
    leaderboardSummary.textContent = '';
    milesLeaderboardSummary.textContent = '';
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
  policyError.textContent = 'Please agree to the latest Terms and Conditions and Privacy Notice before using LinkUp services.';
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
  return true;
}

function showPaymentPage() {
  setAppRoute('payment');
  clearCartMessages();
  hideDashboardPages();
  paymentPage.classList.remove('hidden');
  paymentSummary.textContent = `You will pay the driver-set price for ${cartRideIds.size} ride${cartRideIds.size === 1 ? '' : 's'} in your cart.`;
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
    else if (route === 'profile-payment') showProfilePage('payment');
    else if (route === 'profile-payouts') showProfilePage('payouts');
    else if (route === 'profile-policies') showProfilePage('policies');
    else if (route === 'profile-release-notes') showProfilePage('release-notes');
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
  studentUniversityLabel.textContent = user.serviceApproved ? `${user.university} Ride Network` : `${user.university || user.universityDomain} Waitlist`;
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
  loadCart();
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
  trackingStatus.textContent = isActive ? 'Location sharing is on.' : 'Location sharing is off.';
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
    trackingError.textContent = 'Start sharing first, then enter a trusted email.';
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
    trackingError.textContent = 'Start sharing first to create a tracking link.';
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
  return formatCents(ride.priceCents || 500);
}

function formatDriverRating(ride) {
  const count = Number(ride.driverRatingCount || 0);
  const average = Number(ride.driverRatingAverage);
  if (!count || !Number.isFinite(average)) return 'No ratings yet';
  return average.toFixed(1) + ' out of 5 stars from ' + count + ' rider' + (count === 1 ? '' : 's');
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
  await loadGoogleMapsAPI();
  if (!window.google?.maps?.DistanceMatrixService || !origin || !destination) return null;
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
        resolve(null);
        return;
      }
      const seconds = element.duration_in_traffic?.value || element.duration?.value;
      resolve(seconds ? Math.max(5, Math.ceil(seconds / 60)) : null);
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
  if (sameSchoolOnlyFilter?.checked && ride.university !== currentUser.university) return false;
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
  const label = mode === 'rider' ? 'Walking radius' : 'Driver detour radius';
  const pickupLabel = mode === 'rider' ? 'To pickup ' : 'Pickup detour ';
  const dropoffLabel = mode === 'rider' ? 'From drop-off ' : 'Drop-off detour ';
  return '<div><strong>' + label + ':</strong> ' + pickupLabel + esc(pickup > 0 ? formatMiles(pickup) : 'Exact') + ' · ' + dropoffLabel + esc(dropoff > 0 ? formatMiles(dropoff) : 'Exact') + '</div>';
}

function esc(str) {
  return String(str ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
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
  details.innerHTML = `
    <div><strong>Driver:</strong> ${esc(ride.driverFirstName)} ${esc(ride.driverLastName)}</div>
    <div><strong>School:</strong> ${esc(ride.university || 'Unknown school')}</div>
    <div><strong>Driver rating:</strong> ${esc(formatDriverRating(ride))}</div>
    <div><strong>Preference:</strong> ${ride.sameGenderOnly ? 'Same gender riders only' : 'Open to all riders'}</div>
    ${getFlexRadiusMarkup(ride, 'driver')}
    ${getCoordinateMarkup(ride)}
    <div><strong>Departure:</strong> ${esc(formatRideDateTime(ride))}</div>
    <div><strong>Estimated ride time:</strong> ${esc(formatDuration(ride.estimatedDurationMinutes))}</div>
    ${ride.returnRide ? `<div><strong>Return:</strong> ${esc(formatRideDateTime(ride.returnRide))}</div>` : ''}
    <div><strong>Seats left:</strong> ${esc(ride.seatsAvailable)}</div>
    ${ride.seatingChartUnavailable ? '<div><strong>Seats:</strong> Seating chart unavailable</div>' : ''}
    <div><strong>Miles:</strong> ${esc(formatMiles(getRideMiles(ride)))}</div>
    <div><strong>Price:</strong> ${esc(formatRidePrice(ride))}</div>
    ${getVehicleDetailMarkup(ride)}
    <div><strong>Notes:</strong> ${esc(ride.notes || 'None')}</div>
  `;
  card.appendChild(details);
  if (ride.driverId === currentUser.id) {
    if (ride.seatingChartUnavailable) {
      const notice = document.createElement('div');
      notice.className = 'seat-picker-hint shared-seat-notice';
      notice.textContent = 'Seating chart unavailable for this shared requested ride.';
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
      cartActionButton.textContent = isInCart ? 'In cart' : 'Add shared spot to cart';
      cartActionButton.disabled = isInCart || ride.seatsAvailable <= 0;
      const notice = document.createElement('div');
      notice.className = 'seat-picker-hint shared-seat-notice';
      notice.textContent = 'Seating chart unavailable. You are reserving a general shared ride spot.';
      card.appendChild(notice);
    } else {
      cartActionButton.textContent = isInCart ? 'In cart' : (selectedSeatId ? 'Add ' + getSeatLabel(selectedSeatId) + ' to cart' : 'Select a seat');
      cartActionButton.disabled = isInCart || !selectedSeatId || ride.seatsAvailable <= 0;
      card.appendChild(renderRideSeatPicker(ride, cartActionButton));
    }
    const riderTermsLabel = document.createElement('label');
    riderTermsLabel.className = 'checkbox-label terms-agreement rider-terms-agreement';
    const riderTermsCheckbox = document.createElement('input');
    riderTermsCheckbox.type = 'checkbox';
    riderTermsLabel.append(
      riderTermsCheckbox,
      document.createTextNode(' I agree to LinkUp\'s Terms and Conditions for this ride.')
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
        await fetchJson(`/api/cart/${ride.id}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ seatId, termsAccepted: true }) });
        await loadCart();
        loadRides();
      } catch (err) {
        cardError.textContent = err.message;
        cardError.classList.add('show');
      }
    };
    card.appendChild(cartActionButton);
    card.appendChild(cardError);
  }
  const riders = document.createElement('div');
  riders.style.marginTop = '0.8rem';
  riders.style.fontSize = '0.95rem';
  riders.textContent = `Passengers: ${(ride.passengers || []).length}`;
  card.appendChild(riders);
  return card;
}
function getCurrentUserSeatId(ride) {
  if (ride.selectedSeatId) return ride.selectedSeatId;
  const passenger = (ride.passengers || []).find((p) => p.studentId === currentUser?.id);
  return passenger?.seatId || '';
}

function canSeeRideLicensePlate(ride) {
  return ride.driverId === currentUser?.id || Boolean(getCurrentUserSeatId(ride));
}

function getVehicleDetailMarkup(ride) {
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
      meta.textContent = (message.senderFirstName || 'Student') + ' · ' + (message.senderRole || 'Rider') + ' · ' + formatChatTime(message.createdAt);
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
      <div><strong>Driver:</strong> ${esc(driverName)}</div>
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
      const firstButton = [...chatRideList.querySelectorAll('.chat-ride-button')].find((button) => button.textContent === getChatRideTitle(initialRide));
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
  title.textContent = 'Seat assignments';
  manifest.appendChild(title);

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
    rider.textContent = passenger
      ? [passenger.studentFirstName, passenger.studentLastName].filter(Boolean).join(' ') + (passenger.email ? ' · ' + passenger.email : '')
      : (isForSale ? 'Available' : 'Unavailable');

    row.append(seat, rider);
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
  const details = document.createElement('div');
  details.className = 'ride-details';
  details.innerHTML = `
    <div><strong>Rider:</strong> ${esc(request.riderFirstName || 'Student')} ${esc(request.riderLastName || '')}</div>
    <div><strong>School:</strong> ${esc(request.university || 'Unknown school')}</div>
    <div><strong>Preference:</strong> ${request.sameGenderDriverOnly ? 'Same gender driver only' : 'Open to all drivers'}</div>
    ${getFlexRadiusMarkup(request, 'rider')}
    ${getCoordinateMarkup(request)}
    <div><strong>Requested time:</strong> ${esc(requestTime)}</div>
    <div><strong>Estimated ride time:</strong> ${esc(formatDuration(request.estimatedDurationMinutes))}</div>
    <div><strong>Riders:</strong> ${esc(request.riderCount || 1)}</div>
    <div><strong>Share with others:</strong> ${request.shareRideWithOthers === undefined ? 'Not specified' : (request.shareRideWithOthers ? 'Yes' : 'No')}</div>
    <div><strong>Willing to pay:</strong> ${esc(formatCents(request.willingToPayCents))}</div>
    <div><strong>Status:</strong> ${esc(request.status || 'open')}</div>
    <div><strong>Driver offers:</strong> ${esc((request.driverOffers || []).length)}</div>
    <div><strong>Notes:</strong> ${esc(request.notes || 'None')}</div>
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
    sharedForm.style.marginTop = '0.6rem';
    sharedForm.style.display = 'flex';
    sharedForm.style.flexWrap = 'wrap';
    sharedForm.style.gap = '0.5rem';
    sharedForm.style.alignItems = 'center';

    const seatsInput = document.createElement('input');
    seatsInput.type = 'number';
    seatsInput.min = '1';
    seatsInput.max = '7';
    seatsInput.value = '1';
    seatsInput.style.width = '60px';
    seatsInput.setAttribute('aria-label', 'Additional shared seats');
    const seatsLabel = document.createElement('label');
    seatsLabel.textContent = 'Seats:';
    seatsLabel.style.fontSize = '0.9rem';

    const priceInput = document.createElement('input');
    priceInput.type = 'number';
    priceInput.min = '0.50';
    priceInput.step = '0.01';
    priceInput.value = ((request.willingToPayCents || 500) / 100).toFixed(2);
    priceInput.style.width = '70px';
    priceInput.setAttribute('aria-label', 'Price per spot');
    const priceLabel = document.createElement('label');
    priceLabel.textContent = 'Price ($):';
    priceLabel.style.fontSize = '0.9rem';

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

  container.appendChild(buildDriverSeatManifest(ride));
  return container;
}

function buildRideSummary(ride, options = {}) {
  const selectedSeatId = getCurrentUserSeatId(ride);
  const container = document.createElement('div');
  container.className = 'ride-card';
  container.innerHTML = `
    <h4>${esc(ride.origin)} → ${esc(ride.destination)}</h4>
    <div class="ride-details">
      <div><strong>Driver:</strong> ${esc([ride.driverFirstName, ride.driverLastName].filter(Boolean).join(' ') || 'Driver')}</div>
      <div><strong>School:</strong> ${esc(ride.university || 'Unknown school')}</div>
      <div><strong>Driver rating:</strong> ${esc(formatDriverRating(ride))}</div>
      <div><strong>Preference:</strong> ${ride.sameGenderOnly ? 'Same gender only' : 'Open to all'}</div>
      ${getCoordinateMarkup(ride)}
      <div><strong>Departure:</strong> ${esc(formatRideDateTime(ride))}</div>
      <div><strong>Estimated ride time:</strong> ${esc(formatDuration(ride.estimatedDurationMinutes))}</div>
      ${ride.returnRide ? `<div><strong>Return:</strong> ${esc(formatRideDateTime(ride.returnRide))}</div>` : ''}
      <div><strong>Seats available:</strong> ${esc(ride.seatsAvailable)}</div>
      ${selectedSeatId ? `<div><strong>Seat:</strong> ${esc(getSeatLabel(selectedSeatId))}</div>` : ''}
      <div><strong>Miles:</strong> ${esc(formatMiles(getRideMiles(ride)))}</div>
      <div><strong>Price:</strong> ${esc(formatRidePrice(ride))}</div>
      ${getVehicleDetailMarkup(ride)}
      <div><strong>Passengers:</strong> ${esc((ride.passengers || []).length)}</div>
    </div>
  `;
  if (ride.seatingChartUnavailable) {
    const notice = document.createElement('div');
    notice.className = 'seat-picker-hint shared-seat-notice';
    notice.textContent = 'Seating chart unavailable for this shared requested ride.';
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
  return container;
}

function renderCartItem(ride) {
  const item = buildRideSummary(ride, { includeChat: false });
  item.classList.add('cart-item-card');

  const detail = document.createElement('div');
  detail.className = 'cart-item-detail';
  detail.innerHTML = `
    <div><strong>Cart item:</strong> ${esc(ride.origin)} → ${esc(ride.destination)}</div>
    ${getCoordinateMarkup(ride)}
    <div><strong>Seat:</strong> ${ride.seatingChartUnavailable ? 'General shared spot' : (ride.selectedSeatId ? esc(getSeatLabel(ride.selectedSeatId)) : 'Selected seat')}</div>
    <div><strong>Driver:</strong> ${esc([ride.driverFirstName, ride.driverLastName].filter(Boolean).join(' '))}</div>
    <div><strong>School:</strong> ${esc(ride.university || 'Unknown school')}</div>
    <div><strong>Driver rating:</strong> ${esc(formatDriverRating(ride))}</div>
    <div><strong>Departure:</strong> ${esc(formatRideDateTime(ride))}</div>
    <div><strong>Estimated ride time:</strong> ${esc(formatDuration(ride.estimatedDurationMinutes))}</div>
    <div><strong>Item price:</strong> ${esc(formatRidePrice(ride))}</div>
  `;
  item.prepend(detail);

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

async function loadCart() {
  try {
    const data = await fetchJson('/api/cart');
    cartRideIds = new Set(data.rides.map((ride) => ride.id));
    data.rides.forEach((ride) => { if (ride.selectedSeatId) selectedSeatByRide.set(ride.id, ride.selectedSeatId); });
    cartCount.textContent = data.rides.length;
    cartItems.innerHTML = '';
    cartSubtotal.classList.add('hidden');
    cartSubtotal.innerHTML = '';
    if (!data.rides.length) {
      cartItems.textContent = 'Your cart is empty.';
      checkoutCartButton.disabled = true;
      return;
    }
    const subtotalCents = data.rides.reduce((sum, ride) => sum + Number(ride.priceCents || 0), 0);
    cartSubtotal.innerHTML = `
      <div>
        <strong>Subtotal</strong>
        <span>${data.rides.length} ride${data.rides.length === 1 ? '' : 's'} selected</span>
      </div>
      <strong>${formatCents(subtotalCents)}</strong>
    `;
    cartSubtotal.classList.remove('hidden');
    checkoutCartButton.disabled = false;
    data.rides.forEach((ride) => cartItems.appendChild(renderCartItem(ride)));
  } catch (err) {
    cartItems.textContent = 'Unable to load your cart.';
    cartSubtotal.classList.add('hidden');
    cartSubtotal.innerHTML = '';
  }
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
  browseTitle.textContent = 'Browse rides';
  browseSubtitle.textContent = 'Choose whether you are driving or riding today.';
  browseControls.classList.add('hidden');
  browseMapPanel?.classList.add('hidden');
  browseRiderLayout?.classList.remove('rider-active');
  clearBrowseResultMarkers();
  if (browsePickupCircle) { browsePickupCircle.setMap(null); browsePickupCircle = null; }
  if (browseDropoffCircle) { browseDropoffCircle.setMap(null); browseDropoffCircle = null; }
  if (browsePickupMarker) { browsePickupMarker.setMap(null); browsePickupMarker = null; }
  if (browseDropoffMarker) { browseDropoffMarker.setMap(null); browseDropoffMarker = null; }
  browseResultsTitle.textContent = 'Choose a role to start';
  ridesList.innerHTML = '<p class="browse-start-message">Select Driver to view student ride requests, or Rider to view available seats.</p>';
}

function showRiderBrowse() {
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
  browseSubtitle.textContent = 'Find rides by how far you are willing to walk to the pickup and from the drop-off.';
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
  browseSubtitle.textContent = 'Find rider requests by how far you are willing to drive for pickup and drop-off.';
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
    summary.innerHTML = '<strong>Your driver rating:</strong> <span>' + existingRating + ' out of 5 stars</span>';
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
      .sort((a, b) => getRideStartTime(a) - getRideStartTime(b));
    const expiredRequests = riderRequests
      .filter((request) => request.status === 'expired')
      .sort((a, b) => getRideStartTime(b) - getRideStartTime(a));
    const currentDrivingRides = drivingRides
      .filter((ride) => !isPastRide(ride))
      .sort((a, b) => getRideStartTime(a) - getRideStartTime(b));
    const currentReservedRides = reservedRides
      .filter((ride) => !isPastRide(ride))
      .sort((a, b) => getRideStartTime(a) - getRideStartTime(b));
    const historyRides = [
      ...drivingRides.filter(isPastRide).map((ride) => ({ type: 'ride', ride, role: 'Driver', sortTime: getRideStartTime(ride) })),
      ...reservedRides.filter(isPastRide).map((ride) => ({ type: 'ride', ride, role: 'Rider', sortTime: getRideStartTime(ride) })),
      ...expiredRequests.map((request) => ({ type: 'request', request, sortTime: getRideStartTime(request) })),
    ].sort((a, b) => b.sortTime - a.sortTime);

    if (yourRidesView === 'requests') {
      if (!requestedRides.length) {
        yourRidesList.textContent = 'You have not requested any rides yet.';
        return;
      }
      appendRideSection(yourRidesList, 'Ride requests you posted', requestedRides, (request) => buildRequestSummary(request));
      return;
    }

    if (yourRidesView === 'history') {
      if (!historyRides.length) {
        yourRidesList.textContent = 'No previous rides yet.';
        return;
      }
      appendRideSection(yourRidesList, 'History rides', historyRides, (entry) => (
        entry.type === 'request' ? buildHistoryRequestCard(entry.request) : buildHistoryRideCard(entry.ride, entry.role)
      ));
      return;
    }

    if (!currentDrivingRides.length && !currentReservedRides.length) {
      yourRidesList.textContent = 'You do not have any current driving or reserved rides.';
      return;
    }

    appendRideSection(yourRidesList, "Rides you're driving", currentDrivingRides, (ride) => buildDriverRideSummary(ride));
    appendRideSection(yourRidesList, 'Rides you reserved', currentReservedRides, (ride) => {
      const item = buildRideSummary(ride);
      item.classList.add('your-ride-reservation');
      return item;
    });
  } catch (err) {
    yourRidesList.textContent = 'Unable to load your rides: ' + err.message;
  }
}

async function loadProfile() {
  profileRides.textContent = 'Loading your rides...';
  try {
    const data = await fetchJson('/api/profile');
    profileRides.innerHTML = '';
    const createdLabel = document.createElement('h4');
    createdLabel.textContent = 'Your posted rides';
    profileRides.appendChild(createdLabel);
    if (!data.createdRides.length) {
      const empty = document.createElement('p');
      empty.textContent = 'You have not offered any rides yet.';
      profileRides.appendChild(empty);
    } else {
      data.createdRides.forEach((ride) => profileRides.appendChild(buildDriverRideSummary(ride)));
    }
    const joinedLabel = document.createElement('h4');
    joinedLabel.textContent = 'Rides you joined';
    profileRides.appendChild(joinedLabel);
    if (!data.joinedRides.length) {
      const empty = document.createElement('p');
      empty.textContent = 'You have not joined any rides yet.';
      profileRides.appendChild(empty);
    } else {
      data.joinedRides.forEach((ride) => profileRides.appendChild(buildRideSummary(ride)));
    }

    const requestsLabel = document.createElement('h4');
    requestsLabel.textContent = 'Your trip requests';
    profileRides.appendChild(requestsLabel);
    if (!data.riderRequests?.length) {
      const empty = document.createElement('p');
      empty.textContent = 'You have not requested any rides yet.';
      profileRides.appendChild(empty);
    } else {
      data.riderRequests.forEach((request) => profileRides.appendChild(buildRequestSummary(request)));
    }

    const offersLabel = document.createElement('h4');
    offersLabel.textContent = 'Requests you offered to drive';
    profileRides.appendChild(offersLabel);
    if (!data.driverOffers?.length) {
      const empty = document.createElement('p');
      empty.textContent = 'You have not offered to drive any rider requests yet.';
      profileRides.appendChild(empty);
    } else {
      data.driverOffers.forEach((request) => profileRides.appendChild(buildRequestSummary(request)));
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
renderDriverSeatLayout();
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

sendUsernameButton.addEventListener('click', () => sendRecoveryRequest('/api/auth/forgot-username'));
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
  const password = document.getElementById('signup-password').value.trim();
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
        signinError.textContent = 'This email is already associated with an account. Please sign in.';
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
  const password = document.getElementById('signin-password').value.trim();
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
  const seats = document.getElementById('seats').value;
  const vehicleSeatCount = Number(vehicleSeatCountSelect.value);
  const availableSeatIds = [...driverAvailableSeatIds];
  const price = document.getElementById('ride-price').value;
  const carMaker = document.getElementById('car-maker').value.trim();
  const carModel = document.getElementById('car-model').value.trim();
  const carColor = document.getElementById('car-color').value.trim();
  const licensePlate = document.getElementById('license-plate').value.trim();
  const termsAccepted = document.getElementById('ride-terms-agree').checked;
  const pickupRadiusMiles = getRadiusInputMiles(offerPickupRadiusInput);
  const dropoffRadiusMiles = getRadiusInputMiles(offerDropoffRadiusInput);
  const notes = document.getElementById('notes').value.trim();
  const estimatedDurationMinutes = await estimateRideDurationMinutes(
    { lat: Number(originLat), lng: Number(originLng) },
    { lat: Number(destinationLat), lng: Number(destinationLng) },
    date,
    time
  );
  if (!origin || !destination || !date || !time || !seats || !price || !carMaker || !carModel || !carColor || !licensePlate || !termsAccepted || !availableSeatIds.length) {
    alert('All ride fields are required. Please select both locations.');
    return;
  }
  if (Number(price) < 0.5) {
    alert('Price per seat must be at least $0.50.');
    return;
  }
  if (sameGenderOnly && !canMatchSameGender(currentUser.gender, currentUser.gender)) {
    alert('Choose a gender on your account before offering same gender only rides.');
    return;
  }
  try {
    await fetchJson('/api/rides', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ origin, destination, originLat: parseFloat(originLat), originLng: parseFloat(originLng), destinationLat: parseFloat(destinationLat), destinationLng: parseFloat(destinationLng), pickupRadiusMiles, dropoffRadiusMiles, date, time, sameGenderOnly, vehicleSeatCount, seatsAvailable: Number(seats), availableSeatIds, price: Number(price), carMaker, carModel, carColor, licensePlate, termsAccepted, estimatedDurationMinutes, notes }) });
    offerForm.reset();
    offerPickupRadiusCircle = drawMapFlexCircle(offerPickupRadiusCircle, originMap, null, 0, '#3ecfcf');
    offerDropoffRadiusCircle = drawMapFlexCircle(offerDropoffRadiusCircle, originMap, null, 0, '#4d9ef5');
    currentVehicleSeatCount = 5;
    vehicleSeatCountSelect.value = '5';
    driverAvailableSeatIds = new Set();
    renderDriverSeatLayout();
    document.getElementById('origin-selected').textContent = '';
    document.getElementById('origin-selected').classList.remove('active');
    document.getElementById('destination-selected').textContent = '';
    document.getElementById('destination-selected').classList.remove('active');
    loadRides();
    loadProfile();
    showDashboardHome();
  } catch (err) {
    alert(err.message);
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
  const estimatedDurationMinutes = await estimateRideDurationMinutes(
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
    estimatedDurationMinutes,
    shareRideWithOthers: document.getElementById('request-share-ride').checked,
    sameGenderDriverOnly: document.getElementById('request-same-gender-driver').checked,
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
    requestRideMessage.textContent = 'Ride request posted. Drivers can now see it in your profile activity.';
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
profileButton.addEventListener('click', () => showProfilePage());
profileBackHomeButton.addEventListener('click', () => returnToBrowseRides());
privacyLink.addEventListener('click', () => showLegalPage('privacy'));
termsLink.addEventListener('click', () => showLegalPage('terms'));
legalBackButtons.forEach((button) => {
  button.addEventListener('click', () => returnFromLegalPage());
});
profileSidebarButtons.forEach((button) => {
  button.addEventListener('click', () => {
    clearDefaultPaymentMessages();
    clearPayoutMessages();
    showProfileTab(button.dataset.profileTab);
  });
});
defaultPaymentForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  clearDefaultPaymentMessages();
  try {
    currentUser = await fetchJson('/api/profile/payment-method', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(getDefaultPaymentPayload()),
    });
    fillDefaultPaymentForm(currentUser);
    defaultPaymentMessage.textContent = 'Default payment method saved.';
    defaultPaymentMessage.classList.add('show');
  } catch (err) {
    defaultPaymentError.textContent = err.message;
    defaultPaymentError.classList.add('show');
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
    policyMessage.textContent = 'You already accepted the current Terms and Conditions and Privacy Notice.';
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
      ? 'Policy agreement saved. Complete the remaining required profile settings to use LinkUp ride services.'
      : 'Policy agreement saved. You can now use LinkUp services.';
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
trackTripButton.addEventListener('click', () => showTrackTripPage());
trackBackHomeButton.addEventListener('click', () => returnToBrowseRides());
copyTrackingLinkButton?.addEventListener('click', () => copyTrackingLink());
sendTrackingInviteButton?.addEventListener('click', () => sendTrackingInvite());
startTrackingButton.addEventListener('click', () => startTripTracking());
stopTrackingButton.addEventListener('click', () => stopTripTracking());
continueShoppingButton.addEventListener('click', () => returnToBrowseRides());
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
    birthday: document.getElementById('profile-birthday').value,
    gender: document.getElementById('profile-gender').value,
  };
  try {
    currentUser = await fetchJson('/api/profile', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    updateUserHeader(currentUser);
    fillProfileForm(currentUser);
    profileMessage.textContent = currentUser.requiresRequiredSettings
      ? 'Profile updated. Complete the remaining required settings to use ride services.'
      : 'Profile updated. You can now use LinkUp ride services.';
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

checkoutCartButton.addEventListener('click', () => {
  clearCartMessages();
  if (!cartRideIds.size) {
    cartError.textContent = 'Your cart is empty';
    cartError.classList.add('show');
    return;
  }
  showPaymentPage();
});
paymentBackToCartButton.addEventListener('click', () => returnToBrowseRides());
document.getElementById('pay-cart').addEventListener('click', async () => {
  clearCartMessages();
  try {
    const data = await fetchJson('/api/cart/create-checkout-session', { method: 'POST' });
    window.location.href = data.url;
  } catch (err) {
    paymentError.textContent = err.message;
    paymentError.classList.add('show');
  }
});

signoutButton.addEventListener('click', async () => {
  try {
    if (activeTrackingTripId) {
      await stopTripTracking();
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
    showPaymentPage();
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

const params = new URLSearchParams(window.location.search);
const resetToken = params.get('resetToken');
const trackingViewerToken = params.get('trackToken');
const checkoutStatus = params.get('checkout');
const checkoutSessionId = params.get('session_id');
if (trackingViewerToken) {
  loadSharedTrackingPage(trackingViewerToken);
} else if (resetToken) {
  showAuthSection();
  showAuthForm('reset-password-form');
} else if (checkoutStatus === 'success' && checkoutSessionId) {
  completeStripeCheckout(checkoutSessionId);
} else if (checkoutStatus === 'cancel') {
  checkAuth().then(() => {
    showCartPage();
    cartError.textContent = 'Stripe checkout was canceled.';
    cartError.classList.add('show');
    window.history.replaceState({}, document.title, window.location.pathname);
  });
} else {
  checkAuth();
}
