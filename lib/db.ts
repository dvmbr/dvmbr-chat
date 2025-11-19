import {PrismaClient} from "@prisma/client";

// 싱글톤 패턴
const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

// PrismaClient 인스턴스 생성
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ["query", "error", "warn"],
  });

// hot reload 이슈 방지
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
