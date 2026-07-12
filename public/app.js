// ── Toast notification system ───────────────────────────────────
const toastContainer = document.getElementById('toast-container');

function showToast(message, type = 'info', duration = 3800) {
  if (!toastContainer) return;
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  const icon = type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ';
  const iconNode = document.createElement('span');
  iconNode.setAttribute('aria-hidden', 'true');
  iconNode.textContent = icon;
  const messageNode = document.createElement('span');
  messageNode.textContent = String(message || '');
  toast.append(iconNode, messageNode);
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
const inviteAuthBanner = document.getElementById('invite-auth-banner');
const inviteAuthName = document.getElementById('invite-auth-name');
const dashboard = document.getElementById('dashboard');
const siteLogo = document.querySelector('.site-logo');
const headerActions = document.getElementById('header-actions');
const headerLeftActions = document.getElementById('header-left-actions');
const signinForm = document.getElementById('signin-form');
const signinBackToWaitlistButton = document.getElementById('signin-back-to-waitlist');
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
const socialButton = document.getElementById('social-button');
const chatPage = document.getElementById('chat-page');
const chatBackHomeButton = document.getElementById('chat-back-home');
const chatRideTab = document.getElementById('chat-ride-tab');
const chatSocialTab = document.getElementById('chat-social-tab');
const chatRidePanel = document.getElementById('chat-ride-panel');
const chatSocialPanel = document.getElementById('chat-social-panel');
const chatRideList = document.getElementById('chat-ride-list');
const chatSocialList = document.getElementById('chat-social-list');
const chatConversation = document.getElementById('chat-conversation');
const offerForm = document.getElementById('offer-form');
const ridesList = document.getElementById('rides-list');
const profileRides = document.getElementById('profile-rides');
const dashboardHome = document.getElementById('dashboard-home');
const socialPage = document.getElementById('social-page');
const socialPageTitle = document.getElementById('social-page-title');
const socialPageSubtitle = document.getElementById('social-page-subtitle');
const socialDetailSection = document.getElementById('social-detail-section');
const socialFeedSection = document.getElementById('social-feed-section');
const socialHomeFeed = document.getElementById('social-home-feed');
const browseTitle = document.getElementById('browse-title');
const browseSubtitle = document.getElementById('browse-subtitle');
const browseControls = document.getElementById('browse-controls');
const browseResultsTitle = document.getElementById('browse-results-title');
const browseDriverButton = document.getElementById('browse-driver-button');
const browseRiderButton = document.getElementById('browse-rider-button');
const waitlistPage = document.getElementById('waitlist-page');
const waitlistTitle = document.getElementById('waitlist-title');
const waitlistMessage = document.getElementById('waitlist-message');
const waitlistProfileButton = document.getElementById('waitlist-profile-button');
const waitlistIntentButtons = document.querySelectorAll('[data-waitlist-intent]');
const waitlistIntentMessage = document.getElementById('waitlist-intent-message');
const waitlistLeaderboardCount = document.getElementById('waitlist-leaderboard-count');
const waitlistLeaderboardSummary = document.getElementById('waitlist-leaderboard-summary');
const waitlistLeaderboardChart = document.getElementById('waitlist-leaderboard-chart');
const waitlistLeaderboardReview = document.getElementById('waitlist-leaderboard-review');
const waitlistQuickForm = document.getElementById('waitlist-quick-form');
const waitlistQuickMessage = document.getElementById('waitlist-quick-message');
const waitlistQuickError = document.getElementById('waitlist-quick-error');
const waitlistQuickSubmit = document.getElementById('waitlist-quick-submit');
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
const yourRidesDrivingTab = document.getElementById('your-rides-driving-tab');
const yourRidesRidingTab = document.getElementById('your-rides-riding-tab');
const yourRidesRequestsTab = document.getElementById('your-rides-requests-tab');
const yourRidesHistoryTab = document.getElementById('your-rides-history-tab');
const yourRidesBackHomeButton = document.getElementById('your-rides-back-home');
const profileButton = document.getElementById('profile-button');
const notificationsButton = document.getElementById('notifications-button');
const notificationsCount = document.getElementById('notifications-count');
const notificationsPopover = document.getElementById('notifications-popover');
const notificationsList = document.getElementById('notifications-list');
const notificationsSummary = document.getElementById('notifications-summary');
const notificationsError = document.getElementById('notifications-error');
const eatsButton = document.getElementById('eats-button');
const eatsPage = document.getElementById('eats-page');
const eatsCheckoutPage = document.getElementById('eats-checkout-page');
const eatsBackHomeButton = document.getElementById('eats-back-home');
const leaderboardButton = document.getElementById('leaderboard-button');
const adminButton = document.getElementById('admin-button');
const adminPage = document.getElementById('admin-page');
const adminBackHomeButton = document.getElementById('admin-back-home');
const adminVersionSummary = document.getElementById('admin-version-summary');
const adminMetrics = document.getElementById('admin-metrics');
const adminTableWrap = document.getElementById('admin-table-wrap');
const adminMessage = document.getElementById('admin-message');
const adminError = document.getElementById('admin-error');
const adminTabs = document.querySelectorAll('[data-admin-tab]');
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
const userSearchPopover = document.getElementById('user-search-popover');
const userSearchForm = document.getElementById('user-search-form');
const userSearchInput = document.getElementById('user-search-input');
const userSearchSubmit = document.getElementById('user-search-submit');
const userSearchResults = document.getElementById('user-search-results');
const userSearchError = document.getElementById('user-search-error');
const profilePage = document.getElementById('profile-page');
const profileForm = document.getElementById('profile-form');
const profileBackHomeButton = document.getElementById('profile-back-home');
const profileMessage = document.getElementById('profile-message');
const profileError = document.getElementById('profile-error');
const friendInviteForm = document.getElementById('friend-invite-form');
const friendInviteEmail = document.getElementById('friend-invite-email');
const friendInviteSubmit = document.getElementById('friend-invite-submit');
const friendInviteMessage = document.getElementById('friend-invite-message');
const friendInviteError = document.getElementById('friend-invite-error');
const friendInviteCount = document.getElementById('friend-invite-count');
const friendInviteJoinedCount = document.getElementById('friend-invite-joined-count');
const friendInviteLink = document.getElementById('friend-invite-link');
const friendInviteCopyButton = document.getElementById('friend-invite-copy');
const friendInviteLinkMessage = document.getElementById('friend-invite-link-message');
const deleteAccountForm = document.getElementById('delete-account-form');
const deleteAccountSubmit = document.getElementById('delete-account-submit');
const deleteAccountMessage = document.getElementById('delete-account-message');
const deleteAccountError = document.getElementById('delete-account-error');
const notificationPreferencesForm = document.getElementById('notification-preferences-form');
const weeklyRecapEmailInput = document.getElementById('weekly-recap-email');
const rideAlertEmailInput = document.getElementById('ride-alert-email');
const notificationPreferencesSubmit = document.getElementById('notification-preferences-submit');
const notificationPreferencesMessage = document.getElementById('notification-preferences-message');
const notificationPreferencesError = document.getElementById('notification-preferences-error');
const profileSidebarButtons = document.querySelectorAll('.profile-sidebar-button');
const profilePanels = document.querySelectorAll('[data-profile-panel]');
const profilePictureInput = document.getElementById('profile-picture-input');
const profilePicturePreview = document.getElementById('profile-picture-preview');
const profilePictureRemoveButton = document.getElementById('profile-picture-remove');
const profileAvatarEditBtn = document.getElementById('profile-avatar-edit-btn');
const profilePhotoMenu = document.getElementById('profile-photo-menu');
const profilePhotoUploadBtn = document.getElementById('profile-photo-upload');
const profileDisplayName = document.getElementById('profile-display-name');
const profileDisplayUniversity = document.getElementById('profile-display-university');
const profileDisplayDetails = document.getElementById('profile-display-details');
const profileDisplayJoined = document.getElementById('profile-display-joined');
const schoolTransferForm = document.getElementById('school-transfer-form');
const schoolTransferCurrent = document.getElementById('school-transfer-current');
const schoolTransferCollege = document.getElementById('school-transfer-college');
const schoolTransferEmail = document.getElementById('school-transfer-email');
const schoolTransferVerifyCard = document.getElementById('school-transfer-verify-card');
const schoolTransferPending = document.getElementById('school-transfer-pending');
const schoolTransferCode = document.getElementById('school-transfer-code');
const schoolTransferVerifyButton = document.getElementById('school-transfer-verify-button');
const schoolTransferMessage = document.getElementById('school-transfer-message');
const schoolTransferError = document.getElementById('school-transfer-error');
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
const stripePayoutRefreshButton = document.getElementById('stripe-payout-refresh');
const stripePayoutHistoryButton = document.getElementById('stripe-payout-history');
const stripeConnectContainer = document.getElementById('stripe-connect-container');
const payoutCommissionLabel = document.getElementById('payout-commission-label');
const LINKUP_COMMISSION_RATE = 0.15;
const STRIPE_FEE_RATE = 0.029;
const STRIPE_FEE_FIXED_CENTS = 30;
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
const embeddedCheckoutContainer = document.getElementById('stripe-embedded-checkout-container');
const defaultPaymentStripeContainer = document.getElementById('default-payment-stripe-container');
const defaultPaymentElementNode = document.getElementById('default-payment-element');
const defaultPaymentConfirmButton = document.getElementById('default-payment-confirm');
const browseRidesButton = document.getElementById('browse-rides-button');
const browsePage = document.getElementById('browse-page');
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
const safetyModeStatus = document.getElementById('safety-mode-status');
const safetyRecordingConsent = document.getElementById('safety-recording-consent');
const doorSafetyConfirmedInput = document.getElementById('door-safety-confirmed');
const startSafetyRecordingButton = document.getElementById('start-safety-recording');
const stopSafetyRecordingButton = document.getElementById('stop-safety-recording');
const safetyIncidentNote = document.getElementById('safety-incident-note');
const sendSafetyNoteButton = document.getElementById('send-safety-note');
const reportDoorSafetyButton = document.getElementById('report-door-safety');
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
const policyTermsFull = document.querySelector('.policy-terms-full');
const policyPrivacyFull = document.querySelector('.policy-privacy-full');
const appearanceForm = document.getElementById('appearance-form');
const appearanceMessage = document.getElementById('appearance-message');
const appearanceError = document.getElementById('appearance-error');
const themePreferenceInputs = document.querySelectorAll('input[name="theme-preference"]');

let currentUser = null;
let currentCampusGroups = [];
let notificationsSeenCount = 0;
let cachedNotifications = [];
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
let walletCreditApplied = false;
let paymentPageTotalCents = 0;
let pendingExpiredCartRideNoticeCount = 0;
let pendingProfilePictureDataUrl;
let pendingVerificationEmail = '';
let pending2FAMethod = 'totp';
let pending2FAEmailHint = '';
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
let safetyRecorder = null;
let safetyRecordingStream = null;
let safetyRecordingChunks = [];
let safetyRecordingStartedAt = 0;
let lastSafetyRecordingId = '';
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
const THEME_STORAGE_KEY = 'linkup.theme';

// ── Uber-style dark map theme ───────────────────────────────────
const UBER_MAP_STYLES = [
  { elementType: 'geometry',          stylers: [{ color: '#0c1618' }] },
  { elementType: 'labels.text.fill',  stylers: [{ color: '#5ba8b2' }] },
  { elementType: 'labels.text.stroke',stylers: [{ color: '#071819' }] },
  { featureType: 'road',              elementType: 'geometry',        stylers: [{ color: '#152c32' }] },
  { featureType: 'road',              elementType: 'geometry.stroke', stylers: [{ color: '#0a1e22' }] },
  { featureType: 'road.highway',      elementType: 'geometry',        stylers: [{ color: '#0e3038' }] },
  { featureType: 'road.highway',      elementType: 'geometry.stroke', stylers: [{ color: '#071c20' }] },
  { featureType: 'road.highway',      elementType: 'labels.text.fill',stylers: [{ color: '#3ecfcf' }] },
  { featureType: 'water',             elementType: 'geometry',        stylers: [{ color: '#040e10' }] },
  { featureType: 'water',             elementType: 'labels.text.fill',stylers: [{ color: '#1a6571' }] },
  { featureType: 'poi',               elementType: 'geometry',        stylers: [{ color: '#0a1618' }] },
  { featureType: 'poi.park',          elementType: 'geometry',        stylers: [{ color: '#091a15' }] },
  { featureType: 'poi.park',          elementType: 'labels.text.fill',stylers: [{ color: '#1d6b5d' }] },
  { featureType: 'transit',           elementType: 'geometry',        stylers: [{ color: '#0d2428' }] },
  { featureType: 'administrative',    elementType: 'geometry',        stylers: [{ color: '#0f2a32' }] },
  { featureType: 'administrative',    elementType: 'labels.text.fill',stylers: [{ color: '#4a9ba5' }] },
  { featureType: 'landscape',         elementType: 'geometry',        stylers: [{ color: '#0a1e22' }] },
];

function normalizeThemePreference(themePreference) {
  const val = String(themePreference || '').toLowerCase();
  if (val === 'light') return 'light';
  if (val === 'auto') return 'auto';
  return 'dark';
}

function resolveTimeBasedTheme() {
  const hour = new Date().getHours();
  return (hour >= 6 && hour < 19) ? 'light' : 'dark';
}

let autoThemeInterval = null;

function startAutoThemeWatcher() {
  if (autoThemeInterval) return;
  autoThemeInterval = setInterval(() => {
    applyThemePreference('auto', { persist: false });
  }, 60000);
}

function stopAutoThemeWatcher() {
  clearInterval(autoThemeInterval);
  autoThemeInterval = null;
}

function applyThemePreference(themePreference, { persist = true } = {}) {
  const pref = normalizeThemePreference(themePreference);
  const theme = pref === 'auto' ? resolveTimeBasedTheme() : pref;
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'light' ? '#f6fbfb' : '#071819');
  themePreferenceInputs.forEach((input) => {
    const selected = input.value === pref;
    input.checked = selected;
    input.closest('.theme-choice-card')?.classList.toggle('is-selected', selected);
  });
  if (persist) {
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, pref);
    } catch (_) {}
  }
  if (typeof window.applyGoogleMapTheme === 'function') window.applyGoogleMapTheme();
  if (pref === 'auto') startAutoThemeWatcher();
  else stopAutoThemeWatcher();
  return pref;
}

function getStoredThemePreference() {
  try {
    return window.localStorage.getItem(THEME_STORAGE_KEY);
  } catch (_) {
    return '';
  }
}

applyThemePreference(getStoredThemePreference() || 'dark', { persist: false });

