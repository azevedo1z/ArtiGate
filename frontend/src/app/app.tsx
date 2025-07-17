import { Route, Routes } from 'react-router-dom';
import Layout from '../components/layout.component';
import Toaster from '../providers/toaster.provider';
import LandingPage from '../pages/landing.page';
import LoginPage from '../pages/login.page';
import SignUpPage from '../pages/signup.page';
import HomePage from '../pages/home.page';

export function App() {
  return (
    <Toaster>
      <Layout>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/home" element={<HomePage />} />
        </Routes>
      </Layout>
    </Toaster>
  );
}

export default App;
