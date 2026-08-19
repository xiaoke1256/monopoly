

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

export const payForMessage = async ({playerIndex,yourSelectedMoney,otherSelectedMoney}) => {
    try {
        const response = await axios.post(`/api/game/player/${playerIndex}/payForMessage`, {
            yourSelectedMoney,
            otherSelectedMoney
        });
        return response.data;
    } catch (error) {
        console.error('Error paying for message:', error);
        throw error;
    }
};
