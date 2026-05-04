const authSection = document.getElementById('auth-section');
const dashboard = document.getElementById('dashboard');
const siteLogo = document.querySelector('.site-logo');
const headerActions = document.getElementById('header-actions');
const headerLeftActions = document.getElementById('header-left-actions');
const signinForm = document.getElementById('signin-form');
const signupForm = document.getElementById('signup-form');
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

let currentUser = null;
let originMap = null;
let destinationMap = null;
let originMarker = null;
let destinationMarker = null;
let originAutocomplete = null;
let destinationAutocomplete = null;
let requestOriginAutocomplete = null;
let requestDestinationAutocomplete = null;
let requestOriginMap = null;
let requestDestinationMap = null;
let requestOriginMarker = null;
let requestDestinationMarker = null;
let pickupRadiusAutocomplete = null;
let dropoffRadiusAutocomplete = null;
let cartRideIds = new Set();
let pendingVerificationEmail = '';
let activeTrackingTripId = null;
let trackingWatchId = null;
let trackingMap = null;
let trackingMarker = null;
let trackingPath = null;
let sharedTrackingMap = null;
let sharedTrackingMarker = null;
let sharedTrackingPath = null;
let sharedTrackingPollId = null;
let currentVehicleSeatCount = 5;
let driverAvailableSeatIds = new Set();
let browseRole = null;
let yourRidesView = 'current';
let selectedChatRideId = '';
let browseRadiusMap = null;
let browsePickupCircle = null;
let browseDropoffCircle = null;
let browseResultMarkers = [];
const selectedSeatByRide = new Map();


const originSearchInput = document.getElementById('origin-search');
const originMapDiv = document.getElementById('origin-map');
const destinationSearchInput = document.getElementById('destination-search');
const destinationMapDiv = document.getElementById('destination-map');
const sameGenderOnlyRideCheckbox = document.getElementById('same-gender-only-ride');
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
const rideFilterDateInput = document.getElementById('ride-filter-date');
const rideFilterSeatsInput = document.getElementById('ride-filter-seats');
const rideFilterMaxPriceInput = document.getElementById('ride-filter-max-price');
const rideSortSelect = document.getElementById('ride-sort');
const driverSeatLayout = document.getElementById('driver-seat-layout');
const selectedSeatCount = document.getElementById('selected-seat-count');
const vehicleSeatCountSelect = document.getElementById('vehicle-seat-count');
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

