// Content script for advanced ad blocking and YouTube specific blocking
class ContentBlocker {
  constructor() {
    this.observer = null;
    this.blockedElements = new Set();
    this.youtubeSelectors = [
      // YouTube ad selectors
      '.ytp-ad-overlay-container',
      '.ytp-ad-text-overlay',
      '.ytp-ad-player-overlay',
      '.video-ads',
      '.ytd-promoted-sparkles-web-renderer',
      '.ytd-ad-slot-renderer',
      '.ytd-banner-promo-renderer',
      '.ytd-video-masthead-ad-v3-renderer',
      '.ytd-primetime-promo-renderer',
      'ytd-promoted-video-renderer',
      'ytd-compact-promoted-video-renderer',
      '.ytd-display-ad-renderer',
      '[data-ad-slot-id]',
      '.googima-ad-div',
      'div[id^="google_ads_iframe"]',
      // Sidebar ads
      '#secondary .ytd-promoted-sparkles-web-renderer',
      '#secondary .ytd-compact-promoted-video-renderer',
      // Sponsored content
      '.ytd-shelf-renderer[data-ad-slot-id]',
      '.ytd-item-section-renderer .ytd-promoted-sparkles-web-renderer'
    ];
    
    this.generalSelectors = [
      // General ad selectors
      '[class*="ad-"], [id*="ad-"]',
      '[class*="ads-"], [id*="ads-"]',
      '[class*="advertisement"]',
      '.banner-ad, .ad-banner',
      '.google-ad, .googlesyndication',
      '[data-ad-name], [data-ad-slot]',
      '.sponsored, .promotion',
      'iframe[src*="googleads"]',
      'iframe[src*="googlesyndication"]',
      'div[id*="google_ads"]'
    ];

    this.init();
  }

  init() {
    // Start blocking immediately
    this.blockAds();
    
    // Set up mutation observer for dynamic content
    this.setupObserver();
    
    // YouTube specific initialization
    if (this.isYoutube()) {
      this.initYouTubeBlocking();
    }
    
    // Block inline scripts
    this.blockInlineAds();
  }

  isYoutube() {
    return window.location.hostname === 'www.youtube.com' || 
           window.location.hostname === 'youtube.com';
  }

  blockAds() {
    const allSelectors = [...this.generalSelectors, ...this.youtubeSelectors];
    
    allSelectors.forEach(selector => {
      try {
        const elements = document.querySelectorAll(selector);
        elements.forEach(el => this.hideElement(el));
      } catch (e) {
        // Invalid selector, skip
      }
    });
  }

  hideElement(element) {
    if (element && !this.blockedElements.has(element)) {
      element.style.setProperty('display', 'none', 'important');
      element.style.setProperty('visibility', 'hidden', 'important');
      element.style.setProperty('opacity', '0', 'important');
      element.style.setProperty('height', '0', 'important');
      element.style.setProperty('width', '0', 'important');
      element.style.setProperty('position', 'absolute', 'important');
      element.style.setProperty('left', '-9999px', 'important');
      
      this.blockedElements.add(element);
      
      // Notify background script
      chrome.runtime.sendMessage({ action: 'adBlocked' });
    }
  }

