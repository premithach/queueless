import { useEffect, useState } from 'react';

import { getBusinessServices, getServiceQueue } from '../../api/businessApi';

import { getAuth } from '../../utils/auth';

import './BusinessServiceSelector.scss';

const BusinessServiceSelector = ({ onQueueChange }) => {
  const [services, setServices] = useState([]);
  const [selectedServiceId, setSelectedServiceId] = useState('');
  const [loading, setLoading] = useState(true);
  const [queueLoading, setQueueLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    const loadServices = async () => {
      try {
        const auth = getAuth();
        const businessId = auth?.business_id;

        if (!businessId) {
          throw new Error('Business information not found');
        }

        const data = await getBusinessServices(businessId);

        if (!isMounted) {
          return;
        }

        setServices(data);

        if (data.length > 0) {
          setSelectedServiceId(String(data[0].id));
        }
      } catch (error) {
        if (isMounted) {
          setError(error.message);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadServices();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!selectedServiceId) {
      return;
    }

    let isMounted = true;

    const loadServiceQueue = async () => {
      setQueueLoading(true);
      setError('');

      try {
        const queue = await getServiceQueue(selectedServiceId);

        if (isMounted) {
          onQueueChange(queue);
        }
      } catch (error) {
        if (isMounted) {
          setError(error.message);
        }
      } finally {
        if (isMounted) {
          setQueueLoading(false);
        }
      }
    };

    loadServiceQueue();

    return () => {
      isMounted = false;
    };
  }, [selectedServiceId, onQueueChange]);

  const handleServiceSelect = (serviceId) => {
    setSelectedServiceId(String(serviceId));
  };

  if (loading) {
    return (
      <div className="business-service-selector">
        <div className="business-service-selector__loading">
          Loading services...
        </div>
      </div>
    );
  }

  if (error && services.length === 0) {
    return (
      <div className="business-service-selector">
        <div className="business-service-selector__error">{error}</div>
      </div>
    );
  }

  return (
    <section className="business-service-selector">
      <div className="business-service-selector__header">
        <div>
          <p className="business-service-selector__eyebrow">QUEUE MANAGEMENT</p>

          <h2>Select Service</h2>

          <p>Choose the service queue you want to manage.</p>
        </div>

        <span className="business-service-selector__count">
          {services.length} {services.length === 1 ? 'service' : 'services'}
        </span>
      </div>

      {error && <div className="business-service-selector__error">{error}</div>}

      {services.length === 0 ? (
        <div className="business-service-selector__empty">
          No services available.
        </div>
      ) : (
        <div className="business-service-selector__list">
          {services.map((service) => {
            const isSelected = String(service.id) === selectedServiceId;

            return (
              <button
                key={service.id}
                type="button"
                className={`service-selector-card ${
                  isSelected ? 'service-selector-card--selected' : ''
                }`}
                onClick={() => handleServiceSelect(service.id)}
              >
                <div className="service-selector-card__icon">
                  {service.name?.charAt(0)}
                </div>

                <div className="service-selector-card__content">
                  <h3>{service.name}</h3>

                  {service.description && <p>{service.description}</p>}

                  {service.average_service_time && (
                    <span>
                      Average service time: {service.average_service_time}{' '}
                      minutes
                    </span>
                  )}
                </div>

                <div className="service-selector-card__arrow">
                  {isSelected ? '✓' : '›'}
                </div>
              </button>
            );
          })}
        </div>
      )}

      {queueLoading && (
        <div className="business-service-selector__queue-loading">
          Loading queue...
        </div>
      )}
    </section>
  );
};

export default BusinessServiceSelector;
