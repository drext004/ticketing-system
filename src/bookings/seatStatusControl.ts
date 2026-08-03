import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { io } from '../../index';


const prisma = new PrismaClient();

const reserveSeat = async (request: Request, response: Response) => {
    const userId = (request as any).user.userId;
    const { seatId, showId } = request.body;

    try {
        const result = await prisma.$transaction(async (tx) => {

            const show = await tx.show.findUnique({ where: { showId: showId } });

            if (!show) {
                throw new Error("Show not Found.")
            }

            const isNotBooking = show.bookingStarts &&
                Date.now() < show.bookingStarts.getTime();


            if (show.status === "Private" || isNotBooking) {

                throw new Error("Show is not available for booking right now.")

            }


            const seat = await tx.seat.findUnique({ where: { id: seatId } });

            if (!seat) {

                throw new Error("Seat not found");

            }

            const isActiveHold = seat.status === "HELD" &&
                seat.expiryTime &&
                Date.now() < seat.expiryTime.getTime();

            if (seat.status === "BOOKED" || isActiveHold) {

                throw new Error("Seat already taken or being bought.");
            }


            const expiryTime = 10 * 60 * 1000 + Date.now();

            const updatedSeat = await tx.seat.update({
                where: { id: seatId },
                data: {
                    status: "HELD",
                    userId: userId,
                    showId: showId,
                    expiryTime: new Date(expiryTime)
                }
            });
            io.emit('seatUpdate');
            return updatedSeat;
        });

        response.status(200).json({ message: "Seat held!", seat: result });

    }

    catch (error: any) {

        response.status(409).json({ error: error.message });
    }

};

export default reserveSeat;


