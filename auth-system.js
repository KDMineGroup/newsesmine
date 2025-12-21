// ============================================
// SESMine Platform - Authentication System
// Smart Engineering Solutions for Mining
// ============================================

class SESMineAuthSystem {
  constructor() {
      this.currentUser = null;
      this.sessionToken = null;
      this.loginAttempts = 0;
      this.lockoutTime = null;
      this.config = null;
      
      this.init();
  }

  init() {
      console.log('🔐 SESMine Authentication System Initializing...');
      
      // Wait for config to be available
      this.waitForConfig().then(() => {
          this.config = window.SESMineConfig;
          this.loadStoredSession();
          this.setupSessionTimeout();
          console.log('✅ Authentication System Ready');
      });
  }

  async waitForConfig() {
      return new Promise((resolve) => {
          const checkConfig = () => {
              if (window.SESMineConfig) {
                  resolve();
              } else {
                  setTimeout(checkConfig, 100);
              }
          };
          checkConfig();
      });
  }

  // Load stored session on page load
  loadStoredSession() {
      try {
          const sessionData = this.getStoredData(this.config.storage.keys.session);
          
          if (sessionData && this.isValidSession(sessionData)) {
              this.currentUser = sessionData.user;
              this.sessionToken = sessionData.token;
              
              console.log('🔄 Session restored for:', this.currentUser.fullName);
              this.triggerAuthEvent('session_restored', this.currentUser);
              return true;
          } else if (sessionData) {
              // Clear invalid session
              this.clearStoredData(this.config.storage.keys.session);
              console.log('🗑️ Invalid session cleared');
          }
      } catch (error) {
          console.error('Session restoration error:', error);
          this.clearStoredData(this.config.storage.keys.session);
      }
      
      return false;
  }

  // Validate session
  isValidSession(sessionData) {
      if (!sessionData || !sessionData.user || !sessionData.token || !sessionData.timestamp) {
          return false;
      }

      // Check if session has expired
      const sessionAge = Date.now() - sessionData.timestamp;
      if (sessionAge > this.config.security.sessionTimeout) {
          return false;
      }

      return true;
  }

  // Login method
  async login(email, password, rememberMe = false) {
      try {
          // Check if account is locked
          if (this.isAccountLocked()) {
              return {
                  success: false,
                  message: `Account temporarily locked. Try again in ${Math.ceil((this.lockoutTime - Date.now()) / 60000)} minutes.`
              };
          }

          // Find user in registrations
          const user = await this.findUser(email, password);
          
          if (!user) {
              this.handleFailedLogin();
              return {
                  success: false,
                  message: 'Invalid email or password. Please check your credentials and try again.'
              };
          }

          // Check if user is approved
          if (user.status !== 'approved') {
              return {
                  success: false,
                  message: 'Your account is pending approval. Please wait for admin approval or contact support.'
              };
          }

          // Successful login
          this.handleSuccessfulLogin(user, rememberMe);
          
          return {
              success: true,
              message: `Welcome back, ${user.fullName}!`,
              user: this.sanitizeUserData(user)
          };

      } catch (error) {
          console.error('Login error:', error);
          return {
              success: false,
              message: 'An error occurred during login. Please try again.'
          };
      }
  }

  // Find user in stored registrations
  async findUser(email, password) {
      try {
          // Wait for data manager to be available
          if (window.SESMineDataManager && window.SESMineDataManager.instance) {
              const registrations = window.SESMineDataManager.instance.getRegistrations();
              return registrations.find(user => 
                  user.email.toLowerCase() === email.toLowerCase() && 
                  user.password === password
              );
          } else {
              // Fallback to localStorage
              const registrations = JSON.parse(localStorage.getItem('sesmine_registrations') || '[]');
              return registrations.find(user => 
                  user.email.toLowerCase() === email.toLowerCase() && 
                  user.password === password
              );
          }
      } catch (error) {
          console.error('User lookup error:', error);
          return null;
      }
  }

