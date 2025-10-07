import { setupWorker } from "msw/browser";
import { handlers } from "./handlers";

// MSW 워커 생성 및 내보내기
export const worker = setupWorker(...handlers);
