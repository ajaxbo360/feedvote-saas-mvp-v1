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
          ${this.config.position === 'bottom-left' ? 'left: 20px !important;' : 'right: 20px !important;'}
          bottom: 20px !important;
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
        }

        .${namespace}-widget-button::before {
          content: '' !important;
          position: absolute !important;
          top: 0 !important;
          left: -100% !important;
          width: 200% !important;
          height: 100% !important;
          background: linear-gradient(
            90deg,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0.1) 50%,
            rgba(255, 255, 255, 0) 100%
          ) !important;
          z-index: 1 !important;
          transition: all 0.6s ease !important;
        }

        .${namespace}-widget-button:hover::before {
          left: 100% !important;
        }

        .${namespace}-widget-button:hover {
          transform: translateY(-1px) !important;
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15) !important;
        }

        .${namespace}-widget-button svg {
          width: 16px !important;
          height: 16px !important;
          fill: none !important;
          stroke: currentColor !important;
        }

        /* Modal styles */
        .${namespace}-modal {
          display: none !important;
          position: fixed !important;
          top: 0 !important;
          left: 0 !important;
          right: 0 !important;
          bottom: 0 !important;
          background: rgba(0, 0, 0, 0.5) !important;
          backdrop-filter: blur(4px) !important;
          z-index: 99999 !important;
          opacity: 0 !important;
          transition: opacity 0.2s ease !important;
          padding: 20px !important;
        }

        .${namespace}-modal.active {
          display: flex !important;
          opacity: 1 !important;
          align-items: center !important;
          justify-content: center !important;
        }

        .${namespace}-modal-content {
          position: relative !important;
          background: ${this.config.theme === 'dark' ? '#1a1a1a' : 'white'} !important;
          width: 90% !important;
          max-width: 500px !important;
          margin: auto !important;
          border-radius: 16px !important;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2) !important;
          transform: translateY(20px) !important;
          transition: transform 0.2s ease !important;
          overflow: hidden !important;
          border: 1px solid ${this.config.theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'} !important;
        }

        .${namespace}-modal.active .${namespace}-modal-content {
          transform: translateY(0) !important;
        }

        .${namespace}-modal-header {
          padding: 20px 24px !important;
          border-bottom: 1px solid ${this.config.theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'} !important;
          display: flex !important;
          justify-content: space-between !important;
          align-items: center !important;
        }

        .${namespace}-modal-header h3 {
          margin: 0 !important;
          font-size: 20px !important;
          font-weight: 600 !important;
          color: ${this.config.theme === 'dark' ? '#fff' : '#0f172a'} !important;
          line-height: 1.4 !important;
        }

        .${namespace}-modal-close {
          background: none !important;
          border: none !important;
          cursor: pointer !important;
          color: ${this.config.theme === 'dark' ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)'} !important;
          padding: 8px !important;
          border-radius: 8px !important;
          transition: all 0.2s ease !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
        }

        .${namespace}-modal-close:hover {
          background: ${this.config.theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'} !important;
          color: ${this.config.theme === 'dark' ? '#fff' : '#000'} !important;
        }

        .${namespace}-feedback-form {
          padding: 24px !important;
          display: flex !important;
          flex-direction: column !important;
          gap: 16px !important;
        }

        .${namespace}-form-group {
          display: flex !important;
          flex-direction: column !important;
          gap: 6px !important;
        }

        .${namespace}-label {
          font-size: 14px !important;
          font-weight: 500 !important;
          color: ${this.config.theme === 'dark' ? '#fff' : '#0f172a'} !important;
        }

        .${namespace}-input {
          width: 100% !important;
          padding: 12px !important;
          border: 1px solid ${this.config.theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'} !important;
          border-radius: 8px !important;
          background: ${this.config.theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'white'} !important;
          color: ${this.config.theme === 'dark' ? '#fff' : '#0f172a'} !important;
          font-size: 14px !important;
          line-height: 1.5 !important;
          transition: all 0.2s ease !important;
        }

        .${namespace}-input:focus {
          outline: none !important;
          border-color: ${this.config.primaryColor} !important;
          box-shadow: 0 0 0 3px ${this.config.primaryColor}33 !important;
        }

        .${namespace}-textarea {
          min-height: 120px !important;
          resize: vertical !important;
        }

        .${namespace}-select {
          appearance: none !important;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E") !important;
          background-repeat: no-repeat !important;
          background-position: right 12px center !important;
          background-size: 16px !important;
          padding-right: 40px !important;
        }

        .${namespace}-submit-button {
          background: linear-gradient(to right, ${this.config.primaryColor}, ${this.config.secondaryColor}) !important;
          color: white !important;
          border: none !important;
          padding: 12px !important;
          border-radius: 8px !important;
          cursor: pointer !important;
          font-weight: 600 !important;
          font-size: 14px !important;
          transition: all 0.2s ease !important;
          position: relative !important;
          overflow: hidden !important;
        }

        .${namespace}-submit-button::before {
          content: '' !important;
          position: absolute !important;
          top: 0 !important;
          left: -100% !important;
          width: 200% !important;
          height: 100% !important;
          background: linear-gradient(
            90deg,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0.1) 50%,
            rgba(255, 255, 255, 0) 100%
          ) !important;
          z-index: 1 !important;
          transition: all 0.6s ease !important;
        }

        .${namespace}-submit-button:hover::before {
          left: 100% !important;
        }

        .${namespace}-submit-button:hover {
          transform: translateY(-1px) !important;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1) !important;
        }

        .${namespace}-submit-button:disabled {
          opacity: 0.7 !important;
          cursor: not-allowed !important;
        }

        /* Message styles */
        .${namespace}-success {
          color: #10b981 !important;
          text-align: center !important;
          padding: 16px !important;
          background: rgba(16, 185, 129, 0.1) !important;
          border-radius: 8px !important;
          font-size: 14px !important;
          display: flex !important;
          flex-direction: column !important;
          gap: 8px !important;
          align-items: center !important;
        }

        .${namespace}-error {
          color: #ef4444 !important;
          text-align: center !important;
          padding: 16px !important;
          background: rgba(239, 68, 68, 0.1) !important;
          border-radius: 8px !important;
          font-size: 14px !important;
        }

        /* Responsive styles */
        @media (max-width: 640px) {
          .${namespace}-modal-content {
            width: 100% !important;
            margin: 16px !important;
            max-height: calc(100vh - 32px) !important;
          }
        }
      `;

      // Create a scoped stylesheet
      const styleSheet = document.createElement('style');
      styleSheet.setAttribute('data-widget', namespace);
      styleSheet.textContent = styles;
      document.head.appendChild(styleSheet);
    }

    createContainer() {
      // Create main container
      this.container = document.createElement('div');
      this.container.className = `${namespace}-widget-container ${this.config.customClass}`;

      // Create trigger button
      this.button = document.createElement('button');
      this.button.className = `${namespace}-widget-button`;
      this.button.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        </svg>
        ${this.config.buttonText}
      `;

      // Create modal
      this.modal = document.createElement('div');
      this.modal.className = `${namespace}-modal`;
      this.modal.innerHTML = `
        <div class="${namespace}-modal-content">
          <div class="${namespace}-modal-header">
            <h3>Create a feature request</h3>
            <button class="${namespace}-modal-close">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M18 6L6 18M6 6l12 12"></path>
              </svg>
            </button>
          </div>
          <form class="${namespace}-feedback-form">
            <div class="${namespace}-form-group">
              <label class="${namespace}-label" for="${namespace}-title">Title</label>
              <input 
                type="text" 
                id="${namespace}-title"
                class="${namespace}-input" 
                placeholder="My awesome feature request"
                required
              >
            </div>

            <div class="${namespace}-form-group">
              <label class="${namespace}-label" for="${namespace}-description">Description</label>
              <textarea 
                id="${namespace}-description"
                class="${namespace}-input ${namespace}-textarea" 
                placeholder="Describe your feature request in detail..."
                rows="4"
                required
              ></textarea>
            </div>

            <div class="${namespace}-form-group">
              <label class="${namespace}-label" for="${namespace}-type">Tags (optional)</label>
              <select 
                id="${namespace}-type"
                class="${namespace}-input ${namespace}-select"
              >
                <option value="">Select...</option>
                <option value="feature">Feature Request</option>
                <option value="bug">Bug Report</option>
                <option value="improvement">Improvement</option>
              </select>
            </div>

            <div class="${namespace}-form-group">
              <label class="${namespace}-label" for="${namespace}-attachment">
                Attach File (optional)
              </label>
              <div class="${namespace}-file-input">
                <input 
                  type="file" 
                  id="${namespace}-attachment"
                  accept=".jpg,.jpeg,.png,.svg"
                  class="${namespace}-input"
                >
                <small class="${namespace}-file-help">
                  .jpeg, .jpg, .png, .svg up to 5MB
                </small>
              </div>
            </div>

            <button type="submit" class="${namespace}-submit-button">
              Submit
            </button>
          </form>
        </div>
      `;

      // Add elements to DOM
      this.container.appendChild(this.button);
      document.body.appendChild(this.container);
      document.body.appendChild(this.modal);
    }

    attachEventListeners() {
      // Toggle modal
      this.button.addEventListener('click', () => this.toggleModal());

      // Close modal on backdrop click
      this.modal.addEventListener('click', (e) => {
        if (e.target === this.modal) {
          this.toggleModal(false);
        }
      });

      // Close button
      this.modal.querySelector(`.${namespace}-modal-close`).addEventListener('click', () => {
        this.toggleModal(false);
      });

      // Form submission
      const form = this.modal.querySelector(`.${namespace}-feedback-form`);
      form.addEventListener('submit', (e) => this.handleSubmit(e));
    }

    async handleSubmit(e) {
      e.preventDefault();
      const form = e.target;
      const title = form.querySelector('input').value;
      const description = form.querySelector('textarea').value;

      try {
        const response = await fetch(`${this.config.apiUrl || ''}/api/widget/submit`, {
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

        if (!response.ok) throw new Error('Failed to submit feedback');

        // Show success message
        form.innerHTML = `
          <div class="${namespace}-success">
            <h3>Thank you!</h3>
            <p>Your feedback has been submitted successfully.</p>
          </div>
        `;

        // Close modal after delay
        setTimeout(() => {
          this.toggleModal(false);
          form.reset();
        }, 2000);
      } catch (error) {
        console.error('Error submitting feedback:', error);
        form.innerHTML += `
          <div class="${namespace}-error">
            Failed to submit feedback. Please try again.
          </div>
        `;
      }
    }

    toggleModal(show = true) {
      this.modal.classList.toggle('active', show);
      if (show) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    }

    // Utility function to adjust color brightness
    adjustColor(color, amount) {
      return (
        '#' +
        color
          .replace(/^#/, '')
          .replace(/../g, (color) =>
            ('0' + Math.min(255, Math.max(0, parseInt(color, 16) + amount)).toString(16)).substr(-2),
          )
      );
    }
  }

  // Expose the widget to the global scope
  window.FeedVote = FeedVoteWidget;
})();
