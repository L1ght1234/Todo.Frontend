import { useEffect } from 'react';
import { Space, Empty, Spin, Alert } from 'antd';
import TaskItem from './TaskItem';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '../app/store';
import { fetchTasks } from '../features/tasks/taskSlice';

export default function TaskList() {
  const dispatch = useDispatch<AppDispatch>();
  const { items, loading, error } = useSelector((state: RootState) => state.task);

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  if (loading) {
    return <Spin tip="Loading..." />;
  }

  if (error) {
    return <Alert type="error" message="Error" description={error} />;
  }

  if (items.length === 0) {
    return <Empty description="There are no tasks yet" />;
  }

  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      {items.map((task) => (
        <TaskItem key={task.id} task={task} />
      ))}
    </Space>
  );
}
