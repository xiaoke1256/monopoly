import { getCurrentUser } from "../utils/security.js";
import Game from '../models/Game.js';
import Session from '../models/Session.js';
import Map from '../models/Map.js';
import mongoose from 'mongoose';

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
    const user = getCurrentUser(req)

    const { sessionId, id:userId} = user;
    console.log("sessionId, userId:",sessionId, userId);
    const session = await Session.findOne({ sessionId, userId });
    if (!session) {
      return res.status(401).json({ success: false, message: '会话已失效，请重新登录' });
    }

    const { gameId } = req.body;

    session.gameId = gameId;
    await session.save();
    return res.json({ success: true, message: '保存成功' });
}

const generateRoomNo = ()=>{
  return Math.floor(Math.random()*Math.pow(16,4)).toString(16).toUpperCase()
}

export const createGame = async (req, res) => {
    const user = getCurrentUser(req);
    const { sessionId, id:userId} = user;
    const session = await Session.findOne({ sessionId, userId });
    if (!session) {
      return res.status(401).json({ success: false, message: '会话已失效，请重新登录' });
    }

    //roomNo 是由页面传入的一个随机数
    const { name,
      mapId,
      roomNo:roomNoTemp,
      players:playersTemp
     } = req.body;
    const map = await Map.findById(mapId);

    if(!playersTemp||playersTemp.lenth==0){
      return res.status(400).json({ success: false, message: '一场游戏必须要有一个玩家' });
    }

    const roomNo = roomNoTemp?roomNoTemp:generateRoomNo()
    console.log("roomNo:",roomNo)

    const players = playersTemp.map((player)=>{
      const {roleId,userId:userIdStr} = player;
      const userId = new mongoose.Types.ObjectId(userIdStr);
      //console.log("map:",map);
      const role = map.roles.filter((role)=>role.roleId===roleId)[0];
      if(!role){
        return res.status(400).json({ success: false, message: '所选角色不存在' });
      }
      return {...role,userId,money:map.defaultMoney}
    });

    const cells = map.cells.map(cell=>{return {...cell,level:1}});
    //console.log("cells:",cells);

    const game = await Game.create({...map,cells,name,mapId,roomNo,players });
    
    session.gameId = game._id;
    await session.save();
    return res.json({ success: true, message: '保存成功' });
}