import express from 'express';
import { contentController } from '../controllers';

const router = express.Router();

// This endpoint is for CATEGORY pages.
router.get('/category-data/*', contentController.getCategoryPageData);

// This NEW endpoint is for PRODUCT pages.
router.get('/product-data/:slug', contentController.getProductPageData);

// --- Your other routes ---
router.get('/featured', contentController.getFeaturedItems);
router.get('/products', contentController.getAllProducts);
router.get('/product/:slug', contentController.getItemBySlug); // This might be for quick-lookups, you can keep it
router.get('/categories', contentController.getCategories);

export default router;
