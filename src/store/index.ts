import { combineReducers, configureStore } from "@reduxjs/toolkit";
import categories from "./categories/categoriesSlice";
import products from "./products/productSlice";
import cart from "./cart/cartSlice";
import { FLUSH, PAUSE, PERSIST, persistReducer, persistStore, PURGE, REGISTER, REHYDRATE } from "redux-persist";
import storage from "redux-persist/es/storage";
import wishlist from "./wishlist/wishlistSlice"
import auth from "./auth/authSlice";
import orders from "./orders/ordersSlice";
import toasts from "./toasts/toastsSlice";
import offers from "./offers/offersSlice";
import search from "./search/searchSlice";


const rootPersistConfig = {
  key: "root",
  storage,
  whitelist: ["cart", "auth", "wishlist"],
};


const authPersistConfig = {
  key: "auth",
  storage,
  whiteList: ["user", "accessToken"],
};


const cartPersistConfig = {
  key: "cart",
  storage,
  whitelist: ["items"],
};


const rootReducer = combineReducers({
  categories,
  products,
  cart: persistReducer(cartPersistConfig, cart),
  wishlist: wishlist,
  auth: persistReducer(authPersistConfig, auth),
  orders,
  toasts,
  offers,
  search
});

const persistedReducer = persistReducer(rootPersistConfig, rootReducer);


export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});




// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

export const persistor = persistStore(store);
export default store;
