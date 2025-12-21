// ============================================
// SESMine Platform - Notification System
// Smart Engineering Solutions for Mining
// ============================================

class SESMineNotifications {
  constructor() {
      this.config = window.SESMineConfig;
      this.notifications = [];
      this.container = null;
      this.maxVisible = this.config.notifications.maxVisible;
      this.defaultDuration = this.config.notifications.duration;
      
      this.init();
  }

  init() {
      console.log('🔔 SESMine Notification System Initializing...');
      this.createContainer();
      this.setupStyles();
      console.log('✅ Notification System Ready');
  }

  createContainer() {
      this.container = document.createElement('div');
      this.container.id = 'sesmine-notifications';
      this.container.className = `notifications-container ${this.config.notifications.position}`;
      document.body.appendChild(this.container);
  }

  show(message, type = 'info', options = {}) {
      const notification = this.createNotification(message, type, options);
      this.addNotification(notification);
      return notification.id;
  }

  createNotification(message, type, options) {
      const id = this.generateId();
      const duration = options.duration || this.defaultDuration;
      const persistent = options.persistent || false;
      const actions = options.actions || [];
      
      const notification = {
          id,
          message,
          type,
          duration,
          persistent,
          actions,
          timestamp: Date.now(),
          element: null
      };

      const element = document.createElement('div');
      element.className = `notification notification-${type}`;
      element.dataset.notificationId = id;
      
      element.innerHTML = `
          <div class="notification-content">
              <div class="notification-icon">
                  <i class="${this.config.notifications.types[type].icon}"></i>
              </div>
              <div class="notification-body">
                  <div class="notification-message">${message}</div>
                  ${options.subtitle ? `<div class="notification-subtitle">${options.subtitle}</div>` : ''}
                  ${actions.length > 0 ? this.createActionsHTML(actions, id) : ''}
              </div>
              ${!persistent ? `
                  <button class="notification-close" onclick="SESMineNotifications.instance.dismiss('${id}')">
                      <i class="fas fa-times"></i>
                  </button>
              ` : ''}
          </div>
          ${!persistent && duration > 0 ? `
              <div class="notification-progress">
                  <div class="notification-progress-bar" style="animation-duration: ${duration}ms;"></div>
              </div>
          ` : ''}
      `;

      notification.element = element;
      return notification;
  }

  createActionsHTML(actions, notificationId) {
      return `
          <div class="notification-actions">
              ${actions.map(action => `
                  <button class="notification-action ${action.style || 'primary'}" 
                          onclick="SESMineNotifications.instance.handleAction('${notificationId}', '${action.id}', ${action.callback})">
                      ${action.icon ? `<i class="${action.icon}"></i>` : ''}
                      ${action.text}
                  </button>
              `).join('')}
          </div>
      `;
  }

  addNotification(notification) {
      this.notifications.unshift(notification);
      
      // Limit visible notifications
      if (this.notifications.length > this.maxVisible) {
          const oldNotifications = this.notifications.slice(this.maxVisible);
          oldNotifications.forEach(n => this.remove(n.id));
      }

      // Add to DOM
      this.container.insertBefore(notification.element, this.container.firstChild);
      
      // Animate in
      setTimeout(() => {
          notification.element.classList.add('notification-show');
      }, 10);

      // Auto-dismiss if not persistent
      if (!notification.persistent && notification.duration > 0) {
          setTimeout(() => {
              this.dismiss(notification.id);
          }, notification.duration);
      }

      // Track notification
      this.trackNotification(notification);
  }

  dismiss(id) {
      const notification = this.notifications.find(n => n.id === id);
      if (!notification) return;

      notification.element.classList.add('notification-hide');
      
      setTimeout(() => {
          this.remove(id);
      }, 300);
  }

  remove(id) {
      const index = this.notifications.findIndex(n => n.id === id);
      if (index === -1) return;

      const notification = this.notifications[index];
      if (notification.element && notification.element.parentNode) {
          notification.element.parentNode.removeChild(notification.element);
      }
      
      this.notifications.splice(index, 1);
  }

  clear() {
      this.notifications.forEach(notification => {
          if (notification.element && notification.element.parentNode) {
              notification.element.parentNode.removeChild(notification.element);
          }
      });
      this.notifications = [];
  }

  handleAction(notificationId, actionId, callback) {
      const notification = this.notifications.find(n => n.id === notificationId);
      if (!notification) return;

      const action = notification.actions.find(a => a.id === actionId);
      if (action && action.callback) {
          if (typeof action.callback === 'function') {
              action.callback(notification);
          } else if (typeof action.callback === 'string') {
              eval(action.callback);
          }
      }

      // Auto-dismiss after action unless specified otherwise
      if (!action || action.dismissAfter !== false) {
          this.dismiss(notificationId);
      }
  }