  // Handle successful login
  handleSuccessfulLogin(user, rememberMe) {
      // Reset login attempts
      this.loginAttempts = 0;
      this.lockoutTime = null;

      // Set current user
      this.currentUser = this.sanitizeUserData(user);
      this.sessionToken = this.generateSessionToken();

      // Create session data
      const sessionData = {
          user: this.currentUser,
          token: this.sessionToken,
          timestamp: Date.now(),
          rememberMe: rememberMe,
          loginTime: new Date().toISOString(),
          userAgent: navigator.userAgent,
          ipAddress: 'client-side' // In production, get from server
      };

      // Store session
      this.storeSessionData(sessionData);

      // Track login event
      this.trackEvent('user_login', {
          userId: this.currentUser.id,
          accessLevel: this.currentUser.accessLevel,
          rememberMe: rememberMe
      });

      // Trigger authentication event
      this.triggerAuthEvent('login_success', this.currentUser);

      console.log('✅ Login successful:', this.currentUser.fullName);
  }

  // Handle failed login
  handleFailedLogin() {
      this.loginAttempts++;
      
      if (this.loginAttempts >= this.config.security.maxLoginAttempts) {
          this.lockoutTime = Date.now() + this.config.security.lockoutDuration;
          console.log('🔒 Account locked due to multiple failed attempts');
      }

      // Track failed login
      this.trackEvent('login_failed', {
          attempts: this.loginAttempts,
          locked: this.isAccountLocked()
      });
  }

  // Check if account is locked
  isAccountLocked() {
      return this.lockoutTime && Date.now() < this.lockoutTime;
  }

  // Logout method
  logout() {
      if (this.currentUser) {
          console.log('👋 Logging out:', this.currentUser.fullName);
          
          // Track logout event
          this.trackEvent('user_logout', {
              userId: this.currentUser.id,
              sessionDuration: Date.now() - (this.getStoredData(this.config.storage.keys.session)?.timestamp || Date.now())
          });
      }

      // Clear session data
      this.currentUser = null;
      this.sessionToken = null;
      this.clearStoredData(this.config.storage.keys.session);

      // Trigger authentication event
      this.triggerAuthEvent('logout', null);

      // Redirect to login page
      if (window.location.pathname !== '/login.html' && window.location.pathname !== '/index.html') {
          window.location.href = 'login.html';
      }
  }

  // Register new user
  async register(registrationData) {
      try {
          // Validate registration data
          const validation = this.validateRegistrationData(registrationData);
          if (!validation.valid) {
              return {
                  success: false,
                  message: validation.message
              };
          }

          // Check if email already exists
          const existingUser = await this.findUserByEmail(registrationData.email);
          if (existingUser) {
              return {
                  success: false,
                  message: 'An account with this email address already exists.'
              };
          }

          // Create user object
          const newUser = {
              id: this.generateUserId(),
              fullName: registrationData.fullName,
              email: registrationData.email.toLowerCase(),
              company: registrationData.company,
              jobTitle: registrationData.jobTitle,
              phone: registrationData.phone,
              accessLevel: registrationData.accessLevel,
              projectDescription: registrationData.projectDescription,
              password: registrationData.password || this.generateTemporaryPassword(),
              timestamp: new Date().toISOString(),
              status: 'pending', // Requires admin approval
              registrationIP: 'client-side',
              userAgent: navigator.userAgent
          };

          // Store registration
          if (window.SESMineDataManager && window.SESMineDataManager.instance) {
              window.SESMineDataManager.instance.saveRegistration(newUser);
          } else {
              // Fallback to localStorage
              const registrations = JSON.parse(localStorage.getItem('sesmine_registrations') || '[]');
              registrations.push(newUser);
              localStorage.setItem('sesmine_registrations', JSON.stringify(registrations));
          }

          // Track registration event
          this.trackEvent('user_registration', {
              userId: newUser.id,
              accessLevel: newUser.accessLevel,
              company: newUser.company
          });

          return {
              success: true,
              message: 'Registration submitted successfully! Please wait for admin approval.',
              user: this.sanitizeUserData(newUser)
          };

      } catch (error) {
          console.error('Registration error:', error);
          return {
              success: false,
              message: 'Registration failed. Please try again.'
          };
      }
  }

  // Find user by email
  async findUserByEmail(email) {
      try {
          if (window.SESMineDataManager && window.SESMineDataManager.instance) {
              const registrations = window.SESMineDataManager.instance.getRegistrations();
              return registrations.find(user => user.email.toLowerCase() === email.toLowerCase());
          } else {
              const registrations = JSON.parse(localStorage.getItem('sesmine_registrations') || '[]');
              return registrations.find(user => user.email.toLowerCase() === email.toLowerCase());
          }
      } catch (error) {
          console.error('User lookup error:', error);
          return null;
      }
  }

