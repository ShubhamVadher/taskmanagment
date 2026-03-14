import './App.css';
import { Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import AdminNavbar from './components/Adminnavbar';
import Home from './components/Home';
import Createtask from './components/Createtask';
import Viewtasks from './components/Viewtasks';
import Admin from './components/Admin';
import Adminpage from './components/Adminpage';
import { ProtectedRoute, AdminProtectedRoute } from './components/Protectedroute';
import { useLocation } from 'react-router-dom';
import Adminuseres from './components/Adminuseres';
import Admintasks from './components/Admintasks';
import AdminUserDetail from './components/Adminuserdetail.js';
import AdminTaskDetail from './components/AdminTaskDetail';


function App() {
  const location = useLocation();

  // Show AdminNavbar on all admin routes except the login page (/admin)
  const isAdminPage =
    location.pathname.startsWith('/adminpage') ||
    location.pathname.startsWith('/admintasks') ||
    location.pathname.startsWith('/adminusers');

  return (
    <>
      {isAdminPage ? <AdminNavbar /> : <Navbar />}

      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<Admin />} />

        {/* Auth0 protected routes */}
        <Route
          path="/createtask"
          element={
            <ProtectedRoute>
              <Createtask />
            </ProtectedRoute>
          }
        />
        <Route
          path="/viewtasks"
          element={
            <ProtectedRoute>
              <Viewtasks />
            </ProtectedRoute>
          }
        />

        {/* Admin protected routes */}
        <Route
          path="/adminpage"
          element={
            <AdminProtectedRoute>
              <Adminpage />
            </AdminProtectedRoute>
          }
        />

        <Route
          path="/admintasks"
          element={
            <AdminProtectedRoute>
              <Admintasks />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="/adminusers"
          element={
            <AdminProtectedRoute>
              <Adminuseres />
            </AdminProtectedRoute>
          }
        />

        <Route
          path="/adminusers/:id"
          element={
            <AdminProtectedRoute>
              <AdminUserDetail />
            </AdminProtectedRoute>
          }
        />


        <Route
          path="/admintasks/:id"
          element={
            <AdminProtectedRoute>
              <AdminTaskDetail />
            </AdminProtectedRoute>
          }
        />


      </Routes>
    </>
  );
}

export default App;