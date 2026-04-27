import { Router } from 'express';
import { otpRoutes } from '../modules/otp/otp.routes';
import { userRoutes } from '../modules/user/user.route';
import { authRoutes } from '../modules/auth/auth.route';
import { notificationRoutes } from '../modules/notification/notificaiton.route';
import { eventsRoutes } from '../modules/events/events.route';
import { allDataRoutes } from '../modules/allData/allData.route';

const router = Router();
const moduleRoutes = [
  {
    path: '/users',
    route: userRoutes,
  },
  {
    path: '/auth',
    route: authRoutes,
  },
  {
    path: '/otp',
    route: otpRoutes,
  },
  {
    path: '/notifications',
    route: notificationRoutes,
  },
  {
    path: '/event',
    route: eventsRoutes,
  },
  {
    path: '/all-data',
    route: allDataRoutes,
  },
];
moduleRoutes.forEach(route => router.use(route.path, route.route));

export default router;
