import { Link, useNavigate } from 'react-router-dom';

import { logout } from '../../utils/auth';

const BusinessNavbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav>
      <Link to="/business/dashboard">QueueLess</Link>

      <div>
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
