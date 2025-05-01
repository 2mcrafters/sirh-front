import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MasterLayout from './masterLayout/MasterLayout';
import Dashboard from './pages/Dashboard';
import BulkAddDepartmentPage from './pages/BulkAddDepartmentPage';
import DepartmentsListPage from './pages/DepartmentsListPage';
import EditDepartmentPage from './pages/EditDepartmentPage';
import UsersListPage from './pages/UsersListPage';
import UserFormPage from './pages/UserFormPage';
import AbsenceRequestsListPage from './pages/AbsenceRequestsListPage';
import AddAbsenceRequestPage from './pages/AddAbsenceRequestPage';
import EditAbsenceRequestPage from './pages/EditAbsenceRequestPage';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<MasterLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="departments" element={<DepartmentsListPage />} />
        <Route path="departments/add" element={<BulkAddDepartmentPage />} />
        <Route path="departments/:id/edit" element={<EditDepartmentPage />} />
        <Route path="users" element={<UsersListPage />} />
        <Route path="users/add" element={<UserFormPage />} />
        <Route path="users/:id/edit" element={<UserFormPage />} />
        <Route path="absences" element={<AbsenceRequestsListPage />} />
        <Route path="absences/add" element={<AddAbsenceRequestPage />} />
        <Route path="absences/:id/edit" element={<EditAbsenceRequestPage />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;