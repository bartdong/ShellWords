const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// 数据存储目录
const DATA_DIR = path.join(__dirname, 'data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// 中间件
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// 请求日志
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// ===== API 路由 =====

// 获取所有用户列表
app.get('/api/users', (req, res) => {
  try {
    const usersFile = path.join(DATA_DIR, 'users.json');
    if (!fs.existsSync(usersFile)) {
      return res.json({});
    }
    const users = JSON.parse(fs.readFileSync(usersFile, 'utf8'));
    res.json(users);
  } catch (err) {
    console.error('获取用户列表失败:', err);
    res.status(500).json({ error: '服务器错误' });
  }
});

// 注册/登录用户
app.post('/api/users/:username', (req, res) => {
  try {
    const { username } = req.params;
    const usersFile = path.join(DATA_DIR, 'users.json');
    
    let users = {};
    if (fs.existsSync(usersFile)) {
      users = JSON.parse(fs.readFileSync(usersFile, 'utf8'));
    }
    
    if (!users[username]) {
      users[username] = { created: new Date().toISOString() };
    }
    
    fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
    res.json({ success: true, user: users[username] });
  } catch (err) {
    console.error('用户注册失败:', err);
    res.status(500).json({ error: '服务器错误' });
  }
});

// 删除用户及其所有数据
app.delete('/api/users/:username', (req, res) => {
  try {
    const { username } = req.params;
    const usersFile = path.join(DATA_DIR, 'users.json');
    
    // 从用户列表中删除
    if (fs.existsSync(usersFile)) {
      const users = JSON.parse(fs.readFileSync(usersFile, 'utf8'));
      if (users[username]) {
        delete users[username];
        fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
      }
    }
    
    // 删除用户的单词统计文件
    const statsFile = path.join(DATA_DIR, `${username}_word_stats.json`);
    if (fs.existsSync(statsFile)) {
      fs.unlinkSync(statsFile);
    }
    
    // 删除用户的历史记录文件
    const historyFile = path.join(DATA_DIR, `${username}_history.json`);
    if (fs.existsSync(historyFile)) {
      fs.unlinkSync(historyFile);
    }
    
    console.log(`用户 "${username}" 及其所有数据已删除`);
    res.json({ success: true });
  } catch (err) {
    console.error('删除用户失败:', err);
    res.status(500).json({ error: '服务器错误' });
  }
});

// 获取用户的单词统计数据
app.get('/api/users/:username/word_stats', (req, res) => {
  try {
    const { username } = req.params;
    const statsFile = path.join(DATA_DIR, `${username}_word_stats.json`);
    
    if (!fs.existsSync(statsFile)) {
      return res.json({});
    }
    
    const stats = JSON.parse(fs.readFileSync(statsFile, 'utf8'));
    res.json(stats);
  } catch (err) {
    console.error('获取单词统计失败:', err);
    res.status(500).json({ error: '服务器错误' });
  }
});

// 保存用户的单词统计数据
app.post('/api/users/:username/word_stats', (req, res) => {
  try {
    const { username } = req.params;
    const stats = req.body;
    const statsFile = path.join(DATA_DIR, `${username}_word_stats.json`);
    
    fs.writeFileSync(statsFile, JSON.stringify(stats, null, 2));
    res.json({ success: true });
  } catch (err) {
    console.error('保存单词统计失败:', err);
    res.status(500).json({ error: '服务器错误' });
  }
});

// 获取用户的挑战历史
app.get('/api/users/:username/history', (req, res) => {
  try {
    const { username } = req.params;
    const historyFile = path.join(DATA_DIR, `${username}_history.json`);
    
    if (!fs.existsSync(historyFile)) {
      return res.json([]);
    }
    
    const history = JSON.parse(fs.readFileSync(historyFile, 'utf8'));
    res.json(history);
  } catch (err) {
    console.error('获取挑战历史失败:', err);
    res.status(500).json({ error: '服务器错误' });
  }
});

// 保存用户的挑战历史
app.post('/api/users/:username/history', (req, res) => {
  try {
    const { username } = req.params;
    const history = req.body;
    const historyFile = path.join(DATA_DIR, `${username}_history.json`);
    
    fs.writeFileSync(historyFile, JSON.stringify(history, null, 2));
    res.json({ success: true });
  } catch (err) {
    console.error('保存挑战历史失败:', err);
    res.status(500).json({ error: '服务器错误' });
  }
});

// 添加一条挑战历史记录
app.post('/api/users/:username/history/add', (req, res) => {
  try {
    const { username } = req.params;
    const entry = req.body;
    const historyFile = path.join(DATA_DIR, `${username}_history.json`);
    
    let history = [];
    if (fs.existsSync(historyFile)) {
      history = JSON.parse(fs.readFileSync(historyFile, 'utf8'));
    }
    
    history.push(entry);
    fs.writeFileSync(historyFile, JSON.stringify(history, null, 2));
    res.json({ success: true });
  } catch (err) {
    console.error('添加历史记录失败:', err);
    res.status(500).json({ error: '服务器错误' });
  }
});

// 获取所有用户的排行榜数据（用于用户排行）
app.get('/api/leaderboard', (req, res) => {
  try {
    const usersFile = path.join(DATA_DIR, 'users.json');
    if (!fs.existsSync(usersFile)) {
      return res.json([]);
    }
    
    const users = JSON.parse(fs.readFileSync(usersFile, 'utf8'));
    const leaderboard = [];
    
    Object.keys(users).forEach(username => {
      const historyFile = path.join(DATA_DIR, `${username}_history.json`);
      let history = [];
      if (fs.existsSync(historyFile)) {
        try {
          history = JSON.parse(fs.readFileSync(historyFile, 'utf8'));
        } catch {}
      }
      
      const totalScore = history.reduce((sum, h) => sum + (h.score || 0), 0);
      const challengeCount = history.length;
      
      leaderboard.push({
        name: username,
        totalScore,
        challengeCount
      });
    });
    
    // 按总分排序
    leaderboard.sort((a, b) => b.totalScore - a.totalScore);
    res.json(leaderboard);
  } catch (err) {
    console.error('获取排行榜失败:', err);
    res.status(500).json({ error: '服务器错误' });
  }
});

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 启动服务器
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🐚 ShellWords 云端存储服务已启动`);
  console.log(`📍 监听地址: http://0.0.0.0:${PORT}`);
  console.log(`📁 数据目录: ${DATA_DIR}`);
});
