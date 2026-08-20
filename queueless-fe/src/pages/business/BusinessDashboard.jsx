import { useCallback, useEffect, useState } from 'react';

import { getQueueStatistics, getQueueTokens } from '../../api/businessApi';

import BusinessServiceSelector from '../../components/business/BusinessServiceSelector';

import './BusinessDashboard.scss';

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
      setStatistics(null);
      setTokens([]);

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
    <div className="business-dashboard">
      <div className="dashboard-header">
        <div>
          <p className="dashboard-eyebrow">BUSINESS</p>
          <h1>Dashboard</h1>
          <p className="dashboard-description">
            Monitor your queue and track customer activity.
          </p>
        </div>

        <div className="queue-status">
          <span
            className={`status-dot status-${queue?.status?.toLowerCase()}`}
          />
          {queue?.status || 'No queue selected'}
        </div>
      </div>

      <div className="service-selector-container">
        <BusinessServiceSelector onQueueChange={handleQueueChange} />
      </div>

      {loading && <div className="dashboard-message">Loading dashboard...</div>}

      {error && <div className="dashboard-error">{error}</div>}

      {!loading && queue && statistics && (
        <>
          <div className="stats-grid">
            <div className="stat-card">
              <span className="stat-label">Total Customers</span>
              <strong className="stat-value">
                {statistics.total_customers}
              </strong>
            </div>

            <div className="stat-card">
              <span className="stat-label">Waiting</span>
              <strong className="stat-value">{waitingCustomers.length}</strong>
            </div>

            <div className="stat-card">
              <span className="stat-label">Completed</span>
              <strong className="stat-value">{statistics.completed}</strong>
            </div>

            <div className="stat-card">
              <span className="stat-label">Cancelled</span>
              <strong className="stat-value">{statistics.cancelled}</strong>
            </div>
          </div>

          <div className="dashboard-content-grid">
            <section className="dashboard-card current-customer-card">
              <div className="card-header">
                <div>
                  <p className="card-eyebrow">NOW SERVING</p>
                  <h2>Current Customer</h2>
                </div>
              </div>

              {currentCustomer ? (
                <div className="current-customer">
                  <div className="token-number">
                    #{currentCustomer.token_number}
                  </div>

                  <div>
                    <h3>{currentCustomer.customer_name}</h3>

                    <p>Serving customer</p>
                  </div>
                </div>
              ) : (
                <div className="empty-state">
                  <p>No customer is currently being served.</p>
                </div>
              )}
            </section>

            <section className="dashboard-card">
              <div className="card-header">
                <div>
                  <p className="card-eyebrow">PERFORMANCE</p>
                  <h2>Queue Performance</h2>
                </div>
              </div>

              <div className="performance-list">
                <div className="performance-row">
                  <span>Average wait time</span>
                  <strong>{statistics.average_wait_time} min</strong>
                </div>

                <div className="performance-row">
                  <span>Average service time</span>
                  <strong>{statistics.average_service_time} min</strong>
                </div>

                <div className="performance-row">
                  <span>Skipped</span>
                  <strong>{statistics.skipped}</strong>
                </div>
              </div>
            </section>
          </div>
        </>
      )}
    </div>
  );
};

export default BusinessDashboard;
