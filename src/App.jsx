import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
// import './App.css'
import MasterLayout from './masterLayout/MasterLayout'
import { Route, Routes } from 'react-router-dom'
import Login from './Pages/Login'
import TableDataLayer from './Components/TableDataLayer'
import ViewProfileLayer from './Pages/ViewProfileLayer'
import Forms from './Components/Forms'

function App() {
  const [count, setCount] = useState(0)

  return (
    <Routes>
      {/* Route publique */}
      <Route path="/login" element={<Login />} />

      {/* Routes protégées avec MasterLayout */}
      <Route element={<MasterLayout />}>
        <Route path="/" element={<TableDataLayer />} />
        <Route path="/view-profile" element={<ViewProfileLayer />} />
        <Route path="/form" element={<Forms />} />
        {/* Ajoutez d'autres routes protégées ici */}
      </Route>
    </Routes>
  )
}

export default App