function getAppRoute() {
  return decodeURIComponent(window.location.hash.replace(/^#/, '')).trim();
}

let linkUpFeatureFlags = { bites: false, social: false };
fetch('/api/config/features')
  .then((response) => response.ok ? response.json() : linkUpFeatureFlags)
  .then((flags) => {
    linkUpFeatureFlags = { bites: flags?.bites === true, social: flags?.social === true };
    eatsButton?.classList.toggle('hidden', !linkUpFeatureFlags.bites);
    socialButton?.classList.toggle('hidden', !linkUpFeatureFlags.social);
    document.querySelectorAll('[id^="eats-nav-"]').forEach((button) => button.classList.toggle('hidden', !linkUpFeatureFlags.bites));
  })
  .catch(() => {});

function isBitesEnabled() {
  return linkUpFeatureFlags.bites === true;
}

function isSocialPreviewEnabled() {
  return linkUpFeatureFlags.social === true;
}

function setAppRoute(route) {
  if (isRestoringRoute || !route) return;
  const nextUrl = window.location.pathname + window.location.search + '#' + encodeURIComponent(route);
  window.history.replaceState({}, document.title, nextUrl);
}

function clearAppRoute() {
  window.history.replaceState({}, document.title, window.location.pathname + window.location.search);
}

const NAV_BUTTON_IDS = ['browse-rides-button', 'request-ride-button', 'list-ride-button', 'your-rides-button', 'eats-button', 'leaderboard-button'];
function setActiveNavButton(activeId) {
  NAV_BUTTON_IDS.forEach((id) => {
    const btn = document.getElementById(id);
    if (btn) btn.classList.toggle('active', id === activeId);
  });
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

const WAITLIST_RESTRICTED_PROFILE_TABS = new Set(['payment', 'payouts']);

function isWaitlistProfileMode() {
  return Boolean(currentUser && currentUser.serviceApproved !== true);
}

function getAvailableProfileTab(tabName = 'info') {
  return isWaitlistProfileMode() && WAITLIST_RESTRICTED_PROFILE_TABS.has(tabName) ? 'info' : tabName;
}

function updateProfileTabAvailability() {
  const restricted = isWaitlistProfileMode();
  profileSidebarButtons.forEach((button) => {
    if (button.dataset.waitlistHidden === 'true') {
      button.hidden = restricted;
    }
  });
}

function publicProfileRoute(userId) {
  return 'user-profile-' + userId;
}

function interestTagRoute(tag) {
  return 'interest-tag-' + encodeURIComponent(String(tag || '').trim());
}

function groupWelcomeRoute(groupName) {
  return 'group-' + encodeURIComponent(String(groupName || '').trim());
}
socialButton?.classList.toggle('hidden', !isSocialPreviewEnabled());
let browseRole = null;
let yourRidesView = 'driving';
let adminView = 'reports';
let adminSnapshot = null;
let selectedChatRideId = '';
let selectedSocialChatUserId = '';
let activeChatSection = 'ride';
let browseRadiusMap = null;
let browsePickupCircle = null;
let browseDropoffCircle = null;
let browsePickupMarker = null;
let browseDropoffMarker = null;
let browseRouteRenderer = null;
let browseRouteLine = null;
let browseResultMarkers = [];
let userSearchDebounceTimer = null;

document.addEventListener('click', async (event) => {
  const target = event.target.closest?.('button');
  if (
    userSearchPopover &&
    !userSearchPopover.classList.contains('hidden') &&
    !event.target.closest?.('#user-search-popover') &&
    !event.target.closest?.('#user-search-form')
  ) {
    closeUserSearchPopover();
  }
  if (
    notificationsPopover &&
    !notificationsPopover.classList.contains('hidden') &&
    !event.target.closest?.('#notifications-popover') &&
    !event.target.closest?.('#notifications-button')
  ) {
    closeNotificationsPopover();
  }
  if (!target) return;
  if (target.classList.contains('tab-button') && target.dataset.tab) {
    event.preventDefault();
    showAuthForm(target.dataset.tab + '-form');
    return;
  }
  if (target.classList.contains('profile-sidebar-button') && target.dataset.profileTab) {
    event.preventDefault();
    showProfileTab(target.dataset.profileTab);
    return;
  }
  const actionMap = {
    'browse-driver-button': () => showDriverBrowse(),
    'browse-rider-button': () => showRiderBrowse(),
    'browse-rides-button': () => showBrowsePage(),
    'browse-back-home': () => returnToBrowseRides(),
    'social-button': () => {
      if (isSocialPreviewEnabled()) showSocialPage();
    },
    'social-back-home': () => {
      if (isSocialPreviewEnabled()) handleSocialBackButton();
      else returnToBrowseRides();
    },
    'request-ride-button': () => showRequestRidePage(),
    'list-ride-button': () => showListRidePage(),
    'your-rides-button': () => showYourRidesPage(),
    'leaderboard-button': () => showLeaderboardPage(),
    'admin-button': () => showAdminPage(),
    'profile-button': () => showProfilePage(),
    'notifications-button': () => toggleNotificationsPopover(),
    'cart-button': () => showCartPage(),
    'leaderboard-back-home': () => returnToBrowseRides(),
    'admin-back-home': () => returnToBrowseRides(),
    'public-profile-back-home': () => returnToBrowseRides(),
    'profile-back-home': () => returnToBrowseRides(),
    'request-ride-back-home': () => returnToBrowseRides(),
    'list-ride-back-home': () => returnToBrowseRides(),
    'chat-back-home': () => returnToBrowseRides(),
    'your-rides-back-home': () => returnToBrowseRides(),
    'continue-shopping': () => returnToBrowseRides(),
    'waitlist-guest-signup': () => { showAuthSection(); showAuthForm('signup-form'); },
    'waitlist-guest-signin': () => { showAuthSection(); showAuthForm('signin-form'); },
    'signin-back-to-waitlist': () => returnToWaitlistFromSignin(),
    'privacy-link': () => showLegalPage('privacy'),
    'terms-link': () => showLegalPage('terms'),
    'forgot-auth-link': () => {
      clearRecoveryMessages();
      showAuthForm('recovery-form');
    },
    'back-to-signin': () => {
      clearRecoveryMessages();
      recoveryForm?.reset();
      showAuthForm('signin-form');
    },
    'verification-back-to-signin': () => {
      clearRecoveryMessages();
      verificationForm?.reset();
      showAuthForm('signin-form');
    },
    'signup-back-to-signin': () => {
      signupError.textContent = '';
      signupError.classList.remove('show');
      showAuthForm('signin-form');
    },
    'reset-back-to-signin': () => {
      clearRecoveryMessages();
      resetPasswordForm?.reset();
      window.history.replaceState({}, document.title, window.location.pathname);
      showAuthForm('signin-form');
    },
    'twofa-login-back': () => {
      document.getElementById('twofa-login-error').textContent = '';
      document.getElementById('twofa-login-code').value = '';
      document.querySelectorAll('#twofa-form .otp-digit').forEach(d => { d.value = ''; });
      showAuthForm('signin-form');
    },
  };
  const action = actionMap[target.id];
  if (!action && target.id !== 'signout') return;
  event.preventDefault();
  event.stopImmediatePropagation();
  if (target.disabled) return;
  if (target.id === 'signout') {
    try {
      await fetchJson('/api/auth/signout', { method: 'POST' });
    } catch (_) {}
    clearAppRoute();
    showAuthSection();
    return;
  }
  action();
}, true);
window.__linkupCriticalNavAttached = true;
let browseRideRoutes = [];        // per-ride/request polylines
let browseRideOriginMarkers = []; // small pickup dot per ride/request
let browsePinLabels = new Map();
let stripeInstance = null;
let stripeConnectInst = null;
let stripePaymentElements = null;
let stripeCardElements = null;
let stripeSetupElements = null;
let activeExpressCheckoutElement = null;
let activePaymentElement = null;
let activeSetupElement = null;
let activeEmbeddedCheckout = null;
let activePaymentIntentId = '';
let activePaymentClientSecret = '';
let activeSetupIntentId = '';
const selectedSeatByRide = new Map();

const getGoogleMapStylesForTheme = () =>
  document.documentElement.dataset.theme === 'light' ? null : UBER_MAP_STYLES;

const applyGoogleMapTheme = () => {
  const styles = getGoogleMapStylesForTheme();
  [originMap, requestOriginMap, trackingMap, sharedTrackingMap, browseRadiusMap]
    .filter(Boolean)
    .forEach((map) => map.setOptions({ styles }));
};

window.applyGoogleMapTheme = applyGoogleMapTheme;

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
function makeLiveLocationDotIcon() {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="34" height="34" viewBox="0 0 34 34">
    <circle cx="17" cy="17" r="15" fill="#3ecfcf" opacity="0.18"/>
    <circle cx="17" cy="17" r="9" fill="#3ecfcf" stroke="#ffffff" stroke-width="2"/>
    <circle cx="17" cy="17" r="4" fill="#0d1517"/>
  </svg>`;
  return { url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg), anchor: new google.maps.Point(17, 17) };
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
const movingServiceFields = document.getElementById('moving-service-fields');
let movingRequestPhotoDataUrl = '';
const offerPickupRadiusInput = document.getElementById('offer-pickup-radius');
const offerDropoffRadiusInput = document.getElementById('offer-dropoff-radius');
const requestPickupRadiusInput = document.getElementById('request-pickup-radius');
const requestDropoffRadiusInput = document.getElementById('request-dropoff-radius');
const CAR_SEATS = [
  { id: 'driver', label: 'Driver', role: 'Driver' },
  { id: 'front_passenger', label: 'Front Passenger' },
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
  ['saddleback', { name: 'Saddleback College', lat: 33.55290, lng: -117.66730 }],
  ['saddleback college', { name: 'Saddleback College', lat: 33.55290, lng: -117.66730 }],
  ['saddleback edu', { name: 'Saddleback College', lat: 33.55290, lng: -117.66730 }],
  ['ivc', { name: 'Irvine Valley College', lat: 33.67690, lng: -117.77990 }],
  ['ivc edu', { name: 'Irvine Valley College', lat: 33.67690, lng: -117.77990 }],
  ['irvine valley college', { name: 'Irvine Valley College', lat: 33.67690, lng: -117.77990 }],
  ['ucla', { name: 'University of California, Los Angeles', lat: 34.06892, lng: -118.44518 }],
  ['ucla edu', { name: 'University of California, Los Angeles', lat: 34.06892, lng: -118.44518 }],
  ['uc los angeles', { name: 'University of California, Los Angeles', lat: 34.06892, lng: -118.44518 }],
  ['university of california los angeles', { name: 'University of California, Los Angeles', lat: 34.06892, lng: -118.44518 }],
  ['uci', { name: 'University of California, Irvine', lat: 33.64050, lng: -117.84430 }],
  ['uci edu', { name: 'University of California, Irvine', lat: 33.64050, lng: -117.84430 }],
  ['uc irvine', { name: 'University of California, Irvine', lat: 33.64050, lng: -117.84430 }],
  ['university of california irvine', { name: 'University of California, Irvine', lat: 33.64050, lng: -117.84430 }],
]);

const LOCATION_REGIONS = {
  CA: { state: 'CA', minLat: 32.45, maxLat: 42.1, minLng: -124.6, maxLng: -114.0 },
  ON: { state: 'ON', minLat: 41.6, maxLat: 56.9, minLng: -95.2, maxLng: -74.3 },
};
const FALLBACK_MAP_CENTER = { lat: 34.069, lng: -118.445 };
let browserMapCenterPromise = null;

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
const googleGeocodeCache = new Map();
const googleDirectionsCache = new Map();
const googleTripMetricsCache = new Map();

function normalizedMapsKey(value) {
  if (typeof value === 'string') return value.trim().toLowerCase().replace(/\s+/g, ' ');
  const lat = typeof value?.lat === 'function' ? value.lat() : Number(value?.lat);
  const lng = typeof value?.lng === 'function' ? value.lng() : Number(value?.lng);
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return '';
  return lat.toFixed(5) + ',' + lng.toFixed(5);
}

function getCachedDrivingDirections(origin, destination) {
  const key = normalizedMapsKey(origin) + '>' + normalizedMapsKey(destination);
  if (googleDirectionsCache.has(key)) return googleDirectionsCache.get(key);
  const request = new Promise((resolve) => {
    if (!window.google?.maps?.DirectionsService || !normalizedMapsKey(origin) || !normalizedMapsKey(destination)) {
      resolve(null);
      return;
    }
    new google.maps.DirectionsService().route(
      { origin, destination, travelMode: google.maps.TravelMode.DRIVING },
      (result, status) => resolve(status === 'OK' ? result : null)
    );
  });
  googleDirectionsCache.set(key, request);
  return request;
}

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
        const timeout = setTimeout(() => reject(new Error('Google Maps script timed out')), 10000);
        script.onload = () => { clearTimeout(timeout); resolve(); };
        script.onerror = () => { clearTimeout(timeout); reject(new Error('Google Maps script failed to load')); };
      });
    } catch (error) {
      _googleMapsPromise = null;
      console.error('Failed to load Google Maps API:', error);
      throw error;
    }
  })();
  return _googleMapsPromise;
}

function showBrowseMapLoadError(error) {
  const message = error?.message || 'Google Maps could not load.';
  browseMapPanel?.classList.remove('hidden');
  browseRiderLayout?.classList.add('rider-active');
  if (browseRadiusMapDiv) {
    browseRadiusMapDiv.innerHTML = '<div class="map-error-state">Google Maps is unavailable right now.</div>';
  }
  if (browseMapHintPanel) {
    browseMapHintPanel.textContent = message.includes('Google Maps API key')
      ? 'Add GOOGLE_MAPS_API_KEY to your local .env.local file, then restart localhost.'
      : message;
  }
}

function getBrowserMapCenter() {
  if (browserMapCenterPromise) return browserMapCenterPromise;
  browserMapCenterPromise = new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve(null);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = Number(position.coords.latitude);
        const lng = Number(position.coords.longitude);
        resolve(Number.isFinite(lat) && Number.isFinite(lng) ? { lat, lng } : null);
      },
      () => resolve(null),
      { enableHighAccuracy: true, timeout: 6000, maximumAge: 1000 * 60 * 10 }
    );
  });
  return browserMapCenterPromise;
}

function recenterMapOnBrowserLocation(map, options = {}) {
  if (!map) return;
  getBrowserMapCenter().then((center) => {
    if (!center) return;
    if (typeof options.shouldApply === 'function' && !options.shouldApply()) return;
    map.setCenter(center);
    if (options.zoom) map.setZoom(options.zoom);
    if (options.marker) options.marker.setPosition(center);
  });
}

function initializeOriginMap() {
  const center = getInitialMapCenter();
  originMap = new google.maps.Map(originMapDiv, {
    zoom: 13,
    center,
    styles: getGoogleMapStylesForTheme(),
    disableDefaultUI: false,
    zoomControl: true,
    mapTypeControl: false,
    streetViewControl: false,
    fullscreenControl: false,
  });
  originMarker = new google.maps.Marker({ map: originMap, position: center, icon: makeOriginIcon() });
  recenterMapOnBrowserLocation(originMap, {
    zoom: 13,
    marker: originMarker,
    shouldApply: () => !document.getElementById('origin-lat')?.value && !document.getElementById('origin-lng')?.value,
  });
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

function getInitialMapCenter() {
  const schoolCenter = getKnownLocationAlias(currentUser?.university)
    || getKnownLocationAlias(currentUser?.universityDomain);
  return schoolCenter ? { lat: schoolCenter.lat, lng: schoolCenter.lng } : FALLBACK_MAP_CENTER;
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
  const cacheKey = normalizedMapsKey(address);
  if (googleGeocodeCache.has(cacheKey)) return googleGeocodeCache.get(cacheKey);
  const requestPromise = new Promise((resolve) => {
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
  googleGeocodeCache.set(cacheKey, requestPromise);
  return requestPromise;
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
  let debounceTimer = null;
  const doLookup = () => lookupTypedLocation(input, onResolved);
  input.addEventListener('keydown', (event) => {
    if (event.key !== 'Enter') return;
    event.preventDefault();
    clearTimeout(debounceTimer);
    doLookup();
  });
  // Geocode 650 ms after the user stops typing — makes the map feel live
  input.addEventListener('input', () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(doLookup, 650);
  });
  // Small delay on blur so autocomplete place_changed can fire first when the
  // user clicks a suggestion (autocomplete fills the input before place_changed,
  // but the blur fires synchronously before that on some browsers)
  input.addEventListener('blur', () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(doLookup, 150);
  });
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
  const requestOriginMapDiv = document.getElementById('request-origin-map');
  if (requestOriginMapDiv && !requestOriginMap) {
    const center = getInitialMapCenter();
    requestOriginMap = new google.maps.Map(requestOriginMapDiv, {
      zoom: 13, center,
      styles: getGoogleMapStylesForTheme(),
      mapTypeControl: false, streetViewControl: false, fullscreenControl: false,
    });
    requestOriginMarker = new google.maps.Marker({ map: requestOriginMap, position: center, icon: makeOriginIcon(), title: 'Pick-up' });
    recenterMapOnBrowserLocation(requestOriginMap, {
      zoom: 13,
      marker: requestOriginMarker,
      shouldApply: () => !document.getElementById('request-origin-lat')?.value && !document.getElementById('request-origin-lng')?.value,
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
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 25000);
  let res;
  try {
    res = await fetch(url, { credentials: 'same-origin', signal: controller.signal, ...options });
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error('The server took too long to respond. Refresh and try again.');
    }
    throw error;
  } finally {
    window.clearTimeout(timeout);
  }
  const contentType = res.headers.get('content-type') || '';
  let data;
  if (contentType.includes('application/json')) {
    data = await res.json();
  } else {
    const text = await res.text();
    const error = new Error(text.trim().startsWith('<')
      ? `Server returned a webpage instead of API data for ${url} (${res.status}). Refresh the site or purge the CDN cache, then try again.`
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

let signinHandlerAttached = false;
let authFlowVersion = 0;

function setSigninWaitlistReturnVisible(visible) {
  signinBackToWaitlistButton?.classList.toggle('hidden', !visible);
}

async function refreshSigninWaitlistReturn() {
  setSigninWaitlistReturnVisible(false);
  if (currentUser && currentUser.serviceApproved !== true) {
    setSigninWaitlistReturnVisible(true);
    return;
  }
  try {
    const sessionUser = await fetchJson('/api/auth/me');
    if (sessionUser && sessionUser.serviceApproved !== true) {
      currentUser = sessionUser;
      setSigninWaitlistReturnVisible(true);
    }
  } catch (_) {
    setSigninWaitlistReturnVisible(false);
  }
}

async function returnToWaitlistFromSignin() {
  try {
    if (currentUser && currentUser.serviceApproved !== true) {
      showDashboard(currentUser);
      return;
    }
    currentUser = await fetchJson('/api/auth/me');
    if (currentUser && currentUser.serviceApproved !== true) {
      showDashboard(currentUser);
      return;
    }
    showDashboard(currentUser);
  } catch (err) {
    setSigninWaitlistReturnVisible(false);
    if (signinError) {
      signinError.textContent = err.message || 'Please sign in again.';
      signinError.classList.add('show');
    }
  }
}

async function handleSigninSubmit(event) {
  event.preventDefault();
  authFlowVersion += 1;
  if (!signinForm || !signinError) return;
  signinError.textContent = '';
  signinError.classList.remove('show');
  const email = document.getElementById('signin-email')?.value.trim();
  const password = document.getElementById('signin-password')?.value;
  const submitButton = signinForm.querySelector('button[type="submit"]');
  setButtonLoading(submitButton, true);
  try {
    const doSignIn = () => fetchJson('/api/auth/signin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const signInResult = await doSignIn();
    if (signInResult.requires2FA) {
      setButtonLoading(submitButton, false);
      signinForm.reset();
      pending2FAMethod = signInResult.method || 'totp';
      pending2FAEmailHint = signInResult.emailHint || '';
      updateTwoFALoginForm();
      showAuthForm('twofa-form');
      return;
    }
    currentUser = signInResult;
    try {
      currentUser = await fetchJson('/api/auth/me');
    } catch (_) {
      // Stale orphaned cookie — clear it and retry sign-in once automatically
      try { await fetchJson('/api/auth/clear-session', { method: 'POST' }); } catch (_) {}
      currentUser = await doSignIn();
      currentUser = await fetchJson('/api/auth/me');
    }
    signinForm.reset();
    clearAppRoute();
    setButtonLoading(submitButton, false);
    playLoginSplash(() => enterDashboard(currentUser));
  } catch (err) {
    setButtonLoading(submitButton, false);
    if (err.message === 'Please verify your email before signing in') {
      showVerificationForm(email, err.message);
      return;
    }
    signinError.textContent = err.message || 'Unable to sign in. Please try again.';
    signinError.classList.add('show');
  }
}

function playLoginSplash(callback) {
  const splash = document.createElement('div');
  splash.id = 'lu-login-splash';
  splash.innerHTML = `
    <svg class="lu-warp-svg" viewBox="-100 -60 200 120" preserveAspectRatio="none" fill="none" xmlns="http://www.w3.org/2000/svg">
      <line class="lu-warp-line lw-a" x1="-100" y1="-60" x2="0" y2="0" style="--len:117"/>
      <line class="lu-warp-line lw-b" x1="-50"  y1="-60" x2="0" y2="0" style="--len:78"/>
      <line class="lu-warp-line lw-c" x1="0"    y1="-60" x2="0" y2="0" style="--len:60"/>
      <line class="lu-warp-line lw-b" x1="50"   y1="-60" x2="0" y2="0" style="--len:78"/>
      <line class="lu-warp-line lw-a" x1="100"  y1="-60" x2="0" y2="0" style="--len:117"/>
      <line class="lu-warp-line lw-b" x1="100"  y1="-30" x2="0" y2="0" style="--len:105"/>
      <line class="lu-warp-line lw-c" x1="100"  y1="0"   x2="0" y2="0" style="--len:100"/>
      <line class="lu-warp-line lw-b" x1="100"  y1="30"  x2="0" y2="0" style="--len:105"/>
      <line class="lu-warp-line lw-a" x1="100"  y1="60"  x2="0" y2="0" style="--len:117"/>
      <line class="lu-warp-line lw-b" x1="50"   y1="60"  x2="0" y2="0" style="--len:78"/>
      <line class="lu-warp-line lw-c" x1="0"    y1="60"  x2="0" y2="0" style="--len:60"/>
      <line class="lu-warp-line lw-b" x1="-50"  y1="60"  x2="0" y2="0" style="--len:78"/>
      <line class="lu-warp-line lw-a" x1="-100" y1="60"  x2="0" y2="0" style="--len:117"/>
      <line class="lu-warp-line lw-b" x1="-100" y1="30"  x2="0" y2="0" style="--len:105"/>
      <line class="lu-warp-line lw-c" x1="-100" y1="0"   x2="0" y2="0" style="--len:100"/>
      <line class="lu-warp-line lw-b" x1="-100" y1="-30" x2="0" y2="0" style="--len:105"/>
      <circle class="lu-warp-burst" cx="0" cy="0" r="22"/>
      <circle class="lu-warp-ring"  cx="0" cy="0" r="8"/>
    </svg>
    <img class="lu-splash-wordmark" src="assets/images/LinkUp-wordmark.png" alt="" aria-hidden="true">
  `;
  document.body.appendChild(splash);

  setTimeout(() => {
    callback();
    splash.classList.add('lu-splash--exit');
    setTimeout(() => splash.remove(), 380);
  }, 1100);
}

function attachSigninHandler() {
  if (!signinForm || signinHandlerAttached) return;
  signinHandlerAttached = true;
  window.__linkupSigninHandlerAttached = true;
  signinForm.addEventListener('submit', handleSigninSubmit);
}

attachSigninHandler();

// ── OTP digit-box behavior ────────────────────────────────────
function syncOtpGroup(group) {
  const digits = [...group.querySelectorAll('.otp-digit')];
  const value = digits.map(d => d.value).join('');
  const targetId = group.dataset.target;
  if (targetId) {
    const hidden = document.getElementById(targetId);
    if (hidden) hidden.value = value;
  }
  if (value.length === 6) {
    const container = group.closest('form, [id$="-form"]');
    if (container?.id === 'twofa-form') {
      document.getElementById('twofa-login-submit')?.click();
    } else if (container?.id === 'verification-form') {
      container.requestSubmit?.();
    }
  }
}

document.addEventListener('input', (e) => {
  if (!e.target.classList.contains('otp-digit')) return;
  const group = e.target.closest('.otp-group');
  if (!group) return;
  const digits = [...group.querySelectorAll('.otp-digit')];
  const idx = digits.indexOf(e.target);
  const raw = e.target.value.replace(/\D/g, '');
  if (raw.length > 1) {
    raw.split('').forEach((ch, i) => { if (digits[idx + i]) digits[idx + i].value = ch; });
    (digits[Math.min(idx + raw.length, digits.length - 1)] || digits[digits.length - 1]).focus();
  } else {
    e.target.value = raw;
    if (raw && idx < digits.length - 1) digits[idx + 1].focus();
  }
  syncOtpGroup(group);
});

document.addEventListener('keydown', (e) => {
  if (!e.target.classList.contains('otp-digit')) return;
  const group = e.target.closest('.otp-group');
  if (!group) return;
  const digits = [...group.querySelectorAll('.otp-digit')];
  const idx = digits.indexOf(e.target);
  if (e.key === 'Backspace') {
    if (e.target.value) { e.target.value = ''; }
    else if (idx > 0) { digits[idx - 1].value = ''; digits[idx - 1].focus(); }
    syncOtpGroup(group);
  } else if (e.key === 'ArrowLeft' && idx > 0) {
    digits[idx - 1].focus();
  } else if (e.key === 'ArrowRight' && idx < digits.length - 1) {
    digits[idx + 1].focus();
  }
});

document.addEventListener('paste', (e) => {
  if (!e.target.classList.contains('otp-digit')) return;
  e.preventDefault();
  const text = (e.clipboardData || window.clipboardData).getData('text').replace(/\D/g, '').slice(0, 6);
  const group = e.target.closest('.otp-group');
  if (!group || !text) return;
  const digits = [...group.querySelectorAll('.otp-digit')];
  const idx = digits.indexOf(e.target);
  text.split('').forEach((ch, i) => { if (digits[idx + i]) digits[idx + i].value = ch; });
  (digits[Math.min(idx + text.length, digits.length - 1)] || digits[digits.length - 1]).focus();
  syncOtpGroup(group);
});

document.addEventListener('focus', (e) => {
  if (!e.target.classList.contains('otp-digit')) return;
  e.target.select?.();
}, true);

function enterDashboard(user) {
  try {
    showDashboard(user);
    window.__linkupDashboardRendered = true;
  } catch (error) {
    console.error('Dashboard render error:', error);
    showDashboardShell(user);
    try {
      showDashboardHome();
    } catch (homeError) {
      console.error('Dashboard home render error:', homeError);
    }
  }
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

async function loadConductRecord() {
  const container = document.getElementById('conduct-strikes-list');
  if (!container) return;
  container.innerHTML = '<p class="profile-loading">Loading…</p>';
  try {
    const data = await fetchJson('/api/me/conduct');
    const { strikes, strikeTotal, strikeBanThreshold, banned } = data;
    if (banned) {
      container.innerHTML = `<div class="conduct-banned-notice">Your account has been permanently banned due to accumulated conduct violations. Contact <a href="mailto:ridewlinkup@gmail.com">ridewlinkup@gmail.com</a> if you believe this is an error.</div>`;
      return;
    }
    const remaining = Math.max(0, strikeBanThreshold - strikeTotal);
    const levelLabels = { 1: 'Level 1 — Minor', 2: 'Level 2 — Serious', 3: 'Level 3 — Severe' };
    const statusHtml = strikeTotal === 0
      ? `<div class="conduct-clean"><span class="conduct-clean-icon">✓</span><span>No strikes on your account.</span></div>`
      : `<div class="conduct-warning"><strong>${strikeTotal} strike point${strikeTotal !== 1 ? 's' : ''}</strong> — ${remaining} more point${remaining !== 1 ? 's' : ''} until permanent ban.</div>`;
    const strikeItems = strikes.map((s) => `
      <div class="conduct-strike-item conduct-strike-item--level${s.level}">
        <div class="conduct-strike-meta">
          <span class="conduct-strike-level">${esc(levelLabels[s.level] || 'Level ' + s.level)}</span>
          <span class="conduct-strike-date">${s.issuedAt ? new Date(s.issuedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : ''}</span>
        </div>
        <div class="conduct-strike-category">${esc(s.categoryLabel || s.category)}</div>
        ${s.reason ? `<div class="conduct-strike-reason">${esc(s.reason)}</div>` : ''}
      </div>`).join('');
    container.innerHTML = statusHtml + (strikeItems || '') + `<p class="conduct-footer-note">Strikes are issued by LinkUp moderators. Contact <a href="mailto:ridewlinkup@gmail.com">ridewlinkup@gmail.com</a> to appeal.</p>`;
  } catch (err) {
    container.innerHTML = '<p class="error-inline">Could not load conduct record.</p>';
  }
}

async function loadReleaseNotes() {
  if (!releaseNoteFeed) return;
  try {
    const response = await fetch('release-notes.md', { cache: 'no-store' });
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

document.addEventListener('click', (event) => {
  const policyLegalButton = event.target.closest?.('#policy-terms-button, #policy-privacy-button');
  if (!policyLegalButton) return;
  event.preventDefault();
  event.stopPropagation();
  setPolicyFullView('');
  openLegalModal(policyLegalButton.dataset.legalModal || (policyLegalButton.id === 'policy-privacy-button' ? 'privacy' : 'terms'));
}, true);

async function checkAuth() {
  const authCheckVersion = ++authFlowVersion;
  try {
    currentUser = await fetchJson('/api/auth/me');
    if (authCheckVersion !== authFlowVersion) return;
    applyThemePreference(currentUser.themePreference || getStoredThemePreference() || 'dark');
    enterDashboard(currentUser);
  } catch (error) {
    if (authCheckVersion !== authFlowVersion || currentUser) return;
    const route = getAppRoute();
    if (route === 'privacy' || route === 'terms') showLegalPage(route);
    else showPublicWaitlistPage();
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
  sharedTrackPage?.classList.add('hidden');
  cartRideIds = new Set();
  currentUser = null;
  document.body.classList.remove('waitlist-lock-mode');
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
  dashboard.classList.toggle('waitlist-lock-mode', user.serviceApproved !== true);
  document.body.classList.toggle('waitlist-lock-mode', user.serviceApproved !== true);
  headerLeftActions.classList.remove('hidden');
  headerActions.classList.remove('hidden');
  headerLeftActions.classList.toggle('hidden', user.serviceApproved !== true);
  cartButton?.classList.toggle('hidden', user.serviceApproved !== true);
  adminButton?.classList.toggle('hidden', !user.isAdmin);
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
  const showTabs = formId === 'signin-form' || formId === 'signup-form';
  document.querySelector('.auth-tabs')?.classList.toggle('hidden', !showTabs);
  if (formId === 'signin-form') refreshSigninWaitlistReturn();
  else setSigninWaitlistReturnVisible(false);
}

async function loadFriendInviteBanner(inviteCode) {
  if (!inviteAuthBanner || !inviteCode) return;
  try {
    const invite = await fetchJson('/api/invites/' + encodeURIComponent(inviteCode));
    if (inviteAuthName) {
      inviteAuthName.textContent = invite.inviterFirstName || invite.inviterName || 'A LinkUp member';
    }
    inviteAuthBanner.classList.remove('hidden');
  } catch (_) {
    if (inviteAuthName) inviteAuthName.textContent = 'A LinkUp member';
    inviteAuthBanner.classList.remove('hidden');
  }
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

function setSafetyModeStatus(text, active = false) {
  if (!safetyModeStatus) return;
  safetyModeStatus.textContent = text;
  safetyModeStatus.classList.toggle('active', Boolean(active));
}

function hideDashboardPages() {
  hideLegalPages();
  dashboardHome.classList.add('hidden');
  socialPage?.classList.add('hidden');
  browsePage.classList.add('hidden');
  waitlistPage.classList.add('hidden');
  requestRidePage.classList.add('hidden');
  listRidePage.classList.add('hidden');
  cartPage.classList.add('hidden');
  yourRidesPage.classList.add('hidden');
  eatsPage?.classList.add('hidden');
  eatsCheckoutPage?.classList.add('hidden');
  chatPage.classList.add('hidden');
  paymentPage.classList.add('hidden');
  leaderboardPage.classList.add('hidden');
  adminPage?.classList.add('hidden');
  publicProfilePage.classList.add('hidden');
  profilePage.classList.add('hidden');
}


function updateNavProfileAvatar(user) {
  if (!profileButton) return;
  profileButton.innerHTML = '';
  if (user?.profilePictureDataUrl) {
    const img = document.createElement('img');
    img.src = user.profilePictureDataUrl;
    img.alt = 'Profile';
    img.className = 'nav-profile-avatar';
    profileButton.appendChild(img);
  } else {
    const initials = document.createElement('span');
    initials.className = 'nav-profile-initials';
    initials.textContent = getProfileInitials(user);
    profileButton.appendChild(initials);
  }
}

function updateUserHeader(user) {
  welcomeMessage.textContent = `Welcome, ${getDisplayName(user)}`;
  studentUniversityLabel.textContent = user.rideServicesPaused
    ? 'Ride services temporarily paused'
    : user.serviceApproved ? `${user.university} Ride Network` : 'LinkUp waitlist';
  updateNavProfileAvatar(user);
}

function closeNotificationsPopover() {
  notificationsPopover?.classList.add('hidden');
}

function getLinkupButtonLabel(status) {
  if (status === 'linked') return 'Linked';
  if (status === 'pending_sent') return 'Requested';
  if (status === 'pending_received') return 'Accept';
  return 'LinkUp';
}

function getLinkupButtonTitle(status) {
  if (status === 'linked') return 'You are Links and receive each other\'s ride/request updates';
  if (status === 'pending_sent') return 'Waiting for this student to accept';
  if (status === 'pending_received') return 'Accept this LinkUp request';
  return 'Send a LinkUp request';
}

async function acceptLinkupRequest(userId) {
  if (!userId) return null;
  return fetchJson('/api/users/' + encodeURIComponent(userId) + '/ride-alerts/accept', { method: 'POST' });
}

function renderNotifications(notifications = []) {
  if (!notificationsList) return;
  cachedNotifications = notifications;
  notificationsList.innerHTML = '';
  if (notificationsCount) {
    const unread = Math.max(0, notifications.length - notificationsSeenCount);
    notificationsCount.textContent = unread > 9 ? '9+' : String(unread);
    notificationsCount.classList.toggle('hidden', unread === 0);
  }
  if (notificationsSummary) {
    notificationsSummary.textContent = notifications.length
      ? `${notifications.length} update${notifications.length === 1 ? '' : 's'}`
      : 'Ride and LinkUp updates';
  }
  if (!notifications.length) {
    notificationsList.innerHTML = '<p class="notifications-empty">No notifications yet.</p>';
    return;
  }
  notifications.forEach((item) => {
    const row = document.createElement('article');
    row.className = 'notification-item';
    row.innerHTML = `
      <div class="notification-main">
        <span class="notification-type">${esc(item.typeLabel || 'Update')}</span>
        <strong>${esc(item.title || 'LinkUp update')}</strong>
        <p>${esc(item.body || '')}</p>
        ${item.timeLabel ? `<small>${esc(item.timeLabel)}</small>` : ''}
      </div>
      ${item.action === 'accept-linkup' ? `<button type="button" class="notification-action" data-accept-linkup="${esc(item.userId || '')}">${esc(item.actionLabel || 'Accept')}</button>` : ''}
    `;
    row.querySelector('[data-accept-linkup]')?.addEventListener('click', async (event) => {
      const button = event.currentTarget;
      const userId = button.dataset.acceptLinkup;
      button.disabled = true;
      button.textContent = 'Accepting...';
      try {
        const response = await acceptLinkupRequest(userId);
        showToast(response?.message || 'You are now Linked.', 'success');
        await loadNotifications();
      } catch (err) {
        button.disabled = false;
        button.textContent = item.actionLabel || 'Accept';
        showToast(err.message || 'Unable to accept LinkUp request.', 'error');
      }
    });
    notificationsList.appendChild(row);
  });
}

async function loadNotifications({ silent = false } = {}) {
  if (!notificationsList || !currentUser) return;
  if (notificationsError) {
    notificationsError.textContent = '';
    notificationsError.classList.remove('show');
  }
  if (!silent) notificationsList.innerHTML = '<p class="notifications-empty">Loading notifications...</p>';
  try {
    const data = await fetchJson('/api/notifications');
    renderNotifications(data.notifications || []);
  } catch (err) {
    if (!silent && notificationsError) {
      notificationsError.textContent = err.message || 'Unable to load notifications.';
      notificationsError.classList.add('show');
    }
  }
}

async function toggleNotificationsPopover() {
  if (!currentUser) return;
  if (!notificationsPopover) return;
  if (notificationsPopover.classList.contains('hidden')) {
    notificationsPopover.classList.remove('hidden');
    await loadNotifications();
    notificationsSeenCount = cachedNotifications.length;
    if (notificationsCount) {
      notificationsCount.textContent = '0';
      notificationsCount.classList.add('hidden');
    }
  } else {
    closeNotificationsPopover();
  }
}

function clearProfileMessages() {
  profileMessage.textContent = '';
  profileMessage.classList.remove('show');
  profileError.textContent = '';
  profileError.classList.remove('show');
}

function clearFriendInviteMessages() {
  if (friendInviteMessage) {
    friendInviteMessage.textContent = '';
    friendInviteMessage.classList.remove('show');
  }
  if (friendInviteError) {
    friendInviteError.textContent = '';
    friendInviteError.classList.remove('show');
  }
  if (friendInviteLinkMessage) {
    friendInviteLinkMessage.textContent = '';
    friendInviteLinkMessage.classList.remove('show');
  }
}

function getNotificationPreferences(user = {}) {
  const preferences = user.notificationPreferences || {};
  return {
    weeklyRecapEmail: preferences.weeklyRecapEmail !== false,
    rideAlertEmail: preferences.rideAlertEmail !== false,
  };
}

function clearNotificationPreferenceMessages() {
  if (notificationPreferencesMessage) {
    notificationPreferencesMessage.textContent = '';
    notificationPreferencesMessage.classList.remove('show');
  }
  if (notificationPreferencesError) {
    notificationPreferencesError.textContent = '';
    notificationPreferencesError.classList.remove('show');
  }
}

function fillNotificationPreferencesForm(user = {}) {
  const preferences = getNotificationPreferences(user);
  if (weeklyRecapEmailInput) weeklyRecapEmailInput.checked = preferences.weeklyRecapEmail;
  if (rideAlertEmailInput) rideAlertEmailInput.checked = preferences.rideAlertEmail;
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
  applyThemePreference(user.themePreference || getStoredThemePreference() || 'dark');
  birthdayInput.disabled = Boolean(user.birthday);
  genderInput.disabled = Boolean(user.gender);
  if (profileDisplayName) {
    const name = [user.firstName, user.lastName].filter(Boolean).join(' ');
    profileDisplayName.textContent = name || 'Your Name';
  }
  if (profileDisplayUniversity) profileDisplayUniversity.textContent = user.university || '';
  if (profileDisplayDetails) {
    const parts = [user.major, user.classYear ? `Class of ${user.classYear}` : ''].filter(Boolean);
    profileDisplayDetails.textContent = parts.join(' · ');
  }
  if (profileDisplayJoined && user.createdAt) {
    const joined = new Date(user.createdAt);
    if (!isNaN(joined)) {
      const profileNumberLabel = formatProfileNumberLabel(user);
      profileDisplayJoined.textContent = `Member since ${joined.toLocaleString('default', { month: 'long', year: 'numeric' })}${profileNumberLabel ? ' · ' + profileNumberLabel : ''}`;
    }
  }
  if (friendInviteCount) {
    friendInviteCount.textContent = String(user.friendInviteCount || 0);
  }
  if (friendInviteJoinedCount) {
    friendInviteJoinedCount.textContent = String(user.friendInviteJoinedCount || 0);
  }
  if (friendInviteLink) {
    friendInviteLink.value = user.friendInviteUrl || '';
  }
  fillNotificationPreferencesForm(user);
  refreshRideAudienceControls();
}

function clearSchoolTransferMessages() {
  if (schoolTransferMessage) {
    schoolTransferMessage.textContent = '';
    schoolTransferMessage.classList.remove('show');
  }
  if (schoolTransferError) {
    schoolTransferError.textContent = '';
    schoolTransferError.classList.remove('show');
  }
}

function fillSchoolTransferForm(user = currentUser || {}) {
  if (schoolTransferCurrent) {
    schoolTransferCurrent.textContent = 'Current school: ' + (user.university || user.universityDomain || 'Unknown') + ' · ' + (user.email || '');
  }
  if (schoolTransferEmail && !schoolTransferEmail.value) schoolTransferEmail.value = '';
  if (schoolTransferCollege && !schoolTransferCollege.value) schoolTransferCollege.value = '';
  const pending = user.pendingSchoolTransfer;
  schoolTransferVerifyCard?.classList.toggle('hidden', !pending);
  if (schoolTransferPending) {
    schoolTransferPending.textContent = pending
      ? 'Enter the 6-digit code sent to ' + pending.email + ' for ' + (pending.university || 'your new school') + '.'
      : 'Enter the 6-digit code we sent to your new college email.';
  }
}

function clearAppearanceMessages() {
  appearanceMessage.textContent = '';
  appearanceMessage.classList.remove('show');
  appearanceError.textContent = '';
  appearanceError.classList.remove('show');
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

async function loadPolicyFullDocument(mode) {
  const target = mode === 'terms' ? policyTermsFull : mode === 'privacy' ? policyPrivacyFull : null;
  if (!target || target.dataset.loaded === 'true') return;
  target.innerHTML = '<p class="legal-loading">Loading document...</p>';
  await loadMarkdownDocument(mode === 'privacy' ? 'privacy-notice.md' : 'terms-and-conditions.md', target);
  target.dataset.loaded = 'true';
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
  if (expanded) {
    loadPolicyFullDocument(mode).catch((error) => console.error('Policy document load error:', error));
  }
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
  tabName = getAvailableProfileTab(tabName);
  updateProfileTabAvailability();
  if (!profilePage.classList.contains('hidden')) setAppRoute(profileRouteForTab(tabName));
  profileSidebarButtons.forEach((button) => button.classList.toggle('active', button.dataset.profileTab === tabName));
  profilePanels.forEach((panel) => panel.classList.toggle('hidden', panel.dataset.profilePanel !== tabName));
  if (tabName === 'notifications') fillNotificationPreferencesForm(currentUser || {});
  if (tabName === 'payment') fillDefaultPaymentForm(currentUser || {});
  if (tabName === 'payouts') fillDriverPayoutForm(currentUser || {});
  if (tabName === 'policies') fillPolicyConsentForm(currentUser || {});
  if (tabName === 'school-transfer') fillSchoolTransferForm(currentUser || {});
  if (tabName === 'appearance') applyThemePreference(currentUser?.themePreference || getStoredThemePreference() || 'dark');
  if (tabName === 'security') render2FAPanel(currentUser);
  if (tabName === 'release-notes') loadReleaseNotes();
  if (tabName === 'conduct') loadConductRecord();
  if (tabName === 'feedback') resetFeedbackPanel();
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

let _stripeConnectReady = null;
function awaitStripeConnect() {
  if (_stripeConnectReady) return _stripeConnectReady;
  _stripeConnectReady = new Promise((resolve, reject) => {
    if (window.StripeConnect?.init) {
      resolve();
      return;
    }
    window.StripeConnect = window.StripeConnect || {};
    const prev = window.StripeConnect.onLoad;
    window.StripeConnect.onLoad = () => {
      if (prev) prev();
      resolve();
    };
    setTimeout(() => reject(new Error('Stripe Connect timed out. Please refresh and try again.')), 15000);
  });
  return _stripeConnectReady;
}

async function getStripeConnectInstance() {
  if (stripeConnectInst) return stripeConnectInst;
  await awaitStripeConnect();
  const config = await fetchJson('/api/stripe/config');
  if (!config.publishableKey) throw new Error('Stripe is not configured. Contact support.');
  const inst = StripeConnect.init({
    publishableKey: config.publishableKey,
    fetchClientSecret: async () => {
      const r = await fetch('/api/stripe/account-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Requested-With': 'XMLHttpRequest' },
        credentials: 'same-origin',
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data.error || 'Failed to create Stripe session');
      return data.clientSecret;
    },
    appearance: {
      overlays: 'dialog',
      variables: {
        colorPrimary: '#1f8f8f',
        fontFamily: 'Sora, Inter, system-ui, sans-serif',
        borderRadius: '10px',
      },
    },
  });
  stripeConnectInst = inst;
  return stripeConnectInst;
}

async function mountStripeConnectComponent(componentName) {
  if (!stripeConnectContainer) return;
  stripeConnectContainer.classList.remove('hidden');
  stripeConnectContainer.innerHTML = '<p class="stripe-connect-loading">Loading Stripe…</p>';
  if (payoutError) { payoutError.textContent = ''; payoutError.classList.remove('show'); }

  let inst;
  try {
    inst = await getStripeConnectInstance();
  } catch (err) {
    stripeConnectInst = null;
    stripeConnectContainer.classList.add('hidden');
    stripeConnectContainer.innerHTML = '';
    if (payoutError) {
      payoutError.textContent = err.message || 'Failed to load Stripe. Please try again.';
      payoutError.classList.add('show');
    }
    return;
  }

  try {
    stripeConnectContainer.innerHTML = '';
    const component = inst.create(componentName);
    if (typeof component.setOnLoadError === 'function') {
      component.setOnLoadError((e) => {
        stripeConnectInst = null;
        stripeConnectContainer.classList.add('hidden');
        stripeConnectContainer.innerHTML = '';
        if (payoutError) {
          payoutError.textContent = (e && e.error && e.error.message) || 'Stripe failed to load. Please try again.';
          payoutError.classList.add('show');
        }
      });
    }
    if (componentName === 'account-onboarding') {
      component.setOnExit(async () => {
        stripeConnectContainer.classList.add('hidden');
        stripeConnectContainer.innerHTML = '';
        try {
          currentUser = await fetchJson('/api/profile/payout/status', { method: 'POST' });
          fillDriverPayoutForm(currentUser);
        } catch (_) {}
      });
    }
    stripeConnectContainer.appendChild(component);
  } catch (err) {
    stripeConnectInst = null;
    stripeConnectContainer.classList.add('hidden');
    stripeConnectContainer.innerHTML = '';
    if (payoutError) {
      payoutError.textContent = err.message || 'Failed to load Stripe component. Please try again.';
      payoutError.classList.add('show');
    }
  }
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
  if (activeEmbeddedCheckout) {
    try { activeEmbeddedCheckout.destroy(); } catch (_) {}
    activeEmbeddedCheckout = null;
  }
  if (embeddedCheckoutContainer) {
    embeddedCheckoutContainer.innerHTML = '';
    embeddedCheckoutContainer.classList.add('hidden');
  }
  destroyStripePaymentElements();
  destroyStripeSetupElements();
}

async function mountEmbeddedCheckout(clientSecret) {
  if (!clientSecret) throw new Error('Stripe payment could not be started.');
  if (!embeddedCheckoutContainer) throw new Error('Stripe payment container is missing.');
  destroyEmbeddedCheckout();
  const stripe = await getStripeInstance();
  activeEmbeddedCheckout = await stripe.initEmbeddedCheckout({ clientSecret });
  embeddedCheckoutContainer.classList.remove('hidden');
  activeEmbeddedCheckout.mount(embeddedCheckoutContainer);
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
  const provider = user?.payoutProvider || 'stripe';

  stripePayoutConnectButton?.classList.add('hidden');
  stripePayoutRefreshButton?.classList.add('hidden');
  stripePayoutHistoryButton?.classList.add('hidden');
  if (stripeConnectContainer) {
    stripeConnectContainer.classList.add('hidden');
    stripeConnectContainer.innerHTML = '';
  }

  const bankStep = document.getElementById('payout-flow-bank');

  if (provider !== 'stripe') {
    stripePayoutSummary.className = 'payout-stripe-status payout-stripe-status--warn';
    stripePayoutSummary.textContent = `Bank payouts via ${user?.payoutProviderLabel || provider} are not yet supported.`;
    return;
  }

  if (!stripeInfo?.accountId) {
    stripePayoutSummary.className = 'payout-stripe-status payout-stripe-status--idle';
    stripePayoutSummary.textContent = 'Not connected — set up Stripe to receive weekly bank transfers.';
    if (stripePayoutConnectButton) {
      stripePayoutConnectButton.textContent = 'Set up bank payouts';
      stripePayoutConnectButton.classList.remove('hidden');
    }
    return;
  }

  if (stripeInfo.payoutsEnabled) {
    stripePayoutSummary.className = 'payout-stripe-status payout-stripe-status--active';
    stripePayoutSummary.textContent = 'Active — wallet balance transfers to your bank every week.';
    stripePayoutRefreshButton?.classList.remove('hidden');
    stripePayoutHistoryButton?.classList.remove('hidden');
    if (bankStep) bankStep.classList.add('payout-flow-step--bank-active');
    return;
  }

  if (bankStep) bankStep.classList.remove('payout-flow-step--bank-active');

  if (stripeInfo.detailsSubmitted) {
    stripePayoutSummary.className = 'payout-stripe-status payout-stripe-status--pending';
    stripePayoutSummary.textContent = 'Stripe is verifying your account — payouts begin once approved.';
    stripePayoutRefreshButton?.classList.remove('hidden');
    return;
  }

  stripePayoutSummary.className = 'payout-stripe-status payout-stripe-status--warn';
  stripePayoutSummary.textContent = 'Setup incomplete — finish onboarding to activate weekly bank transfers.';
  if (stripePayoutConnectButton) {
    stripePayoutConnectButton.textContent = 'Continue setup';
    stripePayoutConnectButton.classList.remove('hidden');
  }
  stripePayoutRefreshButton?.classList.remove('hidden');
}

function calcDriverNetCents(grossCents, commissionRate, feeRate, feeFixed) {
  const commission = Math.round(grossCents * commissionRate);
  const stripeFee = Math.round(grossCents * feeRate) + feeFixed;
  return { commission, stripeFee, net: Math.max(0, grossCents - commission - stripeFee) };
}

function renderDriverWalletSummary(user) {
  if (!driverWalletSummary) return;
  const wallet = user?.wallet || {};
  const commissionRate = Number(wallet.commissionRate ?? LINKUP_COMMISSION_RATE);
  const feeRate = Number(wallet.stripeFeeRate ?? STRIPE_FEE_RATE);
  const feeFixed = Number(wallet.stripeFeeFixedCents ?? STRIPE_FEE_FIXED_CENTS);
  const commissionPct = Math.round(commissionRate * 100);
  const feePct = (feeRate * 100).toFixed(1);

  const allTime = wallet.allTime || {};
  const thisWeek = wallet.thisWeek || {};
  const pending = wallet.pendingRideCompletion || {};

  // Example calc for a $50 seat
  const ex = calcDriverNetCents(5000, commissionRate, feeRate, feeFixed);

  driverWalletSummary.innerHTML = `
    <div class="wallet-card wallet-card-primary">
      <span>Wallet balance</span>
      <strong>${formatCents(wallet.availableCents || 0)}</strong>
      <small>Spendable now on rides. Connect Stripe to cash out to your bank.</small>
    </div>
    <div class="wallet-card">
      <span>Pending — awaiting ride end</span>
      <strong>${formatCents(pending.netCents || 0)}</strong>
      <small>Unlocks automatically after your trip completes.</small>
    </div>
    <div class="wallet-card">
      <span>This week — gross collected</span>
      <strong>${formatCents(thisWeek.grossCents || 0)}</strong>
      <small>You keep ${formatCents(thisWeek.netCents || 0)} after ${formatCents(thisWeek.commissionCents || 0)} commission + ${formatCents(thisWeek.stripeFeesCents || 0)} Stripe fee.</small>
    </div>
    <div class="wallet-card">
      <span>All-time earnings</span>
      <strong>${formatCents(allTime.netCents || 0)}</strong>
      <small>${allTime.paidSeatCount || 0} paid ${allTime.paidSeatCount === 1 ? 'seat' : 'seats'} — ${formatCents(allTime.grossCents || 0)} gross, ${formatCents(allTime.commissionCents || 0)} commission, ${formatCents(allTime.stripeFeesCents || 0)} Stripe fees.</small>
    </div>
    <div class="wallet-card wallet-card-wide wallet-estimator">
      <span>Earnings estimator</span>
      <div class="wallet-estimator-row">
        <span class="wallet-estimator-label">Seat price $</span>
        <input type="number" class="wallet-estimator-input" id="wallet-est-input" min="1" max="9999" step="1" value="50" aria-label="Seat price in dollars" />
      </div>
      <div class="wallet-estimator-breakdown" id="wallet-est-breakdown">
        <div class="wallet-est-row"><span>Gross (rider pays)</span><strong id="est-gross">${formatCents(5000)}</strong></div>
        <div class="wallet-est-row wallet-est-deduct"><span>LinkUp commission (${commissionPct}%)</span><strong id="est-commission">−${formatCents(ex.commission)}</strong></div>
        <div class="wallet-est-row wallet-est-deduct"><span>Stripe processing (${feePct}% + $${(feeFixed / 100).toFixed(2)})</span><strong id="est-stripefee">−${formatCents(ex.stripeFee)}</strong></div>
        <div class="wallet-est-row wallet-est-net"><span>You receive</span><strong id="est-net">${formatCents(ex.net)}</strong></div>
      </div>
    </div>
  `;

  const input = document.getElementById('wallet-est-input');
  if (input) {
    input.addEventListener('input', () => {
      const gross = Math.round(Math.max(0, parseFloat(input.value) || 0) * 100);
      const calc = calcDriverNetCents(gross, commissionRate, feeRate, feeFixed);
      const set = (id, val, prefix = '') => {
        const el = document.getElementById(id);
        if (el) el.textContent = prefix + formatCents(val);
      };
      set('est-gross', gross);
      set('est-commission', calc.commission, '−');
      set('est-stripefee', calc.stripeFee, '−');
      set('est-net', calc.net);
    });
  }
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

function renderLeaderboardRows(items, chartElement, valueLabel, valueFormatter, options = {}) {
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
    const rowClassName = typeof options.rowClassName === 'function' ? options.rowClassName(item) : '';
    if (rowClassName) row.classList.add(rowClassName);

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

    const segments = typeof options.segments === 'function' ? options.segments(item) : null;
    if (segments && segments.length) {
      bar.classList.add('leaderboard-bar-segmented');
      bar.innerHTML = '';
      segments.forEach((segment) => {
        const segmentEl = document.createElement('span');
        segmentEl.className = 'leaderboard-bar-segment leaderboard-bar-segment-' + segment.type;
        segmentEl.style.width = Math.max(0, Math.min(100, Number(segment.percent) || 0)) + '%';
        bar.appendChild(segmentEl);
      });
    }

    track.appendChild(bar);

    const meta = document.createElement('div');
    meta.className = 'leaderboard-meta';
    const schoolLocation = item.location || [item.city, item.state].filter(Boolean).join(', ');
    const extraMeta = typeof options.extraMeta === 'function' ? options.extraMeta(item) : '';
    meta.textContent = [schoolLocation, item.domain, item.needsReview ? 'Needs review' : '', item.serviceApproved ? 'Service active' : 'Waitlist', extraMeta].filter(Boolean).join(' - ');

    content.append(header, track, meta);
    row.append(rank, content);
    chartElement.appendChild(row);
  });
}

function getWaitlistIntentSegments(school) {
  const total = Number(school.userCount) || 0;
  if (!total) return [];
  const counts = {
    rider: Number(school.riderCount) || 0,
    driver: Number(school.driverCount) || 0,
    unsure: Number(school.unsureCount) || 0,
  };
  return ['rider', 'driver', 'unsure']
    .map((type) => ({ type, percent: (counts[type] / total) * 100 }))
    .filter((segment) => segment.percent > 0);
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

function renderWaitlistLeaderboard(data) {
  if (!waitlistLeaderboardChart || !waitlistLeaderboardSummary || !waitlistLeaderboardCount) return;
  const schools = data.schools || [];
  const currentSchoolDomain = String(currentUser?.universityDomain || '').toLowerCase();
  waitlistLeaderboardChart.innerHTML = '';
  waitlistLeaderboardCount.textContent = (data.totalUsers || 0) + ' student' + ((data.totalUsers || 0) === 1 ? '' : 's');
  const waitlistHeroCount = document.getElementById('waitlist-hero-count');
  if (waitlistHeroCount) {
    waitlistHeroCount.textContent = data.totalUsers
      ? 'Join ' + data.totalUsers + ' student' + (data.totalUsers === 1 ? '' : 's') + (schools.length > 1 ? ' across ' + schools.length + ' schools' : '') + ' already on the waitlist'
      : 'Be one of the first students on the waitlist';
  }
  waitlistLeaderboardSummary.textContent = schools.length
    ? `${data.totalUsers} waitlisted student${data.totalUsers === 1 ? '' : 's'} across ${schools.length} school${schools.length === 1 ? '' : 's'}.`
    : 'You are one of the first students on the waitlist.';
  renderLeaderboardRows(schools, waitlistLeaderboardChart, 'userCount', (school) => school.userCount + ' student' + (school.userCount === 1 ? '' : 's'), {
    rowClassName: (school) => String(school.domain || '').toLowerCase() === currentSchoolDomain ? 'current-school' : '',
    extraMeta: (school) => String(school.domain || '').toLowerCase() === currentSchoolDomain ? 'Your school' : '',
    segments: getWaitlistIntentSegments,
  });

  const WAITLIST_LEADERBOARD_COLLAPSED_ROWS = 5;
  const leaderboardToggle = document.getElementById('waitlist-leaderboard-toggle');
  if (leaderboardToggle) {
    const collapsible = schools.length > WAITLIST_LEADERBOARD_COLLAPSED_ROWS;
    leaderboardToggle.classList.toggle('hidden', !collapsible);
    waitlistLeaderboardChart.classList.toggle('collapsed', collapsible);
    leaderboardToggle.setAttribute('aria-expanded', 'false');
    leaderboardToggle.textContent = 'Show all ' + schools.length + ' schools';
    leaderboardToggle.onclick = () => {
      const expand = waitlistLeaderboardChart.classList.contains('collapsed');
      waitlistLeaderboardChart.classList.toggle('collapsed', !expand);
      leaderboardToggle.setAttribute('aria-expanded', String(expand));
      leaderboardToggle.textContent = expand ? 'Show less' : 'Show all ' + schools.length + ' schools';
    };
  }

  if (waitlistLeaderboardReview) {
    const reviewDomains = (data.needsReviewSchools || []).slice(0, 3).map((school) => school.domain).filter(Boolean);
    waitlistLeaderboardReview.textContent = reviewDomains.length
      ? 'School domain pending review: ' + reviewDomains.join(', ')
      : '';
  }
}

async function loadWaitlistLeaderboard() {
  if (!waitlistLeaderboardChart || !waitlistLeaderboardSummary || !waitlistLeaderboardCount) return;
  waitlistLeaderboardSummary.textContent = 'Loading schools...';
  waitlistLeaderboardCount.textContent = 'Loading...';
  waitlistLeaderboardChart.innerHTML = '';
  if (waitlistLeaderboardReview) waitlistLeaderboardReview.textContent = '';
  try {
    const data = await fetchJson('/api/leaderboard/waitlist-schools');
    renderWaitlistLeaderboard(data);
  } catch (err) {
    waitlistLeaderboardSummary.textContent = err.message || 'Unable to load waitlist leaderboard.';
    waitlistLeaderboardCount.textContent = '--';
  }
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
  setActiveNavButton('leaderboard-button');
  clearCartMessages();
  hideDashboardPages();
  leaderboardPage.classList.remove('hidden');
  loadLeaderboard();
}

function clearAdminMessages() {
  if (adminMessage) {
    adminMessage.textContent = '';
    adminMessage.classList.remove('show');
  }
  if (adminError) {
    adminError.textContent = '';
    adminError.classList.remove('show');
  }
}

function showAdminMessage(message, type = 'success') {
  const target = type === 'error' ? adminError : adminMessage;
  if (!target) return;
  target.textContent = message;
  target.classList.add('show');
}

function renderAdminMetrics(data) {
  if (!adminMetrics) return;
  const metrics = data.metrics || {};
  const topSchool = (data.schoolSignups || [])[0];
  const items = [
    ['Users', metrics.users],
    ['Approved', metrics.serviceApprovedUsers],
    ['Waitlist', metrics.waitlistedUsers],
    ['Top school', topSchool ? `${topSchool.waitlistedUsers} waitlist` : 0],
    ['Suspended', metrics.suspendedUsers],
    ['Rides', metrics.rides],
    ['Requests', metrics.rideRequests],
    ['Open reports', metrics.openReports],
  ];
  adminMetrics.innerHTML = items.map(([label, value]) => `
    <div class="admin-metric">
      <strong>${esc(value ?? 0)}</strong>
      <span>${esc(label)}</span>
    </div>
  `).join('');
}

function adminCell(value) {
  const text = value === undefined || value === null || value === '' ? '-' : String(value);
  return `<td>${esc(text)}</td>`;
}

function formatAdminDetails(details = {}) {
  if (!details || typeof details !== 'object') return '-';
  const parts = Object.entries(details)
    .filter(([, value]) => value !== undefined && value !== null && value !== '')
    .map(([key, value]) => `${key}: ${String(value)}`);
  return parts.length ? parts.join(' - ') : '-';
}

function renderAdminTable() {
  if (!adminTableWrap || !adminSnapshot) return;
  adminTabs.forEach((tab) => tab.classList.toggle('active', tab.dataset.adminTab === adminView));
  if (adminView === 'reports') {
    const schoolRows = (adminSnapshot.schoolSignups || []).slice(0, 20).map((school, index) => `
      <tr>
        ${adminCell(index + 1)}
        ${adminCell(school.school)}
        ${adminCell(school.domain)}
        ${adminCell(school.totalUsers)}
        ${adminCell(school.waitlistedUsers)}
        ${adminCell(school.approvedUsers)}
        ${adminCell(school.needsReview ? 'Needs review' : 'Known')}
        ${adminCell(`${school.riderIntent || 0} rider / ${school.driverIntent || 0} driver / ${school.unsureIntent || 0} unsure`)}
      </tr>
    `).join('');
    const rows = (adminSnapshot.reports || []).map((report) => `
      <tr>
        ${adminCell(report.status)}
        ${adminCell(report.type === 'safety_incident' ? 'Safety Mode' : 'Report')}
        ${adminCell(report.reason)}
        ${adminCell([report.details, report.safetyRecordingId ? 'Safety recording: ' + report.safetyRecordingId : ''].filter(Boolean).join('\n'))}
        ${adminCell(report.reportedUserName)}
        ${adminCell(report.reporterName)}
        ${adminCell(report.rideRoute)}
        ${adminCell(formatPublicProfileDate(report.createdAt))}
        <td>
          <select class="admin-report-status" data-report-id="${esc(report.id)}">
            ${['open', 'reviewing', 'resolved', 'dismissed'].map((status) => `<option value="${status}" ${report.status === status ? 'selected' : ''}>${status}</option>`).join('')}
          </select>
          <textarea class="admin-report-note" data-report-id="${esc(report.id)}" rows="2" placeholder="Admin note">${esc(report.adminNote || '')}</textarea>
          <button type="button" class="admin-report-save" data-report-id="${esc(report.id)}">Save</button>
        </td>
      </tr>
    `).join('');
    adminTableWrap.innerHTML = `
      <section class="admin-priority-block">
        <div class="admin-priority-header">
          <div>
            <h3>School Signup Priority</h3>
            <p>Sorted by waitlisted students first, then total signups.</p>
          </div>
        </div>
        <table class="admin-table"><thead><tr><th>Rank</th><th>School</th><th>Email domain</th><th>Students</th><th>Waitlist</th><th>Approved</th><th>Record</th><th>Intent</th></tr></thead><tbody>${schoolRows || '<tr><td colspan="8">No school signups yet.</td></tr>'}</tbody></table>
      </section>
      <table class="admin-table"><thead><tr><th>Status</th><th>Type</th><th>Reason</th><th>Details</th><th>Reported</th><th>Reporter</th><th>Ride</th><th>Created</th><th>Update</th></tr></thead><tbody>${rows || '<tr><td colspan="9">No reports yet.</td></tr>'}</tbody></table>
    `;
    return;
  }
  if (adminView === 'users') {
    const strikeCategories = adminSnapshot.strikeCategories || {};
    const strikeBanThreshold = adminSnapshot.strikeBanThreshold || 3;
    const rows = (adminSnapshot.users || []).map((user) => {
      const strikeTotal = user.strikeTotal || 0;
      const strikeBadge = strikeTotal > 0
        ? `<span class="admin-strike-badge admin-strike-badge--${user.bannedByStrikes ? 'banned' : strikeTotal >= strikeBanThreshold - 1 ? 'warn' : 'low'}" title="${strikeTotal} strike point${strikeTotal !== 1 ? 's' : ''}">${strikeTotal}⚠</span>`
        : '';
      const strikesHtml = (user.strikes || []).map((s) => `
        <div class="admin-strike-row">
          <span class="admin-strike-level admin-strike-level--${s.level}">L${s.level}</span>
          <span class="admin-strike-category">${esc(s.categoryLabel || s.category)}</span>
          ${s.reason ? `<span class="admin-strike-reason">${esc(s.reason)}</span>` : ''}
          <span class="admin-strike-date">${s.issuedAt ? new Date(s.issuedAt).toLocaleDateString() : ''}</span>
          <button type="button" class="admin-strike-remove danger" data-user-id="${esc(user.id)}" data-strike-id="${esc(s.id)}">×</button>
        </div>`).join('');
      const catOptions = (level) => (strikeCategories[level] || []).map((c) => `<option value="${esc(c.id)}">${esc(c.label)}</option>`).join('');
      return `
      <tr>
        ${adminCell(formatProfileNumberLabel(user))}
        ${adminCell(user.name + (strikeBadge ? ' ' + strikeBadge : ''))}
        ${adminCell(user.email)}
        ${adminCell(user.university)}
        ${adminCell(user.bannedByStrikes ? 'Banned (strikes)' : user.suspended ? 'Suspended' : user.serviceApproved ? 'Approved' : 'Waitlist')}
        ${adminCell(user.emailVerified ? 'Verified' : 'Unverified')}
        <td>
          <button type="button" class="admin-user-toggle" data-user-id="${esc(user.id)}" data-approved="${user.serviceApproved ? 'false' : 'true'}">${user.serviceApproved ? 'Move to waitlist' : 'Approve'}</button>
          <button type="button" class="admin-eats-toggle" data-user-id="${esc(user.id)}" data-eats-approved="${user.eatsApproved ? 'false' : 'true'}">${user.eatsApproved ? 'Remove Eats' : 'Approve Eats'}</button>
          <button type="button" class="admin-user-suspend danger" data-user-id="${esc(user.id)}" data-suspended="${user.suspended ? 'false' : 'true'}">${user.suspended ? 'Restore' : 'Suspend'}</button>
          <details class="admin-strike-details">
            <summary>Strikes (${strikeTotal})</summary>
            ${strikesHtml || '<p class="admin-strike-empty">No strikes.</p>'}
            <form class="admin-issue-strike-form" data-user-id="${esc(user.id)}">
              <select class="admin-strike-level-select" name="level">
                <option value="1">Level 1 — Minor</option>
                <option value="2">Level 2 — Serious</option>
                <option value="3">Level 3 — Severe (instant ban)</option>
              </select>
              <select class="admin-strike-cat-select" name="category">
                <optgroup label="Level 1 — Minor">${catOptions(1)}</optgroup>
                <optgroup label="Level 2 — Serious">${catOptions(2)}</optgroup>
                <optgroup label="Level 3 — Severe">${catOptions(3)}</optgroup>
              </select>
              <input type="text" name="reason" placeholder="Optional note for user (max 500 chars)" maxlength="500" />
              <button type="submit" class="danger">Issue strike</button>
            </form>
          </details>
          <input class="admin-user-note" data-user-id="${esc(user.id)}" value="${esc(user.moderationNote || '')}" placeholder="Moderation note" />
          <button type="button" class="admin-user-save-note" data-user-id="${esc(user.id)}">Save note</button>
        </td>
      </tr>`;
    }).join('');
    adminTableWrap.innerHTML = `<table class="admin-table"><thead><tr><th>#</th><th>Name</th><th>Email</th><th>University</th><th>Access</th><th>Email</th><th>Action</th></tr></thead><tbody>${rows || '<tr><td colspan="7">No users yet.</td></tr>'}</tbody></table>`;

    adminTableWrap.querySelectorAll('.admin-issue-strike-form').forEach((form) => {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const userId = form.dataset.userId;
        const levelSelect = form.querySelector('[name="level"]');
        const catSelect = form.querySelector('[name="category"]');
        const reasonInput = form.querySelector('[name="reason"]');
        const level = Number(levelSelect?.value || 1);
        const category = catSelect?.value || '';
        const reason = reasonInput?.value.trim() || '';
        try {
          const result = await fetchJson(`/api/admin/users/${userId}/strikes`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ level, category, reason }),
          });
          showAdminMessage(result.autoBanned ? `Strike issued — account permanently banned.` : `Strike issued.`);
          loadAdminData();
        } catch (err) {
          showAdminMessage(err.message || 'Failed to issue strike.', 'error');
        }
      });
    });

    adminTableWrap.querySelectorAll('.admin-strike-remove').forEach((btn) => {
      btn.addEventListener('click', async () => {
        const { userId, strikeId } = btn.dataset;
        if (!confirm('Remove this strike?')) return;
        try {
          await fetchJson(`/api/admin/users/${userId}/strikes/${strikeId}`, { method: 'DELETE' });
          showAdminMessage('Strike removed.');
          loadAdminData();
        } catch (err) {
          showAdminMessage(err.message || 'Failed to remove strike.', 'error');
        }
      });
    });
    return;
  }
  if (adminView === 'rides') {
    const rows = (adminSnapshot.rides || []).map((ride) => `
      <tr>
        ${adminCell(ride.driverName)}
        ${adminCell(ride.origin)}
        ${adminCell(ride.destination)}
        ${adminCell([ride.date, ride.time].filter(Boolean).join(' '))}
        ${adminCell(ride.passengerCount + ' riders')}
        ${adminCell(ride.status)}
        ${adminCell(ride.moderationNote)}
        <td><button type="button" class="admin-remove-ride danger" data-ride-id="${esc(ride.id)}" ${ride.status === 'removed' ? 'disabled' : ''}>Remove</button></td>
      </tr>
    `).join('');
    adminTableWrap.innerHTML = `<table class="admin-table"><thead><tr><th>Driver</th><th>Origin</th><th>Destination</th><th>When</th><th>Passengers</th><th>Status</th><th>Note</th><th>Action</th></tr></thead><tbody>${rows || '<tr><td colspan="8">No rides yet.</td></tr>'}</tbody></table>`;
    return;
  }
  if (adminView === 'activity') {
    const rows = (adminSnapshot.activity || []).map((item) => `
      <tr>
        ${adminCell(item.type)}
        ${adminCell(item.title)}
        ${adminCell(item.detail)}
        ${adminCell(item.status)}
        ${adminCell(formatPublicProfileDate(item.createdAt))}
      </tr>
    `).join('');
    adminTableWrap.innerHTML = `<table class="admin-table"><thead><tr><th>Type</th><th>What</th><th>Detail</th><th>Status</th><th>When</th></tr></thead><tbody>${rows || '<tr><td colspan="5">No activity yet.</td></tr>'}</tbody></table>`;
    return;
  }
  if (adminView === 'recordings') {
    adminTableWrap.innerHTML = '<p style="padding:1rem;color:var(--text-muted)">Loading recordings…</p>';
    fetchJson('/api/admin/safety/recordings').then(({ recordings }) => {
      if (!recordings.length) {
        adminTableWrap.innerHTML = '<p style="padding:1rem;color:var(--text-muted)">No safety recordings on file.</p>';
        return;
      }
      const rows = recordings.map((r) => {
        const durationSec = Math.round((r.durationMs || 0) / 1000);
        const duration = durationSec >= 60 ? Math.floor(durationSec / 60) + 'm ' + (durationSec % 60) + 's' : durationSec + 's';
        const expires = r.expiresAt ? new Date(r.expiresAt).toLocaleDateString() : '—';
        const reportBadge = r.linkedReport
          ? `<span style="color:var(--danger);font-weight:700">⚠ Report filed</span>`
          : '<span style="color:var(--text-muted)">No report</span>';
        return `
          <tr>
            ${adminCell(r.ownerName + '\n' + r.ownerEmail)}
            ${adminCell(r.rideOrigin + ' → ' + r.rideDestination + '\n' + r.rideDate)}
            ${adminCell(duration)}
            ${adminCell(formatPublicProfileDate(r.createdAt))}
            ${adminCell('Expires ' + expires)}
            <td>${reportBadge}</td>
            <td><button type="button" class="admin-load-recording" data-recording-id="${esc(r.id)}" data-mime="${esc(r.mimeType)}">▶ Load &amp; play</button></td>
          </tr>
          <tr class="admin-recording-player-row hidden" id="player-row-${esc(r.id)}">
            <td colspan="7"><audio controls style="width:100%;margin:0.5rem 0" id="audio-${esc(r.id)}"></audio></td>
          </tr>`;
      }).join('');
      adminTableWrap.innerHTML = `<table class="admin-table"><thead><tr><th>User</th><th>Ride</th><th>Duration</th><th>Recorded</th><th>Expires</th><th>Report</th><th>Play</th></tr></thead><tbody>${rows}</tbody></table>`;

      adminTableWrap.querySelectorAll('.admin-load-recording').forEach((btn) => {
        btn.addEventListener('click', async () => {
          const { recordingId, mime } = btn.dataset;
          btn.disabled = true;
          btn.textContent = 'Loading…';
          try {
            const data = await fetchJson(`/api/admin/safety/recordings/${recordingId}`);
            const binary = atob(data.audioBase64);
            const bytes = new Uint8Array(binary.length);
            for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
            const blob = new Blob([bytes], { type: mime || 'audio/webm' });
            const url = URL.createObjectURL(blob);
            const audio = document.getElementById(`audio-${recordingId}`);
            if (audio) { audio.src = url; audio.play(); }
            const playerRow = document.getElementById(`player-row-${recordingId}`);
            if (playerRow) playerRow.classList.remove('hidden');
            btn.textContent = '▶ Playing';
          } catch (err) {
            btn.textContent = 'Error';
            showAdminMessage(err.message || 'Could not load recording.', 'error');
          }
        });
      });
    }).catch(() => {
      adminTableWrap.innerHTML = '<p style="padding:1rem;color:var(--danger)">Failed to load recordings.</p>';
    });
    return;
  }
  if (adminView === 'audit') {
    const rows = (adminSnapshot.auditLog || []).map((entry) => `
      <tr>
        ${adminCell(entry.action)}
        ${adminCell(entry.targetType)}
        ${adminCell(entry.targetLabel)}
        ${adminCell(entry.adminEmail || entry.adminName)}
        ${adminCell(formatAdminDetails(entry.details))}
        ${adminCell(formatPublicProfileDate(entry.createdAt))}
      </tr>
    `).join('');
    adminTableWrap.innerHTML = `<table class="admin-table"><thead><tr><th>Action</th><th>Target</th><th>Record</th><th>Admin</th><th>Details</th><th>When</th></tr></thead><tbody>${rows || '<tr><td colspan="6">No admin actions yet.</td></tr>'}</tbody></table>`;
    return;
  }
  const rows = (adminSnapshot.rideRequests || []).map((request) => `
    <tr>
      ${adminCell(request.riderName)}
      ${adminCell(request.origin)}
      ${adminCell(request.destination)}
      ${adminCell([request.date, request.time].filter(Boolean).join(' '))}
      ${adminCell(request.requestType)}
      ${adminCell(request.offerCount + ' offers')}
      ${adminCell(request.status)}
      ${adminCell(request.moderationNote)}
      <td><button type="button" class="admin-remove-request danger" data-request-id="${esc(request.id)}" ${request.status === 'removed' ? 'disabled' : ''}>Remove</button></td>
    </tr>
  `).join('');
  adminTableWrap.innerHTML = `<table class="admin-table"><thead><tr><th>Rider</th><th>Origin</th><th>Destination</th><th>When</th><th>Type</th><th>Offers</th><th>Status</th><th>Note</th><th>Action</th></tr></thead><tbody>${rows || '<tr><td colspan="9">No requests yet.</td></tr>'}</tbody></table>`;
}

