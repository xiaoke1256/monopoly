import mongoose from 'mongoose';
import Map from '../models/Map.js';
import Chance from '../models/Chance.js';
import connectDB from '../config/db.js';

const deleteChances = async () => {
  try {
    await connectDB();
    const existingMap = await Map.findOne({ name: '唐朝' });
    if (!existingMap) {
      console.error('Map "唐朝" not found. Please initialize the map first.');
      return;
    }

    console.log(`Deleting existing chances for map: ${existingMap.name} (ID: ${existingMap._id})`);

    const deletedChances = await Chance.deleteMany({mapId: existingMap._id});
    // console.log(`deletedChances:`, deletedChances);
    if(deletedChances && deletedChances.deletedCount>0){
        console.log(`已删除 ${deletedChances.deletedCount} 条机会.`);
    }
    console.log(`成功删除机会.`);

  } catch (error) {
    console.error('Error deleting existing chances:', error);
  } finally {
    mongoose.connection.close();
    process.exit(0);
  }
}

deleteChances();