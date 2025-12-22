// ============================================
// SES_Mine - Complete JavaScript
// Smart Engineering Solutions for Mining
// ============================================

document.addEventListener('DOMContentLoaded', function() {
  initializeSESMinePlatform();
});

// Main initialization function
function initializeSESMinePlatform() {
  console.log('🏔️ Initializing SESMine Platform...');
  
  // Initialize core components
  initializeUniversalNavigation();
  initializeGlobalSearch();
  initializeMobileMenu();
  initializeDropdowns();
  initializeNotificationSystem();
  initializeLocalStorage();
  initializePerformanceMonitoring();
  
  // Platform-specific initializations
  setActiveNavigation();
  loadUserPreferences();
  checkAuthentication();
  
  console.log('✅ SESMine Platform Initialized Successfully');
  console.log('📧 Contact: www.sesmine.com');
  console.log('🚀 Version: 2.1.0');
}

// Universal Navigation System
function initializeUniversalNavigation() {
  // Set active navigation link based on current page
  setActiveNavigation();
  
  // Handle navigation clicks
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
      link.addEventListener('click', function(e) {
          // Don't prevent default for external links
          if (this.href && !this.href.includes('#')) {
              showLoadingIndicator();
          }
      });
  });
}

function setActiveNavigation() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-link, .dropdown-item');
  
  navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href && (href === currentPage || href.includes(currentPage))) {
          link.classList.add('active');
          
          // Also mark parent dropdown as active
          const parentDropdown = link.closest('.nav-dropdown');
          if (parentDropdown) {
              const dropdownToggle = parentDropdown.querySelector('.dropdown-toggle');
              if (dropdownToggle) {
                  dropdownToggle.classList.add('active');
              }
          }
      }
  });
}

// Global Search System
function initializeGlobalSearch() {
  const searchInput = document.getElementById('globalSearch');
  if (searchInput) {
      searchInput.addEventListener('input', debounce(function(e) {
          performGlobalSearch(e.target.value);
      }, 300));
      
      // Keyboard shortcut: Ctrl/Cmd + K
      document.addEventListener('keydown', function(e) {
          if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
              e.preventDefault();
              searchInput.focus();
              searchInput.select();
          }
      });
      
      // Search on Enter
      searchInput.addEventListener('keydown', function(e) {
          if (e.key === 'Enter') {
              e.preventDefault();
              performGlobalSearch(this.value);
          }
      });
  }
}

function performGlobalSearch(query) {
  if (!query.trim()) return;
  
  console.log('🔍 Searching for:', query);
  
  // Define searchable content
  const searchablePages = {
      'engineering-hub.html': {
          title: 'Engineering Hub',
          keywords: ['engineering', 'cost estimation', 'AACE', 'project management', 'technical analysis', 'equipment database'],
          icon: '⛑️'
      },
      'analytics-platform.html': {
          title: 'Analytics Platform',
          keywords: ['analytics', 'data visualization', 'real-time', 'predictive modeling', 'monitoring', 'charts'],
          icon: '📊'
      },
      'economics-hub.html': {
          title: 'Economics Hub',
          keywords: ['economics', 'financial modeling', 'market intelligence', 'investment analysis', 'economics'],
          icon: '💰'
      },
      'innovation-technology-hub.html': {
          title: 'Innovation & Technology Hub',
          keywords: ['innovation', 'technology', 'digital solutions', 'R&D', 'tech integration'],
          icon: '🚀'
      },
      'procurement-hub.html': {
          title: 'Procurement Hub',
          keywords: ['procurement', 'supplier management', 'supply chain', 'contract management', 'logistics'],
          icon: '🚛'
      },
      'consulting-hub.html': {
          title: 'Consulting Hub',
          keywords: ['consulting', 'expert advice', 'strategic advisory', 'professional services'],
          icon: '👔'
      },
      'training-education-hub.html': {
          title: 'Training & Education Hub',
          keywords: ['training', 'education', 'certification', 'skills development', 'learning'],
          icon: '🎓'
      },
      'admin-dashboard.html': {
          title: 'Admin Dashboard',
          keywords: ['admin', 'administration', 'user management', 'system', 'security'],
          icon: '🛡️'
      }
  };
  
  // Perform search
  const results = [];
  const searchTerm = query.toLowerCase();
  
  Object.keys(searchablePages).forEach(page => {
      const pageData = searchablePages[page];
      const titleMatch = pageData.title.toLowerCase().includes(searchTerm);
      const keywordMatch = pageData.keywords.some(keyword => 
          keyword.toLowerCase().includes(searchTerm) || searchTerm.includes(keyword.toLowerCase())
      );
      
      if (titleMatch || keywordMatch) {
          results.push({
              page: page,
              title: pageData.title,
              icon: pageData.icon,
              relevance: titleMatch ? 2 : 1
          });
      }
  });
  
  // Sort by relevance
  results.sort((a, b) => b.relevance - a.relevance);
  
  if (results.length > 0) {
      showSearchResults(results, query);
  } else {
      showNotification(`❌ No results found for "${query}"`, 'warning');
  }
}

