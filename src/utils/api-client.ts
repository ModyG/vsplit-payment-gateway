import { VSplitConfig, ApiResponse } from '../types';

/**
 * API Client for backend communication
 */
export class ApiClient {
  private config: VSplitConfig;
  private baseHeaders: Record<string, string>;

  constructor(config: VSplitConfig) {
    this.config = config;
    this.baseHeaders = {
      'Content-Type': 'application/json',
      ...(config.apiKey && { Authorization: `Bearer ${config.apiKey}` }),
    };
  }

  /**
   * Make a GET request
   */
  public async get<T = Record<string, unknown>>(
    endpoint: string
  ): Promise<ApiResponse<T>> {
    return this.request<T>('GET', endpoint);
  }

  /**
   * Make a POST request
   */
  public async post<T = Record<string, unknown>>(
    endpoint: string,
    data?: Record<string, unknown>
  ): Promise<ApiResponse<T>> {
    return this.request<T>('POST', endpoint, data);
  }

  /**
   * Make a PUT request
   */
  public async put<T = Record<string, unknown>>(
    endpoint: string,
    data?: Record<string, unknown>
  ): Promise<ApiResponse<T>> {
    return this.request<T>('PUT', endpoint, data);
  }

  /**
   * Make a DELETE request
   */
  public async delete<T = Record<string, unknown>>(
    endpoint: string
  ): Promise<ApiResponse<T>> {
    return this.request<T>('DELETE', endpoint);
  }

  /**
   * Generic request method
   */
  private async request<T>(
    method: string,
    endpoint: string,
    data?: Record<string, unknown>
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${this.config.apiEndpoint}${endpoint}`;
      const options: RequestInit = {
        method,
        headers: this.baseHeaders,
        ...(data && { body: JSON.stringify(data) }),
      };

      const response = await fetch(url, options);
      const responseData = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error:
            responseData.error ||
            `HTTP ${response.status}: ${response.statusText}`,
          code: responseData.code || response.status.toString(),
        };
      }

      return {
        success: true,
        data: responseData.data || responseData,
        metadata: responseData.metadata,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error',
        code: 'NETWORK_ERROR',
      };
    }
  }

  /**
   * Upload file (for future use)
   */
  public async uploadFile(endpoint: string, file: File): Promise<ApiResponse> {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${this.config.apiEndpoint}${endpoint}`, {
        method: 'POST',
        headers: {
          ...(this.config.apiKey && {
            Authorization: `Bearer ${this.config.apiKey}`,
          }),
        },
        body: formData,
      });

      const responseData = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error:
            responseData.error ||
            `HTTP ${response.status}: ${response.statusText}`,
          code: responseData.code || response.status.toString(),
        };
      }

      return {
        success: true,
        data: responseData.data || responseData,
        metadata: responseData.metadata,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Upload error',
        code: 'UPLOAD_ERROR',
      };
    }
  }
}
