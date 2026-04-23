import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Places from './pages/Places';
import PlaceDetail from './pages/PlaceDetail';
import Itinerary from './pages/Itinerary';
import CategoryPage from './pages/CategoryPage';
import AdminPlaces from './pages/AdminPlaces';
import './App.css';
import './pages/AdminPlaces.css';

const getAdminInfo = () => {
  try {
    const data = localStorage.getItem('adminInfo');
    return data ? JSON.parse(data) : null;
  } catch (error) {
    return null;
  }
};

const UserLayout = () => {
  return (
    <>
      <Navbar />
      <main className="main-content">
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

const AdminLayout = () => {
  const adminInfo = getAdminInfo();

  if (!adminInfo) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="admin-only-layout">
      <main className="admin-only-content">
        <Outlet />
      </main>
    </div>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<UserLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/places" element={<Places />} />
          <Route path="/place/:id" element={<PlaceDetail />} />
          <Route path="/itinerary" element={<Itinerary />} />
          <Route path="/category/:category" element={<CategoryPage />} />
        </Route>

        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminPlaces />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;