  // Validate registration data
  validateRegistrationData(data) {
      const required = ['fullName', 'email', 'company', 'jobTitle', 'accessLevel'];
      
      for (const field of required) {
          if (!data[field] || data[field].trim() === '') {
              return {
                  valid: false,
                  message: `${field.replace(/([A-Z])/g, ' $1').toLowerCase()} is required.`
              };
          }
      }

      // Validate email format
      if (!this.config.utils.isValidEmail(data.email)) {
          return {
              valid: false,
              message: 'Please enter a valid email address.'
          };
      }

      // Validate access level
      if (!this.config.accessLevels[data.accessLevel]) {
          return {
              valid: false,
              message: 'Please select a valid access level.'
          };
      }

      return { valid: true };
  }

  // Check user permissions
  hasPermission(hub, permission) {
      if (!this.currentUser) return false;
      
      const hubPermissions = this.config.permissions.hubs[hub];
      if (!hubPermissions) return false;
      
      const userPermissions = hubPermissions[this.currentUser.accessLevel];
      return userPermissions && userPermissions.includes(permission);
  }

  // Get user access level info
  getAccessLevelInfo() {
      if (!this.currentUser) return null;
      return this.config.accessLevels[this.currentUser.accessLevel];
  }

  // Check if user is admin
  isAdmin() {
      return this.currentUser && this.currentUser.accessLevel === 'enterprise';
  }

  // Check if user is authenticated
  isAuthenticated() {
      return this.currentUser !== null && this.sessionToken !== null;
  }

  // Session timeout setup
  setupSessionTimeout() {
      setInterval(() => {
          if (this.currentUser) {
              const sessionData = this.getStoredData(this.config.storage.keys.session);
              if (!sessionData || !this.isValidSession(sessionData)) {
                  console.log('⏰ Session expired');
                  this.logout();
              }
          }
      }, 60000); // Check every minute
  }

  // Utility methods
  generateSessionToken() {
      return 'sess_' + Date.now().toString(36) + '_' + Math.random().toString(36).substr(2, 9);
  }

  generateUserId() {
      return 'user_' + Date.now().toString(36) + '_' + Math.random().toString(36).substr(2, 9);
  }

  generateTemporaryPassword() {
      return Math.random().toString(36).substr(2, 8);
  }

  sanitizeUserData(user) {
      const { password, ...sanitizedUser } = user;
      return sanitizedUser;
  }

  // Storage methods
  storeSessionData(sessionData) {
      this.storeData(this.config.storage.keys.session, sessionData);
  }

  storeData(key, data) {
      try {
          if (window.SESMineDataManager && window.SESMineDataManager.instance) {
              window.SESMineDataManager.instance.set(key, data);
          } else {
              localStorage.setItem(this.config.storage.prefix + key, JSON.stringify(data));
          }
      } catch (error) {
          console.error('Storage error:', error);
      }
  }

  getStoredData(key) {
      try {
          if (window.SESMineDataManager && window.SESMineDataManager.instance) {
              return window.SESMineDataManager.instance.get(key);
          } else {
              const data = localStorage.getItem(this.config.storage.prefix + key);
              return data ? JSON.parse(data) : null;
          }
      } catch (error) {
          console.error('Storage retrieval error:', error);
          return null;
      }
  }

  clearStoredData(key) {
      try {
          if (window.SESMineDataManager && window.SESMineDataManager.instance) {
              window.SESMineDataManager.instance.remove(key);
          } else {
              localStorage.removeItem(this.config.storage.prefix + key);
          }
      } catch (error) {
          console.error('Storage clear error:', error);
      }
  }

  // Event tracking
  trackEvent(event, data = {}) {
      try {
          if (window.SESMineDataManager && window.SESMineDataManager.instance) {
              window.SESMineDataManager.instance.trackEvent(event, data);
          }
          
          console.log(`📊 Auth Event: ${event}`, data);
      } catch (error) {
          console.error('Event tracking error:', error);
      }
  }

  // Authentication events
  triggerAuthEvent(eventType, userData) {
      const event = new CustomEvent('sesmine-auth-change', {
          detail: {
              type: eventType,
              user: userData,
              timestamp: Date.now()
          }
      });
      
      document.dispatchEvent(event);
  }

