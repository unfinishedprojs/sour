import { Prisma } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import { InviteInUseError } from "./errors";

export default function handle(error: unknown, req: Request, res: Response, next: NextFunction) {
    console.log(error);

    function hasMessageProperty(error: any): error is { message: string; } {
        return 'message' in error;
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
        switch (error.code) {
            case 'P2002':
                return res.status(409).json({ error: "A unique constraint would be violated. (Basically, already exists)", cause: error.meta });
                break;
            case 'P2003':
                return res.status(400).json({ error: "A foreign key constraint would be violated" });
                break;
            case 'P2025':
                return res.status(404).json({ error: "Record not found" });
                break;
            default:
                return res.status(400).json({ error: "A Prisma client error occured. Contact the instance admin" });
                break;
        }
    }

    switch (true) {
        case error instanceof InviteInUseError:
            return res.status(409).json({ error: error.message });
            break;
        default:
            if (hasMessageProperty(error)) {
                return res.status(400).json({ error: error.message });
            } else {
                return res.status(500).json({ error: 'An unknown error occurred.' });
            }
    }
}