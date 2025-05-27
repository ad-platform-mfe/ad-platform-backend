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
app.get('/api/users', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM users');
    res.json({
      code: 200,
      data: rows
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.json({
      code: 500,
      message: '获取客户列表失败'
    });
  }
});

app.post('/api/users', async (req, res) => {
  const { username,password, phone, email } = req.body;
  if (!username || !password || !phone || !email) {
    return res.json({
      code: 400,
      message: '必填字段不能为空'
    });
  }
  try {
    const [result] = await pool.execute(
      'INSERT INTO users (username, password,phone, email ) VALUES (?,?, ?, ?)',
      [username, password,phone, email ]
    );
    res.json({
      code: 200,
      message: '添加客户成功',
      data: { id: result.insertId }
    });
  } catch (error) {
    console.error('Add users error:', error);
    res.json({
      code: 500,
      message: '添加客户失败'
    });
  }
});

app.put('/api/users/:id', async (req, res) => {
  const { id } = req.params;
  const { username, password,phone, email } = req.body;
  if (!username || !password || !phone || !email) {
    return res.json({
      code: 400,
      message: '必填字段不能为空'
    });
  }
  try {
    await pool.execute(
      'UPDATE users SET username = ?, password = ?,phone = ?,email = ? WHERE id = ?',
      [username,  password ,phone, email, id]
    );
    res.json({
      code: 200,
      message: '更新客户信息成功'
    });
  } catch (error) {
    console.error('Update users error:', error);
    res.json({
      code: 500,
      message: '更新客户信息失败'
    });
  }
});

app.delete('/api/users/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.execute('DELETE FROM users WHERE id = ?', [id]);
    res.json({
      code: 200,
      message: '删除客户成功'
    });
  } catch (error) {
    console.error('Delete users error:', error);
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
      [name, location, status]
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
  const { title, text,type, file_url, upload_time } = req.body;
  if (!title || !file_url || !text || !type || !upload_time) {
    return res.json({
      code: 400,
      message: '必填字段不能为空'
    });
  }
  try {
    const [result] = await pool.execute(
      'INSERT INTO content (title, text,type, file_url, upload_time) VALUES (?, ?,?, ?, ?)',
      [title, text,type, file_url, upload_time]
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
  const { title, text,type, file_url, upload_time } = req.body;
  if (!title || !file_url || !text || !type || !upload_time) {
    return res.json({
      code: 400,
      message: '必填字段不能为空'
    });
  }
  try {
    // Convert ISO datetime to MySQL compatible format
    const mysqlDateTime = new Date(upload_time).toISOString().slice(0, 19).replace('T', ' ');
    await pool.execute(
      'UPDATE content SET title = ?, text = ?, type = ?, file_url = ?, upload_time = ? WHERE id = ?',
      [title, text,type, file_url, mysqlDateTime,id]
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
  const { start_time, end_time, play_mode, is_available, price } = req.body;
  if (!start_time || !end_time || !play_mode) {
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
      'UPDATE schedule SET start_time = ?, end_time = ?, play_mode = ?, is_available = ?, price = ? WHERE id = ?',
      [mysqlStartTime, mysqlEndTime, play_mode, is_available, price, id]
    );
    res.json({
      code: 200,
      message: '更新播放排期成功'
    });
  } catch (error) {
    console.error('Update schedule error:', error);
    res.json({
      code: 500,
      message: '更新播放排期失败'
    });
  }
});

app.post('/api/schedule', async (req, res) => {
  const { device_id, content_id, start_time, end_time, play_mode, is_available, price } = req.body;
  if (!device_id || !content_id || !start_time || !end_time || !play_mode) {
    return res.json({
      code: 400,
      message: '必填字段不能为空'
    });
  }
  try {
    const mysqlStartTime = new Date(start_time).toISOString().slice(0, 19).replace('T', ' ');
    const mysqlEndTime = new Date(end_time).toISOString().slice(0, 19).replace('T', ' ');

    const [result] = await pool.execute(
      'INSERT INTO schedule (device_id, content_id, start_time, end_time, play_mode, is_available, price) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [device_id, content_id, mysqlStartTime, mysqlEndTime, play_mode, is_available || '是', price || 0]
    );
    res.json({
      code: 200,
      message: '添加播放排期成功',
      data: { id: result.insertId }
    });
  } catch (error) {
    console.error('Add schedule error:', error);
    res.json({
      code: 500,
      message: '添加播放排期失败'
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

// 播放日志接口
app.get('/api/play_log', async (req, res) => {
  try {
    const [rows] = await pool.execute(`
      SELECT pl.*, u.username, c.title as content_title, d.name as device_name , s.start_time as schedule_start_time, s.end_time as schedule_end_time
      FROM play_log pl
      LEFT JOIN users u ON pl.user_id = u.id
      LEFT JOIN content c ON pl.content_id = c.id
      LEFT JOIN device d ON pl.device_id = d.id
      LEFT JOIN schedule s ON pl.schedule_id = s.id
      ORDER BY pl.id DESC
    `);
    res.json({
      code: 200,
      data: rows
    });
  } catch (error) {
    console.error('Get play_log error:', error);
    res.json({
      code: 500,
      message: '获取播放日志失败'
    });
  }
});

app.post('/api/play_log', async (req, res) => {
  const { user_id, content_id, device_id, schedule_id } = req.body;
  if (!user_id || !content_id || !device_id || !schedule_id) {
    return res.json({
      code: 400,
      message: '必填字段不能为空'
    });
  }
  try {
    const [result] = await pool.execute(
      'INSERT INTO play_log (user_id, content_id, device_id, schedule_id) VALUES (?, ?, ?, ?)',
      [user_id, content_id, device_id, schedule_id]
    );
    res.json({
      code: 200,
      message: '添加播放日志成功',
      data: { id: result.insertId }
    });
  } catch (error) {
    console.error('Add play_log error:', error);
    res.json({
      code: 500,
      message: '添加播放日志失败'
    });
  }
});

app.delete('/api/play_log/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.execute('DELETE FROM play_log WHERE id = ?', [id]);
    res.json({
      code: 200,
      message: '删除播放日志成功'
    });
  } catch (error) {
    console.error('Delete play_log error:', error);
    res.json({
      code: 500,
      message: '删除播放日志失败'
    });
  }
});