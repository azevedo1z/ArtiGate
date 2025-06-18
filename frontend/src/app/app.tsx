import { Route, Routes } from 'react-router-dom';
import Layout from '../components/layout.component';
import HomePage from './pages/home.page';
import LoginPage from './pages/login.page';

export function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </Layout>
  );
}

export default App;
