
import MasterLayout from './masterLayout/MasterLayout'
import { Route, Routes } from 'react-router-dom'
import Login from './Pages/Login'
import TableDataLayer from './Components/TableDataLayer'
import Dashboard from './Pages/Dashboard'
import ViewProfileLayer from './Pages/ViewProfileLayer'
import Forms from './Components/Forms'

function App() {
  

  return (

    <Routes>
      {/* Route publique */}
      <Route path="/login" element={<Login />} />

      {/* Routes protégées avec MasterLayout */}
      <Route element={<MasterLayout />}>
        <Route path="/" element={<TableDataLayer />} />
        <Route path="/view-profile" element={<ViewProfileLayer />} />
        <Route path="/form" element={<Forms />} />
      <Route path='/dashboard' element={<Dashboard/>} />

        {/* Ajoutez d'autres routes protégées ici */}
      </Route>
    </Routes>

  )
}

export default App
