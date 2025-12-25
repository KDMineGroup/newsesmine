/**
 * SESMine Platform - System Configuration & Utilities
 * Version: 1.0.0
 * Last Updated: December 2024
 */

// ==================== SYSTEM CONFIGURATION ====================

const SYSTEM_CONFIG = {
  appName: 'SESMine',
  version: '1.0.0',
  environment: 'development', // development, staging, production
  
  // API Configuration (for future backend integration)
  api: {
    baseURL: 'https://api.sesmine.com',
    timeout: 30000,
    retryAttempts: 3
  },
  
  // Authentication Configuration
  auth: {
    sessionTimeout: 24 * 60 * 60 * 1000, // 24 hours
    passwordMinLength: 8,
    passwordRequireUppercase: true,
    passwordRequireNumber: true,
    passwordRequireSpecial: true,
    maxLoginAttempts: 5,
    lockoutDuration: 15 * 60 * 1000 // 15 minutes
  },
  
  // Access Levels
  accessLevels: {
    basic: {
      name: 'Basic',
      maxProjects: 5,
      maxUsers: 1,
      features: ['basic-tools', 'limited-reports']
    },
    professional: {
      name: 'Professional',
      maxProjects: 25,
      maxUsers: 5,
      features: ['all-tools', 'advanced-reports', 'api-access']
    },
    enterprise: {
      name: 'Enterprise',
      maxProjects: -1, // unlimited
      maxUsers: -1, // unlimited
      features: ['all-features', 'priority-support', 'custom-integration']
    }
  },
  
  // Hub Configuration
  hubs: {
    engineering: {
      id: 'engineering',
      name: 'Engineering Hub',
      description: 'AACE-compliant cost estimation and project management',
      icon: 'fa-hard-hat',
      color: 'linear-gradient(135deg, #2563eb, #1e40af)',
      image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&q=80',
      url: 'engineering-hub.html',
      requiredAccessLevel: 'basic'
    },
    economics: {
      id: 'economics',
      name: 'Economics Hub',
      description: 'Financial modeling and NPV/IRR calculators',
      icon: 'fa-chart-line',
      color: 'linear-gradient(135deg, #10b981, #059669)',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80',
      url: 'economics-hub.html',
      requiredAccessLevel: 'professional'
    },
    analytics: {
      id: 'analytics',
      name: 'Analytics Platform',
      description: 'Real-time dashboards and predictive analytics',
      icon: 'fa-chart-bar',
      color: 'linear-gradient(135deg, #9333ea, #7e22ce)',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
      url: 'analytics-platform.html',
      requiredAccessLevel: 'professional'
    },
    procurement: {
      id: 'procurement',
      name: 'Procurement Hub',
      description: 'Vendor management and RFQ systems',
      icon: 'fa-shopping-cart',
      color: 'linear-gradient(135deg, #f59e0b, #d97706)',
      image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80',
      url: 'procurement-hub.html',
      requiredAccessLevel: 'professional'
    },
    consulting: {
      id: 'consulting',
      name: 'Consulting Hub',
      description: 'Expert consultants and feasibility studies',
      icon: 'fa-users',
      color: 'linear-gradient(135deg, #d4af37, #b8941f)',
      image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80',
      url: 'consulting-hub.html',
      requiredAccessLevel: 'enterprise'
    },
    innovation: {
      id: 'innovation',
      name: 'Innovation & Technology',
      description: 'AI, automation, and emerging technologies',
      icon: 'fa-lightbulb',
      color: 'linear-gradient(135deg, #06b6d4, #0891b2)',
      image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&q=80',
      url: 'innovation-hub.html',
      requiredAccessLevel: 'enterprise'
    }
  }
};

// ==================== UTILITY FUNCTIONS ====================

/**
 * Local Storage Manager
 */
