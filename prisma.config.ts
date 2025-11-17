import "dotenv/config";
import {defineConfig, env} from "prisma/config";
import path from "node:path";

export default defineConfig({
  // Prisma schema 파일 위치
  schema: path.resolve("prisma/schema.prisma"),

  // Migrations 경로 (기본값이 prisma/migrations이라서 옵션 없어도 됨)
  migrations: {
    path: path.resolve("prisma/migrations"),
  },

  // 엔진 선택: "classic"도 가능하지만 추천은 "wasm"
  engine: "classic",

  // datasource 설정
  datasource: {
    url: env("DATABASE_URL"), // 여기 반드시 env()로 감싸야 함
  },
});
