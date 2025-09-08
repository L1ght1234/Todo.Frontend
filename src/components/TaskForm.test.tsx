import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import TaskForm from "./TaskForm";

const mockStore = configureStore([]);
let store: ReturnType<typeof mockStore>;

describe("TaskForm component", () => {
  beforeEach(() => {
    store = mockStore({});
    store.dispatch = jest.fn();
  });

  const renderWithStore = () =>
    render(
      <Provider store={store}>
        <TaskForm />
      </Provider>
    );

  it("renders input, select and button", () => {
    renderWithStore();

    expect(screen.getByPlaceholderText(/Title/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Add/i })).toBeInTheDocument();
    expect(screen.getByRole("combobox")).toBeInTheDocument();
  });

  it("allows typing a task title", () => {
    renderWithStore();

    const input = screen.getByPlaceholderText(/Title/i) as HTMLInputElement;
    fireEvent.change(input, { target: { value: "Test Task" } });

    expect(input.value).toBe("Test Task");
  });

  it("does not dispatch if the title is empty", () => {
    renderWithStore();

    const button = screen.getByRole("button", { name: /Add/i });
    fireEvent.click(button);

    expect(store.dispatch).not.toHaveBeenCalled();
  });

    it("dispatches createTask if the title is not empty", () => {
    renderWithStore();

    const input = screen.getByPlaceholderText(/Title/i);
    fireEvent.change(input, { target: { value: "New Task" } });

    const button = screen.getByRole("button", { name: /Add/i });
    fireEvent.click(button);

    expect(store.dispatch).toHaveBeenCalled();
    });

  it("resets the form after adding a task", () => {
    renderWithStore();

    const input = screen.getByPlaceholderText(/Title/i) as HTMLInputElement;
    fireEvent.change(input, { target: { value: "Reset Me" } });

    const button = screen.getByRole("button", { name: /Add/i });
    fireEvent.click(button);

    expect(input.value).toBe("");
  });
});