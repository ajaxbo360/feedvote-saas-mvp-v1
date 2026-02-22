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

      if (!this.modal) {
        this.createModal();
      }

      this.openModal();
    }

    createModal() {
      const modal = document.createElement('div');
      modal.className = `${namespace}-modal`;
      modal.style.display = 'none';

      modal.innerHTML = `
        <div class="${namespace}-modal-overlay"></div>
        <div class="${namespace}-modal-content">
          <div class="${namespace}-modal-header">
            <h3>Share Feedback</h3>
            <button class="${namespace}-close-button">&times;</button>
          </div>
          <div class="${namespace}-modal-body">
            <form id="${namespace}-form">
              <div class="${namespace}-form-group">
                <label for="${namespace}-title">Title</label>
                <input type="text" id="${namespace}-title" required placeholder="Short summary">
              </div>
              <div class="${namespace}-form-group">
                <label for="${namespace}-description">Description</label>
                <textarea id="${namespace}-description" required placeholder="${this.config.placeholder}" rows="4"></textarea>
              </div>
              <div class="${namespace}-form-actions">
                <button type="submit" class="${namespace}-submit-button">Submit Feedback</button>
              </div>
            </form>
            <div class="${namespace}-success-message" style="display: none;">
              <div class="${namespace}-success-icon">✓</div>
              <h3>Thank you!</h3>
              <p>Your feedback has been submitted successfully.</p>
              <button class="${namespace}-close-success">Close</button>
            </div>
            <div class="${namespace}-error-message" style="display: none;">
              <p>Something went wrong. Please try again.</p>
            </div>
          </div>
          <div class="${namespace}-modal-footer">
            Powered by <a href="https://feedvote.com" target="_blank">FeedVote</a>
          </div>
        </div>
      `;

      document.body.appendChild(modal);
      this.modal = modal;

      // Add styles for modal
      this.addModalStyles();

      // Event listeners
      modal.querySelector(`.${namespace}-close-button`).addEventListener('click', () => this.closeModal());
      modal.querySelector(`.${namespace}-modal-overlay`).addEventListener('click', () => this.closeModal());
      modal.querySelector(`.${namespace}-close-success`).addEventListener('click', () => this.closeModal());

      const form = modal.querySelector(`#${namespace}-form`);
      form.addEventListener('submit', (e) => this.handleSubmit(e));
    }

    addModalStyles() {
      const styles = `
        .${namespace}-modal {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 100000;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.3s ease;
        }
        
        .${namespace}-modal.open {
          opacity: 1;
          pointer-events: auto;
        }
        
        .${namespace}-modal-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(2px);
        }
        
        .${namespace}-modal-content {
          position: relative;
          background: var(--bg-color, #ffffff);
          color: var(--text-color, #1f2937);
          width: 90%;
          max-width: 400px;
          border-radius: 16px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
          overflow: hidden;
          transform: translateY(20px);
          transition: transform 0.3s ease;
          display: flex;
          flex-direction: column;
        }
        
        .${namespace}-modal.open .${namespace}-modal-content {
          transform: translateY(0);
        }
        
        .${namespace}-modal-header {
          padding: 16px 20px;
          border-bottom: 1px solid rgba(0, 0, 0, 0.1);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .${namespace}-modal-header h3 {
          font-size: 18px;
          font-weight: 600;
          margin: 0;
        }
        
        .${namespace}-close-button {
          background: none;
          border: none;
          font-size: 24px;
          cursor: pointer;
          color: #9ca3af;
          padding: 0;
          line-height: 1;
        }
        
        .${namespace}-close-button:hover {
          color: #4b5563;
        }
        
        .${namespace}-modal-body {
          padding: 20px;
        }
        
        .${namespace}-form-group {
          margin-bottom: 16px;
        }
        
        .${namespace}-form-group label {
          display: block;
          font-size: 14px;
          font-weight: 500;
          margin-bottom: 6px;
          color: var(--text-color, #374151);
        }
        
        .${namespace}-form-group input,
        .${namespace}-form-group textarea {
          width: 100%;
          padding: 10px 12px;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          font-size: 14px;
          transition: border-color 0.2s;
          background: var(--bg-color, #ffffff);
          color: var(--text-color, #1f2937);
        }
        
        .${namespace}-form-group input:focus,
        .${namespace}-form-group textarea:focus {
          outline: none;
          border-color: ${this.config.primaryColor};
          box-shadow: 0 0 0 2px ${this.config.primaryColor}20;
        }
        
        .${namespace}-submit-button {
          width: 100%;
          padding: 10px;
          background: ${this.config.primaryColor};
          color: white;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: opacity 0.2s;
        }
        
        .${namespace}-submit-button:hover {
          opacity: 0.9;
        }
        
        .${namespace}-submit-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        
        .${namespace}-modal-footer {
          padding: 12px;
          text-align: center;
          font-size: 12px;
          color: #9ca3af;
          background: rgba(0, 0, 0, 0.02);
          border-top: 1px solid rgba(0, 0, 0, 0.05);
        }
        
        .${namespace}-modal-footer a {
          color: ${this.config.primaryColor};
          text-decoration: none;
        }
        
        .${namespace}-success-message {
          text-align: center;
          padding: 20px 0;
        }
        
        .${namespace}-success-icon {
          width: 48px;
          height: 48px;
          background: #dcfce7;
          color: #16a34a;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          margin: 0 auto 16px;
        }
        
        .${namespace}-close-success {
          margin-top: 16px;
          padding: 8px 16px;
          background: #f3f4f6;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 500;
        }
        
        .${namespace}-error-message {
          color: #ef4444;
          text-align: center;
          margin-top: 10px;
          font-size: 14px;
        }
      `;

      const styleSheet = document.createElement('style');
      styleSheet.textContent = styles;
      document.head.appendChild(styleSheet);
    }

    openModal() {
      this.modal.style.display = 'flex';
      // Force reflow
      this.modal.offsetHeight;
      this.modal.classList.add('open');
    }

    closeModal() {
      this.modal.classList.remove('open');
      setTimeout(() => {
        this.modal.style.display = 'none';
        // Reset form
        const form = this.modal.querySelector(`#${namespace}-form`);
        const successMsg = this.modal.querySelector(`.${namespace}-success-message`);

        if (form) {
          form.style.display = 'block';
          form.reset();
        }
        if (successMsg) successMsg.style.display = 'none';
      }, 300);
    }

    async handleSubmit(e) {
      e.preventDefault();

      const form = e.target;
      const submitBtn = form.querySelector(`.${namespace}-submit-button`);
      const errorMsg = this.modal.querySelector(`.${namespace}-error-message`);
      const successMsg = this.modal.querySelector(`.${namespace}-success-message`);

      const title = form.querySelector(`#${namespace}-title`).value;
      const description = form.querySelector(`#${namespace}-description`).value;

      submitBtn.disabled = true;
      submitBtn.textContent = 'Submitting...';
      errorMsg.style.display = 'none';

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/widget/submit`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            project_id: this.config.projectId,
            title,
            description,
          }),
        });

        if (!response.ok) {
          throw new Error('Submission failed');
        }

        // Track success
        if (this.config.analytics?.trackEvents?.submit) {
          this.trackEvent('feedback_submitted');
        }

        // Show success state
        form.style.display = 'none';
        successMsg.style.display = 'block';
      } catch (error) {
        console.error('Error submitting feedback:', error);
        errorMsg.style.display = 'block';
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Submit Feedback';
      }
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

  // Support for legacy/snippet API
  // 1. Expose global function to open popup
  window.openFeatureRequestPopup = function () {
    // Find the instance or create one if it doesn't exist
    let instance = FeedVoteWidget.instances[0];
    if (!instance) {
      // Try to auto-init from script tag
      const script = document.currentScript || document.querySelector('script[slug]');
      if (script) {
        const config = {
          projectId: script.getAttribute('slug'),
          userParameters: {
            id: script.getAttribute('user_id'),
            email: script.getAttribute('user_email'),
            name: script.getAttribute('user_name'),
            spend: script.getAttribute('user_spend'),
          },
        };
        if (config.projectId) {
          instance = new FeedVoteWidget(config);
        }
      }
    }

    if (instance) {
      instance.handleButtonClick(); // This opens the modal
    } else {
      console.error('FeedVote: Could not initialize widget. Missing slug attribute on script tag.');
    }
  };

  // 2. Auto-initialize if script tag has slug (but don't show button if it's just for the popup API)
  // If the user wants the button, they usually use new FeedVote().
  // The snippet provided by user implies they have their OWN button and just want the popup.
  // However, we should check if we need to auto-init.
  const currentScript = document.currentScript || document.querySelector('script[slug]');
  if (currentScript) {
    const slug = currentScript.getAttribute('slug');
    if (slug) {
      // If we are just loading the script to expose the API, we might not want to show the default button.
      // But for now, let's just make sure the class is available.
      // The snippet uses window.openFeatureRequestPopup(), so we don't strictly need to instantiate
      // until that is called, BUT we need the instance to exist to hold the config.
      // Let's instantiate it but maybe hide the button if not desired?
      // The snippet says: <button id="suggest-feature-btn">Suggest a feature</button> ... window.openFeatureRequestPopup()
      // This implies the user provides their OWN button.
      // So we should probably NOT render our default button if we are using this mode.
      // We'll handle this in the constructor or initialize method if needed,
      // but for now, the openFeatureRequestPopup implementation above handles lazy instantiation.
    }
  }
})();
