const path = require('path');
const fs = require('fs');
const { chromium } = require('playwright');

const root = path.resolve(__dirname, '..');
const captureBaseUrl = process.env.LINKUP_WALKTHROUGH_BASE_URL || 'http://localhost:4000';
const UCLA_TO_LAX_ROUTE = {
  origin: 'UCLA Ackerman Union, Los Angeles, CA',
  destination: 'Los Angeles International Airport (LAX), Los Angeles, CA',
};

const shots = [
  {
    file: 'public/previews/waitlist-page-preview.html',
    name: 'waitlist-page',
    selector: '.waitlist-inner',
  },
  {
    file: 'public/previews/dashboard-with-ride-preview.html',
    name: 'dashboard-ride',
    selector: '.dashboard-checklist-widget',
  },
  {
    file: 'public/previews/linkup-core-features-preview.html',
    name: 'core-features',
    selector: '.feature-showcase',
  },
  {
    file: 'public/index.html',
    name: 'request-ride',
    selector: '#request-ride-page',
    prepare: 'requestRide',
  },
  {
    file: 'public/index.html',
    name: 'list-ride',
    selector: '#list-ride-page .grid > .card:first-child',
    prepare: 'listRide',
  },
  {
    file: 'public/previews/driver-dashboard-preview.html',
    name: 'driver-route',
    selector: '.driver-preview-grid',
  },
  {
    file: 'public/previews/dashboard-with-ride-preview.html',
    name: 'safety-tools',
    selector: '.dashboard-tracking-section',
    prepare: 'safetyTools',
  },
];

