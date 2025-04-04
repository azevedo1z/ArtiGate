import { Route, Routes, Link } from 'react-router-dom';

export function App() {
  return (
    <div>
      <Routes>
        <Route
          path="/"
          element={
            <div>
              This is the home page.
              <br></br>
              <Link to="/register">Click here for registration.</Link>
            </div>
          }
        />
        <Route
          path="/login"
          element={
            <div>
              Login page.
              <br></br>
              <Link to="/">Click here to back to home page.</Link>
            </div>
          }
        />
        <Route
          path="/register"
          element={
            <div>
              <Link to="/">Click here to go back to home page.</Link>
            </div>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
