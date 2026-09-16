import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import {JWT_SECRET} from '../config/securityConfig.js';
import { getCurrentUser } from "../utils/security.js";
import Game from '../models/Game.js';
import Session from '../models/Session.js';

async function getGamesByUserId(userId) {
  const games = Game.find({players:{$elemMatch:{userId}}},{ name: 1, _id: 1,roomNo:1,createdAt:1,updatedAt:1 }).sort({ updatedAt: -1 });
  return games;
}

export const getValidGames = async (req, res) => {
  
  try {
    // 校验 session 是否仍然有效
    const user = getCurrentUser(req)

    const { sessionId, id:userId} = user;
    console.log("sessionId, userId:",sessionId, userId);
    const session = await Session.findOne({ sessionId, userId });
    if (!session) {
      return res.status(401).json({ success: false, message: '会话已失效，请重新登录' });
    }

    const games = await getGamesByUserId(userId);

    res.status(200).json({
      success: true,
      data: {
        games
      },
    });
  } catch (error) {
    console.error('getValidGames error:', error);
    res.status(500).json({ success: false, message: '服务器内部错误' });
  }
}

export const startExistGame = async (req, res) => {
    
}