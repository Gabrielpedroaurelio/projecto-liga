import { BrowserRouter, Route, Routes } from 'react-router-dom'
import LoginAdmin from './components/Pages/admin/LoginAdmin/LoginAdmin'
import Users from './components/Pages/admin/Users/Users'
import Dashboards from './components/Pages/admin/Dashboards/Dashboards'
import Enterprises from './components/Pages/admin/Enterprises/Enterprises'
import Histories from './components/Pages/admin/Histories/Histories'
import Signals from './components/Pages/admin/Signals/Signals'
import Account from './components/Pages/admin/Account/Account'
import UserPermissions from './components/Pages/admin/UserPermissions/UserPermissions'
import Category from './components/Pages/admin/Category/Category'
import Settings from './components/Pages/admin/Settings/Settings'
import Reports from './components/Pages/admin/Reports/Reports'
import ProtectedRoute from './components/Routes/ProtectedRoute'
export default function Routers() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' index element={<LoginAdmin />} />
        <Route path='/admin' element={<LoginAdmin />} />
        <Route
          path='/admin/dashboards'
          element={
            <ProtectedRoute>
              <Dashboards />
            </ProtectedRoute>
          }
        />
        <Route
          path='/admin/users'
          element={
            <ProtectedRoute>
              <Users />
            </ProtectedRoute>
          }
        />
        <Route
          path='/admin/enterprise'
          element={
            <ProtectedRoute>
              <Enterprises />
            </ProtectedRoute>
          }
        />
        <Route
          path='/admin/signals'
          element={
            <ProtectedRoute>
              <Signals />
            </ProtectedRoute>
          }
        />
        <Route
          path='/admin/history'
          element={
            <ProtectedRoute>
              <Histories />
            </ProtectedRoute>
          }
        />
        <Route
          path='/admin/account'
          element={
            <ProtectedRoute>
              <Account />
            </ProtectedRoute>
          }
        />
        <Route
          path='/admin/categorias'
          element={
            <ProtectedRoute>
              <Category />
            </ProtectedRoute>
          }
        />
        <Route
          path='/admin/settings'
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />
        <Route
          path='/admin/permissao'
          element={
            <ProtectedRoute>
              <UserPermissions />
            </ProtectedRoute>
          }
        />
        <Route
          path='/admin/reports'
          element={
            <ProtectedRoute>
              <Reports />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  )

}
{/*<ProtectedRoute>*/ }