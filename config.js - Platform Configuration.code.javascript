// ============================================
// SESMine Platform - Configuration System
// Smart Engineering Solutions for Mining
// ============================================

// Platform Configuration
window.SESMineConfig = {
  // Application Settings
  app: {
      name: 'SESMine',
      version: '2.0.0',
      environment: 'production', // development, staging, production
      debug: false,
      apiUrl: 'https://api.sesmine.com', // Replace with your API URL
      supportEmail: 'support@sesmine.com',
      adminEmail: 'admin@sesmine.com'
  },

  // EmailJS Configuration
  emailjs: {
      serviceId: 'YOUR_SERVICE_ID', // Replace with your EmailJS Service ID
      userId: 'YOUR_USER_ID', // Replace with your EmailJS User ID
      templates: {
          registration: 'template_registration',
          approval: 'template_approval',
          rejection: 'template_rejection',
          welcome: 'template_welcome',
          passwordReset: 'template_password_reset',
          upgrade: 'template_upgrade',
          adminNotification: 'template_admin_notification'
      }
  },

  // Access Level Configuration
  accessLevels: {
      basic: {
          name: 'Basic User',
          level: 1,
          features: [
              'basic_cost_estimation',
              'equipment_database_view',
              'basic_reports',
              'community_access'
          ],
          limitations: {
              projectsPerMonth: 5,
              exportLimit: 10,
              storageLimit: '100MB'
          },
          price: {
              monthly: 29,
              yearly: 290
          },
          color: '#3182ce',
          icon: 'fas fa-user'
      },
      professional: {
          name: 'Professional',
          level: 2,
          features: [
              'advanced_cost_estimation',
              'full_equipment_database',
              'advanced_analytics',
              'custom_reports',
              'api_access',
              'priority_support',
              'collaboration_tools'
          ],
          limitations: {
              projectsPerMonth: 50,
              exportLimit: 100,
              storageLimit: '1GB'
          },
          price: {
              monthly: 99,
              yearly: 990
          },
          color: '#5c6b50',
          icon: 'fas fa-user-tie'
      },
      enterprise: {
          name: 'Enterprise',
          level: 3,
          features: [
              'unlimited_projects',
              'custom_integrations',
              'white_label_options',
              'dedicated_support',
              'advanced_security',
              'custom_workflows',
              'admin_controls',
              'bulk_operations',
              'advanced_permissions'
          ],
          limitations: {
              projectsPerMonth: -1, // Unlimited
              exportLimit: -1, // Unlimited
              storageLimit: 'Unlimited'
          },
          price: {
              monthly: 299,
              yearly: 2990
          },
          color: '#1a1a1a',
          icon: 'fas fa-building'
      }
  },

  // Feature Permissions Matrix
  permissions: {
      // Engineering Hub Permissions
      engineering: {
          basic: ['view_equipment', 'basic_estimation'],
          professional: ['view_equipment', 'basic_estimation', 'advanced_estimation', 'custom_equipment'],
          enterprise: ['view_equipment', 'basic_estimation', 'advanced_estimation', 'custom_equipment', 'bulk_operations', 'admin_controls']
      },
      
      // Analytics Platform Permissions
      analytics: {
          basic: ['basic_charts', 'standard_reports'],
          professional: ['basic_charts', 'standard_reports', 'advanced_analytics', 'custom_dashboards'],
          enterprise: ['basic_charts', 'standard_reports', 'advanced_analytics', 'custom_dashboards', 'predictive_analytics', 'data_export']
      },
      
      // Economics Hub Permissions
      economics: {
          basic: ['basic_financial_models'],
          professional: ['basic_financial_models', 'advanced_modeling', 'scenario_analysis'],
          enterprise: ['basic_financial_models', 'advanced_modeling', 'scenario_analysis', 'custom_models', 'risk_analysis']
      },
      
      // Procurement Hub Permissions
      procurement: {
          basic: ['supplier_directory'],
          professional: ['supplier_directory', 'rfq_management', 'vendor_comparison'],
          enterprise: ['supplier_directory', 'rfq_management', 'vendor_comparison', 'contract_management', 'supplier_integration']
      },
      
      // Consulting Hub Permissions
      consulting: {
          basic: ['knowledge_base'],
          professional: ['knowledge_base', 'expert_consultation', 'project_review'],
          enterprise: ['knowledge_base', 'expert_consultation', 'project_review', 'dedicated_consultant', 'custom_analysis']
      },
      
      // Innovation Hub Permissions
      innovation: {
          basic: ['technology_updates'],
          professional: ['technology_updates', 'trend_analysis', 'innovation_reports'],
          enterprise: ['technology_updates', 'trend_analysis', 'innovation_reports', 'custom_research', 'early_access']
      },
      
      // Training Hub Permissions
      training: {
          basic: ['basic_courses'],
          professional: ['basic_courses', 'advanced_courses', 'certifications'],
          enterprise: ['basic_courses', 'advanced_courses', 'certifications', 'custom_training', 'group_training']
      }
  },

  // UI Theme Configuration
  theme: {
      colors: {
          primary: {
              dark: '#1a1a1a',
              light: '#f4f4f2'
          },
          accent: {
              primary: '#5c6b50',
              secondary: '#8c9a8c',
              blue: '#3182ce',
              success: '#38a169',
              warning: '#dd6b20',
              error: '#e53e3e',
              gold: '#d69e2e'
          },
          access: {
              basic: '#3182ce',
              professional: '#5c6b50',
              enterprise: '#1a1a1a'
          }
      },
      gradients: {
          primary: 'linear-gradient(135deg, #1a1a1a 0%, #5c6b50 50%, #3182ce 100%)',
          accent: 'linear-gradient(135deg, #5c6b50 0%, #8c9a8c 100%)',
          hero: 'linear-gradient(135deg, rgba(26, 26, 26, 0.95) 0%, rgba(92, 107, 80, 0.8) 50%, rgba(49, 130, 206, 0.7) 100%)'
      }
  },

  // Security Configuration
  security: {
      sessionTimeout: 3600000, // 1 hour in milliseconds
      maxLoginAttempts: 5,
      lockoutDuration: 900000, // 15 minutes in milliseconds
      passwordRequirements: {
          minLength: 8,
          requireUppercase: true,
          requireLowercase: true,
          requireNumbers: true,
          requireSpecialChars: true
      },
      encryptionKey: 'sesmine-2024-secure-key' // Change in production
  },

  // Data Storage Configuration
  storage: {
      prefix: 'sesmine_',
      keys: {
          user: 'user_data',
          session: 'session_data',
          preferences: 'user_preferences',
          registrations: 'registrations',
          adminSettings: 'admin_settings',
          backups: 'data_backups'
      },
      backup: {
          enabled: true,
          frequency: 'daily', // daily, weekly, monthly
          retention: 30 // days
      }
  },

  // Analytics Configuration
  analytics: {
      enabled: true,
      trackingId: 'UA-XXXXXXXXX-X', // Replace with your Google Analytics ID
      events: {
          registration: 'user_registration',
          login: 'user_login',
          featureUsage: 'feature_usage',
          exportData: 'data_export',
          upgradeRequest: 'upgrade_request'
      }
  },

  // Notification Configuration
  notifications: {
      position: 'top-right',
      duration: 5000,
      maxVisible: 3,
      types: {
          info: { icon: 'fas fa-info-circle', color: '#3182ce' },
          success: { icon: 'fas fa-check-circle', color: '#38a169' },
          warning: { icon: 'fas fa-exclamation-triangle', color: '#dd6b20' },
          error: { icon: 'fas fa-times-circle', color: '#e53e3e' }
      }
  },

  // API Endpoints
  api: {
      auth: {
          login: '/auth/login',
          logout: '/auth/logout',
          register: '/auth/register',
          resetPassword: '/auth/reset-password',
          verifyToken: '/auth/verify-token'
      },
      users: {
          profile: '/users/profile',
          update: '/users/update',
          delete: '/users/delete',
          upgrade: '/users/upgrade'
      },
      admin: {
          registrations: '/admin/registrations',
          users: '/admin/users',
          analytics: '/admin/analytics',
          settings: '/admin/settings'
      },
      data: {
          export: '/data/export',
          import: '/data/import',
          backup: '/data/backup'
      }
  },

  // Feature Flags
  features: {
      enableRegistration: true,
      enableSocialLogin: false,
      enableTwoFactor: false,
      enableDataExport: true,
      enableAnalytics: true,
      enableNotifications: true,
      enableBackups: true,
      enableApiAccess: true,
      enableWhiteLabel: false,
      enableCustomIntegrations: false
  },

  // Development Settings
  development: {
      mockData: true,
      debugMode: false,
      skipEmailVerification: false,
      autoLogin: false,
      showDevTools: false
  }
};

