export type Status = "todo" | "inprogress" | "done" | "completed";

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: Status;
}

export const columns: { id: Status; title: string }[] = [
  { id: "todo", title: "To Do" },
  { id: "inprogress", title: "In Progress" },
  { id: "done", title: "Done" },
  { id: "completed", title: "Completed" },
];
