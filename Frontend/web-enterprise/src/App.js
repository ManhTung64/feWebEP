//import từ thư viện bên ngoài
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"

//import từ bên trong src

import LoginForm from './components/public/login/LoginForm'
import Homepage from './components/staff/homepage/Homepage'
import Category from './components/QAM/category/Category'
import Profile from './components/staff/profile/Profile'
import Account from "./components/admin/account/Account"
import Home from "./components/QAM/home/Home"
import ProfileQAM from "./components/QAM/profile/ProfileQAM"
function App() {
  return (
    <Router basename="https://manhtung64.github.io/feWebEP">
      <Routes>
        <Route path="/" element={<LoginForm />} />
        <Route path="/Homepage" element={<Homepage />} />
        <Route path="/category" element={<Category />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/account" element={<Account />} />
        <Route path="/qualityAssuranceManager" element={<Home/>} />
        <Route path="/profileQAM" element={<ProfileQAM/>} />
      </Routes>
    </Router>
  )
}

export default App;