import { GoogleGenerativeAI } from '@google/generative-ai';
import { QuotationRequest, QuotationResponse, FileContent } from '../types/quotation';

export class GeminiService {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY 环境变量未设置');
    }
    
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
  }

  async generateQuotation(
    request: QuotationRequest, 
    fileContents: FileContent[] = []
  ): Promise<QuotationResponse> {
    const prompt = this.buildPrompt(request, fileContents);
    
    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      return this.parseGeminiResponse(text, request);
    } catch (error) {
      console.error('Gemini API 调用失败:', error);
      throw new Error('AI 报价生成失败');
    }
  }

  private buildPrompt(request: QuotationRequest, fileContents: FileContent[]): string {
    let prompt = `请根据任务单的实际需求，对以下内容进行结构化报价，最后以markdown代码块输出给我，我好去生成pdf：

**客户信息：**
- 客户类型：${request.customerType === 'domestic' ? '国内' : '国外'}
- 客户身份：${this.getClientTypeText(request.clientType)}
- 价格偏好：${this.getPricePreferenceText(request.pricePreference)}
- 交付时间：${request.deadline}
${request.isUrgent ? `- 加急要求：${request.urgentType === 'same_day' ? '当日交付' : '次日交付'}` : ''}

**任务描述：**
${request.taskDescription}

${request.wordCount ? `**预估字数：** ${request.wordCount}字` : ''}

${request.additionalRequirements ? `**其他要求：** ${request.additionalRequirements}` : ''}

${fileContents.length > 0 ? `**上传文件内容：**
${fileContents.map(file => `
文件名：${file.filename}
内容：${file.content.substring(0, 1000)}${file.content.length > 1000 ? '...' : ''}
`).join('\n')}` : ''}

**报价要求：**
- 只列出本次任务需要的核心功能模块，不额外添加无关附加项
- 价格为具体数值，不使用区间或多余选项
- 面向学生群体，保持合理
- 留学生版报告按 300 RMB/千字 收费，其余模块价格视难度微调
- 不要写别的在markdown里面
- 加急当日+20% 次日+10%

请按照以下格式输出：

1. **核心功能模块及报价**
   | 模块         | 功能说明                   | 报价 (RMB) |
   |--------------|----------------------------|------------|
   | xxx   | xxx         | XXXX       |
   | xxx | xxx        | XXXX       |
   | **合计**     |                            | **XXXX**   |

2. **急单加价**（仅当明确要求加急）
   | 交付时限   | 加价比例    |
   |------------|------------|
   | xx       | xx     |

3. **修改与售后**
   | 服务       | 说明                   | 报价 (RMB) |
   |------------|------------------------|------------|
   | 免费修改   | 一周内均可            | 0          |
   | 超出初始范围   | 按照具体内容报价         | XXXX       |
   | 售后支持   | 7天内免费（可延长）    | 0          |

4. **交付物说明**
   | 交付物     | 说明                   |
   |------------|------------------------|
   | xxx     | xxx         |
   | xxx  | xxx        |

5. **付款方式**
   - 微信
   - 支付宝
   - 闲鱼

> **注意**：
> - 仅列出实际需求模块，价格设置合理，不刻意推高，报价尽量低一点点，毕竟是学生。
> - 留学生报告按 300 RMB/千字 计费（其他留学生模块可适当上浮）。
> - 不对打包、交付环节另行收费。

**同时请对整个任务进行分析，包括难度评估、工作量预估、风险点等。**`;

    return prompt;
  }

  private parseGeminiResponse(text: string, request: QuotationRequest): QuotationResponse {
    // 这里应该解析Gemini返回的markdown格式
    // 由于实际返回格式可能变化，这里提供一个基础的解析逻辑
    
    // 提取分析部分（通常在最后）
    const analysisMatch = text.match(/\*\*分析\*\*[：:]?([\s\S]*?)(?=\n\*\*|$)/);
    const analysis = analysisMatch ? analysisMatch[1].trim() : '暂无详细分析';

    // 基础报价逻辑（当解析失败时的回退方案）
    const basePrice = this.calculateBasePrice(request);
    const modules = this.generateDefaultModules(request, basePrice);
    
    let totalPrice = modules.reduce((sum, module) => sum + module.price, 0);
    
    // 计算加急费用
    let urgentSurcharge;
    if (request.isUrgent) {
      const percentage = request.urgentType === 'same_day' ? 20 : 10;
      const amount = Math.round(totalPrice * percentage / 100);
      urgentSurcharge = {
        type: request.urgentType === 'same_day' ? '当日加急' : '次日加急',
        percentage,
        amount
      };
      totalPrice += amount;
    }

    return {
      modules,
      totalPrice,
      urgentSurcharge,
      deliverables: this.getDeliverables(request),
      paymentMethods: ['微信', '支付宝', '闲鱼'],
      notes: [
        '仅列出实际需求模块，价格设置合理',
        '留学生报告按 300 RMB/千字 计费',
        '不对打包、交付环节另行收费'
      ],
      analysis: analysis || text // 如果没有提取到分析，返回完整文本
    };
  }

  private calculateBasePrice(request: QuotationRequest): number {
    let basePrice = 300; // 基础价格
    
    // 根据客户类型调整
    if (request.customerType === 'international') {
      basePrice *= 1.2;
    }
    
    // 根据客户身份调整
    switch (request.clientType) {
      case 'student':
        basePrice *= 0.8; // 学生折扣
        break;
      case 'enterprise':
        basePrice *= 1.5;
        break;
    }
    
    // 根据价格偏好调整
    switch (request.pricePreference) {
      case 'low':
        basePrice *= 0.8;
        break;
      case 'high':
        basePrice *= 1.3;
        break;
    }
    
    return Math.round(basePrice);
  }

  private generateDefaultModules(request: QuotationRequest, basePrice: number) {
    const modules = [];
    
    if (request.wordCount) {
      const pricePerThousand = 300;
      const totalWritingPrice = Math.round((request.wordCount / 1000) * pricePerThousand);
      modules.push({
        name: '文档撰写',
        description: `${request.wordCount}字文档撰写`,
        price: totalWritingPrice
      });
    } else {
      modules.push({
        name: '基础服务',
        description: '根据任务需求提供基础服务',
        price: basePrice
      });
    }
    
    return modules;
  }

  private getDeliverables(request: QuotationRequest): string[] {
    const deliverables = ['完整文档'];
    
    if (request.clientType === 'student') {
      deliverables.push('参考资料', '格式调整');
    }
    
    return deliverables;
  }

  private getClientTypeText(type: string): string {
    const map: Record<string, string> = {
      'student': '学生',
      'individual': '个人',
      'enterprise': '企业'
    };
    return map[type] || type;
  }

  private getPricePreferenceText(preference: string): string {
    const map: Record<string, string> = {
      'low': '偏低',
      'medium': '中等',
      'high': '偏高'
    };
    return map[preference] || preference;
  }
}