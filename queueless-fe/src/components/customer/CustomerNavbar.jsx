import { Link, useNavigate } from 'react-router-dom';

import { logout } from '../../utils/auth';

const CustomerNavbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav>
      <Link to="/businesses">QueueLess</Link>

      <div>
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
