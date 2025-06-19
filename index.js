require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { initDatabase } = require('./models');
const apiRoutes = require('./routes');
const bodyParser = require('body-parser');

const app = express();

// 设置信任代理
app.set('trust proxy', 1);
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// 使用API路由
app.use('/api', apiRoutes);

// 初始化数据库
initDatabase();

const PORT = 9090;
app.listen(PORT, () => {
  console.log(`服务器运行在端口 ${PORT}`);
});