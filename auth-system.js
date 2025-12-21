// ============================================
// SESMine Platform - Authentication System
// Smart Engineering Solutions for Mining
// ============================================

class SESMineAuth {
  constructor() {
      this.config = window.SESMineConfig;
      this.currentUser = null;
      this.sessionTimer = null;
      this.loginAttempts = 0;
      this.isLocked = false;
      
      this.init();
  }

  init() {
      console.log('🔐 SESMine Authentication System Initializing...');
      
      // Check for existing session
      this.checkExistingSession();
      
      // Set up session monitoring
      this.setupSessionMonitoring();
      
      // Set up event listeners
      this.setupEventListeners();
      
      console.log('✅ Authentication System Ready');
  }

  // Session Management
  checkExistingSession() {
      const sessionData = this.getStoredData('session');
      const userData = this.getStoredData('user');
      
      if (sessionData && userData && this.isValidSession(sessionData)) {
          this.currentUser = userData;
          this.startSessionTimer();
          this.updateUIForLoggedInUser();
          console.log('👤 Existing session restored for:', userData.fullName);
      } else {
          this.clearSession();
      }
  }

  isValidSession(sessionData) {
      if (!sessionData.timestamp || !sessionData.token) return false;
      
      const sessionAge = Date.now() - sessionData.timestamp;
      const maxAge = this.config.security.sessionTimeout;
      
      return sessionAge < maxAge;
  }

  startSession(userData) {
      const sessionData = {
          token: this.generateSessionToken(),
          timestamp: Date.now(),
          userId: userData.id,
          accessLevel: userData.accessLevel
      };

      // Store session data
      this.storeData('session', sessionData);
      this.storeData('user', userData);
      
      this.currentUser = userData;
      this.startSessionTimer();
      this.updateUIForLoggedInUser();
      
      console.log('🚀 Session started for:', userData.fullName);
      this.trackEvent('login', { accessLevel: userData.accessLevel });
  }

  clearSession() {
      // Clear stored data
      this.removeStoredData('session');
      this.removeStoredData('user');
      
      this.currentUser = null;
      this.clearSessionTimer();
      this.updateUIForLoggedOutUser();
      
      console.log('🔒 Session cleared');
  }

  startSessionTimer() {
      this.clearSessionTimer();
      
      this.sessionTimer = setTimeout(() => {
          this.showNotification('Your session has expired. Please log in again.', 'warning');
          this.logout();
      }, this.config.security.sessionTimeout);
  }

  clearSessionTimer() {
      if (this.sessionTimer) {
          clearTimeout(this.sessionTimer);
          this.sessionTimer = null;
      }
  }

  setupSessionMonitoring() {
      // Monitor user activity to extend session
      const activityEvents = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
      let lastActivity = Date.now();
      
      const updateActivity = () => {
          lastActivity = Date.now();
          if (this.currentUser) {
              this.startSessionTimer(); // Reset session timer on activity
          }
      };

      activityEvents.forEach(event => {
          document.addEventListener(event, updateActivity, true);
      });
  }

  // Authentication Methods
  async login(email, password, rememberMe = false) {
      try {
          if (this.isLocked) {
              throw new Error('Account is temporarily locked due to too many failed attempts');
          }

          // Validate inputs
          if (!email || !password) {
              throw new Error('Email and password are required');
          }

          if (!this.config.utils.isValidEmail(email)) {
              throw new Error('Please enter a valid email address');
          }

          // Check against stored registrations (in production, this would be an API call)
          const registrations = this.getStoredData('registrations') || [];
          const user = registrations.find(reg => 
              reg.email.toLowerCase() === email.toLowerCase() && 
              reg.status === 'approved'
          );

          if (!user) {
              this.handleFailedLogin();
              throw new Error('Invalid email or password, or account not approved');
          }

          // In production, verify password hash
          // For demo, we'll simulate password verification
          if (!this.verifyPassword(password, user.password || 'demo123')) {
              this.handleFailedLogin();
              throw new Error('Invalid email or password');
          }

          // Reset login attempts on successful login
          this.loginAttempts = 0;
          this.isLocked = false;

          // Create user session
          const userData = {
              id: user.id,
              fullName: user.fullName,
              email: user.email,
              company: user.company,
              jobTitle: user.jobTitle,
              accessLevel: user.accessLevel,
              registrationDate: user.timestamp,
              lastLogin: new Date().toISOString(),
              permissions: this.getUserPermissions(user.accessLevel)
          };

          this.startSession(userData);

          // Send welcome back email if configured
          if (this.config.features.enableNotifications) {
              this.sendWelcomeBackEmail(userData);
          }

          return {
              success: true,
              user: userData,
              message: 'Login successful'
          };

      } catch (error) {
          console.error('Login error:', error);
          return {
              success: false,
              message: error.message
          };
      }
  }

