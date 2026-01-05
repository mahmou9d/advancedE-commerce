import { lazy, Suspense } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
// layouts
const MainLayout = lazy(() => import("@layouts/MainLayout"));
// pages
const Home = lazy(() => import("@pages/home/Home"));
const Categories = lazy(() => import("@pages/category/Categories"));
const Products = lazy(() => import("@pages/products/Products"));
const Login = lazy(() => import("@pages/login/Login"));
const Register = lazy(() => import("@pages/signup/Register"));
// const Error = lazy(() => import("@pages/Error"));
const Offers = lazy(() => import("@pages/offers/Offers"));
const Cart = lazy(() => import("@pages/cart/Cart"));
const WishList = lazy(() => import("@pages/wishlist/WishList"));
const ProfileLayout = lazy(() => import("@layouts/ProfileLayout/ProfileLayout"));
const Account = lazy(() => import("@pages/account/Account"));
const Orders = lazy(() => import("@pages/orders/Orders"));
const Admin = lazy(() => import("@pages/admin/Admin"));
const Search = lazy(() => import("@pages/search/Search"));
import Error from "@pages/Error";
// import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import PageSuspenseFallback from "@components/feedback/PageSuspenseFallback/PageSuspenseFallback";
import ProtectedRoute from "@components/Auth/ProtectedRoute";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Suspense
        fallback={
          <div
            style={{
              background: "black",
              height: "100vh",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <div
              style={{
                width: "60px",
                height: "60px",
                border: "5px solid rgba(255, 255, 255, 0.2)",
                borderTop: "5px solid #3498db",
                borderRadius: "50%",
                animation: "spin 0.8s linear infinite",
              }}
            />
            <style>{`
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            `}</style>
          </div>
        }
      >
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
        path: "offers",
        element: (
          <PageSuspenseFallback>
            <Offers />
          </PageSuspenseFallback>
        ),
      },
      {
        path: "login",
        element: (
          <PageSuspenseFallback>
            <Login />
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
        path: "register",
        element: (
          <PageSuspenseFallback>
            <Register />
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
      {
        path: "admin",
        element: (
          <ProtectedRoute>
            <Admin />
          </ProtectedRoute>
        ),
      },
      {
        path: "Search",
        element: (
          <PageSuspenseFallback>
            <Search />
          </PageSuspenseFallback>
        ),
      },
    ],
  },
]);

const AppRouter = () => {
  return <RouterProvider router={router} />;
};

export default AppRouter;
