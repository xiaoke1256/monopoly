import Game from '../models/Game.js';
import Map from '../models/Map.js';

const movePlayer = async (req, res ) => {
    try{
        req.params.playerIndex = parseInt(req.params.playerIndex);
        const {playerIndex} = req.params;
        if(playerIndex<0 || playerIndex>=4){
            throw new Error('Invalid player index');
        }
        const { steps } = req.body;
        const game = await queryCurrentGame();
        const player = game.players[playerIndex];
        if (!player) {
            throw new Error('Player not found');
        }  
        player.position = (player.position + steps) % game.cells.length;
        game.save();
        return res.json({ newPosition: player.position });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

const queryCurrentGame = async ()=> {
    let game = await Game.findOne();
    if (!game) {
        game = new Game();
        const map = await Map.findOne();
        game.mapId = map._id;
        game.roomNo = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
        game.cells = map.cells;
        await game.save();
    }
    return game;
}

const getCurrentGame = async (req, res) => {
    try {
        const game = await queryCurrentGame();
        return res.json({ game });
    } catch (error) {
        console.error('Error fetching current game:', error);
        return res.status(500).json({ error: error.message });
    }
};

const getCurrentDice = async(req, res)=> {
    const game = await queryCurrentGame();
    if(game){
        return res.json({ dice:game.currentDice });
    }
    return res.status(404).json({ message: 'No current game found' });
}

const dice = async (req, res)=>{
    const diceResult=Math.ceil(Math.random()*6);
    const game = await queryCurrentGame();
    if(game){
        game.currentDice = diceResult;
        await game.save();
    }
    return res.json({ dice:diceResult });
}

export {
    dice,
    getCurrentGame,
    getCurrentDice,
    movePlayer

};