const StorageManager = {
  // Get item from localStorage
  get(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error(`Error getting ${key} from localStorage:`, error);
      return defaultValue;
    }
  },
  
  // Set item in localStorage
  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error(`Error setting ${key} in localStorage:`, error);
      return false;
    }
  },
  
  // Remove item from localStorage
  remove(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`Error removing ${key} from localStorage:`, error);
      return false;
    }
  },
  
  // Clear all localStorage
  clear() {
    try {
      localStorage.clear();
      return true;
    } catch (error) {
      console.error('Error clearing localStorage:', error);
      return false;
    }
  }
};

/**
 * Session Manager
 */
const SessionManager = {
  // Check if session is valid
  isValid() {
    const currentUser = StorageManager.get('currentUser');
    if (!currentUser) return false;
    
    const loginTime = new Date(currentUser.loginTime);
    const now = new Date();
    const sessionAge = now - loginTime;
    
    return sessionAge < SYSTEM_CONFIG.auth.sessionTimeout;
  },
  
  // Refresh session
  refresh() {
    const currentUser = StorageManager.get('currentUser');
    if (currentUser) {
      currentUser.loginTime = new Date().toISOString();
      StorageManager.set('currentUser', currentUser);
    }
  },
  
  // End session
  end() {
    StorageManager.remove('currentUser');
    window.location.href = 'login.html';
  }
};

/**
 * Validation Utilities
 */
const Validator = {
  // Validate email
  email(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  },
  
  // Validate password
  password(password) {
    const config = SYSTEM_CONFIG.auth;
    const errors = [];
    
    if (password.length < config.passwordMinLength) {
      errors.push(`Password must be at least ${config.passwordMinLength} characters`);
    }
    
    if (config.passwordRequireUppercase && !/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }
    
    if (config.passwordRequireNumber && !/[0-9]/.test(password)) {
      errors.push('Password must contain at least one number');
    }
    
    if (config.passwordRequireSpecial && !/[^a-zA-Z0-9]/.test(password)) {
      errors.push('Password must contain at least one special character');
    }
    
    return {
      valid: errors.length === 0,
      errors: errors
    };
  },
  
  // Validate phone number
  phone(phone) {
    const re = /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,9}$/;
    return re.test(phone);
  },
  
  // Validate username
  username(username) {
    const re = /^[a-zA-Z0-9_]{4,20}$/;
    return re.test(username);
  }
};

/**
 * Date/Time Utilities
 */
const DateUtils = {
  // Format date
  format(date, format = 'YYYY-MM-DD') {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    const seconds = String(d.getSeconds()).padStart(2, '0');
    
    return format
      .replace('YYYY', year)
      .replace('MM', month)
      .replace('DD', day)
      .replace('HH', hours)
      .replace('mm', minutes)
      .replace('ss', seconds);
  },
  
  // Get time ago string
  timeAgo(date) {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    
    const intervals = {
      year: 31536000,
      month: 2592000,
      week: 604800,
      day: 86400,
      hour: 3600,
      minute: 60
    };
    
    for (const [unit, secondsInUnit] of Object.entries(intervals)) {
      const interval = Math.floor(seconds / secondsInUnit);
      if (interval >= 1) {
        return `${interval} ${unit}${interval > 1 ? 's' : ''} ago`;
      }
    }
    
    return 'Just now';
  },
  
  // Add days to date
  addDays(date, days) {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }
};

/**
 * String Utilities
 */
const StringUtils = {
  // Capitalize first letter
  capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  },
  
  // Generate random string
  random(length = 10) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  },
  
  // Truncate string
  truncate(str, length = 50) {
    return str.length > length ? str.substring(0, length) + '...' : str;
  },
  
  // Generate initials
  initials(firstName, lastName) {
    return (firstName.charAt(0) + lastName.charAt(0)).toUpperCase();
  }
};

/**
 * Number Utilities
 */
