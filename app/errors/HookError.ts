export class HookError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "HookError";
  }
}
