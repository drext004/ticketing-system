import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import crypto, { randomBytes } from 'node:crypto';
import { io } from '../../index';

const prisma = new PrismaClient();

const confirmPayment = async (req: Request, res: Response) => {
    const userId = (req as any).user.userId;
    const { seat, show } = req.body;


    try {
        const result = await prisma.$transaction(async (tx) => {
            const seatDetails = await tx.seat.findUnique({ where: { id: seat.id } })
            if (!seatDetails) {
                throw new Error("bad request.")
            }
            const seatId = seatDetails.id;
            const showId = seatDetails.showId;
            const verifyUser = seatDetails.userId;
            const seatStatus = seatDetails.status;
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
        res.status(200).json({ result, message: 'Payment Successful' })
    }
    catch (error: any) {
        res.status(409).json({ error: error.message });

    }
}

export default confirmPayment;