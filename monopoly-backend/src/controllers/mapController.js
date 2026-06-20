import Map from '../models/Map.js';

const getAllMaps = async (req, res) => {
    try {
        const maps = await Map.find();
        return res.json({ maps });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

const getMapById = async (req, res) => {
    try {
        const map = await Map.findById(req.params.id);
        if (!map) {
            return res.status(404).json({ message: 'Map not found' });
        }
        return res.json({ map });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

const getDefaultMap = async (req, res) => {
    try {
        const map = await Map.findOne();
        if (!map) {
            return res.status(404).json({ message: 'Map not found, please initialize first' });
        }
        return res.json({ map });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

export {
    getAllMaps,
    getMapById,
    getDefaultMap
};