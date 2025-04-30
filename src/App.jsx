
// import './App.css'
import MasterLayout from './masterLayout/MasterLayout'
import { Route, Routes } from 'react-router-dom'
import Login from './Pages/Login'
import TableDataLayer from './Components/TableDataLayer'


function App() {
  

  return (

    <Routes>
      {/* Route publique */}
      <Route path="/login" element={<Login />} />

      {/* Routes protégées avec MasterLayout */}
      <Route element={<MasterLayout />}>
        <Route path="/" element={<TableDataLayer />} />
        {/* Ajoutez d'autres routes protégées ici */}
      </Route>
    </Routes>

  )
}

export default App
