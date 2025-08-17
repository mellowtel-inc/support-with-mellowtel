import { Logger } from "./logger/logger";

if (
    window.location.hostname.includes('mellowtel') ||
    window.location.hostname.includes('mellow.tel')
) {
    Logger.log('[MellowTel] Content script loaded on mellowtel.com domain');
    
    function setExtensionDetected() {
      try {
        if (!document.documentElement) {
          Logger.log('[MellowTel] documentElement not ready, retrying...');
          setTimeout(setExtensionDetected, 50);
          return;
        }
        
        document.documentElement.setAttribute('data-mellowtel-extension', 'true');
        Logger.log('[MellowTel] Extension attribute set successfully');
        
        window.dispatchEvent(new Event('mellowtel-extension-detected'));
        Logger.log('[MellowTel] Extension event dispatched');
        
        window.mellowtelExtensionActive = true;
        
        const check = document.documentElement.getAttribute('data-mellowtel-extension');
        Logger.log('[MellowTel] Verification check:', check);
        
      } catch (error) {
        Logger.error('[MellowTel] Error setting extension detection:', error);
        setTimeout(setExtensionDetected, 100);
      }
    }
  
    setExtensionDetected();
    
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', setExtensionDetected);
    }
    
    setTimeout(setExtensionDetected, 100);
    setTimeout(setExtensionDetected, 500);
  }