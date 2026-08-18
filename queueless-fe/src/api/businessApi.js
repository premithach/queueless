const API_BASE_URL = 'http://localhost:3000';

export const getBusinesses = async () => {
  const response = await fetch(`${API_BASE_URL}/businesses`);

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch businesses');
  }

  return data;
};

export const searchBusinesses = async (searchTerm) => {
  const params = new URLSearchParams({
    search_term: searchTerm,
  });

  const response = await fetch(
    `${API_BASE_URL}/businesses/search?${params.toString()}`
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to search businesses');
  }

  return data;
};

export const getBusinessesByCategory = async (category) => {
  const params = new URLSearchParams({
    category,
  });

  const response = await fetch(
    `${API_BASE_URL}/businesses?${params.toString()}`
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to filter businesses');
  }

  return data;
};

export const getNearbyBusinesses = async (latitude, longitude, radius = 5) => {
  const params = new URLSearchParams({
    latitude,
    longitude,
    radius,
  });

  const response = await fetch(
    `${API_BASE_URL}/businesses/nearby?${params.toString()}`
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch nearby businesses');
  }

  return data;
};

export const getBusinessById = async (businessId) => {
  const response = await fetch(`${API_BASE_URL}/businesses/${businessId}`);

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch business');
  }

  return data;
};

export const getBusinessServices = async (businessId) => {
  const response = await fetch(
    `${API_BASE_URL}/businesses/${businessId}/services`,
    {
      headers: getAuthHeaders(),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch business services');
  }

  return data;
};

const getAuthHeaders = () => {
  const authData = JSON.parse(localStorage.getItem('queueless_auth'));

  return {
    Authorization: `Bearer ${authData?.token}`,
  };
};

export const getQueueTokens = async (queueId) => {
  const response = await fetch(`${API_BASE_URL}/queues/${queueId}/tokens`, {
    headers: getAuthHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch queue customers');
  }

  return data;
};

export const callNextCustomer = async (queueId) => {
  const response = await fetch(`${API_BASE_URL}/queues/${queueId}/next`, {
    method: 'POST',
    headers: getAuthHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to call next customer');
  }

  return data;
};

export const completeCurrentCustomer = async (queueId) => {
  const response = await fetch(`${API_BASE_URL}/queues/${queueId}/complete`, {
    method: 'POST',
    headers: getAuthHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to complete customer');
  }

  return data;
};

export const skipCurrentCustomer = async (queueId) => {
  const response = await fetch(`${API_BASE_URL}/queues/${queueId}/skip`, {
    method: 'POST',
    headers: getAuthHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to skip customer');
  }

  return data;
};

export const cancelCurrentCustomer = async (queueId) => {
  const response = await fetch(`${API_BASE_URL}/queues/${queueId}/cancel`, {
    method: 'POST',
    headers: getAuthHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to cancel customer');
  }

  return data;
};

export const updateQueueStatus = async (queueId, status) => {
  const response = await fetch(`${API_BASE_URL}/queues/${queueId}`, {
    method: 'PATCH',
    headers: {
      ...getAuthHeaders(),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      status,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to update queue status');
  }

  return data;
};

export const getQueueHistory = async (queueId) => {
  const response = await fetch(`${API_BASE_URL}/queues/${queueId}/history`, {
    headers: getAuthHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch queue history');
  }

  return data;
};

export const getQueueStatistics = async (queueId) => {
  const response = await fetch(`${API_BASE_URL}/queues/${queueId}/statistics`, {
    headers: getAuthHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch queue statistics');
  }

  return data;
};

export const getServiceQueue = async (serviceId) => {
  const response = await fetch(`${API_BASE_URL}/services/${serviceId}/queue`, {
    headers: getAuthHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch service queue');
  }

  return data;
};
