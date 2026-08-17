const API_BASE_URL = 'http://localhost:3000';

export const getQueueByService = async (serviceId) => {
  const response = await fetch(`${API_BASE_URL}/services/${serviceId}/queue`);

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch service queue');
  }

  return data;
};

export const joinQueue = async (queueId) => {
  const authData = JSON.parse(localStorage.getItem('queueless_auth'));

  const response = await fetch(`${API_BASE_URL}/queues/${queueId}/join`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${authData?.token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to join queue');
  }

  return data;
};

export const getTokenStatus = async (queueId, tokenId) => {
  const response = await fetch(
    `${API_BASE_URL}/queues/${queueId}/tokens/${tokenId}/status`
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch token status');
  }

  return data;
};

export const cancelToken = async (tokenId) => {
  const authData = JSON.parse(localStorage.getItem('queueless_auth'));

  const response = await fetch(`${API_BASE_URL}/tokens/${tokenId}/cancel`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${authData?.token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to cancel token');
  }

  return data;
};

export const getQueueHistory = async () => {
  const authData = JSON.parse(localStorage.getItem('queueless_auth'));

  const response = await fetch(`${API_BASE_URL}/users/me/queue-history`, {
    headers: {
      Authorization: `Bearer ${authData?.token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch queue history');
  }

  return data;
};
