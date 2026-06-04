import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as voteService from '../services/voteService';

export const fetchPolls = createAsyncThunk(
  'votes/fetchPolls',
  async (classId, { rejectWithValue }) => {
    try {
      const response = await voteService.getPolls(classId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch polls');
    }
  }
);

export const createPoll = createAsyncThunk(
  'votes/createPoll',
  async (pollData, { rejectWithValue }) => {
    try {
      const response = await voteService.createPoll(pollData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create poll');
    }
  }
);

export const closePoll = createAsyncThunk(
  'votes/closePoll',
  async (id, { rejectWithValue }) => {
    try {
      const response = await voteService.closePoll(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to close poll');
    }
  }
);

export const deletePoll = createAsyncThunk(
  'votes/deletePoll',
  async (id, { rejectWithValue }) => {
    try {
      await voteService.deletePoll(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete poll');
    }
  }
);

export const vote = createAsyncThunk(
  'votes/vote',
  async ({ id, optionIds }, { rejectWithValue }) => {
    try {
      const response = await voteService.vote(id, optionIds);
      return { pollId: id, data: response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to vote');
    }
  }
);

export const fetchPollResults = createAsyncThunk(
  'votes/fetchPollResults',
  async (id, { rejectWithValue }) => {
    try {
      const response = await voteService.getPollResults(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch poll results');
    }
  }
);

const votesSlice = createSlice({
  name: 'votes',
  initialState: {
    polls: [],
    currentPoll: null,
    pollResults: null,
    loading: false,
    error: null
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentPoll: (state, action) => {
      state.currentPoll = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPolls.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPolls.fulfilled, (state, action) => {
        state.loading = false;
        state.polls = action.payload;
      })
      .addCase(fetchPolls.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createPoll.fulfilled, (state, action) => {
        state.polls.unshift(action.payload);
      })
      .addCase(createPoll.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(closePoll.fulfilled, (state, action) => {
        const index = state.polls.findIndex(p => p.id === action.payload.id);
        if (index >= 0) {
          state.polls[index] = action.payload;
        }
      })
      .addCase(closePoll.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(deletePoll.fulfilled, (state, action) => {
        state.polls = state.polls.filter(p => p.id !== action.payload);
      })
      .addCase(deletePoll.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(vote.fulfilled, (state, action) => {
        const poll = state.polls.find(p => p.id === action.payload.pollId);
        if (poll) {
          const newVotes = action.payload.data.votes;
          poll._count.votes += newVotes.length;
          
          newVotes.forEach(vote => {
            const option = poll.options.find(o => o.id === vote.optionId);
            if (option) {
              if (!option.votes) {
                option.votes = [];
              }
              option.votes.push({ voterId: vote.voterId });
              if (!option._count) {
                option._count = { votes: 0 };
              }
              option._count.votes += 1;
            }
          });
        }
      })
      .addCase(fetchPollResults.fulfilled, (state, action) => {
        state.pollResults = action.payload;
      });
  }
});

export const { clearError, setCurrentPoll } = votesSlice.actions;
export default votesSlice.reducer;
