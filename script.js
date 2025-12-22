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
        const loadingOverlay = utils.$('#
