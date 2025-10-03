import logo from './logo.svg';
import './App.css';
import {Routes,Route} from 'react-router-dom'
import { Navbar } from './components/Navbar';
import Home from './components/Home';
import Createtask from './components/Createtask';
import { useAuth0 } from "@auth0/auth0-react";
import Viewtasks from './components/Viewtasks';
function App() {
  const { loginWithRedirect, logout, user, isAuthenticated } = useAuth0();
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="createtask" element={<Createtask/>}/>
        <Route path="viewtasks" element={<Viewtasks/>}/>
        
      </Routes>
    </>
  );
}

export default App;
