import { Outlet } from "react-router-dom";

const UserLayout = () => {
  return (
    <div className="user-dashboard__container">
      <Outlet />
    </div>
  );
};

export default UserLayout;
