import mongoose from 'mongoose';

const QuestionSchema = new mongoose.Schema({
    mapId: {type: mongoose.Schema.Types.ObjectId,ref: 'Map'},
    stem: { type: String, required: true, default: '' },
    options: [{ type: String, required: true, default: '' }],
    correctOption: { type: String, required: true, default: '' },
    reward: { type: Number, required: true, default: 0 },
});

export default mongoose.model('Question', QuestionSchema);