import { store } from './store';

jest.mock('axios');

describe('Redux Store', () => {
  it('should have correct initial state structure', () => {
    const state = store.getState();
    
    expect(state).toHaveProperty('task');
    expect(state.task).toEqual({
      items: [],
      loading: false,
      error: undefined,
    });
  });

  it('should properly update state when dispatching actions', () => {
    store.dispatch({ type: 'tasks/fetchTasks/pending' });
    
    let state = store.getState();
    expect(state.task.loading).toBe(true);
    expect(state.task.error).toBeUndefined();

    const mockTasks = [
      { id: '1', title: 'Test Task', status: 'Todo' as const },
      { id: '2', title: 'Another Task', status: 'Done' as const },
    ];

    store.dispatch({
      type: 'tasks/fetchTasks/fulfilled',
      payload: mockTasks,
    });

    state = store.getState();
    expect(state.task.loading).toBe(false);
    expect(state.task.items).toEqual(mockTasks);
  });

  it('should handle errors', () => {
    store.dispatch({
      type: 'tasks/fetchTasks/rejected',
      payload: 'Failed to load tasks',
    });

    const state = store.getState();
    expect(state.task.loading).toBe(false);
    expect(state.task.error).toBe('Failed to load tasks');
  });

  it('should add new task when successfully created', () => {
    store.dispatch({
      type: 'tasks/fetchTasks/fulfilled',
      payload: [],
    });

    const newTask = {
      id: '3',
      title: 'New Task',
      status: 'Todo' as const,
    };

    store.dispatch({
      type: 'tasks/createTask/fulfilled',
      payload: newTask,
    });

    const state = store.getState();
    expect(state.task.items).toContain(newTask);
    expect(state.task.items).toHaveLength(1);
  });

  it('should update task status', () => {
    const initialTask = { id: '1', title: 'Test Task', status: 'Todo' as const };
    store.dispatch({
      type: 'tasks/fetchTasks/fulfilled',
      payload: [initialTask],
    });

    const updatedTask = { ...initialTask, status: 'Done' as const };
    store.dispatch({
      type: 'tasks/updateTaskStatus/fulfilled',
      payload: updatedTask,
    });

    const state = store.getState();
    expect(state.task.items[0].status).toBe('Done');
  });

  it('should delete task', () => {
    const tasks = [
      { id: '1', title: 'Task 1', status: 'Todo' as const },
      { id: '2', title: 'Task 2', status: 'Done' as const },
    ];
    store.dispatch({
      type: 'tasks/fetchTasks/fulfilled',
      payload: tasks,
    });

    store.dispatch({
      type: 'tasks/deleteTask/fulfilled',
      payload: '1',
    });

    const state = store.getState();
    expect(state.task.items).toHaveLength(1);
    expect(state.task.items[0].id).toBe('2');
  });

  it('should have correct types', () => {
    const state = store.getState();
    const dispatch = store.dispatch;
    
    expect(typeof state).toBe('object');
    expect(typeof dispatch).toBe('function');
  });

  it('should support subscriptions to changes', () => {
    const mockListener = jest.fn();
    
    const unsubscribe = store.subscribe(mockListener);
    
    store.dispatch({ type: 'tasks/fetchTasks/pending' });
    
    expect(mockListener).toHaveBeenCalled();
    
    unsubscribe();
  });
});