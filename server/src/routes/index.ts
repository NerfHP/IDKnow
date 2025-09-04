import express from 'express';
import authRoutes from './auth.routes';
import contentRoutes from './content.routes';
import formRoutes from './form.routes';

const router = express.Router();

const defaultRoutes = [
  {
    path: '/auth',
    route: authRoutes,
  },
  {
    path: '/content',
    route: contentRoutes,
  },
  {
    path: '/form',
    route: formRoutes,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;