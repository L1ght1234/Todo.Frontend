import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

export type TaskStatus = 'Todo' | 'InProgress' | 'Done';

export interface Task {
  id: string;
  title: string;
  deadline?: string;
  status: TaskStatus;
}

interface TaskState {
  items: Task[];
  loading: boolean;
  error?: string;
}

const initialState: TaskState = {
  items: [],
  loading: false,
  error: undefined,
};

export const fetchTasks = createAsyncThunk<Task[], void, { rejectValue: string }>(
  'tasks/fetchTasks',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get<Task[]>('https://localhost:7252/todos');
      return response.data;
    } catch (err) {
      return rejectWithValue('Fetch error');
    }
  }
);

export const createTask = createAsyncThunk<Task, Omit<Task, "id">, { rejectValue: string }>(
  "tasks/createTask",
  async (newTask, { rejectWithValue }) => {
    try {
      const response = await axios.post<Task>("https://localhost:7252/todos", newTask);
      return response.data;
    } catch (err) {
      return rejectWithValue("Create error");
    }
  }
);

export const updateTaskStatusAsync = createAsyncThunk<
  Task,
  { id: string; status: TaskStatus },
  { rejectValue: string }
  >(
  "tasks/updateTaskStatus",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const response = await axios.put<Task>(
        `https://localhost:7252/todos/${id}`,
        { status }
      );
      return response.data;
    } catch (err) {
      return rejectWithValue("Edit error");
    }
  }
);

export const deleteTaskAsync = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>(
  "tasks/deleteTask",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`https://localhost:7252/todos/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue("Delete error");
    }
  }
);

export const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'unknown error';
      })
      .addCase(createTask.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.loading = false;
        state.items.push(action.payload);
      })
      .addCase(createTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "unknown error";
      })
      .addCase(updateTaskStatusAsync.fulfilled, (state, action) => {
      const i = state.items.findIndex(t => t.id === action.payload.id);
      if (i !== -1) {
        state.items[i] = action.payload;
      }
      })
      .addCase(deleteTaskAsync.fulfilled, (state, action) => {
      state.items = state.items.filter(t => t.id !== action.payload);
      })
  },
});

export default taskSlice.reducer;
