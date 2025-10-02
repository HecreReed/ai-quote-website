import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import type { QuotationRequest, QuotationResponse } from '../types/quotation';
import { quotationService } from '../services/api';
import QuotationResult from './QuotationResult';

const QuotationForm: React.FC = () => {
  const [formData, setFormData] = useState<QuotationRequest>({
    customerType: 'domestic',
    clientType: 'student',
    pricePreference: 'medium',
    taskDescription: '',
    deadline: '',
    isUrgent: false,
    files: []
  });

  const [quotationResult, setQuotationResult] = useState<QuotationResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onDrop = (acceptedFiles: File[]) => {
    setFormData(prev => ({
      ...prev,
      files: [...(prev.files || []), ...acceptedFiles]
    }));
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/msword': ['.doc'],
      'image/*': ['.png', '.jpg', '.jpeg', '.gif']
    },
    maxSize: 10 * 1024 * 1024 // 10MB
  });

  const removeFile = (index: number) => {
    setFormData(prev => ({
      ...prev,
      files: prev.files?.filter((_, i) => i !== index) || []
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const result = await quotationService.generateQuotation(formData);
      setQuotationResult(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : '生成报价失败');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof QuotationRequest, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (quotationResult) {
    return (
      <div>
        <button
          onClick={() => setQuotationResult(null)}
          className="mb-4 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          返回修改
        </button>
        <QuotationResult quotation={quotationResult} />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">填写报价需求</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 客户基本信息 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">客户类型</label>
            <select
              value={formData.customerType}
              onChange={(e) => handleInputChange('customerType', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="domestic">国内客户</option>
              <option value="international">国外客户</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">客户身份</label>
            <select
              value={formData.clientType}
              onChange={(e) => handleInputChange('clientType', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="student">学生</option>
              <option value="individual">个人</option>
              <option value="enterprise">企业</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">价格偏好</label>
            <select
              value={formData.pricePreference}
              onChange={(e) => handleInputChange('pricePreference', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="low">偏低</option>
              <option value="medium">中等</option>
              <option value="high">偏高</option>
            </select>
          </div>
        </div>

        {/* 任务描述 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            任务描述 <span className="text-red-500">*</span>
          </label>
          <textarea
            value={formData.taskDescription}
            onChange={(e) => handleInputChange('taskDescription', e.target.value)}
            placeholder="请详细描述您的任务需求..."
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 h-32"
            required
          />
        </div>

        {/* 字数和交付时间 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">预估字数</label>
            <input
              type="number"
              value={formData.wordCount || ''}
              onChange={(e) => handleInputChange('wordCount', e.target.value ? parseInt(e.target.value) : undefined)}
              placeholder="如：5000"
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              交付时间 <span className="text-red-500">*</span>
            </label>
            <input
              type="datetime-local"
              value={formData.deadline}
              onChange={(e) => handleInputChange('deadline', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
        </div>

        {/* 加急选项 */}
        <div className="space-y-3">
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={formData.isUrgent}
              onChange={(e) => handleInputChange('isUrgent', e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label className="ml-2 text-sm font-medium text-gray-700">加急处理</label>
          </div>

          {formData.isUrgent && (
            <div className="ml-6">
              <select
                value={formData.urgentType || ''}
                onChange={(e) => handleInputChange('urgentType', e.target.value)}
                className="p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">选择加急类型</option>
                <option value="same_day">当日交付 (+20%)</option>
                <option value="next_day">次日交付 (+10%)</option>
              </select>
            </div>
          )}
        </div>

        {/* 文件上传 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">上传相关文件</label>
          <div
            {...getRootProps()}
            className={`border-2 border-dashed p-6 text-center cursor-pointer rounded-md ${
              isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
            }`}
          >
            <input {...getInputProps()} />
            <p className="text-gray-600">
              {isDragActive ? '释放文件到这里' : '拖拽文件到这里，或点击选择文件'}
            </p>
            <p className="text-sm text-gray-500 mt-2">
              支持 PDF, DOCX, DOC, PNG, JPG, JPEG, GIF 格式，最大 10MB
            </p>
          </div>

          {formData.files && formData.files.length > 0 && (
            <div className="mt-4 space-y-2">
              {formData.files.map((file, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                  <span className="text-sm text-gray-700">{file.name}</span>
                  <button
                    type="button"
                    onClick={() => removeFile(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    删除
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 其他要求 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">其他要求</label>
          <textarea
            value={formData.additionalRequirements || ''}
            onChange={(e) => handleInputChange('additionalRequirements', e.target.value)}
            placeholder="其他特殊要求或说明..."
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 h-24"
          />
        </div>

        {/* 错误提示 */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {/* 提交按钮 */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
        >
          {loading ? '正在生成报价...' : '生成AI报价'}
        </button>
      </form>
    </div>
  );
};

export default QuotationForm;