  // Password reset (placeholder for future implementation)
  async requestPasswordReset(email) {
      try {
          const user = await this.findUserByEmail(email);
          if (!user) {
              // Don't reveal if email exists for security
              return {
                  success: true,
                  message: 'If an account with this email exists, password reset instructions have been sent.'
              };
          }

          // In production, send email with reset token
          console.log('Password reset requested for:', email);
          
          this.trackEvent('password_reset_requested', { email });

          return {
              success: true,
              message: 'Password reset instructions have been sent to your email.'
          };
      } catch (error) {
          console.error('Password reset error:', error);
          return {
              success: false,
              message: 'Password reset request failed. Please try again.'
          };
      }
  }

  // Update user profile
  async updateProfile(updates) {
      if (!this.currentUser) {
          return {
              success: false,
              message: 'User not authenticated.'
          };
      }

      try {
          // Update current user
          this.currentUser = { ...this.currentUser, ...updates };

          // Update stored session
          const sessionData = this.getStoredData(this.config.storage.keys.session);
          if (sessionData) {
              sessionData.user = this.currentUser;
              this.storeSessionData(sessionData);
          }

          // Update registration record
          if (window.SESMineDataManager && window.SESMineDataManager.instance) {
              window.SESMineDataManager.instance.updateRegistration(this.currentUser.id, updates);
          }

          this.trackEvent('profile_updated', { userId: this.currentUser.id, fields: Object.keys(updates) });

          return {
              success: true,
              message: 'Profile updated successfully.',
              user: this.sanitizeUserData(this.currentUser)
          };
      } catch (error) {
          console.error('Profile update error:', error);
          return {
              success: false,
              message: 'Profile update failed. Please try again.'
          };
      }
  }

  // Get user statistics
  getUserStats() {
      if (!this.currentUser) return null;

      const sessionData = this.getStoredData(this.config.storage.keys.session);
      const loginTime = sessionData ? new Date(sessionData.timestamp) : new Date();
      const sessionDuration = Date.now() - loginTime.getTime();

      return {
          userId: this.currentUser.id,
          fullName: this.currentUser.fullName,
          email: this.currentUser.email,
          accessLevel: this.currentUser.accessLevel,
          company: this.currentUser.company,
          loginTime: loginTime.toISOString(),
          sessionDuration: sessionDuration,
          lastActivity: new Date().toISOString()
      };
  }
}

// Initialize Authentication System
document.addEventListener('DOMContentLoaded', function() {
  // Wait for config to be loaded
  const initAuth = () => {
      if (window.SESMineConfig) {
          window.SESMineAuth = {
              instance: new SESMineAuthSystem()
          };
          
          // Add global authentication methods
          window.getCurrentUser = () => window.SESMineAuth.instance.currentUser;
          window.isAuthenticated = () => window.SESMineAuth.instance.isAuthenticated();
          window.hasPermission = (hub, permission) => window.SESMineAuth.instance.hasPermission(hub, permission);
          window.isAdmin = () => window.SESMineAuth.instance.isAdmin();
          window.logout = () => window.SESMineAuth.instance.logout();
          
          console.log('🔐 SESMine Authentication System Ready');
      } else {
          setTimeout(initAuth, 100);
      }
  };
  
  initAuth();
});

// Listen for authentication events
document.addEventListener('sesmine-auth-change', function(event) {
  const { type, user } = event.detail;
  
  switch (type) {
      case 'login_success':
          console.log('🎉 User logged in:', user.fullName);
          break;
      case 'logout':
          console.log('👋 User logged out');
          break;
      case 'session_restored':
          console.log('🔄 Session restored for:', user.fullName);
          break;
  }
});

// Page protection utility
window.requireAuth = function(redirectUrl = 'login.html') {
  setTimeout(() => {
      if (!window.isAuthenticated || !window.isAuthenticated()) {
          console.log('🔒 Page requires authentication, redirecting...');
          window.location.href = redirectUrl;
      }
  }, 100);
};

// Admin protection utility
window.requireAdmin = function(redirectUrl = 'home.html') {
  setTimeout(() => {
      if (!window.isAdmin || !window.isAdmin()) {
          console.log('🛡️ Page requires admin access, redirecting...');
          window.location.href = redirectUrl;
      }
  }, 100);
};

console.log('🔐 SESMine Authentication System Loaded');
console.log('🛡️ Security features: Session timeout, login attempts, permission system');
console.log('📊 Event tracking: Login, logout, registration, profile updates');
console.log('✅ Authentication utilities ready');
