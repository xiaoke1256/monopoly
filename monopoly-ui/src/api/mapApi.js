import axios from 'axios';


export const getMaps = async ()=>{
    try {
        const response = await axios.get(`/api/map/all`);
        console.log("response.data.maps:",response.data.maps)
        return response.data.maps;
    } catch (error) {
        console.error('Error fetching map:', error);
        throw error;
    }
} 