  async register(registrationData) {
      try {
          // Validate registration data
          const validation = this.validateRegistrationData(registrationData);
          if (!validation.isValid) {
              throw new Error(validation.errors.join(', '));
          }

          // Check if email already exists
          const existingRegistrations = this.getStoredData('registrations') || [];
          const existingUser = existingRegistrations.find(reg => 
              reg.email.toLowerCase() === registrationData.email.toLowerCase()
          );

          if (existingUser) {
              throw new Error('An account with this email already exists');
          }

          // Create registration record
          const registration = {
              id: this.config.utils.generateId(),
              ...registrationData,
              timestamp: new Date().toISOString(),
              status: 'pending',
              ipAddress: this.getUserIP(),
              userAgent: navigator.userAgent
          };

          // Store registration
          existingRegistrations.push(registration);
          this.storeData('registrations', existingRegistrations);

          // Send confirmation emails
          await this.sendRegistrationEmails(registration);

          this.trackEvent('registration', { accessLevel: registration.accessLevel });

          return {
              success: true,
              message: 'Registration submitted successfully. Please check your email for confirmation.',
              registrationId: registration.id
          };

      } catch (error) {
          console.error('Registration error:', error);
          return {
              success: false,
              message: error.message
          };
      }
  }

  logout() {
      if (this.currentUser) {
          this.trackEvent('logout', { accessLevel: this.currentUser.accessLevel });
      }
      
      this.clearSession();
      this.showNotification('You have been logged out successfully', 'info');
      
      // Redirect to home page
      setTimeout(() => {
          window.location.href = 'index.html';
      }, 1000);
  }

  // Access Control Methods
  hasAccess(requiredLevel) {
      if (!this.currentUser) return false;
      
      const userLevel = this.config.accessLevels[this.currentUser.accessLevel];
      const required = this.config.accessLevels[requiredLevel];
      
      return userLevel && required && userLevel.level >= required.level;
  }

  hasPermission(hub, permission) {
      if (!this.currentUser) return false;
      
      return this.config.utils.hasPermission(
          this.currentUser.accessLevel, 
          hub, 
          permission
      );
  }

  getUserPermissions(accessLevel) {
      const permissions = {};
      
      Object.keys(this.config.permissions).forEach(hub => {
          permissions[hub] = this.config.permissions[hub][accessLevel] || [];
      });
      
      return permissions;
  }

  checkPageAccess(page) {
      const pagePermissions = {
          'engineering-hub.html': { hub: 'engineering', permission: 'view_equipment' },
          'analytics-platform.html': { hub: 'analytics', permission: 'basic_charts' },
          'economics-hub.html': { hub: 'economics', permission: 'basic_financial_models' },
          'procurement-hub.html': { hub: 'procurement', permission: 'supplier_directory' },
          'consulting-hub.html': { hub: 'consulting', permission: 'knowledge_base' },
          'innovation-technology-hub.html': { hub: 'innovation', permission: 'technology_updates' },
          'training-education-hub.html': { hub: 'training', permission: 'basic_courses' },
          'admin-dashboard.html': { accessLevel: 'enterprise' }
      };

      const currentPage = window.location.pathname.split('/').pop();
      const requirement = pagePermissions[currentPage];

      if (!requirement) return true; // No restrictions

      if (requirement.accessLevel) {
          return this.hasAccess(requirement.accessLevel);
      }

      if (requirement.hub && requirement.permission) {
          return this.hasPermission(requirement.hub, requirement.permission);
      }

      return true;
  }

