import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { taskUseCases } from "../../app/taskDependencies";
import type { Task } from "../../types/Task";
import type { UpdateTaskInput } from "../../domain/repositories/TaskRepoisotry";

export const useTasks = () => {
  const client = useQueryClient();
  const queryKey = ["tasks"];
  const refresh = () => client.invalidateQueries({ queryKey });
  const tasks = useQuery({ queryKey, meta: { resource: "tasks", operation: "list" }, queryFn: taskUseCases.getAll });
  const createTask = useMutation({ meta: { resource: "tasks", operation: "create" }, mutationFn: taskUseCases.create, onSuccess: refresh });
  const updateTask = useMutation({ meta: { resource: "tasks", operation: "update" },
    mutationFn: ({ id, input }: { id: Task["id"]; input: UpdateTaskInput }) =>
      taskUseCases.update(id, input),
    onSuccess: refresh,
  });
  return { tasks, createTask, updateTask };
};
