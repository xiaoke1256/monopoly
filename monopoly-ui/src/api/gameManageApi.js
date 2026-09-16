import axios from 'axios';

export const getValidGames = async ()=>{
    try {
        const response = await axios.get(`/api/gameManage/validGames`,{
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            }
        });
        return response.data.data.games;
    } catch (error) {
        console.error('Error fetching map:', error);
        throw error;
    }
}