import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { io } from '../../index';


const prisma = new PrismaClient();

const confirmBooking = async (req: Request, res: Response) => {
    const userId = (req as any).user.userId
    const { seatIds, showId } = req.body;

    try {
        const result = await prisma.$transaction(async (tx) => {
            const seatsExist = await tx.seat.findMany({ where: { id: { in: seatIds } } });

            if (seatsExist.length !== seatIds.length) {
                throw new Error("One or more seats not found")
            }

            for (const seat of seatsExist) {
                if (seat.status !== "HELD" || 
                    !seat.paymentId ||
                    seat.userId !== userId ||
                    !seat.expiryTime ||
                    Date.now() >= seat.expiryTime.getTime() ||
                    seat.showId !== showId) {
                    throw new Error(`Invalid Request for seat ${seat.id}.`);
                }
            }

            const updatedSeats = await tx.seat.updateMany({
                where: { id: { in: seatIds } },
                data: {
                    status: "BOOKED",
                    expiryTime: null
                }
            })

            io.emit('seatUpdate');

            return updatedSeats;

        })

        res.status(200).json({ res: result })

    }
    catch (error: any) {
        res.status(409).json({ error: error.message });

    }
}

export default confirmBooking;