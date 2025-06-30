import { Route, Routes } from 'react-router-dom';
import Layout from '../components/layout.component';
import HomePage from '../pages/home.page';
import LoginPage from '../pages/login.page';
import SignUpPage from '../pages/signup.page';

export function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
      </Routes>
    </Layout>
  );
}

export default App;
