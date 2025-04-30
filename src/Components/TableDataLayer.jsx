import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '@iconify/react/dist/iconify.js';

const SimpleTable = () => {
  const data = [
    {
      id: 1,
      invoice: '#526534',
      name: 'Kathryn Murphy',
      date: '25 Jan 2024',
      amount: '$200.00',
      status: 'Paid',
      image: '/assets/images/user-list/user-list1.png'
    },
    {
      id: 2,
      invoice: '#696589',
      name: 'Annette Black',
      date: '25 Jan 2024',
      amount: '$200.00',
      status: 'Paid',
      image: '/assets/images/user-list/user-list2.png'
    },
    {
      id: 3,
      invoice: '#256584',
      name: 'Ronald Richards',
      date: '10 Feb 2024',
      amount: '$200.00',
      status: 'Paid',
      image: '/assets/images/user-list/user-list3.png'
    },
    {
      id: 4,
      invoice: '#526587',
      name: 'Eleanor Pena',
      date: '10 Feb 2024',
      amount: '$150.00',
      status: 'Paid',
      image: '/assets/images/user-list/user-list4.png'
    },
    {
      id: 5,
      invoice: '#105986',
      name: 'Leslie Alexander',
      date: '15 March 2024',
      amount: '$150.00',
      status: 'Pending',
      image: '/assets/images/user-list/user-list5.png'
    },
    {
      id: 6,
      invoice: '#526589',
      name: 'Albert Flores',
      date: '15 March 2024',
      amount: '$150.00',
      status: 'Paid',
      image: '/assets/images/user-list/user-list6.png'
    },
    {
      id: 7,
      invoice: '#526520',
      name: 'Jacob Jones',
      date: '27 April 2024',
      amount: '$250.00',
      status: 'Paid',
      image: '/assets/images/user-list/user-list7.png'
    },
    {
      id: 8,
      invoice: '#256584',
      name: 'Jerome Bell',
      date: '27 April 2024',
      amount: '$250.00',
      status: 'Pending',
      image: '/assets/images/user-list/user-list8.png'
    },
    {
      id: 9,
      invoice: '#200257',
      name: 'Marvin McKinney',
      date: '30 April 2024',
      amount: '$250.00',
      status: 'Paid',
      image: '/assets/images/user-list/user-list9.png'
    },
    {
      id: 10,
      invoice: '#526525',
      name: 'Cameron Williamson',
      date: '30 April 2024',
      amount: '$250.00',
      status: 'Paid',
      image: '/assets/images/user-list/user-list10.png'
    }
  ];
  // filters
  const [filtersOpen, setFiltersOpen] = useState(false);


  // État pour la pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10); // Nombre d'éléments par page par défaut

  // État pour les filtres
  const [role, setRole] = useState('');
  const [department, setDepartment] = useState('');
  const [contractType, setContractType] = useState('');
  const [status, setStatus] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Calculer les indices de début et de fin pour la pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(data.length / itemsPerPage);

  // Changer de page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Changer le nombre d'éléments par page
  const handleItemsPerPageChange = (e) => {
    const newItemsPerPage = e.target.value === 'all' ? data.length : parseInt(e.target.value);
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1); // Réinitialiser à la première page
  };

  // Générer les numéros de page à afficher
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      // Si le nombre total de pages est inférieur ou égal au maximum visible
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Sinon, afficher un sous-ensemble de pages
      if (currentPage <= 3) {
        // Si nous sommes proche du début
        for (let i = 1; i <= 5; i++) {
          pageNumbers.push(i);
        }
      } else if (currentPage >= totalPages - 2) {
        // Si nous sommes proche de la fin
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pageNumbers.push(i);
        }
      } else {
        // Sinon, afficher la page actuelle et 2 pages avant/après
        for (let i = currentPage - 2; i <= currentPage + 2; i++) {
          pageNumbers.push(i);
        }
      }
    }
    
    return pageNumbers;
  };

  return (
    <div className='card basic-data-table'>
      {/* card-header responsive */}
<div className="card-header d-flex flex-column flex-md-row gap-2 justify-content-between align-items-start align-items-md-center">

  <h5 className="card-title mb-0">Employés</h5>

  <div className="d-flex flex-wrap gap-2">
    {/* Ajouter */}
    <button className="btn btn-primary d-flex align-items-center">
      <Icon icon="mdi:plus" />
      <span className="d-none d-md-inline ms-1">Ajouter</span>
    </button>

    {/* Supprimer */}
    <button className="btn btn-danger d-flex align-items-center">
      <Icon icon="mdi:trash" />
      <span className="d-none d-md-inline ms-1">Supprimer</span>
    </button>

    {/* Export */}
    <button className="btn btn-outline-secondary d-flex align-items-center">
      <Icon icon="mdi:download" />
      <span className="d-none d-md-inline ms-1">Export</span>
    </button>

    {/* Import */}
    <button className="btn btn-outline-secondary d-flex align-items-center">
      <Icon icon="mdi:upload" />
      <span className="d-none d-md-inline ms-1">Import</span>
    </button>

    {/* Bouton filtre – visible uniquement sur mobile */}
    <button
      className="btn btn-outline-secondary d-inline d-md-none"
      onClick={() => setFiltersOpen(!filtersOpen)}
    >
      <Icon icon="mdi:tune" />
    </button>
  </div>
</div>


      <div className='card-body'>
        {/* Filtres et recherche */}
        {/* filters-container responsive */}
        <div className={`filters-container mb-4 ${filtersOpen ? 'd-block' : 'd-none'} d-md-block`}>
        <div className="row g-3">

    {/* Rôle */}
    <div className="col-6 col-sm-4 col-md-3 col-lg-2">
      <select className="form-select" value={role} onChange={e => setRole(e.target.value)}>
        <option value="">Rôle</option>
        <option value="admin">Administrateur</option>
        <option value="manager">Manager</option>
        <option value="employee">Employé</option>
        <option value="intern">Stagiaire</option>
      </select>
    </div>

    {/* Département */}
    <div className="col-6 col-sm-4 col-md-3 col-lg-2">
      <select className="form-select" value={department} onChange={e => setDepartment(e.target.value)}>
        <option value="">Département</option>
        <option value="hr">RH</option>
        <option value="it">IT</option>
        <option value="finance">Finance</option>
        <option value="marketing">Marketing</option>
        <option value="sales">Ventes</option>
      </select>
    </div>

    {/* Type contrat */}
    <div className="col-6 col-sm-4 col-md-3 col-lg-2">
      <select className="form-select" value={contractType} onChange={e => setContractType(e.target.value)}>
        <option value="">Contrat</option>
        <option value="cdi">CDI</option>
        <option value="cdd">CDD</option>
        <option value="stage">Stage</option>
        <option value="alternance">Alternance</option>
      </select>
    </div>

    {/* Statut */}
    <div className="col-6 col-sm-4 col-md-3 col-lg-2">
      <select className="form-select" value={status} onChange={e => setStatus(e.target.value)}>
        <option value="">Statut</option>
        <option value="active">Actif</option>
        <option value="inactive">Inactif</option>
        <option value="onLeave">En congé</option>
        <option value="terminated">Terminé</option>
      </select>
    </div>

    {/* Recherche */}
    <div className="col-12 col-sm-8 col-md-6 col-lg-4 ms-auto">
      <div className="input-group">
        <input
          type="text"
          className="form-control"
          placeholder="Rechercher nom ou CIN…"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
        <button className="btn btn-outline-secondary" type="button">
          <Icon icon="mdi:magnify" />
        </button>
      </div>
    </div>

  </div>
</div>


        <div className="table-responsive">
          <table className='table bordered-table mb-0'>
            <thead>
              <tr>
                <th scope='col'>
                  <div className='form-check style-check d-flex align-items-center'>
                    <input className='form-check-input' type='checkbox' />
                    <label className='form-check-label'>S.L</label>
                  </div>
                </th>
                <th scope='col'>Invoice</th>
                <th scope='col'>Name</th>
                <th scope='col'>Issued Date</th>
                <th scope='col'>Amount</th>
                <th scope='col'>Status</th>
                <th scope='col'>Action</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((item) => (
                <tr key={item.id}>
                  <td>
                    <div className='form-check style-check d-flex align-items-center'>
                      <input className='form-check-input' type='checkbox' />
                      <label className='form-check-label'>{item.id.toString().padStart(2, '0')}</label>
                    </div>
                  </td>
                  <td>
                    <Link to='#' className='text-primary-600'>
                      {item.invoice}
                    </Link>
                  </td>
                  <td>
                    <div className='d-flex align-items-center'>
                      <img
                        src={item.image}
                        alt={item.name}
                        className='flex-shrink-0 me-12 radius-8'
                        style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                      />
                      <h6 className='text-md mb-0 fw-medium flex-grow-1'>
                        {item.name}
                      </h6>
                    </div>
                  </td>
                  <td>{item.date}</td>
                  <td>{item.amount}</td>
                  <td>
                    <span className={`px-24 py-4 rounded-pill fw-medium text-sm ${
                      item.status === 'Paid' 
                        ? 'bg-success-focus text-success-main' 
                        : 'bg-warning-focus text-warning-main'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td>
                    <Link
                      to='#'
                      className='w-32-px h-32-px me-8 bg-primary-light text-primary-600 rounded-circle d-inline-flex align-items-center justify-content-center'
                    >
                      <Icon icon='iconamoon:eye-light' />
                    </Link>
                    <Link
                      to='#'
                      className='w-32-px h-32-px me-8 bg-success-focus text-success-main rounded-circle d-inline-flex align-items-center justify-content-center'
                    >
                      <Icon icon='lucide:edit' />
                    </Link>
                    <Link
                      to='#'
                      className='w-32-px h-32-px me-8 bg-danger-focus text-danger-main rounded-circle d-inline-flex align-items-center justify-content-center'
                    >
                      <Icon icon='mingcute:delete-2-line' />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination style ancien avec sélecteur d'éléments par page */}
        {totalPages > 1 && (
          <div className="d-flex justify-content-between align-items-center mt-4">
            <div className="d-flex align-items-center">
              <div className="pagination-info me-3">
                Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, data.length)} of {data.length} entries
              </div>
              <div className="items-per-page d-flex align-items-center">
                <label htmlFor="itemsPerPage" className="me-2 mb-0">Show:</label>
                <select 
                  id="itemsPerPage" 
                  className="form-select form-select-sm" 
                  style={{ width: '80px' }}
                  value={itemsPerPage === data.length ? 'all' : itemsPerPage}
                  onChange={handleItemsPerPageChange}
                >
                  <option value="10">10</option>
                  <option value="30">30</option>
                  <option value="50">50</option>
                  <option value="all">Tous</option>
                </select>
                <span className="ms-2">entries</span>
              </div>
            </div>
            <div className="pagination-controls">
              <button 
                className="btn btn-sm btn-outline-secondary me-2" 
                onClick={() => paginate(1)}
                disabled={currentPage === 1}
              >
                <Icon icon="mdi:chevron-double-left" />
              </button>
              <button 
                className="btn btn-sm btn-outline-secondary me-2" 
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <Icon icon="mdi:chevron-left" />
              </button>
              
              {getPageNumbers().map(number => (
                <button 
                  key={number}
                  className={`btn btn-sm ${currentPage === number ? 'btn-primary' : 'btn-outline-secondary'} me-2`}
                  onClick={() => paginate(number)}
                >
                  {number}
                </button>
              ))}
              
              <button 
                className="btn btn-sm btn-outline-secondary me-2" 
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                <Icon icon="mdi:chevron-right" />
              </button>
              <button 
                className="btn btn-sm btn-outline-secondary" 
                onClick={() => paginate(totalPages)}
                disabled={currentPage === totalPages}
              >
                <Icon icon="mdi:chevron-double-right" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SimpleTable; 