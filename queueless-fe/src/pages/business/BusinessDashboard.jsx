import { useCallback, useEffect, useState } from 'react';

import { getQueueStatistics, getQueueTokens } from '../../api/businessApi';

import BusinessServiceSelector from '../../components/business/BusinessServiceSelector';

const BusinessDashboard = () => {
  const [queue, setQueue] = useState(null);
  const [statistics, setStatistics] = useState(null);
  const [tokens, setTokens] = useState([]);
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

    const loadDashboard = async () => {
      setLoading(true);
      setError('');

      try {
        const [statisticsData, tokensData] = await Promise.all([
          getQueueStatistics(queue.id),
          getQueueTokens(queue.id),
        ]);

        if (isMounted) {
          setStatistics(statisticsData);
          setTokens(tokensData);
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

    loadDashboard();

    return () => {
      isMounted = false;
    };
  }, [queue]);

  const waitingCustomers = tokens.filter((token) => token.status === 'WAITING');

  const currentCustomer = tokens.find((token) => token.status === 'SERVING');

  return (
    <div>
      <h1>Business Dashboard</h1>

      <BusinessServiceSelector onQueueChange={handleQueueChange} />

      {loading && <p>Loading dashboard...</p>}

      {error && <p>{error}</p>}

      {queue && <p>Queue Status: {queue.status}</p>}

      {statistics && (
        <div>
          <section>
            <h2>Total Customers</h2>
            <p>{statistics.total_customers}</p>
          </section>

          <section>
            <h2>Waiting Customers</h2>
            <p>{waitingCustomers.length}</p>
          </section>

          <section>
            <h2>Currently Serving</h2>
            <p>
              {currentCustomer
                ? `Token #${currentCustomer.token_number}`
                : 'No customer'}
            </p>
          </section>

          <section>
            <h2>Completed</h2>
            <p>{statistics.completed}</p>
          </section>

          <section>
            <h2>Skipped</h2>
            <p>{statistics.skipped}</p>
          </section>

          <section>
            <h2>Cancelled</h2>
            <p>{statistics.cancelled}</p>
          </section>

          <section>
            <h2>Average Wait Time</h2>
            <p>{statistics.average_wait_time} minutes</p>
          </section>

          <section>
            <h2>Average Service Time</h2>
            <p>{statistics.average_service_time} minutes</p>
          </section>
        </div>
      )}
    </div>
  );
};

export default BusinessDashboard;