function showSearchResults(results, query) {
  // Create search results modal or redirect to first result
  if (results.length === 1) {
      showNotification(`${results[0].icon} Navigating to ${results[0].title}`, 'success');
      setTimeout(() => {
          window.location.href = results[0].page;
      }, 1000);
  } else {
      showNotification(`🔍 Found ${results.length} results for "${query}"`, 'info');
      
      // Show results in a dropdown or modal
      displaySearchDropdown(results);
  }
}

function displaySearchDropdown(results) {
  // Remove existing dropdown
  const existingDropdown = document.getElementById('searchResults');
  if (existingDropdown) {
      existingDropdown.remove();
  }
  
  // Create new dropdown
  const dropdown = document.createElement('div');
  dropdown.id = 'searchResults';
  dropdown.style.cssText = `
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      background: white;
      border-radius: 12px;
      box-shadow: 0 10px 40px rgba(0,0,0,0.15);
      z-index: 1002;
      max-height: 300px;
      overflow-y: auto;
      border: 1px solid #e2e8f0;
  `;
  
  results.forEach((result, index) => {
      const item = document.createElement('a');
      item.href = result.page;
      item.style.cssText = `
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 1rem;
          color: #2d3748;
          text-decoration: none;
          transition: all 0.3s ease;
          border-bottom: ${index < results.length - 1 ? '1px solid #e2e8f0' : 'none'};
      `;
      
      item.innerHTML = `
          <span style="font-size: 1.2rem;">${result.icon}</span>
          <span style="font-weight: 600;">${result.title}</span>
      `;
      
      item.addEventListener('mouseenter', function() {
          this.style.background = '#f7fafc';
      });
      
      item.addEventListener('mouseleave', function() {
          this.style.background = 'transparent';
      });
      
      dropdown.appendChild(item);
  });
  
  // Add to search container
  const searchContainer = document.querySelector('.search-container');
  if (searchContainer) {
      searchContainer.style.position = 'relative';
      searchContainer.appendChild(dropdown);
      
      // Remove dropdown when clicking outside
      setTimeout(() => {
          document.addEventListener('click', function(e) {
              if (!searchContainer.contains(e.target)) {
                  dropdown.remove();
              }
          }, { once: true });
      }, 100);
  }
}

// Mobile Menu System
function initializeMobileMenu() {
  const mobileToggle = document.getElementById('mobileMenuToggle');
  const mainNav = document.getElementById('mainNav');
  
  if (mobileToggle && mainNav) {
      mobileToggle.addEventListener('click', function() {
          mainNav.classList.toggle('mobile-open');
          document.body.classList.toggle('mobile-menu-open');
          
          // Update toggle icon
          const icon = this.querySelector('i');
          if (icon) {
              icon.classList.toggle('fa-bars');
              icon.classList.toggle('fa-times');
          }
      });
      
      // Close mobile menu when clicking on a link
      const mobileLinks = mainNav.querySelectorAll('a');
      mobileLinks.forEach(link => {
          link.addEventListener('click', function() {
              mainNav.classList.remove('mobile-open');
              document.body.classList.remove('mobile-menu-open');
              
              const icon = mobileToggle.querySelector('i');
              if (icon) {
                  icon.classList.add('fa-bars');
                  icon.classList.remove('fa-times');
              }
          });
      });
  }
}

// Dropdown System
function initializeDropdowns() {
  const dropdowns = document.querySelectorAll('.nav-dropdown');
  
  dropdowns.forEach(dropdown => {
      const toggle = dropdown.querySelector('.dropdown-toggle');
      const menu = dropdown.querySelector('.dropdown-menu');
      
      if (toggle && menu) {
          // Click to toggle on mobile
          toggle.addEventListener('click', function(e) {
              if (window.innerWidth <= 1024) {
                  e.preventDefault();
                  menu.classList.toggle('show');
              }
          });
      }
  });
}

