import { Routes, Route } from "react-router-dom";
import AuthLayout from "./layouts/AuthLayout";
import UserLayout from "./layouts/UserLayout";
import AdminLayout from "./layouts/AdminLayout";
import PublicLayout from "./layouts/PublicLayout";

import Register from "./features/auth/Register";
import Login from "./features/auth/Login";
import Home from "./features/public/Home";
import TermsAndConditions from "./features/public/TermsAndConditions";
import Error404 from "./features/public/Error404";

import UserDashboard from "./features/user/Dashboard";

const App = () => {
    return (
        <>
            <Routes>
                <Route path="/" element={<PublicLayout />}>
                    <Route index element={<Home />} />
                    <Route
                        path="terms-and-conditions"
                        element={<TermsAndConditions />}
                    />
                </Route>
                {/* End public routes*/}
                <Route path="/auth" element={<AuthLayout />}>
                    <Route path="login" index element={<Login />} />
                    <Route path="register" element={<Register />} />
                    {/* End auth routes*/}
                </Route>
                <Route path="/user" element={<UserLayout />}>
                    <Route index path="dashboard" element={<UserDashboard />} />
                </Route>
                {/* End user routes*/}
                <Route path="/admin" element={<AdminLayout />}></Route>
                {/* End admin routes*/}
                <Route path="*" element={<Error404 />} />
            </Routes>
        </>
    );
};

export default App;
