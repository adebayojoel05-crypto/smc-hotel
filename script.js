/* ─────────────────────────────────────────
   GRAND MERCURE SURYA PALACE - Interactive Logic
   ───────────────────────────────────────── */

document.addEventListener('DOMContentLoaded', () => {
  
  /* ── Mobile Menu Toggle ────────────── */
  const mobileBtn = document.getElementById('mobileMenuBtn');
  const mainNav = document.getElementById('mainNav');
  
  if (mobileBtn && mainNav) {
    mobileBtn.addEventListener('click', () => {
      mainNav.classList.toggle('open');
      mobileBtn.classList.toggle('active');
      const isOpen = mainNav.classList.contains('open');
      mobileBtn.setAttribute('aria-expanded', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });
    
    mainNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mainNav.classList.remove('open');
        mobileBtn.classList.remove('active');
        mobileBtn.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
    
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mainNav.classList.contains('open')) {
        mainNav.classList.remove('open');
        mobileBtn.classList.remove('active');
        mobileBtn.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });
  }
  
  /* ── Date Picker Logic ─────────────── */
  const checkinInput = document.getElementById('checkin');
  const checkoutInput = document.getElementById('checkout');
  
  if (checkinInput && checkoutInput) {
    const today = new Date().toISOString().split('T')[0];
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];
    
    checkinInput.min = today;
    checkinInput.value = today;
    checkoutInput.min = tomorrowStr;
    checkoutInput.value = tomorrowStr;
    
    checkinInput.addEventListener('change', () => {
      const selectedDate = new Date(checkinInput.value);
      selectedDate.setDate(selectedDate.getDate() + 1);
      const minCheckout = selectedDate.toISOString().split('T')[0];
      checkoutInput.min = minCheckout;
      if (new Date(checkoutInput.value) <= new Date(checkinInput.value)) {
        checkoutInput.value = minCheckout;
      }
    });
  }
  
  /* ── Hero Booking Form ─────────────── */
  const heroBookingForm = document.getElementById('heroBookingForm');
  if (heroBookingForm) {
    heroBookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const location = document.getElementById('location').value;
      const checkin = checkinInput.value;
      const checkout = checkoutInput.value;
      const rooms = document.getElementById('rooms').value;
      const guests = document.getElementById('guests').value;
      
      if (!checkin || !checkout) {
        showNotification('Please select check-in and check-out dates', 'error');
        return;
      }
      
      if (new Date(checkout) <= new Date(checkin)) {
        showNotification('Check-out must be after check-in', 'error');
        return;
      }
      
      // Use default room data for hero form search
      const roomData = {
        name: 'Deluxe Suite',
        price: 8999,
        image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&q=80',
        location: location
      };
      
      openBookingModal(roomData);
    });
  }
  
  /* ── Room Card Book Now Buttons ────── */
  const roomCards = document.querySelectorAll('.room-card');
  const roomDataMap = {
    'Deluxe Suite': { 
      name: 'Deluxe Suite', 
      price: 8999, 
      image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&q=80' 
    },
    'Executive Room': { 
      name: 'Executive Room', 
      price: 6499, 
      image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=600&q=80' 
    },
    'Premium Room': { 
      name: 'Premium Room', 
      price: 4999, 
      image: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=600&q=80' 
    }
  };
  
  roomCards.forEach(card => {
    const bookBtn = card.querySelector('.btn-primary');
    if (bookBtn) {
      bookBtn.addEventListener('click', () => {
        const roomTitle = card.querySelector('.room-title').textContent;
        const roomData = roomDataMap[roomTitle];
        if (roomData) {
          openBookingModal(roomData);
        }
      });
    }
  });
  
  /* ── Booking Modal Logic ───────────── */
  const bookingModal = document.getElementById('bookingModal');
  const paymentModal = document.getElementById('paymentModal');
  const confirmationModal = document.getElementById('confirmationModal');
  
  let currentBookingData = {};
  
  function openBookingModal(roomData) {
    // Get form values
    const locationSelect = document.getElementById('location');
    const locationName = locationSelect.options[locationSelect.selectedIndex].text;
    const checkin = checkinInput.value;
    const checkout = checkoutInput.value;
    const rooms = document.getElementById('rooms').value;
    const guestsSelect = document.getElementById('guests');
    const guests = guestsSelect.options[guestsSelect.selectedIndex].text;
    
    // Calculate nights
    const checkinDate = new Date(checkin);
    const checkoutDate = new Date(checkout);
    const nights = Math.ceil((checkoutDate - checkinDate) / (1000 * 60 * 60 * 24));
    
    // Calculate pricing
    const basePrice = roomData.price * nights * parseInt(rooms);
    const tax = Math.round(basePrice * 0.18);
    const total = basePrice + tax;
    
    // Store current booking data
    currentBookingData = {
      roomName: roomData.name,
      roomPrice: roomData.price,
      roomImage: roomData.image,
      location: locationName,
      checkin: checkin,
      checkout: checkout,
      nights: nights,
      rooms: parseInt(rooms),
      guests: guests,
      basePrice: basePrice,
      tax: tax,
      total: total
    };
    
    // Update summary
    document.getElementById('summaryRoomImage').src = roomData.image;
    document.getElementById('summaryRoomName').textContent = roomData.name;
    document.getElementById('summaryRoomLocation').innerHTML = `<i class=\"fas fa-location-dot\"></i> ${locationName}`;
    document.getElementById('summaryCheckin').textContent = formatDate(checkin);
    document.getElementById('summaryCheckout').textContent = formatDate(checkout);
    document.getElementById('summaryNights').textContent = nights;
    document.getElementById('summaryRooms').textContent = `${currentBookingData.rooms} Room${currentBookingData.rooms > 1 ? 's' : ''}`;
    document.getElementById('summaryGuests').textContent = guests;
    document.getElementById('summaryRate').textContent = `₹${roomData.price.toLocaleString()}`;
    document.getElementById('summaryTax').textContent = `₹${tax.toLocaleString()}`;
    document.getElementById('summaryTotal').textContent = `₹${total.toLocaleString()}`;
    
    // Update payment modal total
    document.getElementById('paymentTotal').textContent = `₹${total.toLocaleString()}`;
    
    // Reset forms
    document.getElementById('guestDetailsForm').reset();
    
    // Open modal
    bookingModal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  
  function closeBookingModal() {
    bookingModal.classList.remove('open');
    document.body.style.overflow = '';
  }
  
  function openPaymentModal() {
    // Validate guest form
    const form = document.getElementById('guestDetailsForm');
    const firstName = document.getElementById('guestFirstName').value.trim();
    const lastName = document.getElementById('guestLastName').value.trim();
    const email = document.getElementById('guestEmail').value.trim();
    const phone = document.getElementById('guestPhone').value.trim();
    const agreed = document.getElementById('agreeTerms').checked;
    
    // Clear previous errors
    form.querySelectorAll('.has-error').forEach(el => el.classList.remove('has-error'));
    
    let hasError = false;
    
    if (!firstName) {
      document.getElementById('guestFirstName').parentElement.classList.add('has-error');
      hasError = true;
    }
    if (!lastName) {
      document.getElementById('guestLastName').parentElement.classList.add('has-error');
      hasError = true;
    }
    if (!email || !isValidEmail(email)) {
      document.getElementById('guestEmail').parentElement.classList.add('has-error');
      hasError = true;
    }
    if (!phone || phone.length < 10) {
      document.getElementById('guestPhone').parentElement.classList.add('has-error');
      hasError = true;
    }
    if (!agreed) {
      showNotification('Please agree to the Terms & Conditions', 'error');
      hasError = true;
    }
    
    if (hasError) {
      showNotification('Please fill in all required fields correctly', 'error');
      return;
    }
    
    // Store guest data
    currentBookingData.guest = {
      firstName,
      lastName,
      email,
      phone,
      specialRequests: document.getElementById('guestSpecialRequests').value.trim()
    };
    
    // Close booking, open payment
    bookingModal.classList.remove('open');
    paymentModal.classList.add('open');
  }
  
  function closePaymentModal() {
    paymentModal.classList.remove('open');
    document.body.style.overflow = '';
  }
  
  function openConfirmationModal() {
    // Generate booking ID
    const bookingId = 'SP-2025-' + Math.random().toString(36).substr(2, 5).toUpperCase();
    
    // Update confirmation details
    document.getElementById('bookingId').textContent = bookingId;
    document.getElementById('confRoomName').textContent = currentBookingData.roomName;
    document.getElementById('confCheckin').textContent = formatDate(currentBookingData.checkin);
    document.getElementById('confCheckout').textContent = formatDate(currentBookingData.checkout);
    document.getElementById('confTotal').textContent = `₹${currentBookingData.total.toLocaleString()}`;
    
    // Close payment, open confirmation
    paymentModal.classList.remove('open');
    confirmationModal.classList.add('open');
  }
  
  function closeConfirmationModal() {
    confirmationModal.classList.remove('open');
    document.body.style.overflow = '';
    
    // Reset booking data
    currentBookingData = {};
    
    // Show success notification
    showNotification('Your booking is confirmed! Check your email for details.', 'success');
  }
  
  // Modal event listeners
  if (document.getElementById('closeBookingModal')) {
    document.getElementById('closeBookingModal').addEventListener('click', closeBookingModal);
    document.getElementById('bookingOverlay').addEventListener('click', closeBookingModal);
    document.getElementById('backToSearch').addEventListener('click', closeBookingModal);
  }
  
  if (document.getElementById('closePaymentModal')) {
    document.getElementById('closePaymentModal').addEventListener('click', closePaymentModal);
    document.getElementById('paymentOverlay').addEventListener('click', closePaymentModal);
    document.getElementById('backToBooking').addEventListener('click', () => {
      paymentModal.classList.remove('open');
      bookingModal.classList.add('open');
    });
  }
  
  if (document.getElementById('closeConfirmation')) {
    document.getElementById('closeConfirmation').addEventListener('click', closeConfirmationModal);
    document.getElementById('confirmationOverlay').addEventListener('click', closeConfirmationModal);
  }
  
  // Proceed to payment button
  document.getElementById('proceedToPayment').addEventListener('click', openPaymentModal);
  
  /* ── Payment Methods Tabs ───────────── */
  const paymentTabs = document.querySelectorAll('.payment-tab');
  const paymentPanels = document.querySelectorAll('.payment-panel');
  
  paymentTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const method = tab.dataset.method;
      
      // Update tabs
      paymentTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      
      // Update panels
      paymentPanels.forEach(p => p.classList.remove('active'));
      document.getElementById(`${method}Panel`).classList.add('active');
    });
  });
  
  /* ── Card Number Formatting ─────────── */
  const cardNumberInput = document.getElementById('cardNumber');
  if (cardNumberInput) {
    cardNumberInput.addEventListener('input', (e) => {
      let value = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
      let formattedValue = '';
      for (let i = 0; i < value.length && i < 16; i++) {
        if (i > 0 && i % 4 === 0) formattedValue += ' ';
        formattedValue += value[i];
      }
      e.target.value = formattedValue;
      
      // Detect card type
      const firstDigit = value.charAt(0);
      const visaIcon = document.getElementById('visaIcon');
      const mastercardIcon = document.getElementById('mastercardIcon');
      
      visaIcon.classList.remove('active');
      mastercardIcon.classList.remove('active');
      
      if (firstDigit === '4') {
        visaIcon.classList.add('active');
      } else if (firstDigit === '5') {
        mastercardIcon.classList.add('active');
      }
    });
  }
  
  /* ── Card Expiry Formatting ──────────── */
  const cardExpiryInput = document.getElementById('cardExpiry');
  if (cardExpiryInput) {
    cardExpiryInput.addEventListener('input', (e) => {
      let value = e.target.value.replace(/\D/g, '');
      if (value.length >= 2) {
        value = value.substring(0, 2) + '/' + value.substring(2, 4);
      }
      e.target.value = value;
    });
  }
  
  /* ── Pay Now Button ─────────────────── */
  document.getElementById('payNowBtn').addEventListener('click', () => {
    // Get active payment method
    const activeTab = document.querySelector('.payment-tab.active');
    const method = activeTab.dataset.method;
    
    let isValid = true;
    
    if (method === 'card') {
      const cardNumber = document.getElementById('cardNumber').value.replace(/\s/g, '');
      const cardExpiry = document.getElementById('cardExpiry').value;
      const cardCvv = document.getElementById('cardCvv').value;
      const cardName = document.getElementById('cardName').value.trim();
      
      if (cardNumber.length < 16) {
        showNotification('Please enter a valid card number', 'error');
        isValid = false;
      } else if (!cardExpiry.match(/^\d{2}\/\d{2}$/)) {
        showNotification('Please enter a valid expiry date (MM/YY)', 'error');
        isValid = false;
      } else if (cardCvv.length < 3) {
        showNotification('Please enter a valid CVV', 'error');
        isValid = false;
      } else if (!cardName) {
        showNotification('Please enter the name on card', 'error');
        isValid = false;
      }
    } else if (method === 'upi') {
      const upiId = document.getElementById('upiId').value.trim();
      if (!upiId || !upiId.includes('@')) {
        showNotification('Please enter a valid UPI ID', 'error');
        isValid = false;
      }
    } else if (method === 'netbanking') {
      const bank = document.getElementById('bankSelect').value;
      if (!bank) {
        showNotification('Please select your bank', 'error');
        isValid = false;
      }
    }
    
    if (isValid) {
      // Show loading state
      const payBtn = document.getElementById('payNowBtn');
      const originalContent = payBtn.innerHTML;
      payBtn.innerHTML = '<span class=\"btn-loader\"></span>Processing...';
      payBtn.disabled = true;
      
      // Simulate payment processing
      setTimeout(() => {
        payBtn.innerHTML = originalContent;
        payBtn.disabled = false;
        openConfirmationModal();
      }, 2500);
    }
  });
  
  /* ── Helper Functions ──────────────── */
  function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' };
    return date.toLocaleDateString('en-IN', options);
  }
  
  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
  
  /* ── Contact Form ──────────────────── */
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(contactForm);
      const data = Object.fromEntries(formData);
      
      showNotification('Thank you! Your message has been sent. We will respond shortly.', 'success');
      contactForm.reset();
    });
  }
  
  /* ── Newsletter Form ───────────────── */
  document.querySelectorAll('.newsletter-form').forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      showNotification('Thank you for subscribing!', 'success');
      form.reset();
    });
  });
  
  /* ── Smooth Scroll for Anchor Links ── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const target = this.getAttribute('href');
      if (target === '#') return;
      const targetEl = document.querySelector(target);
      if (targetEl) {
        e.preventDefault();
        const headerOffset = 100;
        const elementPosition = targetEl.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
      }
    });
  });
  
  /* ── Notification Helper ───────────── */
  function showNotification(message, type = 'info') {
    // Remove existing notification
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.setAttribute('role', 'alert');
    notification.innerHTML = `
      <span>${message}</span>
      <button class="notification-close" aria-label="Close">&times;</button>
    `;
    
    // Style
    Object.assign(notification.style, {
      position: 'fixed',
      top: '20px',
      right: '20px',
      padding: '14px 20px',
      background: type === 'error' ? '#dc3545' : '#2B5A8D',
      color: 'white',
      borderRadius: '8px',
      boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
      zIndex: '9999',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      maxWidth: '400px',
      fontSize: '14px',
      fontWeight: '500',
      animation: 'slideInRight 0.3s ease'
    });
    
    document.body.appendChild(notification);
    
    // Close button
    notification.querySelector('.notification-close').addEventListener('click', () => {
      notification.remove();
    });
    
    // Auto close
    setTimeout(() => notification.remove(), 5000);
  }
  
  /* ── Scroll Animations ─────────────── */
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);
  
  // Observe elements for scroll animations
  document.querySelectorAll('.amenity-card, .room-card, .restaurant-card, .service-card, .gallery-item').forEach(el => {
    el.classList.add('scroll-animate');
    observer.observe(el);
  });
});

// Add keyframes for notification animation
const style = document.createElement('style');
style.textContent = `
  @keyframes slideInRight {
    from { transform: translateX(120%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  
  .scroll-animate {
    opacity: 0;
    transform: translateY(20px);
    transition: opacity 0.6s ease, transform 0.6s ease;
  }
  .scroll-animate.in-view {
    opacity: 1;
    transform: translateY(0);
  }
  .scroll-animate:nth-child(1) { transition-delay: 0.05s; }
  .scroll-animate:nth-child(2) { transition-delay: 0.1s; }
  .scroll-animate:nth-child(3) { transition-delay: 0.15s; }
  .scroll-animate:nth-child(4) { transition-delay: 0.2s; }
  .scroll-animate:nth-child(5) { transition-delay: 0.25s; }
  .scroll-animate:nth-child(6) { transition-delay: 0.3s; }
  
  @media (prefers-reduced-motion: reduce) {
    .scroll-animate { opacity: 1; transform: none; transition: none; }
  }
`;
document.head.appendChild(style);
