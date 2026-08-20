import { useCallback, useEffect, useState } from 'react';

import { getQueueHistory } from '../../api/businessApi';

import BusinessServiceSelector from '../../components/business/BusinessServiceSelector';

import './BusinessQueueHistory.scss';

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
    <div className="business-history">
      <div className="history-header">
        <div>
          <p className="history-eyebrow">BUSINESS</p>
          <h1>Queue History</h1>
          <p className="history-description">
            View completed and previous customer activity.
          </p>
        </div>

        {queue && <div className="history-queue-status">Queue #{queue.id}</div>}
      </div>

      <div className="service-selector-container">
        <BusinessServiceSelector onQueueChange={handleQueueChange} />
      </div>

      {loading && (
        <div className="history-message">Loading queue history...</div>
      )}

      {error && <div className="history-error">{error}</div>}

      {queue && !loading && (
        <section className="history-card">
          {history.length === 0 ? (
            <div className="empty-history">
              <h2>No queue history</h2>
              <p>There are no previous customers for this service.</p>
            </div>
          ) : (
            <div className="history-table-wrapper">
              <table className="history-table">
                <thead>
                  <tr>
                    <th>Token</th>
                    <th>Customer</th>
                    <th>Status</th>
                    <th>Joined</th>
                    <th>Called</th>
                    <th>Completed</th>
                  </tr>
                </thead>

                <tbody>
                  {history.map((token) => (
                    <tr key={token.id}>
                      <td>
                        <strong>#{token.token_number}</strong>
                      </td>

                      <td>{token.customer_name}</td>

                      <td>
                        <span
                          className={`history-status status-${token.status.toLowerCase()}`}
                        >
                          {token.status}
                        </span>
                      </td>

                      <td>{new Date(token.joined_at).toLocaleString()}</td>

                      <td>
                        {token.called_at
                          ? new Date(token.called_at).toLocaleString()
                          : '-'}
                      </td>

                      <td>
                        {token.completed_at
                          ? new Date(token.completed_at).toLocaleString()
                          : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}
    </div>
  );
};

export default BusinessQueueHistory;