// Notification System
function initializeNotificationSystem() {
  // Create notification container if it doesn't exist
  if (!document.getElementById('notificationContainer')) {
      const container = document.createElement('div');
      container.id = 'notificationContainer';
      container.style.cssText = `
          position: fixed;
          top: 100px;
          right: 2rem;
          z-index: 2000;
          pointer-events: none;
      `;
      document.body.appendChild(container);
  }
}

function showNotification(message, type = 'info', duration = 4000) {
  const container = document.getElementById('notificationContainer');
  if (!container) return;
  
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  
  const icons = {
      success: '✅',
      error: '❌',
      warning: '⚠️',
      info: 'ℹ️'
  };
  
  const colors = {
      success: '#38a169',
      error: '#ef4444',
      warning: '#d69e2e',
      info: '#3182ce'
  };
  
  notification.innerHTML = `
      <div style="display: flex; align-items: center; gap: 1rem;">
          <span style="font-size: 1.2rem;">${icons[type]}</span>
          <div>
              <div style="font-weight: 600; color: #1a202c;">SESMine ${type.charAt(0).toUpperCase() + type.slice(1)}</div>
              <div style="color: #4a5568; font-size: 0.9rem;">${message}</div>
          </div>
      </div>
  `;
  
  notification.style.cssText = `
      background: white;
      border-radius: 12px;
      padding: 1rem 1.5rem;
      box-shadow: 0 10px 40px rgba(0,0,0,0.15);
      border-left: 4px solid ${colors[type]};
      margin-bottom: 1rem;
      transform: translateX(100%);
      transition: all 0.3s ease;
      min-width: 320px;
      max-width: 420px;
      border: 1px solid #e2e8f0;
      pointer-events: auto;
      cursor: pointer;
  `;
  
  // Add click to dismiss
  notification.addEventListener('click', function() {
      dismissNotification(notification);
  });
  
  container.appendChild(notification);
  
  // Animate in
  setTimeout(() => {
      notification.style.transform = 'translateX(0)';
  }, 100);
  
  // Auto dismiss
  setTimeout(() => {
      dismissNotification(notification);
  }, duration);
}

function dismissNotification(notification) {
  notification.style.transform = 'translateX(100%)';
  notification.style.opacity = '0';
  setTimeout(() => {
      if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
      }
  }, 300);
}

// Local Storage Management
function initializeLocalStorage() {
  // Initialize user preferences
  if (!localStorage.getItem('sesmine_preferences')) {
      const defaultPreferences = {
          theme: 'light',
          language: 'en',
          notifications: true,
          autoSave: true,
          lastVisited: new Date().toISOString()
      };
      localStorage.setItem('sesmine_preferences', JSON.stringify(defaultPreferences));
  }
  
  // Initialize session data
  if (!sessionStorage.getItem('sesmine_session')) {
      const sessionData = {
          sessionId: generateSessionId(),
          startTime: new Date().toISOString(),
          pageViews: []
      };
      sessionStorage.setItem('sesmine_session', JSON.stringify(sessionData));
  }
  
  // Track page view
  trackPageView();
}

function loadUserPreferences() {
  try {
      const preferences = JSON.parse(localStorage.getItem('sesmine_preferences') || '{}');
      
      // Apply theme
      if (preferences.theme === 'dark') {
          document.body.classList.add('dark-theme');
      }
      
      // Apply other preferences
      console.log('👤 User preferences loaded:', preferences);
      
  } catch (error) {
      console.error('❌ Error loading user preferences:', error);
  }
}

function saveUserPreference(key, value) {
  try {
      const preferences = JSON.parse(localStorage.getItem('sesmine_preferences') || '{}');
      preferences[key] = value;
      preferences.lastUpdated = new Date().toISOString();
      localStorage.setItem('sesmine_preferences', JSON.stringify(preferences));
      
      console.log(`💾 Saved preference: ${key} = ${value}`);
  } catch (error) {
      console.error('❌ Error saving user preference:', error);
  }
}

// Authentication System
function checkAuthentication() {
  const currentPage = window.location.pathname.split('/').pop();
  const publicPages = ['index.html', 'login.html', 'signup.html', 'about.html', 'contact.html'];
  
  // Check if user is authenticated
  const isAuthenticated = localStorage.getItem('sesmine_auth_token');
  
  if (!isAuthenticated && !publicPages.includes(currentPage)) {
      // Redirect to login for protected pages
      console.log('🔒 Authentication required, redirecting to login...');
      setTimeout(() => {
          window.location.href = 'login.html?redirect=' + encodeURIComponent(currentPage);
      }, 1000);
      return false;
  }
  
  return true;
}

