import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import TaskItem from "./TaskItem";
import type { Task } from "../features/tasks/taskSlice";

const mockStore = configureStore([]);
let store: ReturnType<typeof mockStore>;

const task: Task = {
  id: "1",
  title: "Test Task",
  deadline: "2025-09-10",
  status: "Todo",
};

describe("TaskItem component", () => {
  beforeEach(() => {
    store = mockStore({});
    store.dispatch = jest.fn();
  });

  const renderWithStore = () =>
    render(
      <Provider store={store}>
        <TaskItem task={task} />
      </Provider>
    );

  it("renders task title and deadline", () => {
    renderWithStore();

    expect(screen.getByText("Test Task")).toBeInTheDocument();
    expect(screen.getByText(/⏰ 2025-09-10/)).toBeInTheDocument();
  });

  it("does not dispatch update if status is the same", () => {
    renderWithStore();

    const select = screen.getByRole("combobox");
    fireEvent.change(select, { target: { value: "Todo" } });

    expect(store.dispatch).not.toHaveBeenCalled();
  });

  it("renders delete button", () => {
    renderWithStore();

    expect(screen.getByRole("button", { name: /Delete/i })).toBeInTheDocument();
  });

});