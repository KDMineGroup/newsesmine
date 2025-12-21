// ============================================
// SESMine Platform - Data Management System
// Smart Engineering Solutions for Mining
// ============================================

class SESMineDataManager {
  constructor() {
      this.config = window.SESMineConfig;
      this.storagePrefix = this.config.storage.prefix;
      this.backupEnabled = this.config.storage.backup.enabled;
      this.backupFrequency = this.config.storage.backup.frequency;
      this.backupRetention = this.config.storage.backup.retention;
      
      this.init();
  }

  init() {
      console.log('💾 SESMine Data Manager Initializing...');
      
      // Initialize storage
      this.initializeStorage();
      
      // Set up backup system
      if (this.backupEnabled) {
          this.setupBackupSystem();
      }
      
      // Set up data validation
      this.setupDataValidation();
      
      // Initialize sample data if needed
      this.initializeSampleData();
      
      console.log('✅ Data Manager Ready');
  }

  // Storage Operations
  set(key, data, options = {}) {
      try {
          const storageKey = this.getStorageKey(key);
          const dataObject = {
              data: data,
              timestamp: Date.now(),
              version: this.config.app.version,
              metadata: options.metadata || {},
              expires: options.expires || null
          };

          const serializedData = JSON.stringify(dataObject);
          localStorage.setItem(storageKey, serializedData);

          // Create backup if enabled
          if (this.backupEnabled && !options.skipBackup) {
              this.createBackup(key, dataObject);
          }

          // Trigger data change event
          this.triggerDataChangeEvent(key, 'set', data);

          return true;
      } catch (error) {
          console.error('Data storage error:', error);
          this.handleStorageError(error, 'set', key);
          return false;
      }
  }

  get(key, defaultValue = null) {
      try {
          const storageKey = this.getStorageKey(key);
          const serializedData = localStorage.getItem(storageKey);
          
          if (!serializedData) {
              return defaultValue;
          }

          const dataObject = JSON.parse(serializedData);
          
          // Check if data has expired
          if (dataObject.expires && Date.now() > dataObject.expires) {
              this.remove(key);
              return defaultValue;
          }

          return dataObject.data;
      } catch (error) {
          console.error('Data retrieval error:', error);
          this.handleStorageError(error, 'get', key);
          return defaultValue;
      }
  }

  remove(key) {
      try {
          const storageKey = this.getStorageKey(key);
          const data = this.get(key);
          
          localStorage.removeItem(storageKey);
          
          // Trigger data change event
          this.triggerDataChangeEvent(key, 'remove', data);
          
          return true;
      } catch (error) {
          console.error('Data removal error:', error);
          this.handleStorageError(error, 'remove', key);
          return false;
      }
  }

  exists(key) {
      const storageKey = this.getStorageKey(key);
      return localStorage.getItem(storageKey) !== null;
  }

  clear(pattern = null) {
      try {
          const keys = this.getKeys(pattern);
          keys.forEach(key => this.remove(key));
          return true;
      } catch (error) {
          console.error('Data clear error:', error);
          return false;
      }
  }

  getKeys(pattern = null) {
      const keys = [];
      const prefixLength = this.storagePrefix.length;
      
      for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && key.startsWith(this.storagePrefix)) {
              const cleanKey = key.substring(prefixLength);
              if (!pattern || cleanKey.includes(pattern)) {
                  keys.push(cleanKey);
              }
          }
      }
      
      return keys;
  }

  // User Data Management
  saveUserData(userData) {
      return this.set(this.config.storage.keys.user, userData, {
          metadata: { type: 'user_data', userId: userData.id }
      });
  }

  getUserData() {
      return this.get(this.config.storage.keys.user);
  }

  saveUserPreferences(preferences) {
      const userData = this.getUserData();
      if (userData) {
          return this.set(this.config.storage.keys.preferences, {
              userId: userData.id,
              preferences: preferences,
              lastUpdated: new Date().toISOString()
          });
      }
      return false;
  }

  getUserPreferences() {
      const prefData = this.get(this.config.storage.keys.preferences);
      return prefData ? prefData.preferences : {};
  }

  // Registration Management
  saveRegistration(registrationData) {
      const registrations = this.get