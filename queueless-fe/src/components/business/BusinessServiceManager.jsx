import { useEffect, useState } from 'react';

import {
  getBusinessServices,
  createBusinessService,
  updateBusinessService,
  deleteBusinessService,
} from '../../api/businessApi';

import { getAuth } from '../../utils/auth';

import './BusinessServiceManager.scss';

const BusinessServiceManager = ({
  onServicesChange,
}) => {
  const [services, setServices] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState('');

  const [showForm, setShowForm] = useState(false);

  const [editingService, setEditingService] =
    useState(null);

  const [form, setForm] = useState({
    name: '',
    description: '',
    average_service_time: '',
  });

  const loadServices = async () => {
    try {
      setLoading(true);
      setError('');

      const auth = getAuth();
      const businessId = auth?.business_id;

      if (!businessId) {
        throw new Error(
          'Business information not found'
        );
      }

      const data =
        await getBusinessServices(businessId);

      setServices(data);

      if (onServicesChange) {
        onServicesChange(data);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadServices();
  }, []);

  const resetForm = () => {
    setForm({
      name: '',
      description: '',
      average_service_time: '',
    });

    setEditingService(null);
    setShowForm(false);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setSaving(true);
    setError('');

    try {
      const auth = getAuth();
      const businessId = auth?.business_id;

      const serviceData = {
        name: form.name.trim(),
        description: form.description.trim(),
        average_service_time: Number(
          form.average_service_time
        ),
      };

      if (editingService) {
        await updateBusinessService(
          editingService.id,
          serviceData
        );
      } else {
        await createBusinessService(
          businessId,
          serviceData
        );
      }

      await loadServices();

      resetForm();
    } catch (error) {
      setError(error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (service) => {
    setEditingService(service);

    setForm({
      name: service.name || '',
      description: service.description || '',
      average_service_time:
        service.average_service_time || '',
    });

    setShowForm(true);
    setError('');
  };

  const handleDelete = async (service) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${service.name}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setError('');

      await deleteBusinessService(service.id);

      await loadServices();
    } catch (error) {
      setError(error.message);
    }
  };

  if (loading) {
    return (
      <section className="service-manager">
        <div className="service-manager__header">
          <div>
            <p className="service-manager__eyebrow">
              SERVICES
            </p>

            <h2>Manage Services</h2>
          </div>
        </div>

        <p>Loading services...</p>
      </section>
    );
  }

  return (
    <section className="service-manager">
      <div className="service-manager__header">
        <div>
          <p className="service-manager__eyebrow">
            SERVICES
          </p>

          <h2>Manage Services</h2>

          <p>
            Manage the services offered by your
            business.
          </p>
        </div>

        <button
          type="button"
          className="service-manager__add-button"
          onClick={() => {
            setEditingService(null);

            setForm({
              name: '',
              description: '',
              average_service_time: '',
            });

            setShowForm(true);
            setError('');
          }}
        >
          + Add Service
        </button>
      </div>

      {error && (
        <div className="service-manager__error">
          {error}
        </div>
      )}

      {showForm && (
        <form
          className="service-form"
          onSubmit={handleSubmit}
        >
          <div className="service-form__header">
            <h3>
              {editingService
                ? 'Edit Service'
                : 'Add Service'}
            </h3>

            <button
              type="button"
              onClick={resetForm}
              className="service-form__close"
            >
              ×
            </button>
          </div>

          <div className="service-form__field">
            <label htmlFor="service-name">
              Service name
            </label>

            <input
              id="service-name"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="e.g. Cash Withdrawal"
              required
            />
          </div>

          <div className="service-form__field">
            <label htmlFor="service-description">
              Description
            </label>

            <textarea
              id="service-description"
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Describe this service"
              rows={3}
            />
          </div>

          <div className="service-form__field">
            <label htmlFor="average-service-time">
              Average service time
            </label>

            <div className="service-form__time">
              <input
                id="average-service-time"
                name="average_service_time"
                type="number"
                min="1"
                value={
                  form.average_service_time
                }
                onChange={handleChange}
                placeholder="10"
                required
              />

              <span>minutes</span>
            </div>
          </div>

          <div className="service-form__actions">
            <button
              type="button"
              onClick={resetForm}
              disabled={saving}
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
            >
              {saving
                ? 'Saving...'
                : editingService
                  ? 'Save Changes'
                  : 'Add Service'}
            </button>
          </div>
        </form>
      )}

      {services.length === 0 ? (
        <div className="service-manager__empty">
          <h3>No services yet</h3>

          <p>
            Add the first service offered by your
            business.
          </p>
        </div>
      ) : (
        <div className="service-manager__list">
          {services.map((service) => (
            <article
              key={service.id}
              className="managed-service"
            >
              <div className="managed-service__icon">
                {service.name
                  ?.charAt(0)
                  .toUpperCase()}
              </div>

              <div className="managed-service__info">
                <h3>{service.name}</h3>

                {service.description && (
                  <p>
                    {service.description}
                  </p>
                )}

                <span>
                  Average service time:{' '}
                  <strong>
                    {service.average_service_time}
                  </strong>{' '}
                  min
                </span>
              </div>

              <div className="managed-service__actions">
                <button
                  type="button"
                  onClick={() =>
                    handleEdit(service)
                  }
                >
                  Edit
                </button>

                <button
                  type="button"
                  onClick={() =>
                    handleDelete(service)
                  }
                >
                  Delete
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
};

export default BusinessServiceManager;