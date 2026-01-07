import { useEffect } from 'react'
import './App.css'
import Dashboards from './components/Pages/admin/Dashboards/Dashboards'
import Users from './components/Pages/admin/Users/Users'
import Routers from './router'
import { getMe, isAuthenticated } from './services/auth'

function App() {

  useEffect(() => {
    if (isAuthenticated()) {
      getMe();
    }
  }, []);

  return (
    <>
      <Routers />
    </>
  )
}

export default App
