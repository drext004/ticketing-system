import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { io } from '../../index';


const prisma = new PrismaClient();

const reserveSeat = async (request: Request, response: Response) => {
    const userId = (request as any).user.userId;
    const { seatIds, showId } = request.body;

    if (!seatIds || seatIds.length === 0) {
    return response.status(400).json({ error: "No seats selected." });
}

if (seatIds.length > 6) {
    return response.status(400).json({ error: "Maximum 6 seats allowed per transaction." });
}

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


            const seats = await tx.seat.findMany({ where: { id:{ in: seatIds } } });

            if (seats.length !== seatIds.length) {
    throw new Error("One or more seats could not be found.");
}

    for (const seat of seats) {
                const isActiveHold = seat.status === "HELD" &&
                seat.expiryTime &&
                Date.now() < seat.expiryTime.getTime();

    if (seat.status === "BOOKED" || isActiveHold) {
        throw new Error(`Seat ${seat.id} is already taken or being bought.`);
    }
}
            const expiryTime = 10 * 60 * 1000 + Date.now();

            const updatedSeat = await tx.seat.updateMany({
                where: { id: { in: seatIds} },
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


