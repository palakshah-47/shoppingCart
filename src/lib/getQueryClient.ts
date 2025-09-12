// src/lib/getQueryClient.ts
import { QueryClient } from '@tanstack/react-query';

let queryClient: QueryClient | undefined;

export default function getQueryClient() {
  if (!queryClient) {
    queryClient = new QueryClient();
  }
  return queryClient;
}
