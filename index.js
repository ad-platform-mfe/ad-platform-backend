const express = require('express');
const cors = require('cors');
const { initDatabase } = require('./models');
const apiRoutes = require('./routes');

const app = express();

app.use(cors());
app.use(express.json());

// 使用API路由
app.use('/api', apiRoutes);

// 初始化数据库
initDatabase();

const PORT = 3030;
app.listen(PORT, () => {
  console.log(`服务器运行在端口 ${PORT}`);
});