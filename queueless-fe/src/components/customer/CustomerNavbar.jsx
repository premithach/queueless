import { Link, useNavigate } from 'react-router-dom';

import { logout } from '../../utils/auth';

import './CustomerNavbar.scss';

const CustomerNavbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="customer-navbar">
      <Link to="/businesses" className="customer-navbar__brand">
        QueueLess
      </Link>

      <div className="customer-navbar__links">
        <Link to="/businesses">Businesses</Link>

        <Link to="/queue-history">Queue History</Link>

        <button type="button" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
};

export default CustomerNavbar;
