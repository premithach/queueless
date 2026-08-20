const API_BASE_URL = 'http://localhost:3000';

export async function loginUser(email, password) {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      password,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Login failed');
  }

  return data;
}

export async function registerCustomer(name, email, password) {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name,
      email,
      password,
      role: 'CUSTOMER',
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Customer registration failed');
  }

  return data;
}

export async function registerBusiness({
  userName,
  email,
  password,
  businessName,
  category,
  address,
  latitude,
  longitude,
}) {
  const response = await fetch(`${API_BASE_URL}/auth/register-business`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      userName,
      email,
      password,
      businessName,
      category,
      address,
      latitude,
      longitude,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Business registration failed');
  }

  return data;
}

// export async function getBusinessCategories() {
//   const response = await fetch(
//     `${API_BASE_URL}/businesses/categories`
//   );

//   const data = await response.json();

//   if (!response.ok) {
//     throw new Error(
//       data.message || 'Failed to fetch business categories'
//     );
//   }

//   return data;
// }
