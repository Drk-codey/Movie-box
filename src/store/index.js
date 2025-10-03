import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web
import authReducer from "./slices/authSlide";
import movieReducer from "./slices/moviesSlice";
import { 
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';

const authPersistConfig = {
  key: "auth",
  storage,
  whitelist: ['user', 'token'] // only persist user and token
};

const persistedAuthReducer = persistReducer(authPersistConfig, authReducer);

// Check if we're in development mode
const isDevelopment = process.env.NODE_ENV === 'development';

export const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
    movies: movieReducer,
  },
  middleware: (getDefaultMiddleware) =>
    // getDefaultMiddleware({
    //   serializableCheck: {
    //     ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
    //   },
    // }),
    //  getDefaultMiddleware({
    //   // Adjust based on your needs
    //   immutableCheck: isDevelopment ? { warnAfter: 100 } : false,
    //   serializableCheck: isDevelopment ? { warnAfter: 100 } : false,
    // }),
      getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
    // Enable Redux DevTools Extension
    devTools: isDevelopment,
});

export const persistor = persistStore(store);
// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;