import express from 'express';
import { reviewController } from '../controllers';
// You would add your auth middleware here to protect the create route
// import { authMiddleware } from '../middleware/auth.middleware';

const router = express.Router();

router.get('/:productId', reviewController.getReviewsByProductId);
// router.post('/', authMiddleware, reviewController.createReview);
router.post('/', reviewController.createReview); // Unprotected for now

export default router;