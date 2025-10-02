export interface QuotationRequest {
  customerType: 'domestic' | 'international';
  clientType: 'student' | 'individual' | 'enterprise';
  pricePreference: 'low' | 'medium' | 'high';
  taskDescription: string;
  wordCount?: number;
  deadline: string;
  isUrgent?: boolean;
  urgentType?: 'same_day' | 'next_day';
  files?: File[];
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
  analysis: string;
}