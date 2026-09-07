/**
 * Safe wrapper for Clipboard operations that prevents TurboModule / Native module crash
 * if CocoaPods / native library is not yet linked in the running app binary.
 */

let ClipboardModule: any = null;
let isNativeModuleAvailable = true;

function getClipboard() {
  if (!isNativeModuleAvailable) return null;
  if (ClipboardModule) return ClipboardModule;

  try {
    const pkg = require('@react-native-clipboard/clipboard');
    ClipboardModule = pkg.default || pkg;
    return ClipboardModule;
  } catch (err) {
    isNativeModuleAvailable = false;
    console.warn('Native Clipboard module not available in current binary:', err);
    return null;
  }
}

export function copyToClipboard(text: string): boolean {
  if (!text) return false;
  try {
    const cb = getClipboard();
    if (cb && typeof cb.setString === 'function') {
      cb.setString(text);
      return true;
    }
  } catch (err) {
    console.warn('Failed to copy to native clipboard:', err);
  }
  return false;
}
