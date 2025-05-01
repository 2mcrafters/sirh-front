import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { fetchPointages, deletePointages } from '../Redux/Slices/pointageSlice';
import { fetchUsers } from '../Redux/Slices/userSlice';
import { Icon } from '@iconify/react/dist/iconify.js';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

const PointagesListPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items: pointages, status: loading, error } = useSelector((state) => state.pointages);
  const { items: users } = useSelector((state) => state.users);
  const [selectedPointages, setSelectedPointages] = useState([]);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [filters, setFilters] = useState({
    date: '',
    user: '',
    status: '',
  });
  const [showExportDropdown, setShowExportDropdown] = useState(false);
  const [showImportDropdown, setShowImportDropdown] = useState(false);

  useEffect(() => {
    dispatch(fetchPointages());
    dispatch(fetchUsers());
  }, [dispatch]);

  // Filter pointages based on filters
  const filteredPointages = pointages.filter(pointage => {
    const pointageDate = new Date(pointage.date);
    const filterDate = filters.date ? new Date(filters.date) : null;
    
    return (
      (!filters.date || pointageDate.toDateString() === filterDate.toDateString()) &&
      (!filters.user || pointage.user_id === parseInt(filters.user)) &&
      (!filters.status || pointage.statutJour === filters.status)
    );
  });

  // Pagination calculations
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredPointages.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredPointages.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleItemsPerPageChange = (e) => {
    const newItemsPerPage = e.target.value === 'all' ? pointages.length : parseInt(e.target.value);
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 5; i++) {
          pageNumbers.push(i);
        }
      } else if (currentPage >= totalPages - 2) {
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pageNumbers.push(i);
        }
      } else {
        for (let i = currentPage - 2; i <= currentPage + 2; i++) {
          pageNumbers.push(i);
        }
      }
    }
    
    return pageNumbers;
  };

  const handleEdit = (id) => {
    navigate(`/pointages/${id}/edit`);
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Êtes-vous sûr?',
      text: "Cette action ne peut pas être annulée!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui, supprimer!',
      cancelButtonText: 'Annuler'
    });

    if (result.isConfirmed) {
      try {
        await dispatch(deletePointages([id])).unwrap();
        Swal.fire(
          'Supprimé!',
          'Le pointage a été supprimé avec succès.',
          'success'
        );
      } catch (error) {
        Swal.fire(
          'Erreur!',
          'Une erreur est survenue lors de la suppression.',
          'error'
        );
      }
    }
  };

  const handleBulkDelete = async () => {
    if (selectedPointages.length === 0) {
      Swal.fire(
        'Attention!',
        'Veuillez sélectionner au moins un pointage à supprimer.',
        'warning'
      );
      return;
    }

    const result = await Swal.fire({
      title: 'Êtes-vous sûr?',
      text: `Vous êtes sur le point de supprimer ${selectedPointages.length} pointage(s). Cette action ne peut pas être annulée!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui, supprimer!',
      cancelButtonText: 'Annuler'
    });

    if (result.isConfirmed) {
      try {
        await dispatch(deletePointages(selectedPointages)).unwrap();
        setSelectedPointages([]);
        Swal.fire(
          'Supprimé!',
          'Les pointages ont été supprimés avec succès.',
          'success'
        );
      } catch (error) {
        Swal.fire(
          'Erreur!',
          'Une erreur est survenue lors de la suppression.',
          'error'
        );
      }
    }
  };

  const togglePointageSelection = (id) => {
    setSelectedPointages(prev => 
      prev.includes(id) 
        ? prev.filter(pointageId => pointageId !== id)
        : [...prev, id]
    );
  };

  // Export to Excel
  const exportToExcel = () => {
    const data = filteredPointages.map(pointage => {
      const user = users.find(u => u.id === pointage.user_id);
      return {
        'Employé': user ? `${user.name} ${user.prenom}` : 'Inconnu',
        'Date': new Date(pointage.date).toLocaleDateString(),
        'Heure d\'entrée': pointage.heureEntree || '-',
        'Heure de sortie': pointage.heureSortie || '-',
        'Statut': getStatusLabel(pointage.statutJour),
        'Heures supplémentaires': pointage.overtimeHours || '0'
      };
    });

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Pointages');
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const dataBlob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(dataBlob, 'pointages.xlsx');
  };

  // Export to PDF
  const exportToPDF = () => {
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(16);
    doc.text('Liste des Pointages', 14, 15);
    
    // Add date
    doc.setFontSize(10);
    doc.text(`Généré le: ${new Date().toLocaleDateString()}`, 14, 22);

    const tableColumn = ['Employé', 'Date', 'Heure d\'entrée', 'Heure de sortie', 'Statut', 'Heures supplémentaires'];
    const tableRows = filteredPointages.map(pointage => {
      const user = users.find(u => u.id === pointage.user_id);
      return [
        user ? `${user.name} ${user.prenom}` : 'Inconnu',
        new Date(pointage.date).toLocaleDateString(),
        pointage.heureEntree || '-',
        pointage.heureSortie || '-',
        getStatusLabel(pointage.statutJour),
        pointage.overtimeHours || '0'
      ];
    });

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 30,
      theme: 'grid',
      headStyles: { 
        fillColor: [41, 128, 185],
        textColor: 255,
        fontSize: 10,
        fontStyle: 'bold'
      },
      bodyStyles: {
        fontSize: 9
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245]
      },
      margin: { top: 30 }
    });

    doc.save('pointages.pdf');
  };

  // Import from Excel
  const handleFileImport = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(firstSheet);

      // Transform the data to match your API format
      const transformedData = jsonData.map(row => ({
        user_id: findUserIdByName(row['Employé']),
        date: row['Date'],
        heureEntree: row['Heure d\'entrée'],
        heureSortie: row['Heure de sortie'],
        statutJour: getStatusValue(row['Statut']),
        overtimeHours: row['Heures supplémentaires']
      }));

      // Dispatch the create action for each pointage
      transformedData.forEach(pointage => {
        dispatch(createPointage(pointage));
      });

      Swal.fire(
        'Succès!',
        'Les pointages ont été importés avec succès.',
        'success'
      );
    };

    reader.readAsArrayBuffer(file);
  };

  const findUserIdByName = (fullName) => {
    const [name, prenom] = fullName.split(' ');
    const user = users.find(u => u.name === name && u.prenom === prenom);
    return user ? user.id : null;
  };

  const getStatusValue = (label) => {
    switch (label) {
      case 'Présent': return 'present';
      case 'Absent': return 'absent';
      case 'Retard': return 'retard';
      default: return 'present';
    }
  };

  if (loading === 'loading') {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-12">
            <div className="alert alert-danger" role="alert">
              <div className="d-flex align-items-center">
                <Icon icon="mdi:alert-circle" className="me-2" />
                <div>
                  <h5 className="alert-heading">Erreur de chargement</h5>
                  <p className="mb-0">Une erreur est survenue lors du chargement des pointages.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card basic-data-table">
      {/* Header */}
      <div className="card-header d-flex flex-column flex-md-row gap-2 justify-content-between align-items-start align-items-md-center">
        <h5 className="card-title mb-0">Pointages</h5>

        <div className="d-flex flex-wrap gap-2">
          <Link to="/pointages/add" className="btn btn-primary d-flex align-items-center">
            <Icon icon="mdi:plus" />
            <span className="d-none d-md-inline ms-1">Ajouter</span>
          </Link>

          <button 
            className="btn btn-danger d-flex align-items-center"
            onClick={handleBulkDelete}
            disabled={selectedPointages.length === 0}
          >
            <Icon icon="mdi:trash" />
            <span className="d-none d-md-inline ms-1">Supprimer</span>
          </button>

          {/* Export Dropdown */}
          <div className="dropdown">
            <button 
              className="btn btn-success d-flex align-items-center dropdown-toggle"
              onClick={() => setShowExportDropdown(!showExportDropdown)}
            >
              <Icon icon="mdi:download" />
              <span className="d-none d-md-inline ms-1">Export</span>
            </button>
            <div className={`dropdown-menu ${showExportDropdown ? 'show' : ''}`} style={{ position: 'absolute', inset: '0px auto auto 0px', margin: '0px', transform: 'translate(0px, 40px)' }}>
              <button 
                className="dropdown-item d-flex align-items-center"
                onClick={() => {
                  exportToExcel();
                  setShowExportDropdown(false);
                }}
              >
                <Icon icon="mdi:file-excel" className="me-2" />
                Export Excel
              </button>
              <button 
                className="dropdown-item d-flex align-items-center"
                onClick={() => {
                  exportToPDF();
                  setShowExportDropdown(false);
                }}
              >
                <Icon icon="mdi:file-pdf" className="me-2" />
                Export PDF
              </button>
            </div>
          </div>

          {/* Import Dropdown */}
          <div className="dropdown">
            <button 
              className="btn btn-info d-flex align-items-center dropdown-toggle"
              onClick={() => setShowImportDropdown(!showImportDropdown)}
            >
              <Icon icon="mdi:upload" />
              <span className="d-none d-md-inline ms-1">Import</span>
            </button>
            <div className={`dropdown-menu ${showImportDropdown ? 'show' : ''}`} style={{ position: 'absolute', inset: '0px auto auto 0px', margin: '0px', transform: 'translate(0px, 40px)' }}>
              <div className="dropdown-item">
                <label className="d-flex align-items-center" style={{ cursor: 'pointer' }}>
                  <Icon icon="mdi:file-excel" className="me-2" />
                  Import Excel
                  <input
                    type="file"
                    accept=".xlsx,.xls"
                    onChange={(e) => {
                      handleFileImport(e);
                      setShowImportDropdown(false);
                    }}
                    className="d-none"
                  />
                </label>
              </div>
              <div className="dropdown-item">
                <label className="d-flex align-items-center" style={{ cursor: 'pointer' }}>
                  <Icon icon="mdi:file-pdf" className="me-2" />
                  Import PDF
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={(e) => {
                      // Handle PDF import if needed
                      setShowImportDropdown(false);
                    }}
                    className="d-none"
                  />
                </label>
              </div>
            </div>
          </div>

          <button
            className="btn btn-outline-secondary d-inline d-md-none"
            onClick={() => setFiltersOpen(!filtersOpen)}
          >
            <Icon icon="mdi:tune" />
          </button>
        </div>
      </div>

      <div className="card-body">
        {/* Filters */}
        <div className={`filters-container mb-4 ${filtersOpen ? 'd-block' : 'd-none'} d-md-block`}>
          <div className="row g-3">
            <div className="col-12 col-md-4">
              <label className="form-label">Date</label>
              <input
                type="date"
                className="form-control"
                value={filters.date}
                onChange={e => setFilters(prev => ({ ...prev, date: e.target.value }))}
              />
            </div>

            <div className="col-12 col-md-4">
              <label className="form-label">Employé</label>
              <select
                className="form-select"
                value={filters.user}
                onChange={e => setFilters(prev => ({ ...prev, user: e.target.value }))}
              >
                <option value="">Tous les employés</option>
                {users.map(user => (
                  <option key={user.id} value={user.id}>
                    {user.name} {user.prenom}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-12 col-md-4">
              <label className="form-label">Statut</label>
              <select
                className="form-select"
                value={filters.status}
                onChange={e => setFilters(prev => ({ ...prev, status: e.target.value }))}
              >
                <option value="">Tous les statuts</option>
                <option value="present">Présent</option>
                <option value="absent">Absent</option>
                <option value="retard">Retard</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="table-responsive">
          <table className="table table-hover">
            <thead>
              <tr>
                <th>
                  <input
                    type="checkbox"
                    className="form-check-input"
                    checked={selectedPointages.length === pointages.length}
                    onChange={() => {
                      if (selectedPointages.length === pointages.length) {
                        setSelectedPointages([]);
                      } else {
                        setSelectedPointages(pointages.map(p => p.id));
                      }
                    }}
                  />
                </th>
                <th>Employé</th>
                <th>Date</th>
                <th>Heure d'entrée</th>
                <th>Heure de sortie</th>
                <th>Statut</th>
                <th>Heures supplémentaires</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((pointage) => {
                const user = users.find(u => u.id === pointage.user_id);
                return (
                  <tr key={pointage.id}>
                    <td>
                      <input
                        type="checkbox"
                        className="form-check-input"
                        checked={selectedPointages.includes(pointage.id)}
                        onChange={() => togglePointageSelection(pointage.id)}
                      />
                    </td>
                    <td>{user ? `${user.name} ${user.prenom}` : 'Utilisateur inconnu'}</td>
                    <td>{new Date(pointage.date).toLocaleDateString()}</td>
                    <td>{pointage.heureEntree || '-'}</td>
                    <td>{pointage.heureSortie || '-'}</td>
                    <td>
                      <span className={`badge bg-${getStatusBadgeColor(pointage.statutJour)}`}>
                        {getStatusLabel(pointage.statutJour)}
                      </span>
                    </td>
                    <td>{pointage.overtimeHours || '0'}</td>
                    <td className="text-end">
                      <div className="d-flex justify-content-end gap-2">
                        <button
                          className="btn btn-sm btn-primary me-2"
                          onClick={() => handleEdit(pointage.id)}
                          title="Modifier"
                        >
                          <Icon icon="mdi:pencil" />
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDelete(pointage.id)}
                          title="Supprimer"
                        >
                          <Icon icon="mdi:delete" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="d-flex justify-content-between align-items-center mt-4">
          <div className="d-flex align-items-center">
            <span className="me-2">Afficher</span>
            <select
              className="form-select form-select-sm"
              style={{ width: 'auto' }}
              value={itemsPerPage}
              onChange={handleItemsPerPageChange}
            >
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
              <option value="all">Tous</option>
            </select>
            <span className="ms-2">entrées</span>
          </div>

          <nav>
            <ul className="pagination mb-0">
              <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                <button
                  className="page-link"
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Précédent
                </button>
              </li>
              {getPageNumbers().map((number) => (
                <li
                  key={number}
                  className={`page-item ${currentPage === number ? 'active' : ''}`}
                >
                  <button
                    className="page-link"
                    onClick={() => paginate(number)}
                  >
                    {number}
                  </button>
                </li>
              ))}
              <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                <button
                  className="page-link"
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Suivant
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
};

// Helper functions for status display
const getStatusLabel = (status) => {
  switch (status) {
    case 'present':
      return 'Présent';
    case 'absent':
      return 'Absent';
    case 'retard':
      return 'Retard';
    default:
      return status;
  }
};

const getStatusBadgeColor = (status) => {
  switch (status) {
    case 'present':
      return 'success';
    case 'absent':
      return 'danger';
    case 'retard':
      return 'warning';
    default:
      return 'secondary';
  }
};

export default PointagesListPage; 