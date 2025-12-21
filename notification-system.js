// ============================================
// SESMine Platform - Notification System
// Smart Engineering Solutions for Mining
// ============================================

class SESMineNotificationSystem {
  constructor() {
      this.notifications = [];
      this.config = null;
      this.container = null;
      this.maxNotifications = 5;
      this.defaultDuration = 5000;
      
      this.init();
  }

  init() {
      console.log('🔔 SESMine Notification System Initializing...');
      
      // Wait for config to be available
      this.waitForConfig().then(() => {
          this.config = window.SESMineConfig;
          this.maxNotifications = this.config.notifications.maxNotifications;
          this.defaultDuration = this.config.notifications.duration;
          
          this.createContainer();
          this.setupStyles();
          
          console.log('✅ Notification System Ready');
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

  createContainer() {
      this.container = document.createElement('div');
      this.container.id = 'sesmine-notifications';
      this.container.className = 'notification-container';
      document.body.appendChild(this.container);
  }

  setupStyles() {
      if (document.getElementById('notification-styles')) return;

      const styles = document.createElement('style');
      styles.id = 'notification-styles';
      styles.textContent = `
          .notification-container {
              position: fixed;
              top: 120px;
              right: 24px;
              z-index: 10000;
              pointer-events: none;
              max-width: 420px;
          }

          .notification {
              background: rgba(26, 26, 26, 0.95);
              color: white;
              padding: 1rem 1.5rem;
              border-radius: 12px;
              box-shadow: 0 24px 60px rgba(0, 0, 0, 0.2);
              margin-bottom: 1rem;
              font-size: 0.95rem;
              font-weight: 500;
              backdrop-filter: blur(25px);
              border: 1px solid rgba(92, 107, 80, 0.3);
              transform: translateX(450px);
              opacity: 0;
              transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
              pointer-events: auto;
              position: relative;
              overflow: hidden;
              max-width: 100%;
              word-wrap: break-word;
          }

          .notification.show {
              transform: translateX(0);
              opacity: 1;
          }

          .notification.hide {
              transform: translateX(450px);
              opacity: 0;
          }

          .notification-content {
              display: flex;
              align-items: flex-start;
              gap: 1rem;
              position: relative;
              z-index: 2;
          }

          .notification-icon {
              font-size: 1.2rem;
              flex-shrink: 0;
              margin-top: 0.1rem;
          }

          .notification-message {
              flex: 1;
              line-height: 1.5;
          }

          .notification-actions {
              display: flex;
              gap: 0.5rem;
              margin-top: 0.75rem;
              margin-left: 2.2rem;
          }

          .notification-action {
              background: rgba(255, 255, 255, 0.1);
              border: 1px solid rgba(255, 255, 255, 0.2);
              color: white;
              padding: 0.25rem 0.75rem;
              border-radius: 6px;
              font-size: 0.8rem;
              cursor: pointer;
              transition: all 0.2s ease;
              text-decoration: none;
              display: inline-flex;
              align-items: center;
              gap: 0.25rem;
          }

          .notification-action:hover {
              background: rgba(255, 255, 255, 0.2);
              border-color: rgba(255, 255, 255, 0.3);
              color: white;
              text-decoration: none;
          }

          .notification-action.primary {
              background: rgba(92, 107, 80, 0.8);
              border-color: rgba(92, 107, 80, 1);
          }

          .notification-action.primary:hover {
              background: rgba(92, 107, 80, 1);
          }

          .notification-close {
              background: none;
              border: none;
              color: rgba(255, 255, 255, 0.7);
              cursor: pointer;
              padding: 0.25rem;
              border-radius: 4px;
              transition: all 0.2s ease;
              margin-left: auto;
              flex-shrink: 0;
              display: flex;
              align-items: center;
              justify-content: center;
              width: 24px;
              height: 24px;
          }

          .notification-close:hover {
              background: rgba(255, 255, 255, 0.1);
              color: white;
          }

          .notification-progress {
              position: absolute;
              bottom: 0;
              left: 0;
              height: 3px;
              background: rgba(92, 107, 80, 0.8);
              transition: width linear;
              z-index: 1;
          }

          /* Notification Types */
          .notification.success {
              border-left: 4px solid #38a169;
          }

          .notification.success .notification-icon {
              color: #38a169;
          }

          .notification.error {
              border-left: 4px solid #e53e3e;
          }

          .notification.error .notification-icon {
              color: #e53e3e;
          }

          .notification.warning {
              border-left: 4px solid #dd6b20;
          }

          .notification.warning .notification-icon {
              color: #dd6b20;
          }

          .notification.info {
              border-left: 4px solid #3182ce;
          }

          .notification.info .notification-icon {
              color: #3182ce;
          }

          /* Responsive Design */
          @media (max-width: 768px) {
              .notification-container {
                  top: 80px;
                  right: 12px;
                  left: 12px;
                  max-width: none;
              }

              .notification {
                  margin-bottom: 0.5rem;
                  padding: 1rem;
                  font-size: 0.9rem;
              }

              .notification-content {
                  gap: 0.75rem;
              }

              .notification-actions {
                  margin-left: 1.75rem;
                  flex-wrap: wrap;
              }
          }

          /* Animation for stacking */
          .notification:not(:last-child) {
              margin-bottom: 0.75rem;
          }

          /* Hover effects */
          .notification:hover .notification-progress {
              animation-play-state: paused;
          }

          /* Accessibility */
          @media (prefers-reduced-motion: reduce) {
              .notification {
                  transition-duration: 0.01ms;
              }
              
              .notification-progress {
                  transition: none;
              }
          }

          /* High contrast mode */
          @media (prefers-contrast: high) {
              .notification {
                  background: #000;
                  border: 2px solid #fff;
              }
              
              .notification-action {
                  border-color: #fff;
              }
          }
      `;
      
      document.head.appendChild(styles);
  }

  // Main notification method
  show(message, type = 'info', options = {}) {
      const notification = this.createNotification(message, type, options);
      this.addNotification(notification);
      return notification.id;
  }

  // Convenience methods
  success(message, options = {}) {
      return this.show(message, 'success', options);
  }

  error(message, options = {}) {
      return this.show(message, 'error', { ...options, persistent: true });
  }

  warning(message, options = {}) {
      return this.show(message, 'warning', options);
  }

  info(message, options = {}) {
      return this.show(message, 'info', options);
  }

  // Create notification object
  createNotification(message, type, options) {
      const id = this.generateId();
      const config = this.config?.notifications?.types?.[type] || {};
      
      const notification = {
          id: id,
          message: message,
          type: type,
          icon: options.icon || config.icon || this.getDefaultIcon(type),
          duration: options.duration !== undefined ? options.duration : this.defaultDuration,
          persistent: options.persistent || false,
          actions: options.actions || [],
          onClick: options.onClick || null,
          onClose: options.onClose || null,
          timestamp: Date.now(),
          element: null
      };

      notification.element = this.createElement(notification);
      return notification;
  }

  // Create DOM element
  createElement(notification) {
      const element = document.createElement('div');
      element.className = `notification ${notification.type}`;
      element.setAttribute('data-id', notification.id);
      element.setAttribute('role', 'alert');
      element.setAttribute('aria-live', 'polite');

      // Create content
      const content = document.createElement('div');
      content.className = 'notification-content';

      // Icon
      const icon = document.createElement('i');
      icon.className = `notification-icon ${notification.icon}`;
      content.appendChild(icon);

      // Message
      const message = document.createElement('div');
      message.className = 'notification-message';
      message.textContent = notification.message;
      content.appendChild(message);

      // Close button
      const closeBtn = document.createElement('button');
      closeBtn.className = 'notification-close';
      closeBtn.innerHTML = '<i class="fas fa-times"></i>';
      closeBtn.setAttribute('aria-label', 'Close notification');
      closeBtn.onclick = () => this.remove(notification.id);
      content.appendChild(closeBtn);

      element.appendChild(content);

      // Actions
      if (notification.actions && notification.actions.length > 0) {
          const actionsContainer = document.createElement('div');
          actionsContainer.className = 'notification-actions';

          notification.actions.forEach(action => {
              const actionBtn = document.createElement('button');
              actionBtn.className = `notification-action ${action.style || ''}`;
              actionBtn.innerHTML = action.icon ? `<i class="${action.icon}"></i> ${action.text}` : action.text;
              actionBtn.onclick = () => {
                  if (action.onClick) {
                      action.onClick(notification);
                  }
                  if (action.closeOnClick !== false) {
                      this.remove(notification.id);
                  }
              };
              actionsContainer.appendChild(actionBtn);
          });

          element.appendChild(actionsContainer);
      }

      // Progress bar for timed notifications
      if (!notification.persistent && notification.duration > 0) {
          const progress = document.createElement('div');
          progress.className = 'notification-progress';
          progress.style.width = '100%';
          element.appendChild(progress);
      }

      // Click handler
      if (notification.onClick) {
          element.style.cursor = 'pointer';
          element.onclick = (e) => {
              if (!e.target.closest('.notification-close') && !e.target.closest('.notification-action')) {
                  notification.onClick(notification);
              }
          };
      }

      return element;
  }

  // Add notification to container
  addNotification(notification) {
      // Remove oldest notification if at max capacity
      if (this.notifications.length >= this.maxNotifications) {
          this.remove(this.notifications[0].id);
      }

      // Add to notifications array
      this.notifications.push(notification);

      // Add to DOM
      this.container.appendChild(notification.element);

      // Trigger show animation
      requestAnimationFrame(() => {
          notification.element.classList.add('show');
      });

      // Set up auto-removal for non-persistent notifications
      if (!notification.persistent && notification.duration > 0) {
          this.setupAutoRemoval(notification);
      }

      // Track notification
      this.trackNotification('shown', notification);

      console.log(`🔔 Notification shown: ${notification.type} - ${notification.message}`);
  }

  // Setup auto-removal with progress bar
  setupAutoRemoval(notification) {
      const progressBar = notification.element.querySelector('.notification-progress');
      
      if (progressBar) {
          // Animate progress bar
          progressBar.style.transition = `width ${notification.duration}ms linear`;
          requestAnimationFrame(() => {
              progressBar.style.width = '0%';
          });

          // Pause progress on hover
          notification.element.addEventListener('mouseenter', () => {
              progressBar.style.animationPlayState = 'paused';
          });

          notification.element.addEventListener('mouseleave', () => {
              progressBar.style.animationPlayState = 'running';
          });
      }

      // Set removal timeout
      notification.timeout = setTimeout(() => {
          this.remove(notification.id);
      }, notification.duration);
  }

  // Remove notification
  remove(id) {
      const notification = this.notifications.find(n => n.id === id);
      if (!notification) return;

      // Clear timeout
      if (notification.timeout) {
          clearTimeout(notification.timeout);
      }

      // Trigger hide animation
      notification.element.classList.add('hide');

      // Remove from DOM after animation
      setTimeout(() => {
          if (notification.element.parentNode) {
              notification.element.parentNode.removeChild(notification.element);
          }

          // Remove from notifications array
          this.notifications = this.notifications.filter(n => n.id !== id);

          // Call onClose callback
          if (notification.onClose) {
              notification.onClose(notification);
          }

          // Track notification
          this.trackNotification('closed', notification);

      }, 300);

      console.log(`🔔 Notification removed: ${id}`);
  }

  // Remove all notifications
  clear() {
      const notificationIds = this.notifications.map(n => n.id);
      notificationIds.forEach(id => this.remove(id));
  }

  // Update existing notification
  update(id, updates) {
      const notification = this.notifications.find(n => n.id === id);
      if (!notification) return false;

      // Update notification object
      Object.assign(notification, updates);

      // Update DOM element
      if (updates.message) {
          const messageElement = notification.element.querySelector('.notification-message');
          if (messageElement) {
              messageElement.textContent = updates.message;
          }
      }

      if (updates.type) {
          notification.element.className = `notification ${updates.type} show`;
      }

      return true;
  }

  // Get notification by ID
  get(id) {
      return this.notifications.find(n => n.id === id);
  }

  // Get all notifications
  getAll() {
      return [...this.notifications];
  }

  // Count notifications by type
  count(type = null) {
      if (type) {
          return this.notifications.filter(n => n.type === type).length;
      }
      return this.notifications.length;
  }

  // Utility methods
  generateId() {
      return 'notif_' + Date.now().toString(36) + '_' + Math.random().toString(36).substr(2, 9);
  }

  getDefaultIcon(type) {
      const icons = {
          success: 'fas fa-check-circle',
          error: 'fas fa-times-circle',
          warning: 'fas fa-exclamation-triangle',
          info: 'fas fa-info-circle'
      };
      return icons[type] || icons.info;
  }

  // Event tracking
  trackNotification(action, notification) {
      try {
          if (window.SESMineDataManager && window.SESMineDataManager.instance) {
              window.SESMineDataManager.instance.trackEvent(`notification_${action}`, {
                  notificationId: notification.id,
                  type: notification.type,
                  message: notification.message.substring(0, 100), // Truncate for privacy
                  persistent: notification.persistent,
                  duration: notification.duration
              });
          }
      } catch (error) {
          console.error('Notification tracking error:', error);
      }
  }

  // Preset notification templates
  templates = {
      loginSuccess: (userName) => this.success(`Welcome back, ${userName}!`, {
          actions: [
              {
                  text: 'Go to Dashboard',
                  style: 'primary',
                  icon: 'fas fa-tachometer-alt',
                  onClick: () => window.location.href = 'home.html'
              }
          ]
      }),

      registrationSuccess: () => this.success('Registration submitted successfully!', {
          actions: [
              {
                  text: 'Check Email',
                  style: 'primary',
                  icon: 'fas fa-envelope',
                  onClick: () => window.open('mailto:', '_blank')
              }
          ]
      }),

      sessionExpired: () => this.warning('Your session has expired. Please log in again.', {
          persistent: true,
          actions: [
              {
                  text: 'Login',
                  style: 'primary',
                  icon: 'fas fa-sign-in-alt',
                  onClick: () => window.location.href = 'login.html'
              }
          ]
      }),

      networkError: () => this.error('Network connection error. Please check your internet connection.', {
          actions: [
              {
                  text: 'Retry',
                  icon: 'fas fa-redo',
                  onClick: () => window.location.reload()
              }
          ]
      }),

      featureUnavailable: (feature, requiredLevel) => this.warning(
          `${feature} requires ${requiredLevel} access level.`, {
          actions: [
              {
                  text: 'Upgrade',
                  style: 'primary',
                  icon: 'fas fa-arrow-up',
                  onClick: () => window.location.href = 'Pricing Plans - SESMine.html'
              }
          ]
      })
  };
}

// Initialize Notification System
document.addEventListener('DOMContentLoaded', function() {
  window.SESMineNotifications = {
      instance: new SESMineNotificationSystem()
  };
  
  // Add global notification methods
  window.showNotification = (message, type, options) => 
      window.SESMineNotifications.instance.show(message, type, options);
  window.showSuccess = (message, options) => 
      window.SESMineNotifications.instance.success(message, options);
  window.showError = (message, options) => 
      window.SESMineNotifications.instance.error(message, options);
  window.showWarning = (message, options) => 
      window.SESMineNotifications.instance.warning(message, options);
  window.showInfo = (message, options) => 
      window.SESMineNotifications.instance.info(message, options);
  
  console.log('🔔 SESMine Notification System Ready');
});

// Listen for authentication events and show appropriate notifications
document.addEventListener('sesmine-auth-change', function(event) {
  const { type, user } = event.detail;
  
  if (window.SESMineNotifications && window.SESMineNotifications.instance) {
      const notifications = window.SESMineNotifications.instance;
      
      switch (type) {
          case 'login_success':
              notifications.templates.loginSuccess(user.fullName);
              break;
          case 'logout':
              notifications.info('You have been logged out successfully.');
              break;
          case 'session_expired':
              notifications.templates.sessionExpired();
              break;
      }
  }
});

console.log('🔔 SESMine Notification System Loaded');
console.log('📱 Features: Auto-dismiss, progress bars, actions, templates');
console.log('🎨 Responsive design with accessibility support');
console.log('📊 Event tracking and analytics integration');
console.log('✅ Notification utilities ready');// ============================================
// SESMine Platform - Notification System
// Smart Engineering Solutions for Mining
// ============================================

class SESMineNotificationSystem {
  constructor() {
      this.notifications = [];
      this.config = null;
      this.container = null;
      this.maxNotifications = 5;
      this.defaultDuration = 5000;
      
      this.init();
  }

  init() {
      console.log('🔔 SESMine Notification System Initializing...');
      
      // Wait for config to be available
      this.waitForConfig().then(() => {
          this.config = window.SESMineConfig;
          this.maxNotifications = this.config.notifications.maxNotifications;
          this.defaultDuration = this.config.notifications.duration;
          
          this.createContainer();
          this.setupStyles();
          
          console.log('✅ Notification System Ready');
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

  createContainer() {
      this.container = document.createElement('div');
      this.container.id = 'sesmine-notifications';
      this.container.className = 'notification-container';
      document.body.appendChild(this.container);
  }

  setupStyles() {
      if (document.getElementById('notification-styles')) return;

      const styles = document.createElement('style');
      styles.id = 'notification-styles';
      styles.textContent = `
          .notification-container {
              position: fixed;
              top: 120px;
              right: 24px;
              z-index: 10000;
              pointer-events: none;
              max-width: 420px;
          }

          .notification {
              background: rgba(26, 26, 26, 0.95);
              color: white;
              padding: 1rem 1.5rem;
              border-radius: 12px;
              box-shadow: 0 24px 60px rgba(0, 0, 0, 0.2);
              margin-bottom: 1rem;
              font-size: 0.95rem;
              font-weight: 500;
              backdrop-filter: blur(25px);
              border: 1px solid rgba(92, 107, 80, 0.3);
              transform: translateX(450px);
              opacity: 0;
              transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
              pointer-events: auto;
              position: relative;
              overflow: hidden;
              max-width: 100%;
              word-wrap: break-word;
          }

          .notification.show {
              transform: translateX(0);
              opacity: 1;
          }

          .notification.hide {
              transform: translateX(450px);
              opacity: 0;
          }

          .notification-content {
              display: flex;
              align-items: flex-start;
              gap: 1rem;
              position: relative;
              z-index: 2;
          }

          .notification-icon {
              font-size: 1.2rem;
              flex-shrink: 0;
              margin-top: 0.1rem;
          }

          .notification-message {
              flex: 1;
              line-height: 1.5;
          }

          .notification-actions {
              display: flex;
              gap: 0.5rem;
              margin-top: 0.75rem;
              margin-left: 2.2rem;
          }

          .notification-action {
              background: rgba(255, 255, 255, 0.1);
              border: 1px solid rgba(255, 255, 255, 0.2);
              color: white;
              padding: 0.25rem 0.75rem;
              border-radius: 6px;
              font-size: 0.8rem;
              cursor: pointer;
              transition: all 0.2s ease;
              text-decoration: none;
              display: inline-flex;
              align-items: center;
              gap: 0.25rem;
          }

          .notification-action:hover {
              background: rgba(255, 255, 255, 0.2);
              border-color: rgba(255, 255, 255, 0.3);
              color: white;
              text-decoration: none;
          }

          .notification-action.primary {
              background: rgba(92, 107, 80, 0.8);
              border-color: rgba(92, 107, 80, 1);
          }

          .notification-action.primary:hover {
              background: rgba(92, 107, 80, 1);
          }

          .notification-close {
              background: none;
              border: none;
              color: rgba(255, 255, 255, 0.7);
              cursor: pointer;
              padding: 0.25rem;
              border-radius: 4px;
              transition: all 0.2s ease;
              margin-left: auto;
              flex-shrink: 0;
              display: flex;
              align-items: center;
              justify-content: center;
              width: 24px;
              height: 24px;
          }

          .notification-close:hover {
              background: rgba(255, 255, 255, 0.1);
              color: white;
          }

          .notification-progress {
              position: absolute;
              bottom: 0;
              left: 0;
              height: 3px;
              background: rgba(92, 107, 80, 0.8);
              transition: width linear;
              z-index: 1;
          }

          /* Notification Types */
          .notification.success {
              border-left: 4px solid #38a169;
          }

          .notification.success .notification-icon {
              color: #38a169;
          }

          .notification.error {
              border-left: 4px solid #e53e3e;
          }

          .notification.error .notification-icon {
              color: #e53e3e;
          }

          .notification.warning {
              border-left: 4px solid #dd6b20;
          }

          .notification.warning .notification-icon {
              color: #dd6b20;
          }

          .notification.info {
              border-left: 4px solid #3182ce;
          }

          .notification.info .notification-icon {
              color: #3182ce;
          }

          /* Responsive Design */
          @media (max-width: 768px) {
              .notification-container {
                  top: 80px;
                  right: 12px;
                  left: 12px;
                  max-width: none;
              }

              .notification {
                  margin-bottom: 0.5rem;
                  padding: 1rem;
                  font-size: 0.9rem;
              }

              .notification-content {
                  gap: 0.75rem;
              }

              .notification-actions {
                  margin-left: 1.75rem;
                  flex-wrap: wrap;
              }
          }

          /* Animation for stacking */
          .notification:not(:last-child) {
              margin-bottom: 0.75rem;
          }

          /* Hover effects */
          .notification:hover .notification-progress {
              animation-play-state: paused;
          }

          /* Accessibility */
          @media (prefers-reduced-motion: reduce) {
              .notification {
                  transition-duration: 0.01ms;
              }
              
              .notification-progress {
                  transition: none;
              }
          }

          /* High contrast mode */
          @media (prefers-contrast: high) {
              .notification {
                  background: #000;
                  border: 2px solid #fff;
              }
              
              .notification-action {
                  border-color: #fff;
              }
          }
      `;
      
      document.head.appendChild(styles);
  }

  // Main notification method
  show(message, type = 'info', options = {}) {
      const notification = this.createNotification(message, type, options);
      this.addNotification(notification);
      return notification.id;
  }

  // Convenience methods
  success(message, options = {}) {
      return this.show(message, 'success', options);
  }

  error(message, options = {}) {
      return this.show(message, 'error', { ...options, persistent: true });
  }

  warning(message, options = {}) {
      return this.show(message, 'warning', options);
  }

  info(message, options = {}) {
      return this.show(message, 'info', options);
  }

  // Create notification object
  createNotification(message, type, options) {
      const id = this.generateId();
      const config = this.config?.notifications?.types?.[type] || {};
      
      const notification = {
          id: id,
          message: message,
          type: type,
          icon: options.icon || config.icon || this.getDefaultIcon(type),
          duration: options.duration !== undefined ? options.duration : this.defaultDuration,
          persistent: options.persistent || false,
          actions: options.actions || [],
          onClick: options.onClick || null,
          onClose: options.onClose || null,
          timestamp: Date.now(),
          element: null
      };

      notification.element = this.createElement(notification);
      return notification;
  }

  // Create DOM element
  createElement(notification) {
      const element = document.createElement('div');
      element.className = `notification ${notification.type}`;
      element.setAttribute('data-id', notification.id);
      element.setAttribute('role', 'alert');
      element.setAttribute('aria-live', 'polite');

      // Create content
      const content = document.createElement('div');
      content.className = 'notification-content';

      // Icon
      const icon = document.createElement('i');
      icon.className = `notification-icon ${notification.icon}`;
      content.appendChild(icon);

      // Message
      const message = document.createElement('div');
      message.className = 'notification-message';
      message.textContent = notification.message;
      content.appendChild(message);

      // Close button
      const closeBtn = document.createElement('button');
      closeBtn.className = 'notification-close';
      closeBtn.innerHTML = '<i class="fas fa-times"></i>';
      closeBtn.setAttribute('aria-label', 'Close notification');
      closeBtn.onclick = () => this.remove(notification.id);
      content.appendChild(closeBtn);

      element.appendChild(content);

      // Actions
      if (notification.actions && notification.actions.length > 0) {
          const actionsContainer = document.createElement('div');
          actionsContainer.className = 'notification-actions';

          notification.actions.forEach(action => {
              const actionBtn = document.createElement('button');
              actionBtn.className = `notification-action ${action.style || ''}`;
              actionBtn.innerHTML = action.icon ? `<i class="${action.icon}"></i> ${action.text}` : action.text;
              actionBtn.onclick = () => {
                  if (action.onClick) {
                      action.onClick(notification);
                  }
                  if (action.closeOnClick !== false) {
                      this.remove(notification.id);
                  }
              };
              actionsContainer.appendChild(actionBtn);
          });

          element.appendChild(actionsContainer);
      }

      // Progress bar for timed notifications
      if (!notification.persistent && notification.duration > 0) {
          const progress = document.createElement('div');
          progress.className = 'notification-progress';
          progress.style.width = '100%';
          element.appendChild(progress);
      }

      // Click handler
      if (notification.onClick) {
          element.style.cursor = 'pointer';
          element.onclick = (e) => {
              if (!e.target.closest('.notification-close') && !e.target.closest('.notification-action')) {
                  notification.onClick(notification);
              }
          };
      }

      return element;
  }

  // Add notification to container
  addNotification(notification) {
      // Remove oldest notification if at max capacity
      if (this.notifications.length >= this.maxNotifications) {
          this.remove(this.notifications[0].id);
      }

      // Add to notifications array
      this.notifications.push(notification);

      // Add to DOM
      this.container.appendChild(notification.element);

      // Trigger show animation
      requestAnimationFrame(() => {
          notification.element.classList.add('show');
      });

      // Set up auto-removal for non-persistent notifications
      if (!notification.persistent && notification.duration > 0) {
          this.setupAutoRemoval(notification);
      }

      // Track notification
      this.trackNotification('shown', notification);

      console.log(`🔔 Notification shown: ${notification.type} - ${notification.message}`);
  }

  // Setup auto-removal with progress bar
  setupAutoRemoval(notification) {
      const progressBar = notification.element.querySelector('.notification-progress');
      
      if (progressBar) {
          // Animate progress bar
          progressBar.style.transition = `width ${notification.duration}ms linear`;
          requestAnimationFrame(() => {
              progressBar.style.width = '0%';
          });

          // Pause progress on hover
          notification.element.addEventListener('mouseenter', () => {
              progressBar.style.animationPlayState = 'paused';
          });

          notification.element.addEventListener('mouseleave', () => {
              progressBar.style.animationPlayState = 'running';
          });
      }

      // Set removal timeout
      notification.timeout = setTimeout(() => {
          this.remove(notification.id);
      }, notification.duration);
  }

  // Remove notification
  remove(id) {
      const notification = this.notifications.find(n => n.id === id);
      if (!notification) return;

      // Clear timeout
      if (notification.timeout) {
          clearTimeout(notification.timeout);
      }

      // Trigger hide animation
      notification.element.classList.add('hide');

      // Remove from DOM after animation
      setTimeout(() => {
          if (notification.element.parentNode) {
              notification.element.parentNode.removeChild(notification.element);
          }

          // Remove from notifications array
          this.notifications = this.notifications.filter(n => n.id !== id);

          // Call onClose callback
          if (notification.onClose) {
              notification.onClose(notification);
          }

          // Track notification
          this.trackNotification('closed', notification);

      }, 300);

      console.log(`🔔 Notification removed: ${id}`);
  }

  // Remove all notifications
  clear() {
      const notificationIds = this.notifications.map(n => n.id);
      notificationIds.forEach(id => this.remove(id));
  }

  // Update existing notification
  update(id, updates) {
      const notification = this.notifications.find(n => n.id === id);
      if (!notification) return false;

      // Update notification object
      Object.assign(notification, updates);

      // Update DOM element
      if (updates.message) {
          const messageElement = notification.element.querySelector('.notification-message');
          if (messageElement) {
              messageElement.textContent = updates.message;
          }
      }

      if (updates.type) {
          notification.element.className = `notification ${updates.type} show`;
      }

      return true;
  }

  // Get notification by ID
  get(id) {
      return this.notifications.find(n => n.id === id);
  }

  // Get all notifications
  getAll() {
      return [...this.notifications];
  }

  // Count notifications by type
  count(type = null) {
      if (type) {
          return this.notifications.filter(n => n.type === type).length;
      }
      return this.notifications.length;
  }

  // Utility methods
  generateId() {
      return 'notif_' + Date.now().toString(36) + '_' + Math.random().toString(36).substr(2, 9);
  }

  getDefaultIcon(type) {
      const icons = {
          success: 'fas fa-check-circle',
          error: 'fas fa-times-circle',
          warning: 'fas fa-exclamation-triangle',
          info: 'fas fa-info-circle'
      };
      return icons[type] || icons.info;
  }

  // Event tracking
  trackNotification(action, notification) {
      try {
          if (window.SESMineDataManager && window.SESMineDataManager.instance) {
              window.SESMineDataManager.instance.trackEvent(`notification_${action}`, {
                  notificationId: notification.id,
                  type: notification.type,
                  message: notification.message.substring(0, 100), // Truncate for privacy
                  persistent: notification.persistent,
                  duration: notification.duration
              });
          }
      } catch (error) {
          console.error('Notification tracking error:', error);
      }
  }

  // Preset notification templates
  templates = {
      loginSuccess: (userName) => this.success(`Welcome back, ${userName}!`, {
          actions: [
              {
                  text: 'Go to Dashboard',
                  style: 'primary',
                  icon: 'fas fa-tachometer-alt',
                  onClick: () => window.location.href = 'home.html'
              }
          ]
      }),

      registrationSuccess: () => this.success('Registration submitted successfully!', {
          actions: [
              {
                  text: 'Check Email',
                  style: 'primary',
                  icon: 'fas fa-envelope',
                  onClick: () => window.open('mailto:', '_blank')
              }
          ]
      }),

      sessionExpired: () => this.warning('Your session has expired. Please log in again.', {
          persistent: true,
          actions: [
              {
                  text: 'Login',
                  style: 'primary',
                  icon: 'fas fa-sign-in-alt',
                  onClick: () => window.location.href = 'login.html'
              }
          ]
      }),

      networkError: () => this.error('Network connection error. Please check your internet connection.', {
          actions: [
              {
                  text: 'Retry',
                  icon: 'fas fa-redo',
                  onClick: () => window.location.reload()
              }
          ]
      }),

      featureUnavailable: (feature, requiredLevel) => this.warning(
          `${feature} requires ${requiredLevel} access level.`, {
          actions: [
              {
                  text: 'Upgrade',
                  style: 'primary',
                  icon: 'fas fa-arrow-up',
                  onClick: () => window.location.href = 'Pricing Plans - SESMine.html'
              }
          ]
      })
  };
}

// Initialize Notification System
document.addEventListener('DOMContentLoaded', function() {
  window.SESMineNotifications = {
      instance: new SESMineNotificationSystem()
  };
  
  // Add global notification methods
  window.showNotification = (message, type, options) => 
      window.SESMineNotifications.instance.show(message, type, options);
  window.showSuccess = (message, options) => 
      window.SESMineNotifications.instance.success(message, options);
  window.showError = (message, options) => 
      window.SESMineNotifications.instance.error(message, options);
  window.showWarning = (message, options) => 
      window.SESMineNotifications.instance.warning(message, options);
  window.showInfo = (message, options) => 
      window.SESMineNotifications.instance.info(message, options);
  
  console.log('🔔 SESMine Notification System Ready');
});

// Listen for authentication events and show appropriate notifications
document.addEventListener('sesmine-auth-change', function(event) {
  const { type, user } = event.detail;
  
  if (window.SESMineNotifications && window.SESMineNotifications.instance) {
      const notifications = window.SESMineNotifications.instance;
      
      switch (type) {
          case 'login_success':
              notifications.templates.loginSuccess(user.fullName);
              break;
          case 'logout':
              notifications.info('You have been logged out successfully.');
              break;
          case 'session_expired':
              notifications.templates.sessionExpired();
              break;
      }
  }
});

console.log('🔔 SESMine Notification System Loaded');
console.log('📱 Features: Auto-dismiss, progress bars, actions, templates');
console.log('🎨 Responsive design with accessibility support');
console.log('📊 Event tracking and analytics integration');
console.log('✅ Notification utilities ready');
