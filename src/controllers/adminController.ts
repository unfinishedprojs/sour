import { NextFunction, Request, Response } from "express";
import { createInvite as createPrismaInvite, deleteInvite as deletePrismaInvite } from "../prisma/utils/inviteUtils";

export const createInvite = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const invite = req.body.invite || [...Array(5)].map(() => String.fromCharCode(Math.floor(Math.random() * 52) + (Math.random() < 0.5 ? 65 : 71))).join('');
        const discordId = req.body.discordId || undefined;

        return res.status(201).json({ data: await createPrismaInvite(invite, discordId) });
    } catch (error) {
        next(error);
    }
};

export const deleteInvite = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const invite = req.body.invite;

        return res.status(200).json({ data: await deletePrismaInvite(invite) });
    } catch (error) {
        next(error);
    }
};