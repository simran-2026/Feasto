import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';  

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/user/register" element={<h1>User Registerz</h1>} />
        <Route path="/user/login" element={<div>User Login</div>} />
        <Route path="/food-partner/register" element={<div>foodpartner register </div>} />
         <Route path="/food-partner/login" element={<div>foodpartner </div>} />
      </Routes>
    </Router>
  )
}

export default AppRoutes