import React from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import type { QuotationResponse } from '../types/quotation';

interface QuotationResultProps {
  quotation: QuotationResponse;
}

const QuotationResult: React.FC<QuotationResultProps> = ({ quotation }) => {
  const exportToPDF = async () => {
    const element = document.getElementById('quotation-content');
    if (!element) return;

    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save('quotation.pdf');
    } catch (error) {
      console.error('导出PDF失败:', error);
      alert('导出PDF失败，请重试');
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg">
      {/* 操作按钮 */}
      <div className="flex justify-between items-center p-6 border-b border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900">AI生成报价单</h2>
        <div className="space-x-2">
          <button
            onClick={exportToPDF}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            导出PDF
          </button>
        </div>
      </div>

      {/* 报价内容 */}
      <div id="quotation-content" className="p-6 space-y-6">
        {/* 核心功能模块 */}
        <div>
          <h3 className="text-xl font-semibold text-gray-900 mb-4">核心功能模块及报价</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    模块
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    功能说明
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    报价 (RMB)
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {quotation.modules.map((module, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {module.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {module.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ¥{module.price}
                    </td>
                  </tr>
                ))}
                <tr className="bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                    小计
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    -
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                    ¥{quotation.modules.reduce((sum, module) => sum + module.price, 0)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* 加急费用 */}
        {quotation.urgentSurcharge && (
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">急单加价</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      交付时限
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      加价比例
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      加价金额 (RMB)
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {quotation.urgentSurcharge.type}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      +{quotation.urgentSurcharge.percentage}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ¥{quotation.urgentSurcharge.amount}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 总价 */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold text-gray-900">总计费用</span>
            <span className="text-2xl font-bold text-blue-600">¥{quotation.totalPrice}</span>
          </div>
        </div>

        {/* 修改与售后 */}
        <div>
          <h3 className="text-xl font-semibold text-gray-900 mb-4">修改与售后</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    服务
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    说明
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    报价 (RMB)
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">免费修改</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">一周内均可</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">0</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">超出初始范围</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">按照具体内容报价</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">待议</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">售后支持</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">7天内免费（可延长）</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">0</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* 交付物说明 */}
        <div>
          <h3 className="text-xl font-semibold text-gray-900 mb-4">交付物说明</h3>
          <div className="bg-gray-50 p-4 rounded-lg">
            <ul className="space-y-2">
              {quotation.deliverables.map((item, index) => (
                <li key={index} className="flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* 付款方式 */}
        <div>
          <h3 className="text-xl font-semibold text-gray-900 mb-4">付款方式</h3>
          <div className="flex space-x-4">
            {quotation.paymentMethods.map((method, index) => (
              <div key={index} className="bg-green-50 px-4 py-2 rounded-lg border border-green-200">
                <span className="text-green-700 font-medium">{method}</span>
              </div>
            ))}
          </div>
        </div>

        {/* AI分析 */}
        <div>
          <h3 className="text-xl font-semibold text-gray-900 mb-4">AI任务分析</h3>
          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
            <div className="whitespace-pre-wrap text-gray-700">{quotation.analysis}</div>
          </div>
        </div>

        {/* 注意事项 */}
        <div>
          <h3 className="text-xl font-semibold text-gray-900 mb-4">注意事项</h3>
          <div className="bg-gray-50 p-4 rounded-lg">
            <ul className="space-y-2">
              {quotation.notes.map((note, index) => (
                <li key={index} className="flex items-start">
                  <span className="w-2 h-2 bg-gray-400 rounded-full mr-3 mt-2"></span>
                  <span className="text-gray-700">{note}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuotationResult;