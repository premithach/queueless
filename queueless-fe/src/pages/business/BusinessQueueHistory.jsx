import { useCallback, useEffect, useState } from 'react';

import { getQueueHistory } from '../../api/businessApi';

import BusinessServiceSelector from '../../components/business/BusinessServiceSelector';

const BusinessQueueHistory = () => {
  const [queue, setQueue] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleQueueChange = useCallback((selectedQueue) => {
    setQueue(selectedQueue);
  }, []);

  useEffect(() => {
    if (!queue?.id) {
      return;
    }

    let isMounted = true;

    const loadQueueHistory = async () => {
      setLoading(true);
      setError('');
      setHistory([]);

      try {
        const data = await getQueueHistory(queue.id);

        if (isMounted) {
          setHistory(data);
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

    loadQueueHistory();

    return () => {
      isMounted = false;
    };
  }, [queue]);

  return (
    <div>
      <h1>Queue History</h1>

      <BusinessServiceSelector onQueueChange={handleQueueChange} />

      {loading && <p>Loading queue history...</p>}

      {error && <p>{error}</p>}

      {queue && !loading && (
        <section>
          {history.length === 0 ? (
            <p>No queue history available.</p>
          ) : (
            history.map((token) => (
              <div key={token.id}>
                <h2>Token #{token.token_number}</h2>

                <p>Customer: {token.customer_name}</p>

                <p>Status: {token.status}</p>

                <p>Joined: {new Date(token.joined_at).toLocaleString()}</p>

                {token.called_at && (
                  <p>Called: {new Date(token.called_at).toLocaleString()}</p>
                )}

                {token.completed_at && (
                  <p>
                    Completed: {new Date(token.completed_at).toLocaleString()}
                  </p>
                )}
              </div>
            ))
          )}
        </section>
      )}
    </div>
  );
};

export default BusinessQueueHistory;
