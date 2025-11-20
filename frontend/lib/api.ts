const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface User {
  id: number;
  email: string;
  created_at: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
}

export interface GenerateRequest {
  content_type: 'blog' | 'email' | 'social';
  tone: 'formal' | 'casual' | 'funny' | 'persuasive';
  length: 'short' | 'medium' | 'long';
  product: string;
  audience: string;
  extra_instructions?: string;
}

export interface GeneratedContent {
  id: number;
  generated_content: string;
  model_used: string;
  created_at: string;
}

export interface ContentHistory {
  id: number;
  content_type: string;
  tone: string;
  length: string;
  product: string;
  audience: string;
  extra_instructions?: string;
  generated_content: string;
  model_used: string;
  created_at: string;
}

class APIClient {
  private baseURL: string;

  constructor() {
    this.baseURL = API_URL;
  }

  private getAuthHeader(): HeadersInit {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'An error occurred' }));
      throw new Error(error.detail || `HTTP ${response.status}`);
    }
    return response.json();
  }

  // Auth endpoints
  async register(data: RegisterData): Promise<User> {
    const response = await fetch(`${this.baseURL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return this.handleResponse<User>(response);
  }

  async login(credentials: LoginCredentials): Promise<{ access_token: string; token_type: string }> {
    const response = await fetch(`${this.baseURL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    return this.handleResponse(response);
  }

  // Content generation endpoints
  async generateContent(request: GenerateRequest): Promise<GeneratedContent> {
    const response = await fetch(`${this.baseURL}/api/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeader(),
      },
      body: JSON.stringify(request),
    });
    return this.handleResponse<GeneratedContent>(response);
  }

  async getHistory(): Promise<ContentHistory[]> {
    const response = await fetch(`${this.baseURL}/api/history`, {
      headers: this.getAuthHeader(),
    });
    return this.handleResponse<ContentHistory[]>(response);
  }

  async getContentById(id: number): Promise<ContentHistory> {
    const response = await fetch(`${this.baseURL}/api/history/${id}`, {
      headers: this.getAuthHeader(),
    });
    return this.handleResponse<ContentHistory>(response);
  }

  async deleteContent(id: number): Promise<void> {
    const response = await fetch(`${this.baseURL}/api/history/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeader(),
    });
    if (!response.ok) {
      throw new Error('Failed to delete content');
    }
  }

  // Health check
  async healthCheck(): Promise<{ status: string; service: string; version: string }> {
    const response = await fetch(`${this.baseURL}/health`);
    return this.handleResponse(response);
  }
}

export const apiClient = new APIClient();
