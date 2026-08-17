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
    `${API_BASE_URL}/businesses/${businessId}/services`
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch services');
  }

  return data;
};
