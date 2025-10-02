export interface QuotationRequest {
  // 客户信息
  customerType: 'domestic' | 'international'; // 国内/国外
  clientType: 'student' | 'individual' | 'enterprise'; // 学生/个人/企业
  pricePreference: 'low' | 'medium' | 'high'; // 价格偏好
  
  // 任务信息
  taskDescription: string; // 任务描述
  wordCount?: number; // 字数（如果知道）
  deadline: string; // 交付时间
  isUrgent?: boolean; // 是否加急
  urgentType?: 'same_day' | 'next_day'; // 加急类型
  
  // 文件
  files?: string[]; // 上传的文件路径
  
  // 其他需求
  additionalRequirements?: string;
}

export interface QuotationModule {
  name: string;
  description: string;
  price: number;
}

export interface QuotationResponse {
  modules: QuotationModule[];
  totalPrice: number;
  urgentSurcharge?: {
    type: string;
    percentage: number;
    amount: number;
  };
  deliverables: string[];
  paymentMethods: string[];
  notes: string[];
  analysis: string; // AI分析
}

export interface FileContent {
  filename: string;
  content: string;
  type: 'pdf' | 'docx' | 'image' | 'text';
}