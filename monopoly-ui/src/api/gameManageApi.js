import axios from '@/axios';

export const getValidGames = async ()=>{
    try {
        const response = await axios.get(`/gameManage/validGames`);
        return response.data.data.games;
    } catch (error) {
        console.error('Error fetching map:', error);
        throw error;
    }
}

export const startExistGame = async ({gameId})=>{
    try {
        const response = await axios.post(`/gameManage/startExistGame`,{
            gameId
        });
        return response.data;
    } catch (error) {
        console.error('Error start game:', error);
        throw error;
    }
};

export const createGame = async (form)=>{
    try {
        const response = await axios.post(`/gameManage/createGame`,form);
        return response.data;
    } catch (error) {
        console.error('Error start game:', error);
        throw error;
    }
}