function setAuthToken(token) {
  localStorage.setItem('sesmine_auth_token', token);
  localStorage.setItem('sesmine_auth_time', new Date().toISOString());
}

function clearAuthToken() {
  localStorage.removeItem('sesmine_auth_token');
  localStorage.removeItem('sesmine_auth_time');
  localStorage.removeItem('sesmine_user_data');
}

function logout() {
  clearAuthToken();
  showNotification('👋 Logged out successfully', 'success');
  setTimeout(() => {
      window.location.href = 'login.html';
  }, 1000);
}

// Performance Monitoring
function initializePerformanceMonitoring() {
  // Monitor page load time
  window.addEventListener('load', function() {
      const loadTime = performance.now();
      console.log(`⚡ Page loaded in ${loadTime.toFixed(2)}ms`);
      
      // Track performance
      trackPerformance('page_load', loadTime);
  });
  
  // Monitor errors
  window.addEventListener('error', function(e) {
      console.error('❌ JavaScript Error:', e.error);
      trackError(e.error);
  });
  
  // Monitor unhandled promise rejections
  window.addEventListener('unhandledrejection', function(e) {
      console.error('❌ Unhandled Promise Rejection:', e.reason);
      trackError(e.reason);
  });
}

function trackPerformance(metric, value) {
  try {
      const performanceData = JSON.parse(localStorage.getItem('sesmine_performance') || '[]');
      performanceData.push({
          metric: metric,
          value: value,
          timestamp: new Date().toISOString(),
          page: window.location.pathname
      });
      
      // Keep only last 100 entries
      if (performanceData.length > 100) {
          performanceData.splice(0, performanceData.length - 100);
      }
      
      localStorage.setItem('sesmine_performance', JSON.stringify(performanceData));
  } catch (error) {
      console.error('❌ Error tracking performance:', error);
  }
}

function trackError(error) {
  try {
      const errorData = JSON.parse(localStorage.getItem('sesmine_errors') || '[]');
      errorData.push({
          message: error.message || error.toString(),
          stack: error.stack || '',
          timestamp: new Date().toISOString(),
          page: window.location.pathname,
          userAgent: navigator.userAgent
      });
      
      // Keep only last 50 errors
      if (errorData.length > 50) {
          errorData.splice(0, errorData.length - 50);
      }
      
      localStorage.setItem('sesmine_errors', JSON.stringify(errorData));
  } catch (err) {
      console.error('❌ Error tracking error:', err);
  }
}

// Utility Functions
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
      const later = () => {
          clearTimeout(timeout);
          func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
  };
}

function throttle(func, limit) {
  let inThrottle;
  return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
          func.apply(context, args);
          inThrottle = true;
          setTimeout(() => inThrottle = false, limit);
      }
  };
}

