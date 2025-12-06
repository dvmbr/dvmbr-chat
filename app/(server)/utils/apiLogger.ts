export function apiLogger(method: "GET" | "POST", route: string) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (type: "info" | "error", msg: string, data?: any) =>
    console[type === "info" ? "log" : "error"](
      `SERVER(${type}): ${method} ${route}\n- ${msg}`,
      data ?? ""
    );
}
