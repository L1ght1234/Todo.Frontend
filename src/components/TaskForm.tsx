import React from 'react';
import { Card, Space, Input, DatePicker, Select, Button } from 'antd';
import { useDispatch } from 'react-redux';
import { type TaskStatus, createTask  } from '../features/tasks/taskSlice';
import type { AppDispatch } from '../app/store';


export default function TaskForm() {
  const dispatch = useDispatch<AppDispatch>();
  const [formData, setFormData] = React.useState({
    title: "",
    deadline: undefined as string | undefined,
    status: "Todo" as TaskStatus,
  });

  const updateField = (field: keyof typeof formData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const addTaskHandler = () => {
    if (!formData.title.trim()) return;

    dispatch(createTask(formData));

    setFormData({ title: "", deadline: undefined, status: "Todo" });
  };

  return (
    <Card title="New task" style={{ marginBottom: 24 }}>
      <Space>
        <Input
          value={formData.title}
          onChange={(e) => updateField("title", e.target.value)}
          placeholder="Title"
          style={{ width: 200 }}
        />
        <DatePicker
          onChange={(date, dateString) => updateField("deadline", dateString || undefined)}
        />
        <Select
          value={formData.status}
          onChange={(value) => updateField("status", value)}
          style={{ width: 160 }}
          options={[
            { value: "Todo", label: "Todo" },
            { value: "InProgress", label: "In progress" },
            { value: "Done", label: "Done" },
          ]}
        />
        <Button type="primary" onClick={addTaskHandler}>
          Add
        </Button>
      </Space>
    </Card>
  );
}