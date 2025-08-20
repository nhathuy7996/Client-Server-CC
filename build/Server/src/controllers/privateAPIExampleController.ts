import { Request, Response } from 'express';

export const postAPI = async (req: Request, res: Response) => {
     
    try {
        const data = req.body;
        
        res.status(201).json({
            success: true,
            message: 'Data saved successfully',
            data:{  }
        });

    } catch (error) {
        console.error('Error saving data:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to save data',
            data:{}
        });
    }
};

export const getAPI = (req: Request, res: Response) => {
    try {
        const data = req.query;
       
        res.json({
            success: true,
            message: `get Data success`,
            data: {}
        });

    } catch (error) {
        console.error('Error retrieving data:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve data',
            data: {}
        });
    }
}; 