function generateSessionId() {
  return 'sesmine_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

function trackPageView() {
  try {
      const sessionData = JSON.parse(sessionStorage.getItem('sesmine_session') || '{}');
      if (sessionData.pageViews) {
          sessionData.pageViews.push({
              page: window.location.pathname,
              timestamp: new Date().toISOString(),
              title: document.title
          });
          sessionStorage.setItem('sesmine_session', JSON.stringify(sessionData));
      }
  } catch (error) {
      console.error('❌ Error tracking page view:', error);
  }
}

function showLoadingIndicator() {
  // Create loading overlay
  const loading = document.createElement('div');
  loading.id = 'loadingOverlay';
  loading.innerHTML = `
      <div style="display: flex; flex-direction: column; align-items: center; gap: 1rem;">
          <div style="width: 40px; height: 40px; border: 4px solid rgba(255,255,255,0.3); border-top: 4px solid white; border-radius: 50%; animation: spin 1s linear infinite;"></div>
          <div style="color: white; font-weight: 600;">Loading SESMine Platform...</div>
      </div>
  `;
  loading.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(26, 54, 93, 0.9);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9999;
      backdrop-filter: blur(5px);
  `;
  
  document.body.appendChild(loading);
  
  // Remove after 3 seconds (fallback)
  setTimeout(() => {
      if (document.getElementById('loadingOverlay')) {
          document.getElementById('loadingOverlay').remove();
      }
  }, 3000);
}

// Global Navigation Function
window.navigateToPage = function(pageId) {
  const pageRoutes = {
      'dashboard': 'home.html',
      'home': 'home.html',
      'login': 'login.html',
      'signup': 'signup.html',
      'engineering': 'engineering-hub.html',
      'analytics': 'analytics-platform.html',
      'economics': 'economics-hub.html',
      'innovation': 'innovation-technology-hub.html',
      'procurement': 'procurement-hub.html',
      'consulting': 'consulting-hub.html',
      'training': 'training-education-hub.html',
      'admin': 'admin-dashboard.html',
      'platforms': 'platforms.html',
      'features': 'features.html',
      'about': 'about.html',
      'contact': 'contact.html',
      'settings': 'setting.html'
  };
  
  if (pageRoutes[pageId]) {
      showLoadingIndicator();
      setTimeout(() => {
          window.location.href = pageRoutes[pageId];
      }, 500);
  } else {
      console.error('❌ Unknown page ID:', pageId);
      showNotification('❌ Page not found', 'error');
  }
};

// Export global functions
window.SESMine = {
  navigateToPage: window.navigateToPage,
  showNotification: showNotification,
  logout: logout,
  saveUserPreference: saveUserPreference,
  version: '2.1.0',
  buildDate: '2025-12-20'
};

// Initialize platform when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeSESMinePlatform);
} else {
  initializeSESMinePlatform();
}



// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
  @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
  }
  
  @keyframes fadeIn {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
  }
  
  @keyframes slideIn {
      from { transform: translateX(-100%); }
      to { transform: translateX(0); }
  }
  
  @keyframes bounce {
      0%, 20%, 53%, 80%, 100% { transform: translate3d(0,0,0); }
      40%, 43% { transform: translate3d(0,-30px,0); }
      70% { transform: translate3d(0,-15px,0); }
      90% { transform: translate3d(0,-4px,0); }
  }
  
  .mobile-menu-open .main-nav {
      display: flex;
      flex-direction: column;
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      background: white;
      box-shadow: 0 10px 40px rgba(0,0,0,0.15);
      border-radius: 0 0 12px 12px;
      padding: 1rem;
      z-index: 1001;
      animation: slideIn 0.3s ease;
  }
  
  .mobile-menu-open .nav-link {
      color: #2d3748;
      padding: 0.75rem;
      border-radius: 8px;
      margin-bottom: 0.5rem;
  }
  
  .mobile-menu-open .nav-link:hover {
      background: #f7fafc;
      color: #1a365d;
  }
  
  .mobile-menu-open .dropdown-menu.show {
      position: static;
      opacity: 1;
      visibility: visible;
      transform: none;
      box-shadow: none;
      background: #f7fafc;
      margin: 0.5rem 0;
      border-radius: 8px;
  }
  
  .notification {
      animation: slideIn 0.3s ease;
  }
  
  .fade-in {
      animation: fadeIn 0.5s ease;
  }
  
  .bounce {
      animation: bounce 2s infinite;
  }
`;
document.head.appendChild(style);

// Advanced Features
class SESMineAdvanced {
  constructor() {
      this.features = {
          autoSave: true,
          notifications: true,
          analytics: true,
          darkMode: false
      };
      this.init();
  }
  
  init() {
      this.loadFeatures();
      this.bindEvents();
  }
  
  loadFeatures() {
      try {
          const saved = localStorage.getItem('sesmine_advanced_features');
          if (saved) {
              this.features = { ...this.features, ...JSON.parse(saved) };
          }
      } catch (error) {
          console.error('❌ Error loading advanced features:', error);
      }
  }
  
  saveFeatures() {
      try {
          localStorage.setItem('sesmine_advanced_features', JSON.stringify(this.features));
      } catch (error) {
          console.error('❌ Error saving advanced features:', error);
      }
  }
  
  bindEvents() {
      // Auto-save functionality
      if (this.features.autoSave) {
          this.initAutoSave();
      }
      
      // Dark mode toggle
      this.initDarkMode();
      
      // Keyboard shortcuts
      this.initKeyboardShortcuts();
  }
  
  initAutoSave() {
      const forms = document.querySelectorAll('form');
      forms.forEach(form => {
          const inputs = form.querySelectorAll('input, textarea, select');
          inputs.forEach(input => {
              input.addEventListener('input', debounce(() => {
                  this.autoSaveFormData(form);
              }, 1000));
          });
      });
  }
  
  autoSaveFormData(form) {
      try {
          const formData = new FormData(form);
          const data = Object.fromEntries(formData);
          const formId = form.id || 'unnamed_form';
          
          localStorage.setItem(`sesmine_autosave_${formId}`, JSON.stringify({
              data: data,
              timestamp: new Date().toISOString()
          }));
          
          console.log('💾 Auto-saved form data:', formId);
      } catch (error) {
          console.error('❌ Error auto-saving form:', error);
      }
  }
  
  restoreFormData(formId) {
      try {
          const saved = localStorage.getItem(`sesmine_autosave_${formId}`);
          if (saved) {
              const { data, timestamp } = JSON.parse(saved);
              const form = document.getElementById(formId);
              
              if (form) {
                  Object.keys(data).forEach(key => {
                      const input = form.querySelector(`[name="${key}"]`);
                      if (input) {
                          input.value = data[key];
                      }
                  });
                  
                  showNotification(`📄 Restored form data from ${new Date(timestamp).toLocaleString()}`, 'info');
              }
          }
      } catch (error) {
          console.error('❌ Error restoring form data:', error);
      }
  }
  
  initDarkMode() {
      if (this.features.darkMode) {
          document.body.classList.add('dark-theme');
      }
  }
  
  toggleDarkMode() {
      this.features.darkMode = !this.features.darkMode;
      document.body.classList.toggle('dark-theme');
      this.saveFeatures();
      
      showNotification(
          `🌙 ${this.features.darkMode ? 'Dark' : 'Light'} mode enabled`, 
          'info'
      );
  }
  
  initKeyboardShortcuts() {
      document.addEventListener('keydown', (e) => {
          // Ctrl/Cmd + Shift + D: Toggle dark mode
          if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'D') {
              e.preventDefault();
              this.toggleDarkMode();
          }
          
          // Ctrl/Cmd + Shift + N: Toggle notifications
          if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'N') {
              e.preventDefault();
              this.toggleNotifications();
          }
          
          // Ctrl/Cmd + Shift + H: Go to home
          if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'H') {
              e.preventDefault();
              window.location.href = 'home.html';
          }
          
          // ESC: Close modals/dropdowns
          if (e.key === 'Escape') {
              this.closeAllModals();
          }
      });
  }
  
  toggleNotifications() {
      this.features.notifications = !this.features.notifications;
      this.saveFeatures();
      
      showNotification(
          `🔔 Notifications ${this.features.notifications ? 'enabled' : 'disabled'}`, 
          'info'
      );
  }
  
  closeAllModals() {
      // Close search dropdown
      const searchResults = document.getElementById('searchResults');
      if (searchResults) {
          searchResults.remove();
      }
      
      // Close mobile menu
      const mainNav = document.getElementById('mainNav');
      if (mainNav && mainNav.classList.contains('mobile-open')) {
          mainNav.classList.remove('mobile-open');
          document.body.classList.remove('mobile-menu-open');
      }
      
      // Close any custom modals
      const modals = document.querySelectorAll('.modal.show');
      modals.forEach(modal => {
          modal.classList.remove('show');
      });
  }
}

