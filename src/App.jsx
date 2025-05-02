import MasterLayout from './masterLayout/MasterLayout'
import { Route, Routes } from 'react-router-dom'
import Login from './Pages/Login'
import TableDataLayer from './Components/TableDataLayer'
import Dashboard from './Pages/Dashboard'
import ViewProfileLayer from './Pages/ViewProfileLayer'
import { AuthProvider } from './context/AuthContext'
import PresenceDashboard from './Components/Statistique/PresenceDashboard'
import "./degrade.css"
import ListeDepartements from './Pages/DepartmentsListPage'
import CreerDepartement from './Pages/BulkAddDepartmentPage'
import EditDepartmentPage from './Pages/EditDepartmentPage'
import AbsenceRequestsListPage from"./Pages/AbsenceRequestsListPage"
import AddAbsenceRequestPage from"./Pages/AddAbsenceRequestPage"
import EditAbsenceRequestPage from"./Pages/EditAbsenceRequestPage"
import UsersListPage from './Pages/UsersListPage';
import UserFormPage from './Pages/UserFormPage';
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

          <Route path="users" element={<UsersListPage />} />
        <Route path="users/add" element={<UserFormPage />} />
        <Route path="users/:id/edit" element={<UserFormPage />} />
          
          <Route path="/liste-departements" element={<ListeDepartements/>} />
          <Route path="/creer-departement" element={<CreerDepartement/>} />
          <Route path="departments/:id/edit" element={<EditDepartmentPage />} />

          <Route path="absences" element={<AbsenceRequestsListPage />} />
          <Route path="absences/add" element={<AddAbsenceRequestPage />} /> 
          <Route path="absences/:id/edit" element={<EditAbsenceRequestPage />} />

          </Route>
      </Routes>
    </AuthProvider>
  )
}

export default App