async function loadAdminOverview() {
  if (!adminTableWrap) return;
  clearAdminMessages();
  adminTableWrap.textContent = 'Loading admin dashboard...';
  try {
    adminSnapshot = await fetchJson('/api/admin/overview');
    if (adminVersionSummary) {
      adminVersionSummary.textContent = 'Version ' + (adminSnapshot.version || 'unknown') + ' | ' + (adminSnapshot.environment || 'environment unknown') + (adminSnapshot.rideServicesPaused ? ' | ride services paused' : '');
    }
    renderAdminMetrics(adminSnapshot);
    renderAdminTable();
  } catch (err) {
    adminTableWrap.textContent = '';
    showAdminMessage(err.message || 'Unable to load admin dashboard.', 'error');
  }
}

function showAdminPage() {
  setAppRoute('admin');
  clearCartMessages();
  hideDashboardPages();
  adminPage?.classList.remove('hidden');
  loadAdminOverview();
}

function formatPublicProfileDate(value) {
  if (!value) return 'Recently joined';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Recently joined';
  return date.toLocaleDateString(undefined, { month: 'short', year: 'numeric' });
}

function formatMemberNumber(value) {
  const number = Number(value);
  return Number.isInteger(number) && number > 0 ? '#' + number.toLocaleString() : '';
}

function formatProfileNumberLabel(userOrProfile) {
  const adminNumber = formatMemberNumber(userOrProfile?.adminNumber);
  if (adminNumber) return 'Admin ' + adminNumber;
  const memberNumber = formatMemberNumber(userOrProfile?.memberNumber);
  return memberNumber ? 'Member ' + memberNumber : '';
}

function formatPublicRating(profile) {
  const average = profile?.stats?.driverRatingAverage;
  const count = profile?.stats?.driverRatingCount || 0;
  return average ? average.toFixed(1) + ' / 5 from ' + count + ' rating' + (count === 1 ? '' : 's') : 'No driver ratings yet';
}

function parseCampusGroupInput(value, visibility) {
  const seen = new Set();
  return String(value || '')
    .split(',')
    .map((name) => name.replace(/\s+/g, ' ').trim())
    .filter(Boolean)
    .filter((name) => {
      const key = name.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .slice(0, 8)
    .map((name) => ({ name, visibility }));
}

function parseInterestInput(value) {
  const seen = new Set();
  return String(value || '')
    .split(',')
    .map((interest) => interest.replace(/\s+/g, ' ').trim())
    .filter(Boolean)
    .filter((interest) => {
      const key = interest.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .slice(0, 12);
}

function joinInterestTags(interests) {
  return (interests || []).filter(Boolean).join(', ');
}

function joinCampusGroups(groups, visibility) {
  return (groups || [])
    .filter((group) => group?.visibility === visibility)
    .map((group) => group.name)
    .filter(Boolean)
    .join(', ');
}

function renderCampusGroupTags(groups) {
  const publicGroups = (groups || []).filter((group) => group?.name && group.visibility !== 'private');
  if (!publicGroups.length) return '';
  return `
    <div class="public-profile-tag-block">
      <div class="public-profile-tag-label">Clubs and groups</div>
      <div class="public-profile-groups" aria-label="Clubs and campus groups">
      ${publicGroups.map((group) => `<button type="button" class="public-profile-group-tag" data-group-name="${esc(group.name)}">${esc(group.name)}</button>`).join('')}
      </div>
    </div>
  `;
}

function renderInterestTags(interests) {
  const tags = (interests || []).filter(Boolean);
  if (!tags.length) return '';
  return `
    <div class="public-profile-tag-block">
      <div class="public-profile-tag-label">Interests</div>
      <div class="public-profile-interests" aria-label="Interests">
        ${tags.map((interest) => `<button type="button" class="public-profile-interest-tag" data-interest-tag="${esc(interest)}">${esc(interest)}</button>`).join('')}
      </div>
    </div>
  `;
}

function renderPublicProfileTrustStrip(profile, hasRating, ratingAvg) {
  const items = [
    profile.serviceApproved ? ['Verified student', 'University email approved'] : null,
    profile.sharedContext?.sameSchool ? ['Same campus', profile.university || profile.universityDomain || 'Campus network'] : null,
    profile.sharedContext?.sameMajor ? ['Same major', profile.major] : null,
    profile.sharedContext?.sameYear ? ['Same class', 'Class of ' + profile.classYear] : null,
    hasRating ? ['Driver rating', Number(ratingAvg).toFixed(1) + ' / 5'] : null,
  ].filter(Boolean).slice(0, 4);
  if (!items.length) return '';
  return `
    <div class="public-profile-trust-strip" aria-label="Profile trust signals">
      ${items.map(([label, value]) => `
        <div class="public-profile-trust-pill">
          <span>${esc(label)}</span>
          <strong>${esc(value)}</strong>
        </div>
      `).join('')}
    </div>
  `;
}

function renderPublicProfileSharedContext(profile) {
  const context = profile.sharedContext || {};
  const rows = [];
  if (context.mutualLinkCount > 0) rows.push(`${context.mutualLinkCount} mutual link${context.mutualLinkCount === 1 ? '' : 's'}`);
  (context.groups || []).forEach((group) => rows.push(`Both in ${group}`));
  (context.interests || []).forEach((interest) => rows.push(`Shared interest: ${interest}`));
  if (context.sameSchool && !rows.length) rows.push('Same verified campus network');
  if (!rows.length) return '';
  return `
    <section class="public-profile-section-card">
      <div class="public-profile-section-title">Shared context</div>
      <div class="public-profile-context-list">
        ${rows.slice(0, 5).map((row) => `<span>${esc(row)}</span>`).join('')}
      </div>
    </section>
  `;
}

function renderPublicProfileTagSection(profile) {
  return '';
}

function renderRideAudienceMarkup(item) {
  return '';
}

function getCurrentCampusGroups() {
  const profileGroups = (currentUser?.campusGroups || []).filter((group) => group?.name);
  const directoryGroups = (currentCampusGroups || [])
    .filter((group) => group.membershipStatus === 'active')
    .map((group) => ({ name: group.name, visibility: group.visibility, kind: group.kind || 'group' }));
  const seen = new Set();
  return [...profileGroups, ...directoryGroups].filter((group) => {
    const key = group.name.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function renderRideGroupOptions(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  const groups = getCurrentCampusGroups();
  if (!groups.length) {
    container.innerHTML = '<p class="ride-group-empty">Join or create groups and clubs before posting only to a selected audience.</p>';
    return;
  }
  container.innerHTML = `
    <label class="ride-group-select-label">
      <span>Select groups and clubs</span>
      <select class="ride-group-select" multiple size="${Math.min(6, Math.max(3, groups.length))}" aria-label="Select groups and clubs">
        ${groups.map((group) => {
          const type = group.kind === 'club' ? 'Club' : 'Group';
          const visibility = group.visibility === 'private' ? 'Private' : 'Public';
          return `<option value="${esc(group.name)}">${esc(group.name)} - ${esc(type)} · ${esc(visibility)}</option>`;
        }).join('')}
      </select>
    </label>
    <p class="ride-group-empty">Hold Command on Mac or Control on Windows to select multiple.</p>
  `;
}

function refreshRideAudienceControls() {
  return;
}

function getSelectedRideAudience(prefix) {
  return {
    audienceType: 'school',
    audienceGroups: [],
  };
}

async function requestUserConnection(profile) {
  if (!profile?.id || profile.isCurrentUser) return;
  try {
    const response = await fetchJson('/api/users/' + encodeURIComponent(profile.id) + '/ride-alerts', { method: 'POST' });
    showToast(response.message || 'LinkUp request sent.', 'success');
    await showPublicProfilePage(profile.id);
    await loadNotifications({ silent: true });
  } catch (err) {
    showToast(err.message || 'Unable to send LinkUp request.', 'error');
  }
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

function showUserSearchEmpty(message) {
  if (!userSearchResults) return;
  userSearchResults.innerHTML = `<p class="user-search-empty">${esc(message)}</p>`;
}

function renderUserSearchResults(results) {
  if (!userSearchResults) return;
  userSearchResults.innerHTML = '';
  if (!results.length) {
    showUserSearchEmpty('No matching students found.');
    return;
  }
  results.forEach((user) => {
    const item = document.createElement('article');
    item.className = 'user-search-result';
    const avatar = user.profilePictureDataUrl
      ? `<img src="${esc(user.profilePictureDataUrl)}" alt="${esc(user.name || 'Student')} profile picture" />`
      : `<span>${esc((user.firstName || user.name || 'S').charAt(0).toUpperCase())}</span>`;
    const meta = [
      user.university || user.universityDomain || '',
      user.major || '',
      user.classYear ? 'Class of ' + user.classYear : '',
      user.memberNumber ? 'Member #' + user.memberNumber : '',
    ].filter(Boolean).join(' · ');
    const linkupStatus = user.linkupStatus || (user.rideAlertSubscribed ? 'linked' : 'none');
    const linkupDisabled = linkupStatus === 'linked' || linkupStatus === 'pending_sent';
    item.innerHTML = `
      <button type="button" class="user-search-result-main" data-user-id="${esc(user.id)}">
        <span class="user-search-avatar">${avatar}</span>
        <span class="user-search-copy">
          <strong>${esc(user.name || 'LinkUp member')}</strong>
          <small>${esc(meta || 'Verified LinkUp member')}</small>
        </span>
      </button>
      <button type="button" class="user-search-open${linkupStatus !== 'none' ? ' is-linked' : ''}" data-linkup-user-id="${esc(user.id)}" title="${esc(getLinkupButtonTitle(linkupStatus))}" ${linkupDisabled ? 'disabled' : ''}>
        ${esc(getLinkupButtonLabel(linkupStatus))}
      </button>
    `;
    item.querySelectorAll('[data-user-id]').forEach((button) => {
      button.addEventListener('click', () => {
        closeUserSearchPopover();
        showPublicProfilePage(button.dataset.userId);
      });
    });
    item.querySelector('[data-linkup-user-id]')?.addEventListener('click', async (event) => {
      const button = event.currentTarget;
      button.disabled = true;
      button.textContent = 'Sending...';
      try {
        const response = await fetchJson('/api/users/' + encodeURIComponent(user.id) + '/ride-alerts', { method: 'POST' });
        const nextStatus = response.linkupStatus || 'pending_sent';
        button.textContent = getLinkupButtonLabel(nextStatus);
        button.classList.add('is-linked');
        button.disabled = nextStatus === 'linked' || nextStatus === 'pending_sent';
        showToast(response.message || 'LinkUp request sent.', 'success');
        await loadNotifications({ silent: true });
      } catch (err) {
        button.disabled = false;
        button.textContent = 'LinkUp';
        showToast(err.message || 'Unable to LinkUp with this student.', 'error');
      }
    });
    userSearchResults.appendChild(item);
  });
}

async function searchUsers(query) {
  if (!userSearchError) return;
  const q = String(query || '').trim();
  userSearchError.textContent = '';
  userSearchError.classList.remove('show');
  if (q.length < 2) {
    showUserSearchEmpty('Type at least 2 characters to search.');
    return;
  }
  showUserSearchEmpty('Searching...');
  try {
    const data = await fetchJson('/api/users/search?q=' + encodeURIComponent(q));
    renderUserSearchResults(data.results || []);
  } catch (err) {
    showUserSearchEmpty('Search results will appear here.');
    userSearchError.textContent = err.message || 'Unable to search users.';
    userSearchError.classList.add('show');
  } finally {
    if (userSearchSubmit) userSearchSubmit.disabled = false;
  }
}

function closeUserSearchPopover() {
  userSearchPopover?.classList.add('hidden');
}

function openUserSearchPopover() {
  if (!currentUser) return;
  userSearchPopover?.classList.remove('hidden');
  if (!userSearchInput?.value.trim()) {
    showUserSearchEmpty('Search for a student to view their public profile.');
  }
}

function renderRatingStars(average) {
  if (!average || average <= 0) return '';
  const val = Math.min(5, Math.max(0, Number(average)));
  return Array.from({ length: 5 }, (_, i) => {
    const filled = val >= i + 1;
    const half = !filled && val >= i + 0.5;
    return `<span class="profile-star${filled ? ' profile-star--filled' : half ? ' profile-star--half' : ''}" aria-hidden="true">${filled || half ? '★' : '☆'}</span>`;
  }).join('');
}

function getDriverRatingTone(average) {
  const val = Number(average) || 0;
  if (val >= 4.5) return 'green';
  if (val >= 3.5) return 'yellow';
  return 'red';
}

function renderPublicProfile(profile) {
  const stats = profile.stats || {};
  const ratingAvg = profile?.stats?.driverRatingAverage;
  const ratingCount = profile?.stats?.driverRatingCount || 0;
  const hasRating = ratingAvg && ratingCount > 0;
  const ratingTone = getDriverRatingTone(ratingAvg);
  const academicParts = [
    profile.major,
    profile.classYear ? 'Class of ' + profile.classYear : '',
  ].filter(Boolean);
  const avatarMarkup = profile.profilePictureDataUrl
    ? `<img class="public-profile-avatar-image" src="${esc(profile.profilePictureDataUrl)}" alt="${esc(profile.name || 'Profile')} profile picture" />`
    : esc((profile.firstName || profile.name || 'U').charAt(0).toUpperCase());
  const verifiedBadge = profile.serviceApproved
    ? `<span class="public-profile-verified" aria-label="Verified university network">
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>
        Verified
       </span>`
    : '';
  const memberLabel = formatProfileNumberLabel(profile);
  const heroMeta = [
    profile.university || profile.universityDomain || '',
    academicParts.join(' · '),
    memberLabel,
  ].filter(Boolean);
  const profileDetailSectionList = [
    renderPublicProfileTagSection(profile),
  ].filter(Boolean);
  const profileDetailSections = profileDetailSectionList.join('');
  const linkupStatus = profile.linkupStatus || (profile.rideAlertSubscribed ? 'linked' : 'none');
  const linkupDisabled = linkupStatus === 'linked' || linkupStatus === 'pending_sent';
  const linkCount = Number(profile.linkCount || 0);

  publicProfileTitle.textContent = 'Public profile';
  publicProfileSubtitle.textContent = [profile.university || profile.universityDomain, 'Member since ' + formatPublicProfileDate(profile.memberSince), memberLabel].filter(Boolean).join(' · ');
  publicProfileContent.innerHTML = `
    <div class="public-profile-hero">
      <div class="public-profile-avatar-wrap">
        <div class="public-profile-avatar">${avatarMarkup}</div>
      </div>
      <div class="public-profile-hero-info">
        <div class="public-profile-name-row">
          <h4>${esc(profile.name || 'LinkUp user')}</h4>
          ${verifiedBadge}
        </div>
        <p class="public-profile-university">${esc(heroMeta.join(' · '))}</p>
        ${profile.isCurrentUser ? '' : `
          <div class="public-profile-hero-actions">
            <button id="public-profile-connect-button" type="button" class="primary-action-button" ${linkupDisabled ? 'disabled' : ''}>
              ${esc(getLinkupButtonLabel(linkupStatus))}
            </button>
            <span class="public-profile-link-count"><strong>${esc(String(linkCount))}</strong> Links</span>
            <span class="public-profile-link-status">${esc(getLinkupButtonTitle(linkupStatus))}</span>
          </div>
        `}
      </div>
    </div>

    <div class="public-profile-stats">
      <div class="public-profile-stat">
        <strong>${esc(String(stats.ridesOffered || 0))}</strong>
        <span>Rides offered</span>
      </div>
      <div class="public-profile-stat">
        <strong>${esc(String(stats.ridesDrivenCompleted || 0))}</strong>
        <span>Completed as driver</span>
      </div>
      <div class="public-profile-stat">
        <strong>${esc(String(stats.ridesJoined || 0))}</strong>
        <span>Rides joined</span>
      </div>
      <div class="public-profile-stat">
        <strong>${esc(String(stats.openRideRequests || 0))}</strong>
        <span>Open requests</span>
      </div>
    </div>

    ${profileDetailSections ? `<div class="public-profile-detail-grid${profileDetailSectionList.length === 1 ? ' public-profile-detail-grid--single' : ''}">${profileDetailSections}</div>` : ''}

    ${hasRating ? `
    <div class="public-profile-rating-card public-profile-rating-card--${ratingTone}">
      <div class="rating-card-left">
        <span class="rating-card-label">Driver rating</span>
        <div class="rating-card-stars" aria-label="${esc(Number(ratingAvg).toFixed(1))} out of 5 stars">${renderRatingStars(ratingAvg)}</div>
      </div>
      <div class="rating-card-right">
        <strong class="rating-card-score">${esc(Number(ratingAvg).toFixed(1))}</strong>
        <span class="rating-card-count">${esc(String(ratingCount))} rating${ratingCount === 1 ? '' : 's'}</span>
      </div>
    </div>` : ''}

    ${profile.isCurrentUser ? '' : `
      <div class="public-profile-actions">
        <div>
          <strong>Safety controls</strong>
          <p>${profile.isBlockedByCurrentUser ? 'You blocked this user. Listings and requests are hidden from each other.' : 'Blocking hides your listings and requests from each other.'}</p>
        </div>
        <button id="public-profile-block-button" type="button" class="${profile.isBlockedByCurrentUser ? 'secondary-action-button' : 'block-user-button'}">
          ${profile.isBlockedByCurrentUser ? 'Unblock user' : 'Block user'}
        </button>
      </div>
    `}
  `;
  document.getElementById('public-profile-connect-button')?.addEventListener('click', () => requestUserConnection(profile));
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
  tabName = getAvailableProfileTab(tabName);
  setAppRoute(profileRouteForTab(tabName));
  clearCartMessages();
  clearProfileMessages();
  clearNotificationPreferenceMessages();
  clearPolicyMessages();
  hideDashboardPages();
  fillProfileForm(currentUser || {});
  if (!isWaitlistProfileMode()) {
    fillDefaultPaymentForm(currentUser || {});
    fillDriverPayoutForm(currentUser || {});
  }
  fillPolicyConsentForm(currentUser || {});
  if (tabName === 'security') render2FAPanel(currentUser);
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
  setActiveNavButton(null);
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
  loadDashboardHome();
  loadGoogleMapsAPI().then(() => {
    if (lastTrackingLocation) {
      updateTrackingMap(lastTrackingLocation, lastTrackingLocations, lastTrackingRideRoute);
    }
  }).catch(() => {});
}

function loadDashboardHome() {
  const findBtn = document.getElementById('home-find-ride-btn');
  const listBtn = document.getElementById('home-list-ride-btn');
  if (findBtn) findBtn.onclick = () => showBrowsePage();
  if (listBtn) listBtn.onclick = () => showListRidePage();
  loadDashboardUpcomingRide();
}

function showSocialPage() {
  if (!isSocialPreviewEnabled()) {
    showDashboardHome();
    return;
  }
  if (!ensureServiceAccess()) return;
  setAppRoute('social');
  clearCartMessages();
  hideDashboardPages();
  socialPage?.classList.remove('hidden');
  socialPage?.classList.remove('social-detail-mode');
  if (socialPageTitle) socialPageTitle.textContent = 'Social';
  if (socialPageSubtitle) socialPageSubtitle.textContent = 'Posts from your links, campus discovery, and trusted groups.';
  if (socialBackHomeButton) socialBackHomeButton.textContent = '← Home';
  loadSocialPage();
}

function handleSocialBackButton() {
  if (socialPage?.classList.contains('social-detail-mode')) {
    showSocialPage();
    return;
  }
  returnToBrowseRides();
}

function loadSocialPage() {
  socialDetailSection?.classList.add('hidden');
  socialFeedSection?.classList.remove('hidden');
  document.getElementById('dashboard-discovery-section')?.classList.remove('hidden');
  document.getElementById('dashboard-groups-section')?.classList.remove('hidden');
  setupCampusGroupForms();
  loadSocialHomeFeed();
  loadDashboardPeopleSuggestions();
  loadCampusGroupsPanel();
  loadConnectionRequestsPanel();
}

function showSocialDetailShell(route, title = 'Social', subtitle = 'Campus discovery and trusted groups.') {
  if (!isSocialPreviewEnabled()) {
    showDashboardHome();
    return false;
  }
  if (!ensureServiceAccess()) return false;
  setAppRoute(route);
  clearCartMessages();
  hideDashboardPages();
  socialPage?.classList.remove('hidden');
  socialPage?.classList.add('social-detail-mode');
  if (socialPageTitle) socialPageTitle.textContent = title;
  if (socialPageSubtitle) socialPageSubtitle.textContent = subtitle;
  if (socialBackHomeButton) socialBackHomeButton.textContent = '← Social';
  socialFeedSection?.classList.add('hidden');
  document.getElementById('dashboard-discovery-section')?.classList.add('hidden');
  document.getElementById('dashboard-groups-section')?.classList.add('hidden');
  socialDetailSection?.classList.remove('hidden');
  return true;
}

async function loadSocialHomeFeed() {
  if (!socialHomeFeed) return;
  socialHomeFeed.textContent = 'Loading posts...';
  try {
    const data = await fetchJson('/api/social/feed');
    const posts = data.posts || [];
    if (!posts.length) {
      socialHomeFeed.innerHTML = `
        <div class="social-feed-empty">
          <strong>No posts from your links yet.</strong>
          <span>LinkUp with classmates or join campus groups to start seeing updates here.</span>
        </div>
      `;
      return;
    }
    socialHomeFeed.innerHTML = posts.map((post) => {
      const avatar = post.authorProfilePictureDataUrl
        ? `<img src="${esc(post.authorProfilePictureDataUrl)}" alt="${esc(post.authorName || 'Member')} profile picture" />`
        : `<span>${esc((post.authorFirstName || post.authorName || 'S').charAt(0).toUpperCase())}</span>`;
      return `
        <article class="social-feed-card">
          <div class="social-feed-card-head">
            <button type="button" class="social-feed-avatar user-profile-link" data-user-id="${esc(post.authorId)}">${avatar}</button>
            <div>
              <button type="button" class="user-profile-link social-feed-author" data-user-id="${esc(post.authorId)}">${esc(post.authorName || 'Member')}</button>
              <p>${esc(post.groupName || 'Campus')} · ${esc(formatPublicProfileDate(post.createdAt))}</p>
            </div>
          </div>
          <p class="social-feed-text">${esc(post.text)}</p>
          <div class="social-feed-actions">
            <button type="button" data-group-name="${esc(post.groupName || '')}">View group</button>
          </div>
        </article>
      `;
    }).join('');
    socialHomeFeed.querySelectorAll('[data-group-name]').forEach((button) => {
      button.addEventListener('click', () => showGroupWelcomePage(button.dataset.groupName));
    });
  } catch (err) {
    socialHomeFeed.innerHTML = `<div class="social-feed-empty"><strong>Unable to load posts.</strong><span>${esc(err.message || 'Try again later.')}</span></div>`;
  }
}

async function showInterestTagPage(tag) {
  const cleanTag = String(tag || '').trim();
  if (!cleanTag || !showSocialDetailShell(interestTagRoute(cleanTag), cleanTag, 'Posts and group updates tagged with this interest.')) return;
  socialDetailSection.innerHTML = `
    <div class="social-detail-feed">Loading tagged posts...</div>
  `;
  try {
    const data = await fetchJson('/api/interests/' + encodeURIComponent(cleanTag) + '/posts');
    const feed = socialDetailSection.querySelector('.social-detail-feed');
    const posts = data.posts || [];
    feed.innerHTML = posts.length ? posts.map((post) => `
      <article class="social-post-card">
        <div>
          <strong>${esc(post.authorName || 'Member')}</strong>
          <span>${esc(post.groupName || 'Campus')}</span>
        </div>
        <p>${esc(post.text)}</p>
      </article>
    `).join('') : '<div class="dashboard-discovery-empty">No posts with this tag yet.</div>';
  } catch (err) {
    socialDetailSection.querySelector('.social-detail-feed').innerHTML = `<div class="dashboard-discovery-empty">${esc(err.message || 'Unable to load tagged posts.')}</div>`;
  }
}

async function showGroupWelcomePage(groupName) {
  const cleanName = String(groupName || '').trim();
  if (!cleanName || !showSocialDetailShell(groupWelcomeRoute(cleanName), cleanName, 'Club profile, announcements, events, members, and chat.')) return;
  socialDetailSection.innerHTML = `
    <div class="social-group-welcome">Loading group...</div>
  `;
  try {
    const group = await fetchJson('/api/groups/lookup?name=' + encodeURIComponent(cleanName));
    if (socialPageTitle) socialPageTitle.textContent = group.name || cleanName;
    if (socialPageSubtitle) socialPageSubtitle.textContent = group.kind === 'club'
      ? 'Club profile, announcements, events, members, and chat.'
      : 'Group profile, announcements, members, and campus rides.';
    renderGroupWelcome(group);
  } catch (err) {
    socialDetailSection.querySelector('.social-group-welcome').innerHTML = `<div class="dashboard-discovery-empty">${esc(err.message || 'This group does not have a welcome page yet.')}</div>`;
  }
}

function renderGroupWelcome(group) {
  const joined = group.membershipStatus === 'active';
  const pending = group.membershipStatus === 'pending';
  const isClub = group.kind === 'club';
  const description = group.description || (isClub ? 'An official campus club with events, officers, and member approval.' : 'An open campus group for students with shared interests.');
  const logoInitials = (group.name || 'LU')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join('') || 'LU';
  const logoMarkup = group.logoDataUrl
    ? `<img class="club-logo-image" src="${esc(group.logoDataUrl)}" alt="${esc(group.name || 'Club')} logo" />`
    : esc(logoInitials);
  const bannerMarkup = group.bannerDataUrl
    ? `<img class="club-cover-image" src="${esc(group.bannerDataUrl)}" alt="${esc(group.name || 'Club')} banner" />`
    : '';
  const memberList = (group.members || []).map((member) => {
    const avatar = member.profilePictureDataUrl
      ? `<img src="${esc(member.profilePictureDataUrl)}" alt="${esc(member.name)} profile picture" />`
      : `<span>${esc((member.firstName || member.name || 'M').charAt(0).toUpperCase())}</span>`;
    return `
      <article class="club-member-card">
        <button type="button" class="club-member-avatar user-profile-link" data-user-id="${esc(member.id)}">${avatar}</button>
        <div>
          <button type="button" class="user-profile-link club-member-name" data-user-id="${esc(member.id)}">${esc(member.name)}</button>
          <p>${esc(member.boardPosition || (member.role === 'owner' ? 'President' : member.role === 'admin' ? 'Board member' : 'Member'))}</p>
          <span>${esc([member.major, member.classYear ? 'Class of ' + member.classYear : ''].filter(Boolean).join(' · '))}</span>
        </div>
        ${group.canRemoveMembers && member.role !== 'owner' && member.id !== currentUser?.id ? `<button type="button" class="club-member-remove" data-remove-member="${esc(member.id)}">Remove</button>` : ''}
      </article>
    `;
  }).join('');
  const eventList = (group.events || []).map((event) => `
    <article class="club-event-card">
      <time datetime="${esc(event.date)}">${esc(new Date(event.date + 'T00:00:00').toLocaleDateString([], { month: 'short', day: 'numeric' }))}</time>
      <div>
        <h5>${esc(event.title)}</h5>
        <p>${esc([event.time, event.location].filter(Boolean).join(' · ') || 'Details coming soon')}</p>
        ${event.description ? `<span>${esc(event.description)}</span>` : ''}
      </div>
    </article>
  `).join('');
  const announcementMarkup = joined && group.posts?.length ? group.posts.map((post) => `
    <article class="social-post-card">
      <div><strong>${esc(post.authorName || 'Member')}</strong><span>Announcement</span></div>
      <p>${esc(post.text)}</p>
    </article>
  `).join('') : `<div class="dashboard-discovery-empty">${joined ? 'No announcements yet.' : 'Join this ' + (isClub ? 'club' : 'group') + ' to see announcements and private ride posts.'}</div>`;
  socialDetailSection.querySelector('.social-group-welcome').innerHTML = `
    <article class="club-profile-hero">
      <div class="club-cover">${bannerMarkup}</div>
      <div class="club-profile-main">
        <div class="club-logo">${logoMarkup}</div>
        <div class="club-profile-copy">
          <span class="social-group-kicker">${esc(isClub ? 'Official club' : 'Open group')} · ${esc(group.visibility || 'public')} · ${esc(String(group.memberCount || 0))} member${group.memberCount === 1 ? '' : 's'}</span>
          <p>${esc(description)}</p>
          ${isClub && group.canManageBoard ? `
            <div class="club-identity-actions" aria-label="Club identity controls">
              <button type="button" data-club-logo-button>Change logo</button>
              <button type="button" data-club-banner-button>Change banner</button>
              <input type="file" class="hidden" data-club-logo-input accept="image/png,image/jpeg,image/webp" />
              <input type="file" class="hidden" data-club-banner-input accept="image/png,image/jpeg,image/webp" />
            </div>
          ` : ''}
        </div>
        <div class="club-profile-action">
          ${joined ? '<span class="social-group-status">Member</span>' : pending ? '<span class="social-group-status">Waiting for board approval</span>' : '<button type="button" class="primary-action-button" data-request-group-join>Request to join</button>'}
        </div>
      </div>
    </article>
    <div class="club-profile-tabs" role="tablist" aria-label="${esc(group.name || 'Club')} sections">
      <button type="button" class="active" data-club-tab="announcements">Announcements</button>
      <button type="button" data-club-tab="events">Events</button>
      <button type="button" data-club-tab="members">Members</button>
      <button type="button" data-club-tab="chat">Chat</button>
    </div>
    <div class="club-tab-panels">
      <section class="club-tab-panel" data-club-panel="announcements">
        <div class="club-page-panel-head">
          <h4>Announcements</h4>
          <span>${esc(String((group.posts || []).length))} posts</span>
        </div>
        <div class="social-detail-feed">${announcementMarkup}</div>
      </section>
      <section class="club-tab-panel hidden" data-club-panel="events">
        <div class="club-page-panel-head">
          <h4>Events</h4>
          <span>${esc(String((group.events || []).length))} upcoming</span>
        </div>
        ${isClub && group.canManageEvents ? `
          <form class="club-event-form">
            <input type="text" name="title" maxlength="80" placeholder="Event title" required />
            <input type="date" name="date" required />
            <input type="text" name="time" maxlength="12" placeholder="Time" />
            <input type="text" name="location" maxlength="100" placeholder="Location" />
            <button type="submit">Add event</button>
          </form>
        ` : ''}
        <div class="club-event-list">${eventList || '<p class="dashboard-discovery-empty">No upcoming events yet.</p>'}</div>
      </section>
      <section class="club-tab-panel hidden" data-club-panel="members">
        <div class="club-page-panel-head">
          <h4>Members</h4>
          <span>${esc(String(group.memberCount || 0))} total</span>
        </div>
        ${isClub && group.canManageBoard ? `
          <form class="club-position-form">
            <p class="club-position-note">President and vice president can assign board titles and clearance.</p>
            <select name="userId" aria-label="Member">
              ${(group.members || []).map((member) => `<option value="${esc(member.id)}">${esc(member.name)}</option>`).join('')}
            </select>
            <input type="text" name="boardPosition" maxlength="60" placeholder="Board position, e.g. Treasurer" />
            <label><input type="checkbox" name="approveMembers" /> Approve</label>
            <label><input type="checkbox" name="manageEvents" /> Events</label>
            <label><input type="checkbox" name="removeMembers" /> Remove</label>
            <button type="submit">Save title</button>
          </form>
        ` : ''}
        <div class="club-member-list">${memberList || '<p class="dashboard-discovery-empty">Members appear after approval.</p>'}</div>
      </section>
      <section class="club-tab-panel hidden" data-club-panel="chat">
        ${isClub ? `
          <div class="club-chat-panel">
            <div class="club-page-panel-head">
              <h4>Club chat</h4>
              <span>${joined ? 'Members only' : 'Join to chat'}</span>
            </div>
            ${joined ? `
              <div class="ride-chat-messages club-chat-messages" data-club-chat-messages>Loading club chat...</div>
              <form class="ride-chat-form club-chat-form">
                <input type="text" maxlength="500" placeholder="Message the club..." />
                <button type="submit">Send</button>
              </form>
              <div class="error-message" data-club-chat-error></div>
            ` : '<div class="dashboard-discovery-empty">Approved club members can use club chat.</div>'}
          </div>
        ` : '<div class="dashboard-discovery-empty">Chat is available inside official clubs.</div>'}
      </section>
    </div>
  `;
  socialDetailSection.querySelectorAll('[data-club-tab]').forEach((button) => {
    button.addEventListener('click', () => {
      const tab = button.dataset.clubTab;
      socialDetailSection.querySelectorAll('[data-club-tab]').forEach((item) => item.classList.toggle('active', item === button));
      socialDetailSection.querySelectorAll('[data-club-panel]').forEach((panel) => panel.classList.toggle('hidden', panel.dataset.clubPanel !== tab));
      if (tab === 'chat' && isClub && joined && !button.dataset.loadedChat) {
        setupClubChat(group);
        button.dataset.loadedChat = 'true';
      }
    });
  });
  setupClubIdentityUploads(group);
  socialDetailSection.querySelector('[data-request-group-join]')?.addEventListener('click', async () => {
    try {
      const updated = await fetchJson('/api/groups/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ groupId: group.id }),
      });
      showToast(updated.membershipStatus === 'pending' ? 'Request sent for board approval.' : 'Joined group.', 'success');
      renderGroupWelcome(updated);
    } catch (err) {
      showToast(err.message || 'Unable to request access.', 'error');
    }
  });
  socialDetailSection.querySelector('.club-event-form')?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    try {
      const updated = await fetchJson('/api/groups/' + encodeURIComponent(group.id) + '/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: form.elements.title.value,
          date: form.elements.date.value,
          time: form.elements.time.value,
          location: form.elements.location.value,
        }),
      });
      showToast('Event added.', 'success');
      renderGroupWelcome(updated);
    } catch (err) {
      showToast(err.message || 'Unable to add event.', 'error');
    }
  });
  socialDetailSection.querySelector('.club-position-form')?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    try {
      const updated = await fetchJson('/api/groups/' + encodeURIComponent(group.id) + '/members/' + encodeURIComponent(form.elements.userId.value) + '/position', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          boardPosition: form.elements.boardPosition.value,
          permissions: {
            approveMembers: form.elements.approveMembers.checked,
            manageEvents: form.elements.manageEvents.checked,
            removeMembers: form.elements.removeMembers.checked,
          },
        }),
      });
      showToast('Board position updated.', 'success');
      renderGroupWelcome(updated);
    } catch (err) {
      showToast(err.message || 'Unable to update board position.', 'error');
    }
  });
  const positionForm = socialDetailSection.querySelector('.club-position-form');
  if (positionForm) {
    const applyMemberPermissionFields = () => {
      const member = (group.members || []).find((entry) => entry.id === positionForm.elements.userId.value);
      positionForm.elements.boardPosition.value = member?.boardPosition || '';
      positionForm.elements.approveMembers.checked = member?.permissions?.approveMembers === true;
      positionForm.elements.manageEvents.checked = member?.permissions?.manageEvents === true;
      positionForm.elements.removeMembers.checked = member?.permissions?.removeMembers === true;
    };
    positionForm.elements.userId.addEventListener('change', applyMemberPermissionFields);
    applyMemberPermissionFields();
  }
  socialDetailSection.querySelectorAll('[data-remove-member]').forEach((button) => {
    button.addEventListener('click', async () => {
      const confirmed = window.confirm('Remove this member from the group?');
      if (!confirmed) return;
      try {
        const updated = await fetchJson('/api/groups/' + encodeURIComponent(group.id) + '/members/' + encodeURIComponent(button.dataset.removeMember), { method: 'DELETE' });
        showToast('Member removed.', 'success');
        renderGroupWelcome(updated);
      } catch (err) {
        showToast(err.message || 'Unable to remove member.', 'error');
      }
    });
  });
}

