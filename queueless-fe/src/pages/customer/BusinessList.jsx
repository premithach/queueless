import { useEffect, useState } from 'react';

import {
  getBusinesses,
  getBusinessesByCategory,
  searchBusinesses,
  getNearbyBusinesses,
} from '../../api/businessApi';
import { useNavigate } from 'react-router-dom';

const BusinessList = () => {
  const navigate = useNavigate();
  const [businesses, setBusinesses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    getBusinesses()
      .then((data) => {
        if (isMounted) {
          setBusinesses(data);
        }
      })
      .catch((error) => {
        if (isMounted) {
          setError(error.message);
        }
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleSearch = async (event) => {
    event.preventDefault();

    setLoading(true);
    setError('');

    try {
      const data = searchTerm.trim()
        ? await searchBusinesses(searchTerm.trim())
        : await getBusinesses();

      setBusinesses(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = async (event) => {
    const selectedCategory = event.target.value;

    setCategory(selectedCategory);
    setSearchTerm('');
    setLoading(true);
    setError('');

    try {
      const data = selectedCategory
        ? await getBusinessesByCategory(selectedCategory)
        : await getBusinesses();

      setBusinesses(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleNearbyBusinesses = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      return;
    }

    setLoading(true);
    setError('');

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;

          const data = await getNearbyBusinesses(latitude, longitude);

          setBusinesses(data);
          setCategory('');
          setSearchTerm('');
        } catch (error) {
          setError(error.message);
        } finally {
          setLoading(false);
        }
      },
      () => {
        setError('Unable to get your location. Please allow location access.');
        setLoading(false);
      }
    );
  };

  return (
    <div>
      <h1>Discover Businesses</h1>

      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          placeholder="Search businesses"
        />

        <button type="submit">Search</button>

        <button type="button" onClick={handleNearbyBusinesses}>
          Find Nearby Businesses
        </button>
      </form>

      <div>
        <label htmlFor="category">Category:</label>

        <select id="category" value={category} onChange={handleCategoryChange}>
          <option value="">All</option>
          <option value="Hospital">Hospital</option>
          <option value="Bank">Bank</option>
          <option value="Salon">Salon</option>
        </select>
      </div>

      {loading && <p>Loading businesses...</p>}

      {error && <p>{error}</p>}

      {!loading && !error && businesses.length === 0 && (
        <p>No businesses found.</p>
      )}

      <div>
        {businesses.map((business) => (
          <div key={business.id}>
            <h2>{business.name}</h2>

            <p>Category: {business.category}</p>

            <p>Address: {business.address}</p>

            <button onClick={() => navigate(`/businesses/${business.id}`)}>
              View Details
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BusinessList;
