import { create } from "zustand";

interface TaskState {
  myTasks: Task[];
  completedTasks: Task[];
  AssignTasks: Task[];
}

export const useTaskStore = create<TaskState>();