const NumberUtils = {
  // Format currency
  currency(amount, currency = 'USD') {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  },
  
  // Format number with commas
  format(number) {
    return new Intl.NumberFormat('en-US').format(number);
  },
  
  // Generate random number
  random(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
};

/**
 * Notification Manager
 */
const NotificationManager = {
  // Show success notification
  success(message, duration = 3000) {
    this.show(message, 'success', duration);
  },
  
  // Show error notification
  error(message, duration = 5000) {
    this.show(message, 'error', duration);
  },
  
  // Show warning notification
  warning(message, duration = 4000) {
    this.show(message, 'warning', duration);
  },
  
  // Show info notification
  info(message, duration = 3000) {
    this.show(message, 'info', duration);
  },
  
  // Show notification
  show(message, type, duration) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 1rem 1.5rem;
      border-radius: 12px;
      font-weight: 600;
      z-index: 10000;
      animation: slideIn 0.3s ease-out;
      box-shadow: 0 10px 30px rgba(0,0,0,0.2);
    `;
    
    // Set colors based on type
    const colors = {
      success: { bg: '#d1fae5', color: '#065f46', border: '#34d399' },
      error: { bg: '#fee2e2', color: '#991b1b', border: '#f87171' },
      warning: { bg: '#fef3c7', color: '#92400e', border: '#fbbf24' },
      info: { bg: '#dbeafe', color: '#1e40af', border: '#60a5fa' }
    };
    
    const style = colors[type] || colors.info;
    notification.style.background = style.bg;
    notification.style.color = style.color;
    notification.style.border = `2px solid ${style.border}`;
    
    document.body.appendChild(notification);
    
    // Remove after duration
    setTimeout(() => {
      notification.style.animation = 'slideOut 0.3s ease-out';
      setTimeout(() => notification.remove(), 300);
    }, duration);
  }
};

/**
 * Hub Manager
 */
const HubManager = {
  // Get all hubs
  getAll() {
    return SYSTEM_CONFIG.hubs;
  },
  
  // Get hub by ID
  getById(hubId) {
    return SYSTEM_CONFIG.hubs[hubId];
  },
  
  // Check if user has access to hub
  hasAccess(hubId) {
    const currentUser = StorageManager.get('currentUser');
    if (!currentUser) return false;
    
    const hubsAccess = currentUser.hubsAccess || [];
    return hubsAccess.includes(hubId);
  },
  
  // Get user's accessible hubs
  getUserHubs() {
    const currentUser = StorageManager.get('currentUser');
    if (!currentUser) return [];
    
    const hubsAccess = currentUser.hubsAccess || [];
    return hubsAccess.map(hubId => this.getById(hubId)).filter(hub => hub);
  }
};

/**
 * Analytics Tracker
 */
const Analytics = {
  // Track page view
  pageView(pageName) {
    const event = {
      type: 'pageview',
      page: pageName,
      timestamp: new Date().toISOString(),
      user: StorageManager.get('currentUser')?.userId
    };
    
    this.track(event);
  },
  
  // Track event
  event(eventName, data = {}) {
    const event = {
      type: 'event',
      name: eventName,
      data: data,
      timestamp: new Date().toISOString(),
      user: StorageManager.get('currentUser')?.userId
    };
    
    this.track(event);
  },
  
  // Track event (internal)
  track(event) {
    const events = StorageManager.get('analyticsEvents', []);
    events.push(event);
    StorageManager.set('analyticsEvents', events);
  }
};

// ==================== EXPORT ====================

// Make utilities available globally
window.SESMine = {
  config: SYSTEM_CONFIG,
  storage: StorageManager,
  session: SessionManager,
  validator: Validator,
  date: DateUtils,
  string: StringUtils,
  number: NumberUtils,
  notification: NotificationManager,
  hub: HubManager,
  analytics: Analytics
};

// Initialize system
console.log(`%c SESMine Platform v${SYSTEM_CONFIG.version} `, 'background: #0b1a2e; color: #d4af37; font-size: 16px; font-weight: bold; padding: 10px;');
console.log('System utilities loaded successfully');