  // UI Update Methods
  updateUIForLoggedInUser() {
      // Update navigation
      const authButtons = document.querySelector('.auth-buttons');
      if (authButtons) {
          authButtons.innerHTML = `
              <div class="user-menu">
                  <div class="user-info">
                      <div class="user-avatar">
                          ${this.currentUser.fullName.charAt(0).toUpperCase()}
                      </div>
                      <div class="user-details">
                          <div class="user-name">${this.currentUser.fullName}</div>
                          <div class="user-level">${this.config.accessLevels[this.currentUser.accessLevel].name}</div>
                      </div>
                  </div>
                  <div class="user-dropdown">
                      <a href="setting.html" class="dropdown-item">
                          <i class="fas fa-cog"></i> Settings
                      </a>
                      <a href="home.html" class="dropdown-item">
                          <i class="fas fa-home"></i> Dashboard
                      </a>
                      ${this.hasAccess('enterprise') ? '<a href="admin-dashboard.html" class="dropdown-item"><i class="fas fa-shield-alt"></i> Admin</a>' : ''}
                      <div class="dropdown-divider"></div>
                      <button onclick="SESMineAuth.instance.logout()" class="dropdown-item logout-btn">
                          <i class="fas fa-sign-out-alt"></i> Logout
                      </button>
                  </div>
              </div>
          `;
      }

      // Show access level indicator
      this.showAccessLevelIndicator();

      // Update page content based on access level
      this.updateContentByAccessLevel();
  }

  updateUIForLoggedOutUser() {
      const authButtons = document.querySelector('.auth-buttons');
      if (authButtons) {
          authButtons.innerHTML = `
              <a href="login.html" class="btn-login">
                  <i class="fas fa-sign-in-alt"></i>
                  Login
              </a>
              <button class="btn-signup" onclick="openRegistrationModal()">
                  <i class="fas fa-user-plus"></i>
                  Get Started
              </button>
          `;
      }

      // Hide access level indicator
      this.hideAccessLevelIndicator();
  }

  showAccessLevelIndicator() {
      const indicator = document.createElement('div');
      indicator.id = 'accessLevelIndicator';
      indicator.className = 'access-level-indicator';
      indicator.innerHTML = `
          <div class="indicator-content">
              <i class="${this.config.accessLevels[this.currentUser.accessLevel].icon}"></i>
              <span>${this.config.accessLevels[this.currentUser.accessLevel].name}</span>
          </div>
      `;
      
      // Remove existing indicator
      const existing = document.getElementById('accessLevelIndicator');
      if (existing) existing.remove();
      
      document.body.appendChild(indicator);
  }

  hideAccessLevelIndicator() {
      const indicator = document.getElementById('accessLevelIndicator');
      if (indicator) indicator.remove();
  }

  updateContentByAccessLevel() {
      if (!this.currentUser) return;

      // Hide/show features based on access level
      const restrictedElements = document.querySelectorAll('[data-access-level]');
      restrictedElements.forEach(element => {
          const requiredLevel = element.dataset.accessLevel;
          if (!this.hasAccess(requiredLevel)) {
              element.style.display = 'none';
          }
      });

      // Update feature limitations display
      const limitations = this.config.utils.getLimitations(this.currentUser.accessLevel);
      const limitationElements = document.querySelectorAll('[data-limitation]');
      limitationElements.forEach(element => {
          const limitationType = element.dataset.limitation;
          const limit = limitations[limitationType];
          if (limit !== undefined) {
              element.textContent = limit === -1 ? 'Unlimited' : limit;
          }
      });
  }

