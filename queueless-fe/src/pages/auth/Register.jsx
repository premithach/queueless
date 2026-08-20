import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  registerCustomer,
  registerBusiness,
} from '../../api/authApi';

import { getBusinessCategories } from '../../api/businessApi';

import './Register.scss';

const Register = () => {
  const navigate = useNavigate();

  const [accountType, setAccountType] = useState('CUSTOMER');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    businessName: '',
    category: '',
    address: '',
    latitude: '',
    longitude: '',
  });

  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(false);

  const [gettingLocation, setGettingLocation] = useState(false);
  const [locationError, setLocationError] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (accountType !== 'BUSINESS') {
      return;
    }

    let isMounted = true;

    const loadCategories = async () => {
      setLoadingCategories(true);
      setError('');

      try {
        const data = await getBusinessCategories();

        if (!isMounted) {
          return;
        }

        setCategories(data);

        if (data.length > 0) {
          setFormData((current) => ({
            ...current,
            category:
              current.category || data[0].name,
          }));
        }
      } catch (error) {
        if (isMounted) {
          setError(error.message);
        }
      } finally {
        if (isMounted) {
          setLoadingCategories(false);
        }
      }
    };

    loadCategories();

    return () => {
      isMounted = false;
    };
  }, [accountType]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleAccountTypeChange = (type) => {
    setAccountType(type);
    setError('');
    setSuccess('');
    setLocationError('');

    setFormData({
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      businessName: '',
      category: '',
      address: '',
      latitude: '',
      longitude: '',
    });
  };

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setLocationError(
        'Location is not supported by your browser.'
      );
      return;
    }

    setGettingLocation(true);
    setLocationError('');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setFormData((current) => ({
          ...current,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        }));

        setGettingLocation(false);
      },
      (error) => {
        console.error('Location error:', error);

        setLocationError(
          'Unable to get your location. Please allow location access and try again.'
        );

        setGettingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError('');
    setSuccess('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    if (
      accountType === 'BUSINESS' &&
      !formData.latitude &&
      !formData.longitude
    ) {
      setError(
        'Please provide your business location before registering.'
      );
      return;
    }

    setLoading(true);

    try {
      if (accountType === 'CUSTOMER') {
        await registerCustomer(
          formData.name,
          formData.email,
          formData.password
        );

        setSuccess(
          'Customer account created successfully. Redirecting to login...'
        );
      } else {
        await registerBusiness({
          userName: formData.name,
          email: formData.email,
          password: formData.password,
          businessName: formData.businessName,
          category: formData.category,
          address: formData.address,
          latitude: Number(formData.latitude),
          longitude: Number(formData.longitude),
        });

        setSuccess(
          'Business account created successfully. Redirecting to login...'
        );
      }

      setTimeout(() => {
        navigate('/login');
      }, 1000);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register">
      <div className="register__card">
        <div className="register__header">
          <p className="register__eyebrow">QUEUELESS</p>

          <h1>Create your account</h1>

          <p>
            Choose how you want to use QueueLess.
          </p>
        </div>

        <div className="account-type">
          <button
            type="button"
            className={
              accountType === 'CUSTOMER'
                ? 'account-type__option account-type__option--active'
                : 'account-type__option'
            }
            onClick={() =>
              handleAccountTypeChange('CUSTOMER')
            }
          >
            <strong>Customer</strong>

            <span>
              Join queues and track your token
            </span>
          </button>

          <button
            type="button"
            className={
              accountType === 'BUSINESS'
                ? 'account-type__option account-type__option--active'
                : 'account-type__option'
            }
            onClick={() =>
              handleAccountTypeChange('BUSINESS')
            }
          >
            <strong>Business</strong>

            <span>
              Manage services and queues
            </span>
          </button>
        </div>

        <form
          className="register-form"
          onSubmit={handleSubmit}
        >
          <div className="register-form__section">
            <h2>
              {accountType === 'CUSTOMER'
                ? 'Customer details'
                : 'Account details'}
            </h2>

            <div className="form-field">
              <label htmlFor="name">
                {accountType === 'CUSTOMER'
                  ? 'Name'
                  : 'Your name'}
              </label>

              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder={
                  accountType === 'CUSTOMER'
                    ? 'Enter your name'
                    : 'Enter your name'
                }
                required
              />
            </div>

            <div className="form-field">
              <label htmlFor="email">
                Email
              </label>

              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="form-row">
              <div className="form-field">
                <label htmlFor="password">
                  Password
                </label>

                <input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create password"
                  required
                />
              </div>

              <div className="form-field">
                <label htmlFor="confirmPassword">
                  Confirm password
                </label>

                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm password"
                  required
                />
              </div>
            </div>
          </div>

          {accountType === 'BUSINESS' && (
            <div className="register-form__section">
              <h2>Business details</h2>

              <div className="form-field">
                <label htmlFor="businessName">
                  Business name
                </label>

                <input
                  id="businessName"
                  name="businessName"
                  type="text"
                  value={formData.businessName}
                  onChange={handleChange}
                  placeholder="Enter business name"
                  required
                />
              </div>

              <div className="form-field">
                <label htmlFor="category">
                  Business category
                </label>

                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  disabled={loadingCategories}
                  required
                >
                  <option value="">
                    {loadingCategories
                      ? 'Loading categories...'
                      : 'Select category'}
                  </option>

                  {categories.map((category) => (
                    <option
                      key={category.id}
                      value={category.name}
                    >
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-field">
                <label htmlFor="address">
                  Business address
                </label>

                <textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Enter business address"
                  rows="3"
                  required
                />
              </div>

              <div className="location-field">
                <div className="location-field__content">
                  <label>
                    Business location
                  </label>

                  <p>
                    Use your current location so
                    customers can find your business
                    nearby.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleGetLocation}
                  disabled={gettingLocation}
                >
                  {gettingLocation
                    ? 'Detecting location...'
                    : 'Use my current location'}
                </button>

                {locationError && (
                  <span className="location-field__error">
                    {locationError}
                  </span>
                )}

                {formData.latitude &&
                  formData.longitude && (
                    <span className="location-field__success">
                      ✓ Location detected
                    </span>
                  )}
              </div>
            </div>
          )}

          {error && (
            <div className="register-form__error">
              {error}
            </div>
          )}

          {success && (
            <div className="register-form__success">
              {success}
            </div>
          )}

          <button
            type="submit"
            className="register-form__submit"
            disabled={
              loading ||
              loadingCategories ||
              gettingLocation
            }
          >
            {loading
              ? 'Creating account...'
              : accountType === 'CUSTOMER'
                ? 'Create Customer Account'
                : 'Create Business Account'}
          </button>
        </form>

        <div className="register__login">
          <span>
            Already have an account?
          </span>

          <button
            type="button"
            onClick={() => navigate('/login')}
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default Register;
