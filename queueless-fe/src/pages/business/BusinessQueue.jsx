import { useEffect, useState, useCallback } from 'react';

import {
  callNextCustomer,
  cancelCurrentCustomer,
  completeCurrentCustomer,
  getQueueTokens,
  skipCurrentCustomer,
  updateQueueStatus,
} from '../../api/businessApi';

import BusinessServiceSelector from '../../components/business/BusinessServiceSelector';

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
      const updatedQueue = await updateQueueStatus(queue.id, status);

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

  const currentCustomer = tokens.find((token) => token.status === 'SERVING');

  const waitingCustomers = tokens.filter((token) => token.status === 'WAITING');

  const previousCustomers = tokens.filter(
    (token) =>
      token.status === 'COMPLETED' ||
      token.status === 'SKIPPED' ||
      token.status === 'CANCELLED'
  );

  return (
    <div>
      <h1>Queue Management</h1>

      <BusinessServiceSelector onQueueChange={handleQueueChange} />

      {loading && <p>Loading queue...</p>}

      {error && <p>{error}</p>}

      {queue && (
        <>
          <p>Queue Status: {queueStatus}</p>

          {queueStatus === 'OPEN' && (
            <button
              type="button"
              onClick={() => handleQueueStatusChange('PAUSED')}
              disabled={statusLoading}
            >
              {statusLoading ? 'Pausing...' : 'Pause Queue'}
            </button>
          )}

          {queueStatus === 'PAUSED' && (
            <button
              type="button"
              onClick={() => handleQueueStatusChange('OPEN')}
              disabled={statusLoading}
            >
              {statusLoading ? 'Resuming...' : 'Resume Queue'}
            </button>
          )}

          <button
            type="button"
            onClick={handleCallNext}
            disabled={callingNext || Boolean(currentCustomer)}
          >
            {callingNext ? 'Calling...' : 'Call Next Customer'}
          </button>

          {currentCustomer && (
            <section>
              <h2>Current Customer</h2>

              <div>
                <h3>Token #{currentCustomer.token_number}</h3>

                <p>Customer: {currentCustomer.customer_name}</p>

                <p>Status: {currentCustomer.status}</p>

                <p>
                  Joined: {new Date(currentCustomer.joined_at).toLocaleString()}
                </p>

                {currentCustomer.called_at && (
                  <p>
                    Called:{' '}
                    {new Date(currentCustomer.called_at).toLocaleString()}
                  </p>
                )}

                <button
                  type="button"
                  onClick={() => handleCustomerAction('complete')}
                  disabled={actionLoading}
                >
                  Complete
                </button>

                <button
                  type="button"
                  onClick={() => handleCustomerAction('skip')}
                  disabled={actionLoading}
                >
                  Skip
                </button>

                <button
                  type="button"
                  onClick={() => handleCustomerAction('cancel')}
                  disabled={actionLoading}
                >
                  Cancel
                </button>
              </div>
            </section>
          )}

          <section>
            <h2>Waiting Customers</h2>

            {waitingCustomers.length === 0 ? (
              <p>No waiting customers.</p>
            ) : (
              waitingCustomers.map((token) => (
                <div key={token.id}>
                  <h3>Token #{token.token_number}</h3>

                  <p>Customer: {token.customer_name}</p>

                  <p>Status: {token.status}</p>

                  <p>Joined: {new Date(token.joined_at).toLocaleString()}</p>
                </div>
              ))
            )}
          </section>

          <section>
            <h2>Previous Customers</h2>

            {previousCustomers.length === 0 ? (
              <p>No previous customers.</p>
            ) : (
              previousCustomers.map((token) => (
                <div key={token.id}>
                  <h3>Token #{token.token_number}</h3>

                  <p>Customer: {token.customer_name}</p>

                  <p>Status: {token.status}</p>

                  <p>Joined: {new Date(token.joined_at).toLocaleString()}</p>

                  {token.called_at && (
                    <p>Called: {new Date(token.called_at).toLocaleString()}</p>
                  )}
                </div>
              ))
            )}
          </section>
        </>
      )}
    </div>
  );
};

export default BusinessQueue;