function readGoogleMapsApiKey() {
  for (const filename of ['.env.local', '.env']) {
    const envPath = path.join(root, filename);
    if (!fs.existsSync(envPath)) continue;
    const content = fs.readFileSync(envPath, 'utf8');
    const match = content.match(/^GOOGLE_MAPS_API_KEY=(.+)$/m);
    if (match?.[1]) return match[1].trim().replace(/^['"]|['"]$/g, '');
  }
  return process.env.GOOGLE_MAPS_API_KEY || '';
}

async function loadGoogleMapsForCapture(page) {
  if (await page.evaluate(() => Boolean(window.google?.maps?.DirectionsService))) return;
  const apiKey = readGoogleMapsApiKey();
  if (!apiKey) throw new Error('GOOGLE_MAPS_API_KEY is required to capture real route maps.');
  await page.addScriptTag({
    url: `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(apiKey)}&loading=async`,
  });
  await page.waitForFunction(() => Boolean(window.google?.maps?.DirectionsService), { timeout: 15000 });
}

async function renderGoogleRouteMap(page, targetSelector, options = {}) {
  await loadGoogleMapsForCapture(page);
  await page.evaluate(({ selector, route, showCurrentLocation }) => new Promise((resolve, reject) => {
    const target = document.querySelector(selector);
    if (!target) {
      reject(new Error('Route map target not found: ' + selector));
      return;
    }

    target.classList.remove('walkthrough-feature-map');
    target.innerHTML = `
      <div class="walkthrough-real-google-map" aria-label="Google Maps route from UCLA to LAX"></div>
      ${showCurrentLocation ? '<span class="walkthrough-map-live-caption">Current location marker shown in yellow</span>' : ''}
    `;
    const mapEl = target.querySelector('.walkthrough-real-google-map');
    Object.assign(target.style, {
      position: 'relative',
      overflow: 'hidden',
    });
    Object.assign(mapEl.style, {
      width: '100%',
      height: '100%',
      minHeight: target.style.minHeight || '300px',
      borderRadius: 'inherit',
      display: 'block',
    });
    const caption = target.querySelector('.walkthrough-map-live-caption');
    if (caption) Object.assign(caption.style, {
      position: 'absolute',
      left: '18px',
      bottom: '18px',
      padding: '8px 11px',
      borderRadius: '999px',
      background: 'rgba(255,255,255,0.9)',
      color: '#102f35',
      font: '700 11px Inter, sans-serif',
      letterSpacing: '0.08em',
      textTransform: 'uppercase',
      boxShadow: '0 8px 22px rgba(0,0,0,0.16)',
    });

    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const map = new google.maps.Map(mapEl, {
      center: { lat: 33.995, lng: -118.425 },
      zoom: 10,
      disableDefaultUI: true,
      zoomControl: false,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
      styles: isDark ? [
        { elementType: 'geometry', stylers: [{ color: '#0b2529' }] },
        { elementType: 'labels.text.fill', stylers: [{ color: '#b7dfe4' }] },
        { elementType: 'labels.text.stroke', stylers: [{ color: '#07191d' }] },
        { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#1d4a51' }] },
        { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#2b7078' }] },
        { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#061418' }] },
        { featureType: 'poi', stylers: [{ visibility: 'off' }] },
        { featureType: 'transit', stylers: [{ visibility: 'off' }] },
      ] : [
        { featureType: 'poi', stylers: [{ visibility: 'off' }] },
        { featureType: 'transit', stylers: [{ visibility: 'off' }] },
        { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#d9f4f6' }] },
        { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#b8dfe3' }] },
      ],
    });
    const renderer = new google.maps.DirectionsRenderer({
      map,
      suppressMarkers: false,
      polylineOptions: {
        strokeColor: '#27c7c9',
        strokeOpacity: 0.95,
        strokeWeight: 6,
      },
    });
    new google.maps.DirectionsService().route({
      origin: route.origin,
      destination: route.destination,
      travelMode: google.maps.TravelMode.DRIVING,
    }, (result, status) => {
      if (status !== 'OK' || !result) {
        reject(new Error('Google Maps DirectionsRenderer route failed: ' + status));
        return;
      }
      renderer.setDirections(result);
      const path = result.routes?.[0]?.overview_path || [];
      if (showCurrentLocation && path.length) {
        new google.maps.Marker({
          map,
          position: path[Math.floor(path.length * 0.48)],
          title: 'Current location',
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 10,
            fillColor: '#f3b63f',
            fillOpacity: 1,
            strokeColor: '#ffffff',
            strokeWeight: 3,
          },
        });
      }
      google.maps.event.addListenerOnce(map, 'tilesloaded', () => setTimeout(resolve, 700));
      setTimeout(resolve, 2800);
    });
  }), {
    selector: targetSelector,
    route: UCLA_TO_LAX_ROUTE,
    showCurrentLocation: Boolean(options.showCurrentLocation),
  });
}

async function prepareAppFeatureShot(page, feature) {
  await page.evaluate((nextFeature) => {
    function setValue(id, value) {
      const el = document.getElementById(id);
      if (!el) return;
      el.value = value;
      el.dispatchEvent(new Event('input', { bubbles: true }));
      el.dispatchEvent(new Event('change', { bubbles: true }));
    }

    function setText(id, value) {
      const el = document.getElementById(id);
      if (el) el.textContent = value;
    }

    function setChecked(id, checked) {
      const el = document.getElementById(id);
      if (!el) return;
      el.checked = checked;
      el.dispatchEvent(new Event('change', { bubbles: true }));
    }

    document.body.classList.add('dashboard-mode');
    document.getElementById('auth-section')?.classList.add('hidden');
    document.getElementById('dashboard')?.classList.remove('hidden');
    document.getElementById('dashboard')?.classList.remove('waitlist-lock-mode');
    document.querySelectorAll('#dashboard > *').forEach((el) => el.classList.add('hidden'));
    document.getElementById('dashboard-header')?.classList.add('hidden');

    const targetPageId = nextFeature === 'requestRide' ? 'request-ride-page' : 'list-ride-page';
    const targetPage = document.getElementById(targetPageId);
    targetPage?.classList.remove('hidden');
    let parent = targetPage?.parentElement;
    while (parent && parent.id !== 'dashboard') {
      parent.classList.remove('hidden');
      parent = parent.parentElement;
    }

    if (nextFeature === 'requestRide') {
      setValue('request-origin', 'UCLA Ackerman Union');
      setValue('request-destination', 'LAX Terminal 7');
      setText('request-origin-selected', 'UCLA Ackerman Union, Los Angeles, CA');
      setText('request-destination-selected', 'LAX Terminal 7, Los Angeles, CA');
      setValue('request-pickup-radius', '2');
      setValue('request-dropoff-radius', '1');
      setValue('request-date', '2026-06-12');
      setValue('request-time', '08:30');
      setValue('request-rider-count', '1');
      setValue('request-price', '20.00');
      setChecked('request-share-ride', true);
      setChecked('request-same-school-driver', true);
      setChecked('request-no-smoking', true);
      setValue('request-notes', 'Airport ride. I have one carry-on and can meet by the main entrance.');
    }

    if (nextFeature === 'listRide') {
      document.getElementById('ride-provider-step')?.classList.add('hidden');
      document.getElementById('offer-form')?.classList.remove('hidden');
      setValue('ride-provider-type', 'personal_car');
      setText('ride-provider-summary-text', 'Personal car selected');
      setValue('origin-search', 'UCLA Ackerman Union');
      setValue('origin', 'UCLA Ackerman Union, Los Angeles, CA');
      setText('origin-selected', 'UCLA Ackerman Union, Los Angeles, CA');
      setValue('destination-search', 'LAX Terminal 7');
      setValue('destination', 'LAX Terminal 7, Los Angeles, CA');
      setText('destination-selected', 'LAX Terminal 7, Los Angeles, CA');
      setValue('offer-pickup-radius', '2');
      setValue('offer-dropoff-radius', '1');
      setValue('ride-date', '2026-06-12');
      setValue('ride-time', '08:30');
      setChecked('same-school-only-ride', true);
      document.getElementById('personal-car-fields')?.classList.remove('hidden');
      setValue('car-maker', 'Tesla');
      setValue('car-model', 'Model Y');
      setValue('car-color', 'Dark gray');
      setValue('license-plate', 'LINKUP');
      document.getElementById('personal-seat-selection')?.classList.remove('hidden');
      const seatLayout = document.getElementById('driver-seat-layout');
      if (seatLayout) {
        seatLayout.dataset.vehicleSeats = '5';
        seatLayout.innerHTML = `
          <button type="button" class="seat-rect seat-driver driver-seat unavailable" disabled>Driver</button>
          <button type="button" class="seat-rect seat-front_passenger selected" aria-pressed="true">Front</button>
          <button type="button" class="seat-rect seat-back_left selected" aria-pressed="true">Back Left</button>
          <button type="button" class="seat-rect seat-back_middle" aria-pressed="false">Back Middle</button>
          <button type="button" class="seat-rect seat-back_right selected" aria-pressed="true">Back Right</button>
        `;
      }
      setText('selected-seat-count', '3 selected');
      setValue('seats', '3');
      setValue('ride-price', '18.00');
      setValue('ride-parking-fee', '4.00');
      setValue('notes', 'No smoking. Quiet ride, carry-on luggage is fine.');
      setChecked('ride-terms-agree', true);
      setChecked('ride-driver-disclaimer', true);
    }
  }, feature);

  if (feature === 'requestRide') {
    await renderGoogleRouteMap(page, '#request-origin-map');
  }

  if (feature === 'listRide') {
    await renderGoogleRouteMap(page, '#origin-map');
  }
}

async function preparePreviewShot(page, feature) {
  if (feature === 'safetyTools') {
    await renderGoogleRouteMap(page, '.fake-map', { showCurrentLocation: true });
  }
}

async function main() {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 980 }, deviceScaleFactor: 1 });
  await page.route('**/app.js*', (route) => route.abort());
  for (const shot of shots) {
    const shotUrl = new URL(shot.file.replace(/^public\//, ''), captureBaseUrl + '/').toString();
    for (const theme of ['light', 'dark']) {
      await page.goto(shotUrl, { waitUntil: 'domcontentloaded' });
      await page.evaluate((nextTheme) => {
        document.documentElement.setAttribute('data-theme', nextTheme);
      }, theme);
      if (shot.prepare === 'requestRide' || shot.prepare === 'listRide') {
        await prepareAppFeatureShot(page, shot.prepare);
      } else if (shot.prepare) {
        await preparePreviewShot(page, shot.prepare);
      }
      const target = page.locator(shot.selector);
      const output = `public/assets/images/walkthrough/${shot.name}-${theme}.png`;
      await target.screenshot({
        path: path.join(root, output),
      });
      console.log(`Captured ${output}`);
      if (theme === 'light') {
        const fallbackOutput = `public/assets/images/walkthrough/${shot.name}.png`;
        await target.screenshot({
          path: path.join(root, fallbackOutput),
        });
        console.log(`Captured ${fallbackOutput}`);
      }
    }
  }
  await browser.close();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
