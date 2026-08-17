import { Outlet } from 'react-router-dom';

import CustomerNavbar from './CustomerNavbar';

const CustomerLayout = () => {
  return (
    <>
      <CustomerNavbar />

      <main>
        <Outlet />
      </main>
    </>
  );
};

export default CustomerLayout;