  // Validation Methods
  validateRegistrationData(data) {
      const errors = [];

      if (!data.fullName || data.fullName.trim().length < 2) {
          errors.push('Full name must be at least 2 characters long');
      }

      if (!data.email || !this.config.utils.isValidEmail(data.email)) {
          errors.push('Please enter a valid email address');
      }

      if (!data.company || data.company.trim().length < 2) {
          errors.push('Company name must be at least 2 characters long');
      }

      if (!data.jobTitle || data.jobTitle.trim().length < 2) {
          errors.push('Job title must be at least 2 characters long');
      }

      if (!data.accessLevel || !this.config.accessLevels[data.accessLevel]) {
          errors.push('Please select a valid access level');
      }

      return {
          isValid: errors.length === 0,
          errors: errors
      };
  }

  verifyPassword(inputPassword, storedPassword) {
      // In production, use proper password hashing (bcrypt, scrypt, etc.)
      // For demo purposes, we'll use simple comparison
      return inputPassword === storedPassword;
  }

  handleFailedLogin() {
      this.loginAttempts++;
      
      if (this.loginAttempts >= this.config.security.maxLoginAttempts) {
          this.isLocked = true;
          setTimeout(() => {
              this.isLocked = false;
              this.loginAttempts = 0;
          }, this.config.security.lockoutDuration);
          
          this.showNotification(
              `Account locked for ${this.config.security.lockoutDuration / 60000} minutes due to too many failed attempts`,
              'error'
          );
      }
  }

  // Email Methods
  async sendRegistrationEmails(registration) {
      if (!this.config.features.enableNotifications) return;

      try {
          // Send confirmation to user
          await emailjs.send(
              this.config.emailjs.serviceId,
              this.config.emailjs.templates.registration,
              {
                  to_name: registration.fullName,
                  to_email: registration.email,
                  company: registration.company,
                  access_level: registration.accessLevel,
                  registration_date: new Date(registration.timestamp).toLocaleDateString()
              },
              this.config.emailjs.userId
          );

          // Send notification to admin
          await emailjs.send(
              this.config.emailjs.serviceId,
              this.config.emailjs.templates.adminNotification,
              {
                  user_name: registration.fullName,
                  user_email: registration.email,
                  company: registration.company,
                  access_level: registration.accessLevel,
                  registration_date: new Date(registration.timestamp).toLocaleDateString(),
                  admin_url: window.location.origin + '/admin-dashboard.html'
              },
              this.config.emailjs.userId
          );

      } catch (error) {
          console.error('Email sending error:', error);
      }
  }

  async sendWelcomeBackEmail(userData) {
      if (!this.config.features.enableNotifications) return;

      try {
          await emailjs.send(
              this.config.emailjs.serviceId,
              this.config.emailjs.templates.welcome,
              {
                  to_name: userData.fullName,
                  to_email: userData.email,
                  last_login: new Date().toLocaleDateString(),
                  access_level: this.config.accessLevels[userData.accessLevel].name,
                  dashboard_url: window.location.origin + '/home.html'
              },
              this.config.emailjs.userId
          );
      } catch (error) {
          console.error('Welcome email error:', error);
      }
  }

  // Utility Methods
  generateSessionToken() {
      return btoa(Date.now() + Math.random().toString()).replace(/[^a-zA-Z0-9]/g, '');
  }

  getUserIP() {
      // In production, get from server-side
      return 'Unknown';
  }

  storeData(key, data) {
      const storageKey = this.config.utils.getStorageKey(key);
      localStorage.setItem(storageKey, JSON.stringify(data));
  }

  getStoredData(key) {
      const storageKey = this.config.utils.getStorageKey(key);
      const data = localStorage.getItem(storageKey);
      return data ? JSON.parse(data) : null;
  }

  removeStoredData(key) {
      const storageKey = this.config.utils.getStorageKey(key);
      localStorage.removeItem(storageKey);
  }

  showNotification(message, type = 'info') {
      if (window.SESMineNotifications) {
          window.SESMineNotifications.show(message, type);
      } else {
          console.log(`${type.toUpperCase()}: ${message}`);
      }
  }