// Initialize advanced features
const sesmineAdvanced = new SESMineAdvanced();

// Data Management System
class SESMineDataManager {
  constructor() {
      this.cache = new Map();
      this.init();
  }
  
  init() {
      this.loadCachedData();
      this.setupCacheCleanup();
  }
  
  loadCachedData() {
      try {
          const cached = localStorage.getItem('sesmine_cache');
          if (cached) {
              const data = JSON.parse(cached);
              Object.keys(data).forEach(key => {
                  this.cache.set(key, data[key]);
              });
          }
      } catch (error) {
          console.error('❌ Error loading cached data:', error);
      }
  }
  
  saveCachedData() {
      try {
          const data = Object.fromEntries(this.cache);
          localStorage.setItem('sesmine_cache', JSON.stringify(data));
      } catch (error) {
          console.error('❌ Error saving cached data:', error);
      }
  }
  
  set(key, value, ttl = 3600000) { // Default TTL: 1 hour
      this.cache.set(key, {
          value: value,
          timestamp: Date.now(),
          ttl: ttl
      });
      this.saveCachedData();
  }
  
  get(key) {
      const item = this.cache.get(key);
      if (!item) return null;
      
      // Check if expired
      if (Date.now() - item.timestamp > item.ttl) {
          this.cache.delete(key);
          this.saveCachedData();
          return null;
      }
      
      return item.value;
  }
  
  delete(key) {
      this.cache.delete(key);
      this.saveCachedData();
  }
  
