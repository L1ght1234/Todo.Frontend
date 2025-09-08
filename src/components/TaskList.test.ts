import { fetchTasks } from '../features/tasks/taskSlice';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('fetchTasks async thunk', () => {
  test('successfully fetches tasks', async () => {
    const mockTasks = [
      { id: '1', title: 'Test Task', status: 'Todo' }
    ];
    
    mockedAxios.get.mockResolvedValueOnce({ data: mockTasks });

    const dispatch = jest.fn();
    const getState = jest.fn();

    const thunk = fetchTasks();
    await thunk(dispatch, getState, undefined);

    expect(dispatch).toHaveBeenCalledWith({
      type: 'tasks/fetchTasks/pending',
      meta: expect.any(Object)
    });
    
    expect(dispatch).toHaveBeenCalledWith({
      type: 'tasks/fetchTasks/fulfilled',
      payload: mockTasks,
      meta: expect.any(Object)
    });
  });

  test('handles loading error', async () => {
    mockedAxios.get.mockRejectedValueOnce(new Error('Network Error'));

    const dispatch = jest.fn();
    const getState = jest.fn();

    const thunk = fetchTasks();
    await thunk(dispatch, getState, undefined);

    expect(dispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'tasks/fetchTasks/rejected'
      })
    );
  });
});
