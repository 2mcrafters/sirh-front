import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers } from '../Redux/Slices/userSlice';
import UserForm from '../Components/forms/UserForm';

const UserFormPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();
  const isEdit = !!id;
  const { items: users } = useSelector(state => state.users);

  React.useEffect(() => {
    if (isEdit) {
      dispatch(fetchUsers());
    }
  }, [dispatch, isEdit]);

  const handleSuccess = () => {
    // Redirect to users list after a short delay
    setTimeout(() => {
      navigate('/users');
    }, 2000);
  };

  const user = isEdit ? users.find(u => u.id === parseInt(id)) : null;

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">
          <div className="page-title-box d-flex align-items-center justify-content-between">
            <h4 className="mb-0">{isEdit ? 'Modifier l\'utilisateur' : 'Ajouter un utilisateur'}</h4>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-12">
          <UserForm
            initialValues={user || {}}
            isEdit={isEdit}
            onSuccess={handleSuccess}
          />
        </div>
      </div>
    </div>
  );
};

export default UserFormPage; 