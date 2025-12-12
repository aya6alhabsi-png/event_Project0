import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

import Header from './components/Header';
import Footer from './components/Footer';
import Home from './components/Home';
import Login from './components/Login';
import Adminlogin from './components/Adminlogin';
import Register from './components/Register';
import ShowEvents from './components/ShowEvents';
import AdminPage from './components/AdminPage';



function ProtectedRoute({ role, children }) {
  const { user } = useSelector((state) => state.auth);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (role && user.role !== role) {
    return <Navigate to="/" replace />;
  }

  return children;
}

function App() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Header />
      <main className="flex-grow-1">
        <Routes>

       
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin/login" element={<Adminlogin />} />
          <Route path="/register" element={<Register />} />
          

       
          <Route
            path="/events"
            element={
              <ProtectedRoute role="user">
                <ShowEvents />
              </ProtectedRoute>
            }
          />

        
          <Route
            path="/admin"
            element={
              <ProtectedRoute role="admin">
                <AdminPage />
              </ProtectedRoute>
            }
          />

        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