  clear() {
      this.cache.clear();
      localStorage.removeItem('sesmine_cache');
  }
  
  setupCacheCleanup() {
      // Clean expired items every 5 minutes
      setInterval(() => {
          this.cleanExpiredItems();
      }, 300000);
  }
  
  cleanExpiredItems() {
      let cleaned = 0;
      for (const [key, item] of this.cache.entries()) {
          if (Date.now() - item.timestamp > item.ttl) {
              this.cache.delete(key);
              cleaned++;
          }
      }
      
      if (cleaned > 0) {
          this.saveCachedData();
          console.log(`🧹 Cleaned ${cleaned} expired cache items`);
      }
  }
}

// Initialize data manager
const dataManager = new SESMineDataManager();

// Analytics System
class SESMineAnalytics {
  constructor() {
      this.events = [];
      this.init();
  }
  
  init() {
      this.loadEvents();
      this.startSession();
      this.bindEvents();
  }
  
  loadEvents() {
      try {
          const saved = localStorage.getItem('sesmine_analytics');
          if (saved) {
              this.events = JSON.parse(saved);
          }
      } catch (error) {
          console.error('❌ Error loading analytics:', error);
      }
  }
  
  saveEvents() {
      try {
          // Keep only last 1000 events
          if (this.events.length > 1000) {
              this.events = this.events.slice(-1000);
          }
          localStorage.setItem('sesmine_analytics', JSON.stringify(this.events));
      } catch (error) {
          console.error('❌ Error saving analytics:', error);
      }
  }
  
  track(event, data = {}) {
      const eventData = {
          event: event,
          data: data,
          timestamp: new Date().toISOString(),
          page: window.location.pathname,
          sessionId: this.getSessionId(),
          userId: this.getUserId()
      };
      
      this.events.push(eventData);
      this.saveEvents();
      
      console.log('📊 Analytics event:', event, data);
  }
  
  startSession() {
      const sessionId = this.getSessionId();
      this.track('session_start', {
          sessionId: sessionId,
          userAgent: navigator.userAgent,
          referrer: document.referrer,
          viewport: {
              width: window.innerWidth,
              height: window.innerHeight
          }
      });
  }
  
  getSessionId() {
      let sessionId = sessionStorage.getItem('sesmine_session_id');
      if (!sessionId) {
          sessionId = 'sess_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
          sessionStorage.setItem('sesmine_session_id', sessionId);
      }
      return sessionId;
  }
  
  getUserId() {
      let userId = localStorage.getItem('sesmine_user_id');
      if (!userId) {
          userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
          localStorage.setItem('sesmine_user_id', userId);
      }
      return userId;
  }
  
  bindEvents() {
      // Track page views
      this.track('page_view', {
          title: document.title,
          url: window.location.href
      });
      
      // Track clicks
      document.addEventListener('click', (e) => {
          const target = e.target.closest('a, button');
          if (target) {
              this.track('click', {
                  element: target.tagName.toLowerCase(),
                  text: target.textContent.trim().substring(0, 100),
                  href: target.href || null,
                  id: target.id || null,
                  className: target.className || null
              });
          }
      });
      
      // Track form submissions
      document.addEventListener('submit', (e) => {
          const form = e.target;
          this.track('form_submit', {
              formId: form.id || null,
              action: form.action || null,
              method: form.method || 'get'
          });
      });
      
      // Track errors
      window.addEventListener('error', (e) => {
          this.track('error', {
              message: e.message,
              filename: e.filename,
              lineno: e.lineno,
              colno: e.colno
          });
      });
      
      // Track page unload
      window.addEventListener('beforeunload', () => {
          this.track('page_unload', {
              timeOnPage: Date.now() - this.pageStartTime
          });
      });
      
      this.pageStartTime = Date.now();
  }
  
  getStats() {
      const stats = {
          totalEvents: this.events.length,
          pageViews: this.events.filter(e => e.event === 'page_view').length,
          clicks: this.events.filter(e => e.event === 'click').length,
          errors: this.events.filter(e => e.event === 'error').length,
          sessions: [...new Set(this.events.map(e => e.sessionId))].length,
          users: [...new Set(this.events.map(e => e.userId))].length
      };
      
      return stats;
  }
}

// Initialize analytics
const analytics = new SESMineAnalytics();