  setupObserver() {
    this.observer = new MutationObserver((mutations) => {
      let shouldBlock = false;
      
      mutations.forEach(mutation => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach(node => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              shouldBlock = true;
            }
          });
        }
      });
      
      if (shouldBlock) {
        // Debounce blocking calls
        clearTimeout(this.blockTimeout);
        this.blockTimeout = setTimeout(() => this.blockAds(), 100);
      }
    });

    this.observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  initYouTubeBlocking() {
    // Block YouTube ads on page load and navigation
    this.blockYouTubeAds();
    
    // Listen for YouTube navigation (SPA)
    let lastUrl = location.href;
    new MutationObserver(() => {
      const url = location.href;
      if (url !== lastUrl) {
        lastUrl = url;
        setTimeout(() => this.blockYouTubeAds(), 500);
      }
    }).observe(document, { subtree: true, childList: true });

    // Block video ads specifically
    this.blockVideoAds();
  }

  blockYouTubeAds() {
    // Remove ad containers
    this.youtubeSelectors.forEach(selector => {
      document.querySelectorAll(selector).forEach(el => this.hideElement(el));
    });

    // Remove promoted/sponsored videos
    document.querySelectorAll('ytd-rich-item-renderer, ytd-compact-video-renderer').forEach(item => {
      const badges = item.querySelectorAll('.badge-style-type-ad, .ytd-badge-supported-renderer');
      if (badges.length > 0) {
        this.hideElement(item);
      }
    });

    // Clean up ad-related attributes
    document.querySelectorAll('[data-ad-slot-id], [data-ad-name]').forEach(el => {
      this.hideElement(el);
    });
  }

  blockVideoAds() {
    // Skip video ads by manipulating video element
    const skipAd = () => {
      const video = document.querySelector('video');
      const skipButton = document.querySelector('.ytp-ad-skip-button, .ytp-skip-ad-button');
      
      if (skipButton && skipButton.offsetParent !== null) {
        skipButton.click();
        return;
      }

      // Force skip by seeking to end
      if (video && this.isVideoAd()) {
        video.currentTime = video.duration;
        video.muted = true;
        video.playbackRate = 16;
      }
    };

    // Check for ads periodically
    setInterval(skipAd, 500);
    
    // Listen for video events
    document.addEventListener('play', skipAd, true);
    document.addEventListener('loadstart', skipAd, true);
  }

  isVideoAd() {
    const adIndicators = [
      '.ytp-ad-text',
      '.ytp-ad-overlay-container',
      '.ad-showing'
    ];
    
    return adIndicators.some(selector => 
      document.querySelector(selector) && 
      document.querySelector(selector).offsetParent !== null
    );
  }

  blockInlineAds() {
    // Remove ad-related scripts
    document.querySelectorAll('script').forEach(script => {
      const src = script.src.toLowerCase();
      const content = script.textContent.toLowerCase();
      
      if (src.includes('googleads') || 
          src.includes('googlesyndication') ||
          src.includes('amazon-adsystem') ||
          content.includes('googletag') ||
          content.includes('adsbygoogle')) {
        script.remove();
      }
    });

    // Block ad-related iframes
    document.querySelectorAll('iframe').forEach(iframe => {
      const src = iframe.src.toLowerCase();
      if (src.includes('googleads') ||
          src.includes('googlesyndication') ||
          src.includes('amazon-adsystem') ||
          src.includes('/ads/')) {
        this.hideElement(iframe);
      }
    });
  }

  // Prevent ad scripts from loading
  preventAdScripts() {
    const originalCreateElement = document.createElement;
    document.createElement = function(tagName) {
      const element = originalCreateElement.call(document, tagName);
      
      if (tagName.toLowerCase() === 'script') {
        const originalSetAttribute = element.setAttribute;
        element.setAttribute = function(name, value) {
          if (name.toLowerCase() === 'src' && 
              (value.includes('googleads') || 
               value.includes('googlesyndication') ||
               value.includes('amazon-adsystem'))) {
            return; // Don't set ad script sources
          }
          return originalSetAttribute.call(this, name, value);
        };
      }
      
      return element;
    };
  }
}

// Initialize content blocker
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new ContentBlocker());
} else {
  new ContentBlocker();
}

// Prevent ad scripts from loading
(function() {
  const originalFetch = window.fetch;
  window.fetch = function(...args) {
    const url = args[0];
    if (typeof url === 'string' && 
        (url.includes('googleads') || 
         url.includes('googlesyndication') ||
         url.includes('/pagead/'))) {
      return Promise.reject(new Error('Blocked by BraveBlock'));
    }
    return originalFetch.apply(this, args);
  };
})();
