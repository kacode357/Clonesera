import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LayoutRoute from '../layout/LayoutRoute';
import LayoutNoSidebar from '../layout/LayoutNoSidebar';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PrivateRoute from './PrivateRoute';
import { ROLES } from '../utils/commonImports';
import { ADMIN, ERROR, INSTRUCTOR, PUBLIC } from '../consts';


const HomePage = lazy(() => import('../pages/HomePage'));
const Login = lazy(() => import('../pages/Login'));
const Logout = lazy(() => import('../components/Logout'));
const Register = lazy(() => import('../pages/Register'));
const Category = lazy(() => import('../pages/Admin/Category'));
const Blog = lazy(() => import('../pages/Admin/Blog'));
const BlogDetail = lazy(() => import('../pages/BlogDetail'));
const ViewAllCourseHomePage = lazy(() => import('../components/ViewAllCourse/AllCourse'));
const SettingPage = lazy(() => import('../pages/SettingPage'));
const Course = lazy(() => import('../pages/Instructor/ManagementCourse'));
const CourseSold = lazy(() => import('../pages/CourseSold'));
const Payout = lazy(() => import('../pages/Instructor/Payout'));
const Purchase = lazy(() => import('../pages/Admin/Purchase'));
const VerifyEmail = lazy(() => import('../components/VerifyEmailDone'));
const ForgotPassword = lazy(() => import('../pages/ForgotPassword'));
const RequestManagement = lazy(() => import('../pages/RequestManagement'));
const ListSubscription = lazy(() => import('../pages/Instructor/ListSubscription'));
const LearnCourseDetail = lazy(() => import('../pages/LearnCourseDetail'));
const ReViewInstructor = lazy(() => import('../pages/Instructor/ViewReview'));
const ListSubscribed = lazy(() => import('../pages/Student/ListSubscribed'));
const DisplayAccount = lazy(() => import('../components/Admin/AccoutUser/ActiveTab'));
const CreateAccount = lazy(() => import('../components/Admin/CreateAccount/CreateAccount'));
const CourseDetails = lazy(() => import('../pages/CourseDetails'));
const LogCourse = lazy(() => import('../components/Admin/LogCourse/LogCourse'));
const PedingCourse = lazy(() => import('../pages/Admin/PedingCourse'));
const ViewAllCourse = lazy(() => import('../pages/Instructor/ViewAllCourse'));
const ViewProfile = lazy(() => import('../components/ViewProfile/ViewProfile'));
const ViewCart = lazy(() => import('../pages/ViewCart'));
const ViewOrder = lazy(() => import('../pages/ViewOrder'));
const Payment = lazy(() => import('../pages/Payment'));
const PayoutManagement = lazy(() => import('../pages/Admin/PayoutManagement'));
const DashboardAdmin = lazy(() => import('../pages/Admin/DashboardAdmin'));
const InstructorDashboard = lazy(() => import('../pages/Instructor/DashboardInstructor'));
const DashboardStudent = lazy(() => import('../pages/Student/DashboardStudent'));
// const TransactionDetail = lazy(() => import('../pages/TransactionDetail'));
const PageError404 = lazy(() => import('../pages/Error/PageError404'));
const PageError500 = lazy(() => import('../pages/Error/PageError500'));
const PageError403 = lazy(() => import('../pages/Error/PageError403'));

