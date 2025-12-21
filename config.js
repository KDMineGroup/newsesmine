// ============================================
// SESMine Platform - Configuration System
// Smart Engineering Solutions for Mining
// ============================================

window.SESMineConfig = {
  // Application Settings
  app: {
      name: 'SESMine',
      version: '2.1.0',
      environment: 'production', // 'development' | 'staging' | 'production'
      debug: false,
      apiUrl: 'https://api.sesmine.com',
      supportEmail: 'support@sesmine.com',
      companyName: 'Smart Engineering Solutions for Mining',
      description: 'Professional mining intelligence platform with comprehensive tools and expert insights'
  },

  // EmailJS Configuration
  emailjs: {
      serviceId: 'service_sesmine', // Replace with your EmailJS Service ID
      userId: 'user_sesmine123',    // Replace with your EmailJS User ID
      templates: {
          registration: 'template_registration',
          approval: 'template_approval',
          rejection: 'template_rejection',
          welcome: 'template_welcome',
          passwordReset: 'template_password_reset',
          adminNotification: 'template_admin_notification'
      }
  },

  // Access Levels Configuration
  accessLevels: {
      basic: {
          name: 'Basic User',
          level: 1,
          description: 'Essential mining tools and basic features',
          features: [
              'basic_cost_estimation',
              'equipment_database_view',
              'standard_reports',
              'community_access',
              'basic_support'
          ],
          limitations: {
              projectsPerMonth: 5,
              exportsPerMonth: 10,
              storageLimit: '100MB',
              apiCalls: 100
          },
          pricing: {
              monthly: 29,
              yearly: 290,
              currency: 'USD'
          },
          color: '#3182ce',
          icon: 'fas fa-user'
      },
      professional: {
          name: 'Professional',
          level: 2,
          description: 'Advanced features for mining professionals',
          features: [
              'advanced_cost_estimation',
              'full_equipment_database',
              'advanced_analytics',
              'custom_reports',
              'api_access',
              'priority_support',
              'data_export',
              'collaboration_tools'
          ],
          limitations: {
              projectsPerMonth: 50,
              exportsPerMonth: 100,
              storageLimit: '1GB',
              apiCalls: 1000
          },
          pricing: {
              monthly: 99,
              yearly: 990,
              currency: 'USD'
          },
          color: '#5c6b50',
          icon: 'fas fa-user-tie'
      },
      enterprise: {
          name: 'Enterprise',
          level: 3,
          description: 'Complete platform access with admin capabilities',
          features: [
              'unlimited_projects',
              'custom_integrations',
              'white_label_options',
              'dedicated_support',
              'advanced_security',
              'admin_controls',
              'bulk_operations',
              'custom_training',
              'sla_guarantee'
          ],
          limitations: {
              projectsPerMonth: -1, // Unlimited
              exportsPerMonth: -1,  // Unlimited
              storageLimit: 'Unlimited',
              apiCalls: -1 // Unlimited
          },
          pricing: {
              monthly: 299,
              yearly: 2990,
              currency: 'USD'
          },
          color: '#1a1a1a',
          icon: 'fas fa-building'
      }
  },

  // Permission Matrix
  permissions: {
      // Hub Access Permissions
      hubs: {
          engineering: {
              basic: ['view', 'basic_tools'],
              professional: ['view', 'basic_tools', 'advanced_tools', 'export'],
              enterprise: ['view', 'basic_tools', 'advanced_tools', 'export', 'admin', 'bulk_operations']
          },
          analytics: {
              basic: ['view', 'basic_charts'],
              professional: ['view', 'basic_charts', 'advanced_charts', 'custom_reports', 'export'],
              enterprise: ['view', 'basic_charts', 'advanced_charts', 'custom_reports', 'export', 'admin', 'real_time']
          },
          economics: {
              basic: ['view', 'basic_calculations'],
              professional: ['view', 'basic_calculations', 'advanced_modeling', 'scenarios', 'export'],
              enterprise: ['view', 'basic_calculations', 'advanced_modeling', 'scenarios', 'export', 'admin', 'custom_models']
          },
          procurement: {
              basic: ['view', 'basic_search'],
              professional: ['view', 'basic_search', 'advanced_search', 'supplier_management', 'export'],
              enterprise: ['view', 'basic_search', 'advanced_search', 'supplier_management', 'export', 'admin', 'bulk_procurement']
          },
          consulting: {
              basic: ['view', 'basic_resources'],
              professional: ['view', 'basic_resources', 'expert_access', 'consultation_booking'],
              enterprise: ['view', 'basic_resources', 'expert_access', 'consultation_booking', 'dedicated_consultant', 'priority_support']
          },
          innovation: {
              basic: ['view', 'basic_content'],
              professional: ['view', 'basic_content', 'advanced_content', 'trend_analysis'],
              enterprise: ['view', 'basic_content', 'advanced_content', 'trend_analysis', 'custom_research', 'early_access']
          },
          training: {
              basic: ['view', 'basic_courses'],
              professional: ['view', 'basic_courses', 'advanced_courses', 'certifications'],
              enterprise: ['view', 'basic_courses', 'advanced_courses', 'certifications', 'custom_training', 'group_training']
          }
      },

      // Feature Permissions
      features: {
          cost_estimation: {
              basic: ['basic_estimation'],
              professional: ['basic_estimation', 'advanced_estimation', 'batch_processing'],
              enterprise: ['basic_estimation', 'advanced_estimation', 'batch_processing', 'custom_algorithms', 'api_access']
          },
          data_export: {
              basic: ['csv_export'],
              professional: ['csv_export', 'excel_export', 'pdf_export', 'api_export'],
              enterprise: ['csv_export', 'excel_export', 'pdf_export', 'api_export', 'custom_formats', 'automated_exports']
          },
          user_management: {
              basic: [],
              professional: ['profile_management'],
              enterprise: ['profile_management', 'user_administration', 'role_management', 'audit_logs']
          }
      }
  },

  // Security Configuration
  security: {
      sessionTimeout: 3600000, // 1 hour in milliseconds
      maxLoginAttempts: 5,
      lockoutDuration: 900000, // 15 minutes
      passwordRequirements: {
          minLength: 8,
          requireUppercase: true,
          requireLowercase: true,
          requireNumbers: true,
          requireSpecialChars: false // Relaxed for demo
      },
      encryptionKey: 'sesmine_2024_secure_key', // In production, use proper encryption
      tokenExpiry: 86400000 // 24 hours
  },

  // Storage Configuration
  storage: {
      prefix: 'sesmine_',
      keys: {
          user: 'current_user',
          session: 'user_session',
          preferences: 'user_preferences',
          registrations: 'registrations',
          analytics: 'analytics_events'
      },
      backup: {
          enabled: true,
          frequency: 'daily', // 'daily' | 'weekly' | 'monthly'
          retention: 30 // days
      }
  },

  // Platform URLs
  urls: {
      home: 'home.html',
      login: 'login.html',
      register: 'index.html',
      dashboard: 'home.html',
      adminDashboard: 'admin-dashboard.html',
      hubs: {
          engineering: 'engineering-hub.html',
          analytics: 'analytics-platform.html',
          economics: 'economics-hub.html',
          procurement: 'procurement-hub.html',
          consulting: 'consulting-hub.html',
          innovation: 'innovation-technology-hub.html',
          training: 'training-education-hub.html'
      },
      support: {
          about: 'about.html',
          contact: 'contact.html',
          features: 'features.html',
          pricing: 'Pricing Plans - SESMine.html',
          settings: 'setting.html'
      }
  },

  // API Endpoints (for future backend integration)
  api: {
      baseUrl: 'https://api.sesmine.com/v1',
      endpoints: {
          auth: {
              login: '/auth/login',
              logout: '/auth/logout',
              register: '/auth/register',
              refresh: '/auth/refresh',
              forgotPassword: '/auth/forgot-password',
              resetPassword: '/auth/reset-password'
          },
          users: {
              profile: '/users/profile',
              preferences: '/users/preferences',
              registrations: '/users/registrations'
          },
          data: {
              export: '/data/export',
              import: '/data/import',
              backup: '/data/backup'
          },
          admin: {
              users: '/admin/users',
              registrations: '/admin/registrations',
              analytics: '/admin/analytics',
              settings: '/admin/settings'
          }
      }
  },

  // Notification Settings
  notifications: {
      position: 'top-right',
      duration: 5000,
      maxNotifications: 5,
      enableSound: false,
      enablePersistent: true,
      types: {
          success: {
              icon: 'fas fa-check-circle',
              color: '#38a169',
              sound: null
          },
          error: {
              icon: 'fas fa-times-circle',
              color: '#e53e3e',
              sound: null
          },
          warning: {
              icon: 'fas fa-exclamation-triangle',
              color: '#dd6b20',
              sound: null
          },
          info: {
              icon: 'fas fa-info-circle',
              color: '#3182ce',
              sound: null
          }
      }
  },

  // Analytics Configuration
  analytics: {
      enabled: true,
      trackPageViews: true,
      trackUserActions: true,
      trackErrors: true,
      providers: {
          googleAnalytics: {
              enabled: false,
              trackingId: 'GA_TRACKING_ID'
          },
          mixpanel: {
              enabled: false,
              token: 'MIXPANEL_TOKEN'
          }
      }
  },

  // Feature Flags
  features: {
      registration: true,
      emailNotifications: true,
      adminDashboard: true,
      dataExport: true,
      advancedAnalytics: true,
      apiAccess: true,
      multiLanguage: false,
      darkMode: false,
      offlineMode: false
  },

  // UI Configuration
  ui: {
      theme: 'professional',
      animations: {
          enabled: true,
          duration: 300,
          easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
      },
      layout: {
          headerHeight: '80px',
          sidebarWidth: '280px',
          maxContentWidth: '1440px'
      },
      colors: {
          primary: '#1a1a1a',
          secondary: '#5c6b50',
          accent: '#3182ce',
          success: '#38a169',
          warning: '#dd6b20',
          error: '#e53e3e'
      }
  },

  // Utility Functions
  utils: {
      // Email validation
      isValidEmail: function(email) {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          return emailRegex.test(email);
      },

      // Password validation
      isValidPassword: function(password) {
          const requirements = this.security.passwordRequirements;
          
          if (password.length < requirements.minLength) return false;
          if (requirements.requireUppercase && !/[A-Z]/.test(password)) return false;
          if (requirements.requireLowercase && !/[a-z]/.test(password)) return false;
          if (requirements.requireNumbers && !/\d/.test(password)) return false;
          if (requirements.requireSpecialChars && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) return false;
          
          return true;
      },

      // Format currency
      formatCurrency: function(amount, currency = 'USD') {
          return new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: currency
          }).format(amount);
      },

      // Format date
      formatDate: function(date, options = {}) {
          return new Intl.DateTimeFormat('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
              ...options
          }).format(new Date(date));
      },

      // Generate unique ID
      generateId: function() {
          return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
      },

      // Check user permissions
      hasPermission: function(userLevel, hub, permission) {
          const hubPermissions = this.permissions.hubs[hub];
          if (!hubPermissions || !hubPermissions[userLevel]) return false;
          return hubPermissions[userLevel].includes(permission);
      },

      // Get user access level info
      getAccessLevelInfo: function(level) {
          return this.accessLevels[level] || this.accessLevels.basic;
      },

      // Debounce function
      debounce: function(func, wait) {
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

      // Throttle function
      throttle: function(func, limit) {
          let inThrottle;
          return function() {
              const args = arguments;
              const context = this;
              if (!inThrottle) {
                  func.apply(context, args);
                  inThrottle = true;
                  setTimeout(() => inThrottle = false, limit);
              }
          }
      },

      // Local storage helpers
      storage: {
          set: function(key, value) {
              try {
                  localStorage.setItem(window.SESMineConfig.storage.prefix + key, JSON.stringify(value));
                  return true;
              } catch (error) {
                  console.error('Storage set error:', error);
                  return false;
              }
          },
          
          get: function(key, defaultValue = null) {
              try {
                  const item = localStorage.getItem(window.SESMineConfig.storage.prefix + key);
                  return item ? JSON.parse(item) : defaultValue;
              } catch (error) {
                  console.error('Storage get error:', error);
                  return defaultValue;
              }
          },
          
          remove: function(key) {
              try {
                  localStorage.removeItem(window.SESMineConfig.storage.prefix + key);
                  return true;
              } catch (error) {
                  console.error('Storage remove error:', error);
                  return false;
              }
          },
          
          clear: function() {
              try {
                  const prefix = window.SESMineConfig.storage.prefix;
                  Object.keys(localStorage).forEach(key => {
                      if (key.startsWith(prefix)) {
                          localStorage.removeItem(key);
                      }
                  });
                  return true;
              } catch (error) {
                  console.error('Storage clear error:', error);
                  return false;
              }
          }
      }
  },

  // Development and Debug Settings
  debug: {
      enabled: false, // Set to true for development
      logLevel: 'info', // 'debug' | 'info' | 'warn' | 'error'
      showPerformanceMetrics: false,
      enableMockData: true,
      bypassEmailValidation: false
  }
};

