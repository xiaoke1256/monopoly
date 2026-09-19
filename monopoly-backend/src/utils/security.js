import jwt from 'jsonwebtoken';
import {JWT_SECRET} from '../config/securityConfig.js';
import Session from '../models/Session.js';

export function getCurrentUser(req){
    console.log("req.headers:",req.headers);
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new Error("未提供有效的认证令牌");
    }

    const token = authHeader.split(' ')[1];
    let userInfo;
    try {
      console.log("token:",token,"JWT_SECRET:",JWT_SECRET)
      userInfo = jwt.verify(token, JWT_SECRET);
      return userInfo;
    } catch (err) {
      console.error(err);
      throw new Error("令牌无效或已过期");
    }

    // userInfo 包含 { id, username, nickname, sessionId, iat, exp }
    // const { id: userId, username, nickname, sessionId } = userInfo;

}

export async function getCurrentSession(req){
  const user = getCurrentUser(req)
  const { sessionId, id:userId} = user;
  console.log("sessionId, userId:",sessionId, userId);
  const session = await Session.findOne({ sessionId, userId });
  return session;
}