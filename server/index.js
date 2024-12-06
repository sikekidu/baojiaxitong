import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './routes/auth.js';
import equipmentRoutes from './routes/equipment.js';
import materialsRoutes from './routes/materials.js';
import sparePartsRoutes from './routes/spareParts.js';
import maintenanceRoutes from './routes/maintenance.js';
import quotationRoutes from './routes/quotation.js';
import { errorHandler } from './middleware/errorHandler.js';
import logger from './utils/logger.js';
import { checkAndCreateDatabase } from './database.js';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const port = process.env.PORT || 3000;

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../dist')));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// 路由
app.use('/api/auth', authRoutes);
app.use('/api/equipment', equipmentRoutes);
app.use('/api/materials', materialsRoutes);
app.use('/api/spare-parts', sparePartsRoutes);
app.use('/api/maintenance', maintenanceRoutes);
app.use('/api/quotation', quotationRoutes);

// SPA支持
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

// 错误处理
app.use(errorHandler);

// 检查并创建数据库
checkAndCreateDatabase()
  .then(() => {
    // 启动服务器
    const server = app.listen(port, () => {
      logger.info(`服务器运行在 http://localhost:${port}`);
    });

    // 优雅关闭
    process.on('SIGTERM', () => {
      logger.info('收到 SIGTERM 信号，准备关闭服务器');
      server.close(() => {
        logger.info('服务器已关闭');
        process.exit(0);
      });
    });
  })
  .catch((err) => {
    console.error('Error starting server:', err);
  });
