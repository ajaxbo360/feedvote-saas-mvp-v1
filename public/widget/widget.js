(function () {
  // Configuration object to store widget settings
  const config = {
    baseUrl: 'https://features.vote',
    theme: 'light',
  };

  // Helper function to get script attributes
  function getScriptAttributes() {
    const script = document.currentScript;
    return {
      slug: script.getAttribute('slug'),
      userId: script.getAttribute('user_id'),
      userEmail: script.getAttribute('user_email'),
      userName: script.getAttribute('user_name'),
      imgUrl: script.getAttribute('img_url'),
      userSpend: script.getAttribute('user_spend'),
      colorMode: script.getAttribute('color_mode') || 'light',
      token: script.getAttribute('token'),
      variant: script.getAttribute('variant') || 'v1',
    };
  }

  // Helper function to create and style the iframe
  function createIframe(containerId, path) {
    const container = document.getElementById(containerId);
    if (!container) {
      console.error(`Container with id "${containerId}" not found`);
      return;
    }

    const attrs = getScriptAttributes();
    const iframe = document.createElement('iframe');

    // Build URL with parameters
    const params = new URLSearchParams({
      slug: attrs.slug,
      ...(attrs.userId && { user_id: attrs.userId }),
      ...(attrs.userEmail && { user_email: attrs.userEmail }),
      ...(attrs.userName && { user_name: attrs.userName }),
      ...(attrs.imgUrl && { img_url: attrs.imgUrl }),
      ...(attrs.userSpend && { user_spend: attrs.userSpend }),
      ...(attrs.token && { token: attrs.token }),
      color_mode: attrs.colorMode,
      variant: attrs.variant,
    });

    iframe.src = `${config.baseUrl}${path}?${params.toString()}`;
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.style.border = 'none';
    iframe.style.borderRadius = '8px';

    // Clear container and append iframe
    container.innerHTML = '';
    container.appendChild(iframe);
  }

  // Function to load the voting board
  window.loadVotingBoard = function (containerId) {
    createIframe(containerId, '/embed/voting-board');
  };

  // Function to load the roadmap
  window.loadRoadmap = function (containerId) {
    createIframe(containerId, '/embed/roadmap');
  };

  // Function to load the changelog
  window.loadChangelog = function (containerId) {
    createIframe(containerId, '/embed/changelog');
  };

  // Function to open the feature request popup
  window.openFeatureRequestPopup = function () {
    const attrs = getScriptAttributes();
    const params = new URLSearchParams({
      slug: attrs.slug,
      ...(attrs.userId && { user_id: attrs.userId }),
      ...(attrs.userEmail && { user_email: attrs.userEmail }),
      ...(attrs.userName && { user_name: attrs.userName }),
      ...(attrs.imgUrl && { img_url: attrs.imgUrl }),
      ...(attrs.userSpend && { user_spend: attrs.userSpend }),
      ...(attrs.token && { token: attrs.token }),
      color_mode: attrs.colorMode,
    });

    // Create popup window
    const width = 500;
    const height = 700;
    const left = (window.innerWidth - width) / 2;
    const top = (window.innerHeight - height) / 2;

    window.open(
      `${config.baseUrl}/embed/suggest-feature?${params.toString()}`,
      'suggestFeature',
      `width=${width},height=${height},top=${top},left=${left}`,
    );
  };

  // Message handling for cross-origin communication
  window.addEventListener('message', function (event) {
    // Verify origin
    if (event.origin !== config.baseUrl) return;

    // Handle different message types
    switch (event.data.type) {
      case 'THEME_CHANGE':
        config.theme = event.data.theme;
        break;
      case 'CLOSE_POPUP':
        // Handle popup close event if needed
        break;
      // Add more message handlers as needed
    }
  });
})();
