import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { io } from '../../index';


const prisma = new PrismaClient();

const confirmBooking = async (req: Request, res: Response) => {
    const userId = (req as any).user.userId
    const seat = req.body;

    try {
        const result = await prisma.$transaction(async (tx) => {
            const seatExists = await tx.seat.findUnique({ where: { id: seat.seatId } })

            if (!seatExists) {
                throw new Error("Seat not found")
            }

            const userCheck = seatExists.userId;

            const paymentMade = seatExists.paymentId;

            const seatStatus = seatExists.status;

            const showId = seatExists.showId;

            if (seatStatus === "HELD" && paymentMade &&
                userCheck === userId &&
                seatExists.expiryTime &&
                Date.now() < seatExists.expiryTime.getTime() &&
                seat.showId === showId) {
                const updatedSeat = await tx.seat.update({
                    where: { id: seat.seatId },
                    data: {
                        status: "BOOKED",
                        expiryTime: null
                    }
                })

                io.emit('seatUpdate');


                return updatedSeat;
            }

            else {
                throw new Error("Invalid Request.")
            }



        })

        res.status(200).json({ res: result })

    }
    catch (error: any) {
        res.status(409).json({ error: error.message });

    }
}

export default confirmBooking;