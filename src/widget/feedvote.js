// FeedVote Widget Script
(function () {
  // Prevent multiple initializations
  if (window.FeedVote) return;

  const WIDGET_VERSION = '1.0.0';

  // Create a unique namespace for the widget
  const namespace = 'fv-' + Math.random().toString(36).substring(2, 9);

  class FeedVoteWidget {
    static instances = [];

    constructor(config) {
      this.config = {
        projectId: config.projectId,
        position: config.position || 'bottom-right',
        theme: config.theme || 'light',
        primaryColor: config.primaryColor || '#22c55e',
        secondaryColor: config.secondaryColor || '#3b82f6',
        buttonText: config.buttonText || 'Give Feedback',
        customClass: config.customClass || '',
        placeholder: config.placeholder || 'Share your feedback or vote on existing items...',
        userParameters: config.userParameters || {},
        allowAnonymous: config.allowAnonymous ?? true,
        analytics: config.analytics || null,
        ...config,
      };

      // Store instance reference
      FeedVoteWidget.instances.push(this);

      this.initialize();
    }

    initialize() {
      this.createStyles();
      this.createContainer();
      this.attachEventListeners();

      // Initialize analytics if enabled
      if (this.config.analytics?.trackEvents?.load) {
        this.trackEvent('widget_loaded');
      }
    }

    createStyles() {
      const styles = `
        /* Widget-specific CSS reset */
        .${namespace}-widget-container,
        .${namespace}-widget-container *,
        .${namespace}-modal,
        .${namespace}-modal * {
          all: revert !important;
          box-sizing: border-box !important;
          line-height: normal !important;
          text-transform: none !important;
          letter-spacing: normal !important;
          font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
          margin: 0 !important;
          padding: 0 !important;
        }

        /* Container styles */
        .${namespace}-widget-container {
          position: fixed !important;
          z-index: 99999 !important;
          font-size: 16px !important;
          ${this.getPositionStyles()}
        }

        /* Button styles */
        .${namespace}-widget-button {
          background: linear-gradient(to right, ${this.config.primaryColor}, ${this.config.secondaryColor}) !important;
          color: white !important;
          border: none !important;
          padding: 12px 24px !important;
          border-radius: 12px !important;
          cursor: pointer !important;
          font-size: 14px !important;
          font-weight: 600 !important;
          display: inline-flex !important;
          align-items: center !important;
          gap: 8px !important;
          transition: all 0.2s ease !important;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1) !important;
          position: relative !important;
          overflow: hidden !important;
          ${this.config.customClass ? this.config.customClass : ''}
        }

        /* Theme-specific styles */
        ${this.getThemeStyles()}
      `;

      const styleSheet = document.createElement('style');
      styleSheet.textContent = styles;
      document.head.appendChild(styleSheet);
    }

    getPositionStyles() {
      const positions = {
        'bottom-right': 'right: 20px !important; bottom: 20px !important;',
        'bottom-left': 'left: 20px !important; bottom: 20px !important;',
        'top-right': 'right: 20px !important; top: 20px !important;',
        'top-left': 'left: 20px !important; top: 20px !important;',
      };
      return positions[this.config.position] || positions['bottom-right'];
    }

    getThemeStyles() {
      return this.config.theme === 'dark'
        ? `
        .${namespace}-widget-container {
          --bg-color: #1f2937;
          --text-color: #ffffff;
        }
      `
        : `
        .${namespace}-widget-container {
          --bg-color: #ffffff;
          --text-color: #1f2937;
        }
      `;
    }

    createContainer() {
      const container = document.createElement('div');
      container.className = `${namespace}-widget-container`;

      const button = document.createElement('button');
      button.className = `${namespace}-widget-button`;
      button.textContent = this.config.buttonText;

      container.appendChild(button);
      document.body.appendChild(container);
    }

    attachEventListeners() {
      const button = document.querySelector(`.${namespace}-widget-button`);
      if (button) {
        button.addEventListener('click', () => {
          this.handleButtonClick();
        });
      }
    }

    handleButtonClick() {
      if (this.config.analytics?.trackEvents?.open) {
        this.trackEvent('widget_opened');
      }
      // Handle button click - open modal, etc.
    }

    trackEvent(eventName, metadata = {}) {
      if (!this.config.analytics?.trackEvents?.[eventName]) return;

      // Send analytics event
      try {
        fetch('/api/widget/analytics', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            event: eventName,
            projectId: this.config.projectId,
            metadata: {
              widgetVersion: WIDGET_VERSION,
              ...metadata,
            },
          }),
        });
      } catch (error) {
        console.error('Error tracking widget event:', error);
      }
    }
  }

  // Expose the widget to the global scope
  window.FeedVote = FeedVoteWidget;
})();
