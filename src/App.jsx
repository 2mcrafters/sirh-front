import MasterLayout from './masterLayout/MasterLayout'
import { Route, Routes } from 'react-router-dom'
import Login from './Pages/Login'
import TableDataLayer from './Components/TableDataLayer'
import Dashboard from './Pages/Dashboard'
import ViewProfileLayer from './Pages/ViewProfileLayer'
import { AuthProvider } from './context/AuthContext'
import PresenceDashboard from './Components/Statistique/PresenceDashboard'
import "./degrade.css"

function App() {
  

  return (
    <AuthProvider>
      <Routes>
        {/* Route publique */}
        <Route path="/login" element={<Login />} />

        {/* Routes protégées avec MasterLayout */}
        <Route element={<MasterLayout />}>
          <Route path="/" element={<TableDataLayer />} />
          <Route path="/view-profile" element={<ViewProfileLayer />} />
          <Route path='/dashboard' element={<Dashboard/>} />
          <Route path='/statistiques' element={<PresenceDashboard/>} />
          </Route>
      </Routes>
    </AuthProvider>
  )
}

export default App
