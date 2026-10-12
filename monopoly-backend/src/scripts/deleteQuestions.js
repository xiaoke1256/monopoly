import mongoose from 'mongoose';
import Map from '../models/Map.js';
import Question from '../models/Question.js';
import connectDB from '../config/db.js';

const deleteQuestions = async () => {
  try {
    await connectDB();
    const existingMap = await Map.findOne({ name: '唐朝' });
    if (!existingMap) {
      console.error('Map "唐朝" not found. Please initialize the map first.');
      return;
    }

    const existingQuestions = await Question.deleteMany({mapId: existingMap._id});
    if(existingQuestions && existingQuestions.deletedCount>0){
        console.log(`已删除 ${existingQuestions.deletedCount} 条问题.`);
    }

    console.log('Questions deleted successfully!');

  } catch (error) {
    console.error('Error initializing questions:', error);
  } finally {
    mongoose.connection.close();
    process.exit(0);
  }
}

deleteQuestions();