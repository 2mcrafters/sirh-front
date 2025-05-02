import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { fetchAbsenceRequests, deleteAbsenceRequests } from '../Redux/Slices/absenceRequestSlice';
import { fetchUsers } from '../Redux/Slices/userSlice';
import { Icon } from '@iconify/react/dist/iconify.js';
import Swal from 'sweetalert2';

const AbsenceRequestsListPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { items = {}, status: loading, error } = useSelector((state) => state.absenceRequests);
  const absenceList = items.absences || [];
    const { items: users = [] } = useSelector((state) => state.users);

  const [selectedRequests, setSelectedRequests] = useState([]);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [type, setType] = useState('');
  const [status, setStatus] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    dispatch(fetchAbsenceRequests());
    dispatch(fetchUsers());
  }, [dispatch]);

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = absenceList.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(absenceList.length / itemsPerPage);
  

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleItemsPerPageChange = (e) => {
    const value = e.target.value;
    setItemsPerPage(value === 'all' ? items.length : parseInt(value));
    setCurrentPage(1);
  };

  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) pageNumbers.push(i);
    } else if (currentPage <= 3) {
      for (let i = 1; i <= 5; i++) pageNumbers.push(i);
    } else if (currentPage >= totalPages - 2) {
      for (let i = totalPages - 4; i <= totalPages; i++) pageNumbers.push(i);
    } else {
      for (let i = currentPage - 2; i <= currentPage + 2; i++) pageNumbers.push(i);
    }

    return pageNumbers;
  };

  const handleEdit = (id) => navigate(`/absences/${id}/edit`);

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: "Cette action est irréversible.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui, supprimer',
      cancelButtonText: 'Annuler',
    });

    if (result.isConfirmed) {
      try {
        await dispatch(deleteAbsenceRequests([id])).unwrap();
        Swal.fire('Supprimé !', 'Demande supprimée.', 'success');
      } catch {
        Swal.fire('Erreur !', 'Échec de suppression.', 'error');
      }
    }
  };

  const handleBulkDelete = async () => {
    if (!selectedRequests.length) {
      return Swal.fire('Attention', 'Sélectionnez au moins une demande.', 'warning');
    }

    const result = await Swal.fire({
      title: 'Confirmer la suppression ?',
      text: `${selectedRequests.length} demande(s) seront supprimées.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui, supprimer',
      cancelButtonText: 'Annuler',
    });

    if (result.isConfirmed) {
      try {
        await dispatch(deleteAbsenceRequests(selectedRequests)).unwrap();
        setSelectedRequests([]);
        Swal.fire('Supprimé !', 'Demandes supprimées.', 'success');
      } catch {
        Swal.fire('Erreur !', 'Impossible de supprimer.', 'error');
      }
    }
  };

  const toggleRequestSelection = (id) => {
    setSelectedRequests(prev =>
      prev.includes(id) ? prev.filter(reqId => reqId !== id) : [...prev, id]
    );
  };

  if (loading === 'loading') {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Chargement...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger d-flex align-items-center" role="alert">
        <Icon icon="mdi:alert-circle" className="me-2" />
        <div>Erreur lors du chargement des données.</div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-header d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-2">
        <h5 className="card-title mb-0">Demandes d'absence</h5>

        <div className="d-flex flex-wrap gap-2">
          <Link to="/absences/add" className="btn btn-primary">
            <Icon icon="mdi:plus" className="me-1" />
            Ajouter
          </Link>
          <button
            className="btn btn-danger"
            onClick={handleBulkDelete}
            disabled={!selectedRequests.length}
          >
            <Icon icon="mdi:trash" className="me-1" />
            Supprimer
          </button>
        </div>
      </div>

      <div className="card-body">
        {/* Table */}
        <div className="table-responsive">
          <table className="table table-hover">
            <thead>
              <tr>
                <th>
                  <input
                    type="checkbox"
                    className="form-check-input"
                    checked={selectedRequests.length === items.length}
                    onChange={() =>
                      setSelectedRequests(
                        selectedRequests.length === items.length ? [] : items.map(r => r.id)
                      )
                    }
                  />
                </th>
                <th>Employé</th>
                <th>Type</th>
                <th>Début</th>
                <th>Fin</th>
                <th>Statut</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map(request => {
                const user = users.find(u => u.id === request.user_id);
                return (
                  <tr key={request.id}>
                    <td>
                      <input
                        type="checkbox"
                        className="form-check-input"
                        checked={selectedRequests.includes(request.id)}
                        onChange={() => toggleRequestSelection(request.id)}
                      />
                    </td>
                    <td>{user ? `${user.name} ${user.prenom}` : '—'}</td>
                    <td>{request.type}</td>
                    <td>{new Date(request.dateDebut).toLocaleDateString()}</td>
                    <td>{new Date(request.dateFin).toLocaleDateString()}</td>
                    <td>
                      <span className={`badge bg-${request.statut === 'validé'
                        ? 'success'
                        : request.statut === 'rejeté'
                        ? 'danger'
                        : 'warning'}`}>
                        {request.statut}
                      </span>
                    </td>
                    <td className="text-end">
                      <button
                        className="btn btn-sm btn-primary me-2"
                        onClick={() => handleEdit(request.id)}
                      >
                        <Icon icon="mdi:pencil" />
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDelete(request.id)}
                      >
                        <Icon icon="mdi:delete" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="d-flex justify-content-between align-items-center mt-4">
          <div className="d-flex align-items-center gap-2">
            <span>Afficher</span>
            <select className="form-select form-select-sm w-auto" value={itemsPerPage} onChange={handleItemsPerPageChange}>
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
              <option value="all">Tous</option>
            </select>
            <span>éléments</span>
          </div>

          <div className="d-flex gap-2">
            <button className="btn btn-outline-secondary btn-sm" disabled={currentPage === 1} onClick={() => paginate(currentPage - 1)}>
              <Icon icon="mdi:chevron-left" />
            </button>

            {getPageNumbers().map((number) => (
              <button
                key={number}
                className={`btn btn-sm ${currentPage === number ? 'btn-primary' : 'btn-outline-secondary'}`}
                onClick={() => paginate(number)}
              >
                {number}
              </button>
            ))}

            <button className="btn btn-outline-secondary btn-sm" disabled={currentPage === totalPages} onClick={() => paginate(currentPage + 1)}>
              <Icon icon="mdi:chevron-right" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AbsenceRequestsListPage;
