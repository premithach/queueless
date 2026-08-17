import { useEffect, useState } from 'react';

import { getQueueHistory } from '../../api/queueApi';

const QueueHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    const loadQueueHistory = async () => {
      try {
        const data = await getQueueHistory();

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
  }, []);

  if (loading) {
    return <p>Loading queue history...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <h1>Queue History</h1>

      {history.length === 0 ? (
        <p>No previous queue visits.</p>
      ) : (
        <div>
          {history.map((visit) => (
            <div key={visit.id}>
              <h2>{visit.business_name}</h2>

              <p>Service: {visit.service_name}</p>

              <p>Token: #{visit.token_number}</p>

              <p>Status: {visit.status}</p>

              <p>Joined: {new Date(visit.joined_at).toLocaleString()}</p>

              {visit.called_at && (
                <p>Called: {new Date(visit.called_at).toLocaleString()}</p>
              )}

              {visit.completed_at && (
                <p>
                  Completed: {new Date(visit.completed_at).toLocaleString()}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default QueueHistory;
