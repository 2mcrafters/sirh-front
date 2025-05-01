import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createAbsenceRequest, updateAbsenceRequest } from '../../Redux/Slices/absenceRequestSlice';
import { fetchUsers } from '../../Redux/Slices/userSlice';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Swal from 'sweetalert2';

const AbsenceRequestForm = ({ initialValues = {}, isEdit = false, onSuccess }) => {
  const dispatch = useDispatch();
  const { status } = useSelector(state => state.absenceRequests);
  const { items: users, status: usersStatus } = useSelector(state => state.users);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const validationSchema = Yup.object({
    user_id: Yup.string().required('L\'employé est requis'),
    type: Yup.string()
      .required('Le type d\'absence est requis')
      .oneOf(['Congé', 'maladie', 'autre'], 'Type d\'absence invalide'),
    dateDebut: Yup.date().required('La date de début est requise'),
    dateFin: Yup.date()
      .required('La date de fin est requise')
      .min(Yup.ref('dateDebut'), 'La date de fin doit être postérieure à la date de début'),
    motif: Yup.string().nullable(),
    justification: Yup.mixed()
      .nullable()
      .test('fileSize', 'Le fichier est trop volumineux (max 2MB)', value => {
        if (!value || typeof value === 'string') return true;
        return value.size <= 2048 * 1024;
      })
      .test('fileType', 'Format de fichier non supporté', value => {
        if (!value || typeof value === 'string') return true;
        return ['image/jpeg', 'image/png', 'application/pdf'].includes(value.type);
      }),

  });

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      if (isEdit) {
        // For update, create an object with all the values
        const updateData = {
          id: initialValues.id,
          user_id: values.user_id,
          type: values.type,
          dateDebut: values.dateDebut,
          dateFin: values.dateFin,
          motif: values.motif || null,
          statut: values.statut || initialValues.statut
        };

        await dispatch(updateAbsenceRequest(updateData)).unwrap();
      } else {
        // For create, use FormData
        const formData = new FormData();
        Object.keys(values).forEach(key => {
          if (key !== 'justification') {
            formData.append(key, values[key] || '');
          }
        });
        
        if (values.justification) {
          formData.append('justification', values.justification);
        }

        // Always set status to 'en_attente' for new requests
        formData.append('statut', 'en_attente');

        await dispatch(createAbsenceRequest(formData)).unwrap();
      }

      resetForm();
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Error submitting form:', error);
      Swal.fire(
        'Erreur!',
        'Une erreur est survenue lors de la mise à jour de la demande d\'absence.',
        'error'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="card">
      <div className="card-body">
        <Formik
          initialValues={{
            user_id: '',
            type: 'Congé',
            dateDebut: '',
            dateFin: '',
            motif: '',
            justification: null,
            ...initialValues
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, setFieldValue }) => (
            <Form>
              <div className="row">
                <div className="col-md-6">
                  <div className="mb-3">
                    <label htmlFor="user_id" className="form-label">Employé</label>
                    <Field
                      as="select"
                      name="user_id"
                      id="user_id"
                      className="form-select"
                      disabled={usersStatus === 'loading'}
                    >
                      <option value="">Sélectionner un employé</option>
                      {usersStatus === 'loading' ? (
                        <option value="" disabled>Chargement des employés...</option>
                      ) : (
                        users.map(user => (
                          <option key={user.id} value={user.id}>
                            {user.name} {user.prenom}
                          </option>
                        ))
                      )}
                    </Field>
                    <ErrorMessage name="user_id" component="div" className="text-danger" />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="mb-3">
                    <label htmlFor="type" className="form-label">Type d'absence</label>
                    <Field
                      as="select"
                      name="type"
                      id="type"
                      className="form-select"
                    >
                      <option value="Congé">Congé</option>
                      <option value="maladie">Maladie</option>
                      <option value="autre">Autre</option>
                    </Field>
                    <ErrorMessage name="type" component="div" className="text-danger" />
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-md-6">
                  <div className="mb-3">
                    <label htmlFor="dateDebut" className="form-label">Date de début</label>
                    <Field
                      type="date"
                      name="dateDebut"
                      id="dateDebut"
                      className="form-control"
                    />
                    <ErrorMessage name="dateDebut" component="div" className="text-danger" />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="mb-3">
                    <label htmlFor="dateFin" className="form-label">Date de fin</label>
                    <Field
                      type="date"
                      name="dateFin"
                      id="dateFin"
                      className="form-control"
                    />
                    <ErrorMessage name="dateFin" component="div" className="text-danger" />
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-12">
                  <div className="mb-3">
                    <label htmlFor="motif" className="form-label">Motif</label>
                    <Field
                      as="textarea"
                      name="motif"
                      id="motif"
                      className="form-control"
                      rows="3"
                    />
                    <ErrorMessage name="motif" component="div" className="text-danger" />
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-12">
                  <div className="mb-3">
                    <label htmlFor="justification" className="form-label">Justification</label>
                    <input
                      type="file"
                      name="justification"
                      id="justification"
                      className="form-control"
                      onChange={(event) => {
                        setFieldValue("justification", event.currentTarget.files[0]);
                      }}
                    />
                    <ErrorMessage name="justification" component="div" className="text-danger" />
                  </div>
                </div>
              </div>

              {isEdit && (
                <div className="mb-3">
                  <label htmlFor="statut" className="form-label">Statut</label>
                  <Field
                    as="select"
                    name="statut"
                    id="statut"
                    className="form-select"
                  >
                    <option value="en_attente">En attente</option>
                    <option value="validé">Validé</option>
                    <option value="rejeté">Rejeté</option>
                  </Field>
                  <ErrorMessage name="statut" component="div" className="text-danger" />
                </div>
              )}

              <div className="text-end">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isSubmitting || status === 'loading' || usersStatus === 'loading'}
                >
                  {isSubmitting || status === 'loading' ? (
                    <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                  ) : null}
                  {isEdit ? 'Modifier' : 'Créer'}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default AbsenceRequestForm; 