function readClubIdentityImage(file) {
  const allowedTypes = ['image/png', 'image/jpeg', 'image/webp'];
  return new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error('Choose an image first.'));
      return;
    }
    if (!allowedTypes.includes(file.type)) {
      reject(new Error('Use a PNG, JPG, or WebP image.'));
      return;
    }
    if (file.size > 512 * 1024) {
      reject(new Error('Club images must be 512 KB or smaller.'));
      return;
    }
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ''));
    reader.onerror = () => reject(new Error('Unable to read that image.'));
    reader.readAsDataURL(file);
  });
}

function setupClubIdentityUploads(group) {
  if (!group?.canManageBoard || group.kind !== 'club') return;
  const logoButton = socialDetailSection.querySelector('[data-club-logo-button]');
  const bannerButton = socialDetailSection.querySelector('[data-club-banner-button]');
  const logoInput = socialDetailSection.querySelector('[data-club-logo-input]');
  const bannerInput = socialDetailSection.querySelector('[data-club-banner-input]');

  const uploadIdentityImage = async (input, key, successMessage) => {
    const file = input?.files?.[0];
    try {
      const dataUrl = await readClubIdentityImage(file);
      const updated = await fetchJson('/api/groups/' + encodeURIComponent(group.id) + '/identity', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [key]: dataUrl }),
      });
      showToast(successMessage, 'success');
      renderGroupWelcome(updated);
    } catch (err) {
      showToast(err.message || 'Unable to update club image.', 'error');
      if (input) input.value = '';
    }
  };

  logoButton?.addEventListener('click', () => logoInput?.click());
  bannerButton?.addEventListener('click', () => bannerInput?.click());
  logoInput?.addEventListener('change', () => uploadIdentityImage(logoInput, 'logoDataUrl', 'Club logo updated.'));
  bannerInput?.addEventListener('change', () => uploadIdentityImage(bannerInput, 'bannerDataUrl', 'Club banner updated.'));
}

async function loadClubChatMessages(groupId, listElement, errorElement) {
  listElement.textContent = 'Loading club chat...';
  if (errorElement) {
    errorElement.textContent = '';
    errorElement.classList.remove('show');
  }
  try {
    const data = await fetchJson('/api/groups/' + encodeURIComponent(groupId) + '/chat/messages');
    listElement.innerHTML = '';
    if (!data.messages.length) {
      listElement.textContent = 'No club messages yet.';
      return;
    }
    data.messages.forEach((message) => {
      const item = document.createElement('div');
      item.className = 'chat-message' + (message.senderId === currentUser?.id ? ' mine' : '');
      const meta = document.createElement('div');
      meta.className = 'chat-message-meta';
      meta.append(
        createPublicProfileLink(message.senderId, message.senderFirstName || 'Member'),
        document.createTextNode(' · Club · ' + formatChatTime(message.createdAt))
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
      errorElement.textContent = err.message || 'Unable to load club chat.';
      errorElement.classList.add('show');
    }
  }
}

function setupClubChat(group) {
  const listElement = socialDetailSection.querySelector('[data-club-chat-messages]');
  const form = socialDetailSection.querySelector('.club-chat-form');
  const errorElement = socialDetailSection.querySelector('[data-club-chat-error]');
  if (!listElement || !form) return;
  loadClubChatMessages(group.id, listElement, errorElement);
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const input = form.querySelector('input');
    const button = form.querySelector('button');
    const text = input.value.trim();
    if (!text) return;
    button.disabled = true;
    input.disabled = true;
    errorElement?.classList.remove('show');
    try {
      await fetchJson('/api/groups/' + encodeURIComponent(group.id) + '/chat/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });
      input.value = '';
      await loadClubChatMessages(group.id, listElement, errorElement);
    } catch (err) {
      if (errorElement) {
        errorElement.textContent = err.message || 'Unable to send club message.';
        errorElement.classList.add('show');
      }
    } finally {
      button.disabled = false;
      input.disabled = false;
      input.focus();
    }
  });
}

async function loadDashboardPeopleSuggestions() {
  const container = document.getElementById('dashboard-people-suggestions');
  if (!container) return;
  container.textContent = 'Finding trusted campus matches...';
  try {
    const data = await fetchJson('/api/users/suggestions');
    const suggestions = data.suggestions || [];
    container.innerHTML = '';
    if (!suggestions.length) {
      const empty = document.createElement('div');
      empty.className = 'dashboard-discovery-empty';
      empty.textContent = 'Add interests and campus groups to your profile to unlock better suggestions.';
      container.appendChild(empty);
      return;
    }
    suggestions.forEach((person) => {
      const card = document.createElement('article');
      card.className = 'dashboard-person-card';
      const avatar = person.profilePictureDataUrl
        ? `<img src="${esc(person.profilePictureDataUrl)}" alt="${esc(person.name)} profile picture" />`
        : `<span>${esc((person.firstName || person.name || 'S').charAt(0).toUpperCase())}</span>`;
      const shared = [
          ...(person.sharedGroups || []).map((value) => 'Group: ' + value),
          ...(person.sharedInterests || []).map((value) => 'Interest: ' + value),
          ...(person.matchTypes || []),
          person.mutualConnectionCount ? `${person.mutualConnectionCount} mutual link${person.mutualConnectionCount === 1 ? '' : 's'}` : '',
      ].filter(Boolean);
      card.innerHTML = `
        <div class="dashboard-person-avatar">${avatar}</div>
        <div class="dashboard-person-body">
          <button type="button" class="user-profile-link dashboard-person-name" data-user-id="${esc(person.id)}">${esc(person.name || 'Student')}</button>
          <p>${esc([person.major, person.classYear ? 'Class of ' + person.classYear : '', person.university].filter(Boolean).join(' · '))}</p>
          ${shared.length ? `<div class="dashboard-person-shared">${shared.slice(0, 3).map((item) => `<span>${esc(item)}</span>`).join('')}</div>` : ''}
        </div>
        <button type="button" class="dashboard-person-follow" data-linkup-user-id="${esc(person.id)}">LinkUp</button>
      `;
      card.querySelector('[data-linkup-user-id]')?.addEventListener('click', async (event) => {
        const button = event.currentTarget;
        button.disabled = true;
        button.textContent = 'Sending...';
        try {
          await fetchJson('/api/users/' + encodeURIComponent(person.id) + '/linkup', { method: 'POST' });
          button.textContent = 'LinkUp sent';
          button.classList.add('is-following');
        } catch (err) {
          button.disabled = false;
          button.textContent = 'LinkUp';
          showToast(err.message || 'Unable to send LinkUp request.', 'error');
        }
      });
      container.appendChild(card);
    });
  } catch {
    container.textContent = 'Unable to load campus suggestions.';
  }
}

function setupCampusGroupForms() {
  const createForm = document.getElementById('campus-group-create-form');
  const joinForm = document.getElementById('campus-group-join-form');
  if (createForm && !createForm.dataset.bound) {
    createForm.dataset.bound = 'true';
    createForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      try {
        await fetchJson('/api/groups', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: document.getElementById('campus-group-name').value,
            kind: document.getElementById('campus-group-kind').value,
            visibility: document.getElementById('campus-group-visibility').value,
          }),
        });
        createForm.reset();
        await loadCampusGroupsPanel();
        showToast('Group or club created.', 'success');
      } catch (err) {
        showToast(err.message || 'Unable to create group.', 'error');
      }
    });
  }
  if (joinForm && !joinForm.dataset.bound) {
    joinForm.dataset.bound = 'true';
    joinForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      try {
        await fetchJson('/api/groups/join', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ inviteCode: document.getElementById('campus-group-code').value }),
        });
        joinForm.reset();
        await loadCampusGroupsPanel();
        showToast('Joined or requested access.', 'success');
      } catch (err) {
        showToast(err.message || 'Unable to join group.', 'error');
      }
    });
  }
}

async function loadCampusGroupsPanel() {
  const container = document.getElementById('dashboard-campus-groups');
  if (!container) return;
  container.textContent = 'Loading campus groups...';
  try {
    const data = await fetchJson('/api/groups');
    currentCampusGroups = data.groups || [];
    refreshRideAudienceControls();
    container.innerHTML = '';
    if (!currentCampusGroups.length) {
      container.innerHTML = '<div class="dashboard-discovery-empty">Create or join a group to see campus announcements.</div>';
      return;
    }
    currentCampusGroups.forEach((group) => {
      const card = document.createElement('article');
      card.className = 'dashboard-group-card';
      const joined = group.membershipStatus === 'active';
      const pending = group.membershipStatus === 'pending';
      card.innerHTML = `
        <div class="dashboard-group-card-head">
          <div>
            <h4>${esc(group.name)}</h4>
            <p>${esc([group.kind === 'club' ? 'Official club' : 'Open group', group.visibility, group.memberCount + ' member' + (group.memberCount === 1 ? '' : 's')].join(' · '))}</p>
          </div>
          ${group.canManage && group.inviteCode ? `<code>${esc(group.inviteCode)}</code>` : ''}
        </div>
        ${group.description ? `<p class="dashboard-group-desc">${esc(group.description)}</p>` : ''}
        ${!joined && !pending ? `<button type="button" class="dashboard-group-join">Join</button>` : ''}
        ${pending ? '<p class="dashboard-group-desc">Waiting for approval.</p>' : ''}
        ${group.canApproveMembers && group.pendingMembers?.length ? `<div class="dashboard-group-pending">${group.pendingMembers.map((member) => `<button type="button" data-approve-user="${esc(member.id)}">Approve ${esc(member.name)}</button>`).join('')}</div>` : ''}
        ${joined ? `
          <div class="dashboard-group-club-summary">
            ${group.kind === 'club' ? `<span>${esc(String((group.events || []).length))} upcoming events</span><span>${esc(String((group.members || []).filter((member) => member.boardPosition).length))} board members</span>` : '<span>Open interest group</span>'}
          </div>
          <button type="button" class="dashboard-group-open" data-open-group="${esc(group.name)}">Open ${group.kind === 'club' ? 'club' : 'group'} page</button>
          <form class="dashboard-group-post-form">
            <input type="text" maxlength="500" placeholder="Share an update, meetup, or ride announcement" />
            <button type="submit">Post</button>
          </form>
          <div class="dashboard-group-posts">${(group.posts || []).map((post) => `<p><strong>${esc(post.authorName)}</strong> ${esc(post.text)}</p>`).join('') || '<p>No announcements yet.</p>'}</div>
        ` : ''}
      `;
      card.querySelector('.dashboard-group-join')?.addEventListener('click', async () => {
        await fetchJson('/api/groups/join', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ groupId: group.id }),
        });
        await loadCampusGroupsPanel();
      });
      card.querySelector('[data-open-group]')?.addEventListener('click', () => showGroupWelcomePage(group.name));
      card.querySelectorAll('[data-approve-user]').forEach((button) => {
        button.addEventListener('click', async () => {
          await fetchJson('/api/groups/' + encodeURIComponent(group.id) + '/members/' + encodeURIComponent(button.dataset.approveUser) + '/approve', { method: 'POST' });
          await loadCampusGroupsPanel();
        });
      });
      card.querySelector('.dashboard-group-post-form')?.addEventListener('submit', async (event) => {
        event.preventDefault();
        const input = event.currentTarget.querySelector('input');
        await fetchJson('/api/groups/' + encodeURIComponent(group.id) + '/posts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: input.value }),
        });
        input.value = '';
        await loadCampusGroupsPanel();
      });
      container.appendChild(card);
    });
  } catch {
    container.textContent = 'Unable to load campus groups.';
  }
}

async function loadConnectionRequestsPanel() {
  const container = document.getElementById('dashboard-connection-requests');
  if (!container) return;
  try {
    const data = await fetchJson('/api/linkups');
    const pending = data.pending || [];
    container.innerHTML = pending.length ? '<h4>LinkUp requests</h4>' : '';
    pending.forEach((person) => {
      const row = document.createElement('div');
      row.className = 'dashboard-connection-request';
      row.innerHTML = `<span>${esc(person.name)}</span><button type="button">Accept</button>`;
      row.querySelector('button').addEventListener('click', async () => {
        await fetchJson('/api/users/' + encodeURIComponent(person.id) + '/linkup/accept', { method: 'POST' });
        await loadConnectionRequestsPanel();
        await loadDashboardPeopleSuggestions();
      });
      container.appendChild(row);
    });
  } catch {
    container.textContent = '';
  }
}

function isInChecklistWindow(ride) {
  const now = Date.now();
  const start = getRideStartTime(ride);
  if (!start) return false;
  const windowStart = start - 60 * 60 * 1000; // 1 hour before departure
  const windowEnd = start + (Number(ride.estimatedDurationMinutes || 90) + 120) * 60 * 1000; // ride end + 2hr buffer
  return now >= windowStart && now <= windowEnd;
}

async function loadDashboardUpcomingRide() {
  const container = document.getElementById('dashboard-ride-card');
  const checklistContainer = document.getElementById('upcoming-ride-checklist');
  const quickActions = document.querySelector('.dashboard-quick-actions');
  if (!container) return;
  container.textContent = 'Loading...';
  if (checklistContainer) checklistContainer.classList.add('hidden');
  quickActions?.classList.remove('hidden');
  try {
    const data = await fetchJson('/api/profile');
    const allRides = [
      ...(data.createdRides || []).map((r) => ({ ...r, _dashRole: 'driver' })),
      ...(data.joinedRides || []).map((r) => ({ ...r, _dashRole: 'rider' })),
    ].sort((a, b) => getRideStartTime(a) - getRideStartTime(b));

    const upcoming = allRides.filter((r) => !isExpiredRideActivity(r));
    const past = allRides.filter((r) => isExpiredRideActivity(r)).reverse();

    populateDashboardStats(data);
    populateDashboardRecentRides(past);

    container.innerHTML = '';
    if (!upcoming.length) {
      const empty = document.createElement('div');
      empty.className = 'dashboard-no-ride';
      empty.innerHTML = 'No upcoming rides. <button type="button" id="dashboard-browse-cta" class="inline-cta">Browse rides</button> to find your next trip.';
      empty.querySelector('#dashboard-browse-cta').addEventListener('click', () => showBrowsePage());
      container.appendChild(empty);
    } else {
      const next = upcoming[0];
      container.appendChild(buildBoardingPass(next, next._dashRole));
      if (next._dashRole === 'driver') {
        if (!next.seatingChartUnavailable || (next.passengers || []).length) {
          container.appendChild(buildDriverSeatManifest(next));
        }
        const navigationCard = buildDriverNavigationCard(next);
        if (navigationCard) container.appendChild(navigationCard);
        const hasPaidRiders = (next.passengers || []).some((p) => p.paid);
        const departed = next.date && next.time && Date.now() >= getRideStartTime(next);
        if (departed && next.hasCompletionCode && hasPaidRiders) {
          container.appendChild(buildDriverCompletionForm(next));
        }
      }
    }

    // Show checklist for the ride currently in the departure window (1 hr before → ~2 hrs after end).
    // This may be a just-departed ride even if the upcoming card shows the next one.
    const checklistRide = allRides.find(isInChecklistWindow);
    quickActions?.classList.toggle('hidden', Boolean(checklistRide));
    if (checklistRide && checklistContainer) {
      checklistContainer.innerHTML = '';
      checklistContainer.appendChild(buildDashboardChecklist(checklistRide, checklistRide._dashRole));
      checklistContainer.classList.remove('hidden');
    }
  } catch {
    container.textContent = 'Unable to load your next ride.';
  }
}

function bpDateShort(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function bpBarcodeSVG() {
  const widths = [2,1,3,1,2,2,1,3,1,2,1,3,2,1,2,3,1,2,1,2,3,1,2,2,1,3,1,2,1,3,2,1,2,1,3,2,1,2,1,2];
  let x = 0;
  const rects = widths.map((w, i) => {
    const rect = i % 2 === 0 ? `<rect x="${x}" y="0" width="${w}" height="36" fill="currentColor"/>` : '';
    x += w + 1;
    return rect;
  }).join('');
  return `<svg class="bp-barcode-svg" viewBox="0 0 ${x} 36" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${rects}</svg>`;
}

function getBoardingPassRouteInfo(ride, isDriver) {
  const passenger = isDriver ? null : getCurrentUserPassenger(ride);
  const riderDestination = normalizeRouteStopLabel(passenger?.actualDropoff || ride.destination);
  const routeDestination = isDriver ? normalizeRouteStopLabel(ride.destination) : riderDestination;
  const passengerDropoffs = (ride.passengers || [])
    .map((entry) => normalizeRouteStopLabel(entry.actualDropoff || ride.destination))
    .filter(Boolean);
  const finalDestinationKey = normalizeRouteStopLabel(ride.destination).toLowerCase();
  const intermediateDriverStops = dedupeRouteStops(passengerDropoffs.map((label) => ({ label })))
    .filter((stop) => stop.label.toLowerCase() !== finalDestinationKey);
  const riderDestinationIndex = !isDriver && riderDestination
    ? passengerDropoffs.findIndex((label) => label.toLowerCase() === riderDestination.toLowerCase())
    : -1;
  const stopsBeforeDestination = isDriver
    ? intermediateDriverStops.length
    : Math.max(0, riderDestinationIndex);
  return {
    destination: routeDestination || normalizeRouteStopLabel(ride.destination),
    middleLabel: isDriver
      ? (stopsBeforeDestination > 0
        ? `${stopsBeforeDestination} stop${stopsBeforeDestination === 1 ? '' : 's'} before final`
        : 'Direct')
      : (stopsBeforeDestination > 0
        ? `${stopsBeforeDestination} stop${stopsBeforeDestination === 1 ? '' : 's'} before`
        : 'Direct'),
  };
}

function buildBoardingPass(ride, role) {
  const isDriver = role === 'driver';
  const isMoving = ride.rideProviderType === 'moving_service';

  const userName   = [currentUser?.firstName, currentUser?.lastName].filter(Boolean).join(' ') || (isDriver ? 'Driver' : 'Passenger');
  const driverName = [ride.driverFirstName, ride.driverLastName].filter(Boolean).join(' ') || '—';
  const confirmedRiders = (ride.passengers || []).filter((p) => p.paid || p.reservationConfirmed).length;
  const seatId     = getCurrentUserSeatId(ride);
  const rawSeatLabel = seatId ? getSeatLabel(seatId) : null;
  const seatLabel  = rawSeatLabel && rawSeatLabel !== seatId ? rawSeatLabel : (!isDriver && !isMoving ? 'Confirmed' : null);
  const vehicle    = [ride.carColor, ride.carMaker, ride.carModel].filter(Boolean).join(' ')
                     || (ride.rideshareService || (ride.rideProviderType === 'rideshare_service' ? 'Rideshare' : ''))
                     || (isMoving ? (ride.movingVehicleType || 'Moving vehicle') : '');

  const roleBadge  = isDriver ? (isMoving ? 'MOVER' : 'DRIVER') : 'PASSENGER';
  const routeInfo = getBoardingPassRouteInfo(ride, isDriver);

  const bp = document.createElement('div');
  bp.className = 'boarding-pass';

  bp.innerHTML = `
    <div class="bp-header">
      <span class="bp-brand">LINKUP</span>
      <span class="bp-role-badge bp-role-badge--${isDriver ? 'driver' : 'rider'}">${roleBadge}</span>
    </div>
    <div class="bp-route">
      <div class="bp-route-stop">
        <div class="bp-stop-label">FROM</div>
        <div class="bp-stop-name">${esc(ride.origin)}</div>
      </div>
      <div class="bp-route-arrow">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 17H5a2 2 0 0 1-2-2v-4l2-4h12l2 4v4a2 2 0 0 1-2 2h-2"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/><path d="M7 15h10"/></svg>
        <span>${esc(routeInfo.middleLabel)}</span>
      </div>
      <div class="bp-route-stop bp-route-stop--dest">
        <div class="bp-stop-label">TO</div>
        <div class="bp-stop-name">${esc(routeInfo.destination)}</div>
      </div>
    </div>

    <div class="bp-fields">
      <div class="bp-field bp-field--wide">
        <div class="bp-field-label">${isDriver ? 'DRIVER' : 'PASSENGER'}</div>
        <div class="bp-field-value">${esc(userName)}</div>
      </div>
      <div class="bp-field">
        <div class="bp-field-label">DATE</div>
        <div class="bp-field-value">${esc(bpDateShort(ride.date))}</div>
      </div>
      <div class="bp-field">
        <div class="bp-field-label">DEPARTS</div>
        <div class="bp-field-value">${esc(formatRideTime(ride.time) || '—')}</div>
      </div>
      ${isDriver
        ? `<div class="bp-field">
             <div class="bp-field-label">RIDERS</div>
             <div class="bp-field-value">${confirmedRiders} confirmed</div>
           </div>`
        : `<div class="bp-field bp-field--wide">
             <div class="bp-field-label">DRIVER</div>
             <div class="bp-field-value">${esc(driverName)}</div>
           </div>`
      }
    </div>

    <div class="bp-tear"></div>

    <div class="bp-stub">
      <div class="bp-fields bp-fields--stub">
        ${seatLabel ? `<div class="bp-field">
          <div class="bp-field-label">SEAT</div>
          <div class="bp-field-value">${esc(seatLabel)}</div>
        </div>` : ''}
        ${vehicle ? `<div class="bp-field bp-field--widest">
          <div class="bp-field-label">VEHICLE</div>
          <div class="bp-field-value">${esc(vehicle)}${ride.licensePlate ? ` · ${esc(ride.licensePlate)}` : ''}</div>
        </div>` : ''}
        <div class="bp-field">
          <div class="bp-field-label">DURATION</div>
          <div class="bp-field-value">${esc(formatDuration(ride.estimatedDurationMinutes))}</div>
        </div>
        <div class="bp-field">
          <div class="bp-field-label">DISTANCE</div>
          <div class="bp-field-value">${esc(formatMiles(getRideMiles(ride)))}</div>
        </div>
      </div>
      <div class="bp-barcode">${bpBarcodeSVG()}</div>
    </div>
  `;

  return bp;
}

function buildDashboardChecklist(ride, role) {
  const RIDER_STEPS = [
    { title: 'Seat reserved', desc: "You've got a confirmed spot on this ride.", optional: false },
    { title: 'Verify the driver', desc: 'At pickup, confirm the name, car, and plate match your booking.', optional: false },
    { title: 'Check door safety', desc: 'Before the ride starts, confirm your door opens from inside and the child lock is off.', optional: false },
    { title: 'Share live tracking', desc: 'Send your trip link to someone you trust for extra safety.', optional: true },
    { title: 'Use Safety Mode if needed', desc: 'Start a safety recording from the dashboard if you feel unsafe.', optional: true },
    { title: 'Give your arrival code', desc: 'Share your 6-digit code with the driver at pickup so they can confirm the trip.', optional: false },
    { title: 'Rate the driver', desc: 'After arrival, leave a quick rating to help the community.', optional: false },
  ];

  const DRIVER_STEPS = [
    { title: 'Ride posted', desc: 'Your listing is live and open for reservations.', optional: false },
    { title: 'Review your riders', desc: 'Check confirmed passengers in Your Rides before you leave.', optional: false },
    { title: 'Confirm pickup details', desc: 'Make sure every rider has your exact pickup spot and departure time.', optional: false },
    { title: 'Vehicle ready', desc: 'Confirm your car is fueled, doors work from the inside, and child locks are off.', optional: false },
    { title: 'Share your route', desc: 'Let someone you trust know your route before you leave.', optional: true },
    { title: 'Collect arrival codes', desc: 'Ask each rider for their 6-digit code at pickup to confirm the trip.', optional: false },
    { title: 'Rate your riders', desc: 'After the trip, rate each passenger to help the community.', optional: false },
  ];

  const isDriver = role === 'driver';
  const STEPS = isDriver ? DRIVER_STEPS : RIDER_STEPS;
  const storageKey = `lup_checklist_${isDriver ? 'driver' : 'rider'}_${ride.id}`;
  let checked;
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey) || 'null');
    checked = Array.isArray(saved) && saved.length === STEPS.length
      ? saved
      : STEPS.map((_, i) => i === 0);
  } catch {
    checked = STEPS.map((_, i) => i === 0);
  }
  checked[0] = true;

  function saveChecked() {
    try { localStorage.setItem(storageKey, JSON.stringify(checked)); } catch {}
  }

  const widget = document.createElement('div');
  widget.className = 'dashboard-checklist-widget';

  const header = document.createElement('div');
  header.className = 'checklist-widget-header';
  header.innerHTML = `
    <div class="checklist-widget-title">
      <span class="checklist-widget-eyebrow">${isDriver ? 'Driver checklist' : 'Rider checklist'}</span>
      <span class="checklist-widget-progress" id="checklist-progress-text"></span>
    </div>
    <div class="checklist-progress-bar"><div class="checklist-progress-fill" id="checklist-progress-fill"></div></div>
  `;
  widget.appendChild(header);

  const list = document.createElement('ol');
  list.className = 'checklist-steps';

  function updateProgress() {
    const done = checked.filter(Boolean).length;
    const total = STEPS.length;
    const pct = Math.round((done / total) * 100);
    const progressText = widget.querySelector('#checklist-progress-text');
    const progressFill = widget.querySelector('#checklist-progress-fill');
    if (progressText) progressText.textContent = done === total ? 'All done!' : `${done} / ${total}`;
    if (progressFill) progressFill.style.width = pct + '%';
    if (done === total) {
      widget.classList.add('checklist-all-done');
    } else {
      widget.classList.remove('checklist-all-done');
    }
  }

  STEPS.forEach((step, i) => {
    const li = document.createElement('li');
    li.className = 'checklist-step' + (checked[i] ? ' checklist-step--done' : '');
    li.dataset.step = String(i);

    const label = document.createElement('label');
    label.className = 'checklist-step-label';

    const cb = document.createElement('input');
    cb.type = 'checkbox';
    cb.className = 'checklist-step-checkbox';
    cb.checked = checked[i];
    cb.disabled = i === 0;

    const checkCircle = document.createElement('span');
    checkCircle.className = 'checklist-step-circle';
    checkCircle.setAttribute('aria-hidden', 'true');
    checkCircle.textContent = checked[i] ? '✓' : String(i + 1);

    cb.addEventListener('change', () => {
      checked[i] = cb.checked;
      saveChecked();
      li.classList.toggle('checklist-step--done', cb.checked);
      checkCircle.textContent = cb.checked ? '✓' : String(i + 1);
      updateProgress();
    });

    const body = document.createElement('div');
    body.className = 'checklist-step-body';
    body.innerHTML = `<span class="checklist-step-title">${esc(step.title)}${step.optional ? ' <span class="checklist-step-optional">optional</span>' : ''}</span><span class="checklist-step-desc">${esc(step.desc)}</span>`;

    label.append(cb, checkCircle, body);
    li.appendChild(label);
    list.appendChild(li);
  });

  widget.appendChild(list);
  updateProgress();
  return widget;
}

