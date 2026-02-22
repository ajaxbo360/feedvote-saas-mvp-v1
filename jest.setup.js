import '@testing-library/jest-dom';

// Mock Next.js Request and Response
global.Request = class {
  constructor(url, init = {}) {
    this.url = url;
    this.method = init.method || 'GET';
    this.body = init.body;
    this.headers = new Headers(init.headers);
  }

  async json() {
    return typeof this.body === 'string' ? JSON.parse(this.body) : this.body;
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
