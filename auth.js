// Authentication Helper Functions

/**
 * Check if user is authenticated
 * @returns {Object|null} Current user object or null
 */
function checkAuth() {
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  if (!currentUser) {
    window.location.href = 'login.html';
    return null;
  }
  return currentUser;
}

/**
 * Check if admin is authenticated
 * @returns {Object|null} Admin session object or null
 */
function checkAdminAuth() {
  const adminSession = JSON.parse(localStorage.getItem('adminSession'));
  if (!adminSession) {
    window.location.href = 'admin-login.html';
    return null;
  }
  return adminSession;
}

/**
 * Check if user has access to specific hub
 * @param {string} hubKey - Hub identifier (e.g., 'engineering', 'economics')
 * @returns {boolean} True if user has access
 */
function checkHubAccess(hubKey) {
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  if (!currentUser) return false;
  
  const hubsAccess = currentUser.hubsAccess || [];
  return hubsAccess.includes(hubKey);
}

/**
 * Logout current user
 */
function logout() {
  if (confirm('Are you sure you want to logout?')) {
    localStorage.removeItem('currentUser');
    window.location.href = 'login.html';
  }
}

/**
 * Logout admin
 */
function adminLogout() {
  if (confirm('Are you sure you want to logout?')) {
    localStorage.removeItem('adminSession');
    window.location.href = 'admin-login.html';
  }
}

/**
 * Get current user info
 * @returns {Object|null} User information
 */
function getCurrentUser() {
  return JSON.parse(localStorage.getItem('currentUser'));
}

/**
 * Update user session
 * @param {Object} userData - Updated user data
 */
function updateUserSession(userData) {
  localStorage.setItem('currentUser', JSON.stringify(userData));
}

/**
 * Check access level
 * @param {string} requiredLevel - Required access level ('basic', 'professional', 'enterprise')
 * @returns {boolean} True if user has required access level or higher
 */
function checkAccessLevel(requiredLevel) {
  const currentUser = getCurrentUser();
  if (!currentUser) return false;
  
  const levels = ['basic', 'professional', 'enterprise'];
  const userLevelIndex = levels.indexOf(currentUser.accessLevel);
  const requiredLevelIndex = levels.indexOf(requiredLevel);
  
  return userLevelIndex >= requiredLevelIndex;
}

/**
 * Request hub access
 * @param {string} hubKey - Hub identifier
 * @param {string} hubTitle - Hub title
 */
function requestHubAccess(hubKey, hubTitle) {
  const currentUser = getCurrentUser();
  if (!currentUser) {
    alert('Please login first');
    window.location.href = 'login.html';
    return;
  }
  
  if (confirm(`Request access to ${hubTitle}?\n\nYour request will be sent to the administrator for approval.`)) {
    let requests = JSON.parse(localStorage.getItem('accessRequests') || '[]');
    
    const newRequest = {
      requestId: 'REQ-' + Date.now(),
      userId: currentUser.userId,
      fullName: `${currentUser.firstName} ${currentUser.lastName}`,
      email: currentUser.email,
      company: currentUser.company || 'N/A',
      position: currentUser.position || 'N/A',
      hubName: hubTitle,
      hubKey: hubKey,
      accessLevel: currentUser.accessLevel,
      purpose: 'Additional hub access request',
      requestDate: new Date().toISOString(),
      status: 'pending'
    };
    
    requests.push(newRequest);
    localStorage.setItem('accessRequests', JSON.stringify(requests));
    
    alert('Access request submitted successfully!\n\nYou will be notified once your request is reviewed.');
  }
}

/**
 * Initialize default admin account
 */
function initializeAdmin() {
  if (!localStorage.getItem('adminAccount')) {
    const defaultAdmin = {
      username: 'admin',
      password: 'admin123',
      email: 'admin@sesmine.com',
      role: 'superadmin',
      createdDate: new Date().toISOString()
    };
    localStorage.setItem('adminAccount', JSON.stringify(defaultAdmin));
    console.log('Default admin account created');
  }
}

/**
 * Format date/time
 * @param {string|Date} date - Date to format
 * @returns {string} Formatted date string
 */
function formatDate(date) {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

/**
 * Format time ago
 * @param {string|Date} date - Date to format
 * @returns {string} Time ago string
 */
function formatTimeAgo(date) {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  
  if (seconds < 60) return 'Just now';
  if (seconds < 3600) return Math.floor(seconds / 60) + ' minutes ago';
  if (seconds < 86400) return Math.floor(seconds / 3600) + ' hours ago';
  if (seconds < 604800) return Math.floor(seconds / 86400) + ' days ago';
  return new Date(date).toLocaleDateString();
}

/**
 * Generate random password
 * @param {number} length - Password length
 * @returns {string} Generated password
 */
function generatePassword(length = 10) {
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
  let password = '';
  for (let i = 0; i < length; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return password;
}

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid
 */
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

/**
 * Check password strength
 * @param {string} password - Password to check
 * @returns {Object} Strength info {score: number, feedback: string}
 */
function checkPasswordStrength(password) {
  let score = 0;
  let feedback = [];
  
  if (password.length >= 8) score++;
  else feedback.push('At least 8 characters');
  
  if (password.match(/[a-z]/) && password.match(/[A-Z]/)) score++;
  else feedback.push('Mix of uppercase and lowercase');
  
  if (password.match(/[0-9]/)) score++;
  else feedback.push('Include numbers');
  
  if (password.match(/[^a-zA-Z0-9]/)) score++;
  else feedback.push('Include special characters');
  
  const strength = ['Weak', 'Fair', 'Good', 'Strong', 'Very Strong'][score];
  
  return {
    score: score,
    strength: strength,
    feedback: feedback.join(', ')
  };
}

// Initialize admin on script load
initializeAdmin();

// Export functions for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    checkAuth,
    checkAdminAuth,
    checkHubAccess,
    logout,
    adminLogout,
    getCurrentUser,
    updateUserSession,
    checkAccessLevel,
    requestHubAccess,
    formatDate,
    formatTimeAgo,
    generatePassword,
    validateEmail,
    checkPasswordStrength
  };
}