function populateDashboardStats(data) {
  const ridesTaken = (data.joinedRides || []).length;
  const ridesOffered = (data.createdRides || []).length;

  const el = (id) => document.getElementById(id);
  if (el('stat-rides-taken')) el('stat-rides-taken').textContent = ridesTaken;
  if (el('stat-rides-driven')) el('stat-rides-driven').textContent = ridesOffered;
}

function populateDashboardRecentRides(pastRides) {
  const section = document.getElementById('dashboard-recent-rides-section');
  const list = document.getElementById('dashboard-recent-rides-list');
  if (!section || !list) return;
  const recent = pastRides.slice(0, 3);
  if (!recent.length) { section.style.display = 'none'; return; }
  section.style.display = '';
  list.innerHTML = '';
  recent.forEach((ride) => {
    const when = formatRideDate(getRideStartTime(ride));
    const role = ride._dashRole === 'driver' ? 'Driver' : 'Rider';
    const dest = ride.destination || ride.dropoffAddress || ride.dropoff || 'Unknown destination';
    const item = document.createElement('div');
    item.className = 'dashboard-recent-ride-item';
    item.innerHTML = `
      <span class="dashboard-recent-ride-role dashboard-recent-ride-role--${esc(ride._dashRole)}">${esc(role)}</span>
      <span class="dashboard-recent-ride-dest">${esc(dest)}</span>
      <span class="dashboard-recent-ride-date">${esc(when)}</span>
    `;
    list.appendChild(item);
  });
}

function formatRideDate(ms) {
  if (!ms) return '';
  const d = new Date(ms);
  const now = new Date();
  const diff = now - d;
  const days = Math.floor(diff / 86400000);
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days} days ago`;
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

function returnToBrowseRides() {
  showDashboardShell();
  showDashboardHome();
}

function showBrowsePage() {
  setAppRoute('browse');
  setActiveNavButton('browse-rides-button');
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
  browsePage.classList.remove('hidden');
  renderBrowseRoleChoice();
  if (currentUser?.rideServicesPaused) renderRideServicesPausedState();
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

function renderWaitlistIntent(intent = '') {
  waitlistIntentButtons.forEach((button) => {
    const selected = button.dataset.waitlistIntent === intent;
    button.classList.toggle('active', selected);
    button.setAttribute('aria-pressed', String(selected));
  });
}

const WAITLIST_SLOGANS = [
  { lead: 'Your campus, ', accent: 'connected.' },
  { lead: 'Get there ', accent: 'together.' },
  { lead: 'Link up, ', accent: 'ride together.' },
  { lead: 'Connecting campuses, ', accent: 'one ride at a time.' },
];

function renderWaitlistSlogan() {
  const headline = document.querySelector('.waitlist-guest-h1');
  if (!headline) return;
  let index;
  try {
    index = (Number(localStorage.getItem('linkup.waitlistSlogan')) || 0) % WAITLIST_SLOGANS.length;
    localStorage.setItem('linkup.waitlistSlogan', String((index + 1) % WAITLIST_SLOGANS.length));
  } catch (_) {
    index = Math.floor(Math.random() * WAITLIST_SLOGANS.length);
  }
  const slogan = WAITLIST_SLOGANS[index];
  headline.textContent = slogan.lead;
  const accent = document.createElement('span');
  accent.className = 'waitlist-h1-accent';
  accent.textContent = slogan.accent;
  headline.appendChild(accent);
}

function showPublicWaitlistPage() {
  setAppRoute('waitlist');
  renderWaitlistSlogan();
  hideLegalPages();
  authSection.classList.add('hidden');
  dashboard.classList.add('hidden');
  document.body.classList.remove('dashboard-mode');
  document.body.classList.remove('waitlist-lock-mode');
  headerLeftActions.classList.add('hidden');
  headerActions.classList.add('hidden');
  waitlistPage.classList.remove('hidden');
  waitlistPage.classList.add('waitlist-guest-mode');
  loadWaitlistLeaderboard();
}
window.__linkupShowPublicWaitlist = showPublicWaitlistPage;

function showWaitlistPage(user) {
  setAppRoute('waitlist');
  hideDashboardPages();
  dashboard.classList.add('waitlist-lock-mode');
  document.body.classList.add('waitlist-lock-mode');
  waitlistPage.classList.remove('hidden');
  waitlistPage.classList.remove('waitlist-guest-mode');

  const memberLabel = formatMemberNumber(user?.memberNumber);
  if (waitlistTitle) {
    waitlistTitle.textContent = memberLabel ? 'Member ' + memberLabel : "You're in.";
  }

  if (waitlistMessage) {
    waitlistMessage.textContent = 'We saved your account. We will notify you when your access is approved and you can ride with LinkUp.';
  }
  renderWaitlistIntent(user?.waitlistIntent || '');
  if (waitlistIntentMessage) {
    waitlistIntentMessage.textContent = user?.waitlistIntent ? 'Saved.' : '';
  }
  loadWaitlistLeaderboard();

  const profileBtn = document.getElementById('waitlist-profile-button');
  if (profileBtn) profileBtn.onclick = () => showProfilePage('info');
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
  setActiveNavButton('your-rides-button');
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
  setActiveNavButton('request-ride-button');
  clearCartMessages();
  clearRequestRideMessages();
  hideDashboardPages();
  refreshRideAudienceControls();
  requestRidePage.classList.remove('hidden');
  loadGoogleMapsAPI().then(() => initializeRequestAutocomplete()).catch(() => {});
}

function showListRidePage() {
  if (!ensureServiceAccess()) return;
  setAppRoute('list-ride');
  setActiveNavButton('list-ride-button');
  clearCartMessages();
  hideDashboardPages();
  refreshRideAudienceControls();
  listRidePage.classList.remove('hidden');
  loadProfile();
  loadGoogleMapsAPI().then(() => {
    setTimeout(() => {
      if (!originMap) initializeOriginMap();
      if (!destinationAutocomplete) initializeDestinationMap();
    }, 100);
  }).catch(() => {});
}

function showTrackTripPage() {
  showDashboardHome();
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
  destroyEmbeddedCheckout();

  // Populate right-panel order summary from selected cart cards
  const orderSummaryEl = document.getElementById('payment-order-summary');
  let totalCents = 0;
  if (orderSummaryEl) {
    const selectedCards = [...cartItems.querySelectorAll('.cart-item-card')]
      .filter((card) => selectedRideIds.includes(card.dataset.rideId));
    totalCents = selectedCards.reduce((sum, card) => sum + Number(card.dataset.priceCents || 0), 0);
    paymentPageTotalCents = totalCents;
    renderPaymentOrderSummary(orderSummaryEl, selectedCards, totalCents, 0);
    orderSummaryEl.classList.remove('hidden');
  }
  walletCreditApplied = Math.max(0, Number(currentUser?.wallet?.availableCents || 0)) > 0 && totalCents > 0;
  renderLinkUpWalletCheckout(totalCents);
}

function renderPaymentOrderSummary(el, selectedCards, totalCents, creditCents) {
  const rows = selectedCards.map((card) => {
    const title = card.querySelector('h4')?.textContent?.trim() || 'Ride';
    const priceCents = Number(card.dataset.priceCents || 0);
    return `<div class="cart-summary-row">
      <span class="cart-summary-row-label">${esc(title)}</span>
      <span class="cart-summary-row-price">${formatCents(priceCents)}</span>
    </div>`;
  }).join('');

  const creditRow = creditCents > 0
    ? `<div class="cart-summary-row cart-summary-credit-row">
        <span class="cart-summary-row-label">LinkUp credit</span>
        <span class="cart-summary-row-price cart-summary-credit-amount">−${formatCents(creditCents)}</span>
      </div>`
    : '';

  const chargeCents = Math.max(0, totalCents - creditCents);
  const chargeLabel = creditCents > 0 && chargeCents === 0 ? 'Total due' : creditCents > 0 ? 'Card charge' : 'Total';

  el.innerHTML = `
    <div class="cart-summary-rows">${rows}${creditRow}</div>
    <div class="cart-summary-divider"></div>
    <div class="cart-summary-total-row">
      <div class="cart-summary-total-copy">
        <span>${chargeLabel}</span>
        <p class="cart-summary-tax-note">Service fee included</p>
      </div>
      <strong>${formatCents(chargeCents)}</strong>
    </div>
  `;
}

function renderLinkUpWalletCheckout(totalCents) {
  if (!linkupWalletCheckout) return;
  const availableCents = Math.max(0, Number(currentUser?.wallet?.availableCents || 0));

  if (availableCents <= 0) {
    walletCreditApplied = false;
    linkupWalletCheckout.classList.add('hidden');
    return;
  }

  const appliedCents = walletCreditApplied
    ? Math.min(availableCents, Math.max(0, Number(totalCents || 0)))
    : 0;
  const remainingCents = Math.max(0, Number(totalCents || 0) - appliedCents);

  const payCartButton = document.getElementById('pay-cart');
  if (payCartButton) {
    payCartButton.textContent = walletCreditApplied && remainingCents === 0
      ? 'Pay with Wallet'
      : walletCreditApplied
        ? 'Use Wallet + Card'
        : 'Check Out';
  }

  // Sync order summary credit row
  const orderSummaryEl = document.getElementById('payment-order-summary');
  if (orderSummaryEl) {
    const selectedCards = [...cartItems.querySelectorAll('.cart-item-card')]
      .filter((card) => [...selectedCartRideIds].includes(card.dataset.rideId));
    renderPaymentOrderSummary(orderSummaryEl, selectedCards, totalCents, appliedCents);
  }

  if (!walletCreditApplied) {
    linkupWalletCheckout.innerHTML = `
      <div class="wallet-checkout-copy">
        <span>LinkUp Wallet</span>
        <strong>${formatCents(availableCents)}</strong>
        <small>Available — use it to reduce your card charge.</small>
      </div>
      <div class="wallet-checkout-apply">
        <button type="button" class="wallet-apply-btn" id="wallet-apply-btn">
          Use ${formatCents(Math.min(availableCents, totalCents || 0))} wallet credit
        </button>
      </div>
    `;
    document.getElementById('wallet-apply-btn')?.addEventListener('click', () => {
      walletCreditApplied = true;
      renderLinkUpWalletCheckout(totalCents);
    });
  } else {
    linkupWalletCheckout.innerHTML = `
      <div class="wallet-checkout-copy">
        <span>LinkUp Wallet <span class="wallet-applied-badge">Applied by default</span></span>
        <strong>${formatCents(availableCents)}</strong>
        <small><button type="button" class="wallet-remove-link" id="wallet-remove-btn">Use card instead</button></small>
      </div>
      <div class="wallet-checkout-breakdown">
        <div><span>Trip total</span><strong>${formatCents(totalCents || 0)}</strong></div>
        <div><span>LinkUp credit</span><strong class="wallet-credit-amt">−${formatCents(appliedCents)}</strong></div>
        <div><span>${remainingCents > 0 ? 'Card charge' : 'Total due'}</span><strong>${formatCents(remainingCents)}</strong></div>
      </div>
    `;
    document.getElementById('wallet-remove-btn')?.addEventListener('click', () => {
      walletCreditApplied = false;
      renderLinkUpWalletCheckout(totalCents);
    });
  }

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
    else if (route === 'admin') showAdminPage();
    else if (route === 'chat') showChatPage();
    else if (route === 'social' && isSocialPreviewEnabled()) showSocialPage();
    else if (route.startsWith('interest-tag-') && isSocialPreviewEnabled()) showInterestTagPage(decodeURIComponent(route.replace(/^interest-tag-/, '')));
    else if (route.startsWith('group-') && isSocialPreviewEnabled()) showGroupWelcomePage(decodeURIComponent(route.replace(/^group-/, '')));
    else if (route === 'request-ride') showRequestRidePage();
    else if (route === 'list-ride') showListRidePage();
    else if (route === 'eats') showEatsPage();
    else if (route === 'leaderboard') showLeaderboardPage();
    else if (route.startsWith('user-profile-')) showPublicProfilePage(route.replace(/^user-profile-/, ''));
    else if (route === 'profile-payment') showProfilePage('payment');
    else if (route === 'profile-school-transfer') showProfilePage('school-transfer');
    else if (route === 'profile-payouts') showProfilePage('payouts');
    else if (route === 'profile-security') showProfilePage('security');
    else if (route === 'profile-notifications') showProfilePage('notifications');
    else if (route === 'profile-policies') showProfilePage('policies');
    else if (route === 'profile-appearance') showProfilePage('appearance');
    else if (route === 'profile-release-notes') showProfilePage('release-notes');
    else if (route === 'profile-delete-account') showProfilePage('delete-account');
    else if (route === 'profile-about') showProfilePage('about');
    else if (route === 'profile') showProfilePage('info');
    else if (route === 'browse') {
      showBrowsePage();
    } else if (route === 'browse-driver') {
      showBrowsePage();
      showDriverBrowse();
    } else if (route === 'browse-rider') {
      showBrowsePage();
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
  loadNotifications({ silent: true });
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
  if (safetyRecorder && safetyRecorder.state !== 'inactive') {
    safetyRecorder.stop();
  }
  safetyRecordingStream?.getTracks().forEach((track) => track.stop());
  safetyRecordingStream = null;
  safetyRecorder = null;
  safetyRecordingChunks = [];
  safetyRecordingStartedAt = 0;
  if (startSafetyRecordingButton) startSafetyRecordingButton.disabled = false;
  if (stopSafetyRecordingButton) stopSafetyRecordingButton.disabled = true;
  setSafetyModeStatus('Off', false);
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
  const isMoving = providerType === 'moving_service';
  offerForm?.classList.toggle('hidden', !providerType);
  rideProviderStep?.classList.toggle('hidden', Boolean(providerType));
  rideProviderChoices.forEach((button) => button.classList.toggle('active', button.dataset.providerType === providerType));
  if (rideProviderSummaryText) {
    rideProviderSummaryText.textContent = isPersonalCar
      ? 'Personal Car'
      : (isRideshare ? 'Rideshare Service' : (isMoving ? 'Moving Service' : 'Ride type selected'));
  }
  personalCarFields?.classList.toggle('hidden', !isPersonalCar);
  personalSeatSelection?.classList.toggle('hidden', !isPersonalCar);
  vehicleLayoutField?.classList.toggle('hidden', !isPersonalCar);
  rideshareServiceFields?.classList.toggle('hidden', !isRideshare);
  movingServiceFields?.classList.toggle('hidden', !isMoving);

  const priceLabel = document.getElementById('price-field-label');
  if (priceLabel) {
    const firstChild = priceLabel.firstChild;
    if (firstChild && firstChild.nodeType === Node.TEXT_NODE) {
      firstChild.textContent = isMoving ? 'Price for the job ($) ' : 'Price per seat ($) ';
    }
  }
  const notesInput = document.getElementById('notes');
  if (notesInput) {
    notesInput.placeholder = isMoving
      ? 'Stairs, fragile items, parking notes, etc.'
      : 'Music OK, study-friendly, etc.';
  }

  ['car-maker', 'car-model', 'car-color', 'license-plate'].forEach((id) => {
    setRequired(document.getElementById(id), isPersonalCar);
  });
  setRequired(vehicleSeatCountSelect, isPersonalCar);
  setRequired(document.getElementById('seats'), isPersonalCar);
  setRequired(rideshareServiceSelect, isRideshare);
  setRequired(rideshareSeatCountInput, isRideshare);
  setRequired(document.getElementById('moving-vehicle-type'), isMoving);
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

function updateTrackingMap(location = null, pathLocations = [], rideRoute = null) {
  const hasPosition = location && Number.isFinite(Number(location.lat)) && Number.isFinite(Number(location.lng));
  const position = hasPosition ? { lat: Number(location.lat), lng: Number(location.lng) } : null;
  const routePointsPreview = getRoutePoints(rideRoute);
  if (!hasPosition && !routePointsPreview) return;
  if (!window.google?.maps || !trackingMapDiv) {
    if (hasPosition) {
      renderTrackingMapFallback(trackingMapDiv, position, 'Your live location');
    } else {
      trackingMapDiv.textContent = 'Route: ' + (rideRoute?.origin || 'Pick-up') + ' to ' + (rideRoute?.destination || 'Drop-off') + '. Waiting for your current location dot...';
    }
    if (!trackingMapLoadPending) {
      trackingMapLoadPending = true;
      loadGoogleMapsAPI().then(() => {
        trackingMapLoadPending = false;
        if (window.google?.maps && (lastTrackingLocation || lastTrackingRideRoute)) {
          updateTrackingMap(lastTrackingLocation, lastTrackingLocations, lastTrackingRideRoute);
        }
      }).catch(() => { trackingMapLoadPending = false; });
    }
    return;
  }
  trackingMapLoadPending = false;

  if (!trackingMap) {
    const initialCenter = position || {
      lat: (routePointsPreview.origin.lat + routePointsPreview.destination.lat) / 2,
      lng: (routePointsPreview.origin.lng + routePointsPreview.destination.lng) / 2,
    };
    trackingMap = new google.maps.Map(trackingMapDiv, {
      zoom: hasPosition ? 15 : 11, center: initialCenter,
      styles: getGoogleMapStylesForTheme(),
      mapTypeControl: false, streetViewControl: false, fullscreenControl: false,
    });
    if (hasPosition) {
      trackingMarker = new google.maps.Marker({ map: trackingMap, position, icon: makeLiveLocationDotIcon(), title: 'Your current location' });
    }
    trackingPath = new google.maps.Polyline({ map: trackingMap, path: [], strokeColor: '#8fb8ff', strokeOpacity: 0.9, strokeWeight: 4 });
  } else if (hasPosition && !trackingMarker) {
    trackingMarker = new google.maps.Marker({ map: trackingMap, position, icon: makeLiveLocationDotIcon(), title: 'Your current location' });
  } else if (hasPosition) {
    trackingMarker.setPosition(position);
  } else {
    trackingMap.setCenter({
      lat: (routePointsPreview.origin.lat + routePointsPreview.destination.lat) / 2,
      lng: (routePointsPreview.origin.lng + routePointsPreview.destination.lng) / 2,
    });
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

function blobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(String(reader.result || '').split(',')[1] || '');
    reader.onerror = () => reject(reader.error || new Error('Unable to read recording'));
    reader.readAsDataURL(blob);
  });
}

async function startSafetyRecording() {
  clearTrackingMessages();
  if (!window.MediaRecorder || !navigator.mediaDevices?.getUserMedia) {
    trackingError.textContent = 'Safety recording is not supported in this browser.';
    trackingError.classList.add('show');
    return;
  }
  try {
    safetyRecordingStream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mimeType = MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : '';
    safetyRecorder = new MediaRecorder(safetyRecordingStream, mimeType ? { mimeType } : undefined);
    safetyRecordingChunks = [];
    safetyRecordingStartedAt = Date.now();
    safetyRecorder.addEventListener('dataavailable', (event) => {
      if (event.data?.size) safetyRecordingChunks.push(event.data);
    });
    safetyRecorder.addEventListener('stop', () => {
      safetyRecordingStream?.getTracks().forEach((track) => track.stop());
      safetyRecordingStream = null;
    });
    safetyRecorder.start();
    startSafetyRecordingButton.disabled = true;
    stopSafetyRecordingButton.disabled = false;
    safetyRecordingConsent.disabled = true;
    setSafetyModeStatus('Recording', true);
    trackingMessage.textContent = 'Safety recording started. Make sure everyone in the car knows recording is active.';
    trackingMessage.classList.add('show');
  } catch (err) {
    trackingError.textContent = err.message || 'Unable to start safety recording.';
    trackingError.classList.add('show');
  }
}

async function stopSafetyRecording() {
  clearTrackingMessages();
  if (!safetyRecorder || safetyRecorder.state === 'inactive') return;
  const stopped = new Promise((resolve) => safetyRecorder.addEventListener('stop', resolve, { once: true }));
  safetyRecorder.stop();
  await stopped;
  startSafetyRecordingButton.disabled = false;
  stopSafetyRecordingButton.disabled = true;
  setSafetyModeStatus('Uploading', true);

  try {
    const mimeType = safetyRecorder.mimeType || 'audio/webm';
    const blob = new Blob(safetyRecordingChunks, { type: mimeType });
    const audioBase64 = await blobToBase64(blob);
    const response = await fetchJson('/api/safety/recordings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        audioBase64,
        mimeType,
        durationMs: Date.now() - safetyRecordingStartedAt,
        consentAcknowledged: true,
        noticeShown: true,
      }),
    });
    lastSafetyRecordingId = response.recordingId || '';
    setSafetyModeStatus('Saved', false);
    trackingMessage.textContent = response.message || 'Safety recording uploaded to LinkUp.';
    trackingMessage.classList.add('show');
  } catch (err) {
    setSafetyModeStatus('Upload failed', false);
    trackingError.textContent = err.message || 'Unable to upload safety recording.';
    trackingError.classList.add('show');
  } finally {
    safetyRecorder = null;
    safetyRecordingChunks = [];
    safetyRecordingStartedAt = 0;
  }
}

async function sendSafetyIncident({ doorIssue = false } = {}) {
  clearTrackingMessages();
  const note = safetyIncidentNote?.value.trim() || '';
  const reason = doorIssue ? 'Vehicle door safety issue' : 'Ride safety note';
  if (!doorIssue && !note && !lastSafetyRecordingId) {
    trackingError.textContent = 'Add a safety note or attach a recording before sending.';
    trackingError.classList.add('show');
    return;
  }
  try {
    const response = await fetchJson('/api/safety/incidents', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        reason,
        details: note,
        doorSafetyConfirmed: true,
        doorSafetyIssue: doorIssue,
        safetyRecordingId: lastSafetyRecordingId,
      }),
    });
    if (safetyIncidentNote) safetyIncidentNote.value = '';
    trackingMessage.textContent = response.message || 'Safety note sent to LinkUp.';
    trackingMessage.classList.add('show');
  } catch (err) {
    trackingError.textContent = err.message || 'Unable to send safety note.';
    trackingError.classList.add('show');
  }
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
    lastTrackingRideRoute = data.rideRoute || null;
    updateTrackingMap(null, [], lastTrackingRideRoute);
    trackingMessage.textContent = data.rideRoute
      ? (data.message || 'Invite sent. Keep this page open while riding.')
      : 'Tracking started, but no active reserved ride route was found to draw yet.';
    trackingMessage.classList.add('show');
    let _trackingErrShownAt = 0;
    trackingWatchId = navigator.geolocation.watchPosition(
      (position) => sendTrackingLocation(position).catch((err) => {
        const now = Date.now();
        if (now - _trackingErrShownAt > 20000) {
          _trackingErrShownAt = now;
          trackingError.textContent = err.message;
          trackingError.classList.add('show');
        }
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
      styles: getGoogleMapStylesForTheme(),
      mapTypeControl: false, streetViewControl: false, fullscreenControl: false,
    });
    sharedTrackingPath = new google.maps.Polyline({ map: sharedTrackingMap, path: [], strokeColor: '#8fb8ff', strokeOpacity: 0.9, strokeWeight: 4 });
  } else if (hasPosition) {
    sharedTrackingMap.setCenter(position);
  }
  if (hasPosition && !sharedTrackingMarker) {
    sharedTrackingMarker = new google.maps.Marker({ map: sharedTrackingMap, position, icon: makeLiveLocationDotIcon(), title: 'Current rider location' });
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

function getRideParkingFeeCents(ride) {
  return Math.max(0, Number(ride?.parkingFeeCents || 0));
}

function getRideTotalCents(ride) {
  if (ride?.totalPriceCents !== undefined && ride?.totalPriceCents !== null) {
    return Math.max(0, Number(ride.totalPriceCents || 0));
  }
  return Math.max(0, Number(ride?.priceCents || 0)) + getRideParkingFeeCents(ride);
}

function formatRideTotalPrice(ride) {
  return formatCents(getRideTotalCents(ride));
}

function getRideFeeDetailMarkup(ride, { flatRate = false } = {}) {
  const parkingFeeCents = getRideParkingFeeCents(ride);
  if (!parkingFeeCents) return `<div><strong>Price:</strong> ${esc(formatRidePrice(ride))}${flatRate ? ' (flat rate)' : ''}</div>`;
  return `
    <div><strong>Seat price:</strong> ${esc(formatRidePrice(ride))}${flatRate ? ' (flat rate)' : ''}</div>
    <div><strong>Parking / airport fee:</strong> ${esc(formatCents(parkingFeeCents))}</div>
    <div><strong>Total:</strong> ${esc(formatRideTotalPrice(ride))}</div>
  `;
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
  const metricsKey = [normalizedMapsKey(origin), normalizedMapsKey(destination), departureDate, departureTime].join('|');
  if (googleTripMetricsCache.has(metricsKey)) return googleTripMetricsCache.get(metricsKey);
  const metricsPromise = new Promise((resolve) => {
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
  googleTripMetricsCache.set(metricsKey, metricsPromise);
  return metricsPromise;
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
      center: getInitialMapCenter(),
      styles: getGoogleMapStylesForTheme(),
      mapTypeControl: false, streetViewControl: false, fullscreenControl: false,
    });
    recenterMapOnBrowserLocation(browseRadiusMap, {
      zoom: 12,
      shouldApply: () => !getRadiusCenter(pickupRadiusLocationInput) && !getRadiusCenter(dropoffRadiusLocationInput),
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
    const renderer = new google.maps.DirectionsRenderer({
      map,
      suppressMarkers: true,
      preserveViewport: true,
      polylineOptions: { strokeColor: '#67d7d9', strokeOpacity: 0.95, strokeWeight: 5 },
    });
    browseRouteRenderer = renderer;
    getCachedDrivingDirections(pickupCenter, dropoffCenter).then((result) => {
      if (!renderer.getMap()) return;
      if (result) {
        renderer.setDirections(result);
      } else {
        renderer.setMap(null);
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
    getCachedDrivingDirections(originPos, destPos).then(
      (result) => {
        if (!renderer.getMap()) return;
        if (result) {
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
  lastBrowseMapItems = items;
  const map = ensureBrowseRadiusMap();
  if (!map) return;

  const pickupCenter = getRadiusCenter(pickupRadiusLocationInput);
  const dropoffCenter = getRadiusCenter(dropoffRadiusLocationInput);
  const pickupMiles = getEffectiveBrowseRadiusMiles(pickupRadiusMilesInput, pickupCenter);
  const dropoffMiles = getEffectiveBrowseRadiusMiles(dropoffRadiusMilesInput, dropoffCenter);
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

const DEFAULT_BROWSE_LOCATION_RADIUS_MILES = 5;

function getEffectiveBrowseRadiusMiles(input, center) {
  const enteredMiles = Number(input?.value);
  if (Number.isFinite(enteredMiles) && enteredMiles > 0) return enteredMiles;
  if (center) return DEFAULT_BROWSE_LOCATION_RADIUS_MILES;
  return 0;
}

function matchesRadiusFilter(item, type) {
  const pickupCenter = getRadiusCenter(pickupRadiusLocationInput);
  const dropoffCenter = getRadiusCenter(dropoffRadiusLocationInput);
  const pickupMiles = getEffectiveBrowseRadiusMiles(pickupRadiusMilesInput, pickupCenter);
  const dropoffMiles = getEffectiveBrowseRadiusMiles(dropoffRadiusMilesInput, dropoffCenter);
  const itemPickupFlexMiles = Number(item.pickupRadiusMiles || 0);
  const itemDropoffFlexMiles = Number(item.dropoffRadiusMiles || 0);
  const hasPickupRadius = Number.isFinite(pickupMiles) && pickupMiles > 0;
  const hasDropoffRadius = Number.isFinite(dropoffMiles) && dropoffMiles > 0;
  if (!hasPickupRadius && !hasDropoffRadius) return true;

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
  if (Number.isFinite(maxPriceCents) && maxPriceCents > 0 && getRideTotalCents(ride) > maxPriceCents) return false;

  return true;
}

function sortVisibleRides(rides) {
  const sorted = [...rides];
  if (rideSortSelect.value === 'price-low') {
    return sorted.sort((a, b) => getRideTotalCents(a) - getRideTotalCents(b));
  }
  if (rideSortSelect.value === 'price-high') {
    return sorted.sort((a, b) => getRideTotalCents(b) - getRideTotalCents(a));
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
  if (!passenger?.actualPickup && !passenger?.actualDropoff) return;
  const note = document.createElement('div');
  note.className = 'seat-manifest-stop-note';
  if (passenger.actualPickup) {
    const row = document.createElement('span');
    row.innerHTML = `<strong>Pickup</strong><span>${esc(passenger.actualPickup)}</span>`;
    note.appendChild(row);
  }
  if (passenger.actualDropoff) {
    const row = document.createElement('span');
    row.innerHTML = `<strong>Drop-off</strong><span>${esc(passenger.actualDropoff)}</span>`;
    note.appendChild(row);
  }
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
  const isMovingCard = ride.rideProviderType === 'moving_service';
  const title = document.createElement('h4');
  title.innerHTML = `${isMovingCard ? '<span class="moving-service-badge">Moving</span> ' : ''}${esc(ride.origin)} → ${esc(ride.destination)}`;
  const parkingFeeCents = getRideParkingFeeCents(ride);
  const head = document.createElement('div');
  head.className = 'ride-card-head';
  head.appendChild(title);
  const priceTag = document.createElement('div');
  priceTag.className = 'ride-card-price';
  priceTag.innerHTML = `<strong>${esc(parkingFeeCents ? formatRideTotalPrice(ride) : formatRidePrice(ride))}</strong>`
    + `<span>${isMovingCard ? 'flat rate' : 'per seat'}${parkingFeeCents ? ' · incl. fees' : ''}</span>`;
  head.appendChild(priceTag);
  card.appendChild(head);
  const meta = document.createElement('div');
  meta.className = 'ride-card-meta';
  meta.innerHTML = `
    <span>${esc(formatRideDateTime(ride))}</span>
    <span>${esc(formatDuration(ride.estimatedDurationMinutes))}</span>
    <span>${esc(formatMiles(getRideMiles(ride)))}</span>
    ${ride.returnRide ? `<span>Return ${esc(formatRideDateTime(ride.returnRide))}</span>` : ''}
    <span class="ride-meta-seats">${esc(ride.seatsAvailable)} ${isMovingCard ? 'slot' : 'seat'}${Number(ride.seatsAvailable) === 1 ? '' : 's'} left</span>
  `;
  card.appendChild(meta);
  const driverName = [ride.driverFirstName, ride.driverLastName].filter(Boolean).join(' ') || 'Driver';
  const driverRow = document.createElement('div');
  driverRow.className = 'ride-driver-row';
  driverRow.innerHTML = `${publicProfileLinkMarkup(ride.driverId, driverName)}`
    + `<span class="ride-driver-sub">${esc(formatDriverRating(ride))} · ${esc(ride.university || 'Unknown school')}</span>`;
  card.appendChild(driverRow);

  const facts = [];
  if (!isMovingCard) facts.push(ride.sameGenderOnly ? 'Same gender riders only' : 'Open to all riders');
  if (ride.sameSchoolOnly) facts.push('Same school only');
  if (ride.noSmoking) facts.push('No smoking');
  const pickupRadiusMiles = Number(ride.pickupRadiusMiles || 0);
  const dropoffRadiusMiles = Number(ride.dropoffRadiusMiles || 0);
  if (pickupRadiusMiles > 0) facts.push(formatMiles(pickupRadiusMiles) + ' pickup detour');
  if (dropoffRadiusMiles > 0) facts.push(formatMiles(dropoffRadiusMiles) + ' drop-off detour');
  if (isMovingCard) {
    if (ride.movingVehicleType) facts.push(ride.movingVehicleType);
    if (ride.movingCapacity) facts.push(ride.movingCapacity + ' cargo capacity');
    if (ride.movingLoadingHelp) facts.push('Loading help included');
    if (ride.movingFurniture) facts.push('Large furniture accepted');
  } else if (ride.rideProviderType === 'rideshare_service') {
    facts.push(ride.rideshareService || 'Rideshare service');
  } else {
    const vehicleName = [ride.carColor, ride.carMaker, ride.carModel].filter(Boolean).join(' ');
    if (vehicleName) facts.push(vehicleName);
    if (canSeeRideLicensePlate(ride) && ride.licensePlate) facts.push('Plate ' + ride.licensePlate);
  }
  if (parkingFeeCents) {
    facts.push(formatRidePrice(ride) + ' seat + ' + formatCents(parkingFeeCents) + ' parking/airport fee');
  }
  const factLine = document.createElement('div');
  factLine.className = 'ride-fact-line';
  factLine.innerHTML = facts.map((fact) => `<span>${esc(fact)}</span>`).join('<i aria-hidden="true">·</i>');
  card.appendChild(factLine);

  if (ride.notes) {
    const note = document.createElement('div');
    note.className = 'ride-note';
    note.textContent = ride.notes;
    card.appendChild(note);
  }
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
    card.appendChild(buildBrowseSeatManifest(ride));
  } else {
    const cartActionButton = document.createElement('button');
    const isInCart = cartRideIds.has(ride.id);
    const selectedSeatId = selectedSeatByRide.get(ride.id) || '';
    const cardError = document.createElement('div');
    cardError.className = 'error-message';
    card.appendChild(buildBrowseSeatManifest(ride));
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
      const prevText = cartActionButton.textContent;
      cartActionButton.disabled = true;
      cartActionButton.textContent = 'Adding…';
      try {
        const seatId = ride.seatingChartUnavailable ? '' : selectedSeatByRide.get(ride.id);
        const riderStops = getRiderStopPayload(ride);
        if (rideNeedsRiderPickup(ride) && !riderStops.actualPickup) {
          cardError.textContent = 'Enter your actual pickup spot for this ride.';
          cardError.classList.add('show');
          cartActionButton.disabled = false;
          cartActionButton.textContent = prevText;
          return;
        }
        if (rideNeedsRiderDropoff(ride) && !riderStops.actualDropoff) {
          cardError.textContent = 'Enter your actual drop-off spot for this ride.';
          cardError.classList.add('show');
          cartActionButton.disabled = false;
          cartActionButton.textContent = prevText;
          return;
        }
        await fetchJson(`/api/cart/${ride.id}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ seatId, ...riderStops, termsAccepted: true }) });
        await loadCart();
        loadRides();
      } catch (err) {
        cardError.textContent = err.message;
        cardError.classList.add('show');
        cartActionButton.disabled = false;
        cartActionButton.textContent = prevText;
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

  const detailsDisclosure = document.createElement('details');
  detailsDisclosure.className = 'ride-card-disclosure';
  const detailsSummary = document.createElement('summary');
  detailsSummary.innerHTML = `<span>${ride.driverId === currentUser.id ? 'View full ride details' : 'View ride details & reserve'}</span><span class="ride-details-chevron" aria-hidden="true">⌄</span>`;
  const detailsBody = document.createElement('div');
  detailsBody.className = 'ride-card-details';
  let detailNode = driverRow.nextSibling;
  while (detailNode) {
    const nextNode = detailNode.nextSibling;
    detailsBody.appendChild(detailNode);
    detailNode = nextNode;
  }
  detailsDisclosure.append(detailsSummary, detailsBody);
  card.appendChild(detailsDisclosure);
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
  if (ride.rideProviderType === 'moving_service') {
    return [
      ride.movingVehicleType ? `<div><strong>Vehicle:</strong> ${esc(ride.movingVehicleType)}</div>` : '',
      ride.movingCapacity ? `<div><strong>Cargo capacity:</strong> ${esc(ride.movingCapacity)}</div>` : '',
      ride.movingLoadingHelp ? `<div><strong>Loading help:</strong> Included</div>` : '',
      ride.movingFurniture ? `<div><strong>Large furniture:</strong> Accepted</div>` : '',
    ].join('');
  }
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
    sendButton.disabled = true;
    input.disabled = true;
    error.classList.remove('show');
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
    } finally {
      sendButton.disabled = false;
      input.disabled = false;
      input.focus();
    }
  });

  loadRideChat(ride.id, messages, error, form);
  return wrapper;
}

function setChatSection(section) {
  activeChatSection = section === 'social' && isSocialPreviewEnabled() ? 'social' : 'ride';
  chatRideTab?.classList.toggle('active', activeChatSection === 'ride');
  chatSocialTab?.classList.toggle('active', activeChatSection === 'social');
  chatSocialTab?.classList.toggle('hidden', !isSocialPreviewEnabled());
  chatRidePanel?.classList.toggle('hidden', activeChatSection !== 'ride');
  chatSocialPanel?.classList.toggle('hidden', activeChatSection !== 'social');
  chatConversation.innerHTML = `<p>Select a ${activeChatSection === 'social' ? 'social chat' : 'ride'} to open its chat.</p>`;
  if (activeChatSection === 'ride') {
    loadRideChatList();
  } else {
    loadSocialChatList();
  }
}

