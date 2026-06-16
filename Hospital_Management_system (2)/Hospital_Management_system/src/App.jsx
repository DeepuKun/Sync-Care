import React from "react"
import { useState } from 'react'
import { Route, BrowserRouter, Routes,useLocation } from 'react-router-dom'
import { AnimatePresence } from "framer-motion";
import Doc_view from './pages/Doc_view'
import Lab from './pages/Lab'
import Front_desk_view from './pages/Front_desk_view'
import Medicine_dept from './pages/Medicine_dept'
import Home from './pages/Home'
import Login_Page from './pages/Login_Page'
import NoRole from './pages/NoRole'
import All_Meds from './pages/All_Meds'
import Search_med from './components/Search_med'
import Prescription_search from './pages/Prescription_search'
import Add_Patient from './pages/Add_Patient'
import User from './pages/User'
import Login_choice from './pages/Login_choice'
import User_login from "./pages/User_login"
import User_register from "./pages/User_register"
import All_patients from "./pages/All_patients"
import Ready_patients from "./pages/Ready_patients"
import All_Doctors from "./pages/All_Doctors"
import Search_doctors from "./pages/Search_doctors"
import Lowest_medicine from "./pages/Lowest_medicine"
import XYZ from "./pages/XYZ"
import Admin_login from "./pages/admin/Admin_login";
import Admin from "./pages/admin/Admin";
import Admin_doc from "./pages/admin/Admin_doc";
import Admin_Front from "./pages/admin/Admin_Front";
import Admin_Med from "./pages/admin/Admin_Med";
import Admin_lab from "./pages/admin/Admin_lab";
import Admin_add_doc from "./pages/admin/Admin_add_doc";
import Admin_remove_doc from "./pages/admin/Admin_remove_doc";
import Admin_update_doc from "./pages/admin/Admin_update_doc";
import Admin_view_doc from "./pages/admin/Admin_view_doc";
import Admin_update_med from "./pages/admin/Admin_update_med";
import Admin_remove_med from "./pages/admin/Admin_remove_med";
import Admin_view_med from "./pages/admin/Admin_view_med";
import Admin_add_front from "./pages/admin/Admin_add_front";
import Admin_remove_front from "./pages/admin/Admin_remove_front";
import Admin_update_front from "./pages/admin/Admin_update_front";
import Admin_view_front from "./pages/admin/Admin_view_front";
import Admin_add_lab from "./pages/admin/Admin_add_lab";
import Admin_remove_lab from "./pages/admin/Admin_remove_lab";
import Admin_update_lab from "./pages/admin/Admin_update_lab";
import Admin_view_lab from "./pages/admin/Admin_view_lab";
import Admin_add_med from "./pages/admin/admin_add_med";
import Add_lab_test from "./pages/Add_lab_test";
import Front_lab_page from "./pages/Front_lab_page";
import All_Lab_Test from "./pages/All_Lab_Test";
import Lab_ready_queue from "./pages/Lab_ready_queue";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  const location = useLocation();
  return (
    <div>
      <AnimatePresence mode="wait">
      
      <Routes location={location} key={location.pathname}>
        {/* Public Routes */}
        <Route path='/' element={<Home/>}/>
        <Route path='/Login_choice' element={<Login_choice/>}/>
        <Route path='/User_login' element={<User_login/>}/>
        <Route path='/User_register' element={<User_register/>}/>
        <Route path='/login-page' element={<Login_Page/>}/>
        <Route path="/admin-login" element={<Admin_login/>}/>
        <Route path='/no_role/:id' element={<NoRole/>}/>
        <Route path="/xyz" element={<XYZ/>}/>

        {/* Doctor Routes */}
        <Route path='/doctor_view' element={
          <ProtectedRoute allowedRoles={['doctor_view', 'admin']}>
            <Doc_view/>
          </ProtectedRoute>
        }/>
        <Route path='/search-prescription' element={
          <ProtectedRoute allowedRoles={['doctor_view', 'admin']}>
            <Prescription_search/>
          </ProtectedRoute>
        }/>

        {/* Lab Tech Routes */}
        <Route path='/lab_view' element={
          <ProtectedRoute allowedRoles={['lab_view', 'admin']}>
            <Lab/>
          </ProtectedRoute>
        }/>
        <Route path="/lab-ready-queue" element={
          <ProtectedRoute allowedRoles={['lab_view', 'admin']}>
            <Lab_ready_queue/>
          </ProtectedRoute>
        }/>
        <Route path="/all-lab-test" element={
          <ProtectedRoute allowedRoles={['lab_view', 'admin']}>
            <All_Lab_Test/>
          </ProtectedRoute>
        }/>

        {/* Front Desk Routes */}
        <Route path='/front_desk_view' element={
          <ProtectedRoute allowedRoles={['front_desk_view', 'admin']}>
            <Front_desk_view/>
          </ProtectedRoute>
        }/>
        <Route path='/add-patient' element={
          <ProtectedRoute allowedRoles={['front_desk_view', 'admin']}>
            <Add_Patient/>
          </ProtectedRoute>
        }/>
        <Route path='/front-lab-page' element={
          <ProtectedRoute allowedRoles={['front_desk_view', 'admin']}>
            <Front_lab_page/>
          </ProtectedRoute>
        }/>
        <Route path="/add-lab-test" element={
          <ProtectedRoute allowedRoles={['front_desk_view', 'doctor_view', 'admin']}>
            <Add_lab_test/>
          </ProtectedRoute>
        }/>

        {/* Pharmacist / Medicine Routes */}
        <Route path='/medicine_view' element={
          <ProtectedRoute allowedRoles={['medicine_view', 'admin']}>
            <Medicine_dept/>
          </ProtectedRoute>
        }/>
        <Route path='/lowest-medicines' element={
          <ProtectedRoute allowedRoles={['medicine_view', 'admin']}>
            <Lowest_medicine/>
          </ProtectedRoute>
        }/>

        {/* Patient / User Routes */}
        <Route path='/user' element={
          <ProtectedRoute allowedRoles={['user', 'admin']}>
            <User/>
          </ProtectedRoute>
        }/>

        {/* Shared Protected Staff Routes */}
        <Route path='/all-medicines' element={
          <ProtectedRoute allowedRoles={['medicine_view', 'front_desk_view', 'doctor_view', 'admin']}>
            <All_Meds/>
          </ProtectedRoute>
        }/>
        <Route path='/search-medicine' element={
          <ProtectedRoute allowedRoles={['medicine_view', 'front_desk_view', 'doctor_view', 'admin']}>
            <Search_med/>
          </ProtectedRoute>
        }/>
        <Route path='/every-patients' element={
          <ProtectedRoute allowedRoles={['front_desk_view', 'admin']}>
            <All_patients/>
          </ProtectedRoute>
        }/>
        <Route path='/ready-patients' element={
          <ProtectedRoute allowedRoles={['front_desk_view', 'doctor_view', 'admin']}>
            <Ready_patients/>
          </ProtectedRoute>
        }/>
        <Route path='/every-doctors' element={
          <ProtectedRoute allowedRoles={['front_desk_view', 'admin']}>
            <All_Doctors/>
          </ProtectedRoute>
        }/>
        <Route path='/search-doctors' element={
          <ProtectedRoute allowedRoles={['front_desk_view', 'admin']}>
            <Search_doctors/>
          </ProtectedRoute>
        }/>

        {/* Admin Dashboard & Management Routes */}
        <Route path="/admin" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <Admin/>
          </ProtectedRoute>
        }/>
        <Route path="/admin-doc" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <Admin_doc/>
          </ProtectedRoute>
        }/>
        <Route path="/admin-front-desk" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <Admin_Front/>
          </ProtectedRoute>
        }/>
        <Route path="/admin-med" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <Admin_Med/>
          </ProtectedRoute>
        }/>
        <Route path="/admin-lab" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <Admin_lab/>
          </ProtectedRoute>
        }/>
        <Route path="/admin-add-doc" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <Admin_add_doc/>
          </ProtectedRoute>
        }/>
        <Route path="/admin-remove-doc" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <Admin_remove_doc/>
          </ProtectedRoute>
        }/>
        <Route path="/admin-update-doc" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <Admin_update_doc/>
          </ProtectedRoute>
        }/>
        <Route path="/admin-view-doc" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <Admin_view_doc/>
          </ProtectedRoute>
        }/>
        <Route path="/admin-add-med" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <Admin_add_med/>
          </ProtectedRoute>
        }/>
        <Route path="/admin-remove-med" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <Admin_remove_med/>
          </ProtectedRoute>
        }/>
        <Route path="/admin-update-med" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <Admin_update_med/>
          </ProtectedRoute>
        }/>
        <Route path="/admin-view-med" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <Admin_view_med/>
          </ProtectedRoute>
        }/>
        <Route path="/admin-add-front" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <Admin_add_front/>
          </ProtectedRoute>
        }/>
        <Route path="/admin-remove-front" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <Admin_remove_front/>
          </ProtectedRoute>
        }/>
        <Route path="/admin-update-front" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <Admin_update_front/>
          </ProtectedRoute>
        }/>
        <Route path="/admin-view-front" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <Admin_view_front/>
          </ProtectedRoute>
        }/>
        <Route path="/admin-add-lab" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <Admin_add_lab/>
          </ProtectedRoute>
        }/>
        <Route path="/admin-remove-lab" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <Admin_remove_lab/>
          </ProtectedRoute>
        }/>
        <Route path="/admin-update-lab" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <Admin_update_lab/>
          </ProtectedRoute>
        }/>
        <Route path="/admin-view-lab" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <Admin_view_lab/>
          </ProtectedRoute>
        }/>
      </Routes>
      </AnimatePresence>
    </div>
  )
}

export default App
