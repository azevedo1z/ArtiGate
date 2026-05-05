import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import Layout from '../components/layout.component';
import Toaster from '../providers/toaster.provider';
import PrivateRoute from '../components/private-route.component';
import RequireAccessFee from '../components/require-access-fee.component';
import RoleProtectedRoute from '../components/role-protected-route.component';
import { ROUTES, ROLES } from '../config/routes.config';

const LandingPage = lazy(() => import('../pages/landing.page'));
const LoginPage = lazy(() => import('../pages/login.page'));
const SignUpPage = lazy(() => import('../pages/signup.page'));
const HomePage = lazy(() => import('../pages/home.page'));
const AboutPage = lazy(() => import('../pages/about.page'));
const SubmitArticlePage = lazy(() => import('../pages/submit-article.page'));
const MyArticlesPage = lazy(() => import('../pages/my-articles.page'));
const SubmitReviewPage = lazy(() => import('../pages/submit-review.page'));
const MyReviewsPage = lazy(() => import('../pages/my-reviews.page'));
const CheckoutPage = lazy(() => import('../pages/checkout.page'));
const NotFoundPage = lazy(() => import('../pages/not-found.page'));

const LoadingFallback = () => (
  <div className="flex justify-center items-center py-24">
    <div className="h-8 w-8 animate-spin rounded-full border-[3px] border-blue-600 border-t-transparent" />
  </div>
);

export function App() {
  return (
    <Toaster>
      <Layout>
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route path={ROUTES.LANDING} element={<LandingPage />} />
            <Route path={ROUTES.LOGIN} element={<LoginPage />} />
            <Route path={ROUTES.SIGNUP} element={<SignUpPage />} />
            <Route path={ROUTES.ABOUT} element={<AboutPage />} />
            <Route
              path={ROUTES.HOME}
              element={
                <PrivateRoute>
                  <RequireAccessFee>
                    <HomePage />
                  </RequireAccessFee>
                </PrivateRoute>
              }
            />
            <Route
              path={ROUTES.SUBMIT_ARTICLE}
              element={
                <PrivateRoute>
                  <RequireAccessFee>
                    <SubmitArticlePage />
                  </RequireAccessFee>
                </PrivateRoute>
              }
            />
            <Route
              path={ROUTES.MY_ARTICLES}
              element={
                <PrivateRoute>
                  <RequireAccessFee>
                    <MyArticlesPage />
                  </RequireAccessFee>
                </PrivateRoute>
              }
            />
            <Route
              path={ROUTES.SUBMIT_REVIEW}
              element={
                <PrivateRoute>
                  <RequireAccessFee>
                    <RoleProtectedRoute requiredRole={ROLES.REVIEWER}>
                      <SubmitReviewPage />
                    </RoleProtectedRoute>
                  </RequireAccessFee>
                </PrivateRoute>
              }
            />
            <Route
              path={ROUTES.MY_REVIEWS}
              element={
                <PrivateRoute>
                  <RequireAccessFee>
                    <RoleProtectedRoute requiredRole={ROLES.REVIEWER}>
                      <MyReviewsPage />
                    </RoleProtectedRoute>
                  </RequireAccessFee>
                </PrivateRoute>
              }
            />
            <Route
              path={ROUTES.CHECKOUT}
              element={
                <PrivateRoute>
                  <CheckoutPage />
                </PrivateRoute>
              }
            />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </Layout>
    </Toaster>
  );
}

export default App;
