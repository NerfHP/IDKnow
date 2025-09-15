import express from 'express';
import authRoutes from './auth.routes';
import contentRoutes from './content.routes';
import formRoutes from './form.routes';
import reviewRoutes from './review.routes';
import searchRoute from './search.route';

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
  {
    path: '/reviews',
    route: reviewRoutes,
  },
  {
    path: '/search',
    route: searchRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;