  // Specialized notification methods
  success(message, options = {}) {
      return this.show(message, 'success', options);
  }

  error(message, options = {}) {
      return this.show(message, 'error', { ...options, duration: options.duration || 8000 });
  }

  warning(message, options = {}) {
      return this.show(message, 'warning', options);
  }

  info(message, options = {}) {
      return this.show(message, 'info', options);
  }

  // System notifications
  systemAlert(title, message, actions = []) {
      return this.show(title, 'warning', {
          subtitle: message,
          persistent: true,
          actions: actions
      });
  }

  confirmAction(message, onConfirm, onCancel) {
      return this.show(message, 'warning', {
          persistent: true,
          actions: [
              {
                  id: 'confirm',
                  text: 'Confirm',
                  style: 'danger',
                  icon: 'fas fa-check',
                  callback: onConfirm
              },
              {
                  id: 'cancel',
                  text: 'Cancel',
                  style: 'secondary',
                  icon: 'fas fa-times',
                  callback: onCancel
              }
          ]
      });
  }

  upgradePrompt(currentLevel, targetLevel) {
      const current = this.config.accessLevels[currentLevel];
      const target = this.config.accessLevels[targetLevel];
      
      return this.show(`Upgrade to ${target.name}`, 'info', {
          subtitle: `Unlock advanced features and increase your limits`,
          persistent: true,
          actions: [
              {
                  id: 'upgrade',
                  text: `Upgrade - ${this.config.utils.formatCurrency(target.price.monthly)}/month`,
                  style: 'primary',
                  icon: 'fas fa-arrow-up',
                  callback: () => this.handleUpgrade(targetLevel)
              },
              {
                  id: 'later',
                  text: 'Maybe Later',
                  style: 'secondary',
                  callback: null
              }
          ]
      });
  }

  sessionWarning(minutesLeft) {
      return this.show(`Session expires in ${minutesLeft} minutes`, 'warning', {
          subtitle: 'Click to extend your session',
          actions: [
              {
                  id: 'extend',
                  text: 'Extend Session',
                  style: 'primary',
                  icon: 'fas fa-clock',
                  callback: () => this.extendSession()
              }
          ]
      });
  }

  // Feature limit notifications
  limitReached(limitType, current, max) {
      const messages = {
          projects: `You've reached your project limit (${current}/${max})`,
          exports: `You've reached your export limit (${current}/${max})`,
          storage: `You've reached your storage limit`
      };

      return this.warning(messages[limitType] || `Limit reached: ${limitType}`, {
          subtitle: 'Consider upgrading for higher limits',
          actions: [
              {
                  id: 'upgrade',
                  text: 'View Upgrade Options',
                  style: 'primary',
                  callback: () => window.location.href = 'Pricing Plans - SESMine.html'
              }
          ]
      });
  }

  // Utility methods
  generateId() {
      return 'notification-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
  }

  trackNotification(notification) {
      if (this.config.analytics.enabled && typeof gtag !== 'undefined') {
          gtag('event', 'notification_shown', {
              event_category: 'sesmine_notifications',
              event_label: notification.type,
              value: 1
          });
      }
  }

  handleUpgrade(targetLevel) {
      // In production, integrate with payment system
      this.info('Redirecting to upgrade page...', {
          duration: 2000
      });
      
      setTimeout(() => {
          window.location.href = `Pricing Plans - SESMine.html?upgrade=${targetLevel}`;
      }, 2000);
  }

  extendSession() {
      if (window.SESMineAuth && window.SESMineAuth.instance) {
          window.SESMineAuth.instance.startSessionTimer();
          this.success('Session extended successfully');
      }
  }

