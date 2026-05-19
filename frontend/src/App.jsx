import React from 'react';
import { Route, Routes } from 'react-router-dom';
import LandingPage from './pages/shared/LandingPage';
import Properties from './pages/shared/Properties';
import PropertyDetails from './pages/shared/PropertyDetails';
import Register from './pages/auth/register';
import VerifyEmail from './pages/auth/VerifyEmail';
import Login from './pages/auth/Login';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import Profile from './pages/shared/Profile';
import AdminLayout from './components/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import SellerRequests from './pages/admin/SellerRequests';
import AdminProperties from './pages/admin/AdminProperties';
import AdminInquiries from './pages/admin/AdminInquiries';
import AdminContacts from './pages/admin/AdminContacts';
import SellerDashboard from './pages/Seller/SellerDashboard';
import SellerLayout from './components/SellerLayout';
import AddProperty from './pages/Seller/AddProperty';
import MyProperties from './pages/Seller/MyProperties';

const App = () => {
  return (
    <div>
      <Routes>
        <Route path='/login' element={<Login/>} />
        <Route path='/reset-password/:token' element={<ResetPassword/>} />
        <Route path='/forgot-password' element={<ForgotPassword/>} />
        <Route path='/register' element={<Register/>} />
        <Route path='/verify-email' element={<VerifyEmail/>} />
        <Route path='/profile' element={<Profile />} />

        <Route element={<SellerLayout/>}>
        <Route path='/dashboard' element={<SellerDashboard/>}/>
        <Route path='/add-property' element={<AddProperty/>}/>
        <Route path='/my-properties' element={<MyProperties/>}/>
        </Route>


        <Route path='/' element={<LandingPage />} />

        {/* ✅ SellerRequests moved inside AdminLayout */}
        <Route element={<AdminLayout/>}>
          <Route path='/admin-dashboard' element={<AdminDashboard/>} />
          <Route path='/admin/users' element={<AdminUsers/>}/>
          <Route path='/admin/seller-requests' element={<SellerRequests/>} />
          <Route path='/admin/properties' element={<AdminProperties/>}/>
          <Route path='/admin/inquiries' element={<AdminInquiries/>}/>
          <Route path='/admin/contacts' element={<AdminContacts/>}/>
        </Route>

        <Route path='/properties' element={<Properties />} />
        <Route path='/property/:id' element={<PropertyDetails/>} />
      </Routes>
    </div>
  );
};

export default App;