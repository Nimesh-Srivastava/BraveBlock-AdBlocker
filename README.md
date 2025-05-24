# BraveBlock - Advanced Ad Blocker Installation Guide

## 🚀 Quick Installation

### Step 1: Download the Extension Files
1. Create a new folder called `braveblock-extension`
2. Save the following files in this folder:
   - `manifest.json` - Extension configuration
   - `background.js` - Background service worker
   - `content.js` - Content script for ad blocking
   - `content.css` - Styles for hiding ads
   - `popup.html` - Extension popup interface
   - `rules.json` - Network blocking rules

### Step 2: Load Extension in Chrome/Edge
1. Open Chrome/Edge and go to `chrome://extensions/` or `edge://extensions/`
2. Enable "Developer mode" (toggle in top-right corner)
3. Click "Load unpacked"
4. Select the `braveblock-extension` folder
5. The extension will appear with a shield icon

### Step 3: Activate Protection
1. Click the BraveBlock icon in your browser toolbar
2. Verify that "Protection Active" is displayed
3. Start browsing - ads will be blocked automatically!

## 🎯 Key Features

### Multi-Layer Blocking System
- **Network-level blocking**: Prevents ad requests from loading
- **DOM-level blocking**: Hides ad elements on pages
- **YouTube-specific blocking**: Removes video ads and sponsored content
- **Real-time monitoring**: Blocks dynamically loaded ads

### YouTube Ad Blocking
- Blocks pre-roll, mid-roll, and post-roll video ads
- Removes banner ads and overlays
- Hides sponsored content and promoted videos
- Auto-skips ads when possible
- Speeds up ad playback for faster skipping

### Smart Whitelist System
- Add trusted sites to whitelist
- Per-domain control
- Easy management through popup interface

### Performance Optimized
- Minimal CPU usage
- Fast page loading
- Efficient memory usage
- No slowdown on browsing

## 📊 Usage Statistics

The extension tracks and displays:
- Total ads blocked
- Real-time blocking status
- Whitelisted domains
- Extension on/off state

## 🛠️ Advanced Configuration

### Custom Filter Rules
You can modify `rules.json` to add custom blocking rules:

```json
{
  "id": 16,
  "priority": 1,
  "action": { "type": "block" },
  "condition": {
    "urlFilter": "*your-custom-ad-domain.com*",
    "resourceTypes": ["script", "image"]
  }
}
```

### Content Script Customization
Edit `content.js` to add custom selectors for specific sites:

```javascript
this.customSelectors = [
  '.your-custom-ad-class',
  '#your-custom-ad-id'
];
```

## 🔧 Troubleshooting

### Extension Not Working
1. Check if Developer mode is enabled
2. Refresh the extension: go to `chrome://extensions/`, find BraveBlock, click refresh
3. Reload the webpage you're testing

### Some Ads Still Showing
1. Clear browser cache and cookies
2. Disable other ad blockers (they may conflict)
3. Check if the site is whitelisted
4. Report new ad formats via the extension popup

### YouTube Ads Not Blocked
1. Refresh the YouTube page after installing
2. Clear YouTube cookies and cache
3. Disable YouTube Premium (may interfere)
4. Try in incognito mode to test

## 📈 Performance Comparison

| Feature | BraveBlock | uBlock Origin | AdBlock Plus |
|---------|------------|---------------|--------------|
| YouTube Ads | ✅ Blocked | ✅ Blocked | ❌ Limited |
| Memory Usage | Low | Medium | High |
| Page Load Speed | Fast | Fast | Slower |
| Network Blocking | ✅ Yes | ✅ Yes | ❌ Limited |
| Custom Rules | ✅ Yes | ✅ Yes | ❌ Premium |

## 🔒 Privacy & Security

### Data Collection
- **Zero tracking**: No user data collected
- **Local storage only**: All settings stored locally
- **No telemetry**: No usage data sent anywhere
- **Open source**: All code is transparent

### Permissions Explained
- `declarativeNetRequest`: Block network requests to ad servers
- `storage`: Save your whitelist and settings
- `activeTab`: Access current tab for ad blocking
- `scripting`: Inject content scripts for DOM blocking

## 🆕 Update Instructions

To update BraveBlock:
1. Download the latest files
2. Replace files in your `braveblock-extension` folder
3. Go to `chrome://extensions/`
4. Click the refresh button on BraveBlock
5. Settings and whitelist will be preserved

## 📋 Browser Compatibility

### Fully Supported
- ✅ Chrome 88+
- ✅ Microsoft Edge 88+
- ✅ Brave Browser
- ✅ Opera 74+

### Limited Support
- ⚠️ Firefox (requires Manifest V2 conversion)
- ⚠️ Safari (requires different architecture)

## 🤝 Contributing

We welcome contributions to make BraveBlock even better! This project is open source and community-driven.

### 🚀 Quick Start for Contributors

