import axios from 'axios';
import type { Community, Post } from './types';

// API Service using Axios
export class ApiService {
  private baseURL = 'http://127.0.0.1:8000/api';
  private axiosInstance;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: this.baseURL,
    });

    // Interceptor para agregar token automáticamente
    this.axiosInstance.interceptors.request.use((config) => {
      const token = localStorage.getItem('access_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Interceptor para manejar errores de autenticación
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.clear();
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // Communities API
  getCommunities = async (): Promise<Community[]> => {
    const response = await this.axiosInstance.get('/communities/');
    return response.data;
  };

  createCommunity = async (data: FormData): Promise<Community> => {
    const response = await this.axiosInstance.post('/communities/', data);
    return response.data;
  };

  updateCommunity = async (id: string, data: FormData): Promise<Community> => {
    const response = await this.axiosInstance.put(`/communities/specific/${id}/`, data);
    return response.data;
  };

  deleteCommunity = async (id: string): Promise<void> => {
    await this.axiosInstance.delete(`/communities/specific/${id}/`);
  };

  joinCommunity = async (id: string): Promise<void> => {
    await this.axiosInstance.patch(`/communities/join/${id}/`);
  };

  getSimilarCommunities = async (name: string): Promise<Community[]> => {
    const response = await this.axiosInstance.get(`/communities/${name}/`);
    return response.data;
  };

  // Posts API
  getPostsByCommunity = async (communityId: string): Promise<Post[]> => {
    const response = await this.axiosInstance.get(`/communities/post/community/${communityId}/`);
    return response.data;
  };

  createPost = async (data: { title: string; text: string; community: string; parent_post?: string }): Promise<void> => {
    await this.axiosInstance.post('/communities/post/', data);
  };

  updatePost = async (id: string, data: { title: string; text: string }): Promise<Post> => {
    const response = await this.axiosInstance.put(`/communities/post/${id}/`, data);
    return response.data;
  };

  deletePost = async (id: string): Promise<void> => {
    await this.axiosInstance.delete(`/communities/post/${id}/`);
  };

  likePost = async (postId: string): Promise<void> => {
    await this.axiosInstance.patch(`/communities/post/like/${postId}/`);
  };

  dislikePost = async (postId: string): Promise<void> => {
    await this.axiosInstance.patch(`/communities/post/dislike/${postId}/`);
  };
}

export const api = new ApiService();