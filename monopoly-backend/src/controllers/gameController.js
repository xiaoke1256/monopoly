import Game from '../models/Game.js';
import Map from '../models/Map.js';

// const getAllMaps = async (req, res) => {
//     try {
//         const maps = await Map.find();
//         return res.json({ maps });
//     } catch (error) {
//         return res.status(500).json({ error: error.message });
//     }
// };

// const getMapById = async (req, res) => {
//     try {
//         const map = await Map.findById(req.params.id);
//         if (!map) {
//             return res.status(404).json({ message: 'Map not found' });
//         }
//         return res.json({ map });
//     } catch (error) {
//         return res.status(500).json({ error: error.message });
//     }
// };

const getCurrentGame = async (req, res) => {
    try {
        let game = await Game.findOne();
        if (!game) {
            game = new Game();
            const map = await Map.findOne();
            game.mapId = map._id;
            game.roomNo = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
            game.cells = map.cells;
            await game.save();
        }
        return res.json({ game });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

const dice = async (req, res)=>{
    const diceResult=Math.ceil(Math.random()*6);
    let game = await Game.findOne();
    if(game){
        game.currentDice = diceResult;
        await game.save();
    }
    return res.json({ dice:diceResult });
}

export {
    dice,
    getCurrentGame
};