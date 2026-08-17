import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { getTokenStatus, cancelToken } from '../../api/queueApi';

const TokenStatus = () => {
  const { queueId, tokenId } = useParams();

  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadTokenStatus = async () => {
      try {
        const data = await getTokenStatus(queueId, tokenId);

        if (isMounted) {
          setToken(data);
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

    loadTokenStatus();

    return () => {
      isMounted = false;
    };
  }, [queueId, tokenId]);

  if (loading) {
    return <p>Loading token status...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!token) {
    return <p>Token not found.</p>;
  }

  const handleCancelToken = async () => {
    setCancelling(true);
    setError('');

    try {
      const result = await cancelToken(tokenId);

      setToken(result);
    } catch (error) {
      setError(error.message);
    } finally {
      setCancelling(false);
    }
  };

  return (
    <div>
      <h1>Your Queue Token</h1>

      <h2>Token #{token.token_number}</h2>

      <p>Status: {token.status}</p>

      <p>People ahead: {token.people_ahead}</p>

      <p>Estimated wait: {token.estimated_wait_minutes} minutes</p>

      <p>Average service time: {token.average_service_time} minutes</p>

      {token.status === 'WAITING' && (
        <button onClick={handleCancelToken} disabled={cancelling}>
          {cancelling ? 'Leaving Queue...' : 'Leave Queue'}
        </button>
      )}
    </div>
  );
};

export default TokenStatus;
