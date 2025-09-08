import reducer, {
  fetchTasks,
  createTask,
  updateTaskStatusAsync,
  deleteTaskAsync,
  type Task,
} from './taskSlice';

describe('taskSlice reducer', () => {
  const initialState = { items: [], loading: false, error: undefined } as any;

  it('returns initial state when passed unknown action', () => {
    const state = reducer(undefined, { type: 'unknown' } as any);
    expect(state).toEqual(initialState);
  });

  it('sets loading true on fetchTasks.pending', () => {
    const state = reducer(initialState, { type: fetchTasks.pending.type } as any);
    expect(state.loading).toBe(true);
    expect(state.error).toBeUndefined();
  });

  it('handles fetchTasks.fulfilled', () => {
    const tasks: Task[] = [{ id: '1', title: 'Test 1', status: 'Todo' }];
    const prev = { ...initialState, loading: true };
    const state = reducer(prev, { type: fetchTasks.fulfilled.type, payload: tasks } as any);
    expect(state.loading).toBe(false);
    expect(state.items).toEqual(tasks);
  });

  it('handles fetchTasks.rejected', () => {
    const prev = { ...initialState, loading: true };
    const state = reducer(prev, { type: fetchTasks.rejected.type, payload: 'Ошибка загрузки задач' } as any);
    expect(state.loading).toBe(false);
    expect(state.error).toBe('Ошибка загрузки задач');
  });

  it('sets loading true on createTask.pending', () => {
    const state = reducer(initialState, { type: createTask.pending.type } as any);
    expect(state.loading).toBe(true);
  });

  it('handles createTask.fulfilled (pushes new task)', () => {
    const prev = { ...initialState, items: [{ id: '1', title: 'A', status: 'Todo' }], loading: true } as any;
    const newTask: Task = { id: '2', title: 'B', status: 'Todo' };
    const state = reducer(prev, { type: createTask.fulfilled.type, payload: newTask } as any);
    expect(state.loading).toBe(false);
    expect(state.items).toHaveLength(2);
    expect(state.items).toContainEqual(newTask);
  });

  it('handles createTask.rejected', () => {
    const prev = { ...initialState, loading: true } as any;
    const state = reducer(prev, { type: createTask.rejected.type, payload: 'Ошибка создания задачи' } as any);
    expect(state.loading).toBe(false);
    expect(state.error).toBe('Ошибка создания задачи');
  });

  it('updates existing task on updateTaskStatusAsync.fulfilled', () => {
    const prev = { ...initialState, items: [{ id: '1', title: 'A', status: 'Todo' }] } as any;
    const updated: Task = { id: '1', title: 'A', status: 'Done' };
    const state = reducer(prev, { type: updateTaskStatusAsync.fulfilled.type, payload: updated } as any);
    expect(state.items[0]).toEqual(updated);
  });

  it('does nothing when updateTaskStatusAsync.fulfilled for unknown id', () => {
    const prev = { ...initialState, items: [{ id: '1', title: 'A', status: 'Todo' }] } as any;
    const updated: Task = { id: 'not-exist', title: 'X', status: 'Done' };
    const state = reducer(prev, { type: updateTaskStatusAsync.fulfilled.type, payload: updated } as any);
    expect(state.items).toEqual(prev.items);
  });

  it('removes item on deleteTaskAsync.fulfilled', () => {
    const prev = { ...initialState, items: [
      { id: '1', title: 'A', status: 'Todo' },
      { id: '2', title: 'B', status: 'Todo' },
    ] } as any;
    const state = reducer(prev, { type: deleteTaskAsync.fulfilled.type, payload: '1' } as any);
    expect(state.items).toHaveLength(1);
    expect(state.items.find((t: Task) => t.id === '1')).toBeUndefined();
  });
});
