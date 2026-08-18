import { Outlet } from 'react-router-dom';

import BusinessNavbar from './BusinessNavbar';

const BusinessLayout = () => {
  return (
    <>
      <BusinessNavbar />

      <main>
        <Outlet />
      </main>
    </>
  );
};

export default BusinessLayout;
