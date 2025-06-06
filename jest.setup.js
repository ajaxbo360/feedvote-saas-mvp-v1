import '@testing-library/jest-dom';

// Mock Next.js Request and Response
global.Request = class {
  constructor(url) {
    this.url = url;
  }
};

jest.mock('next/server', () => ({
  NextResponse: {
    json: (body, init) => ({
      status: init?.status || 200,
      json: async () => body,
    }),
  },
}));

// Mock next/router
jest.mock('next/router', () => ({
  useRouter() {
    return {
      route: '/',
      pathname: '',
      query: {},
      asPath: '',
      push: jest.fn(),
      replace: jest.fn(),
    };
  },
}));

// Mock Supabase client
jest.mock('@supabase/supabase-js', () => ({
  createClient: () => ({
    from: jest.fn(() => ({
      select: jest.fn(),
      insert: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    })),
    auth: {
      getSession: jest.fn(),
      signOut: jest.fn(),
    },
  }),
}));
