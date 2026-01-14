import './App.css'
import Routers from './router'
import { AuthProvider } from './contexts/AuthContext'

function App() {
  return (
    <AuthProvider>
        <Routers />
    </AuthProvider>
  )
}

export default App
