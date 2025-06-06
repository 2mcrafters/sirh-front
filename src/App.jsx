import MasterLayout from './masterLayout/MasterLayout'
import { Route, Routes } from 'react-router-dom'
import Login from './Pages/Login'
import Dashboard from './Pages/Dashboard'
import ViewProfileLayer from './Pages/ViewProfileLayer'
import { AuthProvider } from './context/AuthContext'
import PresenceDashboard from './Components/Statistique/PresenceDashboard'
import BulkAddDepartmentPage from './Pages/BulkAddDepartmentPage'
import DepartmentsListPage from './Pages/DepartmentsListPage'
import EditDepartmentPage from './Pages/EditDepartmentPage'
import UsersListPage from './Pages/UsersListPage'
import UserFormPage from './Pages/UserFormPage'
import AbsenceRequestsListPage from './Pages/AbsenceRequestsListPage'
import AddAbsenceRequestPage from './Pages/AddAbsenceRequestPage'
import EditAbsenceRequestPage from './Pages/EditAbsenceRequestPage'
import PointagesListPage from './Pages/PointagesListPage'
import AddPointagePage from './Pages/AddPointagePage'
import EditPointagePage from './Pages/EditPointagePage'
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
        {/* Public route */}
        <Route path="/login" element={<Login />} />

        {/* Protected routes with MasterLayout */}
        <Route element={<MasterLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/view-profile" element={<ViewProfileLayer />} />
          <Route path='/dashboard' element={<Dashboard/>} />
          <Route path='/statistiques' element={<PresenceDashboard/>} />

          <Route path="users" element={<UsersListPage />} />
        <Route path="users/add" element={<UserFormPage />} />
        <Route path="users/:id/edit" element={<UserFormPage />} />
       
          
          {/* Department routes */}
          <Route path="/departments" element={<DepartmentsListPage />} />
          <Route path="/departments/add" element={<BulkAddDepartmentPage />} />
          <Route path="/departments/:id/edit" element={<EditDepartmentPage />} />
          
     
          
          {/* Absence request routes */}
          <Route path="/absences" element={<AbsenceRequestsListPage />} />
          <Route path="/absences/add" element={<AddAbsenceRequestPage />} />
          <Route path="/absences/:id/edit" element={<EditAbsenceRequestPage />} />
          
          {/* Pointage routes */}
          <Route path="/pointages" element={<PointagesListPage />} />
          <Route path="/pointages/add" element={<AddPointagePage />} />
          <Route path="/pointages/:id/edit" element={<EditPointagePage />} />
        </Route>
      </Routes>
    </AuthProvider>
  )
}

export default App
