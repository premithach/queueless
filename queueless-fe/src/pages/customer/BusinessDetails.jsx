import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { getBusinessById, getBusinessServices } from '../../api/businessApi';

import {
  getActiveQueueTokens,
  getQueueByService,
  joinQueue,
} from '../../api/queueApi';

import './BusinessDetails.scss';

const BusinessDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [business, setBusiness] = useState(null);
  const [services, setServices] = useState([]);
  const [queues, setQueues] = useState({});

  /*
   * Store active tokens by service_id.
   *
   * Example:
   *
   * {
   *   8: {
   *     id: 22,
   *     queue_id: 8,
   *     service_id: 8,
   *     token_number: 1,
   *     status: 'WAITING'
   *   }
   * }
   */
  const [activeTokensByService, setActiveTokensByService] = useState({});

  const [joiningServiceId, setJoiningServiceId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    const loadBusinessDetails = async () => {
      setLoading(true);
      setError('');

      try {
        const [businessData, servicesData, activeQueueTokens] =
          await Promise.all([
            getBusinessById(id),
            getBusinessServices(id),
            getActiveQueueTokens(),
          ]);

        if (!isMounted) {
          return;
        }

        setBusiness(businessData);
        setServices(servicesData);

        /*
         * Only keep active tokens that belong
         * to the current business.
         */
        const businessActiveTokens = activeQueueTokens.filter(
          (token) => Number(token.business_id) === Number(id)
        );

        /*
         * Map by service_id, not queue_id.
         *
         * This matches the BE business rule:
         * one active queue per service.
         */
        const activeTokenMap = {};

        businessActiveTokens.forEach((token) => {
          activeTokenMap[token.service_id] = token;
        });

        setActiveTokensByService(activeTokenMap);

        /*
         * Fetch queues for all services.
         */
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

        if (!isMounted) {
          return;
        }

        const queueMap = {};

        queueResults.forEach(({ serviceId, queue }) => {
          queueMap[serviceId] = queue;
        });

        setQueues(queueMap);
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

    /*
     * Frontend protection.
     *
     * The BE is still the final authority.
     */
    const existingToken = activeTokensByService[serviceId];

    if (existingToken) {
      navigate(`/queues/${existingToken.queue_id}/token/${existingToken.id}`);
      return;
    }

    setJoiningServiceId(serviceId);
    setError('');

    try {
      const result = await joinQueue(queue.id);

      /*
       * New join.
       */
      if (result.status === 'JOINED') {
        navigate(`/queues/${queue.id}/token/${result.token.id}`);
        return;
      }

      /*
       * Safety for stale frontend data / race condition.
       *
       * BE says the customer is already in this service.
       */
      if (result.status === 'ALREADY_JOINED') {
        setActiveTokensByService((previous) => ({
          ...previous,
          [serviceId]: result.token,
        }));

        navigate(`/queues/${result.token.queue_id}/token/${result.token.id}`);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setJoiningServiceId(null);
    }
  };

  const handleViewToken = (token) => {
    navigate(`/queues/${token.queue_id}/token/${token.id}`);
  };

  if (loading) {
    return (
      <div className="business-details">
        <p>Loading business...</p>
      </div>
    );
  }

  if (error && !business) {
    return (
      <div className="business-details">
        <div className="business-details__error">{error}</div>
      </div>
    );
  }

  if (!business) {
    return (
      <div className="business-details">
        <p>Business not found.</p>
      </div>
    );
  }

  /*
   * Active queues for THIS business.
   */
  const businessActiveTokens = Object.values(activeTokensByService);

  return (
    <div className="business-details">
      <header className="business-details__header">
        <div className="business-details__business-icon">
          {business.name?.charAt(0)}
        </div>

        <div>
          <p className="business-details__eyebrow">BUSINESS</p>

          <h1>{business.name}</h1>

          <p className="business-details__category">{business.category}</p>

          <p className="business-details__address">{business.address}</p>
        </div>
      </header>

      {error && <div className="business-details__error">{error}</div>}

      {/*
        ============================
        ACTIVE QUEUES
        ============================
      */}
      {businessActiveTokens.length > 0 && (
        <section className="active-queues">
          <div className="active-queues__header">
            <div>
              <p className="active-queues__eyebrow">YOUR QUEUES</p>

              <h2>Active Queues</h2>

              <p>You are currently waiting in these queues.</p>
            </div>

            <span className="active-queues__count">
              {businessActiveTokens.length}
            </span>
          </div>

          <div className="active-queues__list">
            {businessActiveTokens.map((token) => (
              <div key={token.id} className="active-queue-card">
                <div className="active-queue-card__info">
                  <span className="active-queue-card__check">✓</span>

                  <div>
                    <h3>{token.service_name}</h3>

                    <p>Token #{token.token_number}</p>

                    <span>{token.status}</span>
                  </div>
                </div>

                <button
                  type="button"
                  className="active-queue-card__button"
                  onClick={() => handleViewToken(token)}
                >
                  View Token
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {/*
        ============================
        SERVICES
        ============================
      */}
      <section className="services-section">
        <div className="services-section__header">
          <div>
            <p className="services-section__eyebrow">SERVICES</p>

            <h2>Available Services</h2>

            <p>Choose a service and join the queue.</p>
          </div>

          <span className="services-section__count">
            {services.length} {services.length === 1 ? 'service' : 'services'}
          </span>
        </div>

        {services.length === 0 ? (
          <div className="services-section__empty">
            <p>No services available.</p>
          </div>
        ) : (
          <div className="service-list">
            {services.map((service) => {
              const queue = queues[service.id];

              const activeToken = activeTokensByService[service.id];

              const isAlreadyJoined = Boolean(activeToken);

              const isJoining = joiningServiceId === service.id;

              const isQueueOpen = queue?.status === 'OPEN';

              return (
                <article
                  key={service.id}
                  className={`service-card ${
                    isAlreadyJoined ? 'service-card--joined' : ''
                  }`}
                >
                  <div className="service-card__top">
                    <div className="service-card__icon">
                      {service.name?.charAt(0)}
                    </div>

                    <div className="service-card__info">
                      <h3>{service.name}</h3>

                      <p>{service.description}</p>

                      <span>
                        Average service time: {service.average_service_time}{' '}
                        minutes
                      </span>
                    </div>
                  </div>

                  <div className="service-card__footer">
                    {!queue ? (
                      <div className="queue-status queue-status--unavailable">
                        <span className="queue-status__dot" />

                        <div>
                          <strong>Unavailable</strong>

                          <p>
                            This service currently doesn't have an active queue.
                          </p>
                        </div>
                      </div>
                    ) : isAlreadyJoined ? (
                      <>
                        <div className="queue-status queue-status--joined">
                          <span className="queue-status__dot" />

                          <div>
                            <strong>Already in queue</strong>

                            <p>
                              Token #{activeToken.token_number} ·{' '}
                              {activeToken.status}
                            </p>
                          </div>
                        </div>

                        <button
                          type="button"
                          className="service-card__join-button service-card__join-button--joined"
                          onClick={() => handleViewToken(activeToken)}
                        >
                          View My Token
                        </button>
                      </>
                    ) : (
                      <>
                        <div
                          className={`queue-status ${
                            isQueueOpen
                              ? 'queue-status--open'
                              : 'queue-status--paused'
                          }`}
                        >
                          <span className="queue-status__dot" />

                          <div>
                            <strong>{isQueueOpen ? 'OPEN' : 'PAUSED'}</strong>

                            {!isQueueOpen && (
                              <p>This queue is temporarily unavailable.</p>
                            )}
                          </div>
                        </div>

                        <button
                          type="button"
                          className="service-card__join-button"
                          onClick={() => handleJoinQueue(service.id)}
                          disabled={isJoining || !isQueueOpen}
                        >
                          {isJoining
                            ? 'Joining...'
                            : isQueueOpen
                              ? 'Join Queue'
                              : 'Queue Paused'}
                        </button>
                      </>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};

export default BusinessDetails;
