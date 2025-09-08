import { Layout, Typography } from 'antd';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';

const { Content } = Layout;
const { Title } = Typography;

export default function App() {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Content style={{ padding: 24 }}>
        <TaskForm />
        <Title level={3}>Task list</Title>
        <TaskList />
      </Content>
    </Layout>
  );
}