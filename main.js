/* ===== SWIFTHAUL LOGISTICS — MAIN JAVASCRIPT ===== */

// ===== NAVBAR SCROLL =====
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 20) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

// ===== MOBILE MENU =====
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', () => {
    mobileMenu.classList.toggle('open');
  });
}

// ===== BOOKING FORM =====
const bookingForm = document.getElementById('bookingForm');
if (bookingForm) {

  // Live price estimation
  const pricePanel = document.getElementById('pricePanel');
  const priceBreakdown = document.getElementById('priceBreakdown');
  const baseRateEl = document.getElementById('baseRate');
  const weightChargeEl = document.getElementById('weightCharge');
  const speedChargeEl = document.getElementById('speedCharge');
  const totalPriceEl = document.getElementById('totalPrice');

  const pickupStateEl = document.getElementById('pickupState');
  const deliveryStateEl = document.getElementById('deliveryState');
  const weightEl = document.getElementById('weight');
  const packageTypeEl = document.getElementById('packageType');

  const sameCityStates = ['Lagos', 'Abuja (FCT)', 'Port Harcourt', 'Ibadan (Oyo)'];

  function formatNaira(n) {
    return '₦' + n.toLocaleString();
  }

  function calculatePrice() {
    const pickup = pickupStateEl ? pickupStateEl.value : '';
    const delivery = deliveryStateEl ? deliveryStateEl.value : '';
    const weight = parseFloat(weightEl ? weightEl.value : 0) || 0;
    const pkgType = packageTypeEl ? packageTypeEl.value : '';
    const speed = document.querySelector('input[name="speed"]:checked');
    const speedVal = speed ? speed.value : '';

    if (!pickup || !delivery || !weight || !pkgType || !speedVal) return;

    // Base rate
    let base = 1500;
    if (pkgType === 'document') base = 1000;
    else if (pkgType === 'parcel') base = 1500;
    else if (pkgType === 'medium') base = 3000;
    else if (pkgType === 'bulk') base = 8000;

    // Interstate surcharge
    if (pickup !== delivery) {
      base += 2000;
    }

    // Weight charge
    let weightCharge = 0;
    if (weight > 0.5) {
      weightCharge = Math.ceil(weight - 0.5) * 300;
    }

    // Speed surcharge
    let speedCharge = 0;
    if (speedVal === 'sameday') speedCharge = 1500;
    else if (speedVal === 'nextday') speedCharge = 500;

    const total = base + weightCharge + speedCharge;

    baseRateEl.textContent = formatNaira(base);
    weightChargeEl.textContent = formatNaira(weightCharge);
    speedChargeEl.textContent = formatNaira(speedCharge);
    totalPriceEl.textContent = formatNaira(total);
    priceBreakdown.style.display = 'flex';
  }

  [pickupStateEl, deliveryStateEl, weightEl, packageTypeEl].forEach(el => {
    if (el) el.addEventListener('change', calculatePrice);
    if (el && el.tagName === 'INPUT') el.addEventListener('input', calculatePrice);
  });
  document.querySelectorAll('input[name="speed"]').forEach(r => {
    r.addEventListener('change', calculatePrice);
  });

  // Form validation & submit
  function validateField(id, errorId, msg) {
    const el = document.getElementById(id);
    const err = document.getElementById(errorId);
    if (!el) return true;
    const val = el.value.trim();
    if (!val) {
      el.classList.add('error');
      if (err) { err.textContent = msg; err.classList.add('show'); }
      return false;
    }
    el.classList.remove('error');
    if (err) err.classList.remove('show');
    return true;
  }

  bookingForm.addEventListener('submit', function(e) {
    e.preventDefault();
    let valid = true;
    valid = validateField('senderName', 'senderNameError', 'Please enter sender name') && valid;
    valid = validateField('senderPhone', 'senderPhoneError', 'Please enter sender phone') && valid;
    valid = validateField('pickupAddress', 'pickupAddressError', 'Please enter pickup address') && valid;
    valid = validateField('pickupState', 'pickupStateError', 'Please select pickup state') && valid;
    valid = validateField('receiverName', 'receiverNameError', 'Please enter receiver name') && valid;
    valid = validateField('receiverPhone', 'receiverPhoneError', 'Please enter receiver phone') && valid;
    valid = validateField('deliveryAddress', 'deliveryAddressError', 'Please enter delivery address') && valid;
    valid = validateField('deliveryState', 'deliveryStateError', 'Please select delivery state') && valid;
    valid = validateField('packageType', 'packageTypeError', 'Please select package type') && valid;
    valid = validateField('weight', 'weightError', 'Please enter weight') && valid;

    const speedSelected = document.querySelector('input[name="speed"]:checked');
    const speedErr = document.getElementById('speedError');
    if (!speedSelected) {
      if (speedErr) { speedErr.textContent = 'Please select a delivery speed'; speedErr.classList.add('show'); }
      valid = false;
    } else {
      if (speedErr) speedErr.classList.remove('show');
    }

    if (!valid) return;

    // Simulate booking
    const btn = bookingForm.querySelector('button[type="submit"]');
    btn.textContent = 'Processing...';
    btn.disabled = true;

    setTimeout(() => {
      const trackingId = 'SH-' + Math.floor(10000 + Math.random() * 90000);
      document.getElementById('confirmedTrackingId').textContent = trackingId;
      document.getElementById('pricePanel').style.display = 'none';
      const confirmed = document.getElementById('bookingConfirmed');
      confirmed.style.display = 'block';
      confirmed.scrollIntoView({ behavior: 'smooth', block: 'center' });
      bookingForm.reset();
      if (priceBreakdown) priceBreakdown.style.display = 'none';
    }, 1800);
  });
}