function getChatRideRole(ride) {
  return ride.driverId === currentUser?.id ? 'Driver' : 'Rider';
}

function getChatRideTitle(ride) {
  return ride.origin + ' to ' + ride.destination + ' - ' + formatRideDateTime(ride);
}

async function loadChatPage() {
  setChatSection(activeChatSection);
}

async function loadRideChatList() {
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

async function loadSocialChatMessages(userId, listElement, errorElement, formElement) {
  listElement.textContent = 'Loading chat...';
  if (errorElement) {
    errorElement.textContent = '';
    errorElement.classList.remove('show');
  }
  try {
    const data = await fetchJson('/api/social/chats/' + encodeURIComponent(userId) + '/messages');
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
        document.createTextNode(' · Social · ' + formatChatTime(message.createdAt))
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

function createSocialChat(chat) {
  const wrapper = document.createElement('div');
  wrapper.className = 'ride-chat ride-chat-full';

  const header = document.createElement('div');
  header.className = 'ride-chat-header';

  const title = document.createElement('strong');
  title.textContent = 'Social chat - ' + (chat.name || 'Link');

  const refreshButton = document.createElement('button');
  refreshButton.type = 'button';
  refreshButton.textContent = 'Refresh';

  header.append(title, refreshButton);

  const details = document.createElement('div');
  details.className = 'chat-ride-details';
  details.innerHTML = `
    <h4>${publicProfileLinkMarkup(chat.id, chat.name || 'LinkUp user')}</h4>
    <div class="chat-ride-detail-grid">
      <div><strong>School:</strong> ${esc(chat.university || 'Campus network')}</div>
      <div><strong>Major:</strong> ${esc(chat.major || 'Not shared')}</div>
      <div><strong>Year:</strong> ${esc(chat.classYear ? 'Class of ' + chat.classYear : 'Not shared')}</div>
      <div><strong>Connection:</strong> Linked</div>
    </div>
  `;

  const messages = document.createElement('div');
  messages.className = 'ride-chat-messages';

  const form = document.createElement('form');
  form.className = 'ride-chat-form';

  const input = document.createElement('input');
  input.type = 'text';
  input.maxLength = 500;
  input.placeholder = 'Message your Link...';

  const sendButton = document.createElement('button');
  sendButton.type = 'submit';
  sendButton.textContent = 'Send';

  const error = document.createElement('div');
  error.className = 'error-message';

  form.append(input, sendButton);
  wrapper.append(header, details, messages, form, error);

  refreshButton.addEventListener('click', () => loadSocialChatMessages(chat.id, messages, error, form));
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const text = input.value.trim();
    if (!text) return;
    sendButton.disabled = true;
    input.disabled = true;
    error.classList.remove('show');
    try {
      await fetchJson('/api/social/chats/' + encodeURIComponent(chat.id) + '/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });
      input.value = '';
      loadSocialChatMessages(chat.id, messages, error, form);
    } catch (err) {
      error.textContent = err.message;
      error.classList.add('show');
    } finally {
      sendButton.disabled = false;
      input.disabled = false;
      input.focus();
    }
  });

  loadSocialChatMessages(chat.id, messages, error, form);
  return wrapper;
}

async function loadSocialChatList() {
  chatSocialList.textContent = 'Loading social chats...';
  chatConversation.innerHTML = '<p>Select a social chat to open its chat.</p>';
  try {
    const data = await fetchJson('/api/social/chats');
    const chats = data.chats || [];
    chatSocialList.innerHTML = '';
    if (!chats.length) {
      chatSocialList.textContent = 'No social chats yet. LinkUp with classmates to start one.';
      return;
    }
    chats.forEach((chat) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'chat-ride-button' + (selectedSocialChatUserId === chat.id ? ' active' : '');
      button.dataset.userId = chat.id;
      button.innerHTML = `<span>${esc(chat.name || 'LinkUp user')}</span>${chat.lastMessage ? `<small>${esc(chat.lastMessage.text)}</small>` : '<small>No messages yet</small>'}`;
      button.addEventListener('click', () => {
        selectedSocialChatUserId = chat.id;
        chatSocialList.querySelectorAll('.chat-ride-button').forEach((item) => item.classList.remove('active'));
        button.classList.add('active');
        chatConversation.innerHTML = '';
        chatConversation.appendChild(createSocialChat(chat));
      });
      chatSocialList.appendChild(button);
    });
    const initialChat = chats.find((chat) => chat.id === selectedSocialChatUserId) || chats[0];
    if (initialChat) {
      selectedSocialChatUserId = initialChat.id;
      const firstButton = chatSocialList.querySelector('[data-user-id="' + initialChat.id + '"]');
      firstButton?.click();
    }
  } catch (err) {
    chatSocialList.textContent = 'Unable to load social chats.';
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
      const occupied = document.createElement('span');
      occupied.className = 'seat-manifest-status seat-manifest-status-occupied';
      occupied.textContent = 'Occupied';
      rider.appendChild(occupied);
      rider.appendChild(createPublicProfileLink(passenger.studentId, passengerName));
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

function normalizeRouteStopLabel(value) {
  return String(value || '').trim().replace(/\s+/g, ' ');
}

function dedupeRouteStops(stops) {
  const seen = new Set();
  return stops.filter((stop) => {
    const label = normalizeRouteStopLabel(stop.label);
    if (!label) return false;
    const key = label.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    stop.label = label;
    return true;
  });
}

function getDriverNavigationStops(ride) {
  const origin = normalizeRouteStopLabel(ride.origin);
  const destination = normalizeRouteStopLabel(ride.destination);
  const destinationKey = destination.toLowerCase();
  const dropoffByLabel = new Map();
  (ride.passengers || []).forEach((passenger) => {
    const label = normalizeRouteStopLabel(passenger.actualDropoff || ride.destination);
    if (!label) return;
    const key = label.toLowerCase();
    const riderName = [passenger.studentFirstName, passenger.studentLastName].filter(Boolean).join(' ') || 'Rider';
    const existing = dropoffByLabel.get(key);
    if (existing) {
      existing.riderNames.push(riderName);
    } else {
      dropoffByLabel.set(key, { label, riderNames: [riderName] });
    }
  });
  const intermediateStops = [...dropoffByLabel.values()]
    .filter((stop) => stop.label.toLowerCase() !== destinationKey)
    .map((stop) => ({ label: stop.label, riderName: stop.riderNames.join(', ') }));
  const finalStop = destination
    ? {
        label: destination,
        riderName: dropoffByLabel.get(destinationKey)?.riderNames.length
          ? dropoffByLabel.get(destinationKey).riderNames.join(', ') + ' · Final destination'
          : 'Final destination',
      }
    : null;
  const stops = finalStop ? [...intermediateStops, finalStop] : intermediateStops;
  return { origin, stops };
}

function buildGoogleDriverRouteUrl(ride) {
  const { origin, stops } = getDriverNavigationStops(ride);
  if (!origin || !stops.length) return '';
  const destination = stops[stops.length - 1].label;
  const waypoints = stops.slice(0, -1).map((stop) => stop.label).join('|');
  const params = new URLSearchParams({
    api: '1',
    origin,
    destination,
    travelmode: 'driving',
  });
  if (waypoints) params.set('waypoints', waypoints);
  return 'https://www.google.com/maps/dir/?' + params.toString();
}

function buildAppleDriverRouteUrl(ride) {
  const { origin, stops } = getDriverNavigationStops(ride);
  if (!origin || !stops.length) return '';
  const orderedDestinationText = stops.map((stop) => stop.label).join(' to ');
  const params = new URLSearchParams({
    saddr: origin,
    daddr: orderedDestinationText,
    dirflg: 'd',
  });
  return 'https://maps.apple.com/?' + params.toString();
}

function buildDriverNavigationCard(ride) {
  const { origin, stops } = getDriverNavigationStops(ride);
  if (!origin || !stops.length) return null;

  const googleUrl = buildGoogleDriverRouteUrl(ride);
  const appleUrl = buildAppleDriverRouteUrl(ride);
  const currentStop = stops[0];
  const card = document.createElement('div');
  card.className = 'driver-route-card';
  card.innerHTML = `
    <div class="driver-route-card-head">
      <div>
        <span class="driver-route-eyebrow">Driver route</span>
        <strong>Open your full drop-off route</strong>
      </div>
      <span>${esc(String(stops.length))} stop${stops.length === 1 ? '' : 's'}</span>
    </div>
    <div class="driver-current-stop">
      <span>Next stop</span>
      <strong>${esc(currentStop.label)}</strong>
      <small>${esc(currentStop.riderName)}</small>
    </div>
    <div class="driver-route-actions">
      <a href="${esc(googleUrl)}" target="_blank" rel="noopener">Open in Google Maps</a>
      <a href="${esc(appleUrl)}" target="_blank" rel="noopener">Open in Apple Maps</a>
    </div>
  `;
  return card;
}

function buildBrowseSeatManifest(ride) {
  const manifest = document.createElement('div');
  manifest.className = 'seat-manifest browse-seat-manifest';

  const title = document.createElement('div');
  title.className = 'seat-manifest-title';
  title.textContent = ride.seatingChartUnavailable ? 'People in this ride' : 'People in this car';
  manifest.appendChild(title);

  const list = document.createElement('div');
  list.className = 'seat-manifest-list';
  const passengers = ride.passengers || [];

  const driverRow = document.createElement('div');
  driverRow.className = 'seat-manifest-row';

  const driverSeat = document.createElement('span');
  driverSeat.className = 'seat-manifest-seat';
  driverSeat.textContent = 'Driver';

  const driver = document.createElement('span');
  driver.className = 'seat-manifest-rider';
  const driverName = [ride.driverFirstName, ride.driverLastName].filter(Boolean).join(' ') || 'Driver';
  driver.appendChild(createPublicProfileLink(ride.driverId, driverName));

  driverRow.append(driverSeat, driver);
  list.appendChild(driverRow);

  if (!passengers.length) {
    const row = document.createElement('div');
    row.className = 'seat-manifest-row';
    row.innerHTML = '<span class="seat-manifest-seat">Riders</span><span class="seat-manifest-empty">No booked seats yet</span>';
    list.appendChild(row);
    manifest.appendChild(list);
    return manifest;
  }

  if (ride.seatingChartUnavailable) {
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

      row.append(spot, rider);
      list.appendChild(row);
    });
    manifest.appendChild(list);
    return manifest;
  }

  const passengerBySeat = new Map(passengers
    .filter((passenger) => passenger.seatId)
    .map((passenger) => [passenger.seatId, passenger]));
  const passengersWithoutSeat = passengers.filter((passenger) => !passenger.seatId);

  getVehicleSeatIds(getSeatLayoutCountForRide(ride)).forEach((seatId) => {
    const passenger = passengerBySeat.get(seatId);
    if (!passenger) return;

    const row = document.createElement('div');
    row.className = 'seat-manifest-row';

    const seat = document.createElement('span');
    seat.className = 'seat-manifest-seat';
    seat.textContent = getSeatLabel(seatId);

    const rider = document.createElement('span');
    rider.className = 'seat-manifest-rider';
    const passengerName = [passenger.studentFirstName, passenger.studentLastName].filter(Boolean).join(' ') || 'Rider';
    rider.appendChild(createPublicProfileLink(passenger.studentId, passengerName));

    row.append(seat, rider);
    list.appendChild(row);
  });

  passengersWithoutSeat.forEach((passenger) => {
    const row = document.createElement('div');
    row.className = 'seat-manifest-row';

    const seat = document.createElement('span');
    seat.className = 'seat-manifest-seat';
    seat.textContent = 'Seat pending';

    const rider = document.createElement('span');
    rider.className = 'seat-manifest-rider';
    const passengerName = [passenger.studentFirstName, passenger.studentLastName].filter(Boolean).join(' ') || 'Rider';
    rider.appendChild(createPublicProfileLink(passenger.studentId, passengerName));

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
  if (request.destinationFuzzy) {
    title.innerHTML = esc(request.origin) + ' → ' + esc(request.destination) + ' <span class="destination-fuzzy-badge" title="Exact drop-off hidden for privacy">(approx.)</span>';
  } else {
    title.textContent = request.origin + ' → ' + request.destination;
  }
  container.appendChild(title);

  const requestTime = formatRideDateTime({ date: request.date, time: request.time });
  const riderName = [request.riderFirstName || 'Student', request.riderLastName || ''].filter(Boolean).join(' ');
  const isMovingReq = request.requestType === 'moving';
  const details = document.createElement('div');
  details.className = 'ride-details';
  details.innerHTML = `
    <div><strong>Rider:</strong> ${publicProfileLinkMarkup(request.riderId, riderName)}</div>
    <div><strong>School:</strong> ${esc(request.university || 'Unknown school')}</div>
    <div><strong>Preference:</strong> ${request.sameGenderDriverOnly ? 'Same gender driver only' : 'Open to all drivers'}</div>
    ${request.sameSchoolDriverOnly ? '<div><strong>School restriction:</strong> Same school drivers only</div>' : ''}
    ${request.noSmoking ? '<div><strong>Smoking:</strong> No smoking during ride</div>' : ''}
    ${renderRideAudienceMarkup(request)}
    ${getFlexRadiusMarkup(request, 'rider')}
    <div><strong>Requested time:</strong> ${esc(requestTime)}</div>
    <div><strong>Estimated ride time:</strong> ${esc(formatDuration(request.estimatedDurationMinutes))}</div>
    ${isMovingReq ? `<div><strong>Cargo size:</strong> ${esc(request.movingSize || 'Not specified')}</div>` : `<div><strong>Riders:</strong> ${esc(request.riderCount || 1)}</div>`}
    ${isMovingReq ? '' : `<div><strong>Share with others:</strong> ${request.shareRideWithOthers === undefined ? 'Not specified' : (request.shareRideWithOthers ? 'Yes' : 'No')}</div>`}
    <div><strong>Willing to pay:</strong> ${esc(formatCents(request.willingToPayCents))}</div>
    <div><strong>Status:</strong> ${esc(request.status || 'open')}</div>
    <div><strong>Driver offers:</strong> ${esc((request.driverOffers || []).length)}</div>
    ${request.notes ? `<div><strong>Notes:</strong> ${esc(request.notes)}</div>` : ''}
  `;
  if (isMovingReq && request.movingPhotoDataUrl) {
    const img = document.createElement('img');
    img.src = request.movingPhotoDataUrl;
    img.alt = 'Items photo';
    img.className = 'moving-request-photo';
    details.appendChild(img);
  }
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
    offerButton.disabled = true;
    offerButton.textContent = 'Sending…';
    try {
      await fetchJson('/api/ride-requests/' + request.id + '/offer', { method: 'POST' });
      offerButton.textContent = 'Offer sent';
      loadRideRequests();
      loadProfile();
    } catch (err) {
      cardError.textContent = err.message;
      cardError.classList.add('show');
      offerButton.disabled = false;
      offerButton.textContent = 'Offer to drive';
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
      postSharedButton.disabled = true;
      postSharedButton.textContent = 'Posting…';
      seatsInput.disabled = true;
      priceInput.disabled = true;
      try {
        await fetchJson('/api/ride-requests/' + request.id + '/post-shared-ride', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ seatsAvailable: Number(seatsInput.value), price: Number(priceInput.value) }),
        });
        postSharedButton.textContent = 'Shared ride posted';
        loadRides();
        loadProfile();
      } catch (err) {
        cardError.textContent = err.message;
        cardError.classList.add('show');
        postSharedButton.disabled = false;
        postSharedButton.textContent = 'Post shared ride';
        seatsInput.disabled = false;
        priceInput.disabled = false;
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

  // Drivers do not need their own name, school, rating, or booking rules
  // repeated back to them. Keep only the vehicle information needed at pickup.
  container.querySelector(':scope > .ride-driver-row')?.remove();
  const factLine = container.querySelector(':scope > .ride-fact-line');
  if (factLine) {
    const vehicleName = [ride.carColor, ride.carMaker, ride.carModel].filter(Boolean).join(' ');
    const operationalFacts = [
      vehicleName,
      ride.licensePlate ? 'Plate ' + ride.licensePlate : '',
    ].filter(Boolean);
    if (operationalFacts.length) {
      factLine.innerHTML = operationalFacts.map((fact) => `<span>${esc(fact)}</span>`).join('<i aria-hidden="true">·</i>');
    } else {
      factLine.remove();
    }
  }

  const badge = document.createElement('div');
  badge.className = 'driver-pinned-badge';
  badge.textContent = 'Pinned driving ride';
  container.prepend(badge);

  if (!ride.seatingChartUnavailable) {
    container.appendChild(buildDriverSeatManifest(ride));
  } else if ((ride.passengers || []).length) {
    container.appendChild(buildDriverSeatManifest(ride));
  }
  const navigationCard = buildDriverNavigationCard(ride);
  if (navigationCard) container.appendChild(navigationCard);

  // Show trip completion form after departure if the ride uses completion codes
  const hasPaidRiders = (ride.passengers || []).some((p) => p.paid);
  const departed = ride.date && ride.time && Date.now() >= getRideStartTime(ride);
  if (departed && ride.hasCompletionCode && hasPaidRiders) {
    container.appendChild(buildDriverCompletionForm(ride));
  }

  return container;
}

function buildDriverCompletionForm(ride) {
  const wrap = document.createElement('div');
  wrap.className = 'trip-completion-wrap';

  if (ride.completionConfirmedAt) {
    wrap.innerHTML = `
      <div class="trip-confirmed-badge">
        <span class="trip-confirmed-icon">✓</span>
        Trip confirmed — earnings are in your wallet.
      </div>`;
    return wrap;
  }

  wrap.innerHTML = `
    <div class="trip-completion-form">
      <div class="trip-completion-header">
        <strong>Confirm trip complete</strong>
        <small>Ask your rider for their 6-digit code and enter it below to unlock your earnings.</small>
      </div>
      <div class="trip-completion-input-row">
        <input type="text" class="trip-completion-input" inputmode="numeric" maxlength="6"
               placeholder="000000" autocomplete="off" aria-label="6-digit completion code">
        <button class="trip-completion-btn" type="button">Confirm</button>
      </div>
      <div class="trip-completion-msg hidden"></div>
    </div>`;

  const input = wrap.querySelector('.trip-completion-input');
  const btn = wrap.querySelector('.trip-completion-btn');
  const msg = wrap.querySelector('.trip-completion-msg');

  btn.addEventListener('click', async () => {
    const pin = input.value.trim();
    if (!/^\d{6}$/.test(pin)) {
      msg.textContent = 'Enter the 6-digit code from your rider.';
      msg.className = 'trip-completion-msg trip-completion-error show';
      return;
    }
    btn.disabled = true;
    btn.textContent = 'Confirming…';
    msg.className = 'trip-completion-msg hidden';
    try {
      const data = await fetchJson(`/api/rides/${ride.id}/complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin }),
      });
      msg.textContent = data.message;
      msg.className = 'trip-completion-msg trip-completion-success show';
      if (data.alreadyConfirmed || data.confirmedCount >= 0) {
        wrap.innerHTML = `
          <div class="trip-confirmed-badge">
            <span class="trip-confirmed-icon">✓</span>
            ${esc(data.message)}
          </div>`;
      }
    } catch (err) {
      msg.textContent = err.message;
      msg.className = 'trip-completion-msg trip-completion-error show';
      btn.disabled = false;
      btn.textContent = 'Confirm';
    }
  });

  return wrap;
}

function buildRideSummary(ride, options = {}) {
  const selectedSeatId = getCurrentUserSeatId(ride);
  const currentPassenger = getCurrentUserPassenger(ride);
  const driverName = [ride.driverFirstName, ride.driverLastName].filter(Boolean).join(' ') || 'Driver';
  const container = document.createElement('div');
  container.className = 'ride-card';
  const isMoving = ride.rideProviderType === 'moving_service';
  const parkingFeeCents = getRideParkingFeeCents(ride);
  const facts = [];
  if (!isMoving) facts.push(ride.sameGenderOnly ? 'Same gender only' : 'Open to all');
  if (ride.sameSchoolOnly) facts.push('Same school only');
  if (isMoving) {
    if (ride.movingVehicleType) facts.push(ride.movingVehicleType);
    if (ride.movingCapacity) facts.push(ride.movingCapacity + ' cargo capacity');
    if (ride.movingLoadingHelp) facts.push('Loading help included');
    if (ride.movingFurniture) facts.push('Large furniture accepted');
  } else if (ride.rideProviderType === 'rideshare_service') {
    facts.push(ride.rideshareService || 'Rideshare service');
  } else {
    const vehicleName = [ride.carColor, ride.carMaker, ride.carModel].filter(Boolean).join(' ');
    if (vehicleName) facts.push(vehicleName);
    if (canSeeRideLicensePlate(ride) && ride.licensePlate) facts.push('Plate ' + ride.licensePlate);
  }
  if (!isMoving) {
    const passengerCount = (ride.passengers || []).length;
    facts.push(passengerCount + ' passenger' + (passengerCount === 1 ? '' : 's') + ' booked');
  }
  const stops = currentPassenger || ride;
  if (stops.actualPickup) facts.push('Pickup at ' + stops.actualPickup);
  if (stops.actualDropoff) facts.push('Drop-off at ' + stops.actualDropoff);
  if (parkingFeeCents) facts.push(formatRidePrice(ride) + ' seat + ' + formatCents(parkingFeeCents) + ' parking/airport fee');

  const seatsChip = isMoving
    ? esc(ride.seatsAvailable) + ' slots available'
    : (selectedSeatId
      ? 'Your seat: ' + esc(getSeatLabel(selectedSeatId))
      : esc(ride.seatsAvailable) + ' seat' + (Number(ride.seatsAvailable) === 1 ? '' : 's') + ' available');

  container.innerHTML = `
    <div class="ride-card-head">
      <h4>${isMoving ? '<span class="moving-service-badge">Moving</span> ' : ''}${esc(ride.origin)} → ${esc(ride.destination)}</h4>
      <div class="ride-card-price">
        <strong>${esc(parkingFeeCents ? formatRideTotalPrice(ride) : formatRidePrice(ride))}</strong>
        <span>${isMoving ? 'flat rate' : 'per seat'}${parkingFeeCents ? ' · incl. fees' : ''}</span>
      </div>
    </div>
    <div class="ride-card-meta">
      <span>${esc(formatRideDateTime(ride))}</span>
      <span>${esc(formatDuration(ride.estimatedDurationMinutes))}</span>
      <span>${esc(formatMiles(getRideMiles(ride)))}</span>
      ${ride.returnRide ? `<span>Return ${esc(formatRideDateTime(ride.returnRide))}</span>` : ''}
      <span class="ride-meta-seats">${seatsChip}</span>
    </div>
    <div class="ride-driver-row">
      ${publicProfileLinkMarkup(ride.driverId, driverName)}
      <span class="ride-driver-sub">${esc(formatDriverRating(ride))} · ${esc(ride.university || 'Unknown school')}</span>
    </div>
    <div class="ride-fact-line">${facts.map((fact) => `<span>${esc(fact)}</span>`).join('<i aria-hidden="true">·</i>')}</div>
  `;
  if (ride.seatingChartUnavailable) {
    const notice = document.createElement('div');
    notice.className = 'seat-picker-hint shared-seat-notice';
    notice.textContent = ride.rideProviderType === 'moving_service'
      ? 'Moving service — items and cargo only, no passengers.'
      : (ride.rideProviderType === 'rideshare_service'
        ? 'Rideshare service — riders reserve general spots.'
        : 'Seating chart unavailable for this shared ride.');
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

  // Show completion PIN to confirmed riders after departure so they can share it with the driver
  if (ride.completionPin && currentUser && ride.driverId !== currentUser.id) {
    const pinWrap = document.createElement('div');
    pinWrap.className = 'rider-completion-pin';
    const formatted = ride.completionPin.slice(0, 3) + ' ' + ride.completionPin.slice(3);
    pinWrap.innerHTML = `
      <div class="rider-pin-label">Your completion code</div>
      <div class="rider-pin-number">${esc(formatted)}</div>
      <div class="rider-pin-hint">Share this with your driver — they need it to confirm the trip and get paid.</div>`;
    container.appendChild(pinWrap);
  }

  return container;
}

function renderCartItem(ride) {
  const item = document.createElement('div');
  item.className = 'ride-card cart-item-card';
  item.dataset.rideId = ride.id;
  item.dataset.priceCents = String(getRideTotalCents(ride));
  item.dataset.cartTermsAccepted = ride.cartTermsAccepted ? 'true' : 'false';
  item.dataset.actualPickup = ride.actualPickup || '';
  item.dataset.actualDropoff = ride.actualDropoff || '';

  const title = document.createElement('h4');
  title.textContent = `${ride.origin} → ${ride.destination}`;
  item.appendChild(title);

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
    ${getRideFeeDetailMarkup(ride)}
  `;
  (routeRow || item.querySelector('h4'))?.after(detail);

  const removeButton = document.createElement('button');
  removeButton.textContent = 'Remove';
  removeButton.onclick = async () => {
    removeButton.disabled = true;
    removeButton.textContent = 'Removing…';
    try {
      await fetchJson(`/api/cart/${ride.id}`, { method: 'DELETE' });
      await loadCart();
      loadRides();
    } catch (err) {
      cartError.textContent = err.message;
      cartError.classList.add('show');
      removeButton.disabled = false;
      removeButton.textContent = 'Remove';
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
    cartCount.textContent = data.rides.length || '';
    cartCount.classList.toggle('hidden', !data.rides.length);
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
    showBrowsePage();
    return;
  }
  setAppRoute('browse-rider');
  setBrowseRole('rider');
  loadGoogleMapsAPI().then(() => {
    initializeRadiusAutocomplete();
    // Show map immediately; trigger resize after layout settles
    browseMapPanel?.classList.remove('hidden');
    browseRiderLayout?.classList.add('rider-active');
    setTimeout(() => {
      const map = ensureBrowseRadiusMap();
      if (map) google.maps.event.trigger(map, 'resize');
      // Rides can finish loading before the Maps script — re-plot them now
      if (lastBrowseMapItems.length) updateBrowseRadiusMap(lastBrowseMapItems);
    }, 100);
  }).catch((error) => {
    console.error('Browse map failed to load:', error);
    showBrowseMapLoadError(error);
  });
  browseTitle.textContent = 'Browse available rides';
  browseSubtitle.textContent = 'Find rides near your pickup and drop-off.';
  browseSearchLabel.classList.add('hidden');
  browseSearchLabel.firstChild.textContent = 'Search destination or meetup';
  pickupLocationLabel.firstChild.textContent = 'Where you are starting from ';
  pickupRadiusLabel.firstChild.textContent = 'Max walk to pick-up (mi) ';
  dropoffLocationLabel.firstChild.textContent = 'Your final destination area ';
  dropoffRadiusLabel.firstChild.textContent = 'Max walk from drop-off (mi) ';
  rideSearchInput.placeholder = 'Where do you want to go?';
  pickupRadiusLocationInput.placeholder = 'Where are you starting from?';
  dropoffRadiusLocationInput.placeholder = 'Where is your final destination?';
  pickupRadiusMilesInput.placeholder = '5';
  dropoffRadiusMilesInput.placeholder = '5';
  browseControls.classList.remove('hidden');
  browseResultsTitle.textContent = 'Available rides';
  loadRides();
}

function showDriverBrowse() {
  if (currentUser?.rideServicesPaused) {
    showBrowsePage();
    return;
  }
  setAppRoute('browse-driver');
  setBrowseRole('driver');
  browseSearchLabel.classList.remove('hidden');
  loadGoogleMapsAPI().then(() => {
    initializeRadiusAutocomplete();
    browseMapPanel?.classList.remove('hidden');
    browseRiderLayout?.classList.add('rider-active');
    setTimeout(() => {
      const map = ensureBrowseRadiusMap();
      if (map) google.maps.event.trigger(map, 'resize');
      // Requests can finish loading before the Maps script — re-plot them now
      if (lastBrowseMapItems.length) updateBrowseRadiusMap(lastBrowseMapItems);
    }, 100);
  }).catch((error) => {
    console.error('Browse map failed to load:', error);
    showBrowseMapLoadError(error);
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
  pickupRadiusMilesInput.placeholder = '5';
  dropoffRadiusMilesInput.placeholder = '5';
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
  return Boolean(
    rideSearchInput.value.trim()
    || rideFilterDateInput.value
    || (Number.isFinite(Number(rideFilterMaxPriceInput.value)) && Number(rideFilterMaxPriceInput.value) > 0)
    || Boolean(getRadiusCenter(pickupRadiusLocationInput))
    || Boolean(getRadiusCenter(dropoffRadiusLocationInput))
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
  yourRidesDrivingTab.classList.toggle('active', view === 'driving');
  yourRidesRidingTab.classList.toggle('active', view === 'riding');
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
    setButtonLoading(button, true);
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
      setButtonLoading(button, false);
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
  return makeYourRideCardCollapsible(item, role === 'Driver' ? 'View ride record' : 'View trip record');
}

function makeYourRideCardCollapsible(item, label = 'View ride details') {
  if (!item || item.querySelector(':scope > .your-ride-disclosure')) return item;
  const anchor = item.querySelector(':scope > .ride-driver-row, :scope > .ride-card-meta');
  if (!anchor?.nextSibling) return item;
  const disclosure = document.createElement('details');
  disclosure.className = 'your-ride-disclosure';
  const summary = document.createElement('summary');
  summary.innerHTML = `<span>${esc(label)}</span><span class="your-ride-chevron" aria-hidden="true">⌄</span>`;
  const body = document.createElement('div');
  body.className = 'your-ride-details-body';
  let node = anchor.nextSibling;
  while (node) {
    const next = node.nextSibling;
    body.appendChild(node);
    node = next;
  }
  disclosure.append(summary, body);
  item.appendChild(disclosure);
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

    if (yourRidesView === 'riding') {
      if (!currentReservedRides.length) {
        yourRidesList.textContent = "You aren't riding in any upcoming rides.";
        return;
      }
      appendRideSection(yourRidesList, "Upcoming rides you're joining", currentReservedRides, (ride) => {
        const item = buildRideSummary(ride);
        item.classList.add('your-ride-reservation');
        return makeYourRideCardCollapsible(item, 'View trip details');
      });
      return;
    }

    if (!currentDrivingRides.length) {
      yourRidesList.textContent = "You aren't driving any upcoming rides.";
      return;
    }
    appendRideSection(yourRidesList, "Upcoming rides you're driving", currentDrivingRides, (ride) => (
      makeYourRideCardCollapsible(buildDriverRideSummary(ride), 'Manage this ride')
    ));
  } catch (err) {
    yourRidesList.textContent = '';
    yourRidesList.innerHTML = '<p class="error-message show">' + (err.message || 'Unable to load your rides.') + '</p>';
  }
}

function render2FAPanel(user) {
  const panel = document.getElementById('twofa-panel-content');
  if (!panel) return;
  const totpEnabled = Boolean(user?.twoFactorEnabled);
  const emailEnabled = Boolean(user?.emailTwoFactorEnabled);

  panel.innerHTML = `
    <div class="twofa-methods-list">

      <!-- Authenticator app -->
      <div class="twofa-section">
        <div class="twofa-header">
          <div>
            <h4 class="twofa-title">Authenticator app</h4>
            <p class="twofa-desc">Use Google Authenticator, Authy, or any TOTP app. Generates codes offline — most secure option.</p>
          </div>
          <div class="twofa-status-badge ${totpEnabled ? 'twofa-status-on' : 'twofa-status-off'}">
            ${totpEnabled ? 'Enabled' : 'Disabled'}
          </div>
        </div>

        ${totpEnabled ? `
          <div class="twofa-enabled-info">
            <div class="twofa-check-row">
              <span class="twofa-check">✓</span>
              Authenticator app is active on your account.
            </div>
          </div>
          <div class="twofa-disable-wrap">
            <p class="twofa-remove-label">To remove, enter your current authenticator code:</p>
            <div class="twofa-input-row">
              <input type="text" id="twofa-disable-code" inputmode="numeric" maxlength="6"
                     placeholder="000000" autocomplete="one-time-code" class="twofa-code-input">
              <button id="twofa-disable-btn" class="twofa-danger-btn" type="button">Remove</button>
            </div>
            <div id="twofa-disable-msg" class="twofa-msg hidden"></div>
          </div>
        ` : `
          <div id="twofa-setup-step1">
            <button id="twofa-setup-start" class="twofa-setup-btn" type="button">Set up authenticator app</button>
          </div>
          <div id="twofa-setup-step2" class="hidden">
            <div class="twofa-qr-wrap">
              <p class="twofa-instruction">Scan this QR code with your authenticator app:</p>
              <img id="twofa-qr-img" src="" alt="2FA QR code" class="twofa-qr-img">
              <details class="twofa-manual-details">
                <summary>Can't scan? Enter code manually</summary>
                <code id="twofa-manual-secret" class="twofa-manual-code"></code>
              </details>
            </div>
            <p class="twofa-instruction twofa-instruction-confirm">Enter the 6-digit code from your app to confirm setup:</p>
            <div class="twofa-input-row">
              <input type="text" id="twofa-enable-code" inputmode="numeric" maxlength="6"
                     placeholder="000000" autocomplete="one-time-code" class="twofa-code-input">
              <button id="twofa-enable-btn" class="twofa-setup-btn" type="button">Activate</button>
            </div>
            <div id="twofa-enable-msg" class="twofa-msg hidden"></div>
          </div>
        `}
      </div>

      <!-- Email verification -->
      <div class="twofa-section">
        <div class="twofa-header">
          <div>
            <h4 class="twofa-title">Email verification</h4>
            <p class="twofa-desc">Receive a one-time code at your university email each time you sign in. No app required.</p>
          </div>
          <div class="twofa-status-badge ${emailEnabled ? 'twofa-status-on' : 'twofa-status-off'}">
            ${emailEnabled ? 'Enabled' : 'Disabled'}
          </div>
        </div>

        ${emailEnabled ? `
          <div class="twofa-enabled-info">
            <div class="twofa-check-row">
              <span class="twofa-check">✓</span>
              A code will be emailed to you each time you sign in.
            </div>
          </div>
          <div class="twofa-disable-wrap">
            <button id="twofa-email-disable-btn" class="twofa-danger-btn" type="button">Turn off email verification</button>
            <div id="twofa-email-disable-msg" class="twofa-msg hidden"></div>
          </div>
        ` : `
          <button id="twofa-email-enable-btn" class="twofa-setup-btn" type="button">Turn on email verification</button>
          <div id="twofa-email-enable-msg" class="twofa-msg hidden"></div>
        `}
      </div>

      <!-- Change password -->
      <div class="twofa-section security-change-password">
        <div class="twofa-header">
          <div>
            <h4 class="twofa-title">Change password</h4>
            <p class="twofa-desc">Update your account password. We'll send a 6-digit code to your university email to confirm.</p>
          </div>
        </div>
        <div class="change-password-form">
          <div id="change-password-form-fields">
            <label class="change-password-label">
              Current password
              <input type="password" id="change-password-current" placeholder="••••••••" autocomplete="current-password" />
            </label>
            <label class="change-password-label">
              New password
              <input type="password" id="change-password-new" placeholder="New password (8+ chars, upper, lower, number, special)" autocomplete="new-password" />
            </label>
            <label class="change-password-label">
              Confirm new password
              <input type="password" id="change-password-confirm" placeholder="••••••••" autocomplete="new-password" />
            </label>
            <button type="button" id="change-password-btn" class="twofa-setup-btn">Send verification code</button>
          </div>
          <div id="change-password-code-step" class="hidden">
            <label class="change-password-label">
              6-digit code from your email
              <input type="text" id="change-password-code" inputmode="numeric" maxlength="6" placeholder="000000" autocomplete="one-time-code" />
            </label>
            <div class="change-password-code-actions">
              <button type="button" id="change-password-confirm-btn" class="twofa-setup-btn">Confirm</button>
              <button type="button" id="change-password-restart" class="twofa-text-link">Start over</button>
            </div>
          </div>
          <div id="change-password-msg" class="twofa-msg hidden"></div>
        </div>
      </div>

    </div>`;

  // Authenticator app handlers
  if (!totpEnabled) {
    document.getElementById('twofa-setup-start')?.addEventListener('click', async () => {
      const btn = document.getElementById('twofa-setup-start');
      btn.disabled = true;
      btn.textContent = 'Loading…';
      try {
        const data = await fetchJson('/api/auth/2fa/setup', { method: 'POST' });
        document.getElementById('twofa-qr-img').src = data.qrDataUrl;
        document.getElementById('twofa-manual-secret').textContent = data.secret;
        document.getElementById('twofa-setup-step1').classList.add('hidden');
        document.getElementById('twofa-setup-step2').classList.remove('hidden');
      } catch (err) {
        btn.disabled = false;
        btn.textContent = 'Set up authenticator app';
        const msg = document.getElementById('twofa-enable-msg');
        if (msg) { msg.textContent = err.message; msg.className = 'twofa-msg twofa-error show'; }
      }
    });

    document.getElementById('twofa-enable-btn')?.addEventListener('click', async () => {
      const code = document.getElementById('twofa-enable-code')?.value.trim();
      const msg = document.getElementById('twofa-enable-msg');
      if (!/^\d{6}$/.test(code)) {
        msg.textContent = 'Enter the 6-digit code from your authenticator app.';
        msg.className = 'twofa-msg twofa-error show';
        return;
      }
      const btn = document.getElementById('twofa-enable-btn');
      btn.disabled = true;
      btn.textContent = 'Activating…';
      try {
        const data = await fetchJson('/api/auth/2fa/enable', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code }),
        });
        if (data.user) currentUser = { ...currentUser, ...data.user };
        render2FAPanel(currentUser);
      } catch (err) {
        msg.textContent = err.message;
        msg.className = 'twofa-msg twofa-error show';
        btn.disabled = false;
        btn.textContent = 'Activate';
      }
    });
  } else {
    document.getElementById('twofa-disable-btn')?.addEventListener('click', async () => {
      const code = document.getElementById('twofa-disable-code')?.value.trim();
      const msg = document.getElementById('twofa-disable-msg');
      if (!/^\d{6}$/.test(code)) {
        msg.textContent = 'Enter your current 6-digit authenticator code.';
        msg.className = 'twofa-msg twofa-error show';
        return;
      }
      const btn = document.getElementById('twofa-disable-btn');
      btn.disabled = true;
      btn.textContent = 'Removing…';
      try {
        const data = await fetchJson('/api/auth/2fa/disable', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code }),
        });
        if (data.user) currentUser = { ...currentUser, ...data.user };
        render2FAPanel(currentUser);
      } catch (err) {
        msg.textContent = err.message;
        msg.className = 'twofa-msg twofa-error show';
        btn.disabled = false;
        btn.textContent = 'Remove';
      }
    });
  }

  // Email 2FA handlers
  document.getElementById('twofa-email-enable-btn')?.addEventListener('click', async () => {
    const btn = document.getElementById('twofa-email-enable-btn');
    const msg = document.getElementById('twofa-email-enable-msg');
    btn.disabled = true;
    btn.textContent = 'Enabling…';
    try {
      const data = await fetchJson('/api/auth/2fa/email/enable', { method: 'POST' });
      if (data.user) currentUser = { ...currentUser, ...data.user };
      render2FAPanel(currentUser);
    } catch (err) {
      msg.textContent = err.message;
      msg.className = 'twofa-msg twofa-error show';
      btn.disabled = false;
      btn.textContent = 'Turn on email verification';
    }
  });

  document.getElementById('twofa-email-disable-btn')?.addEventListener('click', async () => {
    const btn = document.getElementById('twofa-email-disable-btn');
    const msg = document.getElementById('twofa-email-disable-msg');
    btn.disabled = true;
    btn.textContent = 'Turning off…';
    try {
      const data = await fetchJson('/api/auth/2fa/email/disable', { method: 'POST' });
      if (data.user) currentUser = { ...currentUser, ...data.user };
      render2FAPanel(currentUser);
    } catch (err) {
      msg.textContent = err.message;
      msg.className = 'twofa-msg twofa-error show';
      btn.disabled = false;
      btn.textContent = 'Turn off email verification';
    }
  });

  // Change password — step 1: validate + send code
  document.getElementById('change-password-btn')?.addEventListener('click', async () => {
    const currentPw = document.getElementById('change-password-current')?.value || '';
    const newPw = document.getElementById('change-password-new')?.value || '';
    const confirmPw = document.getElementById('change-password-confirm')?.value || '';
    const msg = document.getElementById('change-password-msg');
    const btn = document.getElementById('change-password-btn');
    msg.className = 'twofa-msg hidden';

    if (!currentPw || !newPw || !confirmPw) {
      msg.textContent = 'Please fill in all three fields.';
      msg.className = 'twofa-msg twofa-error show';
      return;
    }
    if (newPw !== confirmPw) {
      msg.textContent = 'New passwords do not match.';
      msg.className = 'twofa-msg twofa-error show';
      return;
    }

    btn.disabled = true;
    btn.textContent = 'Sending code…';
    try {
      const data = await fetchJson('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword: currentPw, newPassword: newPw }),
      });
      // Show code entry step
      const form = document.getElementById('change-password-form-fields');
      const codeStep = document.getElementById('change-password-code-step');
      if (form) form.classList.add('hidden');
      if (codeStep) codeStep.classList.remove('hidden');
      msg.textContent = data.message;
      msg.className = 'twofa-msg twofa-success show';
    } catch (err) {
      msg.textContent = err.message;
      msg.className = 'twofa-msg twofa-error show';
      btn.disabled = false;
      btn.textContent = 'Send verification code';
    }
  });

  // Change password — step 2: confirm with code
  document.getElementById('change-password-confirm-btn')?.addEventListener('click', async () => {
    const code = document.getElementById('change-password-code')?.value.trim() || '';
    const msg = document.getElementById('change-password-msg');
    const btn = document.getElementById('change-password-confirm-btn');
    msg.className = 'twofa-msg hidden';

    if (!/^\d{6}$/.test(code)) {
      msg.textContent = 'Enter the 6-digit code from your email.';
      msg.className = 'twofa-msg twofa-error show';
      return;
    }

    btn.disabled = true;
    btn.textContent = 'Confirming…';
    try {
      const data = await fetchJson('/api/auth/change-password/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      });
      msg.textContent = data.message;
      msg.className = 'twofa-msg twofa-success show';
      // Reset the whole form
      render2FAPanel(currentUser);
    } catch (err) {
      msg.textContent = err.message;
      msg.className = 'twofa-msg twofa-error show';
      btn.disabled = false;
      btn.textContent = 'Confirm';
    }
  });

  // Start over link
  document.getElementById('change-password-restart')?.addEventListener('click', () => {
    const form = document.getElementById('change-password-form-fields');
    const codeStep = document.getElementById('change-password-code-step');
    if (form) form.classList.remove('hidden');
    if (codeStep) codeStep.classList.add('hidden');
    const msg = document.getElementById('change-password-msg');
    msg.className = 'twofa-msg hidden';
    const btn = document.getElementById('change-password-btn');
    btn.disabled = false;
    btn.textContent = 'Send verification code';
  });
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

function updateTwoFALoginForm() {
  const desc = document.getElementById('twofa-login-desc');
  const resendWrap = document.getElementById('twofa-resend-wrap');
  const label = document.querySelector('label[for="twofa-login-code"]');
  if (pending2FAMethod === 'email') {
    if (desc) desc.textContent = `A 6-digit code was sent to ${pending2FAEmailHint || 'your email'}.`;
    if (label) label.textContent = 'Email code';
    if (resendWrap) resendWrap.classList.remove('hidden');
  } else {
    if (desc) desc.textContent = 'Enter the 6-digit code from your authenticator app.';
    if (label) label.textContent = 'Authenticator code';
    if (resendWrap) resendWrap.classList.add('hidden');
  }
}

document.getElementById('twofa-login-submit')?.addEventListener('click', async () => {
  const codeInput = document.getElementById('twofa-login-code');
  const errorEl = document.getElementById('twofa-login-error');
  const btn = document.getElementById('twofa-login-submit');
  const code = codeInput.value.trim().replace(/\s/g, '');
  errorEl.textContent = '';
  if (!/^\d{6}$/.test(code)) {
    errorEl.textContent = pending2FAMethod === 'email'
      ? 'Enter the 6-digit code sent to your email.'
      : 'Enter the 6-digit code from your authenticator app.';
    return;
  }
  setButtonLoading(btn, true);
  try {
    currentUser = await fetchJson('/api/auth/2fa/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code }),
    });
    currentUser = await fetchJson('/api/auth/me');
    codeInput.value = '';
    clearAppRoute();
    playLoginSplash(() => enterDashboard(currentUser));
  } catch (err) {
    errorEl.textContent = err.message || 'Invalid code. Try again.';
    codeInput.value = '';
    codeInput.focus();
  } finally {
    setButtonLoading(btn, false);
  }
});

document.getElementById('twofa-resend-btn')?.addEventListener('click', async () => {
  const btn = document.getElementById('twofa-resend-btn');
  const errorEl = document.getElementById('twofa-login-error');
  btn.disabled = true;
  btn.textContent = 'Sending…';
  errorEl.textContent = '';
  try {
    await fetchJson('/api/auth/2fa/email/resend', { method: 'POST' });
    btn.textContent = 'Code resent';
    setTimeout(() => { btn.textContent = 'Resend code'; btn.disabled = false; }, 30000);
  } catch (err) {
    errorEl.textContent = err.message || 'Could not resend. Please sign in again.';
    btn.textContent = 'Resend code';
    btn.disabled = false;
  }
});

vehicleSeatCountSelect.addEventListener('change', () => {
  currentVehicleSeatCount = Number(vehicleSeatCountSelect.value);
  driverAvailableSeatIds = new Set();
  renderDriverSeatLayout();
});
rideProviderChoices.forEach((button) => {
  button.addEventListener('click', () => chooseOfferProviderType(button.dataset.providerType));
});
changeRideProviderButton?.addEventListener('click', () => resetOfferProviderSelection());
try {
  renderDriverSeatLayout();
  updateOfferProviderFields();
} catch (error) {
  console.error('Ride listing controls failed to initialize:', error);
}
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
  const submitButton = signupForm.querySelector('button[type="submit"]');
  setButtonLoading(submitButton, true);
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
    setButtonLoading(submitButton, false);
    signupError.textContent = 'You must agree to the Terms and Conditions and Privacy Notice before creating an account.';
    signupError.classList.add('show');
    return;
  }
  try {
    const inviteCode = new URLSearchParams(window.location.search).get('invite') || '';
    const data = await fetchJson('/api/auth/signup', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ firstName, middleName, lastName, birthday, gender, email, password, termsAccepted, privacyAccepted, inviteCode }) });
    setButtonLoading(submitButton, false);
    signupForm.reset();
    if (data.requiresVerification === false) {
      currentUser = data.user || await fetchJson('/api/auth/me');
      showDashboard(currentUser);
      return;
    }
    showVerificationForm(data.email, data.message);
  } catch (err) {
    setButtonLoading(submitButton, false);
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
window.__linkupSignupHandlerAttached = true;

waitlistQuickForm?.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (waitlistQuickMessage) {
    waitlistQuickMessage.textContent = '';
    waitlistQuickMessage.classList.remove('show');
  }
  if (waitlistQuickError) {
    waitlistQuickError.textContent = '';
    waitlistQuickError.classList.remove('show');
  }

  const firstName = document.getElementById('waitlist-first-name')?.value.trim() || '';
  const email = document.getElementById('waitlist-email')?.value.trim() || '';
  const waitlistIntent = waitlistQuickForm.querySelector('input[name="waitlist-quick-intent"]:checked')?.value || 'unsure';

  setButtonLoading(waitlistQuickSubmit, true);
  try {
    const data = await fetchJson('/api/waitlist/join', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ firstName, email, waitlistIntent }),
    });
    setButtonLoading(waitlistQuickSubmit, false);

    if (data.accountExists) {
      if (waitlistQuickMessage) {
        waitlistQuickMessage.textContent = data.message || 'That email already has a LinkUp account. Sign in to continue.';
        waitlistQuickMessage.classList.add('show');
      }
      const signinEmail = document.getElementById('signin-email');
      if (signinEmail) signinEmail.value = email;
      return;
    }

    waitlistQuickForm.reset();
    const riderChoice = waitlistQuickForm.querySelector('input[name="waitlist-quick-intent"][value="rider"]');
    if (riderChoice) riderChoice.checked = true;
    if (waitlistQuickMessage) {
      waitlistQuickMessage.textContent = data.message || 'You are on the waitlist.';
      waitlistQuickMessage.classList.add('show');
    }
    loadWaitlistLeaderboard();
  } catch (err) {
    setButtonLoading(waitlistQuickSubmit, false);
    if (waitlistQuickError) {
      waitlistQuickError.textContent = err.message || 'Unable to join the waitlist right now.';
      waitlistQuickError.classList.add('show');
    }
  }
});

offerForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const offerSubmitButton = offerForm.querySelector('button[type="submit"]');
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
  const parkingFee = document.getElementById('ride-parking-fee')?.value || '0';
  const carMaker = document.getElementById('car-maker').value.trim();
  const carModel = document.getElementById('car-model').value.trim();
  const carColor = document.getElementById('car-color').value.trim();
  const licensePlate = document.getElementById('license-plate').value.trim();
  const termsAccepted = document.getElementById('ride-terms-agree').checked;
  const driverDisclaimerAccepted = document.getElementById('ride-driver-disclaimer').checked;
  const pickupRadiusMiles = getRadiusInputMiles(offerPickupRadiusInput);
  const dropoffRadiusMiles = getRadiusInputMiles(offerDropoffRadiusInput);
  const notes = document.getElementById('notes').value.trim();
  // Validate all fields BEFORE firing the Google Maps metrics API call to avoid wasting quota
  if (!origin || !destination || !date || !time || !rideProviderType || !price || !termsAccepted) {
    showToast('Fill in all required fields and select both locations.', 'error');
    return;
  }
  if (!driverDisclaimerAccepted) {
    showToast('Confirm you have a valid license and insurance before posting a ride.', 'error');
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
  if (rideProviderType === 'moving_service' && !document.getElementById('moving-vehicle-type')?.value) {
    showToast('Select a vehicle type for your moving service.', 'error');
    return;
  }
  if (Number(price) < 0.5) {
    showToast('Price must be at least $0.50.', 'error');
    return;
  }
  if (parkingFee && Number(parkingFee) < 0) {
    showToast('Parking / airport fee cannot be negative.', 'error');
    return;
  }
  if (sameGenderOnly && (!currentUser.gender || currentUser.gender === 'prefer-not-to-say')) {
    showToast('Set a visible gender on your profile before offering same-gender rides.', 'error');
    return;
  }
  // All validation passed — now estimate route metrics
  setButtonLoading(offerSubmitButton, true);
  try {
    const rideMetrics = await estimateRideMetrics(
      { lat: Number(originLat), lng: Number(originLng) },
      { lat: Number(destinationLat), lng: Number(destinationLng) },
      date,
      time
    );
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
        parkingFee: Number(parkingFee || 0),
        carMaker,
        carModel,
        carColor,
        licensePlate,
        termsAccepted,
        driverDisclaimerAccepted,
        estimatedDurationMinutes: rideMetrics.durationMinutes,
        distanceMiles: rideMetrics.distanceMiles,
        notes,
        movingVehicleType: document.getElementById('moving-vehicle-type')?.value || '',
        movingCapacity: document.getElementById('moving-capacity')?.value || 'Small',
        movingLoadingHelp: document.getElementById('moving-loading-help')?.checked || false,
        movingFurniture: document.getElementById('moving-furniture')?.checked || false,
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
    setButtonLoading(offerSubmitButton, false);
    loadRides();
    loadProfile();
    showToast('Ride posted! Riders can now find and book it.', 'success');
    showDashboardHome();
  } catch (err) {
    setButtonLoading(offerSubmitButton, false);
    showToast(err.message, 'error');
  }
});

requestRideButton.addEventListener('click', () => showRequestRidePage());
requestRideBackHomeButton.addEventListener('click', () => returnToBrowseRides());
requestRideForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  clearRequestRideMessages();
  const requestSubmitButton = document.getElementById('request-submit-btn');
  const submittingRequestType = document.getElementById('request-type')?.value || 'ride';
  if (submittingRequestType === 'moving' && !movingRequestPhotoDataUrl) {
    requestRideError.textContent = 'Please add a photo of your items so drivers know what to expect.';
    requestRideError.classList.add('show');
    document.getElementById('moving-photo-upload-area')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    return;
  }
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
    requestType: document.getElementById('request-type')?.value || 'ride',
    movingSize: document.getElementById('request-moving-size')?.value || 'Small',
    movingPhotoDataUrl: movingRequestPhotoDataUrl || undefined,
    riderCount: Number(document.getElementById('request-rider-count').value) || 1,
    willingToPay: Number(document.getElementById('request-price').value),
    estimatedDurationMinutes: requestRideMetrics.durationMinutes,
    distanceMiles: requestRideMetrics.distanceMiles,
    hideDestination: document.getElementById('request-hide-destination').checked,
    shareRideWithOthers: document.getElementById('request-share-ride').checked,
    sameGenderDriverOnly: document.getElementById('request-same-gender-driver').checked,
    sameSchoolDriverOnly: document.getElementById('request-same-school-driver').checked,
    noSmoking: submittingRequestType !== 'moving' && document.getElementById('request-no-smoking')?.checked === true,
    notes: document.getElementById('request-notes').value.trim(),
  };
  setButtonLoading(requestSubmitButton, true);
  try {
    await fetchJson('/api/ride-requests', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    setButtonLoading(requestSubmitButton, false);
    requestRideForm.reset();
    const destHint = document.getElementById('request-destination-hint');
    if (destHint) destHint.textContent = 'Only a general area is shown to drivers until one accepts your request.';
    resetMovingPhoto();
    document.getElementById('request-type').value = 'ride';
    document.querySelectorAll('.request-type-btn').forEach((b) => b.classList.toggle('active', b.dataset.requestType === 'ride'));
    document.getElementById('request-riders-field')?.classList.remove('hidden');
    document.getElementById('request-moving-fields')?.classList.add('hidden');
    document.getElementById('request-share-field')?.classList.remove('hidden');
    document.getElementById('request-preference-field')?.classList.remove('hidden');
    document.getElementById('request-notes').placeholder = 'Luggage, timing flexibility, pickup details…';
    document.getElementById('request-submit-btn').textContent = 'Post request';
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
    setButtonLoading(requestSubmitButton, false);
    requestRideError.textContent = err.message;
    requestRideError.classList.add('show');
  }
});
const movingPhotoInput = document.getElementById('request-moving-photo-input');
const movingPhotoPreview = document.getElementById('request-moving-photo-preview');
const movingPhotoPrompt = document.getElementById('moving-photo-prompt');
const movingPhotoRemove = document.getElementById('request-moving-photo-remove');

function resetMovingPhoto() {
  movingRequestPhotoDataUrl = '';
  if (movingPhotoInput) movingPhotoInput.value = '';
  if (movingPhotoPreview) { movingPhotoPreview.src = ''; movingPhotoPreview.classList.add('hidden'); }
  if (movingPhotoPrompt) movingPhotoPrompt.style.display = '';
  if (movingPhotoRemove) movingPhotoRemove.classList.add('hidden');
}

if (movingPhotoInput) {
  movingPhotoInput.addEventListener('change', () => {
    const file = movingPhotoInput.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      showToast('Please choose a photo (PNG, JPG, or WebP)', 'error');
      movingPhotoInput.value = '';
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      showToast('Photo must be 2 MB or smaller', 'error');
      movingPhotoInput.value = '';
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      movingRequestPhotoDataUrl = event.target.result;
      if (movingPhotoPreview) { movingPhotoPreview.src = movingRequestPhotoDataUrl; movingPhotoPreview.classList.remove('hidden'); }
      if (movingPhotoPrompt) movingPhotoPrompt.style.display = 'none';
      if (movingPhotoRemove) movingPhotoRemove.classList.remove('hidden');
    };
    reader.readAsDataURL(file);
  });
}

if (movingPhotoRemove) {
  movingPhotoRemove.addEventListener('click', () => resetMovingPhoto());
}

document.getElementById('request-hide-destination')?.addEventListener('change', (e) => {
  const hint = document.getElementById('request-destination-hint');
  if (hint) hint.textContent = e.target.checked
    ? 'Only a general area is shown to drivers until one accepts your request.'
    : 'Your exact drop-off will be visible to all drivers browsing requests.';
});

document.querySelectorAll('.request-type-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    const type = btn.dataset.requestType;
    document.getElementById('request-type').value = type;
    document.querySelectorAll('.request-type-btn').forEach((b) => b.classList.toggle('active', b === btn));
    const isMoving = type === 'moving';
    document.getElementById('request-riders-field')?.classList.toggle('hidden', isMoving);
    document.getElementById('request-moving-fields')?.classList.toggle('hidden', !isMoving);
    document.getElementById('request-share-field')?.classList.toggle('hidden', isMoving);
    document.getElementById('request-preference-field')?.classList.toggle('hidden', isMoving);
    const priceLabel = document.getElementById('request-price-label');
    if (priceLabel?.firstChild?.nodeType === Node.TEXT_NODE) {
      priceLabel.firstChild.textContent = isMoving ? 'Budget for move ($) ' : 'Price willing to pay ($) ';
    }
    const notesInput = document.getElementById('request-notes');
    if (notesInput) notesInput.placeholder = isMoving ? 'Stairs, fragile items, parking, time window…' : 'Luggage, timing flexibility, pickup details…';
    const submitBtn = document.getElementById('request-submit-btn');
    if (submitBtn) submitBtn.textContent = isMoving ? 'Post moving request' : 'Post request';
    const originLabel = document.getElementById('request-origin-label');
    if (originLabel) originLabel.textContent = isMoving ? 'Pick-up address' : 'Pick-up location';
    const destLabel = document.getElementById('request-destination-label');
    if (destLabel) destLabel.textContent = isMoving ? 'Drop-off address' : 'Drop-off location';
    const riderCount = document.getElementById('request-rider-count');
    if (riderCount) riderCount.required = !isMoving;
  });
});

listRideButton.addEventListener('click', () => showListRidePage());
listRideBackHomeButton.addEventListener('click', () => returnToBrowseRides());
chatButton.addEventListener('click', () => showChatPage());
socialButton?.addEventListener('click', () => {
  if (isSocialPreviewEnabled()) showSocialPage();
});
chatBackHomeButton.addEventListener('click', () => returnToBrowseRides());
chatRideTab?.addEventListener('click', () => setChatSection('ride'));
chatSocialTab?.addEventListener('click', () => {
  if (isSocialPreviewEnabled()) setChatSection('social');
});
cartButton.addEventListener('click', () => showCartPage());
yourRidesButton.addEventListener('click', () => showYourRidesPage());
yourRidesDrivingTab.addEventListener('click', () => { setYourRidesView('driving'); loadYourRides(); });
yourRidesRidingTab.addEventListener('click', () => { setYourRidesView('riding'); loadYourRides(); });
yourRidesRequestsTab.addEventListener('click', () => { setYourRidesView('requests'); loadYourRides(); });
yourRidesHistoryTab.addEventListener('click', () => { setYourRidesView('history'); loadYourRides(); });
yourRidesBackHomeButton.addEventListener('click', () => returnToBrowseRides());
leaderboardButton.addEventListener('click', () => showLeaderboardPage());
leaderboardBackHomeButton.addEventListener('click', () => returnToBrowseRides());
publicProfileBackHomeButton.addEventListener('click', () => returnToBrowseRides());
profileButton.addEventListener('click', () => showProfilePage());
waitlistProfileButton?.addEventListener('click', () => showProfilePage('info'));
waitlistIntentButtons.forEach((button) => {
  button.addEventListener('click', async () => {
    const waitlistIntent = button.dataset.waitlistIntent || '';
    const previousIntent = currentUser?.waitlistIntent || '';
    renderWaitlistIntent(waitlistIntent);
    if (waitlistIntentMessage) waitlistIntentMessage.textContent = 'Saving...';
    waitlistIntentButtons.forEach((item) => { item.disabled = true; });
    try {
      const user = await fetchJson('/api/profile/waitlist-intent', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ waitlistIntent }),
      });
      currentUser = user;
      renderWaitlistIntent(user.waitlistIntent || '');
      if (waitlistIntentMessage) waitlistIntentMessage.textContent = 'Saved.';
    } catch (err) {
      renderWaitlistIntent(previousIntent);
      if (waitlistIntentMessage) waitlistIntentMessage.textContent = err.message || 'Unable to save right now.';
    } finally {
      waitlistIntentButtons.forEach((item) => { item.disabled = false; });
    }
  });
});
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
    if (button.hidden) return;
    clearDefaultPaymentMessages();
    clearPayoutMessages();
    clearAppearanceMessages();
    showProfileTab(button.dataset.profileTab);
  });
});

adminTabs.forEach((button) => {
  button.addEventListener('click', () => {
    adminView = button.dataset.adminTab || 'reports';
    renderAdminTable();
  });
});

adminTableWrap?.addEventListener('change', async (event) => {
  const select = event.target.closest?.('.admin-report-status');
  if (!select) return;
  clearAdminMessages();
  const note = adminTableWrap.querySelector(`.admin-report-note[data-report-id="${CSS.escape(select.dataset.reportId || '')}"]`);
  try {
    await fetchJson('/api/admin/reports/' + encodeURIComponent(select.dataset.reportId), {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: select.value, adminNote: note?.value || '' }),
    });
    showAdminMessage('Report status updated.');
    await loadAdminOverview();
  } catch (err) {
    showAdminMessage(err.message || 'Unable to update report.', 'error');
  }
});

adminTableWrap?.addEventListener('click', async (event) => {
  const reportButton = event.target.closest?.('.admin-report-save');
  if (reportButton) {
    clearAdminMessages();
    const reportId = reportButton.dataset.reportId || '';
    const status = adminTableWrap.querySelector(`.admin-report-status[data-report-id="${CSS.escape(reportId)}"]`);
    const note = adminTableWrap.querySelector(`.admin-report-note[data-report-id="${CSS.escape(reportId)}"]`);
    setButtonLoading(reportButton, true);
    try {
      await fetchJson('/api/admin/reports/' + encodeURIComponent(reportId), {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: status?.value || 'open', adminNote: note?.value || '' }),
      });
      showAdminMessage('Report note saved.');
      await loadAdminOverview();
    } catch (err) {
      showAdminMessage(err.message || 'Unable to update report.', 'error');
    } finally {
      setButtonLoading(reportButton, false);
    }
    return;
  }

  const button = event.target.closest?.('.admin-user-toggle');
  if (!button) return;
  clearAdminMessages();
  setButtonLoading(button, true);
  try {
    await fetchJson('/api/admin/users/' + encodeURIComponent(button.dataset.userId), {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ serviceApproved: button.dataset.approved === 'true' }),
    });
    showAdminMessage('User access updated.');
    await loadAdminOverview();
  } catch (err) {
    showAdminMessage(err.message || 'Unable to update user.', 'error');
  } finally {
    setButtonLoading(button, false);
  }
});

adminTableWrap?.addEventListener('click', async (event) => {
  const eatsBtn = event.target.closest?.('.admin-eats-toggle');
  if (eatsBtn) {
    clearAdminMessages();
    setButtonLoading(eatsBtn, true);
    try {
      await fetchJson('/api/admin/users/' + encodeURIComponent(eatsBtn.dataset.userId), {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eatsApproved: eatsBtn.dataset.eatsApproved === 'true' }),
      });
      showAdminMessage('Eats access updated.');
      await loadAdminOverview();
    } catch (err) {
      showAdminMessage(err.message || 'Unable to update Eats access.', 'error');
    } finally {
      setButtonLoading(eatsBtn, false);
    }
    return;
  }
});

adminTableWrap?.addEventListener('click', async (event) => {
  const button = event.target.closest?.('.admin-user-suspend, .admin-user-save-note, .admin-remove-ride, .admin-remove-request');
  if (!button) return;
  clearAdminMessages();
  setButtonLoading(button, true);
  try {
    if (button.classList.contains('admin-user-suspend') || button.classList.contains('admin-user-save-note')) {
      const userId = button.dataset.userId || '';
      const note = adminTableWrap.querySelector(`.admin-user-note[data-user-id="${CSS.escape(userId)}"]`)?.value || '';
      const payload = { moderationNote: note };
      if (button.classList.contains('admin-user-suspend')) {
        const suspending = button.dataset.suspended === 'true';
        if (suspending && !window.confirm('Suspend this user and block ride services?')) return;
        payload.suspended = suspending;
      }
      await fetchJson('/api/admin/users/' + encodeURIComponent(userId), {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      showAdminMessage(button.classList.contains('admin-user-suspend') ? 'User moderation status updated.' : 'Moderation note saved.');
      await loadAdminOverview();
      return;
    }

    const isRideRemoval = button.classList.contains('admin-remove-ride');
    const id = isRideRemoval ? button.dataset.rideId : button.dataset.requestId;
    const label = isRideRemoval ? 'ride' : 'request';
    const note = window.prompt('Moderation note for removing this ' + label + ':', 'Removed by LinkUp moderation') || '';
    if (!window.confirm('Remove this ' + label + ' from public views?')) return;
    await fetchJson('/api/admin/' + (isRideRemoval ? 'rides/' : 'ride-requests/') + encodeURIComponent(id || ''), {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ moderationNote: note }),
    });
    showAdminMessage((isRideRemoval ? 'Ride' : 'Request') + ' removed.');
    await loadAdminOverview();
  } catch (err) {
    showAdminMessage(err.message || 'Unable to complete moderation action.', 'error');
  } finally {
    setButtonLoading(button, false);
  }
});

themePreferenceInputs.forEach((input) => {
  input.addEventListener('change', async () => {
    if (!input.checked) return;
    clearAppearanceMessages();
    const nextTheme = applyThemePreference(input.value);
    if (currentUser) currentUser.themePreference = nextTheme;
    try {
      currentUser = await fetchJson('/api/profile/preferences', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ themePreference: nextTheme }),
      });
      applyThemePreference(currentUser.themePreference || nextTheme);
      appearanceMessage.textContent = 'Appearance saved.';
      appearanceMessage.classList.add('show');
    } catch (err) {
      appearanceMessage.textContent = 'Appearance saved on this device.';
      appearanceMessage.classList.add('show');
      appearanceError.textContent = 'Account sync will work after the production server is updated.';
      appearanceError.classList.add('show');
    }
  });
});

profilePictureInput?.addEventListener('change', () => {
  clearProfileMessages();
  const file = profilePictureInput.files?.[0];
  if (!file) return;
  handleProfilePictureFile(file);
});

// ── Profile photo menu ─────────────────────────────────────
function closeProfilePhotoMenu() {
  profilePhotoMenu?.classList.remove('open');
  profileAvatarEditBtn?.setAttribute('aria-expanded', 'false');
}

profileAvatarEditBtn?.addEventListener('click', (e) => {
  e.stopPropagation();
  const isOpen = profilePhotoMenu?.classList.contains('open');
  profilePhotoMenu?.classList.toggle('open', !isOpen);
  profileAvatarEditBtn.setAttribute('aria-expanded', String(!isOpen));
});

profilePhotoUploadBtn?.addEventListener('click', () => {
  closeProfilePhotoMenu();
  profilePictureInput?.click();
});

document.addEventListener('click', (e) => {
  if (!e.target.closest?.('.profile-avatar-edit-wrap')) closeProfilePhotoMenu();
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeProfilePhotoMenu();
});

// Drag-and-drop directly onto the avatar
(function () {
  const wrap = document.querySelector('.profile-avatar-edit-wrap');
  if (!wrap) return;
  function preventDefaults(e) { e.preventDefault(); e.stopPropagation(); }
  ['dragenter', 'dragover'].forEach(evt => {
    wrap.addEventListener(evt, e => { preventDefaults(e); wrap.classList.add('drag-over'); });
  });
  ['dragleave', 'dragend', 'drop'].forEach(evt => {
    wrap.addEventListener(evt, e => { preventDefaults(e); wrap.classList.remove('drag-over'); });
  });
  wrap.addEventListener('drop', e => {
    const file = e.dataTransfer?.files?.[0];
    if (file) { closeProfilePhotoMenu(); handleProfilePictureFile(file); }
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
  closeProfilePhotoMenu();
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
policyTermsButton?.addEventListener('click', (event) => {
  event.preventDefault();
  openLegalModal('terms');
});
policyPrivacyButton?.addEventListener('click', (event) => {
  event.preventDefault();
  openLegalModal('privacy');
});
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
  const btn = stripePayoutConnectButton;
  const origText = btn.textContent;
  btn.disabled = true;
  btn.textContent = 'Opening Stripe…';
  try {
    const data = await fetchJson('/api/profile/payout/onboarding', { method: 'POST' });
    if (data.url) {
      window.open(data.url, '_blank', 'noopener');
      payoutMessage.textContent = "Stripe opened in a new tab. Come back here and click Refresh status when you're done.";
      payoutMessage.classList.add('show');
    }
  } catch (err) {
    payoutError.textContent = err.message || 'Unable to open Stripe onboarding. Please try again.';
    payoutError.classList.add('show');
  } finally {
    btn.disabled = false;
    btn.textContent = origText;
  }
});

stripePayoutHistoryButton?.addEventListener('click', () => {
  clearPayoutMessages();
  mountStripeConnectComponent('payouts');
});

stripePayoutRefreshButton?.addEventListener('click', async () => {
  clearPayoutMessages();
  setButtonLoading(stripePayoutRefreshButton, true);
  try {
    currentUser = await fetchJson('/api/profile/payout/status', { method: 'POST' });
    fillDriverPayoutForm(currentUser);
    payoutMessage.textContent = currentUser.payoutInfo?.stripe?.payoutsEnabled
      ? 'Stripe payouts are active.'
      : 'Status refreshed.';
    payoutMessage.classList.add('show');
  } catch (err) {
    payoutError.textContent = err.message;
    payoutError.classList.add('show');
  } finally {
    setButtonLoading(stripePayoutRefreshButton, false);
  }
});
schoolTransferForm?.addEventListener('submit', async (event) => {
  event.preventDefault();
  clearSchoolTransferMessages();
  const submitButton = schoolTransferForm.querySelector('button[type="submit"]');
  setButtonLoading(submitButton, true);
  try {
    const response = await fetchJson('/api/profile/school-transfer/request', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        university: schoolTransferCollege?.value.trim() || '',
        email: schoolTransferEmail?.value.trim() || '',
      }),
    });
    currentUser = {
      ...currentUser,
      pendingSchoolTransfer: response.pendingSchoolTransfer || currentUser?.pendingSchoolTransfer || null,
    };
    fillSchoolTransferForm(currentUser);
    if (schoolTransferCollege) schoolTransferCollege.value = currentUser.pendingSchoolTransfer?.university || schoolTransferCollege.value;
    schoolTransferMessage.textContent = response.message || 'Verification code sent.';
    schoolTransferMessage.classList.add('show');
  } catch (err) {
    schoolTransferError.textContent = err.message || 'Unable to start school transfer.';
    schoolTransferError.classList.add('show');
  } finally {
    setButtonLoading(submitButton, false);
  }
});

schoolTransferVerifyButton?.addEventListener('click', async () => {
  clearSchoolTransferMessages();
  setButtonLoading(schoolTransferVerifyButton, true);
  try {
    const response = await fetchJson('/api/profile/school-transfer/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: schoolTransferCode?.value.trim() || '' }),
    });
    currentUser = response.user || currentUser;
    updateUserHeader(currentUser);
    fillProfileForm(currentUser);
    fillSchoolTransferForm(currentUser);
    if (schoolTransferCollege) schoolTransferCollege.value = '';
    if (schoolTransferEmail) schoolTransferEmail.value = '';
    if (schoolTransferCode) schoolTransferCode.value = '';
    schoolTransferMessage.textContent = response.message || 'School transfer verified.';
    schoolTransferMessage.classList.add('show');
    loadLeaderboard();
  } catch (err) {
    schoolTransferError.textContent = err.message || 'Unable to verify school transfer.';
    schoolTransferError.classList.add('show');
  } finally {
    setButtonLoading(schoolTransferVerifyButton, false);
  }
});
browseRidesButton.addEventListener('click', () => showBrowsePage());
copyTrackingLinkButton?.addEventListener('click', () => copyTrackingLink());
sendTrackingInviteButton?.addEventListener('click', () => sendTrackingInvite());
startTrackingButton.addEventListener('click', () => startTripTracking());
stopTrackingButton.addEventListener('click', () => stopTripTracking());
startSafetyRecordingButton?.addEventListener('click', () => startSafetyRecording());
stopSafetyRecordingButton?.addEventListener('click', () => stopSafetyRecording());
sendSafetyNoteButton?.addEventListener('click', () => sendSafetyIncident());
reportDoorSafetyButton?.addEventListener('click', () => sendSafetyIncident({ doorIssue: true }));
continueShoppingButton.addEventListener('click', () => returnToBrowseRides());
userSearchForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  openUserSearchPopover();
  searchUsers(userSearchInput?.value || '');
});
userSearchInput?.addEventListener('focus', () => {
  openUserSearchPopover();
});
userSearchInput?.addEventListener('input', () => {
  openUserSearchPopover();
  window.clearTimeout(userSearchDebounceTimer);
  const query = userSearchInput.value || '';
  if (query.trim().length < 2) {
    showUserSearchEmpty('Type at least 2 characters to search.');
    return;
  }
  userSearchDebounceTimer = window.setTimeout(() => searchUsers(query), 250);
});
userSearchInput?.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    closeUserSearchPopover();
    userSearchInput.blur();
  }
});
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

notificationPreferencesForm?.addEventListener('submit', async (event) => {
  event.preventDefault();
  clearNotificationPreferenceMessages();
  const notificationPreferences = {
    weeklyRecapEmail: Boolean(weeklyRecapEmailInput?.checked),
    rideAlertEmail: Boolean(rideAlertEmailInput?.checked),
  };
  setButtonLoading(notificationPreferencesSubmit, true);
  try {
    const data = await fetchJson('/api/profile/notifications', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ notificationPreferences }),
    });
    currentUser = { ...(currentUser || {}), notificationPreferences: data.notificationPreferences };
    fillNotificationPreferencesForm(currentUser);
    notificationPreferencesMessage.textContent = data.message || 'Notification preferences saved.';
    notificationPreferencesMessage.classList.add('show');
  } catch (err) {
    notificationPreferencesError.textContent = err.message || 'Unable to save notification preferences.';
    notificationPreferencesError.classList.add('show');
  } finally {
    setButtonLoading(notificationPreferencesSubmit, false);
  }
});

friendInviteForm?.addEventListener('submit', async (event) => {
  event.preventDefault();
  clearFriendInviteMessages();
  const email = friendInviteEmail?.value.trim() || '';
  setButtonLoading(friendInviteSubmit, true);
  try {
    const data = await fetchJson('/api/profile/invite-friend', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    if (friendInviteForm) friendInviteForm.reset();
    if (friendInviteCount && Number.isFinite(Number(data.inviteCount))) {
      friendInviteCount.textContent = String(data.inviteCount);
      if (currentUser) currentUser.friendInviteCount = Number(data.inviteCount);
    }
    if (friendInviteMessage) {
      friendInviteMessage.textContent = data.message || 'Invite sent.';
      friendInviteMessage.classList.add('show');
    }
  } catch (err) {
    if (friendInviteError) {
      friendInviteError.textContent = err.message || 'Unable to send invite.';
      friendInviteError.classList.add('show');
    }
  } finally {
    setButtonLoading(friendInviteSubmit, false);
  }
});

deleteAccountForm?.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (deleteAccountMessage) {
    deleteAccountMessage.textContent = '';
    deleteAccountMessage.classList.remove('show');
  }
  if (deleteAccountError) {
    deleteAccountError.textContent = '';
    deleteAccountError.classList.remove('show');
  }
  const password = document.getElementById('delete-account-password')?.value || '';
  const confirmText = document.getElementById('delete-account-confirm')?.value || '';
  setButtonLoading(deleteAccountSubmit, true);
  try {
    const data = await fetchJson('/api/profile/account', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password, confirmText }),
    });
    if (deleteAccountMessage) {
      deleteAccountMessage.textContent = data.message || 'Your account has been deleted.';
      deleteAccountMessage.classList.add('show');
    }
    currentUser = null;
    clearAppRoute();
    window.setTimeout(() => showAuthSection(), 450);
  } catch (err) {
    if (deleteAccountError) {
      deleteAccountError.textContent = err.message || 'Unable to delete account.';
      deleteAccountError.classList.add('show');
    }
  } finally {
    setButtonLoading(deleteAccountSubmit, false);
  }
});

