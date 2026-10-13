import { getCurrentUser } from "../utils/security.js";
import Log from '../models/Logs.js';

export const saveLog = async (req, res)=>{
    const {sessionId, id:userId} = getCurrentUser(req)||{};
    const {logContent,level='info'} = req.body
    const log = await Log.create({sessionId,userId,logContent,level});
    return res.json({success:true});
}