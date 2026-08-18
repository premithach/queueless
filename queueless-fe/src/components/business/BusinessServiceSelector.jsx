import { useEffect, useState } from 'react';

import { getBusinessServices, getServiceQueue } from '../../api/businessApi';

import { getAuth } from '../../utils/auth';

const BusinessServiceSelector = ({ onQueueChange }) => {
  const [services, setServices] = useState([]);
  const [selectedServiceId, setSelectedServiceId] = useState('');
  const [loading, setLoading] = useState(true);
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
      try {
        const queue = await getServiceQueue(selectedServiceId);

        if (isMounted) {
          onQueueChange(queue);
        }
      } catch (error) {
        if (isMounted) {
          setError(error.message);
        }
      }
    };

    loadServiceQueue();

    return () => {
      isMounted = false;
    };
  }, [selectedServiceId, onQueueChange]);

  if (loading) {
    return <p>Loading services...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <label htmlFor="service">Select Service</label>

      <select
        id="service"
        value={selectedServiceId}
        onChange={(event) => setSelectedServiceId(event.target.value)}
      >
        {services.map((service) => (
          <option key={service.id} value={service.id}>
            {service.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default BusinessServiceSelector;