async function loadGoogleMapsAPI() {
  try {
    if (window.google?.maps) return;
    const response = await fetch('/api/config/google-maps-key');
    const config = await response.json();
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${config.apiKey}&libraries=places`;
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
    return new Promise((resolve) => {
      script.onload = resolve;
      script.onerror = resolve;
    });
  } catch (error) {
    console.error('Failed to load Google Maps API:', error);
  }
}

function initializeOriginMap() {
  const center = { lat: 34.069, lng: -118.445 };
  originMap = new google.maps.Map(originMapDiv, {
    zoom: 13,
    center,
    styles: [{ elementType: 'labels', stylers: [{ visibility: 'off' }] }],
  });
  originMarker = new google.maps.Marker({ map: originMap, position: center });
  originAutocomplete = new google.maps.places.Autocomplete(originSearchInput, { componentRestrictions: { country: 'us' } });
  originAutocomplete.addListener('place_changed', () => {
    const place = originAutocomplete.getPlace();
    if (place.geometry) updateOriginLocation(place.name, place.geometry.location.lat(), place.geometry.location.lng());
  });
  originMapDiv.addEventListener('click', () => {
    const lat = originMap.getCenter().lat();
    const lng = originMap.getCenter().lng();
    updateOriginLocation(`Location (${lat.toFixed(3)}, ${lng.toFixed(3)})`, lat, lng);
  });
}

function initializeDestinationMap() {
  const center = { lat: 34.069, lng: -118.445 };
  destinationMap = new google.maps.Map(destinationMapDiv, {
    zoom: 13,
    center,
    styles: [{ elementType: 'labels', stylers: [{ visibility: 'off' }] }],
  });
  destinationMarker = new google.maps.Marker({ map: destinationMap, position: center });
  destinationAutocomplete = new google.maps.places.Autocomplete(destinationSearchInput, { componentRestrictions: { country: 'us' } });
  destinationAutocomplete.addListener('place_changed', () => {
    const place = destinationAutocomplete.getPlace();
    if (place.geometry) updateDestinationLocation(place.name, place.geometry.location.lat(), place.geometry.location.lng());
  });
  destinationMapDiv.addEventListener('click', () => {
    const lat = destinationMap.getCenter().lat();
    const lng = destinationMap.getCenter().lng();
    updateDestinationLocation(`Location (${lat.toFixed(3)}, ${lng.toFixed(3)})`, lat, lng);
  });
}

function updateOriginLocation(name, lat, lng) {
  document.getElementById('origin').value = name;
  document.getElementById('origin-lat').value = lat;
  document.getElementById('origin-lng').value = lng;
  document.getElementById('origin-selected').textContent = `Selected: ${name}`;
  document.getElementById('origin-selected').classList.add('active');
  if (originMap && originMarker) {
    const position = { lat, lng };
    originMarker.setPosition(position);
    originMap.setCenter(position);
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
    requestOriginMarker.setPosition(position);
    requestOriginMap.setCenter(position);
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
  if (requestDestinationMap && requestDestinationMarker) {
    const position = { lat: Number(lat), lng: Number(lng) };
    requestDestinationMarker.setPosition(position);
    requestDestinationMap.setCenter(position);
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
    pickupRadiusAutocomplete = new google.maps.places.Autocomplete(pickupRadiusLocationInput, { componentRestrictions: { country: 'us' } });
    pickupRadiusAutocomplete.addListener('place_changed', () => setRadiusLocation(pickupRadiusLocationInput, pickupRadiusAutocomplete.getPlace()));
  }
  if (dropoffRadiusLocationInput && !dropoffRadiusAutocomplete) {
    dropoffRadiusAutocomplete = new google.maps.places.Autocomplete(dropoffRadiusLocationInput, { componentRestrictions: { country: 'us' } });
    dropoffRadiusAutocomplete.addListener('place_changed', () => setRadiusLocation(dropoffRadiusLocationInput, dropoffRadiusAutocomplete.getPlace()));
  }
}

function clearRequestLocationCoordinates(kind) {
  document.getElementById('request-' + kind + '-lat').value = '';
  document.getElementById('request-' + kind + '-lng').value = '';
}

function geocodeAddress(address) {
  return new Promise((resolve) => {
    if (!address || !window.google?.maps?.Geocoder) {
      resolve(null);
      return;
    }
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address, componentRestrictions: { country: 'US' } }, (results, status) => {
      if (status !== 'OK' || !results?.[0]?.geometry) {
        resolve(null);
        return;
      }
      const location = results[0].geometry.location;
      resolve({
        name: results[0].formatted_address || address,
        lat: location.lat(),
        lng: location.lng(),
      });
    });
  });
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
  const requestDestinationMapDiv = document.getElementById('request-destination-map');
  if (requestOriginMapDiv && !requestOriginMap) {
    requestOriginMap = new google.maps.Map(requestOriginMapDiv, { zoom: 13, center, styles: [{ elementType: 'labels', stylers: [{ visibility: 'off' }] }] });
    requestOriginMarker = new google.maps.Marker({ map: requestOriginMap, position: center });
    requestOriginMapDiv.addEventListener('click', () => {
      const lat = requestOriginMap.getCenter().lat();
      const lng = requestOriginMap.getCenter().lng();
      updateRequestOriginLocation('Location (' + lat.toFixed(3) + ', ' + lng.toFixed(3) + ')', lat, lng);
    });
  }
  if (requestDestinationMapDiv && !requestDestinationMap) {
    requestDestinationMap = new google.maps.Map(requestDestinationMapDiv, { zoom: 13, center, styles: [{ elementType: 'labels', stylers: [{ visibility: 'off' }] }] });
    requestDestinationMarker = new google.maps.Marker({ map: requestDestinationMap, position: center });
    requestDestinationMapDiv.addEventListener('click', () => {
      const lat = requestDestinationMap.getCenter().lat();
      const lng = requestDestinationMap.getCenter().lng();
      updateRequestDestinationLocation('Location (' + lat.toFixed(3) + ', ' + lng.toFixed(3) + ')', lat, lng);
    });
  }
}

function initializeRequestAutocomplete() {
  if (!window.google?.maps?.places) return;
  initializeRequestMaps();
  const requestOriginInput = document.getElementById('request-origin');
  const requestDestinationInput = document.getElementById('request-destination');
  requestOriginInput?.addEventListener('input', () => clearRequestLocationCoordinates('origin'));
  requestDestinationInput?.addEventListener('input', () => clearRequestLocationCoordinates('destination'));
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
  if (destinationMap && destinationMarker) {
    const position = { lat, lng };
    destinationMarker.setPosition(position);
    destinationMap.setCenter(position);
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
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
}

async function checkAuth() {
  try {
    currentUser = await fetchJson('/api/auth/me');
    showDashboard(currentUser);
  } catch (error) {
    showAuthSection();
  }
}

function showAuthSection() {
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
  document.getElementById('profile-first-name').value = user.firstName || '';
  document.getElementById('profile-middle-name').value = user.middleName || '';
  document.getElementById('profile-last-name').value = user.lastName || '';
  document.getElementById('profile-birthday').value = user.birthday || '';
  document.getElementById('profile-gender').value = user.gender || '';
  document.getElementById('profile-email').value = user.email || '';
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
  clearCartMessages();
  hideDashboardPages();
  leaderboardPage.classList.remove('hidden');
  loadLeaderboard();
}

function showProfilePage() {
  clearCartMessages();
  clearProfileMessages();
  hideDashboardPages();
  fillProfileForm(currentUser || {});
  profilePage.classList.remove('hidden');
}

function showDashboardHome() {
  clearCartMessages();
  if (currentUser && !currentUser.serviceApproved) {
    showWaitlistPage(currentUser);
    return;
  }
  hideDashboardPages();
  dashboardHome.classList.remove('hidden');
  renderBrowseRoleChoice();
}

function showWaitlistPage(user) {
  hideDashboardPages();
  waitlistPage.classList.remove('hidden');
  waitlistMessage.textContent = 'We saved your account for ' + (user.university || user.universityDomain || 'your university') + '. We will notify you when LinkUp launches at your university.';
}

function showCartPage() {
  if (!ensureServiceAccess()) return;
  clearCartMessages();
  hideDashboardPages();
  cartPage.classList.remove('hidden');
  loadCart();
}

function showYourRidesPage() {
  if (!ensureServiceAccess()) return;
  clearCartMessages();
  hideDashboardPages();
  yourRidesPage.classList.remove('hidden');
  loadYourRides();
}

function showChatPage() {
  if (!ensureServiceAccess()) return;
  clearCartMessages();
  hideDashboardPages();
  chatPage.classList.remove('hidden');
  loadChatPage();
}

function showRequestRidePage() {
  if (!ensureServiceAccess()) return;
  clearCartMessages();
  clearRequestRideMessages();
  hideDashboardPages();
  requestRidePage.classList.remove('hidden');
  loadGoogleMapsAPI().then(() => initializeRequestAutocomplete());
}

function showListRidePage() {
  if (!ensureServiceAccess()) return;
  clearCartMessages();
  hideDashboardPages();
  listRidePage.classList.remove('hidden');
  loadProfile();
  loadGoogleMapsAPI().then(() => {
    setTimeout(() => {
      if (!originMap) initializeOriginMap();
      if (!destinationMap) initializeDestinationMap();
    }, 100);
  });
}

function showTrackTripPage() {
  if (!ensureServiceAccess()) return;
  clearCartMessages();
  clearTrackingMessages();
  hideDashboardPages();
  trackTripPage.classList.remove('hidden');
}

function ensureServiceAccess() {
  if (currentUser?.serviceApproved) return true;
  showWaitlistPage(currentUser || {});
  return false;
}

function showPaymentPage() {
  clearCartMessages();
  hideDashboardPages();
  paymentPage.classList.remove('hidden');
  paymentSummary.textContent = `You will pay the driver-set price for ${cartRideIds.size} ride${cartRideIds.size === 1 ? '' : 's'} in your cart.`;
}

function showDashboard(user) {
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
  renderBrowseRoleChoice();
  loadCart();
  loadProfile();
}

function updateTrackingDriverInfo() {
  if (!currentUser) {
    trackingDriverInfo.classList.add('hidden');
    trackingDriverDetails.textContent = '';
    return;
  }
  const fullName = [currentUser.firstName, currentUser.middleName, currentUser.lastName].filter(Boolean).join(' ');
  trackingDriverDetails.innerHTML = `
    <div><strong>Name:</strong> ${fullName || getDisplayName(currentUser)}</div>
    <div><strong>Email:</strong> ${currentUser.email}</div>
    <div><strong>University:</strong> ${currentUser.university}</div>
  `;
  trackingDriverInfo.classList.remove('hidden');
}

function resetTrackingPage() {
  activeTrackingTripId = null;
  trackingRecipientEmail.disabled = false;
  trackingRecipientEmail.value = '';
  setTrackingActive(false);
  trackingLastUpdate.textContent = 'No location shared yet.';
  trackingMapDiv.textContent = '';
  trackingDriverInfo.classList.add('hidden');
  trackingDriverDetails.textContent = '';
  trackingMap = null;
  trackingMarker = null;
  trackingPath = null;
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

function updateTrackingMap(location, pathLocations = []) {
  if (!location) return;
  const position = { lat: Number(location.lat), lng: Number(location.lng) };
  if (!window.google?.maps || !trackingMapDiv) {
    trackingMapDiv.textContent = position.lat.toFixed(5) + ', ' + position.lng.toFixed(5);
    return;
  }

  if (!trackingMap) {
    trackingMap = new google.maps.Map(trackingMapDiv, { zoom: 15, center: position });
    trackingMarker = new google.maps.Marker({ map: trackingMap, position, title: 'Your location' });
    trackingPath = new google.maps.Polyline({ map: trackingMap, path: [], strokeColor: '#8fb8ff', strokeOpacity: 0.9, strokeWeight: 4 });
  } else {
    trackingMap.setCenter(position);
    trackingMarker.setPosition(position);
  }
  if (trackingPath) {
    trackingPath.setPath(pathLocations.map((entry) => ({ lat: Number(entry.lat), lng: Number(entry.lng) })));
  }
}

function updateTrackingUi(location, locations = []) {
  if (!location) return;
  updateTrackingMap(location, locations);
  const accuracy = location.accuracy ? ' within about ' + Math.round(location.accuracy) + ' meters' : '';
  trackingLastUpdate.textContent = 'Last update: ' + formatTrackingTime(location.recordedAt) + accuracy;
}

function setTrackingActive(isActive) {
  startTrackingButton.disabled = isActive;
  stopTrackingButton.disabled = !isActive;
  trackingStatus.textContent = isActive ? 'Location sharing is on.' : 'Location sharing is off.';
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
  updateTrackingUi(data.trip.lastLocation, data.trip.locations || []);
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
    if (!trustedEmail) {
      trackingError.textContent = 'Enter the email of the person you want to invite.';
      trackingError.classList.add('show');
      return;
    }
    const data = await fetchJson('/api/trips/track/start', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ trustedEmail }) });
    activeTrackingTripId = data.id;
    updateTrackingDriverInfo();
    setTrackingActive(true);
    trackingRecipientEmail.disabled = true;
    trackingMessage.textContent = data.message || 'Invite sent. Keep this page open while riding.';
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

function updateSharedTrackingMap(location, pathLocations = []) {
  if (!location) return;
  const position = { lat: Number(location.lat), lng: Number(location.lng) };
  if (!window.google?.maps || !sharedTrackMapDiv) {
    sharedTrackMapDiv.textContent = position.lat.toFixed(5) + ', ' + position.lng.toFixed(5);
    return;
  }

  if (!sharedTrackingMap) {
    sharedTrackingMap = new google.maps.Map(sharedTrackMapDiv, { zoom: 15, center: position });
    sharedTrackingMarker = new google.maps.Marker({ map: sharedTrackingMap, position, title: 'Current location' });
    sharedTrackingPath = new google.maps.Polyline({ map: sharedTrackingMap, path: [], strokeColor: '#8fb8ff', strokeOpacity: 0.9, strokeWeight: 4 });
  } else {
    sharedTrackingMap.setCenter(position);
    sharedTrackingMarker.setPosition(position);
  }
  if (sharedTrackingPath) {
    sharedTrackingPath.setPath(pathLocations.map((entry) => ({ lat: Number(entry.lat), lng: Number(entry.lng) })));
  }
}

async function loadSharedTrackingPage(viewerToken) {
  authSection.classList.add('hidden');
  dashboard.classList.add('hidden');
  sharedTrackPage.classList.remove('hidden');
  document.body.classList.remove('dashboard-mode');

  const refresh = async () => {
    try {
      const trip = await fetchJson('/api/track/' + viewerToken);
      sharedTrackTitle.textContent = trip.ownerFirstName + '\'s live trip location';
      sharedTrackStatus.textContent = trip.status === 'active' ? 'Location sharing is active.' : 'Location sharing has stopped.';
      sharedTrackError.classList.remove('show');
      if (!trip.lastLocation) {
        sharedTrackDetails.textContent = 'Waiting for the rider to share their first location.';
        return;
      }
      const location = trip.lastLocation;
      updateSharedTrackingMap(location, trip.locations || []);
      sharedTrackDetails.textContent = 'Last update: ' + formatTrackingTime(location.recordedAt);
      sharedTrackMapLink.href = 'https://www.google.com/maps?q=' + location.lat + ',' + location.lng;
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
  sharedTrackingPollId = setInterval(refresh, 5000);
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
  return new Date(ride.date + 'T' + (ride.time || '00:00')).getTime();
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
      styles: [{ elementType: 'labels', stylers: [{ visibility: 'off' }] }],
    });
  }
  return browseRadiusMap;
}

function clearBrowseResultMarkers() {
  browseResultMarkers.forEach((marker) => marker.setMap(null));
  browseResultMarkers = [];
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

function updateBrowseRadiusMap(items = []) {
  const map = ensureBrowseRadiusMap();
  if (!map) return;
  const pickupCenter = getRadiusCenter(pickupRadiusLocationInput);
  const dropoffCenter = getRadiusCenter(dropoffRadiusLocationInput);
  const pickupMiles = Number(pickupRadiusMilesInput.value);
  const dropoffMiles = Number(dropoffRadiusMilesInput.value);
  const hasPickupRadius = pickupCenter && pickupMiles > 0;
  const hasDropoffRadius = dropoffCenter && dropoffMiles > 0;

  browseRadiusMapDiv.classList.toggle('hidden', !hasPickupRadius && !hasDropoffRadius && !items.length);
  browsePickupCircle = drawRadiusCircle(browsePickupCircle, pickupCenter, pickupMiles, '#3ecfcf');
  browseDropoffCircle = drawRadiusCircle(browseDropoffCircle, dropoffCenter, dropoffMiles, '#4d9ef5');
  clearBrowseResultMarkers();

  const bounds = new google.maps.LatLngBounds();
  let hasBounds = false;
  [pickupCenter, dropoffCenter].forEach((point) => {
    if (point) {
      bounds.extend(point);
      hasBounds = true;
    }
  });

  const sortedItems = [...items].sort((a, b) => {
    if (!dropoffCenter) return getRideStartTime(a) - getRideStartTime(b);
    const aDistance = distanceBetweenCoordinates(dropoffCenter, getRideDestinationCoordinate(a));
    const bDistance = distanceBetweenCoordinates(dropoffCenter, getRideDestinationCoordinate(b));
    return (aDistance ?? Infinity) - (bDistance ?? Infinity);
  });

  if (browseRole === 'rider') {
    sortedItems.forEach((ride, index) => {
      const position = getRideDestinationCoordinate(ride);
      if (!position) return;
      const distance = dropoffCenter ? distanceBetweenCoordinates(dropoffCenter, position) : null;
      const marker = new google.maps.Marker({
        map,
        position,
        label: getAlphabetLabel(index),
        title: getAlphabetLabel(index) + ': ' + ride.origin + ' to ' + ride.destination + (distance === null ? '' : ' - ' + formatMiles(distance) + ' from desired drop-off'),
      });
      browseResultMarkers.push(marker);
      bounds.extend(position);
      hasBounds = true;
    });
  }

  if (hasBounds) {
    map.fitBounds(bounds);
  }

  if (browseMapHint) {
    if (browseRole === 'rider' && sortedItems.length) {
      browseMapHint.textContent = 'Pins A, B, C show matching ride drop-offs, sorted by closest to your desired drop-off area.';
      browseMapHint.classList.add('active');
    } else if (hasPickupRadius || hasDropoffRadius) {
      browseMapHint.textContent = 'Radius circles show the pickup and drop-off areas you entered.';
      browseMapHint.classList.add('active');
    } else {
      browseMapHint.textContent = '';
      browseMapHint.classList.remove('active');
    }
  }
}

function matchesRadiusFilter(item, type) {
  const pickupMiles = Number(pickupRadiusMilesInput.value);
  const dropoffMiles = Number(dropoffRadiusMilesInput.value);
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
    if (pickupDistance === null || pickupDistance > pickupMiles) return false;
  }
  if (hasDropoffRadius) {
    const dropoffDistance = distanceBetweenCoordinates(dropoffCenter, destinationCoordinate);
    if (dropoffDistance === null || dropoffDistance > dropoffMiles) return false;
  }
  return true;
}


function canMatchSameGender(riderGender, driverGender) {
  const hiddenValues = ['', 'prefer-not-to-say', undefined, null];
  if (hiddenValues.includes(riderGender) || hiddenValues.includes(driverGender)) return false;
  return riderGender === driverGender;
}

function canCurrentUserSeeRide(ride) {
  if (ride.university !== currentUser.university) return false;
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


function renderRideCard(ride) {
  const card = document.createElement('div');
  card.className = 'ride-card';
  const title = document.createElement('h4');
  title.textContent = `${ride.origin} → ${ride.destination}`;
  card.appendChild(title);
  const details = document.createElement('div');
  details.className = 'ride-details';
  details.innerHTML = `
    <div><strong>Driver:</strong> ${ride.driverFirstName} ${ride.driverLastName}</div>
    <div><strong>Preference:</strong> ${ride.sameGenderOnly ? 'Same gender riders only' : 'Open to all riders'}</div>
    ${getCoordinateMarkup(ride)}
    <div><strong>Departure:</strong> ${formatRideDateTime(ride)}</div>
    <div><strong>Estimated ride time:</strong> ${formatDuration(ride.estimatedDurationMinutes)}</div>
    ${ride.returnRide ? `<div><strong>Return:</strong> ${formatRideDateTime(ride.returnRide)}</div>` : ''}
    <div><strong>Seats left:</strong> ${ride.seatsAvailable}</div>
    ${ride.seatingChartUnavailable ? '<div><strong>Seats:</strong> Seating chart unavailable</div>' : ''}
    <div><strong>Miles:</strong> ${formatMiles(getRideMiles(ride))}</div>
    <div><strong>Price:</strong> ${formatRidePrice(ride)}</div>
    ${getVehicleDetailMarkup(ride)}
    <div><strong>Notes:</strong> ${ride.notes || 'None'}</div>
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
    cartActionButton.onclick = async () => {
      try {
        const seatId = ride.seatingChartUnavailable ? '' : selectedSeatByRide.get(ride.id);
        await fetchJson(`/api/cart/${ride.id}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ seatId }) });
        await loadCart();
        loadRides();
      } catch (err) {
        alert(err.message);
      }
    };
    card.appendChild(cartActionButton);
  }
  const riders = document.createElement('div');
  riders.style.marginTop = '0.8rem';
  riders.style.fontSize = '0.95rem';
  riders.textContent = `Passengers: ${ride.passengers.length}`;
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
      item.innerHTML = `
        <div class="chat-message-meta">${message.senderFirstName || 'Student'} · ${message.senderRole || 'Rider'} · ${formatChatTime(message.createdAt)}</div>
        <div class="chat-message-text"></div>
      `;
      item.querySelector('.chat-message-text').textContent = message.text;
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
    <h4>${ride.origin} → ${ride.destination}</h4>
    <div class="chat-ride-detail-grid">
      <div><strong>Date:</strong> ${new Date(ride.date + 'T00:00:00').toLocaleDateString()}</div>
      <div><strong>Time:</strong> ${formatRideTime(ride.time) || 'Time not set'}</div>
      <div><strong>Driver:</strong> ${driverName}</div>
      <div><strong>Riders:</strong> ${riderCount}</div>
      <div><strong>Estimated ride time:</strong> ${formatDuration(ride.estimatedDurationMinutes)}</div>
      <div><strong>Your role:</strong> ${getChatRideRole(ride)}</div>
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
  const title = document.createElement('h4');
  title.textContent = request.origin + ' → ' + request.destination;
  container.appendChild(title);

  const requestTime = formatRideDateTime({ date: request.date, time: request.time });
  const details = document.createElement('div');
  details.className = 'ride-details';
  details.innerHTML = `
    <div><strong>Rider:</strong> ${request.riderFirstName || 'Student'} ${request.riderLastName || ''}</div>
    <div><strong>Preference:</strong> ${request.sameGenderDriverOnly ? 'Same gender driver only' : 'Open to all drivers'}</div>
    ${getCoordinateMarkup(request)}
    <div><strong>Requested time:</strong> ${requestTime}</div>
    <div><strong>Estimated ride time:</strong> ${formatDuration(request.estimatedDurationMinutes)}</div>
    <div><strong>Riders:</strong> ${request.riderCount || 1}</div>
    <div><strong>Share with others:</strong> ${request.shareRideWithOthers === undefined ? 'Not specified' : (request.shareRideWithOthers ? 'Yes' : 'No')}</div>
    <div><strong>Willing to pay:</strong> ${formatCents(request.willingToPayCents)}</div>
    <div><strong>Status:</strong> ${request.status || 'open'}</div>
    <div><strong>Driver offers:</strong> ${(request.driverOffers || []).length}</div>
    <div><strong>Notes:</strong> ${request.notes || 'None'}</div>
  `;
  container.appendChild(details);
  return container;
}

function buildRequestBrowseCard(request) {
  const card = buildRequestSummary(request);
  const alreadyOffered = (request.driverOffers || []).some((offer) => offer.driverId === currentUser.id);
  const offerButton = document.createElement('button');
  offerButton.type = 'button';
  offerButton.textContent = alreadyOffered ? 'Offer sent' : 'Offer to drive';
  offerButton.disabled = alreadyOffered;
  offerButton.addEventListener('click', async () => {
    try {
      await fetchJson('/api/ride-requests/' + request.id + '/offer', { method: 'POST' });
      offerButton.textContent = 'Offer sent';
      offerButton.disabled = true;
      loadRideRequests();
      loadProfile();
    } catch (err) {
      alert(err.message);
    }
  });
  card.appendChild(offerButton);

  if (request.shareRideWithOthers && alreadyOffered) {
    const postSharedButton = document.createElement('button');
    postSharedButton.type = 'button';
    postSharedButton.textContent = 'Post shared ride';
    postSharedButton.addEventListener('click', async () => {
      const seatsAvailable = window.prompt('How many additional shared seats are available?', '1');
      if (seatsAvailable === null) return;
      const price = window.prompt('Price per shared spot ($)', ((request.willingToPayCents || 500) / 100).toFixed(2));
      if (price === null) return;
      try {
        await fetchJson('/api/ride-requests/' + request.id + '/post-shared-ride', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ seatsAvailable: Number(seatsAvailable), price: Number(price) }),
        });
        postSharedButton.textContent = 'Shared ride posted';
        postSharedButton.disabled = true;
        loadRides();
        loadProfile();
      } catch (err) {
        alert(err.message);
      }
    });
    card.appendChild(postSharedButton);
  }

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
    <h4>${ride.origin} → ${ride.destination}</h4>
    <div class="ride-details">
      <div><strong>Preference:</strong> ${ride.sameGenderOnly ? 'Same gender only' : 'Open to all'}</div>
      ${getCoordinateMarkup(ride)}
      <div><strong>Departure:</strong> ${formatRideDateTime(ride)}</div>
      <div><strong>Estimated ride time:</strong> ${formatDuration(ride.estimatedDurationMinutes)}</div>
      ${ride.returnRide ? `<div><strong>Return:</strong> ${formatRideDateTime(ride.returnRide)}</div>` : ''}
      <div><strong>Seats available:</strong> ${ride.seatsAvailable}</div>
      ${selectedSeatId ? `<div><strong>Seat:</strong> ${getSeatLabel(selectedSeatId)}</div>` : ''}
      <div><strong>Miles:</strong> ${formatMiles(getRideMiles(ride))}</div>
      <div><strong>Price:</strong> ${formatRidePrice(ride)}</div>
      ${getVehicleDetailMarkup(ride)}
      <div><strong>Passengers:</strong> ${ride.passengers.length}</div>
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
    <div><strong>Cart item:</strong> ${ride.origin} → ${ride.destination}</div>
    ${getCoordinateMarkup(ride)}
    <div><strong>Seat:</strong> ${ride.seatingChartUnavailable ? 'General shared spot' : (ride.selectedSeatId ? getSeatLabel(ride.selectedSeatId) : 'Selected seat')}</div>
    <div><strong>Driver:</strong> ${[ride.driverFirstName, ride.driverLastName].filter(Boolean).join(' ')}</div>
    <div><strong>Departure:</strong> ${formatRideDateTime(ride)}</div>
    <div><strong>Estimated ride time:</strong> ${formatDuration(ride.estimatedDurationMinutes)}</div>
    <div><strong>Item price:</strong> ${formatRidePrice(ride)}</div>
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

function setBrowseRole(role) {
  browseRole = role;
  browseDriverButton.classList.toggle('active', role === 'driver');
  browseRiderButton.classList.toggle('active', role === 'rider');
}

function renderBrowseRoleChoice() {
  setBrowseRole(null);
  browseTitle.textContent = 'Browse rides';
  browseSubtitle.textContent = 'Choose whether you are driving or riding today.';
  browseControls.classList.add('hidden');
  browseRadiusMapDiv?.classList.add('hidden');
  clearBrowseResultMarkers();
  if (browsePickupCircle) browsePickupCircle.setMap(null);
  if (browseDropoffCircle) browseDropoffCircle.setMap(null);
  browseResultsTitle.textContent = 'Choose a role to start';
  ridesList.innerHTML = '<p class="browse-start-message">Select Driver to view student ride requests, or Rider to view available seats.</p>';
}

function showRiderBrowse() {
  setBrowseRole('rider');
  loadGoogleMapsAPI().then(() => { initializeRadiusAutocomplete(); loadRides(); });
  browseTitle.textContent = 'Browse available rides';
  browseSubtitle.textContent = 'Search, filter, and sort driver seat offers from your university network.';
  browseSearchLabel.firstChild.textContent = 'Search destination or meetup';
  pickupLocationLabel.firstChild.textContent = 'Your pick-up area ';
  pickupRadiusLabel.firstChild.textContent = 'Pick-up radius (mi) ';
  dropoffLocationLabel.firstChild.textContent = 'Your drop-off area ';
  dropoffRadiusLabel.firstChild.textContent = 'Drop-off radius (mi) ';
  rideSearchInput.placeholder = 'Where do you want to go?';
  pickupRadiusLocationInput.placeholder = 'Where can you be picked up?';
  dropoffRadiusLocationInput.placeholder = 'Where do you want to be dropped off?';
  browseControls.classList.remove('hidden');
  browseResultsTitle.textContent = 'Available rides';
  loadRides();
}

function showDriverBrowse() {
  setBrowseRole('driver');
  loadGoogleMapsAPI().then(() => { initializeRadiusAutocomplete(); loadRideRequests(); });
  browseTitle.textContent = 'Browse requested rides';
  browseSubtitle.textContent = 'Review student ride requests from your university network.';
  browseSearchLabel.firstChild.textContent = 'Search requested route';
  pickupLocationLabel.firstChild.textContent = 'Driver pick-up center ';
  pickupRadiusLabel.firstChild.textContent = 'Willing pick-up radius (mi) ';
  dropoffLocationLabel.firstChild.textContent = 'Driver drop-off center ';
  dropoffRadiusLabel.firstChild.textContent = 'Willing drop-off radius (mi) ';
  rideSearchInput.placeholder = 'Search rider request';
  pickupRadiusLocationInput.placeholder = 'Where are you willing to pick up?';
  dropoffRadiusLocationInput.placeholder = 'Where are you willing to drop off?';
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
  if (request.university !== currentUser.university) return false;
  if (request.riderId === currentUser.id) return false;
  if (request.sameGenderDriverOnly && !canMatchSameGender(request.riderGender, currentUser.gender)) return false;
  return (request.status || 'open') === 'open';
}

async function loadRideRequests() {
  if (browseRole !== 'driver') return;
  ridesList.textContent = 'Loading requested rides...';
  try {
    const requests = await fetchJson('/api/ride-requests');
    const visibleRequests = requests.filter((request) => canCurrentUserSeeRequest(request) && requestMatchesDriverFilters(request));
    ridesList.innerHTML = '';
    updateBrowseRadiusMap(visibleRequests);
    if (!visibleRequests.length) {
      ridesList.innerHTML = '<div class="ride-empty-state"><p>No students have requested rides that match your driver profile yet.</p></div>';
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
  yourRidesHistoryTab.classList.toggle('active', view === 'history');
}

function appendRideSection(container, title, rides, builder) {
  if (!rides.length) return;
  const label = document.createElement('h4');
  label.textContent = title;
  container.appendChild(label);
  rides.forEach((ride) => container.appendChild(builder(ride)));
}

function buildHistoryRideCard(ride, role) {
  const item = role === 'Driver' ? buildDriverRideSummary(ride) : buildRideSummary(ride);
  item.classList.add('history-ride-card');
  const badge = document.createElement('div');
  badge.className = 'ride-role-badge ' + (role === 'Driver' ? 'driver-role' : 'rider-role');
  badge.textContent = role;
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
    const currentDrivingRides = drivingRides
      .filter((ride) => !isPastRide(ride))
      .sort((a, b) => getRideStartTime(a) - getRideStartTime(b));
    const currentReservedRides = reservedRides
      .filter((ride) => !isPastRide(ride))
      .sort((a, b) => getRideStartTime(a) - getRideStartTime(b));
    const historyRides = [
      ...drivingRides.filter(isPastRide).map((ride) => ({ ride, role: 'Driver' })),
      ...reservedRides.filter(isPastRide).map((ride) => ({ ride, role: 'Rider' })),
    ].sort((a, b) => getRideStartTime(b.ride) - getRideStartTime(a.ride));

    if (yourRidesView === 'history') {
      if (!historyRides.length) {
        yourRidesList.textContent = 'No previous rides yet.';
        return;
      }
      appendRideSection(yourRidesList, 'History rides', historyRides, (entry) => buildHistoryRideCard(entry.ride, entry.role));
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
    yourRidesList.textContent = 'Unable to load your rides.';
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
sameGenderDriversOnlyFilter.addEventListener('change', () => loadRides());
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
  try {
    const data = await fetchJson('/api/auth/signup', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ firstName, middleName, lastName, birthday, gender, email, password }) });
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
  if (sameGenderOnly && !canMatchSameGender(currentUser.gender, currentUser.gender)) {
    alert('Choose a gender on your account before offering same gender only rides.');
    return;
  }
  try {
    await fetchJson('/api/rides', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ origin, destination, originLat: parseFloat(originLat), originLng: parseFloat(originLng), destinationLat: parseFloat(destinationLat), destinationLng: parseFloat(destinationLng), date, time, sameGenderOnly, vehicleSeatCount, seatsAvailable: Number(seats), availableSeatIds, price: Number(price), carMaker, carModel, carColor, licensePlate, termsAccepted, estimatedDurationMinutes, notes }) });
    offerForm.reset();
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
requestRideBackHomeButton.addEventListener('click', () => showDashboardHome());
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
listRideBackHomeButton.addEventListener('click', () => showDashboardHome());
chatButton.addEventListener('click', () => showChatPage());
chatBackHomeButton.addEventListener('click', () => showDashboardHome());
cartButton.addEventListener('click', () => showCartPage());
yourRidesButton.addEventListener('click', () => showYourRidesPage());
yourRidesCurrentTab.addEventListener('click', () => { setYourRidesView('current'); loadYourRides(); });
yourRidesHistoryTab.addEventListener('click', () => { setYourRidesView('history'); loadYourRides(); });
yourRidesBackHomeButton.addEventListener('click', () => showDashboardHome());
leaderboardButton.addEventListener('click', () => showLeaderboardPage());
leaderboardBackHomeButton.addEventListener('click', () => showDashboardHome());
profileButton.addEventListener('click', () => showProfilePage());
profileBackHomeButton.addEventListener('click', () => showDashboardHome());
trackTripButton.addEventListener('click', () => showTrackTripPage());
trackBackHomeButton.addEventListener('click', () => showDashboardHome());
startTrackingButton.addEventListener('click', () => startTripTracking());
stopTrackingButton.addEventListener('click', () => stopTripTracking());
continueShoppingButton.addEventListener('click', () => showDashboardHome());
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

  };
  try {
    currentUser = await fetchJson('/api/profile', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    updateUserHeader(currentUser);
    fillProfileForm(currentUser);
    profileMessage.textContent = 'Profile updated. You can change your name again in 6 months.';
    profileMessage.classList.add('show');
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
paymentBackToCartButton.addEventListener('click', () => showCartPage());
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
