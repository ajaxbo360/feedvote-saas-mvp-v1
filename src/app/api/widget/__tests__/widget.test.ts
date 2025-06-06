import { describe, expect, it, beforeEach, jest } from '@jest/globals';
import { createMocks } from 'node-mocks-http';
import { handleSubmit } from '../submit/route';
import { handleGetFeedback } from '../feedback/[projectId]/route';
import { handleVote } from '../vote/route';
import { handleUpload } from '../upload/route';
import type { FeedbackSubmission, FeedbackVote } from '@/types/api';

jest.mock('@/lib/supabase', () => ({
  supabase: {
    from: jest.fn(() => ({
      insert: jest.fn().mockResolvedValue({ data: { id: 'test-id' }, error: null }),
      select: jest.fn().mockResolvedValue({
        data: [
          {
            id: 'test-id',
            project_id: 'test-project',
            title: 'Test Feedback',
            description: 'Test Description',
            tags: ['feature', 'bug'],
            attachment_url: 'https://example.com/image.jpg',
            votes: 0,
            created_at: '2024-03-20T00:00:00.000Z',
            updated_at: '2024-03-20T00:00:00.000Z',
          },
        ],
        error: null,
      }),
      update: jest.fn().mockResolvedValue({ data: { votes: 1 }, error: null }),
    })),
    storage: {
      from: jest.fn(() => ({
        upload: jest.fn().mockResolvedValue({ data: { path: 'test-path' }, error: null }),
        getPublicUrl: jest.fn(() => ({ data: { publicUrl: 'https://example.com/test.jpg' } })),
      })),
    },
  },
}));

describe('Widget API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/widget/submit', () => {
    it('should successfully submit feedback with all fields', async () => {
      const { req, res } = createMocks({
        method: 'POST',
        body: {
          project_id: 'test-project',
          title: 'Test Feedback',
          description: 'Test Description',
          tags: ['feature', 'bug'],
          attachment_url: 'https://example.com/image.jpg',
        } as FeedbackSubmission,
      });

      await handleSubmit(req, res);

      expect(res._getStatusCode()).toBe(201);
      expect(JSON.parse(res._getData())).toEqual({
        data: { id: 'test-id' },
      });
    });

    it('should accept feedback without optional fields', async () => {
      const { req, res } = createMocks({
        method: 'POST',
        body: {
          project_id: 'test-project',
          title: 'Test Feedback',
          description: 'Test Description',
        } as FeedbackSubmission,
      });

      await handleSubmit(req, res);

      expect(res._getStatusCode()).toBe(201);
    });

    it('should validate required fields', async () => {
      const { req, res } = createMocks({
        method: 'POST',
        body: {
          project_id: 'test-project',
          // Missing title and description
        },
      });

      await handleSubmit(req, res);

      expect(res._getStatusCode()).toBe(400);
      expect(JSON.parse(res._getData())).toHaveProperty('error');
    });
  });

  describe('POST /api/widget/upload', () => {
    it('should successfully upload a file', async () => {
      const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      const formData = new FormData();
      formData.append('file', file);
      formData.append('project_id', 'test-project');

      const { req, res } = createMocks({
        method: 'POST',
        body: formData,
      });

      await handleUpload(req, res);

      expect(res._getStatusCode()).toBe(200);
      expect(JSON.parse(res._getData())).toEqual({
        data: { url: 'https://example.com/test.jpg' },
      });
    });

    it('should validate file type', async () => {
      const file = new File(['test'], 'test.txt', { type: 'text/plain' });
      const formData = new FormData();
      formData.append('file', file);
      formData.append('project_id', 'test-project');

      const { req, res } = createMocks({
        method: 'POST',
        body: formData,
      });

      await handleUpload(req, res);

      expect(res._getStatusCode()).toBe(400);
      expect(JSON.parse(res._getData())).toHaveProperty('error');
    });
  });

  describe('GET /api/widget/feedback/[projectId]', () => {
    it('should return project feedback with all fields', async () => {
      const { req, res } = createMocks({
        method: 'GET',
        query: { projectId: 'test-project' },
      });

      await handleGetFeedback(req, res);

      expect(res._getStatusCode()).toBe(200);
      expect(JSON.parse(res._getData())).toEqual({
        data: [
          {
            id: 'test-id',
            project_id: 'test-project',
            title: 'Test Feedback',
            description: 'Test Description',
            tags: ['feature', 'bug'],
            attachment_url: 'https://example.com/image.jpg',
            votes: 0,
            created_at: '2024-03-20T00:00:00.000Z',
            updated_at: '2024-03-20T00:00:00.000Z',
          },
        ],
      });
    });

    it('should handle invalid project ID', async () => {
      const { req, res } = createMocks({
        method: 'GET',
        query: { projectId: '' },
      });

      await handleGetFeedback(req, res);

      expect(res._getStatusCode()).toBe(400);
      expect(JSON.parse(res._getData())).toHaveProperty('error');
    });
  });

  describe('POST /api/widget/vote', () => {
    it('should successfully vote on feedback', async () => {
      const { req, res } = createMocks({
        method: 'POST',
        body: {
          project_id: 'test-project',
          feedback_id: 'test-id',
        } as FeedbackVote,
      });

      await handleVote(req, res);

      expect(res._getStatusCode()).toBe(200);
      expect(JSON.parse(res._getData())).toEqual({
        data: { votes: 1 },
      });
    });

    it('should validate required fields', async () => {
      const { req, res } = createMocks({
        method: 'POST',
        body: {
          project_id: 'test-project',
          // Missing feedback_id
        },
      });

      await handleVote(req, res);

      expect(res._getStatusCode()).toBe(400);
      expect(JSON.parse(res._getData())).toHaveProperty('error');
    });
  });
});
