// Background service worker for BraveBlock
class BraveBlockEngine {
  constructor() {
    this.blockedCount = 0;
    this.whitelist = new Set();
    this.customFilters = new Set();
    this.isEnabled = true;
    this.initializeEngine();
  }

  async initializeEngine() {
    // Load saved settings
    const data = await chrome.storage.sync.get(['blockedCount', 'whitelist', 'customFilters', 'isEnabled']);
    this.blockedCount = data.blockedCount || 0;
    this.whitelist = new Set(data.whitelist || []);
    this.customFilters = new Set(data.customFilters || []);
    this.isEnabled = data.isEnabled !== false;

    // Update badge
    this.updateBadge();
    
    // Set up declarative net request rules
    await this.updateBlockingRules();
  }

  async updateBlockingRules() {
    const rules = [];
    let ruleId = 1;

    // Common ad domains and patterns
    const adDomains = [
      'googleads.g.doubleclick.net',
      'googlesyndication.com',
      'google-analytics.com',
      'googletagmanager.com',
      'facebook.com/tr',
      'amazon-adsystem.com',
      'ads.yahoo.com',
      'adsystem.amazon.com',
      'outbrain.com',
      'taboola.com',
      'criteo.com',
      'adsrvr.org',
      'adnxs.com',
      'rubiconproject.com'
    ];

    // Block ad domains
    for (const domain of adDomains) {
      rules.push({
        id: ruleId++,
        priority: 1,
        action: { type: 'block' },
        condition: {
          urlFilter: `*${domain}*`,
          resourceTypes: ['script', 'xmlhttprequest', 'image', 'sub_frame']
        }
      });
    }

    // YouTube ad blocking rules
    const youtubeRules = [
      // Block YouTube ad requests
      {
        id: ruleId++,
        priority: 2,
        action: { type: 'block' },
        condition: {
          urlFilter: '*youtube.com/api/stats/ads*',
          resourceTypes: ['xmlhttprequest']
        }
      },
      {
        id: ruleId++,
        priority: 2,
        action: { type: 'block' },
        condition: {
          urlFilter: '*youtube.com/pagead/*',
          resourceTypes: ['script', 'xmlhttprequest', 'image']
        }
      },
      {
        id: ruleId++,
        priority: 2,
        action: { type: 'block' },
        condition: {
          urlFilter: '*googlevideo.com/videoplayback*',
          urlQuery: '*mime=video*'
        }
      }
    ];

    rules.push(...youtubeRules);

    // Apply rules
    try {
      await chrome.declarativeNetRequest.updateDynamicRules({
        removeRuleIds: Array.from({length: 1000}, (_, i) => i + 1),
        addRules: this.isEnabled ? rules.slice(0, 100) : [] // Chrome limits dynamic rules
      });
    } catch (error) {
      console.error('Failed to update blocking rules:', error);
    }
  }

  async incrementBlockedCount() {
    this.blockedCount++;
    await chrome.storage.sync.set({ blockedCount: this.blockedCount });
    this.updateBadge();
  }

  updateBadge() {
    const text = this.isEnabled ? this.blockedCount.toString() : 'OFF';
    const color = this.isEnabled ? '#ff6b35' : '#888888';
    
    chrome.action.setBadgeText({ text });
    chrome.action.setBadgeBackgroundColor({ color });
  }

  async toggleBlocking() {
    this.isEnabled = !this.isEnabled;
    await chrome.storage.sync.set({ isEnabled: this.isEnabled });
    await this.updateBlockingRules();
    this.updateBadge();
    return this.isEnabled;
  }

  async addToWhitelist(domain) {
    this.whitelist.add(domain);
    await chrome.storage.sync.set({ whitelist: Array.from(this.whitelist) });
  }

  async removeFromWhitelist(domain) {
    this.whitelist.delete(domain);
    await chrome.storage.sync.set({ whitelist: Array.from(this.whitelist) });
  }

  isWhitelisted(url) {
    try {
      const domain = new URL(url).hostname;
      return this.whitelist.has(domain);
    } catch {
      return false;
    }
  }
}

// Initialize the engine
const braveBlock = new BraveBlockEngine();

// Handle request blocking events
chrome.declarativeNetRequest.onRuleMatchedDebug.addListener((details) => {
  if (details.request.url && !braveBlock.isWhitelisted(details.request.url)) {
    braveBlock.incrementBlockedCount();
  }
});

// Handle messages from popup and content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.action) {
    case 'getStats':
      sendResponse({
        blockedCount: braveBlock.blockedCount,
        isEnabled: braveBlock.isEnabled,
        whitelist: Array.from(braveBlock.whitelist)
      });
      break;
    
    case 'toggleBlocking':
      braveBlock.toggleBlocking().then(isEnabled => {
        sendResponse({ isEnabled });
      });
      return true;
    
    case 'addToWhitelist':
      braveBlock.addToWhitelist(message.domain).then(() => {
        sendResponse({ success: true });
      });
      return true;
    
    case 'removeFromWhitelist':
      braveBlock.removeFromWhitelist(message.domain).then(() => {
        sendResponse({ success: true });
      });
      return true;
    
    case 'adBlocked':
      braveBlock.incrementBlockedCount();
      break;
  }
});

// Handle installation
chrome.runtime.onInstalled.addListener(() => {
  console.log('BraveBlock installed successfully');
});
