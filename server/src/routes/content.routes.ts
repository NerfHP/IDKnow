import express from 'express';
import { contentController } from '../controllers';

const router = express.Router();

router.get('/items', contentController.getItems);
router.get('/item/:slug', contentController.getItemBySlug);
router.get('/categories', contentController.getCategories);
router.get('/category/:slug', contentController.getCategoryPageData);

export default router;