import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const JWT_SECRET = 'monopoly_jwt_secret_key_change_in_production';

// 注册
export const register = async (req, res) => {
  try {
    const { username, password, nickname } = req.body;

    // 校验必填
    if (!username || !password || !nickname) {
      return res.status(400).json({ success: false, message: '用户名、密码、昵称均为必填项' });
    }

    // 检查用户是否存在
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ success: false, message: '该用户名已被注册' });
    }

    // 加密密码
    const hashedPassword = await bcrypt.hash(password, 10);

    // 创建用户
    const user = await User.create({
      username,
      password: hashedPassword,
      nickname,
    });

    // 生成 token
    const token = jwt.sign(
      { id: user._id, username: user.username, nickname: user.nickname },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      success: true,
      message: '注册成功',
      data: {
        token,
        user: { id: user._id, username: user.username, nickname: user.nickname },
      },
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ success: false, message: '服务器内部错误' });
  }
};

// 登录
export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ success: false, message: '用户名和密码均为必填项' });
    }

    // 查找用户
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ success: false, message: '用户名或密码错误' });
    }

    // 校验密码
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: '用户名或密码错误' });
    }

    // 生成 token
    const token = jwt.sign(
      { id: user._id, username: user.username, nickname: user.nickname },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(200).json({
      success: true,
      message: '登录成功',
      data: {
        token,
        user: { id: user._id, username: user.username, nickname: user.nickname },
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: '服务器内部错误' });
  }
};
