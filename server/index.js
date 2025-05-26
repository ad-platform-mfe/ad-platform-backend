const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const app = express();

app.use(cors());
app.use(express.json());

// 创建数据库连接池
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '1234',
  database: 'advertising',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// 初始化数据库表
async function initDatabase() {
  try {
    const connection = await pool.getConnection();
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL
      );
    `);
    connection.release();
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
}

initDatabase();


app.post('/api/register', async (req, res) => {
  const { username, password } = req.body;
  
  // 验证请求体
  if (!username || !password) {
    return res.json({
      code: 400,
      message: '用户名和密码不能为空'
    });
  }

  try {
    // 检查用户名是否已存在
    const [rows] = await pool.execute('SELECT * FROM users WHERE username = ?', [username]);
    if (rows.length > 0) {
      return res.json({
        code: 400,
        message: '用户名已存在'
      });
    }

    // 添加新用户
    await pool.execute('INSERT INTO users (username, password) VALUES (?, ?)', [username, password]);
    
    res.json({
      code: 200,
      message: '注册成功'
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.json({
      code: 500,
      message: '注册失败，请稍后重试'
    });
  }
});





app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  
  // 验证请求体
  if (!username || !password) {
    return res.json({
      code: 400,
      message: '用户名和密码不能为空'
    });
  }

  try {
    // 用户验证
    const [rows] = await pool.execute('SELECT * FROM users WHERE username = ? AND password = ?', [username, password]);
    
    if (rows.length > 0) {
      res.json({
        code: 200,
        message: '登录成功',
        data: { username: rows[0].username }
      });
    } else {
      res.json({
        code: 401,
        message: '用户名或密码错误'
      });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.json({
      code: 500,
      message: '登录失败，请稍后重试'
    });
  }
});

// 客户管理接口
app.get('/api/client', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM client');
    res.json({
      code: 200,
      data: rows
    });
  } catch (error) {
    console.error('Get client error:', error);
    res.json({
      code: 500,
      message: '获取客户列表失败'
    });
  }
});

app.post('/api/client', async (req, res) => {
  const { name, contact, email } = req.body;
  if (!name || !contact || !email) {
    return res.json({
      code: 400,
      message: '必填字段不能为空'
    });
  }
  try {
    const [result] = await pool.execute(
      'INSERT INTO client (name, contact, email) VALUES (?, ?, ?)',
      [name, contact, email]
    );
    res.json({
      code: 200,
      message: '添加客户成功',
      data: { id: result.insertId }
    });
  } catch (error) {
    console.error('Add client error:', error);
    res.json({
      code: 500,
      message: '添加客户失败'
    });
  }
});

app.put('/api/client/:id', async (req, res) => {
  const { id } = req.params;
  const { name, contact,email } = req.body;
  if (!name || !contact || !email) {
    return res.json({
      code: 400,
      message: '必填字段不能为空'
    });
  }
  try {
    await pool.execute(
      'UPDATE client SET name = ?, contact = ?,email = ? WHERE id = ?',
      [name, contact, email, id]
    );
    res.json({
      code: 200,
      message: '更新客户信息成功'
    });
  } catch (error) {
    console.error('Update client error:', error);
    res.json({
      code: 500,
      message: '更新客户信息失败'
    });
  }
});

app.delete('/api/client/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.execute('DELETE FROM client WHERE id = ?', [id]);
    res.json({
      code: 200,
      message: '删除客户成功'
    });
  } catch (error) {
    console.error('Delete client error:', error);
    res.json({
      code: 500,
      message: '删除客户失败'
    });
  }
});

// 设备管理接口
app.get('/api/device', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM device');
    res.json({
      code: 200,
      data: rows
    });
  } catch (error) {
    console.error('Get device error:', error);
    res.json({
      code: 500,
      message: '获取设备列表失败'
    });
  }
});

app.post('/api/device', async (req, res) => {
  const { name, location, status } = req.body;
  if (!name || !location) {
    return res.json({
      code: 400,
      message: '必填字段不能为空'
    });
  }
  try {
    const [result] = await pool.execute(
      'INSERT INTO device (name, location, status) VALUES (?, ?, ?)',
      [name, location, status ]
    );
    res.json({
      code: 200,
      message: '添加设备成功',
      data: { id: result.insertId }
    });
  } catch (error) {
    console.error('Add device error:', error);
    res.json({
      code: 500,
      message: '添加设备失败'
    });
  }
});

app.put('/api/device/:id', async (req, res) => {
  const { id } = req.params;
  const { name, location, status } = req.body;
  if (!name || !location) {
    return res.json({
      code: 400,
      message: '必填字段不能为空'
    });
  }
  try {
    await pool.execute(
      'UPDATE device SET name = ?, location = ?, status = ? WHERE id = ?',
      [name, location, status, id]
    );
    res.json({
      code: 200,
      message: '更新设备信息成功'
    });
  } catch (error) {
    console.error('Update device error:', error);
    res.json({
      code: 500,
      message: '更新设备信息失败'
    });
  }
});

app.delete('/api/device/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.execute('DELETE FROM device WHERE id = ?', [id]);
    res.json({
      code: 200,
      message: '删除设备成功'
    });
  } catch (error) {
    console.error('Delete device error:', error);
    res.json({
      code: 500,
      message: '删除设备失败'
    });
  }
});

// 广告内容接口
app.get('/api/content', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM content');
    res.json({
      code: 200,
      data: rows
    });
  } catch (error) {
    console.error('Get content error:', error);
    res.json({
      code: 500,
      message: '获取广告内容列表失败'
    });
  }
});

app.post('/api/content', async (req, res) => {
  const { title, duration, file_url,upload_time } = req.body;
  if (!title || !file_url || !duration || !upload_time) {
    return res.json({
      code: 400,
      message: '必填字段不能为空'
    });
  }
  try {
    const [result] = await pool.execute(
      'INSERT INTO content (title, duration, file_url,upload_time) VALUES (?, ?, ?, ?)',
      [title, duration, file_url,upload_time]
    );
    res.json({
      code: 200,
      message: '添加广告内容成功',
      data: { id: result.insertId }
    });
  } catch (error) {
    console.error('Add content error:', error);
    res.json({
      code: 500,
      message: '添加广告内容失败'
    });
  }
});

app.put('/api/content/:id', async (req, res) => {
  const { id } = req.params;
  const {title, duration, file_url,upload_time } = req.body;
  if (!title || !duration || !file_url || !upload_time) {
    return res.json({
      code: 400,
      message: '必填字段不能为空'
    });
  }
  try {
    // Convert ISO datetime to MySQL compatible format
    const mysqlDateTime = new Date(upload_time).toISOString().slice(0, 19).replace('T', ' ');
    await pool.execute(
      'UPDATE content SET title = ?, duration = ?, file_url = ?, upload_time = ? WHERE id = ?',
      [title, duration, file_url, mysqlDateTime, id]
    );
    res.json({
      code: 200,
      message: '更新广告内容成功'
    });
  } catch (error) {
    console.error('Update content error:', error);
    res.json({
      code: 500,
      message: '更新广告内容失败'
    });
  }
});

app.delete('/api/content/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.execute('DELETE FROM content WHERE id = ?', [id]);
    res.json({
      code: 200,
      message: '删除广告内容成功'
    });
  } catch (error) {
    console.error('Delete content error:', error);
    res.json({
      code: 500,
      message: '删除广告内容失败'
    });
  }
});



// 播放排期接口
app.get('/api/schedule', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM schedule');
    res.json({
      code: 200,
      data: rows
    });
  } catch (error) {
    console.error('Get schedule error:', error);
    res.json({
      code: 500,
      message: '获取播放排期列表失败'
    });
  }
});

app.put('/api/schedule/:id', async (req, res) => {
  const { id } = req.params;
  const {start_time, end_time,play_mode } = req.body;
  if (!start_time || !end_time || !play_mode ) {
    return res.json({
      code: 400,
      message: '必填字段不能为空'
    });
  }
  try {
    // Convert ISO datetime to MySQL compatible format
    const mysqlStartTime = new Date(start_time).toISOString().slice(0, 19).replace('T', ' ');
    const mysqlEndTime = new Date(end_time).toISOString().slice(0, 19).replace('T', ' ');
    
    await pool.execute(
      'UPDATE schedule SET start_time = ?, end_time = ?, play_mode = ? WHERE id = ?',
      [mysqlStartTime, mysqlEndTime, play_mode, id]
    );
    res.json({
      code: 200,
      message: '更新广告内容成功'
    });
  } catch (error) {
    console.error('Update schedule error:', error);
    res.json({
      code: 500,
      message: '更新播放排期失败'
    });
  }
});

const PORT = 3030;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.delete('/api/schedule/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.execute('DELETE FROM schedule WHERE id = ?', [id]);
    res.json({
      code: 200,
      message: '删除广告内容成功'
    });
  } catch (error) {
    console.error('Delete schedule error:', error);
    res.json({
      code: 500,
      message: '删除广告内容失败'
    });
  }
});