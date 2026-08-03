import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function resetSeats() {
    try {
        console.log("Resetting all seats to AVAILABLE...");
        const result = await prisma.seat.updateMany({
            data: {
                status: "AVAILABLE",
                userId: null,
                expiryTime: null,
                paymentId: null
            }
        });
        console.log(`Successfully reset ${result.count} seats!`);
    } catch (error) {
        console.error("Error resetting seats:", error);
    } finally {
        await prisma.$disconnect();
    }
}

resetSeats();
