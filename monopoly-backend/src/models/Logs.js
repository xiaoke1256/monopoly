import mongoose from 'mongoose';

const LogsSchema = new mongoose.Schema({
    sessionId:{ type: String, required: false },
    userId:{ type: String, required: false },
    level:{ type: String, required: true, enum: ['all','debug','info','warn','error','fatal'] },
    logContent:{type: String, required: true},
    logTime:{type:Date,required: true,default: Date.now}
});

export default mongoose.model('Log', LogsSchema);