import { NextFunction, Request, Response } from "express";
import { getInvite } from "../prisma/utils/inviteUtils";
import { createUser, getCleanUser, getUser as getPrismaUser } from "../prisma/utils/userUtils";
import { getUserInfo } from "../oceanic/utils/users";
import argon2 from "argon2";
import { BodyNotValid, InviteInUseError, PasswordNotValid } from "../errors/errors";
import { sign } from "jsonwebtoken";
import { env } from "../server";
import { User } from "@prisma/client";

export const registerUser = async (req: Request, res: Response, next: NextFunction) => {
    const { invite, password, discordId } = req.body;

    try {
        if (typeof password !== "string") {
            throw new BodyNotValid("password", password, typeof password);
        }

        if (typeof invite !== "string") {
            throw new BodyNotValid("invite", invite, typeof invite);
        }

        if (typeof discordId !== "string") {
            throw new BodyNotValid("discordId", discordId, typeof discordId);
        }

        const inviteModel = await getInvite(invite);

        if (inviteModel?.discordId) {
            throw new InviteInUseError();
        }

        const discordUser = await getUserInfo(discordId);

        const hashedPassword = await argon2.hash(password);

        const user = await createUser(discordUser, inviteModel, hashedPassword);

        return res.status(203).json({ data: user });
    } catch (error) {
        next(error);
    }
};

export const loginUser = async (req: Request, res: Response, next: NextFunction) => {
    const { discordId, password } = req.body;

    try {
        if (typeof discordId !== "string") {
            throw new BodyNotValid("discordId", discordId, typeof discordId);
        }

        if (typeof password !== "string") {
            throw new BodyNotValid("password", password, typeof password);
        }

        const user = await getPrismaUser(discordId);

        if (!(await argon2.verify(user.password, password))) {
            throw new PasswordNotValid();
        }

        const token = sign(user, env.PRIVATE as string, { expiresIn: '24 hours' });

        return res.status(200).json({ token, data: user });
    } catch (error) {
        next(error);
    }
};

export const getUser = async (req: Request, res: Response, next: NextFunction) => {
    const tokenInfo: User = req.body.userInfo;

    try {
        if (tokenInfo.role === 'ADMIN') { // I LOVE TYPESCRIPT!!!!!!!!!!!!!
            return res.status(200).json({ data: (await getPrismaUser(req.params.id)) });
        } else {
            return res.status(200).json({ data: (await getCleanUser(tokenInfo.discordId)) });
        }
    } catch (error) {
        next(error);
    }
};