// ===== TRACKING PAGE =====
const trackBtn = document.getElementById('trackBtn');
const trackingInput = document.getElementById('trackingInput');

const DEMO_SHIPMENTS = {
  'SH-29041': {
    status: 'In Transit',
    statusClass: 'status-transit',
    step: 3,
    route: 'Lagos → Abuja',
    timeline: [
      { icon: '✅', event: 'Package picked up from sender', location: 'Ikeja, Lagos', time: 'Today, 8:14 AM' },
      { icon: '🔄', event: 'Arrived at sorting facility', location: 'Ikeja Logistics Hub', time: 'Today, 9:02 AM' },
      { icon: '🚚', event: 'In transit — on the road', location: 'Lagos–Ibadan Expressway', time: 'Today, 10:30 AM' },
    ],
    details: {
      'Sender': 'Adaeze O., Lagos',
      'Receiver': 'Tunde B., Abuja',
      'Package': 'Parcel (2.5kg)',
      'Service': 'Next-Day Delivery',
      'Booked On': 'March 24, 2025',
      'Est. Delivery': 'March 25, 2025',
    }
  },
  'SH-11234': {
    status: 'Delivered',
    statusClass: 'status-delivered',
    step: 5,
    route: 'Port Harcourt → Enugu',
    timeline: [
      { icon: '✅', event: 'Package picked up from sender', location: 'GRA, Port Harcourt', time: 'Mar 22, 9:00 AM' },
      { icon: '🔄', event: 'Arrived at sorting facility', location: 'PH Logistics Hub', time: 'Mar 22, 10:15 AM' },
      { icon: '🚚', event: 'In transit — on the road', location: 'PH–Enugu Highway', time: 'Mar 22, 11:30 AM' },
      { icon: '📍', event: 'Out for delivery', location: 'Enugu, Independence Layout', time: 'Mar 22, 3:00 PM' },
      { icon: '🎉', event: 'Successfully delivered!', location: 'Independence Layout, Enugu', time: 'Mar 22, 4:47 PM' },
    ],
    details: {
      'Sender': 'Chukwuemeka E., PH',
      'Receiver': 'Ngozi A., Enugu',
      'Package': 'Document',
      'Service': 'Same-Day Delivery',
      'Booked On': 'March 22, 2025',
      'Delivered On': 'March 22, 2025',
    }
  },
  'SH-55678': {
    status: 'Pending Pickup',
    statusClass: 'status-pending',
    step: 1,
    route: 'Kano → Lagos',
    timeline: [
      { icon: '📋', event: 'Order placed and confirmed', location: 'Online Booking', time: 'Today, 7:30 AM' },
    ],
    details: {
      'Sender': 'Musa A., Kano',
      'Receiver': 'Fatima L., Lagos',
      'Package': 'Medium Package (12kg)',
      'Service': 'Interstate Delivery',
      'Booked On': 'March 24, 2025',
      'Est. Delivery': 'March 26, 2025',
    }
  }
};

