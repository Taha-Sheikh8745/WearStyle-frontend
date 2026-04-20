import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Layouts
import MainLayout from './components/layout/MainLayout';
import AdminLayout from './components/layout/AdminLayout';

// Public Pages
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Contact from './pages/Contact';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import ProductsList from './pages/admin/ProductsList';
import AddProduct from './pages/admin/AddProduct';
import EditProduct from './pages/admin/EditProduct';
import AdminOrders from './pages/admin/AdminOrders';
import AdminContacts from './pages/admin/AdminContacts';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="shop" element={<Shop />} />
          <Route path="product/:id" element={<ProductDetails />} />
          <Route path="cart" element={<Cart />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="contact-us" element={<Contact />} />
        </Route>

        {/* Hidden Admin Route — not linked anywhere in the UI */}
        <Route path="/admin-portal-xyz123" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="products" element={<ProductsList />} />
          <Route path="add-product" element={<AddProduct />} />
          <Route path="edit-product/:id" element={<EditProduct />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="contacts" element={<AdminContacts />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
