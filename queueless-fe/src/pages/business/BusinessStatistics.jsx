import { useCallback, useEffect, useState } from 'react';

import { getQueueStatistics } from '../../api/businessApi';

import BusinessServiceSelector from '../../components/business/BusinessServiceSelector';

const BusinessStatistics = () => {
  const [queue, setQueue] = useState(null);
  const [statistics, setStatistics] = useState(null);
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

    const loadStatistics = async () => {
      setLoading(true);
      setError('');
      setStatistics(null);

      try {
        const data = await getQueueStatistics(queue.id);

        if (isMounted) {
          setStatistics(data);
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

    loadStatistics();

    return () => {
      isMounted = false;
    };
  }, [queue]);

  return (
    <div>
      <h1>Queue Statistics</h1>

      <BusinessServiceSelector onQueueChange={handleQueueChange} />

      {loading && <p>Loading statistics...</p>}

      {error && <p>{error}</p>}

      {statistics && !loading && (
        <section>
          <div>
            <h2>Total Customers</h2>
            <p>{statistics.total_customers}</p>
          </div>

          <div>
            <h2>Completed</h2>
            <p>{statistics.completed}</p>
          </div>

          <div>
            <h2>Skipped</h2>
            <p>{statistics.skipped}</p>
          </div>

          <div>
            <h2>Cancelled</h2>
            <p>{statistics.cancelled}</p>
          </div>

          <div>
            <h2>Average Wait Time</h2>
            <p>{statistics.average_wait_time} minutes</p>
          </div>

          <div>
            <h2>Average Service Time</h2>
            <p>{statistics.average_service_time} minutes</p>
          </div>
        </section>
      )}
    </div>
  );
};

export default BusinessStatistics;
