export interface WidgetSettings {
  // Appearance
  primaryColor: string;
  secondaryColor: string;
  position: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  theme: 'light' | 'dark';
  buttonText: string;
  customClass?: string;

  // User Parameters
  userParameters: {
    userId: {
      enabled: boolean;
      required: boolean;
    };
    userEmail: {
      enabled: boolean;
      required: boolean;
    };
    userName: {
      enabled: boolean;
      required: boolean;
    };
    imgUrl: {
      enabled: boolean;
      required: boolean;
    };
    userSpend: {
      enabled: boolean;
      required: boolean;
    };
  };

  // Security
  allowAnonymous: boolean;
  whitelistedDomains: string[];

  // Analytics
  enableAnalytics: boolean;
  trackEvents: {
    load: boolean;
    open: boolean;
    submit: boolean;
    error: boolean;
  };
}

export const DEFAULT_WIDGET_SETTINGS: WidgetSettings = {
  primaryColor: '#2dd4bf',
  secondaryColor: '#ff6f61',
  position: 'bottom-right',
  theme: 'light',
  buttonText: 'Give Feedback',
  customClass: '',

  userParameters: {
    userId: {
      enabled: false,
      required: false,
    },
    userEmail: {
      enabled: false,
      required: false,
    },
    userName: {
      enabled: false,
      required: false,
    },
    imgUrl: {
      enabled: false,
      required: false,
    },
    userSpend: {
      enabled: false,
      required: false,
    },
  },

  allowAnonymous: true,
  whitelistedDomains: [],

  enableAnalytics: true,
  trackEvents: {
    load: true,
    open: true,
    submit: true,
    error: true,
  },
};
