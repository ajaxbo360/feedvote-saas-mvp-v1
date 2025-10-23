import { POST } from '../route';
import { createServerSupabaseClient } from '@/utils/supabase/server';

// Mock the server Supabase client
jest.mock('@/utils/supabase/server', () => ({
  createServerSupabaseClient: jest.fn(),
}));

// Mock Request implementation
class MockRequest {
  private body: string;

  constructor(url: string, options: { method: string; body: any }) {
    this.body = JSON.stringify(options.body);
  }

  async json() {
    return JSON.parse(this.body);
  }
}

describe('Widget Submit API', () => {
  let mockSupabaseClient: any;
  let mockQueryChain: any;

  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();

    // Create the mock query chain
    mockQueryChain = {
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn(),
      insert: jest.fn().mockReturnThis(),
    };

    // Create a fresh mock client for each test
    mockSupabaseClient = {
      from: jest.fn().mockReturnValue(mockQueryChain),
    };

    // Make createServerSupabaseClient return our mock client
    (createServerSupabaseClient as jest.Mock).mockResolvedValue(mockSupabaseClient);
  });

  it('accepts valid feedback submissions', async () => {
    const mockFeedback = {
      project_id: '123',
      title: 'Test Feedback',
      description: 'This is a test feedback',
      user_id: 'user123', // Optional
      user_email: 'test@example.com', // Optional
    };

    // Mock successful project validation
    mockQueryChain.single
      .mockResolvedValueOnce({
        data: { id: '123' },
        error: null,
      })
      .mockResolvedValueOnce({
        data: { id: 'feedback123', ...mockFeedback },
        error: null,
      });

    const request = new MockRequest('http://localhost', {
      method: 'POST',
      body: mockFeedback,
    }) as unknown as Request;

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toHaveProperty('id');
    expect(mockSupabaseClient.from).toHaveBeenCalledWith('projects');
    expect(mockSupabaseClient.from).toHaveBeenCalledWith('feedback');
  });

  it('rejects submissions with missing required fields', async () => {
    const invalidFeedback = {
      project_id: '123',
      // Missing title and description
    };

    const request = new MockRequest('http://localhost', {
      method: 'POST',
      body: invalidFeedback,
    }) as unknown as Request;

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data).toHaveProperty('error');
    expect(data.error).toMatch(/required/i);
  });

  it('validates project_id exists', async () => {
    const mockFeedback = {
      project_id: 'invalid_id',
      title: 'Test Feedback',
      description: 'This is a test feedback',
    };

    // Mock project not found
    mockQueryChain.single.mockResolvedValueOnce({
      data: null,
      error: { message: 'Project not found' },
    });

    const request = new MockRequest('http://localhost', {
      method: 'POST',
      body: mockFeedback,
    }) as unknown as Request;

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.error).toMatch(/project not found/i);
  });

  it('creates feedback with correct initial state', async () => {
    const mockFeedback = {
      project_id: '123',
      title: 'Test Feedback',
      description: 'This is a test feedback',
    };

    const createdFeedback = {
      id: 'feedback123',
      ...mockFeedback,
      status: 'Open',
      votes: 0,
      created_at: new Date().toISOString(),
    };

    // Mock successful project validation
    mockQueryChain.single
      .mockResolvedValueOnce({
        data: { id: '123' },
        error: null,
      })
      .mockResolvedValueOnce({
        data: createdFeedback,
        error: null,
      });

    const request = new MockRequest('http://localhost', {
      method: 'POST',
      body: mockFeedback,
    }) as unknown as Request;

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toMatchObject({
      status: 'Open',
      votes: 0,
    });
    expect(data).toHaveProperty('created_at');
  });

  it('handles database errors gracefully', async () => {
    const mockFeedback = {
      project_id: '123',
      title: 'Test Feedback',
      description: 'This is a test feedback',
    };

    // Mock successful project validation but failed insert
    mockQueryChain.single
      .mockResolvedValueOnce({
        data: { id: '123' },
        error: null,
      })
      .mockRejectedValueOnce(new Error('Database connection error'));

    const request = new MockRequest('http://localhost', {
      method: 'POST',
      body: mockFeedback,
    }) as unknown as Request;

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toMatch(/error submitting feedback/i);
  });
});
