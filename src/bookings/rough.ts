import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import crypto, { randomBytes } from 'node:crypto';
import { io } from '../../index';

const prisma = new PrismaClient();

const confirmPayment = async (req: Request, res: Response) => {
    const userId = (req as any).user.userId;
    const { seatIds , show } = req.body;

    if (!seatIds || seatIds.length === 0){
        return res.status(400).json({error: "No seats selected."});
    }

    if(seatIds.length > 6){
        return res.status(400).json({error: "Maximum 6 seats allowed."})
    }

    try {
        const seats = await prisma.$transaction(async (tx) => {
            const seatDetails = await tx.seat.findMany({ where: { id: {in:seatIds.id} } })
            if (!seatDetails) {
                throw new Error("bad request.")
            }

            if(seats.length !== seatIds.length){
                throw new Error("One or more seats can't be booked.")
            }
            for (const currentSeat of seats) {
        if (
            currentSeat.userId !== userId || 
            currentSeat.status !== "HELD" || 
            currentSeat.showId !== show.showId
            ) {
                throw new Error(`Validation failed: Seat ${currentSeat.id} is not held or does not belong to you.`);
              }
        }

           const seatId : any = seats.id;
           const showId = seats.showId;
           const verifyUser = seats.userId;
           const seatStatus = seats.status;
           const mockPaymentId = `pay_${randomBytes(8).toString('hex')}`;

            if (verifyUser === userId &&
                seatStatus === "HELD" &&
                showId === show.showId
            ) {
                const updatedSeat = await tx.seat.update({
                    where: { id: seatId },
                    data: {
                        paymentId: mockPaymentId
                    }
                })
                io.emit('seatUpdate');
                return updatedSeat;
            }
            else {
                throw new Error("Validation failed: Seat is not held or does not belong to you.")
            }

        })
        res.status(200).json({ seats, message: 'Payment Successful' })
    }
    catch (error: any) {
        res.status(409).json({ error: error.message });

    }
}

export default confirmPayment;