export default class ServerError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export type JWTPayload = {
  id: string;
  iat?: number;
};


export type errorType = {
  response: {
    data: {
      message: string | string[];
    };
  };
};
