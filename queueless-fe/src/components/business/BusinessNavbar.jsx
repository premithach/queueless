import { Link, useNavigate } from 'react-router-dom';

import { logout } from '../../utils/auth';

import './BusinessNavbar.scss';

const BusinessNavbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="business-navbar">
      <Link to="/business/dashboard" className="business-navbar__brand">
        QueueLess
      </Link>

      <div className="business-navbar__links">
        <Link to="/business/dashboard">Dashboard</Link>

        <Link to="/business/queue">Queue</Link>

        <Link to="/business/queue-history">Queue History</Link>

        <Link to="/business/statistics">Statistics</Link>

        <button type="button" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
};

export default BusinessNavbar;
