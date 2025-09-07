import express from 'express';
import { contentController } from '../controllers';

const router = express.Router();

router.get('/featured', contentController.getFeaturedItems);
router.get('/products', contentController.getAllProducts);
router.get('/category/:slug', contentController.getCategoryPageData);
router.get('/product/:slug', contentController.getItemBySlug);
router.get('/categories', contentController.getCategories);

export default router;