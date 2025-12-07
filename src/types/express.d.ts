import { Role } from "@prisma/client";

declare global {
  namespace Express {
    interface UserPayload {
      user_id: string;
      email: string;
      role: Role;
    }

    interface Request {
      user?: UserPayload;
    }
  }
}

export {};
