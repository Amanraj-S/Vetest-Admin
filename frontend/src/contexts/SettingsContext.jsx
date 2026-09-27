import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { settingService } from '../services/settingService';
import defaultLogoAsset from '../assets/logo.jpeg';

const SettingsContext = createContext(null);

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchSettings = useCallback(async () => {
    try {
      setLoading(true);
      const res = await settingService.getSettings();
      if (res.success && res.data) {
        setSettings(res.data);
      }
    } catch (err) {
      console.warn('Could not load site settings from server, using defaults:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  // Determine active logo URL dynamically
  const logoUrl = settings?.general?.logo && settings.general.logo.trim() !== ''
    ? settings.general.logo
    : defaultLogoAsset;

  const updateSettingsState = (newSettings) => {
    setSettings(newSettings);
  };

  return (
    <SettingsContext.Provider
      value={{
        settings,
        logoUrl,
        defaultLogoAsset,
        loading,
        reloadSettings: fetchSettings,
        updateSettingsState
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
