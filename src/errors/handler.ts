import { Prisma } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import { InviteInUseError } from "./errors";

export default function handle(error: unknown, req: Request, res: Response, next: NextFunction) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
        switch (error.code) {
            case 'P2002':
                return res.status(409).json({ error: "A unique constraint would be violated.", cause: error.meta });
                break;
            case 'P2003':
                return res.status(400).json({ error: "A foreign key constraint would be violated" });
                break;
            case 'P2025':
                return res.status(404).json({ error: "Record not found" });
                break;
            default:
                return res.status(400).json({ error: "A Prisma client error occured" });
                break;
        }
    }

    if (error instanceof InviteInUseError) {
        return res.status(409).json({ error: error.message });
    }

    res.status(500).json({ error: "An unexpected error occured" });
}