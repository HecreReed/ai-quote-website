import fs from 'fs';
import path from 'path';
import * as pdfParse from 'pdf-parse';
import mammoth from 'mammoth';
import { FileContent } from '../types/quotation';

export class DocumentParser {
  static async parseFile(filePath: string): Promise<FileContent> {
    const filename = path.basename(filePath);
    const ext = path.extname(filePath).toLowerCase();
    
    try {
      switch (ext) {
        case '.pdf':
          return await this.parsePDF(filePath, filename);
        case '.docx':
        case '.doc':
          return await this.parseDocx(filePath, filename);
        case '.png':
        case '.jpg':
        case '.jpeg':
        case '.gif':
          return await this.parseImage(filePath, filename);
        default:
          throw new Error(`不支持的文件格式: ${ext}`);
      }
    } catch (error) {
      console.error(`解析文件 ${filename} 时出错:`, error);
      throw new Error(`文件解析失败: ${filename}`);
    }
  }

  private static async parsePDF(filePath: string, filename: string): Promise<FileContent> {
    const dataBuffer = fs.readFileSync(filePath);
    const data = await (pdfParse as any)(dataBuffer);
    
    return {
      filename,
      content: data.text,
      type: 'pdf'
    };
  }

  private static async parseDocx(filePath: string, filename: string): Promise<FileContent> {
    const result = await mammoth.extractRawText({ path: filePath });
    
    return {
      filename,
      content: result.value,
      type: 'docx'
    };
  }

  private static async parseImage(filePath: string, filename: string): Promise<FileContent> {
    // 对于图片，我们返回基本信息，实际的OCR功能需要额外的库
    const stats = fs.statSync(filePath);
    
    return {
      filename,
      content: `图片文件: ${filename}, 大小: ${(stats.size / 1024).toFixed(2)}KB`,
      type: 'image'
    };
  }

  static async parseMultipleFiles(filePaths: string[]): Promise<FileContent[]> {
    const results: FileContent[] = [];
    
    for (const filePath of filePaths) {
      try {
        const content = await this.parseFile(filePath);
        results.push(content);
      } catch (error) {
        console.error(`跳过文件 ${filePath}:`, error);
      }
    }
    
    return results;
  }
}