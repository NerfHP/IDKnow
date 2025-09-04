import { Request, Response } from 'express';
import { catchAsync } from '../utils/catchAsync';
import { contentSerivce } from '../services';

const getItems = catchAsync(async (req: Request, res: Response) => {
  const { type, category } = req.query;
  const items = await contentSerivce.queryItems({
    type: type as string,
    categorySlug: category as string,
  });
  res.send(items);
});

const getItemBySlug = catchAsync(async (req: Request, res: Response) => {
  const item = await contentSerivce.getItemBySlug(req.params.slug);
  res.send(item);
});

const getCategories = catchAsync(async (req: Request, res: Response) => {
  const categories = await contentSerivce.getCategories();
  res.send(categories);
});

const getCategoryPageData = catchAsync(async (req: Request, res: Response) => {
  const data = await contentSerivce.getCategoryPageData(req.params.slug);
  res.send(data);
});

export const contentController = {
  getItems,
  getItemBySlug,
  getCategories,
  getCategoryPageData,
};