  trackEvent(event, data = {}) {
      if (this.config.analytics.enabled && typeof gtag !== 'undefined') {
          gtag('event', event, {
              event_category: 'sesmine_auth',
              event_label: JSON.stringify(data),
              value: 1
          });
      }
      
      console.log(`📊 Auth Event: ${event}`, data);
  }

  setupEventListeners() {
      // Listen for storage changes (multi-tab support)
      window.addEventListener('storage', (e) => {
          if (e.key === this.config.utils.getStorageKey('session')) {
              if (!e.newValue) {
                  // Session cleared in another tab
                  this.clearSession();
              }
          }
      });

      // Listen for page visibility changes
      document.addEventListener('visibilitychange', () => {
          if (document.visibilityState === 'visible' && this.currentUser) {
              // Check if session is still valid when page becomes visible
              const sessionData = this.getStoredData('session');
              if (!sessionData || !this.isValidSession(sessionData)) {
                  this.logout();
              }
          }
      });
  }
}

// Initialize authentication system
document.addEventListener('DOMContentLoaded', function() {
  window.SESMineAuth = {
      instance: new SESMineAuth()
  };
  
  // Add global access methods
  window.hasAccess = (level) => window.SESMineAuth.instance.hasAccess(level);
  window.hasPermission = (hub, permission) => window.SESMineAuth.instance.hasPermission(hub, permission);
  window.getCurrentUser = () => window.SESMineAuth.instance.currentUser;
  
  console.log('🔐 SESMine Authentication System Ready');
});

// CSS for authentication UI components
const authStyles = `
<style>
.user-menu {
  position: relative;
  display: flex;
  align-items: center;
  gap: var(--space-md);
  cursor: pointer;
}

.user-info {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-sm) var(--space-md);
  border-radius: var(--radius-md);
  background: var(--glass-bg);
  backdrop-filter: blur(10px);
  border: 1px solid var(--glass-border);
  transition: all var(--transition-smooth);
}

.user-info:hover {
  background: rgba(255, 255, 255, 0.2);
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--gradient-accent);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  color: white;
  font-size: 1.1rem;
}

.user-details {
  display: flex;
  flex-direction: column;
}

.user-name {
  font-weight: 600;
  color: var(--primary-light);
  font-size: 0.9rem;
}

.user-level {
  font-size: 0.75rem;
  color: rgba(244, 244, 242, 0.8);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.user-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  background: white;
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-xl);
  border: 1px solid #e2e8f0;
  min-width: 200px;
  z-index: 1000;
  opacity: 0;
  visibility: hidden;
  transform: translateY(-10px);
  transition: all var(--transition-smooth);
}

.user-menu:hover .user-dropdown {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-md);
  color: var(--primary-dark);
  text-decoration: none;
  transition: all var(--transition-smooth);
  border: none;
  background: none;
  width: 100%;
  text-align: left;
  cursor: pointer;
  font-size: 0.9rem;
}

.dropdown-item:hover {
  background: #f7fafc;
}

.dropdown-divider {
  height: 1px;
  background: #e2e8f0;
  margin: var(--space-xs) 0;
}

.logout-btn {
  color: var(--accent-error);
}

.logout-btn:hover {
  background: rgba(229, 62, 62, 0.1);
}

.access-level-indicator {
  position: fixed;
  top: 100px;
  right: 20px;
  background: var(--dark-glass);
  color: var(--primary-light);
  padding: var(--space-sm) var(--space-md);
  border-radius: var(--radius-md);
  backdrop-filter: blur(20px);
  border: 1px solid var(--glass-border);
  z-index: 999;
  font-size: 0.85rem;
  font-weight: 600;
  box-shadow: var(--shadow-md);
}

.indicator-content {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
}

@media (max-width: 768px) {
  .access-level-indicator {
      top: 80px;
      right: 10px;
      padding: var(--space-xs) var(--space-sm);
      font-size: 0.75rem;
  }
  
  .user-dropdown {
      right: -50px;
      min-width: 180px;
  }
}
</style>
`;

document.head.insertAdjacentHTML('beforeend', authStyles);