// Initialize configuration
document.addEventListener('DOMContentLoaded', function() {
  console.log('⚙️ SESMine Configuration Loaded');
  console.log(`📱 Platform: ${window.SESMineConfig.app.name} v${window.SESMineConfig.app.version}`);
  console.log(`🌍 Environment: ${window.SESMineConfig.app.environment}`);
  
  if (window.SESMineConfig.debug.enabled) {
      console.log('🔧 Debug mode enabled');
      console.log('📋 Configuration:', window.SESMineConfig);
  }
  
  // Validate critical configuration
  validateConfiguration();
});

// Configuration validation
function validateConfiguration() {
  const config = window.SESMineConfig;
  const warnings = [];
  
  // Check EmailJS configuration
  if (!config.emailjs.serviceId || config.emailjs.serviceId === 'service_sesmine') {
      warnings.push('EmailJS Service ID not configured - email functionality will not work');
  }
  
  if (!config.emailjs.userId || config.emailjs.userId === 'user_sesmine123') {
      warnings.push('EmailJS User ID not configured - email functionality will not work');
  }
  
  // Check access levels
  if (!config.accessLevels.basic || !config.accessLevels.professional || !config.accessLevels.enterprise) {
      warnings.push('Access levels not properly configured');
  }
  
  // Check permissions
  if (!config.permissions.hubs || Object.keys(config.permissions.hubs).length === 0) {
      warnings.push('Hub permissions not configured');
  }
  
  // Display warnings
  if (warnings.length > 0) {
      console.warn('⚠️ Configuration warnings:');
      warnings.forEach(warning => console.warn(`  - ${warning}`));
  }
  
  // Success message
  if (warnings.length === 0) {
      console.log('✅ Configuration validation passed');
  }
}
