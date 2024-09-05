

export const ROLES = {
  ADMIN: "admin",
  STUDENT: "student",
  INSTRUCTOR: "instructor",
};

export const ERROR = {
  ERROR500: '/500',
  ERROR403: '/403',
  ERROR404: '/404',
};
export const ADMIN = {
  REQUEST_MANAGEMENT: '/request-management',
  DISPLAY_ACCOUNT: '/display-account',
  CREATE_ACCOUNT: '/create-account',
  CATEGORY: '/categories',
  PENDING_COURSE: '/pending-courses',
  LOG_COURSE: '/log-course',
  PURCHASE: '/purchase',
  BLOG: '/blog',
  PAYOUT_MANAGEMENT: '/payout-management',
  DASHBOARD_ADMIN: '/dashboard-admin'
}
export const INSTRUCTOR = {
  COURSE: '/courses',
  LIST_SUBSCRIPTION: '/list-subscription',
  VIEW_ALL_COURSE: '/view-all-course',
  VIEW_MY_PROFILE: '/view-my-profile',
  VIEW_PROFILE: '/view-profile/:id',
  COURSE_SOLD: '/courses-sold',
  REVIEW: '/review',
  PAYOUT: '/payout',
  TRANSACTION_DETAIL: '/transaction/:id',
  DASHBOARD_INSTRUCTOR: '/dashboard-instructor'
};
export const PUBLIC = {
  HOME: '/homepage',
  VIEW_ALL_COURSE_HP: '/homepage/view-all-course',
  COURSE_DETAIL: '/course-detail/:id',
  LOGOUT: '/logout',
  ANOTHER_PAGE: '/another-page',
  LOGIN: '/login',
  REGISTER: '/register',
  SETTING_PAGE: '/setting-page',
  VERIFY_EMAIL: '/verify-email/:token',
  FORGOT_PASSWORD: '/forgot-password',
  LIST_SUBSCRIBED: '/list-subscribed',
  SUBCRIPTION: '/subcription',
  VIEW_CART: '/view-cart',
  PAYMENT: '/payment',
  VIEW_ORDER: '/view-order',
  LEARN_COURSE: '/learn-course-detail/:id/lesson/:lessonId',
  BLOG_DETAIL: '/blog-detail/:id',
  DASHBOARD_STUDENT: '/dashboard-student'
};

export const SidebarIntructorData = {
  insSidebarItem: [
    { text: "Dashboard", icon: "AppstoreOutlined", url: "/dashboard-instructor" },
    { text: "Manage Course", icon: "BookOutlined", url: "/courses" },
    { text: "Course Log", icon: "BookOutlined", url: "/log-course" },
    { text: "Sales History", icon: "ShoppingCartOutlined", url: "/courses-sold" },
    { text: "Payout", icon: "TransactionOutlined", url: "/payout" },
    { text: "Order", icon: "FileTextOutlined", url: "/view-order" },
    { text: "Subscription", icon: "BellOutlined", url: "/list-subscription" },
    { text: "Review", icon: "StarOutlined", url: "/review" },
    { text: "Setting", icon: "SettingOutlined", url: "/setting-page" }

  ]
};

export const SidebarStudentData = {
  studentSidebarItem: [
    { text: "Dashboard", icon: "FaDashboard", url: "/dashboard-student" },
    { text: "Order", icon: "FaBill", url: "/view-order" },
    { text: "Subscription", icon: "FaBell", url: "/list-subscribed" },
    { text: "Setting", icon: "FaCogs", url: "/setting-page" },
  ]
};

export const SidebarAdminData = {
  menuItems: [
    { "key": "/dashboard-admin", "label": "Dashboard", "icon": "AppstoreOutlined" },
    { "key": "/display-account", "label": "User Management", "icon": "TeamOutlined" },
    { "key": "/request-management", "label": "Request Management", "icon": "TeamOutlined" },
    { "key": "/categories", "label": "Category Management", "icon": "TagsOutlined" },
    { "key": "/payout-management", "label": "Payout Management", "icon": "FileTextOutlined" },
    { "key": "/blog", "label": "Blog Management", "icon": "MessageOutlined" },
    { "key": "/view-all-course", "label": "All Courses", "icon": "BookOutlined" },
    { "key": "/pending-courses", "label": "Pending Courses", "icon": "BookOutlined" },
    { "key": "/log-course", "label": "Course Log", "icon": "BookOutlined" },
    { "key": "/purchase", "label": "Purchase Log", "icon": "ShoppingCartOutlined" },

  ]
};
export const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
};