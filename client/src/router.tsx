import { createBrowserRouter } from 'react-router-dom';
import React, { Suspense } from 'react';

import RootLayout from './components/layout/RootLayout';
import HomePage from './pages/HomePage';
import Spinner from './components/shared/Spinner';
import NotFoundPage from './pages/NotFoundPage';
import ErrorPage from './pages/ErrorPage';

// Lazy load pages for better performance
const CategoryPage = React.lazy(() => import('./pages/CategoryPage'));
const ProductDetailPage = React.lazy(() => import('./pages/ProductDetailPage'));
const ServicesPage = React.lazy(() => import('./pages/ServicesPage'));
const ServiceDetailPage = React.lazy(() => import('./pages/ServiceDetailPage'));
const BlogPage = React.lazy(() => import('./pages/BlogPage'));
const ArticleDetailPage = React.lazy(() => import('./pages/ArticleDetailPage'));
const AboutPage = React.lazy(() => import('./pages/AboutPage'));
const ContactPage = React.lazy(() => import('./pages/ContactPage'));
const LoginPage = React.lazy(() => import('./pages/LoginPage'));
const RegisterPage = React.lazy(() => import('./pages/RegisterPage'));
const AccountPage = React.lazy(() => import('./pages/AccountPage'));
const CartPage = React.lazy(() => import('./pages/CartPage'));
const CheckoutPage = React.lazy(() => import('./pages/CheckoutPage'));

const SuspenseWrapper = ({ children }: { children: React.ReactNode }) => (
  <Suspense
    fallback={
      <div className="flex h-96 items-center justify-center">
        <Spinner />
      </div>
    }
  >
    {children}
  </Suspense>
);

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <HomePage /> },

      // --- Main Route for All Category Pages ---
      {
        path: 'products/:categorySlug',
        element: <SuspenseWrapper><CategoryPage /></SuspenseWrapper>,
      },
      
      // --- Main Route for All Product Detail Pages ---
      {
        path: 'product/:slug',
        element: <SuspenseWrapper><ProductDetailPage /></SuspenseWrapper>,
      },
      
      // --- Other Application Routes ---
      {
        path: 'services',
        element: <SuspenseWrapper><ServicesPage /></SuspenseWrapper>,
      },
      {
        path: 'services/:slug',
        element: <SuspenseWrapper><ServiceDetailPage /></SuspenseWrapper>,
      },
      {
        path: 'blog',
        element: <SuspenseWrapper><BlogPage /></SuspenseWrapper>,
      },
      {
        path: 'blog/:slug',
        element: <SuspenseWrapper><ArticleDetailPage /></SuspenseWrapper>,
      },
      {
        path: 'about',
        element: <SuspenseWrapper><AboutPage /></SuspenseWrapper>,
      },
      {
        path: 'contact',
        element: <SuspenseWrapper><ContactPage /></SuspenseWrapper>,
      },
      {
        path: 'login',
        element: <SuspenseWrapper><LoginPage /></SuspenseWrapper>,
      },
      {
        path: 'register',
        element: <SuspenseWrapper><RegisterPage /></SuspenseWrapper>,
      },
      {
        path: 'account',
        element: <SuspenseWrapper><AccountPage /></SuspenseWrapper>,
      },
      {
        path: 'cart',
        element: <SuspenseWrapper><CartPage /></SuspenseWrapper>,
      },
      {
        path: 'checkout',
        element: <SuspenseWrapper><CheckoutPage /></SuspenseWrapper>,
      },
      
      // --- Catch-All 404 Route ---
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);