// Form Validation System
class SESMineValidator {
  constructor() {
      this.rules = {
          required: (value) => value.trim() !== '',
          email: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
          phone: (value) => /^[\+]?[1-9][\d]{0,15}$/.test(value),
          url: (value) => /^https?:\/\/.+/.test(value),
          minLength: (value, min) => value.length >= min,
          maxLength: (value, max) => value.length <= max,
          number: (value) => !isNaN(value) && !isNaN(parseFloat(value)),
          integer: (value) => Number.isInteger(Number(value)),
          positive: (value) => Number(value) > 0,
          range: (value, min, max) => {
              const num = Number(value);
              return num >= min && num <= max;
          }
      };
      
      this.init();
  }
  
  init() {
      this.bindEvents();
  }
  
  bindEvents() {
      document.addEventListener('submit', (e) => {
          const form = e.target;
          if (form.hasAttribute('data-validate')) {
              e.preventDefault();
              this.validateForm(form);
          }
      });
      
      // Real-time validation
      document.addEventListener('blur', (e) => {
          if (e.target.hasAttribute('data-validate')) {
              this.validateField(e.target);
          }
      }, true);
  }
  
  validateForm(form) {
      const fields = form.querySelectorAll('[data-validate]');
      let isValid = true;
      
      fields.forEach(field => {
          if (!this.validateField(field)) {
              isValid = false;
          }
      });
      
      if (isValid) {
          this.onFormValid(form);
      } else {
          this.onFormInvalid(form);
      }
      
      return isValid;
  }
  
  validateField(field) {
      const rules = field.getAttribute('data-validate').split('|');
      const value = field.value;
      let isValid = true;
      let errorMessage = '';
      
      for (const rule of rules) {
          const [ruleName, ...params] = rule.split(':');
          
          if (this.rules[ruleName]) {
              const ruleValid = this.rules[ruleName](value, ...params);
              if (!ruleValid) {
                  isValid = false;
                  errorMessage = this.getErrorMessage(ruleName, params);
                  break;
              }
          }
      }
      
      this.showFieldValidation(field, isValid, errorMessage);
      return isValid;
  }
  
  showFieldValidation(field, isValid, message) {
      // Remove existing validation
      const existingError = field.parentNode.querySelector('.validation-error');
      if (existingError) {
          existingError.remove();
      }
      
      field.classList.remove('valid', 'invalid');
      
      if (isValid) {
          field.classList.add('valid');
      } else {
          field.classList.add('invalid');
          
          // Add error message
          const errorDiv = document.createElement('div');
          errorDiv.className = 'validation-error';
          errorDiv.textContent = message;
          errorDiv.style.cssText = `
              color: #ef4444;
              font-size: 0.875rem;
              margin-top: 0.25rem;
          `;
          field.parentNode.appendChild(errorDiv);
      }
  }
  
  getErrorMessage(rule, params) {
      const messages = {
          required: 'This field is required',
          email: 'Please enter a valid email address',
          phone: 'Please enter a valid phone number',
          url: 'Please enter a valid URL',
          minLength: `Minimum length is ${params[0]} characters`,
          maxLength: `Maximum length is ${params[0]} characters`,
          number: 'Please enter a valid number',
          integer: 'Please enter a whole number',
          positive: 'Please enter a positive number',
          range: `Value must be between ${params[0]} and ${params[1]}`
      };
      
      return messages[rule] || 'Invalid input';
  }
  
  onFormValid(form) {
      analytics.track('form_valid', { formId: form.id });
      
      // Submit form or call custom handler
      if (form.hasAttribute('data-submit-handler')) {
          const handler = window[form.getAttribute('data-submit-handler')];
          if (typeof handler === 'function') {
              handler(form);
          }
      } else {
          form.submit();
      }
  }
  
  onFormInvalid(form) {
      analytics.track('form_invalid', { formId: form.id });
      showNotification('❌ Please correct the errors and try again', 'error');
  }
}

// Initialize validator
const validator = new SESMineValidator();

// Export all classes and functions to global scope
window.SESMineAdvanced = SESMineAdvanced;
window.SESMineDataManager = SESMineDataManager;
window.SESMineAnalytics = SESMineAnalytics;
window.SESMineValidator = SESMineValidator;

// Global instances
window.sesmineAdvanced = sesmineAdvanced;
window.dataManager = dataManager;
window.analytics = analytics;
window.validator = validator;

// Final initialization
console.log('🎉 SESMine Platform fully initialized with advanced features');
console.log('📊 Analytics tracking enabled');
console.log('💾 Data management system ready');
console.log('✅ Form validation system active');
console.log('⚡ Advanced features loaded');
