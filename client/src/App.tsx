import { Outlet, Route, Routes } from 'react-router';
import BaseLayout from './views/BaseLayout';
import Home from './views/Home';
import Dashboard from './views/Dashboard';
import Login from './views/Login';
import Signup from './views/Signup';
import AlumniDirectory from './views/AlumniDirectory';
import About from './About.tsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import { Toaster } from 'react-hot-toast';
import Sessions from './views/Sessions';
import Events from './views/Events';
function App() {
  return (
    <>
      <Routes>
        {/* Landing Page Route */}
        <Route path={'/'} element={<Home />} />

        {/* Other Routes */}
        <Route path={'/login'} element={<Login />} />
        <Route path={'/signup'} element={<Signup />} />

        {/* Dashboard Routes with Layout */}
       {/* Dashboard Routes with Layout */}
<Route element={ <BaseLayout><Outlet /></BaseLayout> }>
  <Route path={'/dashboard'} element={<Dashboard />} />
  <Route path={'/alumni'} element={<AlumniDirectory />} />
  <Route path={'/events'} element={<Events />} />  {/* <-- ADD THIS LINE */}
  <Route path={'/about'} element={<About />} />
  <Route path={'/sessions'} element={<Sessions />} />
</Route>
      </Routes>
      <Toaster
        position="top-center"
        toastOptions={{
          error: {
            duration: 5000,
          },
        }}
      />
    </>
  );
}

export default App;