1. **Fork the repository**
   ```bash
   git clone https://github.com/yourusername/braveblock-extension.git
   cd braveblock-extension
   ```

2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make your changes and test**
   - Load the extension in Chrome developer mode
   - Test on multiple websites including YouTube
   - Verify no existing functionality is broken

4. **Submit a pull request**
   - Write clear commit messages
   - Include description of changes
   - Reference any related issues

### 📋 Types of Contributions Needed

#### 🐛 Bug Reports
- **New ad formats not blocked**: Submit issue with website URL and screenshot
- **Performance issues**: Include browser version and system specs
- **YouTube ads slipping through**: Provide video URL and ad type
- **Extension crashes**: Include console errors and reproduction steps

#### ✨ Feature Requests
- **New blocking capabilities**: Suggest specific ad networks or formats
- **UI improvements**: Design mockups welcome
- **Performance optimizations**: Benchmarking data appreciated
- **Browser compatibility**: Testing on different browsers

#### 🔧 Code Contributions

**High Priority Areas:**
- **Filter list updates** (`rules.json`, `content.js`)
- **YouTube ad detection** (new ad formats emerge frequently)
- **Performance optimization** (memory usage, CPU efficiency)
- **Browser compatibility** (Firefox, Safari support)

**File Structure for Contributors:**
```
src/
├── manifest.json          # Extension config
├── background.js          # Network-level blocking
├── content.js            # DOM manipulation
├── content.css           # CSS-based hiding
├── popup.html            # User interface
├── rules.json            # Network blocking rules
└── tests/                # Test files (create if adding)
```

### 🧪 Testing Guidelines

**Before submitting PRs:**
1. **Load extension in developer mode**
2. **Test on these sites:**
   - YouTube (various video types)
   - News sites (CNN, BBC, etc.)
   - Social media (Twitter, Facebook)
   - E-commerce (Amazon, eBay)
3. **Check performance:**
   - No console errors
   - Fast page loading
   - Low memory usage
4. **Verify blocking works:**
   - Check blocked counter increases
   - Confirm ads are hidden/blocked

### 📝 Code Style

**JavaScript:**
```javascript
// Use camelCase for variables
const adBlocker = new AdBlocker();

// Clear comments for complex logic
// Block video ads by manipulating playback
if (this.isVideoAd()) {
  video.currentTime = video.duration;
}
```

**CSS:**
```css
/* Use specific selectors to avoid conflicts */
.ytd-promoted-sparkles-web-renderer {
    display: none !important;
}
```

### 🐛 Issue Templates

**Bug Report Template:**
```markdown
**Browser:** Chrome/Edge/Firefox version
**Website:** URL where issue occurs
**Expected:** What should happen
**Actual:** What actually happens
**Screenshots:** If applicable
**Console Errors:** From developer tools
```

**Feature Request Template:**
```markdown
**Problem:** What ad format isn't blocked
**Solution:** Proposed blocking method
**Websites:** Where this would help
**Priority:** High/Medium/Low
```

### 🏷️ Labels We Use

- `bug` - Something isn't working
- `enhancement` - New feature or improvement
- `youtube` - YouTube-specific issues
- `performance` - Speed/memory optimizations
- `help-wanted` - Good for new contributors
- `good-first-issue` - Easy entry point for beginners

### 🎯 Roadmap & Priorities

**Current Focus:**
1. **YouTube ad blocking improvements** (ongoing cat-and-mouse game)
2. **Memory usage optimization** (reduce background script footprint)
3. **Firefox compatibility** (Manifest V2 version)
4. **Custom filter list support** (user-defined rules)

**Future Goals:**
- Mobile browser support
- Advanced privacy features
- Malware/tracking protection
- Social media ad blocking improvements

### 🤝 Community Guidelines

- **Be respectful** in issues and PRs
- **Search existing issues** before creating new ones
- **Provide context** - include URLs, browser versions, etc.
- **Test thoroughly** before submitting changes
- **Document new features** in README updates

### 📞 Getting Help

- **GitHub Issues**: For bugs and feature requests
- **Discussions**: For questions and brainstorming
- **Pull Request Reviews**: We'll help improve your code

### 🙏 Recognition

Contributors will be:
- Listed in `CONTRIBUTORS.md`
- Mentioned in release notes
- Given credit in documentation updates

**Current Top Contributors:**
- Your name could be here! 🌟

---

This project is inspired by Brave browser's ad blocking technology and implements similar principles:
- Filter list-based network blocking
- Real-time DOM manipulation
- Performance-first architecture
- Privacy-focused design

## 📞 Support

If you encounter issues:
1. Check this guide first
2. Try disabling other extensions
3. Test in incognito mode
4. Clear browser cache
5. Reinstall the extension

## 🎉 Success Indicators

You'll know BraveBlock is working when:
- The badge shows blocked ad count
- YouTube videos play without ads
- Pages load faster
- No banner ads visible
- Popup shows "Protection Active"

Happy ad-free browsing! 🎊
