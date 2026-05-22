import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as messageService from '../services/messageService';

export const fetchMessages = createAsyncThunk(
  'messages/fetchMessages',
  async (_, { rejectWithValue }) => {
    try {
      const response = await messageService.getMessages();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch messages');
    }
  }
);

export const fetchMessageThread = createAsyncThunk(
  'messages/fetchMessageThread',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await messageService.getMessageThread(userId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch message thread');
    }
  }
);

export const sendMessage = createAsyncThunk(
  'messages/sendMessage',
  async (messageData, { rejectWithValue }) => {
    try {
      const response = await messageService.sendMessage(messageData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to send message');
    }
  }
);

export const markAsRead = createAsyncThunk(
  'messages/markAsRead',
  async (id, { rejectWithValue }) => {
    try {
      const response = await messageService.markAsRead(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to mark as read');
    }
  }
);

const messagesSlice = createSlice({
  name: 'messages',
  initialState: {
    messages: [],
    currentThread: [],
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
      .addCase(fetchMessages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.loading = false;
        state.messages = action.payload;
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchMessageThread.fulfilled, (state, action) => {
        state.currentThread = action.payload;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.messages.unshift(action.payload);
        state.currentThread.push(action.payload);
      })
      .addCase(markAsRead.fulfilled, (state, action) => {
        const index = state.messages.findIndex(m => m.id === action.payload.id);
        if (index >= 0) {
          state.messages[index] = action.payload;
        }
      });
  }
});

export const { clearError } = messagesSlice.actions;
export default messagesSlice.reducer;
