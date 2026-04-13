import { Route, Routes } from 'react-router-dom';
import Layout from '../components/layout.component';
import Toaster from '../providers/toaster.provider';
import PrivateRoute from '../components/private-route.component';
import LandingPage from '../pages/landing.page';
import LoginPage from '../pages/login.page';
import SignUpPage from '../pages/signup.page';
import HomePage from '../pages/home.page';
import AboutPage from '../pages/about.page';
import SubmitArticlePage from '../pages/submit-article.page';
import MyArticlesPage from '../pages/my-articles.page';
import SubmitReviewPage from '../pages/submit-review.page';
import MyReviewsPage from '../pages/my-reviews.page';

export function App() {
  return (
    <Toaster>
      <Layout>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route
            path="/home"
            element={
              <PrivateRoute>
                <HomePage />
              </PrivateRoute>
            }
          />
          <Route path="/about" element={<AboutPage />} />
          <Route
            path="/submit-article"
            element={
              <PrivateRoute>
                <SubmitArticlePage />
              </PrivateRoute>
            }
          />
          <Route
            path="/my-articles"
            element={
              <PrivateRoute>
                <MyArticlesPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/submit-review"
            element={
              <PrivateRoute>
                <SubmitReviewPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/my-reviews"
            element={
              <PrivateRoute>
                <MyReviewsPage />
              </PrivateRoute>
            }
          />
        </Routes>
      </Layout>
    </Toaster>
  );
}

export default App;