const AppRouter: React.FC = () => {
    return (
        <Router>
       
            <Suspense>
                <Routes>
                    <Route path="/" element={<Navigate to="/homepage" />} />

                    {/* Public Routes with MainLayout */}
                    <Route element={<LayoutRoute />}>
                        <Route path={PUBLIC.VIEW_CART} element={<ViewCart />} />
                        <Route path={PUBLIC.VIEW_ORDER} element={<ViewOrder />} />
                        <Route path={PUBLIC.PAYMENT} element={<Payment />} />
                        <Route path={PUBLIC.SETTING_PAGE} element={<SettingPage />} />
                        <Route path={PUBLIC.LIST_SUBSCRIBED} element={<PrivateRoute element={ListSubscribed} allowedRoles={[ROLES.STUDENT]} />} />
                        <Route path={PUBLIC.DASHBOARD_STUDENT} element={<PrivateRoute element={DashboardStudent} allowedRoles={[ROLES.STUDENT]} />} />
                    </Route>

                    {/* Instructor Routes with MainLayout */}
                    <Route element={<LayoutRoute />}>
                        <Route path={INSTRUCTOR.COURSE} element={<PrivateRoute element={Course} allowedRoles={[ROLES.INSTRUCTOR]} />} />
                        <Route path={INSTRUCTOR.DASHBOARD_INSTRUCTOR} element={<PrivateRoute element={InstructorDashboard} allowedRoles={[ROLES.INSTRUCTOR]} />} />
                        <Route path={INSTRUCTOR.VIEW_PROFILE} element={<ViewProfile/>} />
                        <Route path={INSTRUCTOR.LIST_SUBSCRIPTION} element={<PrivateRoute element={ListSubscription} allowedRoles={[ROLES.INSTRUCTOR]} />} />
                        <Route path={INSTRUCTOR.REVIEW} element={<PrivateRoute element={ReViewInstructor} allowedRoles={[ROLES.INSTRUCTOR]} />} />
                        <Route path={INSTRUCTOR.COURSE_SOLD} element={<PrivateRoute element={CourseSold} allowedRoles={[ROLES.INSTRUCTOR]} />} />
                        <Route path={INSTRUCTOR.PAYOUT} element={<PrivateRoute element={Payout} allowedRoles={[ROLES.INSTRUCTOR]} />} />
                        <Route path={INSTRUCTOR.VIEW_ALL_COURSE} element={<PrivateRoute element={ViewAllCourse} allowedRoles={[ROLES.INSTRUCTOR, ROLES.ADMIN]} />} />
                        {/* <Route path={INSTRUCTOR.TRANSACTION_DETAIL} element={<PrivateRoute element={TransactionDetail} allowedRoles={[ROLES.INSTRUCTOR, ROLES.ADMIN]} />} /> */}
                    </Route>

                    {/* Admin Routes with MainLayout */}
                    <Route element={<LayoutRoute />}>
                        <Route path={ADMIN.PURCHASE} element={<PrivateRoute element={Purchase} allowedRoles={[ROLES.ADMIN]} />} />
                        <Route path={ADMIN.REQUEST_MANAGEMENT} element={<PrivateRoute element={RequestManagement} allowedRoles={[ROLES.ADMIN]} />} />
                        <Route path={ADMIN.DISPLAY_ACCOUNT} element={<PrivateRoute element={DisplayAccount} allowedRoles={[ROLES.ADMIN]} />} />
                        <Route path={ADMIN.CREATE_ACCOUNT} element={<PrivateRoute element={CreateAccount} allowedRoles={[ROLES.ADMIN]} />} />
                        <Route path={ADMIN.CATEGORY} element={<PrivateRoute element={Category} allowedRoles={[ROLES.ADMIN]} />} />
                        <Route path={ADMIN.PENDING_COURSE} element={<PrivateRoute element={PedingCourse} allowedRoles={[ROLES.ADMIN]} />} />
                        <Route path={ADMIN.LOG_COURSE} element={<PrivateRoute element={LogCourse} allowedRoles={[ROLES.ADMIN, ROLES.INSTRUCTOR]} />} />
                        <Route path={ADMIN.BLOG} element={<PrivateRoute element={Blog} allowedRoles={[ROLES.ADMIN]} />} />
                        <Route path={ADMIN.PAYOUT_MANAGEMENT} element={<PrivateRoute element={PayoutManagement} allowedRoles={[ROLES.ADMIN]} />} />
                        <Route path={ADMIN.DASHBOARD_ADMIN} element={<PrivateRoute element={DashboardAdmin} allowedRoles={[ROLES.ADMIN]} />} />
                    </Route>

                    {/* Routes with No Sidebar Layout */}
                    <Route element={<LayoutNoSidebar />}>
                        <Route path={PUBLIC.HOME} element={<HomePage />} />
                        <Route path={PUBLIC.VIEW_ALL_COURSE_HP} element={<ViewAllCourseHomePage />} />
                        <Route path={PUBLIC.LEARN_COURSE} element={<LearnCourseDetail />} />
                        <Route path={PUBLIC.COURSE_DETAIL} element={<CourseDetails />} />
                        <Route path={PUBLIC.BLOG_DETAIL} element={<BlogDetail />} />
                    </Route>

                    {/* Error Routes */}
                    {/* <Route path={INSTRUCTOR.VIEW_PROFILE} element={<ViewProfile />} /> */}
                    <Route path={PUBLIC.LOGIN} element={<Login />} />
                    <Route path={PUBLIC.LOGOUT} element={<Logout />} />
                    <Route path={PUBLIC.REGISTER} element={<Register />} />
                    <Route path={PUBLIC.VERIFY_EMAIL} element={<VerifyEmail />} />
                    <Route path={PUBLIC.FORGOT_PASSWORD} element={<ForgotPassword />} />
                    <Route path={ERROR.ERROR403} element={<PageError403 />} />
                    <Route path={ERROR.ERROR404} element={<PageError404 />} />
                    <Route path={ERROR.ERROR500} element={<PageError500 />} />
                </Routes>
            </Suspense>
            <ToastContainer />
        </Router>
    );
}

export default AppRouter;
