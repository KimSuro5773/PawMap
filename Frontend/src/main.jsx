import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/index.scss";
import App from "./App.jsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 1000 * 60 * 5, // 5분
      cacheTime: 1000 * 60 * 10, // 10분
      keepPreviousData: true,
      refetchOnWindowFocus: false,
    },
  },
});

// MSW 초기화 (개발 모드에서만)
async function enableMocking() {
  if (import.meta.env.VITE_ENABLE_MOCK !== "true") {
    return;
  }

  const { worker } = await import("./mocks/browser");

  // Service Worker 시작
  return worker.start({
    onUnhandledRequest: "bypass", // 처리되지 않은 요청은 그대로 통과
  });
}

enableMocking().then(() => {
  createRoot(document.getElementById("root")).render(
    <QueryClientProvider client={queryClient}>
      <App />
      {/* <ReactQueryDevtools initialIsOpen={false} /> */}
    </QueryClientProvider>
  );
});
