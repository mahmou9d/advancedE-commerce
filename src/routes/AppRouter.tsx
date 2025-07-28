import { lazy, Suspense } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
// layouts
const MainLayout = lazy(() => import("@layouts/MainLayout"));
// pages
const Home = lazy(() => import("@pages/Home"));
const Categories = lazy(() => import("@pages/Categories"));
const Products = lazy(() => import("@pages/Products"));
const Login = lazy(() => import("@pages/Login"));
const Register = lazy(() => import("@pages/Register"));
// const Error = lazy(() => import("@pages/Error"));
const Offers = lazy(() => import("@pages/Offers"));
const Cart = lazy(() => import("@pages/Cart"));
const WishList = lazy(() => import("@pages/WishList"));
const ProfileLayout = lazy(() => import("@layouts/ProfileLayout/ProfileLayout"));
const Account = lazy(() => import("@pages/Account"));
const Orders = lazy(() => import("@pages/Orders"));
const Admin = lazy(() => import("@pages/Admin"));
const Search = lazy(() => import("@pages/Search"));
import Error from "@pages/Error";
// import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import PageSuspenseFallback from "@components/feedback/PageSuspenseFallback/PageSuspenseFallback";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
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
            <div style={{ width: "200px" }}>
              <DotLottieReact
                src="https://lottie.host/d023ab73-6fe0-4758-9c9f-fa481de0ed37/FdTUGU5aYc.lottie"
                loop
                autoplay
              />
            </div>
          </div>
        }
      >
        <MainLayout />
      </Suspense>
    ),
    errorElement: (
      // <Suspense
      //   fallback={
      //     <div
      //       style={{
      //         width: "100px",
      //         height: "70px",
      //         marginLeft: "auto",
      //         marginRight: "auto",
      //         marginTop: "50px",
      //       }}
      //     >
      //       <DotLottieReact
      //         src="https://lottie.host/d023ab73-6fe0-4758-9c9f-fa481de0ed37/FdTUGU5aYc.lottie"
      //         loop
      //         autoplay
      //       />
      //     </div>
      //   }
      // >
      //   <Error />
      // </Suspense>
      <PageSuspenseFallback>
        <Error />
      </PageSuspenseFallback>
    ),
    children: [
      {
        index: true,
        element: (
          // <Suspense
          //   fallback={
          //     <div
          //       style={{
          //         width: "100px",
          //         height: "70px",
          //         marginLeft: "auto",
          //         marginRight: "auto",
          //         marginTop: "50px",
          //       }}
          //     >
          //       <DotLottieReact
          //         src="https://lottie.host/d023ab73-6fe0-4758-9c9f-fa481de0ed37/FdTUGU5aYc.lottie"
          //         loop
          //         autoplay
          //       />
          //     </div>
          //   }
          // >
          //   <Home />
          // </Suspense>
          <PageSuspenseFallback>
            <Home />
          </PageSuspenseFallback>
        ),
      },
      {
        path: "categories",
        element: (
          // <Suspense
          //   fallback={
          //     <div
          //       style={{
          //         width: "100px",
          //         height: "70px",
          //         marginLeft: "auto",
          //         marginRight: "auto",
          //         marginTop: "50px",
          //       }}
          //     >
          //       <DotLottieReact
          //         src="https://lottie.host/d023ab73-6fe0-4758-9c9f-fa481de0ed37/FdTUGU5aYc.lottie"
          //         loop
          //         autoplay
          //       />
          //     </div>
          //   }
          // >
          //   <Categories />
          // </Suspense>
          <PageSuspenseFallback>
            <Categories />
          </PageSuspenseFallback>
        ),
      },
      {
        path: "categories/products/:prefix",
        element: (
          // <Suspense
          //   fallback={
          //     <div
          //       style={{
          //         width: "100px",
          //         height: "70px",
          //         marginLeft: "auto",
          //         marginRight: "auto",
          //         marginTop: "50px",
          //       }}
          //     >
          //       <DotLottieReact
          //         src="https://lottie.host/d023ab73-6fe0-4758-9c9f-fa481de0ed37/FdTUGU5aYc.lottie"
          //         loop
          //         autoplay
          //       />
          //     </div>
          //   }
          // >
          //   <Products />
          // </Suspense>
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
          // <Suspense
          //   fallback={
          //     <div
          //       style={{
          //         width: "100px",
          //         height: "70px",
          //         marginLeft: "auto",
          //         marginRight: "auto",
          //         marginTop: "50px",
          //       }}
          //     >
          //       <DotLottieReact
          //         src="https://lottie.host/d023ab73-6fe0-4758-9c9f-fa481de0ed37/FdTUGU5aYc.lottie"
          //         loop
          //         autoplay
          //       />
          //     </div>
          //   }
          // >
          //   <Offers />
          // </Suspense>
          <PageSuspenseFallback>
            <Offers />
          </PageSuspenseFallback>
        ),
      },
      {
        path: "login",
        element: (
          // <Suspense
          //   fallback={
          //     <div
          //       style={{
          //         width: "100px",
          //         height: "70px",
          //         marginLeft: "auto",
          //         marginRight: "auto",
          //         marginTop: "50px",
          //       }}
          //     >
          //       <DotLottieReact
          //         src="https://lottie.host/d023ab73-6fe0-4758-9c9f-fa481de0ed37/FdTUGU5aYc.lottie"
          //         loop
          //         autoplay
          //       />
          //     </div>
          //   }
          // >
          //   <Login />
          // </Suspense>
          <PageSuspenseFallback>
            <Login />
          </PageSuspenseFallback>
        ),
      },
      {
        path: "wishlist",
        element: (
          // <Suspense
          //   fallback={
          //     <div
          //       style={{
          //         width: "100px",
          //         height: "70px",
          //         marginLeft: "auto",
          //         marginRight: "auto",
          //         marginTop: "50px",
          //       }}
          //     >
          //       <DotLottieReact
          //         src="https://lottie.host/d023ab73-6fe0-4758-9c9f-fa481de0ed37/FdTUGU5aYc.lottie"
          //         loop
          //         autoplay
          //       />
          //     </div>
          //   }
          // >
          //   <WishList />
          // </Suspense>
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
          // <Suspense
          //   fallback={
          //     <div
          //       style={{
          //         width: "100px",
          //         height: "70px",
          //         marginLeft: "auto",
          //         marginRight: "auto",
          //         marginTop: "50px",
          //       }}
          //     >
          //       <DotLottieReact
          //         src="https://lottie.host/d023ab73-6fe0-4758-9c9f-fa481de0ed37/FdTUGU5aYc.lottie"
          //         loop
          //         autoplay
          //       />
          //     </div>
          //   }
          // >
          //   <Register />
          // </Suspense>
          <PageSuspenseFallback>
            <Register />
          </PageSuspenseFallback>
        ),
      },
      {
        path: "cart",
        element: (
          // <Suspense
          //   fallback={
          //     <div
          //       style={{
          //         width: "100px",
          //         height: "70px",
          //         marginLeft: "auto",
          //         marginRight: "auto",
          //         marginTop: "50px",
          //       }}
          //     >
          //       <DotLottieReact
          //         src="https://lottie.host/d023ab73-6fe0-4758-9c9f-fa481de0ed37/FdTUGU5aYc.lottie"
          //         loop
          //         autoplay
          //       />
          //     </div>
          //   }
          // >
          //   <Cart />
          // </Suspense>
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
          <PageSuspenseFallback>
            <Admin />
          </PageSuspenseFallback>
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
