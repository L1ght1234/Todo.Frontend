import { Card, Space, Select, Button, Popconfirm } from 'antd';
import type { Task, TaskStatus } from '../features/tasks/taskSlice';
import { useDispatch } from 'react-redux';
import { updateTaskStatusAsync, deleteTaskAsync } from '../features/tasks/taskSlice';
import type { AppDispatch } from '../app/store';

interface TaskItemProps {
  task: Task;
}

export default function TaskItem({ task }: TaskItemProps) {
    const dispatch = useDispatch<AppDispatch>();

    const handleDelete = () => {
      dispatch(deleteTaskAsync(task.id));
    };

    const handleStatusChange = (value: TaskStatus) => {
      if (value === task.status) return;
      dispatch(updateTaskStatusAsync({ id: task.id, status: value }));
    };

  return (
    <Card size="small" style={{ width: '100%' }}>
      <Space align="center" style={{ width: '100%', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <span style={{ fontWeight: 500 }}>{task.title}</span>
          {task.deadline && <span>⏰ {task.deadline}</span>}
        </div>

        <Space>
          <Select<TaskStatus>
            value={task.status}
            onChange={(v) => handleStatusChange(v as TaskStatus)}
            style={{ width: 160 }}
            options={[
              { value: 'Todo', label: 'Todo' },
              { value: 'InProgress', label: 'In progress' },
              { value: 'Done', label: 'Done' },
            ]}
          />

          <Popconfirm
            title="Delete task?"
            description="This action cannot be cancel"
            okText="Yes"
            cancelText="No"
            onConfirm={handleDelete}
          >
            <Button danger>Delete</Button>
          </Popconfirm>
        </Space>
      </Space>
    </Card>
  );
}