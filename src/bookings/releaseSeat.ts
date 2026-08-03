import express, { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { io } from "../../index";
const prisma = new PrismaClient();

export const releaseSeat = async (req: Request, res: Response) => {
    try {
        const { seat } = req.body;
        await prisma.seat.updateMany({
            where: { id: seat.seatId, status: 'HELD' },
            data: {
                status: "AVAILABLE",
                userId: null,
                expiryTime: null
            }
        });

        io.emit('seatUpdate');

        res.status(200).json({ message: "Seat released successfully." });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};
