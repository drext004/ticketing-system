import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { io } from '../../index';

const prisma = new PrismaClient();

const getSeatMap = async (req: Request, res: Response) => {
    const userId = (req as any).user.userId;
    const showCode = req.params.showId as string;

    try {
        await prisma.seat.updateMany({
            where: {
                showId: showCode, status: 'HELD', expiryTime: { lt: new Date() }
            }, data: {
                status: "AVAILABLE",
                userId: null,
                expiryTime: null
            }
        });


        const result = await prisma.seat.findMany({ where: { showId: showCode }, orderBy: { id: 'asc' } });
        if (!result.length) {
            throw new Error("Couldn't retreive seat map.")
        }
        res.status(200).json({ result, message: "Seat Map fetched succesfully!" })

    }

    catch (error: any) {
        res.status(409).json({ error: error.message });
    }
}

export default getSeatMap;