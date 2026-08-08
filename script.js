// script.js
document.addEventListener('DOMContentLoaded', function() {
  // Mobile menu toggle
  const menuToggle = document.getElementById('mobileMenuToggle');
  const nav = document.querySelector('.main-nav');
  
  if (menuToggle) {
    menuToggle.addEventListener('click', function() {
      if (nav.style.display === 'block') {
        nav.style.display = 'none';
      } else {
        nav.style.display = 'block';
        nav.style.position = 'absolute';
        nav.style.top = '80px';
        nav.style.left = '0';
        nav.style.width = '100%';
        nav.style.backgroundColor = 'white';
        nav.style.padding = '2rem';
        nav.style.boxShadow = 'var(--shadow)';
        nav.style.zIndex = '999';
        nav.style.borderTop = '1px solid #eee';
        
        // Style the nav list for mobile
        const ul = nav.querySelector('ul');
        ul.style.flexDirection = 'column';
        ul.style.alignItems = 'center';
        ul.style.gap = '1.5rem';
      }
    });
  }

  // Close mobile menu when clicking outside
  document.addEventListener('click', function(event) {
    if (nav && menuToggle && !nav.contains(event.target) && !menuToggle.contains(event.target)) {
      nav.style.display = 'none';
    }
  });

  // Contact form handling
  const contactForm = document.getElementById('contactForm');
  const successDiv = document.getElementById('formSuccess');

  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();

      // Get form data
      const formData = {
        name: document.getElementById('name').value.trim(),
        email: document.getElementById('email').value.trim(),
        phone: document.getElementById('phone').value.trim(),
        checkin: document.getElementById('checkin')?.value || '',
        checkout: document.getElementById('checkout')?.value || '',
        roomType: document.getElementById('room-type')?.value || '',
        message: document.getElementById('message')?.value || ''
      };

      // Validate
      if (!formData.name || !formData.email || !formData.phone) {
        alert('Please fill all required fields.');
        return;
      }

      if (!/^\d{10}$/.test(formData.phone)) {
        alert('Please enter a valid 10-digit phone number.');
        return;
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        alert('Please enter a valid email address.');
        return;
      }

      // Show success message (demo)
      successDiv.classList.remove('hidden');
      contactForm.reset();

      // Log for demo purposes
      console.log('Booking inquiry:', formData);

      // In production, send to backend
      // const bookingEndpoint = process.env.BOOKING_ENDPOINT || 'YOUR_BACKEND_URL/booking';
      // fetch(bookingEndpoint, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData)
      // })
      // .then(response => response.json())
      // .then(data => {
      //   if (data.success) {
      //     successDiv.classList.remove('hidden');
      //     contactForm.reset();
      //   } else {
      //     alert('Error submitting form. Please try again.');
      //   }
      // })
      // .catch(error => {
      //   console.error('Error:', error);
      //   alert('Network error. Please try again.');
      // });

      // Hide success message after 5 seconds
      setTimeout(() => {
        successDiv.classList.add('hidden');
      }, 5000);
    });
  }

  // Placeholder for booking buttons
  window.bookingPlaceholder = function(){
    alert('In production, this would link to your booking engine or OTA partner.');
    return false;
  };

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === "#") return;
      
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
        
        // Close mobile menu if open
        if (nav && nav.style.display === 'block') {
          nav.style.display = 'none';
        }
      }
    });
  });

  // Add active class to nav links on scroll
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.main-nav a');

  function updateActiveNavLink() {
    let current = '';
    const scrollPosition = window.scrollY + 100;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      const href = link.getAttribute('href').substring(1); // Remove #
      if (href === current) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', updateActiveNavLink);
  updateActiveNavLink(); // Call once to set initial state

  // Lazy loading for images (browser supports it, but we'll add intersection observer for older browsers)
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src || img.src;
          imageObserver.unobserve(img);
        }
      });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
      imageObserver.observe(img);
    });
  }

  // Add lightbox caption enhancement
  if (typeof lightbox !== 'undefined') {
    lightbox.option({
      'resizeDuration': 200,
      'wrapAround': true,
      'albumLabel': 'Image %1 of %2',
      'fadeDuration': 300,
      'imageFadeDuration': 300
    });
  }

  // Add to favorites/bookmark functionality (optional)
  const saveButton = document.querySelector('[aria-label="Save"]');
  if (saveButton) {
    saveButton.addEventListener('click', function(e) {
      e.preventDefault();
      this.classList.toggle('saved');
      if (this.classList.contains('saved')) {
        this.innerHTML = '<i class="fas fa-bookmark"></i> Saved';
      } else {
        this.innerHTML = '<i class="far fa-bookmark"></i> Save';
      }
    });
  }

  // Price calculator (simple demo)
  const checkinInput = document.getElementById('checkin');
  const checkoutInput = document.getElementById('checkout');
  
  if (checkinInput && checkoutInput) {
    function calculateNights() {
      if (checkinInput.value && checkoutInput.value) {
        const checkin = new Date(checkinInput.value);
        const checkout = new Date(checkoutInput.value);
        const diffTime = Math.abs(checkout - checkin);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays > 0 && diffDays < 30) {
          // Could display estimated price
          console.log(`Number of nights: ${diffDays}`);
        }
      }
    }
    
    checkinInput.addEventListener('change', calculateNights);
    checkoutInput.addEventListener('change', calculateNights);
  }
});

// Add active link styling
document.head.insertAdjacentHTML('beforeend', `
  <style>
    .main-nav a.active {
      color: var(--primary);
    }
    .main-nav a.active::after {
      width: 100%;
    }
  </style>
`);