function doTrack() {
  const id = trackingInput ? trackingInput.value.trim().toUpperCase() : '';
  if (!id) return;

  const result = document.getElementById('trackingResult');
  const notFound = document.getElementById('trackingNotFound');

  result.style.display = 'none';
  notFound.style.display = 'none';

  const shipment = DEMO_SHIPMENTS[id];

  if (!shipment) {
    notFound.style.display = 'block';
    notFound.scrollIntoView({ behavior: 'smooth', block: 'center' });
    return;
  }

  // Populate header
  document.getElementById('trackIdBadge').textContent = id;
  document.getElementById('trackRoute').textContent = shipment.route;
  const badge = document.getElementById('trackStatusBadge');
  badge.textContent = shipment.status;
  badge.className = 'tracking-status-badge ' + shipment.statusClass;

  // Progress steps
  const dots = document.querySelectorAll('.progress-dot');
  const lines = document.querySelectorAll('.progress-line');
  dots.forEach((dot, i) => {
    dot.classList.remove('active', 'done');
    if (i + 1 < shipment.step) dot.classList.add('done');
    else if (i + 1 === shipment.step) dot.classList.add('active');
  });
  lines.forEach((line, i) => {
    line.classList.remove('done');
    if (i + 1 < shipment.step) line.classList.add('done');
  });

  // Timeline
  const timelineEl = document.getElementById('trackingTimeline');
  timelineEl.innerHTML = shipment.timeline.map(item => `
    <div class="timeline-item">
      <div class="timeline-dot">${item.icon}</div>
      <div class="timeline-info">
        <strong>${item.event}</strong>
        <span>${item.location}</span>
      </div>
      <div class="timeline-time">${item.time}</div>
    </div>
  `).join('');

  // Parcel details
  const detailsEl = document.getElementById('parcelDetails');
  detailsEl.innerHTML = Object.entries(shipment.details).map(([k, v]) => `
    <div class="parcel-detail-item">
      <label>${k}</label>
      <span>${v}</span>
    </div>
  `).join('');

  result.style.display = 'block';
  result.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

if (trackBtn) trackBtn.addEventListener('click', doTrack);
if (trackingInput) {
  trackingInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') doTrack(); });

  // Demo hints clickable
  document.querySelectorAll('.track-hint strong').forEach(el => {
    el.style.cursor = 'pointer';
  });
}

// Click demo IDs from hint
document.addEventListener('click', function(e) {
  if (e.target.tagName === 'STRONG' && e.target.closest('.track-hint')) {
    const id = e.target.textContent.trim();
    if (trackingInput) {
      trackingInput.value = id;
      doTrack();
    }
  }
});

// ===== CONTACT FORM =====
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  function validateContact(id, errorId, msg) {
    const el = document.getElementById(id);
    const err = document.getElementById(errorId);
    if (!el) return true;
    const val = el.value.trim();
    if (!val) {
      el.classList.add('error');
      if (err) { err.textContent = msg; err.classList.add('show'); }
      return false;
    }
    if (id === 'contactEmail' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
      el.classList.add('error');
      if (err) { err.textContent = 'Please enter a valid email address'; err.classList.add('show'); }
      return false;
    }
    el.classList.remove('error');
    if (err) err.classList.remove('show');
    return true;
  }

  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    let valid = true;
    valid = validateContact('contactName', 'contactNameError', 'Please enter your name') && valid;
    valid = validateContact('contactPhone', 'contactPhoneError', 'Please enter your phone') && valid;
    valid = validateContact('contactEmail', 'contactEmailError', 'Please enter your email') && valid;
    valid = validateContact('contactSubject', 'contactSubjectError', 'Please select a subject') && valid;
    valid = validateContact('contactMessage', 'contactMessageError', 'Please enter your message') && valid;

    if (!valid) return;

    const btn = document.getElementById('contactSubmitBtn');
    btn.textContent = 'Sending...';
    btn.disabled = true;

    setTimeout(() => {
      contactForm.reset();
      btn.textContent = 'Send Message 📨';
      btn.disabled = false;
      const success = document.getElementById('contactSuccess');
      success.style.display = 'block';
      success.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setTimeout(() => { success.style.display = 'none'; }, 6000);
    }, 1500);
  });
}

// ===== FAQ =====
document.querySelectorAll('.faq-question').forEach(btn => {
  btn.addEventListener('click', function() {
    const answer = this.nextElementSibling;
    const isOpen = this.classList.contains('open');

    // Close all
    document.querySelectorAll('.faq-question.open').forEach(q => {
      q.classList.remove('open');
      q.nextElementSibling.classList.remove('open');
    });

    if (!isOpen) {
      this.classList.add('open');
      answer.classList.add('open');
    }
  });
});

// ===== SCROLL ANIMATIONS =====
const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -40px 0px' };
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

document.querySelectorAll('.service-card, .testimonial-card, .city-card, .why-card, .step, .service-detail-card').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(24px)';
  el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  observer.observe(el);
});
