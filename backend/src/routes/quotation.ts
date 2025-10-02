import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { DocumentParser } from '../services/documentParser';
import { GeminiService } from '../services/geminiService';
import { QuotationRequest, FileContent } from '../types/quotation';

const router = express.Router();

// 文件上传配置
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadsDir = path.join(__dirname, '../../uploads');
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /pdf|docx|doc|png|jpg|jpeg|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('只支持 PDF, DOCX, DOC, PNG, JPG, JPEG, GIF 格式的文件'));
    }
  }
});

// 生成报价
router.post('/generate', upload.array('files', 5), async (req, res) => {
  try {
    const requestData: QuotationRequest = {
      customerType: req.body.customerType,
      clientType: req.body.clientType,
      pricePreference: req.body.pricePreference,
      taskDescription: req.body.taskDescription,
      wordCount: req.body.wordCount ? parseInt(req.body.wordCount) : undefined,
      deadline: req.body.deadline,
      isUrgent: req.body.isUrgent === 'true',
      urgentType: req.body.urgentType,
      additionalRequirements: req.body.additionalRequirements
    };

    // 验证必填字段
    if (!requestData.customerType || !requestData.clientType || !requestData.taskDescription) {
      return res.status(400).json({ error: '请填写所有必填字段' });
    }

    // 解析上传的文件
    let fileContents: FileContent[] = [];
    if (req.files && Array.isArray(req.files) && req.files.length > 0) {
      const files = req.files as Express.Multer.File[];
      const filePaths = files.map(file => file.path);
      fileContents = await DocumentParser.parseMultipleFiles(filePaths);
      
      // 清理上传的文件
      files.forEach(file => {
        try {
          fs.unlinkSync(file.path);
        } catch (error) {
          console.error('删除临时文件失败:', error);
        }
      });
    }

    // 调用 Gemini 生成报价
    const geminiService = new GeminiService();
    const quotation = await geminiService.generateQuotation(requestData, fileContents);

    res.json(quotation);
  } catch (error) {
    console.error('生成报价失败:', error);
    res.status(500).json({ 
      error: error instanceof Error ? error.message : '生成报价失败' 
    });
  }
});

// 健康检查
router.get('/health', (req, res) => {
  res.json({ status: 'OK', service: 'quotation' });
});

export { router as quotationRoutes };