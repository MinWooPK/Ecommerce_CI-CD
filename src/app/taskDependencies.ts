import { createTaskUseCases } from "../application/useCases/taskUseCases";
import { TaskRepositoryImpl } from "../infrastucture/repositories/TaskRepositoryImpl";

export const taskUseCases = createTaskUseCases(TaskRepositoryImpl);
