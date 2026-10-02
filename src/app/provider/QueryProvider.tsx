import { createQueryClient } from "../../infrastucture/monitoring/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";

const queryclient = createQueryClient();

interface queryProiderProps {
  children: ReactNode;
}

const QueryProvider = ({ children }: queryProiderProps) => {
  return (
    <QueryClientProvider client={queryclient}>{children}</QueryClientProvider>
  );
};

export default QueryProvider;
