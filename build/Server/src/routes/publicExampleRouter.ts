import express from 'express'; 
const router = express.Router();

router.get('/example/:dataID', async (req, res) => {
    try {
        
        res.json({
            success: true,
            data: {
                ID: req.params.dataID
            }
        });
    } catch (error) {
        res.status(404).json({
            success: false,
            message: 'Error'
        });
    }
});

router.get('/example2', async (req, res) => {
    res.json({
        success: true,
        data: {}
    });
}); 

export default router; 