import { lazy, Suspense } from "react";
import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";

// Layouts
const MainLayout = lazy(() => import("@layouts/MainLayout"));
const ProfileLayout = lazy(() => import("@layouts/ProfileLayout/ProfileLayout"));

// Pages
const Home = lazy(() => import("@pages/home/Home"));
const Categories = lazy(() => import("@pages/category/Categories"));
const Products = lazy(() => import("@pages/products/Products"));
const Offers = lazy(() => import("@pages/offers/Offers"));
const Cart = lazy(() => import("@pages/cart/Cart"));
const WishList = lazy(() => import("@pages/wishlist/WishList"));
const Login = lazy(() => import("@pages/login/Login"));
const Register = lazy(() => import("@pages/signup/Register"));
const ForgotPassword = lazy(() => import("@pages/auth/ForgotPassword"));
const ResetPassword = lazy(() => import("@pages/auth/ResetPassword"));
const Search = lazy(() => import("@pages/search/Search"));
const Account = lazy(() => import("@pages/account/Account"));
const Orders = lazy(() => import("@pages/orders/Orders"));
const Admin = lazy(() => import("@pages/admin/Admin"));
const ProductDetails = lazy(() => import("@pages/productDetails/ProductDetails"));
const PrivacyPolicy = lazy(() => import("@pages/info/PrivacyPolicy"));
const TermsConditions = lazy(() => import("@pages/info/TermsConditions"));
const ContactUs = lazy(() => import("@pages/info/ContactUs"));
import Error from "@pages/Error";

// Components & Helpers
import PageSuspenseFallback from "@components/feedback/PageSuspenseFallback/PageSuspenseFallback";
import ProtectedRoute from "@components/Auth/ProtectedRoute";
import { ToastList } from "@components/feedback";

// Sleek full-page loader for main layout suspense
const FullPageSpinner = () => (
  <div className="flex min-h-screen w-full items-center justify-center bg-slate-950 font-sans text-slate-100">
    <div className="flex flex-col items-center gap-4">
      <div className="relative flex h-14 w-14 items-center justify-center">
        <div className="absolute inset-0 rounded-full border-2 border-blue-500/20 animate-ping" />
        <div className="h-10 w-10 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
      </div>
      <p className="text-xs font-medium tracking-wide text-slate-400">Loading experience...</p>
    </div>
  </div>
);

const router = createBrowserRouter([
  // Standalone Admin Dashboard (Isolated from public storefront header & footer)
  {
    path: "/admin",
    element: (
      <ProtectedRoute requireAdmin>
        <PageSuspenseFallback>
          <Admin />
        </PageSuspenseFallback>
      </ProtectedRoute>
    ),
    errorElement: (
      <PageSuspenseFallback>
        <Error />
      </PageSuspenseFallback>
    ),
  },

  // Standalone Auth Pages (Without Header & Footer)
  {
    path: "/login",
    element: (
      <>
        <PageSuspenseFallback>
          <Login />
        </PageSuspenseFallback>
        <ToastList />
      </>
    ),
    errorElement: (
      <PageSuspenseFallback>
        <Error />
      </PageSuspenseFallback>
    ),
  },
  {
    path: "/register",
    element: (
      <>
        <PageSuspenseFallback>
          <Register />
        </PageSuspenseFallback>
        <ToastList />
      </>
    ),
    errorElement: (
      <PageSuspenseFallback>
        <Error />
      </PageSuspenseFallback>
    ),
  },
  {
    path: "/forgot-password",
    element: (
      <>
        <PageSuspenseFallback>
          <ForgotPassword />
        </PageSuspenseFallback>
        <ToastList />
      </>
    ),
    errorElement: (
      <PageSuspenseFallback>
        <Error />
      </PageSuspenseFallback>
    ),
  },
  {
    path: "/reset-password",
    element: (
      <>
        <PageSuspenseFallback>
          <ResetPassword />
        </PageSuspenseFallback>
        <ToastList />
      </>
    ),
    errorElement: (
      <PageSuspenseFallback>
        <Error />
      </PageSuspenseFallback>
    ),
  },

  // Public Storefront (with MainLayout Header & Footer)
  {
    path: "/",
    element: (
      <Suspense fallback={<FullPageSpinner />}>
        <MainLayout />
      </Suspense>
    ),
    errorElement: (
      <PageSuspenseFallback>
        <Error />
      </PageSuspenseFallback>
    ),
    children: [
      {
        index: true,
        element: (
          <PageSuspenseFallback>
            <Home />
          </PageSuspenseFallback>
        ),
      },
      {
        path: "categories",
        element: (
          <PageSuspenseFallback>
            <Categories />
          </PageSuspenseFallback>
        ),
      },
      {
        path: "categories/products/:prefix",
        element: (
          <PageSuspenseFallback>
            <Products />
          </PageSuspenseFallback>
        ),
        loader: ({ params }) => {
          if (
            typeof params.prefix !== "string" ||
            !/^[a-z]+$/i.test(params.prefix)
          ) {
            throw new Response("Bad Request", {
              statusText: "Category not found",
              status: 400,
            });
          }
          return true;
        },
      },
      {
        path: "product/:id",
        element: (
          <PageSuspenseFallback>
            <ProductDetails />
          </PageSuspenseFallback>
        ),
      },
      {
        path: "products/:id",
        element: (
          <PageSuspenseFallback>
            <ProductDetails />
          </PageSuspenseFallback>
        ),
      },
      {
        path: "offers",
        element: (
          <PageSuspenseFallback>
            <Offers />
          </PageSuspenseFallback>
        ),
      },
      {
        path: "cart",
        element: (
          <PageSuspenseFallback>
            <Cart />
          </PageSuspenseFallback>
        ),
      },
      {
        path: "wishlist",
        element: (
          <ProtectedRoute>
            <PageSuspenseFallback>
              <WishList />
            </PageSuspenseFallback>
          </ProtectedRoute>
        ),
      },
      {
        path: "search",
        element: (
          <PageSuspenseFallback>
            <Search />
          </PageSuspenseFallback>
        ),
      },
      // Backward compatibility for capitalized "Search"
      {
        path: "Search",
        element: <Navigate to="/search" replace />,
      },
      // Direct access to Orders / Order History
      {
        path: "orders",
        element: <Navigate to="/profile/orders" replace />,
      },
      {
        path: "privacy",
        element: (
          <PageSuspenseFallback>
            <PrivacyPolicy />
          </PageSuspenseFallback>
        ),
      },
      {
        path: "terms",
        element: (
          <PageSuspenseFallback>
            <TermsConditions />
          </PageSuspenseFallback>
        ),
      },
      {
        path: "contact",
        element: (
          <PageSuspenseFallback>
            <ContactUs />
          </PageSuspenseFallback>
        ),
      },
      {
        path: "profile",
        element: (
          <ProtectedRoute>
            <PageSuspenseFallback>
              <ProfileLayout />
            </PageSuspenseFallback>
          </ProtectedRoute>
        ),
        children: [
          {
            index: true,
            element: (
              <PageSuspenseFallback>
                <Account />
              </PageSuspenseFallback>
            ),
          },
          {
            path: "orders",
            element: (
              <PageSuspenseFallback>
                <Orders />
              </PageSuspenseFallback>
            ),
          },
        ],
      },
    ],
  },

  // Global 404 Catch-All
  {
    path: "*",
    element: (
      <PageSuspenseFallback>
        <Error />
      </PageSuspenseFallback>
    ),
  },
]);

const AppRouter = () => {
  return <RouterProvider router={router} />;
};

export default AppRouter;
