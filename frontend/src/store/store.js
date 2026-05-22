import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/authSlice';
import postsReducer from '../features/postsSlice';
import votesReducer from '../features/votesSlice';
import messagesReducer from '../features/messagesSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    posts: postsReducer,
    votes: votesReducer,
    messages: messagesReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST']
      }
    })
});

export default store;
