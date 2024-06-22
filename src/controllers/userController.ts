import { NextFunction, Request, Response } from "express";
import handle from "../errors/handler";
import { getInvite } from "../prisma/utils/inviteUtils";
import { createUser } from "../prisma/utils/userUtils";
import { getUserInfo } from "../oceanic/utils/users";
import argon2 from "argon2";
import { InviteInUseError, InviteNotFoundError } from "../errors/errors";

export const registerUser = async (req: Request, res: Response, next: NextFunction) => {
    const { invite, password, discordId } = req.body;

    try {
        const inviteModel = await getInvite(invite);

        if (!inviteModel) {
            throw new InviteNotFoundError();
        }

        if (inviteModel?.discordId) {
            throw new InviteInUseError();
        }

        const discordUser = await getUserInfo(discordId);

        const hashedPassword = await argon2.hash(password);

        createUser(discordUser, inviteModel, hashedPassword);



    } catch (error) {
        next(error);
    }
};