import { GET } from '../route';
import { createServerSupabaseClient } from '@/utils/supabase/server';

// Mock the server Supabase client
jest.mock('@/utils/supabase/server', () => ({
  createServerSupabaseClient: jest.fn(),
}));

describe('Widget Config API', () => {
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
    };

    // Create a fresh mock client for each test
    mockSupabaseClient = {
      from: jest.fn().mockReturnValue(mockQueryChain),
    };

    // Make createServerSupabaseClient return our mock client
    (createServerSupabaseClient as jest.Mock).mockReturnValue(mockSupabaseClient);
  });

  it('returns project config for valid slug', async () => {
    const mockProject = {
      id: '123',
      name: 'Test Project',
      branding_colors: {
        primary: '#ff0000',
        secondary: '#00ff00',
      },
    };

    // Set up the mock response
    mockQueryChain.single.mockResolvedValue({
      data: mockProject,
      error: null,
    });

    const response = await GET(new Request('http://localhost'), {
      params: { slug: 'test-project' },
    });
    const data = await response.json();

    // Verify the query chain
    expect(mockSupabaseClient.from).toHaveBeenCalledWith('projects');
    expect(mockQueryChain.select).toHaveBeenCalledWith('id, name, branding_colors');
    expect(mockQueryChain.eq).toHaveBeenCalledWith('slug', 'test-project');

    // Verify the response
    expect(response.status).toBe(200);
    expect(data).toEqual({
      project_id: mockProject.id,
      name: mockProject.name,
      branding: {
        colors: mockProject.branding_colors,
      },
    });
  });

  it('returns 404 for invalid slug', async () => {
    // Mock a not found response
    mockQueryChain.single.mockResolvedValue({
      data: null,
      error: { message: 'Not found' },
    });

    const response = await GET(new Request('http://localhost'), {
      params: { slug: 'invalid-slug' },
    });
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data).toEqual({ error: 'Project not found' });
  });

  it('returns default colors when branding_colors is null', async () => {
    const mockProject = {
      id: '123',
      name: 'Test Project',
      branding_colors: null,
    };

    mockQueryChain.single.mockResolvedValue({
      data: mockProject,
      error: null,
    });

    const response = await GET(new Request('http://localhost'), {
      params: { slug: 'test-project' },
    });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.branding.colors).toEqual({
      primary: '#2dd4bf',
      secondary: '#ff6f61',
    });
  });

  it('returns 500 for unexpected errors', async () => {
    // Mock a database error
    mockQueryChain.single.mockRejectedValue(new Error('Database error'));

    const response = await GET(new Request('http://localhost'), {
      params: { slug: 'test-project' },
    });
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toEqual({ error: 'Internal server error' });
  });
});
