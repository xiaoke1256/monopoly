

import axios from 'axios';

export const getPlayerMoney = async (playerIndex) => {
    try {
        const response = await axios.get(`/api/game/player/${playerIndex}/money`);
        return response.data.money;
    } catch (error) {
        console.error('Error fetching player money:', error);
        throw error;
    }
};

export const getPlayerMessage = async (playerIndex) => {
    try {
        const response = await axios.get(`/api/game/player/${playerIndex}/message`);
        return response.data;
    } catch (error) {
        console.error('Error fetching player message:', error);
        throw error;
    }
};
