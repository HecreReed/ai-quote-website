import axios from 'axios';
import type { QuotationRequest, QuotationResponse } from '../types/quotation';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
});

export const quotationService = {
  async generateQuotation(request: QuotationRequest): Promise<QuotationResponse> {
    const formData = new FormData();
    
    // 添加表单字段
    Object.entries(request).forEach(([key, value]) => {
      if (key === 'files') return; // 文件单独处理
      if (value !== undefined && value !== null) {
        formData.append(key, String(value));
      }
    });
    
    // 添加文件
    if (request.files) {
      request.files.forEach(file => {
        formData.append('files', file);
      });
    }
    
    const response = await api.post('/api/quotation/generate', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  },

  async healthCheck(): Promise<{ status: string }> {
    const response = await api.get('/api/quotation/health');
    return response.data;
  }
};