import { Outlet } from "react-router-dom";

const AdminLayout = () => {
  return (
    <div className="admin-dashboard__container">
      <Outlet />
    </div>
  );
};

export default AdminLayout;
