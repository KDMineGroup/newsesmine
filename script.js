// ============================================
// SESMine - Complete JavaScript
// Smart Engineering Solutions for Mining
// ============================================

/**
 * SESMine Platform - Main JavaScript Module
 * Provides comprehensive functionality for the SESMine mining intelligence platform
 */
const SESMine = (function() {
  'use strict';
  
  // Configuration
  const config = {
    animationDuration: 1000,
    loadingDuration: 3500,
    scrollThreshold: 120,
    apiEndpoint: 'https://api.sesmine.com/v1',
    debugMode: false
  };
  
  // State management
  const state = {
    isLoading: false,
    isMenuOpen: false,
    registrationData: {},
    currentUser: null,
    notifications: []
  };
  
  // Utility functions
  const utils = {
    /**
     * Log messages in debug mode
     * @param {string} type - Log type (log, warn, error, info)
     * @param {string} message - Message to log
     * @param {*} data - Optional data to log
     */
    log(type, message, data) {
      if (config.debugMode) {
        if (data) {
          console[type](`🏔️ SESMine: ${message}`, data);
        } else {
          console[type](`🏔️ SESMine: ${message}`);
        }
      }
    },
    
    /**
     * Get element by selector
     * @param {string} selector - CSS selector
     * @returns {HTMLElement|null} - Element or null
     */
    $(selector) {
      return document.querySelector(selector);
    },
    
    /**
     * Get all elements matching selector
     * @param {string} selector - CSS selector
     * @returns {NodeList} - List of matching elements
     */
    $$(selector) {
      return document.querySelectorAll(selector);
    },
    
    /**
     * Create an element with attributes and children
     * @param {string} tag - Element tag name
     * @param {Object} attrs - Element attributes
     * @param {Array|string} children - Child elements or text content
     * @returns {HTMLElement} - Created element
     */
    createElement(tag, attrs = {}, children = []) {
      const element = document.createElement(tag);
      
      // Set attributes
      Object.entries(attrs).forEach(([key, value]) => {
        if (key === 'class') {
          element.className = value;
        } else if (key === 'dataset') {
          Object.entries(value).forEach(([dataKey, dataValue]) => {
            element.dataset[dataKey] = dataValue;
          });
        } else if (key === 'style') {
          Object.entries(value).forEach(([styleKey, styleValue]) => {
            element.style[styleKey] = styleValue;
          });
        } else if (key.startsWith('on')) {
          element.addEventListener(key.substring(2).toLowerCase(), value);
        } else {
          element.setAttribute(key, value);
        }
      });
      
      // Add children
      if (Array.isArray(children)) {
        children.forEach(child => {
          if (typeof child === 'string') {
            element.appendChild(document.createTextNode(child));
          } else if (child instanceof Node) {
            element.appendChild(child);
          }
        });
      } else if (typeof children === 'string') {
        element.textContent = children;
      }
      
      return element;
    },
    
    /**
     * Debounce function to limit execution rate
     * @param {Function} func - Function to debounce
     * @param {number} wait - Wait time in ms
     * @returns {Function} - Debounced function
     */
    debounce(func, wait) {
      let timeout;
      return function executedFunction(...args) {
        const later = () => {
          clearTimeout(timeout);
          func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
      };
    },
    
    /**
     * Format date to locale string
     * @param {Date|string} date - Date to format
     * @param {Object} options - Intl.DateTimeFormat options
     * @returns {string} - Formatted date string
     */
    formatDate(date, options = {}) {
      const defaultOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      };
      const mergedOptions = { ...defaultOptions, ...options };
      return new Intl.DateTimeFormat(navigator.language, mergedOptions).format(
        typeof date === 'string' ? new Date(date) : date
      );
    },
    
    /**
     * Validate email format
     * @param {string} email - Email to validate
     * @returns {boolean} - Is email valid
     */
    isValidEmail(email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    },
    
    /**
     * Get viewport dimensions
     * @returns {Object} - Width and height
     */
    getViewport() {
      return {
        width: window.innerWidth || document.documentElement.clientWidth,
        height: window.innerHeight || document.documentElement.clientHeight
      };
    },
    
    /**
     * Check if element is in viewport
     * @param {HTMLElement} element - Element to check
     * @param {number} offset - Offset from viewport edge
     * @returns {boolean} - Is element in viewport
     */
    isInViewport(element, offset = 0) {
      const rect = element.getBoundingClientRect();
      const viewport = this.getViewport();
      
      return (
        rect.top >= 0 - offset &&
        rect.left >= 0 - offset &&
        rect.bottom <= viewport.height + offset &&
        rect.right <= viewport.width + offset
      );
    },
    
    /**
     * Smooth scroll to element
     * @param {HTMLElement|string} target - Target element or selector
     * @param {number} offset - Offset from top
     * @param {number} duration - Animation duration
     */
    scrollTo(target, offset = 0, duration = 1000) {
      const targetElement = typeof target === 'string' ? this.$(target) : target;
      if (!targetElement) return;
      
      const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - offset;
      const startPosition = window.pageYOffset;
      const distance = targetPosition - startPosition;
      let startTime = null;
      
      function animation(currentTime) {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const progress = Math.min(timeElapsed / duration, 1);
        const ease = t => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
        
        window.scrollTo(0, startPosition + distance * ease(progress));
        
        if (timeElapsed < duration) {
          requestAnimationFrame(animation);
        }
      }
      
      requestAnimationFrame(animation);
    },
    
    /**
     * Generate a unique ID
     * @returns {string} - Unique ID
     */
    generateId() {
      return 'id_' + Math.random().toString(36).substr(2, 9);
    },
    
    /**
     * Store data in localStorage
     * @param {string} key - Storage key
     * @param {*} value - Value to store
     */
    storeData(key, value) {
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch (error) {
        this.log('error', 'Failed to store data', error);
      }
    },
    
    /**
     * Retrieve data from localStorage
     * @param {string} key - Storage key
     * @param {*} defaultValue - Default value if not found
     * @returns {*} - Retrieved value
     */
    retrieveData(key, defaultValue = null) {
      try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : defaultValue;
      } catch (error) {
        this.log('error', 'Failed to retrieve data', error);
        return defaultValue;
      }
    }
  };
  
  // UI Components
  const ui = {
    /**
     * Initialize UI components
     */
    init() {
      this.header.init();
      this.mobileMenu.init();
      this.modals.init();
      this.forms.init();
      this.notifications.init();
    },
    
    /**
     * Header component
     */
    header: {
      init() {
        const header = utils.$('#mainHeader');
        if (!header) return;
        
        // Handle scroll events
        window.addEventListener('scroll', utils.debounce(() => {
          if (window.scrollY > config.scrollThreshold) {
            header.classList.add('scrolled');
          } else {
            header.classList.remove('scrolled');
          }
        }, 100));
        
        // Set active nav link
        const navLinks = utils.$$('.nav-link');
        const currentPath = window.location.pathname;
        
        navLinks.forEach(link => {
          const href = link.getAttribute('href');
          if (href === currentPath || (href === 'index.html' && (currentPath === '/' || currentPath.endsWith('/')))) {
            link.classList.add('active');
          } else if (href !== 'index.html' && currentPath.includes(href)) {
            link.classList.add('active');
          }
        });
      }
    },
    
    /**
     * Mobile menu component
     */
    mobileMenu: {
      init() {
        const menuToggle = utils.$('.mobile-menu-toggle');
        const mobileMenu = utils.$('.mobile-menu');
        if (!menuToggle || !mobileMenu) return;
        
        menuToggle.addEventListener('click', () => {
          if (state.isMenuOpen) {
            this.close();
          } else {
            this.open();
          }
        });
        
        // Close menu when clicking a link
        const mobileLinks = utils.$$('.mobile-menu .nav-link');
        mobileLinks.forEach(link => {
          link.addEventListener('click', () => this.close());
        });
        
        // Close menu on escape key
        document.addEventListener('keydown', (e) => {
          if (e.key === 'Escape' && state.isMenuOpen) {
            this.close();
          }
        });
      },
      
      open() {
        const menuToggle = utils.$('.mobile-menu-toggle');
        const mobileMenu = utils.$('.mobile-menu');
        if (!menuToggle || !mobileMenu) return;
        
        mobileMenu.classList.add('active');
        menuToggle.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden';
        state.isMenuOpen = true;
      },
      
      close() {
        const menuToggle = utils.$('.mobile-menu-toggle');
        const mobileMenu = utils.$('.mobile-menu');
        if (!menuToggle || !mobileMenu) return;
        
        mobileMenu.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
        state.isMenuOpen = false;
      }
    },
    
    /**
     * Modal component
     */
    modals: {
      activeModal: null,
      
      init() {
        // Initialize all modals
        const modals = utils.$$('.modal');
        const modalTriggers = utils.$$('[data-modal]');
        
        modals.forEach(modal => {
          const closeBtn = modal.querySelector('.close-modal');
          if (closeBtn) {
            closeBtn.addEventListener('click', () => this.close(modal.id));
          }
          
          // Close modal when clicking outside
          modal.addEventListener('click', (e) => {
            if (e.target === modal) {
              this.close(modal.id);
            }
          });
        });
        
        // Modal triggers
        modalTriggers.forEach(trigger => {
          trigger.addEventListener('click', (e) => {
            e.preventDefault();
            const modalId = trigger.dataset.modal;
            this.open(modalId);
          });
        });
        
        // Close modal on escape key
        document.addEventListener('keydown', (e) => {
          if (e.key === 'Escape' && this.activeModal) {
            this.close(this.activeModal);
          }
        });
      },
      
      open(modalId) {
        const modal = utils.$(`#${modalId}`);
        if (!modal) return;
        
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        this.activeModal = modalId;
        
        // Focus first focusable element
        setTimeout(() => {
          const focusable = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
          if (focusable.length) {
            focusable[0].focus();
          }
        }, 100);
        
        // Track interaction
        analytics.trackEvent('modal_opened', { modalId });
      },
      
      close(modalId) {
        const modal = utils.$(`#${modalId}`);
        if (!modal) return;
        
        modal.style.display = 'none';
        document.body.style.overflow = '';
        this.activeModal = null;
        
        // Track interaction
        analytics.trackEvent('modal_closed', { modalId });
      }
    },
    
    /**
     * Form handling component
     */
    forms: {
      init() {
        const forms = utils.$$('form[data-form]');
        forms.forEach(form => {
          form.addEventListener('submit', this.handleSubmit.bind(this));
          
          // Add validation to required fields
          const requiredFields = form.querySelectorAll('[required]');
          requiredFields.forEach(field => {
            field.addEventListener('blur', () => this.validateField(field));
          });
        });
        
        // Initialize access level selection in registration form
        this.initAccessLevels();
      },
      
      initAccessLevels() {
        const accessLevels = utils.$$('.access-level');
        accessLevels.forEach(level => {
          level.addEventListener('click', function() {
            accessLevels.forEach(l => l.classList.remove('selected'));
            this.classList.add('selected');
            this.querySelector('input[type="radio"]').checked = true;
          });
          
          // Keyboard accessibility
          level.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              this.click();
            }
          });
        });
      },
      
      validateField(field) {
        const value = field.value.trim();
        const name = field.name;
        let isValid = true;
        let errorMessage = '';
        
        // Remove existing error message
        const existingError = field.parentNode.querySelector('.form-error');
        if (existingError) {
          existingError.remove();
        }
        
        // Clear error class
        field.classList.remove('error');
        
        // Required validation
        if (field.hasAttribute('required') && !value) {
          isValid = false;
          errorMessage = `${this.getFieldLabel(name)} is required`;
        }
        
        // Email validation
        if (name === 'email' && value && !utils.isValidEmail(value)) {
          isValid = false;
          errorMessage = 'Please enter a valid email address';
        }
        
        // Password validation
        if (name === 'password' && value && value.length < 8) {
          isValid = false;
          errorMessage = 'Password must be at least 8 characters';
        }
        
        // Password confirmation
        if (name === 'passwordConfirm') {
          const password = field.form.querySelector('[name="password"]').value;
          if (value !== password) {
            isValid = false;
            errorMessage = 'Passwords do not match';
          }
        }
        
        // Display error if invalid
        if (!isValid) {
          field.classList.add('error');
          const errorElement = utils.createElement('div', { class: 'form-error' }, errorMessage);
          field.parentNode.appendChild(errorElement);
        }
        
        return isValid;
      },
      
      validateForm(form) {
        const requiredFields = form.querySelectorAll('[required]');
        let isValid = true;
        
        requiredFields.forEach(field => {
          if (!this.validateField(field)) {
            isValid = false;
          }
        });
        
        return isValid;
      },
      
      getFieldLabel(name) {
        // Convert camelCase or snake_case to Title Case with spaces
        return name
          .replace(/([A-Z])/g, ' $1')
          .replace(/_/g, ' ')
          .replace(/^\w/, c => c.toUpperCase());
      },
      
      async handleSubmit(e) {
        e.preventDefault();
        const form = e.target;
        const formId = form.dataset.form;
        
        // Validate form
        if (!this.validateForm(form)) {
          return;
        }
        
        // Show loading state
        const submitBtn = form.querySelector('[type="submit"]');
        if (submitBtn) {
          const originalText = submitBtn.innerHTML;
          submitBtn.disabled = true;
          submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
        }
        
        try {
          const formData = new FormData(form);
          const data = {};
          
          formData.forEach((value, key) => {
            data[key] = value;
          });
          
          // Process form based on type
          switch (formId) {
            case 'registration':
              await this.processRegistration(data);
              break;
            case 'login':
              await this.processLogin(data);
              break;
            case 'contact':
              await this.processContact(data);
              break;
            default:
              // Generic form submission
              await this.processGenericForm(formId, data);
          }
          
          // Show success notification
          ui.notifications.show(`Form submitted successfully!`, 'success');
          
          // Reset form
          form.reset();
          
          // Track form submission
          analytics.trackEvent('form_submitted', { formId });
          
        } catch (error) {
          ui.notifications.show(`Error: ${error.message}`, 'error');
          utils.log('error', 'Form submission error', error);
        } finally {
          // Restore submit button
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
          }
        }
      },
      
      async processRegistration(data) {
        // Add timestamp and status
        data.timestamp = new Date().toISOString();
        data.status = 'pending_approval';
        
        // Store registration data
        state.registrationData = data;
        utils.storeData('sesmine_registrations', data);
        
        // Close modal if open
        if (ui.modals.activeModal === 'registrationModal') {
          ui.modals.close('registrationModal');
        }
        
        // Redirect to login page after delay
        setTimeout(() => {
          window.location.href = 'login.html';
        }, 2000);
      },
      
      async processLogin(data) {
        // Simulate login process
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Store user data
        state.currentUser = {
          email: data.email,
          name: 'Demo User',
          role: 'user',
          loginTime: new Date().toISOString()
        };
        
        utils.storeData('sesmine_user', state.currentUser);
        
        // Redirect to dashboard
        window.location.href = 'index.html';
      },
      
      async processContact(data) {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // In a real app, send to backend
        console.log('Contact form data:', data);
      },
      
      async processGenericForm(formId, data) {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // In a real app, send to backend
        console.log(`Form ${formId} data:`, data);
      }
    },
    
    /**
     * Notification component
     */
    notifications: {
      init() {
        // Create notification container if it doesn't exist
        if (!utils.$('#notification-container')) {
          const container = utils.createElement('div', { id: 'notification-container' });
          document.body.appendChild(container);
        }
      },
      
      show(message, type = 'info', duration = 5000) {
        const container = utils.$('#notification-container');
        const id = utils.generateId();
        
        const iconMap = {
          info: 'fas fa-info-circle',
          success: 'fas fa-check-circle',
          warning: 'fas fa-exclamation-triangle',
          error: 'fas fa-times-circle'
        };
        
        const notification = utils.createElement('div', {
          class: `notification ${type}`,
          id: id
        }, [
          utils.createElement('div', { class: 'notification-content' }, [
            utils.createElement('i', { class: `notification-icon ${iconMap[type]}` }),
            utils.createElement('span', { class: 'notification-message' }, message),
            utils.createElement('button', {
              class: 'notification-close',
              onclick: () => this.hide(id),
              'aria-label': 'Close notification'
            }, [
              utils.createElement('i', { class: 'fas fa-times' })
            ])
          ])
        ]);
        
        container.appendChild(notification);
        
        // Show notification after a small delay
        setTimeout(() => {
          notification.classList.add('show');
        }, 10);
        
        // Auto-hide notification
        if (duration > 0) {
          setTimeout(() => {
            this.hide(id);
          }, duration);
        }
        
        return id;
      },
      
      hide(id) {
        const notification = utils.$(`#${id}`);
        if (!notification) return;
        
        notification.classList.remove('show');
        
        // Remove from DOM after animation
        setTimeout(() => {
          notification.remove();
        }, 300);
      }
    },
    
    /**
     * Loading system component
     */
    loading: {
      init() {
        const loadingOverlay = utils.$('#loadingOverlay');
        const loadingText = loadingOverlay ? loadingOverlay.querySelector('.loading-text') : null;
        
        if (!loadingOverlay) return;
        
        const messages = [
          'Initializing SESMine Platform...',
          'Loading Mining Intelligence Systems...',
          'Connecting Professional Hubs...',
          'Preparing Analytics Engine...',
          'Establishing Secure Connections...',
          'Platform Ready for Mining Excellence'
        ];
        
        let messageIndex = 0;
        const messageInterval = setInterval(() => {
          if (messageIndex < messages.length - 1) {
            messageIndex++;
            if (loadingText) {
              loadingText.textContent = messages[messageIndex];
            }
          } else {
            clearInterval(messageInterval);
          }
        }, 600);
        
        setTimeout(() => {
          loadingOverlay.classList.add('hidden');
          clearInterval(messageInterval);
          
          // Initialize post-load animations
          setTimeout(() => {
            this.initializePostLoadAnimations();
          }, 400);
        }, config.loadingDuration);
      },
      
      show() {
        const loadingOverlay = utils.$('#loadingOverlay');
        if (!loadingOverlay) return;
        
        loadingOverlay.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
      },
      
      hide() {
        const loadingOverlay = utils.$('#loadingOverlay');
        if (!loadingOverlay) return;
        
        loadingOverlay.classList.add('hidden');
        document.body.style.overflow = '';
      },
      
      initializePostLoadAnimations() {
        const heroElements = [
          '.hero-badge',
          '.hero-title',
          '.hero-description',
          '.hero-actions',
          '.hero-stats'
        ];
        
        heroElements.forEach((selector, index) => {
          const element = utils.$(selector);
          if (element) {
            setTimeout(() => {
              element.style.opacity = '1';
              element.style.transform = 'translateY(0)';
            }, index * 300);
          }
        });
        
        setTimeout(() => {
          const preview = utils.$('.platform-preview');
          if (preview) {
            preview.style.opacity = '1';
            preview.style.transform = 'translateX(0) scale(1)';
          }
        }, 1200);
      }
    }
  };
  
  // Animation system
  const animations = {
    init() {
      this.initScrollEffects();
      this.initServiceCards();
      this.initCounters();
      this.initAOS();
    },
    
    initScrollEffects() {
      // Intersection Observer for animations
      const observerOptions = {
        threshold: [0.1, 0.3, 0.5],
        rootMargin: '0px 0px -80px 0px'
      };
      
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.3) {
            entry.target.classList.add('visible');
          }
        });
      }, observerOptions);
      
      utils.$$('.fade-in, .slide-in-left, .slide-in-right').forEach(el => {
        observer.observe(el);
      });
      
      // Smooth scrolling for navigation
      utils.$$('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
          const href = this.getAttribute('href');
          if (href !== '#') {
            e.preventDefault();
            const target = utils.$(href);
            if (target) {
              utils.scrollTo(target, 80);
            }
          }
        });
      });
    },
    
    initServiceCards() {
      // Service cards hover effects
      const serviceCards = utils.$$('.service-card');
      serviceCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
          this.style.transform = 'translateY(-12px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
          this.style.transform = 'translateY(0) scale(1)';
        });
        
        // Add ripple effect on click
        card.addEventListener('click', function(e) {
          const ripple = utils.createElement('div');
          ripple.style.cssText = `
            position: absolute;
            border-radius: 50%;
            background: rgba(92, 107, 80, 0.4);
            transform: scale(0);
            animation: ripple 0.8s ease-out;
            pointer-events: none;
          `;
          
          const rect = this.getBoundingClientRect();
          const size = Math.max(rect.width, rect.height);
          ripple.style.width = ripple.style.height = size + 'px';
          ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
          ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
          
          this.style.position = 'relative';
          this.appendChild(ripple);
          
          setTimeout(() => {
            ripple.remove();
          }, 800);
        });
      });
    },
    
    initCounters() {
      const counters = utils.$$('.stat-number');
      
      const animateCounter = (counter) => {
        const target = parseInt(counter.dataset.target);
        const duration = 3000;
        const step = target / (duration / 16);
        let current = 0;
        
        const timer = setInterval(() => {
          current += step;
          if (current >= target) {
            current = target;
            clearInterval(timer);
          }
          
          const suffix = counter.dataset.suffix || '';
          counter.textContent = Math.floor(current) + suffix;
        }, 16);
      };
      
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const counter = entry.target;
            setTimeout(() => {
              animateCounter(counter);
            }, 400);
            observer.unobserve(counter);
          }
        });
      });
      
      counters.forEach(counter => observer.observe(counter));
    },
    
    initAOS() {
      // Initialize AOS if available
      if (typeof AOS !== 'undefined') {
        AOS.init({
          duration: config.animationDuration,
          once: true,
          offset: 100,
          disable: window.matchMedia('(prefers-reduced-motion: reduce)').matches
        });
      }
    }
  };
  
  // Analytics system
  const analytics = {
    init() {
      this.setupEventTracking();
      this.trackPageView();
    },
    
    setupEventTracking() {
      // Track clicks on important elements
      const trackableElements = utils.$$('[data-track]');
      trackableElements.forEach(element => {
        element.addEventListener('click', () => {
          const category = element.dataset.trackCategory || 'engagement';
          const action = element.dataset.track;
          const label = element.dataset.trackLabel || '';
          
          this.trackEvent(action, { category, label });
        });
      });
    },
    
    trackPageView() {
      const page = {
        title: document.title,
        path: window.location.pathname,
        referrer: document.referrer
      };
      
      // Log page view
      utils.log('info', 'Page view', page);
      
      // Send to analytics service if available
      if (typeof gtag !== 'undefined') {
        gtag('event', 'page_view', {
          page_title: page.title,
          page_path: page.path,
          page_referrer: page.referrer
        });
      }
    },
    
    trackEvent(action, data = {}) {
      // Log event
      utils.log('info', `Event: ${action}`, data);
      
      // Send to analytics service if available
      if (typeof gtag !== 'undefined') {
        gtag('event', action, {
          event_category: data.category || 'engagement',
          event_label: data.label || '',
          value: data.value || 1
        });
      }
    }
  };
  
  // User system
  const user = {
    init() {
      this.loadUserData();
      this.updateUI();
    },
    
    loadUserData() {
      state.currentUser = utils.retrieveData('sesmine_user');
    },
    
    updateUI() {
      const userElements = utils.$$('[data-user]');
      const authButtons = utils.$('.auth-buttons');
      const userMenu = utils.$('.user-menu');
      
      if (state.currentUser) {
        // Update user-specific elements
        userElements.forEach(element => {
          const userProperty = element.dataset.user;
          if (userProperty && state.currentUser[userProperty]) {
            element.textContent = state.currentUser[userProperty];
          }
        });
        
        // Show user menu, hide auth buttons
        if (authButtons) authButtons.style.display = 'none';
        if (userMenu) userMenu.style.display = 'flex';
      } else {
        // Hide user menu, show auth buttons
        if (authButtons) authButtons.style.display = 'flex';
        if (userMenu) userMenu.style.display = 'none';
      }
    },
    
    logout() {
      localStorage.removeItem('sesmine_user');
      state.currentUser = null;
      this.updateUI();
      
      // Redirect to home page
      window.location.href = 'index.html';
    }
  };
  
  // Features system
  const features = {
    init() {
      this.initTabs();
      this.initAccordions();
      this.initCarousels();
    },
    
    initTabs() {
      const tabContainers = utils.$$('.tabs-container');
      
      tabContainers.forEach(container => {
        const tabs = container.querySelectorAll('.tab');
        const tabContents = container.querySelectorAll('.tab-content');
        
        tabs.forEach(tab => {
          tab.addEventListener('click', () => {
            const target = tab.dataset.tab;
            
            // Update active tab
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            // Show target content
            tabContents.forEach(content => {
              content.classList.remove('active');
              if (content.id === target) {
                content.classList.add('active');
              }
            });
            
            // Track tab change
            analytics.trackEvent('tab_changed', { tab: target });
          });
        });
      });
    },
    
    initAccordions() {
      const accordions = utils.$$('.accordion');
      
      accordions.forEach(accordion => {
        const headers = accordion.querySelectorAll('.accordion-header');
        
        headers.forEach(header => {
          header.addEventListener('click', () => {
            const item = header.parentElement;
            const isActive = item.classList.contains('active');
            
            // Close all items
            if (!header.dataset.allowMultiple) {
              accordion.querySelectorAll('.accordion-item').forEach(i => {
                i.classList.remove('active');
              });
            }
            
            // Toggle current item
            if (isActive) {
              item.classList.remove('active');
            } else {
              item.classList.add('active');
            }
            
            // Track accordion interaction
            analytics.trackEvent('accordion_toggled', {
              id: item.id,
              state: !isActive ? 'opened' : 'closed'
            });
          });
        });
      });
    },
    
    initCarousels() {
      const carousels = utils.$$('.carousel');
      
      carousels.forEach(carousel => {
        const container = carousel.querySelector('.carousel-container');
        const items = carousel.querySelectorAll('.carousel-item');
        const nextBtn = carousel.querySelector('.carousel-next');
        const prevBtn = carousel.querySelector('.carousel-prev');
        const dots = carousel.querySelector('.carousel-dots');
        
        if (!container || items.length === 0) return;
        
        let currentIndex = 0;
        const itemCount = items.length;
        
        // Create dots if container exists
        if (dots) {
          items.forEach((_, i) => {
            const dot = utils.createElement('button', {
              class: i === 0 ? 'carousel-dot active' : 'carousel-dot',
              'aria-label': `Go to slide ${i + 1}`,
              onclick: () => goToSlide(i)
            });
            dots.appendChild(dot);
          });
        }
        
        // Navigation buttons
        if (nextBtn) {
          nextBtn.addEventListener('click', () => {
            goToSlide((currentIndex + 1) % itemCount);
          });
        }
        
        if (prevBtn) {
          prevBtn.addEventListener('click', () => {
            goToSlide((currentIndex - 1 + itemCount) % itemCount);
          });
        }
        
        // Swipe support
        let touchStartX = 0;
        let touchEndX = 0;
        
        carousel.addEventListener('touchstart', e => {
          touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });
        
        carousel.addEventListener('touchend', e => {
          touchEndX = e.changedTouches[0].screenX;
          handleSwipe();
        }, { passive: true });
        
        function handleSwipe() {
          const threshold = 50;
          if (touchStartX - touchEndX > threshold) {
            // Swipe left
            goToSlide((currentIndex + 1) % itemCount);
          } else if (touchEndX - touchStartX > threshold) {
            // Swipe right
            goToSlide((currentIndex - 1 + itemCount) % itemCount);
          }
        }
        
        function goToSlide(index) {
          // Update current index
          currentIndex = index;
          
          // Update container position
          container.style.transform = `translateX(-${currentIndex * 100}%)`;
          
          // Update dots
          if (dots) {
            const dotButtons = dots.querySelectorAll('.carousel-dot');
            dotButtons.forEach((dot, i) => {
              if (i === currentIndex) {
                dot.classList.add('active');
              } else {
                dot.classList.remove('active');
              }
            });
          }
          
          // Track carousel interaction
          analytics.trackEvent('carousel_changed', {
            id: carousel.id,
            slide: currentIndex
          });
        }
        
        // Auto-play if enabled
        if (carousel.dataset.autoplay) {
          const interval = parseInt(carousel.dataset.interval) || 5000;
          
          setInterval(() => {
            if (document.visibilityState === 'visible') {
              goToSlide((currentIndex + 1) % itemCount);
            }
          }, interval);
        }
      });
    }
  };
  
  // Keyboard shortcuts
  const keyboard = {
    init() {
      document.addEventListener('keydown', this.handleKeydown.bind(this));
    },
    
    handleKeydown(e) {
      // Ctrl/Cmd + Shift + R: Quick Registration
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'R') {
        e.preventDefault();
        ui.modals.open('registrationModal');
      }
      
      // Escape: Close Modal (handled in modals component)
      
      // Ctrl/Cmd + K: Quick Navigation
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        this.showQuickNav();
      }
    },
    
    showQuickNav() {
      ui.notifications.show('🔍 Quick navigation: Use the main menu or scroll to explore sections!', 'info');
      
      // In a real implementation, show a search/navigation modal
    }
  };
  
  // Performance monitoring
  const performance = {
    init() {
      this.trackLoadTime();
      this.trackCoreWebVitals();
    },
    
    trackLoadTime() {
      window.addEventListener('load', () => {
        const loadTime = window.performance.now();
        utils.log('info', `Platform loaded in ${loadTime.toFixed(2)}ms`);
        
        // Track load time
        analytics.trackEvent('page_load_time', {
          value: Math.round(loadTime),
          category: 'performance'
        });
      });
    },
    
    trackCoreWebVitals() {
      // Track Core Web Vitals if available
      if ('web-vitals' in window) {
        const webVitals = window['web-vitals'];
        
        webVitals.getCLS(metric => {
          utils.log('info', 'CLS:', metric);
          analytics.trackEvent('core_web_vital', {
            category: 'performance',
            label: 'CLS',
            value: Math.round(metric.value * 1000)
          });
        });
        
        webVitals.getFID(metric => {
          utils.log('info', 'FID:', metric);
          analytics.trackEvent('core_web_vital', {
            category: 'performance',
            label: 'FID',
            value: Math.round(metric.value)
          });
        });
        
        webVitals.getLCP(metric => {
          utils.log('info', 'LCP:', metric);
          analytics.trackEvent('core_web_vital', {
            category: 'performance',
            label: 'LCP',
            value: Math.round(metric.value)
          });
        });
      }
    }
  };
  
  // Public API
  return {
    /**
     * Initialize the SESMine platform
     */
    init() {
      utils.log('info', 'Platform Initializing...');
      
      // Initialize components
      ui.loading.init();
      ui.init();
      animations.init();
      analytics.init();
      user.init();
      features.init();
      keyboard.init();
      performance.init();
      
      utils.log('info', 'Platform Ready');
    },
    
    /**
     * Show notification
     * @param {string} message - Notification message
     * @param {string} type - Notification type (info, success, warning, error)
     * @param {number} duration - Duration in ms (0 for persistent)
     * @returns {string} - Notification ID
     */
    notify(message, type = 'info', duration = 5000) {
      return ui.notifications.show(message, type, duration);
    },
    
    /**
     * Open modal
     * @param {string} modalId - ID of the modal to open
     */
    openModal(modalId) {
      ui.modals.open(modalId);
    },
    
    /**
     * Close modal
     * @param {string} modalId - ID of the modal to close
     */
    closeModal(modalId) {
      ui.modals.close(modalId);
    },
    
    /**
     * Get current user
     * @returns {Object|null} - Current user data or null if not logged in
     */
    getCurrentUser() {
      return state.currentUser;
    },
    
    /**
     * Logout current user
     */
    logout() {
      user.logout();
    },
    
    /**
     * Track custom event
     * @param {string} action - Event action
     * @param {Object} data - Event data
     */
    trackEvent(action, data = {}) {
      analytics.trackEvent(action, data);
    }
  };
})();

// Initialize on DOM content loaded
document.addEventListener('DOMContentLoaded', () => {
  SESMine.init();
});
