import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import { getBusinessById, getBusinessServices } from '../../api/businessApi';

import { getQueueByService, joinQueue } from '../../api/queueApi';

const BusinessDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [business, setBusiness] = useState(null);
  const [services, setServices] = useState([]);
  const [queues, setQueues] = useState({});
  const [joiningServiceId, setJoiningServiceId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    const loadBusinessDetails = async () => {
      try {
        const [businessData, servicesData] = await Promise.all([
          getBusinessById(id),
          getBusinessServices(id),
        ]);

        if (!isMounted) {
          return;
        }

        setBusiness(businessData);
        setServices(servicesData);

        const queueResults = await Promise.all(
          servicesData.map(async (service) => {
            try {
              const queue = await getQueueByService(service.id);

              return {
                serviceId: service.id,
                queue,
              };
            } catch {
              return {
                serviceId: service.id,
                queue: null,
              };
            }
          })
        );

        if (isMounted) {
          const queueMap = {};

          queueResults.forEach(({ serviceId, queue }) => {
            queueMap[serviceId] = queue;
          });

          setQueues(queueMap);
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

    loadBusinessDetails();

    return () => {
      isMounted = false;
    };
  }, [id]);

  const handleJoinQueue = async (serviceId) => {
    const queue = queues[serviceId];

    if (!queue) {
      setError('Queue is not available for this service.');
      return;
    }

    setJoiningServiceId(serviceId);
    setError('');

    try {
      const result = await joinQueue(queue.id);

      navigate(`/queues/${queue.id}/token/${result.id}`);
    } catch (error) {
      setError(error.message);
    } finally {
      setJoiningServiceId(null);
    }
  };

  if (loading) {
    return <p>Loading business...</p>;
  }

  if (error && !business) {
    return <p>{error}</p>;
  }

  if (!business) {
    return <p>Business not found.</p>;
  }

  return (
    <div>
      <h1>{business.name}</h1>

      <p>Category: {business.category}</p>

      <p>Address: {business.address}</p>

      <h2>Available Services</h2>

      {error && <p>{error}</p>}

      {services.length === 0 ? (
        <p>No services available.</p>
      ) : (
        <div>
          {services.map((service) => {
            const queue = queues[service.id];

            return (
              <div key={service.id}>
                <h3>{service.name}</h3>

                <p>{service.description}</p>

                <p>
                  Average service time: {service.average_service_time} minutes
                </p>

                {queue ? (
                  <>
                    <p>Queue status: {queue.status}</p>

                    <button
                      onClick={() => handleJoinQueue(service.id)}
                      disabled={
                        joiningServiceId === service.id ||
                        queue.status !== 'OPEN'
                      }
                    >
                      {joiningServiceId === service.id
                        ? 'Joining...'
                        : 'Join Queue'}
                    </button>
                  </>
                ) : (
                  <p>Queue unavailable</p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default BusinessDetails;
