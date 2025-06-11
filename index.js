require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { initDatabase } = require('./models');
const apiRoutes = require('./routes');
const authRoutes = require('./routes/auth');

const app = express();

app.use(cors());
app.use(express.json());

// 使用API路由
app.use('/api', apiRoutes);
app.use('/api/auth', authRoutes);

// 初始化数据库
initDatabase();

const PORT = 9090;
app.listen(PORT, () => {
  console.log(`服务器运行在端口 ${PORT}`);
});