// Utility Functions
window.SESMineConfig.utils = {
  // Get user access level configuration
  getAccessLevel: function(level) {
      return this.accessLevels[level] || this.accessLevels.basic;
  },

  // Check if user has permission for a feature
  hasPermission: function(userLevel, hub, permission) {
      const hubPermissions = this.permissions[hub];
      if (!hubPermissions || !hubPermissions[userLevel]) return false;
      return hubPermissions[userLevel].includes(permission);
  },

  // Get feature limitations for user level
  getLimitations: function(level) {
      const accessLevel = this.getAccessLevel(level);
      return accessLevel.limitations;
  },

  // Check if feature is enabled
  isFeatureEnabled: function(feature) {
      return this.features[feature] === true;
  },

  // Get storage key with prefix
  getStorageKey: function(key) {
      return this.storage.prefix + key;
  },

  // Get theme color
  getThemeColor: function(type, variant = 'primary') {
      if (this.theme.colors[type]) {
          return this.theme.colors[type][variant] || this.theme.colors[type];
      }
      return this.theme.colors.primary.dark;
  },

  // Format currency
  formatCurrency: function(amount, currency = 'USD') {
      return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: currency
      }).format(amount);
  },

  // Generate unique ID
  generateId: function() {
      return Date.now().toString(36) + Math.random().toString(36).substr(2);
  },

  // Validate email format
  isValidEmail: function(email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
  },

  // Validate password strength
  validatePassword: function(password) {
      const requirements = this.security.passwordRequirements;
      const errors = [];

      if (password.length < requirements.minLength) {
          errors.push(`Password must be at least ${requirements.minLength} characters long`);
      }
      if (requirements.requireUppercase && !/[A-Z]/.test(password)) {
          errors.push('Password must contain at least one uppercase letter');
      }
      if (requirements.requireLowercase && !/[a-z]/.test(password)) {
          errors.push('Password must contain at least one lowercase letter');
      }
      if (requirements.requireNumbers && !/\d/.test(password)) {
          errors.push('Password must contain at least one number');
      }
      if (requirements.requireSpecialChars && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
          errors.push('Password must contain at least one special character');
      }

      return {
          isValid: errors.length === 0,
          errors: errors
      };
  }
};

// Initialize configuration
console.log('🏔️ SESMine Configuration System Loaded');
console.log(`📊 Version: ${window.SESMineConfig.app.version}`);
console.log(`🌍 Environment: ${window.SESMineConfig.app.environment}`);
console.log('✅ Configuration ready for platform initialization');