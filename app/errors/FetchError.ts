type FetchErrorOptions = {
  status: number;
  url?: string;
};

export class FetchError extends Error {
  status: number;
  url?: string;

  constructor(message: string, options: FetchErrorOptions) {
    super(message);
    this.name = "FetchError";
    this.status = options.status;
    this.url = options.url;
  }
}
