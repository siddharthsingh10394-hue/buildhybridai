/**
 * Backend-Lite & Client Storage Manager
 * 
 * Handles local persistence of analyses, saved pitches, writer settings,
 * with optional Firestore sync when online.
 */

const STORAGE_KEYS = {
  HISTORY: 'scriptmatch_history',
  PROFILE: 'scriptmatch_writer_profile',
  SETTINGS: 'scriptmatch_settings'
};

export function loadHistory() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.HISTORY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.warn('[Storage] Could not load history from localStorage', e);
    return [];
  }
}

export function saveAnalysisToHistory(item) {
  try {
    const current = loadHistory();
    const entry = {
      id: 'analysis_' + Date.now(),
      timestamp: new Date().toISOString(),
      ...item
    };
    const updated = [entry, ...current].slice(0, 30); // Keep last 30 analyses
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(updated));
    return entry;
  } catch (e) {
    console.warn('[Storage] Could not save to localStorage', e);
    return null;
  }
}

export function clearHistory() {
  try {
    localStorage.removeItem(STORAGE_KEYS.HISTORY);
    return true;
  } catch (e) {
    return false;
  }
}

export function loadSettings() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return raw ? JSON.parse(raw) : {
      mode: 'auto',
      threshold: 1200,
      offlineSimulated: false
    };
  } catch (e) {
    return { mode: 'auto', threshold: 1200, offlineSimulated: false };
  }
}

export function saveSettings(settings) {
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch (e) {
    console.warn('[Storage] Could not save settings', e);
  }
}
