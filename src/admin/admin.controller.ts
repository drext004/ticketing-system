import {Request, Response} from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createShow = async (req: Request, res: Response) => {
    try {
        const { title, screenName, price, bookingStarts, thumbnail } = req.body;
        
        // Basic validation
        if (!title || !screenName || !price) {
            return res.status(400).json({ error: "Missing required fields: title, screenName, price" });
        }

        // Create the show
        const show = await prisma.show.create({
            data: {
                title,
                screenName,
                price: parseFloat(price),
                status: "active",
                bookingStarts: bookingStarts ? new Date(bookingStarts) : null,
                thumbnail: thumbnail || null,
            }
        });

        // Automatically generate 100 seats for this show
        const seatData = [];
        for (let i = 0; i < 100; i++) {
            seatData.push({
                status: "available",
                showId: show.showId
            });
        }
        
        await prisma.seat.createMany({
            data: seatData
        });

        res.status(201).json({ message: "Show created successfully with 100 seats.", show });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const deleteShow = async (req: Request, res: Response) => {
    try {
        const showId = req.params.showId;
        
        // Delete all seats associated with the show first (if not cascading)
        await prisma.seat.deleteMany({
            where: { showId: showId }
        });

        // Delete the show
        await prisma.show.delete({
            where: { showId: showId }
        });

        res.status(200).json({ message: "Show and associated seats deleted successfully." });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const getShows = async (req: Request, res: Response) => {
    try {
        const shows = await prisma.show.findMany({
            orderBy: { bookingStarts: 'asc' }
        });
        res.status(200).json({ shows });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};
