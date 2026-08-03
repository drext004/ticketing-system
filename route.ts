import { Router } from 'express';
import register from './src/common/register';
import login from './src/common/loginJWTCreate';
import authenticateToken from './src/common/auth';
import getSeatMap from './src/bookings/getSeatMap';
import reserveSeat from './src/bookings/seatStatusControl';
import confirmPayment from './src/bookings/paymentGateway';
import confirmBooking from './src/bookings/confirmBooking';
import { createShow, deleteShow, getShows } from './src/admin/admin.controller';
import { releaseSeat } from './src/bookings/releaseSeat';


const router = Router();

router.post('/register', register)
router.post('/login', login);
router.get('/getSeats/shows/:showId/seats', authenticateToken, getSeatMap);
router.post('/chooseShow', authenticateToken, reserveSeat)
router.post('/payment', authenticateToken, confirmPayment)
router.post('/booking', authenticateToken, confirmBooking)
router.post('/releaseSeat', authenticateToken, releaseSeat)
router.get('/shows', getShows);
router.post('/admin/shows', createShow);
router.delete('/admin/shows/:showId', deleteShow);

export default router;