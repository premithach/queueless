import { useCallback, useEffect, useState } from 'react';

import { getQueueStatistics } from '../../api/businessApi';

import BusinessServiceSelector from '../../components/business/BusinessServiceSelector';

import './BusinessStatistics.scss';

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
    <div className="business-statistics">
      <div className="statistics-header">
        <div>
          <p className="statistics-eyebrow">BUSINESS</p>

          <h1>Queue Statistics</h1>

          <p className="statistics-description">
            Track queue performance and customer activity.
          </p>
        </div>

        {queue && (
          <div className="statistics-queue-status">Queue #{queue.id}</div>
        )}
      </div>

      <div className="service-selector-container">
        <BusinessServiceSelector onQueueChange={handleQueueChange} />
      </div>

      {loading && (
        <div className="statistics-message">Loading statistics...</div>
      )}

      {error && <div className="statistics-error">{error}</div>}

      {queue && !loading && statistics && (
        <>
          <div className="statistics-grid">
            <div className="statistics-card">
              <span className="statistics-label">Total Customers</span>

              <strong className="statistics-value">
                {statistics.total_customers}
              </strong>
            </div>

            <div className="statistics-card">
              <span className="statistics-label">Completed</span>

              <strong className="statistics-value">
                {statistics.completed}
              </strong>
            </div>

            <div className="statistics-card">
              <span className="statistics-label">Skipped</span>

              <strong className="statistics-value">{statistics.skipped}</strong>
            </div>

            <div className="statistics-card">
              <span className="statistics-label">Cancelled</span>

              <strong className="statistics-value">
                {statistics.cancelled}
              </strong>
            </div>
          </div>

          <section className="performance-card">
            <div className="card-header">
              <p className="statistics-eyebrow">PERFORMANCE</p>

              <h2>Queue Performance</h2>
            </div>

            <div className="performance-list">
              <div className="performance-row">
                <div>
                  <span>Average Wait Time</span>
                  <p>Average time customers wait before being served.</p>
                </div>

                <strong>{statistics.average_wait_time} min</strong>
              </div>

              <div className="performance-row">
                <div>
                  <span>Average Service Time</span>
                  <p>Average time spent serving a customer.</p>
                </div>

                <strong>{statistics.average_service_time} min</strong>
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
};

export default BusinessStatistics;