  setupStyles() {
      const styles = `
          <style>
          .notifications-container {
              position: fixed;
              z-index: 10000;
              pointer-events: none;
              max-width: 420px;
              width: 100%;
          }

          .notifications-container.top-right {
              top: 20px;
              right: 20px;
          }

          .notifications-container.top-left {
              top: 20px;
              left: 20px;
          }

          .notifications-container.bottom-right {
              bottom: 20px;
              right: 20px;
          }

          .notifications-container.bottom-left {
              bottom: 20px;
              left: 20px;
          }

          .notification {
              background: white;
              border-radius: var(--radius-md);
              box-shadow: var(--shadow-xl);
              margin-bottom: var(--space-md);
              overflow: hidden;
              pointer-events: auto;
              transform: translateX(450px);
              opacity: 0;
              transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
              position: relative;
              border-left: 4px solid;
              max-width: 100%;
          }

          .notification.notification-show {
              transform: translateX(0);
              opacity: 1;
          }

          .notification.notification-hide {
              transform: translateX(450px);
              opacity: 0;
          }

          .notification-info {
              border-left-color: #3182ce;
          }

          .notification-success {
              border-left-color: #38a169;
          }

          .notification-warning {
              border-left-color: #dd6b20;
          }

          .notification-error {
              border-left-color: #e53e3e;
          }

          .notification-content {
              display: flex;
              align-items: flex-start;
              padding: var(--space-lg);
              gap: var(--space-md);
          }

          .notification-icon {
              flex-shrink: 0;
              width: 24px;
              height: 24px;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 1.1rem;
          }

          .notification-info .notification-icon {
              color: #3182ce;
          }

          .notification-success .notification-icon {
              color: #38a169;
          }

          .notification-warning .notification-icon {
              color: #dd6b20;
          }

          .notification-error .notification-icon {
              color: #e53e3e;
          }

          .notification-body {
              flex: 1;
              min-width: 0;
          }

          .notification-message {
              font-weight: 600;
              color: var(--primary-dark);
              margin-bottom: var(--space-xs);
              line-height: 1.4;
          }

          .notification-subtitle {
              font-size: 0.9rem;
              color: var(--accent-secondary);
              line-height: 1.4;
              margin-bottom: var(--space-md);
          }

          .notification-actions {
              display: flex;
              gap: var(--space-sm);
              margin-top: var(--space-md);
              flex-wrap: wrap;
          }

          .notification-action {
              padding: var(--space-xs) var(--space-md);
              border-radius: var(--radius-sm);
              border: none;
              font-size: 0.85rem;
              font-weight: 600;
              cursor: pointer;
              transition: all var(--transition-smooth);
              display: flex;
              align-items: center;
              gap: var(--space-xs);
          }

          .notification-action.primary {
              background: var(--accent-primary);
              color: white;
          }

          .notification-action.primary:hover {
              background: #4a5a42;
              transform: translateY(-1px);
          }

          .notification-action.secondary {
              background: #f7fafc;
              color: var(--accent-secondary);
              border: 1px solid #e2e8f0;
          }

          .notification-action.secondary:hover {
              background: #edf2f7;
          }

          .notification-action.danger {
              background: var(--accent-error);
              color: white;
          }

          .notification-action.danger:hover {
              background: #c53030;
              transform: translateY(-1px);
          }

          .notification-close {
              flex-shrink: 0;
              width: 32px;
              height: 32px;
              border: none;
              background: none;
              color: var(--accent-secondary);
              cursor: pointer;
              border-radius: var(--radius-sm);
              transition: all var(--transition-smooth);
              display: flex;
              align-items: center;
              justify-content: center;
          }

          .notification-close:hover {
              background: #f7fafc;
              color: var(--primary-dark);
          }

          .notification-progress {
              position: absolute;
              bottom: 0;
              left: 0;
              right: 0;
              height: 3px;
              background: rgba(0, 0, 0, 0.1);
              overflow: hidden;
          }

          .notification-progress-bar {
              height: 100%;
              background: currentColor;
              width: 100%;
              transform: translateX(-100%);
              animation: notification-progress linear forwards;
          }

          .notification-info .notification-progress-bar {
              background: #3182ce;
          }

          .notification-success .notification-progress-bar {
              background: #38a169;
          }

          .notification-warning .notification-progress-bar {
              background: #dd6b20;
          }

          .notification-error .notification-progress-bar {
              background: #e53e3e;
          }

          @keyframes notification-progress {
              from {
                  transform: translateX(-100%);
              }
              to {
                  transform: translateX(0);
              }
          }

          /* Mobile responsiveness */
          @media (max-width: 768px) {
              .notifications-container {
                  left: 10px !important;
                  right: 10px !important;
                  max-width: none;
              }

              .notification {
                  transform: translateY(-100px);
              }

              .notification.notification-show {
                  transform: translateY(0);
              }

              .notification.notification-hide {
                  transform: translateY(-100px);
              }

              .notification-content {
                  padding: var(--space-md);
              }

              .notification-actions {
                  flex-direction: column;
              }

              .notification-action {
                  justify-content: center;
              }
          }

          /* High contrast mode */
          @media (prefers-contrast: high) {
              .notification {
                  border: 2px solid;
              }

              .notification-info {
                  border-color: #3182ce;
              }

              .notification-success {
                  border-color: #38a169;
              }

              .notification-warning {
                  border-color: #dd6b20;
              }

              .notification-error {
                  border-color: #e53e3e;
              }
          }

          /* Reduced motion */
          @media (prefers-reduced-motion: reduce) {
              .notification {
                  transition: opacity 0.2s ease;
              }

              .notification-progress-bar {
                  animation: none;
                  transform: translateX(0);
              }
          }
          </style>
      `;

      document.head.insertAdjacentHTML('beforeend', styles);
  }
}

// Initialize notification system
document.addEventListener('DOMContentLoaded', function() {
  window.SESMineNotifications = {
      instance: new SESMineNotifications()
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