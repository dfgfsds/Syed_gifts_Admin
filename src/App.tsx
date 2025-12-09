import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import CreateStore from './pages/CreateStore';
import StoreLayout from './pages/store/StoreLayout';
import StoreSettings from './pages/StoreSettings';
import Products from './pages/store/Products';
import Categories from './pages/store/Categories';
import Orders from './pages/store/Orders';
import Users from './pages/store/Users';
import WebsiteUsers from './pages/store/WebsiteUsers';
import Marketing from './pages/store/Marketing';
import Analytics from './pages/store/Analytics';
import SingleOrder from './pages/store/SingleOrder';
import ProtectedRoutes from './ProtectedRoutes';
import ErrorPage from './components/ErrorPage';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Dashboard from './pages/Dashboard';
import Banner from './pages/store/Banner';
import CouponsMain from './pages/store/Coupons';
import BlogsMain from './pages/store/Blogs';
import ReviewsMain from './pages/store/Reviews';
import Testimonials from './pages/store/Testimonials';
import ShopByVideos from './pages/store/ShopByVideos';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <ToastContainer position="top-right" autoClose={3000} />
        <Navbar />
        <Routes>
          {/* <Route path="/" element={<Home />} /> */}
          {/* <Route path="/" element={<LandingPageMain />} /> */}
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route element={<ProtectedRoutes />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/create-store" element={<CreateStore />} />
            <Route path="/store/:id/website-users/singleOrder/:id" element={<SingleOrder />} />
            <Route path="/store/:id" element={<StoreLayout />}>
              <Route path="products" element={<Products />} />
              <Route path="banner" element={<Banner />} />
              <Route path="coupons" element={<CouponsMain />} />
              <Route path="blogs" element={<BlogsMain />} />
              <Route path="reviews" element={<ReviewsMain />} />
              <Route path="categories" element={<Categories />} />
              <Route path="orders" element={<Orders />} />
              <Route path="users" element={<Users />} />
              <Route path="website-users" element={<WebsiteUsers />} />
              <Route path="marketing" element={<Marketing />} />
              <Route path="analytics" element={<Analytics />} />
              <Route path="settings" element={<StoreSettings />} />
              <Route path="testimonials" element={<Testimonials />} />
              <Route path="shopByVideos" element={<ShopByVideos />} />
            </Route>
          </Route>
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;