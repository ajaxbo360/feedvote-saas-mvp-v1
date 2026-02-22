import { describe, expect, it, beforeEach, jest } from '@jest/globals';
import { POST as handleSubmit } from '../submit/route';
import { GET as handleGetFeedback } from '../feedback/[projectId]/route';
import { POST as handleVote } from '../vote/route';
import { POST as handleUpload } from '../upload/route';

// Mock Supabase client
const mockInsert = jest.fn();
const mockSelect = jest.fn();
const mockUpdate = jest.fn();
const mockUpload = jest.fn();
const mockGetPublicUrl = jest.fn();
const mockEq = jest.fn();
const mockSingle = jest.fn();
const mockOrder = jest.fn();

const mockChain = {
  select: mockSelect,
  insert: mockInsert,
  update: mockUpdate,
  eq: mockEq,
  single: mockSingle,
  order: mockOrder,
};

// Make functions return the chain object by default
mockSelect.mockReturnValue(mockChain);
mockInsert.mockReturnValue(mockChain);
mockUpdate.mockReturnValue(mockChain);
mockEq.mockReturnValue(mockChain);
mockSingle.mockReturnValue(mockChain);
mockOrder.mockReturnValue(mockChain);

jest.mock('@/utils/supabase/server', () => ({
  createClient: jest.fn(() => ({
    from: jest.fn(() => mockChain),
    rpc: jest.fn().mockImplementation((name, params) => {
      if (name === 'increment_feedback_votes') {
        return Promise.resolve({ data: { votes: 1 }, error: null });
      }
      return Promise.resolve({ data: null, error: null });
    }),
    storage: {
      from: jest.fn(() => ({
        upload: mockUpload,
        getPublicUrl: mockGetPublicUrl,
      })),
    },
  })),
}));

// Mock supabase lib for non-server utils if used
jest.mock('@/lib/supabase', () => ({
  supabase: {
    from: jest.fn(() => mockChain),
    rpc: jest.fn().mockImplementation((name, params) => {
      if (name === 'increment_feedback_votes') {
        return Promise.resolve({ data: { votes: 1 }, error: null });
      }
      return Promise.resolve({ data: null, error: null });
    }),
  },
}));

describe('Widget API', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Default mock implementations
    // For single(), it returns a Promise resolving to data
    mockSingle.mockResolvedValue({
      data: {
        id: 'test-project-id',
        slug: 'test-project',
        widget_settings: {},
      },
      error: null,
    });

    // For chains ending in order() or just select(), we need the chain to be awaitable
    // We can simulate this by adding a then method to mockChain, but it's cleaner to just mock the return value of the last called method if we know it.
    // However, since we share mockChain, it's hard.

    // Let's make mockChain then-able for the list query
    // @ts-ignore
    mockChain.then = jest.fn((resolve) =>
      resolve({
        data: [
          {
            id: 'test-id',
            title: 'Test Feedback',
            votes: 0,
          },
        ],
        error: null,
      }),
    );

    mockUpload.mockResolvedValue({ data: { path: 'test-path' }, error: null });
    mockGetPublicUrl.mockReturnValue({ data: { publicUrl: 'https://example.com/test.jpg' } });
  });

  describe('POST /api/widget/submit', () => {
    it('should successfully submit feedback with all fields', async () => {
      // First call to single() is for project lookup
      mockSingle.mockResolvedValueOnce({
        data: { id: 'test-project-id' },
        error: null,
      });

      // Second call to single() is for feedback insertion
      mockSingle.mockResolvedValueOnce({
        data: { id: 'test-id' },
        error: null,
      });

      const body = {
        project_id: 'test-project',
        title: 'Test Feedback',
        description: 'Test Description',
        tags: ['feature', 'bug'],
        attachment_url: 'https://example.com/image.jpg',
      };

      const req = new Request('http://localhost/api/widget/submit', {
        method: 'POST',
        body: JSON.stringify(body),
      });

      const res = await handleSubmit(req);
      const data = await res.json();

      expect(res.status).toBe(201);
      expect(data).toEqual({ id: 'test-id' });
    });

    it('should validate required fields', async () => {
      const body = {
        project_id: 'test-project',
        // Missing title and description
      };

      const req = new Request('http://localhost/api/widget/submit', {
        method: 'POST',
        body: JSON.stringify(body),
      });

      const res = await handleSubmit(req);
      const data = await res.json();

      expect(res.status).toBe(400);
      expect(data).toHaveProperty('error');
    });
  });

  describe('GET /api/widget/feedback/[projectId]', () => {
    it('should return project feedback', async () => {
      // The chain is awaited directly, so mockChain.then is used
      // We set the default implementation in beforeEach

      const req = new Request('http://localhost/api/widget/feedback/test-project');
      const res = await handleGetFeedback(req, { params: { projectId: 'test-project' } });
      const data = await res.json();

      expect(res.status).toBe(200);
      expect(data.data).toHaveLength(1);
      expect(data.data[0].title).toBe('Test Feedback');
    });
  });

  describe('POST /api/widget/vote', () => {
    it('should successfully vote on feedback', async () => {
      const body = {
        project_id: 'test-project',
        feedback_id: 'test-id',
      };

      const req = new Request('http://localhost/api/widget/vote', {
        method: 'POST',
        body: JSON.stringify(body),
      });

      const res = await handleVote(req);
      const data = await res.json();

      expect(res.status).toBe(200);
      expect(data.data.votes).toBe(1);
    });

    it('should validate required fields', async () => {
      const body = {
        project_id: 'test-project',
        // Missing feedback_id
      };

      const req = new Request('http://localhost/api/widget/vote', {
        method: 'POST',
        body: JSON.stringify(body),
      });

      const res = await handleVote(req);

      expect(res.status).toBe(400);
    });
  });
});
