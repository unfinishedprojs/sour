import { NextFunction, Request, Response } from "express";
import { getPollAsUser, createPoll as createPrismaPoll, getPollFromId } from "../prisma/utils/pollUtils";
import { PollType } from "@prisma/client";
import { getUserInfo } from "../oceanic/utils/users";
import { User } from "oceanic.js";
import { BodyNotValid, PasswordNotValid } from "../errors/errors";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

export const getPoll = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (req.body.authAdmin) {
            const { authId } = req.body;

            return res.status(200).json({ data: (await getPollAsUser(authId)) });
        } else {
            const { authId } = req.body;

            return res.status(200).json({ data: (await getPollAsUser(authId)) });
        }
    } catch (error) {
        next(error);
    }
};

export const createPoll = async (req: Request, res: Response, next: NextFunction) => {
    try {
        switch (req.body.type) {
            case PollType.inviteUser:
                const { discordId } = req.body;

                if (typeof discordId !== "string") {
                    throw new BodyNotValid("discordId", discordId, typeof discordId);
                }

                if (await getPollFromId(discordId)) {
                    throw new PasswordNotValid;
                }

                const endsAt: Date = new Date((new Date()).getTime() + (60 * 60 * 24 * 1000));

                const userInfo: User = await getUserInfo(discordId);

                return res.status(200).json({
                    data: (await createPrismaPoll(
                        PollType.inviteUser,
                        `Should we invite ${userInfo.username}?`,
                        endsAt,
                        ["Yes", "No"],
                        {
                            discordId: userInfo.id,
                            discordUser: userInfo.globalName,
                            discordSlug: userInfo.username,
                        },
                    ))
                });
                break;
            default:
                return res.status(404).json({ error: "Not implemented yet!" });
                break;
        }
    } catch (error) {
        next(error);
    }
};