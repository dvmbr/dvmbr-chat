import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";

export function getErrorMessage(error: unknown): string {
  if (typeof error === "string") return error;
  if (error instanceof PrismaClientKnownRequestError) {
    switch (error.code) {
      case "P2002":
        return "Duplicate value already exists";

      case "P2003":
        return "This action cannot be completed because it is still in use";

      default:
        return error.message;
    }
  }

  if (error instanceof Error) return error.message;
  return "Internal Server Error";
}
