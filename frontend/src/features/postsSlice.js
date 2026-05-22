import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as postService from '../services/postService';

export const fetchPosts = createAsyncThunk(
  'posts/fetchPosts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await postService.getPosts();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch posts');
    }
  }
);

export const fetchPendingPosts = createAsyncThunk(
  'posts/fetchPendingPosts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await postService.getPendingPosts();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch pending posts');
    }
  }
);

export const createPost = createAsyncThunk(
  'posts/createPost',
  async (postData, { rejectWithValue }) => {
    try {
      const response = await postService.createPost(postData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create post');
    }
  }
);

export const approvePost = createAsyncThunk(
  'posts/approvePost',
  async ({ id, feedback }, { rejectWithValue }) => {
    try {
      const response = await postService.approvePost(id, feedback);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to approve post');
    }
  }
);

export const rejectPost = createAsyncThunk(
  'posts/rejectPost',
  async ({ id, feedback }, { rejectWithValue }) => {
    try {
      const response = await postService.rejectPost(id, feedback);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to reject post');
    }
  }
);

export const reactToPost = createAsyncThunk(
  'posts/reactToPost',
  async ({ id, type }, { rejectWithValue }) => {
    try {
      const response = await postService.reactToPost(id, type);
      return { postId: id, type, data: response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to react to post');
    }
  }
);

export const addComment = createAsyncThunk(
  'posts/addComment',
  async ({ id, content }, { rejectWithValue }) => {
    try {
      const response = await postService.addComment(id, content);
      return { postId: id, comment: response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add comment');
    }
  }
);

const postsSlice = createSlice({
  name: 'posts',
  initialState: {
    posts: [],
    pendingPosts: [],
    loading: false,
    error: null
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = action.payload;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchPendingPosts.fulfilled, (state, action) => {
        state.pendingPosts = action.payload;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.pendingPosts.unshift(action.payload);
      })
      .addCase(approvePost.fulfilled, (state, action) => {
        state.pendingPosts = state.pendingPosts.filter(p => p.id !== action.payload.id);
        state.posts.unshift(action.payload);
      })
      .addCase(rejectPost.fulfilled, (state, action) => {
        state.pendingPosts = state.pendingPosts.filter(p => p.id !== action.payload.id);
      })
      .addCase(reactToPost.fulfilled, (state, action) => {
        const post = state.posts.find(p => p.id === action.payload.postId);
        if (post) {
          const reactionIndex = post.reactions.findIndex(
            r => r.type === action.payload.type && r.userId === action.payload.data.userId
          );
          if (reactionIndex >= 0) {
            post.reactions.splice(reactionIndex, 1);
          } else {
            post.reactions.push(action.payload.data);
          }
        }
      })
      .addCase(addComment.fulfilled, (state, action) => {
        const post = state.posts.find(p => p.id === action.payload.postId);
        if (post) {
          post.comments.unshift(action.payload.comment);
        }
      });
  }
});

export const { clearError } = postsSlice.actions;
export default postsSlice.reducer;