friendInviteCopyButton?.addEventListener('click', async () => {
  clearFriendInviteMessages();
  const inviteUrl = friendInviteLink?.value || currentUser?.friendInviteUrl || '';
  if (!inviteUrl) {
    if (friendInviteLinkMessage) {
      friendInviteLinkMessage.textContent = 'Your invite link is still loading.';
      friendInviteLinkMessage.classList.add('show');
    }
    return;
  }
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(inviteUrl);
    } else if (friendInviteLink) {
      friendInviteLink.select();
      document.execCommand('copy');
      friendInviteLink.blur();
    }
    if (friendInviteLinkMessage) {
      friendInviteLinkMessage.textContent = 'Invite link copied.';
      friendInviteLinkMessage.classList.add('show');
    }
  } catch (err) {
    if (friendInviteLinkMessage) {
      friendInviteLinkMessage.textContent = 'Select the link and copy it manually.';
      friendInviteLinkMessage.classList.add('show');
    }
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
    const data = await fetchJson('/api/cart/create-embedded-checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rideIds: selectedRideIds, applyWalletCredit: walletCreditApplied }),
    });
    if (data.walletOnly) {
      paymentSummary.textContent = 'Your LinkUp wallet covers this checkout.';
      paymentMessage.textContent = formatCents(data.walletCreditCents || 0) + ' in wallet credit will be used.';
      paymentMessage.classList.add('show');
      await completeStripeCheckout(data.sessionId);
      return;
    }
    paymentSummary.textContent = data.walletCreditCents
      ? formatCents(data.walletCreditCents) + ' in wallet credit applied.'
      : '';
    document.getElementById('pay-cart').classList.add('hidden');
    await mountEmbeddedCheckout(data.clientSecret);
  } catch (err) {
    paymentError.textContent = err.message;
    paymentError.classList.add('show');
  }
});


document.addEventListener('visibilitychange', () => {
  if (!document.hidden && getStoredThemePreference() === 'auto') {
    applyThemePreference('auto', { persist: false });
  }
});

// Receive push token from the iOS native bridge and register it with the server
window.addEventListener('linkupnative', (event) => {
  const detail = event.detail || {};
  if (detail.action === 'pushToken' && detail.token) {
    fetchJson('/api/device-token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: detail.token, platform: 'ios' }),
    }).catch(() => {});
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
    showCartPage();
    cartError.textContent = err.message;
    cartError.classList.add('show');
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
const friendInviteCode = params.get('invite');
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
} else if (friendInviteCode) {
  Promise.all([checkAuth(), loadFriendInviteBanner(friendInviteCode)]).then(() => {
    if (!currentUser) showAuthForm('signup-form');
  }).finally(finishAppBoot);
} else {
  checkAuth().finally(finishAppBoot);
}

// Footer — dynamic copyright year
const footerYear = document.getElementById('footer-year');
if (footerYear) footerYear.textContent = new Date().getFullYear();

// ── Profile feedback panel ──────────────────────────────────────────────────
function resetFeedbackPanel() {
  const successEl = document.getElementById('feedback-profile-success');
  const errorEl = document.getElementById('feedback-profile-error');
  if (successEl) { successEl.textContent = ''; successEl.classList.remove('show'); }
  if (errorEl) { errorEl.textContent = ''; errorEl.classList.remove('show'); }
}

// ── LinkUp Eats ──────────────────────────────────────────────────

let eatsActiveTab = 'browse';

function setEatsTab(tab) {
  eatsActiveTab = tab;
  ['browse', 'post', 'requests'].forEach((t) => {
    document.getElementById(`eats-${t}-tab`)?.classList.toggle('active', t === tab);
    document.getElementById(`eats-${t}-panel`)?.classList.toggle('hidden', t !== tab);
  });
}

function formatEatsTime(isoString) {
  const d = new Date(isoString);
  const now = new Date();
  const diffMs = d - now;
  if (diffMs < 0) return 'soon';
  const diffMin = Math.round(diffMs / 60000);
  if (diffMin < 60) return `in ${diffMin} min`;
  const diffHr = Math.floor(diffMin / 60);
  const remMin = diffMin % 60;
  if (diffHr < 24) return remMin > 0 ? `in ${diffHr}h ${remMin}m` : `in ${diffHr}h`;
  return d.toLocaleString(undefined, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
}

function renderEatsStatusBadge(status) {
  const labels = { pending: 'Pending', accepted: 'Accepted', picked_up: 'Picked up', cancelled: 'Cancelled' };
  return `<span class="eats-status-badge eats-status-${status}">${labels[status] || status}</span>`;
}

let eatsCheckoutOffer = null;
let eatsBrowseMap = null;
let eatsBrowseMarkers = [];
let eatsBrowseInfoWindow = null;
let eatsCheckoutMap = null;
let eatsCheckoutMarker = null;
let eatsPickupLocationMap = null;
let eatsPickupLocationMarker = null;
let eatsDeliveryPreviewMap = null;
let eatsDeliveryPreviewMarker = null;

async function showEatsCheckout(offer) {
  eatsCheckoutOffer = offer;
  const activeCount = (offer.requests || []).filter((r) => r.status !== 'cancelled').length;
  const slotsLeft = offer.maxOrders - activeCount;

  const detailsEl = document.getElementById('eats-checkout-offer-details');
  if (detailsEl) {
    detailsEl.innerHTML = `
      <div class="eats-checkout-offer-card">
        <div class="eats-checkout-offer-row">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
          <div>
            <span class="eats-checkout-hall">${escapeHtml(offer.diningHall)}</span>
            <span class="eats-checkout-meta">By <strong>${escapeHtml(offer.userName)}</strong> · ${formatEatsTime(offer.pickupAt)} · ${slotsLeft} slot${slotsLeft !== 1 ? 's' : ''} left</span>
            ${offer.pickupLocation ? `<span class="eats-checkout-meta">Meet at: <strong>${escapeHtml(offer.pickupLocation)}</strong></span>` : ''}
            ${offer.notes ? `<span class="eats-checkout-notes">${escapeHtml(offer.notes)}</span>` : ''}
          </div>
        </div>
      </div>
      <h4 class="eats-checkout-section-label">Your order</h4>`;
  }

  const summaryEl = document.getElementById('eats-checkout-summary');
  if (summaryEl) {
    summaryEl.innerHTML = `
      <div class="eats-checkout-summary-rows">
        <div class="eats-checkout-summary-row">
          <span>Dining hall</span>
          <span>${escapeHtml(offer.diningHall)}</span>
        </div>
        ${offer.pickupLocation ? `<div class="eats-checkout-summary-row"><span>Meet at</span><span>${escapeHtml(offer.pickupLocation)}</span></div>` : ''}
        <div class="eats-checkout-summary-row">
          <span>Pickup time</span>
          <span>${formatEatsTime(offer.pickupAt)}</span>
        </div>
        <div class="eats-checkout-summary-row">
          <span>Picker</span>
          <span>${escapeHtml(offer.userName)}</span>
        </div>
        <div class="eats-checkout-summary-row eats-checkout-tip-row">
          <span>Price</span>
          <span class="eats-checkout-tip-amount">${offer.price > 0 ? `$${Number(offer.price).toFixed(2)}` : 'Free'}</span>
        </div>
      </div>`;
  }

  document.getElementById('eats-checkout-items').value = '';
  document.getElementById('eats-checkout-message').value = '';
  const errEl = document.getElementById('eats-checkout-error');
  if (errEl) { errEl.textContent = ''; errEl.classList.remove('show'); }

  hideDashboardPages();
  eatsCheckoutPage.classList.remove('hidden');
  document.getElementById('eats-checkout-items')?.focus();

  // Show meeting-point map if coordinates are available
  const mapWrap = document.getElementById('eats-checkout-map-wrap');
  const mapLabelText = document.getElementById('eats-checkout-map-label-text');
  const lat = Number(offer.pickupLocationLat);
  const lng = Number(offer.pickupLocationLng);
  if (mapWrap && Number.isFinite(lat) && Number.isFinite(lng)) {
    mapWrap.classList.remove('hidden');
    if (mapLabelText) mapLabelText.textContent = offer.pickupLocation || 'Meeting location';
    try {
      await loadGoogleMapsAPI();
      const mapDiv = document.getElementById('eats-checkout-map');
      if (!eatsCheckoutMap) {
        eatsCheckoutMap = new google.maps.Map(mapDiv, {
          zoom: 16,
          center: { lat, lng },
          styles: getGoogleMapStylesForTheme(),
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
          zoomControlOptions: { position: google.maps.ControlPosition.RIGHT_TOP },
        });
        eatsCheckoutMarker = new google.maps.Marker({
          position: { lat, lng },
          map: eatsCheckoutMap,
          title: offer.pickupLocation || offer.diningHall,
          icon: makeEatsMarkerIcon(true),
        });
      } else {
        eatsCheckoutMap.setCenter({ lat, lng });
        eatsCheckoutMap.setZoom(16);
        if (eatsCheckoutMarker) {
          eatsCheckoutMarker.setPosition({ lat, lng });
          eatsCheckoutMarker.setTitle(offer.pickupLocation || offer.diningHall);
        }
      }
    } catch { /* Maps unavailable — map wrap stays visible but empty */ }
  } else if (mapWrap) {
    mapWrap.classList.add('hidden');
  }
}

function hideEatsCheckout(tab = 'browse') {
  eatsCheckoutOffer = null;
  setAppRoute('eats');
  setActiveNavButton('eats-button');
  hideDashboardPages();
  eatsPage.classList.remove('hidden');
  if (tab === 'requests') {
    setEatsTab('requests');
    loadEatsFoodRequests();
  } else {
    setEatsTab('browse');
    loadEatsBrowse();
  }
}

function makeEatsMarkerIcon(active) {
  const color = active ? '#3ecfcf' : '#67d7d9';
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="40" viewBox="0 0 32 40"><path d="M16 0C7.163 0 0 7.163 0 16c0 10.5 16 24 16 24s16-13.5 16-24C32 7.163 24.837 0 16 0z" fill="${color}" opacity="${active ? '1' : '0.75'}"/><circle cx="16" cy="16" r="6" fill="white"/></svg>`;
  return { url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg), anchor: new google.maps.Point(16, 40) };
}

async function initEatsBrowseMap(offers) {
  const mapDiv = document.getElementById('eats-browse-map');
  if (!mapDiv) return;
  try {
    await loadGoogleMapsAPI();
    if (!eatsBrowseMap) {
      eatsBrowseMap = new google.maps.Map(mapDiv, {
        zoom: 14,
        center: getInitialMapCenter(),
        styles: getGoogleMapStylesForTheme(),
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
        zoomControlOptions: { position: google.maps.ControlPosition.RIGHT_TOP },
      });
      eatsBrowseInfoWindow = new google.maps.InfoWindow();
    }
    // Clear existing markers
    eatsBrowseMarkers.forEach((m) => m.setMap(null));
    eatsBrowseMarkers = [];

    const bounds = new google.maps.LatLngBounds();
    let hasCoords = false;
    offers.forEach((offer) => {
      const lat = Number(offer.pickupLocationLat);
      const lng = Number(offer.pickupLocationLng);
      if (!Number.isFinite(lat) || !Number.isFinite(lng)) return;
      const pos = { lat, lng };
      bounds.extend(pos);
      hasCoords = true;
      const marker = new google.maps.Marker({
        position: pos,
        map: eatsBrowseMap,
        title: offer.diningHall,
        icon: makeEatsMarkerIcon(false),
      });
      marker.addListener('click', () => {
        eatsBrowseMarkers.forEach((m) => m.setIcon(makeEatsMarkerIcon(false)));
        marker.setIcon(makeEatsMarkerIcon(true));
        eatsBrowseInfoWindow.setContent(`
          <div style="font-family:sans-serif;padding:4px 2px;min-width:160px">
            <strong style="font-size:0.95rem">${escapeHtml(offer.diningHall)}</strong><br>
            <span style="color:#3ecfcf;font-size:0.82rem">${formatEatsTime(offer.pickupAt)}</span><br>
            <span style="font-size:0.8rem;color:#888">${escapeHtml(offer.pickupLocation || '')}</span><br>
            <span style="font-size:0.8rem">${escapeHtml(offer.userName)} · ${offer.price > 0 ? '$' + Number(offer.price).toFixed(2) : 'Free'}</span>
          </div>`);
        eatsBrowseInfoWindow.open(eatsBrowseMap, marker);
        // Scroll to the matching card
        const card = document.querySelector(`[data-offer-id="${offer.id}"]`);
        card?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        card?.classList.add('eats-offer-card--highlighted');
        setTimeout(() => card?.classList.remove('eats-offer-card--highlighted'), 1800);
      });
      eatsBrowseMarkers.push(marker);
    });
    if (hasCoords) eatsBrowseMap.fitBounds(bounds, { top: 40, right: 40, bottom: 40, left: 40 });
  } catch { /* Maps unavailable */ }
}

function renderEatsBrowseList(offers) {
  const container = document.getElementById('eats-browse-list');
  if (!container) return;
  if (!offers || offers.length === 0) {
    container.innerHTML = '<p class="eats-empty">No active pickup offers right now. Be the first to offer one!</p>';
    return;
  }
  container.innerHTML = offers.map((offer) => {
    const activeCount = (offer.requests || []).filter((r) => r.status !== 'cancelled').length;
    const slotsLeft = offer.maxOrders - activeCount;
    const hasCoords = Number.isFinite(Number(offer.pickupLocationLat)) && Number.isFinite(Number(offer.pickupLocationLng));
    return `
      <article class="eats-offer-card" data-offer-id="${offer.id}">
        <div class="eats-card-header">
          <div class="eats-card-hall-row">
            <span class="eats-dining-hall">${escapeHtml(offer.diningHall)}</span>
            <span class="eats-pickup-time">${formatEatsTime(offer.pickupAt)}</span>
          </div>
          <div class="eats-card-meta-row">
            <span class="eats-card-picker">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              ${escapeHtml(offer.userName)}
            </span>
            <span class="eats-card-slots ${slotsLeft === 0 ? 'eats-card-slots--full' : ''}">${slotsLeft === 0 ? 'Full' : `${slotsLeft} slot${slotsLeft !== 1 ? 's' : ''} left`}</span>
            <span class="eats-price-badge">${offer.price > 0 ? `$${Number(offer.price).toFixed(2)}` : 'Free'}</span>
          </div>
        </div>
        ${offer.pickupLocation ? `
        <div class="eats-offer-location eats-card-location ${hasCoords ? 'eats-card-location--mapped' : ''}">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
          ${escapeHtml(offer.pickupLocation)}
        </div>` : ''}
        ${offer.notes ? `<p class="eats-offer-notes">${escapeHtml(offer.notes)}</p>` : ''}
        <div class="eats-offer-footer">
          ${slotsLeft > 0
            ? `<button type="button" class="eats-request-btn" data-offer-id="${offer.id}">Request pickup →</button>`
            : '<span class="eats-full-badge">Full</span>'}
          ${hasCoords ? `<button type="button" class="eats-map-pin-btn" data-offer-id="${offer.id}" title="Show on map" aria-label="Show on map"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg></button>` : ''}
        </div>
      </article>`;
  }).join('');

  const offersById = Object.fromEntries(offers.map((o) => [o.id, o]));
  container.querySelectorAll('.eats-request-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const offer = offersById[btn.dataset.offerId];
      if (offer) showEatsCheckout(offer);
    });
  });
  container.querySelectorAll('.eats-map-pin-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const offer = offersById[btn.dataset.offerId];
      if (!offer || !eatsBrowseMap) return;
      const lat = Number(offer.pickupLocationLat), lng = Number(offer.pickupLocationLng);
      if (!Number.isFinite(lat) || !Number.isFinite(lng)) return;
      eatsBrowseMap.panTo({ lat, lng });
      eatsBrowseMap.setZoom(16);
      const marker = eatsBrowseMarkers.find((m) => {
        const p = m.getPosition();
        return Math.abs(p.lat() - lat) < 0.0001 && Math.abs(p.lng() - lng) < 0.0001;
      });
      if (marker) google.maps.event.trigger(marker, 'click');
    });
  });

  initEatsBrowseMap(offers);
}

function renderEatsFoodRequests(requests, mine) {
  const container = document.getElementById('eats-requests-list');
  if (!container) return;
  let html = '';

  if (mine && mine.length > 0) {
    html += '<h4 class="eats-my-section-title">My requests</h4>';
    html += mine.map((r) => `
      <div class="eats-offer-card eats-my-offer-card">
        <div class="eats-offer-top">
          <div class="eats-offer-main">
            <span class="eats-dining-hall">${escapeHtml(r.diningHall)}</span>
            <span class="eats-pickup-time">${formatEatsTime(r.neededBy)}</span>
          </div>
          <div class="eats-offer-meta">
            ${renderEatsStatusBadge(r.status)}
            ${r.price > 0 ? `<span class="eats-price-badge">$${Number(r.price).toFixed(2)}</span>` : ''}
          </div>
          ${r.deliveryLocation ? `<div class="eats-offer-location"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>${escapeHtml(r.deliveryLocation)}</div>` : ''}
          <p class="eats-request-items" style="margin:0.3rem 0 0">${escapeHtml(r.items)}</p>
          ${r.claimedBy ? `<p class="eats-offer-notes">Claimed by ${escapeHtml(r.claimedBy.userName)}</p>` : ''}
        </div>
        ${r.status === 'open' ? `<button type="button" class="eats-cancel-fr-btn" data-id="${r.id}">Cancel request</button>` : ''}
      </div>`).join('');
    html += '<div class="eats-requests-divider"></div>';
  }

  if (requests && requests.length > 0) {
    html += '<h4 class="eats-my-section-title">Open requests from your school</h4>';
    html += requests.map((r) => `
      <div class="eats-offer-card" data-fr-id="${r.id}">
        <div class="eats-offer-top">
          <div class="eats-offer-main">
            <span class="eats-dining-hall">${escapeHtml(r.diningHall)}</span>
            <span class="eats-pickup-time">needed ${formatEatsTime(r.neededBy)}</span>
          </div>
          <div class="eats-offer-meta">
            <span>${escapeHtml(r.userName)}</span>
            ${r.price > 0 ? `<span class="eats-price-badge">$${Number(r.price).toFixed(2)}</span>` : '<span>Free</span>'}
          </div>
          ${r.deliveryLocation ? `<div class="eats-offer-location"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>${escapeHtml(r.deliveryLocation)}</div>` : ''}
          <p class="eats-request-items" style="margin:0.3rem 0 0">${escapeHtml(r.items)}</p>
          ${r.notes ? `<p class="eats-offer-notes">${escapeHtml(r.notes)}</p>` : ''}
        </div>
        <div class="eats-offer-actions">
          <button type="button" class="eats-claim-btn" data-id="${r.id}">Claim request →</button>
        </div>
      </div>`).join('');
  } else if (!mine || mine.length === 0) {
    html = '<p class="eats-empty">No open food requests right now. Post one if you need something!</p>';
  } else if (!requests || requests.length === 0) {
    html += '<p class="eats-empty" style="padding-top:1rem">No other open requests right now.</p>';
  }

  container.innerHTML = html;

  container.querySelectorAll('.eats-claim-btn').forEach((btn) => {
    btn.addEventListener('click', async () => {
      btn.disabled = true;
      btn.textContent = 'Claiming…';
      try {
        await fetchJson(`/api/eats/food-requests/${btn.dataset.id}/claim`, { method: 'POST' });
        showToast('Request claimed! Reach out to the student to coordinate.', 'success');
        loadEatsFoodRequests();
      } catch (err) {
        showToast(err.message || 'Could not claim request.', 'error');
        btn.disabled = false;
        btn.textContent = 'Claim request →';
      }
    });
  });

  container.querySelectorAll('.eats-cancel-fr-btn').forEach((btn) => {
    btn.addEventListener('click', async () => {
      btn.disabled = true;
      try {
        await fetchJson(`/api/eats/food-requests/${btn.dataset.id}/status`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: 'cancelled' }),
        });
        showToast('Request cancelled.', 'info');
        loadEatsFoodRequests();
      } catch (err) {
        showToast(err.message || 'Could not cancel.', 'error');
        btn.disabled = false;
      }
    });
  });
}

async function loadEatsBrowse() {
  const container = document.getElementById('eats-browse-list');
  if (container) container.innerHTML = '<p class="eats-empty">Loading pickups...</p>';
  try {
    const { offers } = await fetchJson('/api/eats');
    renderEatsBrowseList(offers);
  } catch (err) {
    if (container) container.innerHTML = `<p class="eats-empty error-message show">${err.message || 'Could not load pickups.'}</p>`;
  }
}

async function loadEatsFoodRequests() {
  const container = document.getElementById('eats-requests-list');
  if (container) container.innerHTML = '<p class="eats-empty">Loading requests...</p>';
  try {
    const { requests, mine } = await fetchJson('/api/eats/food-requests');
    renderEatsFoodRequests(requests, mine);
  } catch (err) {
    if (container) container.innerHTML = `<p class="eats-empty error-message show">${err.message || 'Could not load requests.'}</p>`;
  }
}

async function loadEatsList() {
  const container = document.getElementById('eats-list-offers');
  if (!container) return;
  try {
    const { myOffers } = await fetchJson('/api/eats/my');
    if (!myOffers || myOffers.length === 0) { container.innerHTML = ''; return; }
    container.innerHTML = '<h4 class="eats-my-section-title">Your active offers</h4>' +
      myOffers.filter((o) => o.status === 'open').map((offer) => {
        const pendingReqs = (offer.requests || []).filter((r) => r.status === 'pending');
        const acceptedReqs = (offer.requests || []).filter((r) => r.status === 'accepted');
        const reqsHtml = (offer.requests || []).filter((r) => r.status !== 'cancelled').map((r) => `
          <div class="eats-request-row">
            <div class="eats-request-row-info">
              <span class="eats-requester-name">${escapeHtml(r.userName)}</span>
              ${renderEatsStatusBadge(r.status)}
              <span class="eats-request-items">${escapeHtml(r.items)}</span>
            </div>
            <div class="eats-request-row-actions">
              ${r.status === 'pending' ? `<button type="button" class="eats-status-btn" data-offer="${offer.id}" data-req="${r.id}" data-status="accepted">Accept</button>` : ''}
              ${r.status === 'accepted' ? `<button type="button" class="eats-status-btn" data-offer="${offer.id}" data-req="${r.id}" data-status="picked_up">Picked up</button>` : ''}
            </div>
          </div>`).join('');
        return `
          <div class="eats-offer-card eats-my-offer-card">
            <div class="eats-offer-top">
              <div class="eats-offer-main">
                <span class="eats-dining-hall">${escapeHtml(offer.diningHall)}</span>
                <span class="eats-pickup-time">${formatEatsTime(offer.pickupAt)}</span>
              </div>
              <div class="eats-offer-meta">
                <span>${pendingReqs.length} pending · ${acceptedReqs.length} accepted</span>
              </div>
              ${offer.pickupLocation ? `<div class="eats-offer-location"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>${escapeHtml(offer.pickupLocation)}</div>` : ''}
            </div>
            ${reqsHtml ? `<div class="eats-requests-list">${reqsHtml}</div>` : '<p class="eats-empty eats-no-reqs">No requests yet.</p>'}
            <button type="button" class="eats-cancel-offer-btn" data-offer-id="${offer.id}">Cancel offer</button>
          </div>`;
      }).join('');

    container.querySelectorAll('.eats-status-btn').forEach((btn) => {
      btn.addEventListener('click', async () => {
        btn.disabled = true;
        try {
          await fetchJson(`/api/eats/${btn.dataset.offer}/requests/${btn.dataset.req}/status`, {
            method: 'PUT', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: btn.dataset.status }),
          });
          loadEatsList();
        } catch (err) { showToast(err.message || 'Could not update.', 'error'); btn.disabled = false; }
      });
    });
    container.querySelectorAll('.eats-cancel-offer-btn').forEach((btn) => {
      btn.addEventListener('click', async () => {
        btn.disabled = true;
        try {
          await fetchJson(`/api/eats/${btn.dataset.offerId}`, { method: 'DELETE' });
          showToast('Offer cancelled.', 'info');
          loadEatsList();
        } catch (err) { showToast(err.message || 'Could not cancel.', 'error'); btn.disabled = false; }
      });
    });
  } catch { /* silently skip */ }
}

function showEatsPage() {
  if (!isBitesEnabled()) {
    returnToBrowseRides();
    return;
  }
  if (currentUser && !currentUser.serviceApproved) {
    showWaitlistPage(currentUser);
    return;
  }
  setAppRoute('eats');
  setActiveNavButton('eats-button');
  hideDashboardPages();
  eatsPage.classList.remove('hidden');
  eatsCheckoutOffer = null;

  const onWaitlist = !currentUser?.eatsApproved;
  document.getElementById('eats-tabs')?.classList.toggle('hidden', onWaitlist);
  document.getElementById('eats-waitlist')?.classList.toggle('hidden', !onWaitlist);
  document.getElementById('eats-browse-panel')?.classList.toggle('hidden', onWaitlist);
  document.getElementById('eats-post-panel')?.classList.toggle('hidden', true);
  document.getElementById('eats-requests-panel')?.classList.toggle('hidden', true);

  if (onWaitlist) {
    const schoolEl = document.getElementById('eats-waitlist-school');
    if (schoolEl) schoolEl.textContent = currentUser?.university || 'your school';
    return;
  }

  setEatsTab('browse');
  loadEatsBrowse();
}

document.getElementById('eats-browse-tab')?.addEventListener('click', () => {
  setEatsTab('browse');
  loadEatsBrowse();
});

let eatsPickupLocationAutocomplete = null;

async function initEatsPickupLocationAutocomplete() {
  const input = document.getElementById('eats-pickup-location');
  if (!input || eatsPickupLocationAutocomplete) return;
  try {
    await loadGoogleMapsAPI();
    eatsPickupLocationAutocomplete = new google.maps.places.Autocomplete(input, {
      componentRestrictions: { country: 'us' },
    });
    eatsPickupLocationAutocomplete.addListener('place_changed', async () => {
      const place = eatsPickupLocationAutocomplete.getPlace();
      if (place?.formatted_address) input.value = place.formatted_address;
      const latInput = document.getElementById('eats-pickup-location-lat');
      const lngInput = document.getElementById('eats-pickup-location-lng');
      const lat = place?.geometry?.location?.lat();
      const lng = place?.geometry?.location?.lng();
      if (latInput) latInput.value = lat ?? '';
      if (lngInput) lngInput.value = lng ?? '';

      // Show inline map preview
      const mapWrap = document.getElementById('eats-pickup-location-map-wrap');
      if (mapWrap && Number.isFinite(lat) && Number.isFinite(lng)) {
        mapWrap.classList.remove('hidden');
        try {
          const mapDiv = document.getElementById('eats-pickup-location-map');
          if (!eatsPickupLocationMap) {
            eatsPickupLocationMap = new google.maps.Map(mapDiv, {
              zoom: 16,
              center: { lat, lng },
              styles: getGoogleMapStylesForTheme(),
              mapTypeControl: false,
              streetViewControl: false,
              fullscreenControl: false,
              zoomControl: false,
            });
            eatsPickupLocationMarker = new google.maps.Marker({
              position: { lat, lng },
              map: eatsPickupLocationMap,
              title: place.formatted_address,
              icon: makeEatsMarkerIcon(true),
            });
          } else {
            eatsPickupLocationMap.setCenter({ lat, lng });
            eatsPickupLocationMarker?.setPosition({ lat, lng });
          }
        } catch { /* Maps unavailable */ }
      }
    });
    input.addEventListener('input', () => {
      const latInput = document.getElementById('eats-pickup-location-lat');
      const lngInput = document.getElementById('eats-pickup-location-lng');
      if (latInput) latInput.value = '';
      if (lngInput) lngInput.value = '';
      document.getElementById('eats-pickup-location-map-wrap')?.classList.add('hidden');
    });
  } catch {
    // Maps unavailable — plain text input still works
  }
}

document.getElementById('eats-post-tab')?.addEventListener('click', () => {
  setEatsTab('post');
  initEatsPickupLocationAutocomplete();
  loadEatsList();
  const pickupInput = document.getElementById('eats-pickup-at');
  if (pickupInput && !pickupInput.value) {
    const soon = new Date(Date.now() + 30 * 60000);
    soon.setSeconds(0, 0);
    pickupInput.value = soon.toISOString().slice(0, 16);
  }
});

document.getElementById('eats-requests-tab')?.addEventListener('click', () => {
  setEatsTab('requests');
  loadEatsFoodRequests();
});

document.getElementById('eats-post-form')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const diningHall = document.getElementById('eats-dining-hall')?.value.trim();
  const pickupLocation = document.getElementById('eats-pickup-location')?.value.trim();
  const pickupLocationLat = document.getElementById('eats-pickup-location-lat')?.value;
  const pickupLocationLng = document.getElementById('eats-pickup-location-lng')?.value;
  const pickupAt = document.getElementById('eats-pickup-at')?.value;
  const price = document.getElementById('eats-price')?.value;
  const maxOrders = document.getElementById('eats-max-orders')?.value;
  const notes = document.getElementById('eats-notes')?.value.trim();
  const submitBtn = document.getElementById('eats-post-submit');
  const msgEl = document.getElementById('eats-post-message');
  const errEl = document.getElementById('eats-post-error');

  msgEl.textContent = '';
  msgEl.classList.remove('show');
  errEl.textContent = '';
  errEl.classList.remove('show');
  setButtonLoading(submitBtn, true);

  try {
    await fetchJson('/api/eats', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        diningHall, pickupLocation,
        pickupLocationLat: pickupLocationLat ? Number(pickupLocationLat) : undefined,
        pickupLocationLng: pickupLocationLng ? Number(pickupLocationLng) : undefined,
        pickupAt, price: Number(price), maxOrders: Number(maxOrders), notes,
      }),
    });
    msgEl.textContent = 'Pickup offer posted! Students from your school can now request food.';
    msgEl.classList.add('show');
    document.getElementById('eats-post-form').reset();
    loadEatsList();
    setTimeout(() => {
      setEatsTab('browse');
      loadEatsBrowse();
    }, 1800);
  } catch (err) {
    errEl.textContent = err.message || 'Could not post offer. Try again.';
    errEl.classList.add('show');
  } finally {
    setButtonLoading(submitBtn, false);
  }
});

document.getElementById('eats-checkout-back')?.addEventListener('click', () => hideEatsCheckout());

document.getElementById('eats-checkout-submit')?.addEventListener('click', async () => {
  const offer = eatsCheckoutOffer;
  if (!offer) return;
  const items = document.getElementById('eats-checkout-items')?.value.trim();
  const message = document.getElementById('eats-checkout-message')?.value.trim();
  const errEl = document.getElementById('eats-checkout-error');
  const submitBtn = document.getElementById('eats-checkout-submit');

  if (!items) {
    errEl.textContent = 'Describe what you want before sending.';
    errEl.classList.add('show');
    document.getElementById('eats-checkout-items')?.focus();
    return;
  }

  errEl.textContent = '';
  errEl.classList.remove('show');
  setButtonLoading(submitBtn, true);

  try {
    await fetchJson(`/api/eats/${offer.id}/request`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items, message }),
    });
    showToast('Request sent! Your picker will confirm soon.', 'success');
    hideEatsCheckout('browse');
  } catch (err) {
    errEl.textContent = err.message || 'Could not send request. Try again.';
    errEl.classList.add('show');
  } finally {
    setButtonLoading(submitBtn, false);
  }
});

// Requests tab — toggle post form
document.getElementById('eats-post-request-btn')?.addEventListener('click', () => {
  const wrap = document.getElementById('eats-request-form-wrap');
  if (!wrap) return;
  const opening = wrap.classList.contains('hidden');
  wrap.classList.toggle('hidden', !opening);
  if (opening) {
    const neededBy = document.getElementById('eats-req-needed-by');
    if (neededBy && !neededBy.value) {
      const soon = new Date(Date.now() + 60 * 60000);
      soon.setSeconds(0, 0);
      neededBy.value = soon.toISOString().slice(0, 16);
    }
    initEatsDeliveryLocationAutocomplete();
    document.getElementById('eats-req-dining-hall')?.focus();
  }
});

document.getElementById('eats-cancel-request-form-btn')?.addEventListener('click', () => {
  document.getElementById('eats-request-form-wrap')?.classList.add('hidden');
});

let eatsDeliveryLocationAutocomplete = null;
async function initEatsDeliveryLocationAutocomplete() {
  const input = document.getElementById('eats-req-delivery-location');
  if (!input || eatsDeliveryLocationAutocomplete) return;
  try {
    await loadGoogleMapsAPI();
    eatsDeliveryLocationAutocomplete = new google.maps.places.Autocomplete(input, { componentRestrictions: { country: 'us' } });
    eatsDeliveryLocationAutocomplete.addListener('place_changed', async () => {
      const place = eatsDeliveryLocationAutocomplete.getPlace();
      if (place?.formatted_address) input.value = place.formatted_address;
      const latEl = document.getElementById('eats-req-delivery-lat');
      const lngEl = document.getElementById('eats-req-delivery-lng');
      const lat = place?.geometry?.location?.lat();
      const lng = place?.geometry?.location?.lng();
      if (latEl) latEl.value = lat ?? '';
      if (lngEl) lngEl.value = lng ?? '';

      // Show inline delivery map preview
      const mapWrap = document.getElementById('eats-req-delivery-map-wrap');
      if (mapWrap && Number.isFinite(lat) && Number.isFinite(lng)) {
        mapWrap.classList.remove('hidden');
        try {
          const mapDiv = document.getElementById('eats-req-delivery-map');
          if (!eatsDeliveryPreviewMap) {
            eatsDeliveryPreviewMap = new google.maps.Map(mapDiv, {
              zoom: 16,
              center: { lat, lng },
              styles: getGoogleMapStylesForTheme(),
              mapTypeControl: false,
              streetViewControl: false,
              fullscreenControl: false,
              zoomControl: false,
            });
            eatsDeliveryPreviewMarker = new google.maps.Marker({
              position: { lat, lng },
              map: eatsDeliveryPreviewMap,
              title: place.formatted_address,
              icon: makeEatsMarkerIcon(true),
            });
          } else {
            eatsDeliveryPreviewMap.setCenter({ lat, lng });
            eatsDeliveryPreviewMarker?.setPosition({ lat, lng });
          }
        } catch { /* Maps unavailable */ }
      }
    });
    input.addEventListener('input', () => {
      document.getElementById('eats-req-delivery-map-wrap')?.classList.add('hidden');
    });
  } catch { /* plain text fallback */ }
}

document.getElementById('eats-food-request-form')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const diningHall = document.getElementById('eats-req-dining-hall')?.value.trim();
  const items = document.getElementById('eats-req-items')?.value.trim();
  const deliveryLocation = document.getElementById('eats-req-delivery-location')?.value.trim();
  const neededBy = document.getElementById('eats-req-needed-by')?.value;
  const price = document.getElementById('eats-req-price')?.value;
  const notes = document.getElementById('eats-req-notes')?.value.trim();
  const submitBtn = document.getElementById('eats-food-request-submit');
  const msgEl = document.getElementById('eats-food-request-message');
  const errEl = document.getElementById('eats-food-request-error');

  msgEl.textContent = ''; msgEl.classList.remove('show');
  errEl.textContent = ''; errEl.classList.remove('show');
  setButtonLoading(submitBtn, true);

  try {
    await fetchJson('/api/eats/food-requests', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ diningHall, items, deliveryLocation, neededBy, price: Number(price), notes }),
    });
    msgEl.textContent = 'Request posted! Pickers from your school can now claim it.';
    msgEl.classList.add('show');
    document.getElementById('eats-food-request-form').reset();
    document.getElementById('eats-request-form-wrap')?.classList.add('hidden');
    setTimeout(() => { loadEatsFoodRequests(); }, 1200);
  } catch (err) {
    errEl.textContent = err.message || 'Could not post request. Try again.';
    errEl.classList.add('show');
  } finally {
    setButtonLoading(submitBtn, false);
  }
});

eatsButton?.addEventListener('click', () => {
  if (isBitesEnabled()) showEatsPage();
});
eatsBackHomeButton?.addEventListener('click', () => returnToBrowseRides());

document.getElementById('feedback-profile-form')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const category = document.getElementById('feedback-category')?.value || 'General feedback';
  const subject = document.getElementById('feedback-subject')?.value.trim() || '';
  const message = document.getElementById('feedback-message')?.value.trim() || '';
  const submitBtn = document.getElementById('feedback-profile-submit');
  const successEl = document.getElementById('feedback-profile-success');
  const errorEl = document.getElementById('feedback-profile-error');

  if (!message) {
    errorEl.textContent = 'Write a message before sending.';
    errorEl.classList.add('show');
    return;
  }

  setButtonLoading(submitBtn, true);
  successEl.textContent = '';
  successEl.classList.remove('show');
  errorEl.textContent = '';
  errorEl.classList.remove('show');

  try {
    await fetchJson('/api/feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ category, subject, message }),
    });
    successEl.textContent = 'Feedback sent — thank you! We\'ll follow up at your account email if needed.';
    successEl.classList.add('show');
    document.getElementById('feedback-subject').value = '';
    document.getElementById('feedback-message').value = '';
    document.getElementById('feedback-category').value = 'Bug report';
  } catch {
    errorEl.textContent = 'Could not send feedback. Try again or email ridewlinkup@gmail.com directly.';
    errorEl.classList.add('show');
  } finally {
    setButtonLoading(submitBtn, false);
  }
});
