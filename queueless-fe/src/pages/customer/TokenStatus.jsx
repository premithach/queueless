import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { getTokenStatus, cancelToken } from '../../api/queueApi';

import './TokenStatus.scss';

const TokenStatus = () => {
  const { queueId, tokenId } = useParams();

  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    let isMounted = true;
    let intervalId;

    const loadTokenStatus = async (showLoading = false) => {
      if (showLoading) {
        setLoading(true);
      }

      try {
        const data = await getTokenStatus(queueId, tokenId);

        if (!isMounted) {
          return;
        }

        setToken(data);
        setError('');

        /*
         * Keep polling only while the token is active.
         */
        if (data.status !== 'WAITING' && data.status !== 'SERVING') {
          clearInterval(intervalId);
        }
      } catch (error) {
        if (isMounted) {
          setError(error.message);
        }
      } finally {
        if (isMounted && showLoading) {
          setLoading(false);
        }
      }
    };

    loadTokenStatus(true);

    intervalId = setInterval(() => {
      loadTokenStatus(false);
    }, 10000);

    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, [queueId, tokenId]);

  const handleCancelToken = async () => {
    setCancelling(true);
    setError('');

    try {
      const result = await cancelToken(tokenId);

      setToken((previousToken) => ({
        ...previousToken,
        ...result,
        business_name: previousToken?.business_name,
        service_name: previousToken?.service_name,
      }));
    } catch (error) {
      setError(error.message);
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return (
      <div className="token-status">
        <div className="token-status__message">Loading token status...</div>
      </div>
    );
  }

  if (error && !token) {
    return (
      <div className="token-status">
        <div className="token-status__error">{error}</div>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="token-status">
        <div className="token-status__message">Token not found.</div>
      </div>
    );
  }

  const statusClass = token.status.toLowerCase();

  return (
    <div className="token-status">
      <div className="token-status__header">
        <p className="token-status__eyebrow">YOUR QUEUE</p>

        <h1>{token.business_name}</h1>

        <p className="token-status__service">{token.service_name}</p>

        <p className="token-status__description">
          Track your position and estimated waiting time.
        </p>
      </div>

      {error && <div className="token-status__error">{error}</div>}

      <section className="token-card">
        <div className="token-card__top">
          <div className="token-card__number">
            <span>Token</span>

            <strong>#{token.token_number}</strong>
          </div>

          <span
            className={`token-card__status token-card__status--${statusClass}`}
          >
            <span className="status-dot" />

            {token.status}
          </span>
        </div>

        {token.status === 'WAITING' && (
          <>
            <div className="queue-position">
              <span className="queue-position__label">People ahead</span>

              <strong className="queue-position__value">
                {token.people_ahead}
              </strong>
            </div>

            <div className="token-card__stats">
              <div className="stat-item">
                <span>Estimated wait</span>

                <strong>{token.estimated_wait_minutes} min</strong>
              </div>

              <div className="stat-item">
                <span>Average service time</span>

                <strong>{token.average_service_time} min</strong>
              </div>
            </div>

            <div className="token-card__info">
              <p>Please stay nearby. We'll notify you when it's your turn.</p>
            </div>

            <button
              type="button"
              className="leave-queue-button"
              onClick={handleCancelToken}
              disabled={cancelling}
            >
              {cancelling ? 'Leaving Queue...' : 'Leave Queue'}
            </button>
          </>
        )}

        {token.status === 'SERVING' && (
          <div className="serving-state">
            <div className="serving-state__icon">✓</div>

            <h2>It's your turn!</h2>

            <p>Please proceed to the {token.service_name} counter.</p>
          </div>
        )}

        {token.status === 'COMPLETED' && (
          <div className="completed-state">
            <div className="completed-state__icon">✓</div>

            <h2>Service completed</h2>

            <p>Your visit has been completed successfully.</p>
          </div>
        )}

        {token.status === 'CANCELLED' && (
          <div className="cancelled-state">
            <div className="cancelled-state__icon">×</div>

            <h2>Queue left</h2>

            <p>You are no longer in this queue.</p>
          </div>
        )}

        {token.status === 'SKIPPED' && (
          <div className="skipped-state">
            <div className="skipped-state__icon">!</div>

            <h2>Token skipped</h2>

            <p>This token was skipped by the business.</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default TokenStatus;
