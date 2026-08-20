import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  getBusinesses,
  getBusinessesByCategory,
  searchBusinesses,
} from '../../api/businessApi';

import './BusinessList.scss';

const categories = ['All', 'Hospital', 'Clinic', 'Salon', 'Restaurant', 'Bank'];

const BusinessList = () => {
  const navigate = useNavigate();
  const [businesses, setBusinesses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadBusinesses = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      let data;

      if (searchTerm.trim()) {
        data = await searchBusinesses(searchTerm.trim());
      } else if (selectedCategory !== 'All') {
        data = await getBusinessesByCategory(selectedCategory);
      } else {
        data = await getBusinesses();
      }

      setBusinesses(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, selectedCategory]);

  useEffect(() => {
    loadBusinesses();
  }, [loadBusinesses]);

  const handleSearch = (event) => {
    event.preventDefault();
    loadBusinesses();
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  return (
    <div className="business-list">
      <div className="business-list__header">
        <div>
          <p className="business-list__eyebrow">QUEUELESS</p>

          <h1>Find a Business</h1>

          <p className="business-list__description">
            Find a nearby business and join their queue.
          </p>
        </div>
      </div>

      <form className="business-list__search" onSubmit={handleSearch}>
        <input
          type="text"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          placeholder="Search businesses..."
        />

        <button type="submit">Search</button>
      </form>

      <div className="business-list__categories">
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            className={
              selectedCategory === category
                ? 'category-button category-button--active'
                : 'category-button'
            }
            onClick={() => handleCategoryChange(category)}
          >
            {category}
          </button>
        ))}
      </div>

      {loading && (
        <div className="business-list__message">Loading businesses...</div>
      )}

      {error && <div className="business-list__error">{error}</div>}

      {!loading && !error && businesses.length === 0 && (
        <div className="business-list__empty">
          <h2>No businesses found</h2>

          <p>Try a different search or category.</p>
        </div>
      )}

      {!loading && !error && businesses.length > 0 && (
        <div className="business-list__grid">
          {businesses.map((business) => (
            <article key={business.id} className="business-card">
              <div className="business-card__content">
                <div className="business-card__icon">
                  {business.name?.charAt(0).toUpperCase()}
                </div>

                <div className="business-card__info">
                  <h2>{business.name}</h2>

                  {business.category && (
                    <span className="business-card__category">
                      {business.category}
                    </span>
                  )}
                </div>
              </div>

              {business.description && (
                <p className="business-card__description">
                  {business.description}
                </p>
              )}

              <div className="business-card__footer">
                {business.address && <span>{business.address}</span>}

                <button
                  type="button"
                  onClick={() => navigate(`/businesses/${business.id}`)}
                >
                  View Business
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

export default BusinessList;
