import { useCallback, useEffect, useState } from 'react';

import {
  callNextCustomer,
  cancelCurrentCustomer,
  completeCurrentCustomer,
  getQueueTokens,
  skipCurrentCustomer,
  updateQueueStatus,
} from '../../api/businessApi';

import BusinessServiceSelector from '../../components/business/BusinessServiceSelector';
import BusinessServiceManager from '../../components/business/BusinessServiceManager';

import './BusinessQueue.scss';

const BusinessQueue = () => {
  const [tokens, setTokens] = useState([]);
  const [loading, setLoading] = useState(false);
  const [queue, setQueue] = useState(null);
  const [callingNext, setCallingNext] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [queueStatus, setQueueStatus] = useState('');
  const [statusLoading, setStatusLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!queue?.id) {
      return;
    }

    let isMounted = true;

    const loadQueueTokens = async () => {
      setLoading(true);
      setError('');
      setTokens([]);

      try {
        const data = await getQueueTokens(queue.id);

        if (isMounted) {
          setTokens(data);
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

    loadQueueTokens();

    return () => {
      isMounted = false;
    };
  }, [queue]);

  const handleCallNext = async () => {
    setCallingNext(true);
    setError('');

    try {
      await callNextCustomer(queue.id);

      const updatedTokens = await getQueueTokens(queue.id);

      setTokens(updatedTokens);
    } catch (error) {
      setError(error.message);
    } finally {
      setCallingNext(false);
    }
  };

  const handleCustomerAction = async (action) => {
    setActionLoading(true);
    setError('');

    try {
      if (action === 'complete') {
        await completeCurrentCustomer(queue.id);
      }

      if (action === 'skip') {
        await skipCurrentCustomer(queue.id);
      }

      if (action === 'cancel') {
        await cancelCurrentCustomer(queue.id);
      }

      const updatedTokens = await getQueueTokens(queue.id);

      setTokens(updatedTokens);
    } catch (error) {
      setError(error.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleQueueStatusChange = async (status) => {
    setStatusLoading(true);
    setError('');

    try {
      const updatedQueue = await updateQueueStatus(
        queue.id,
        status
      );

      setQueueStatus(updatedQueue.status);
    } catch (error) {
      setError(error.message);
    } finally {
      setStatusLoading(false);
    }
  };

  const handleQueueChange = useCallback((selectedQueue) => {
    setQueue(selectedQueue);
    setQueueStatus(selectedQueue.status);
  }, []);

  const currentCustomer = tokens.find(
    (token) => token.status === 'SERVING'
  );

  const waitingCustomers = tokens.filter(
    (token) => token.status === 'WAITING'
  );

  const previousCustomers = tokens.filter(
    (token) =>
      token.status === 'COMPLETED' ||
      token.status === 'SKIPPED' ||
      token.status === 'CANCELLED'
  );

  return (
    <div className="business-queue">
      <div className="queue-header">
        <h1>Queue Management</h1>

        {queue && (
          <div className="queue-status">
            <span
              className={`status-dot status-${queueStatus.toLowerCase()}`}
            />
            {queueStatus}
          </div>
        )}
      </div>

      {/* Service management */}
      <BusinessServiceManager />

      {/* Queue service selection */}
      <div className="service-selector-container">
        <BusinessServiceSelector
          onQueueChange={handleQueueChange}
        />
      </div>

      {loading && <p>Loading queue...</p>}

      {error && (
        <p className="error-message">
          {error}
        </p>
      )}

      {queue && (
        <>
          <div className="queue-actions">
            {queueStatus === 'OPEN' && (
              <button
                type="button"
                className="pause-button"
                onClick={() =>
                  handleQueueStatusChange('PAUSED')
                }
                disabled={statusLoading}
              >
                {statusLoading
                  ? 'Pausing...'
                  : 'Pause Queue'}
              </button>
            )}

            {queueStatus === 'PAUSED' && (
              <button
                type="button"
                className="resume-button"
                onClick={() =>
                  handleQueueStatusChange('OPEN')
                }
                disabled={statusLoading}
              >
                {statusLoading
                  ? 'Resuming...'
                  : 'Resume Queue'}
              </button>
            )}

            <button
              type="button"
              className="call-next-button"
              onClick={handleCallNext}
              disabled={
                callingNext ||
                Boolean(currentCustomer)
              }
            >
              {callingNext
                ? 'Calling...'
                : 'Call Next Customer'}
            </button>
          </div>

          {currentCustomer && (
            <section className="queue-section">
              <h2>Current Customer</h2>

              <div className="current-customer">
                <div className="customer-info">
                  <div className="token-number">
                    #{currentCustomer.token_number}
                  </div>

                  <div>
                    <h3>
                      {currentCustomer.customer_name}
                    </h3>

                    <p>
                      Status:{' '}
                      {currentCustomer.status}
                    </p>

                    <p>
                      Joined:{' '}
                      {new Date(
                        currentCustomer.joined_at
                      ).toLocaleString()}
                    </p>

                    {currentCustomer.called_at && (
                      <p>
                        Called:{' '}
                        {new Date(
                          currentCustomer.called_at
                        ).toLocaleString()}
                      </p>
                    )}
                  </div>
                </div>

                <div className="customer-actions">
                  <button
                    type="button"
                    className="complete-button"
                    onClick={() =>
                      handleCustomerAction(
                        'complete'
                      )
                    }
                    disabled={actionLoading}
                  >
                    Complete
                  </button>

                  <button
                    type="button"
                    className="skip-button"
                    onClick={() =>
                      handleCustomerAction('skip')
                    }
                    disabled={actionLoading}
                  >
                    Skip
                  </button>

                  <button
                    type="button"
                    className="cancel-button"
                    onClick={() =>
                      handleCustomerAction('cancel')
                    }
                    disabled={actionLoading}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </section>
          )}

          <section className="queue-section">
            <h2>Waiting Customers</h2>

            {waitingCustomers.length === 0 ? (
              <div className="empty-state">
                No waiting customers.
              </div>
            ) : (
              <div className="customer-list">
                {waitingCustomers.map((token) => (
                  <div
                    key={token.id}
                    className="customer-item"
                  >
                    <div className="customer-details">
                      <span className="token">
                        #{token.token_number}
                      </span>

                      <div>
                        <strong>
                          {token.customer_name}
                        </strong>

                        <p>
                          Joined:{' '}
                          {new Date(
                            token.joined_at
                          ).toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <span className="customer-status">
                      {token.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="queue-section">
            <h2>Previous Customers</h2>

            {previousCustomers.length === 0 ? (
              <div className="empty-state">
                No previous customers.
              </div>
            ) : (
              <div className="customer-list">
                {previousCustomers.map((token) => (
                  <div
                    key={token.id}
                    className="customer-item"
                  >
                    <div className="customer-details">
                      <span className="token">
                        #{token.token_number}
                      </span>

                      <div>
                        <strong>
                          {token.customer_name}
                        </strong>

                        <p>
                          Joined:{' '}
                          {new Date(
                            token.joined_at
                          ).toLocaleString()}
                        </p>

                        {token.called_at && (
                          <p>
                            Called:{' '}
                            {new Date(
                              token.called_at
                            ).toLocaleString()}
                          </p>
                        )}
                      </div>
                    </div>

                    <span className="customer-status">
                      {token.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
};

export default BusinessQueue;
