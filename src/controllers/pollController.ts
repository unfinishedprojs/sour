import { NextFunction, Request, Response } from "express";
import { getPollAsUser, createPoll as createPrismaPoll, getPollFromDiscordId, getVote, getPollFromId, editVote, createVote as createPrismaVote, getPolls as getPrismaPolls, countPolls, SortingMethod, Filter } from "../prisma/utils/pollUtils";
import { PollType, User as PrismaUserType } from "@prisma/client";
import { getUserInfo } from "../oceanic/utils/users";
import { User as DiscordUserType } from "oceanic.js";
import { BodyNotValid, OptionNotValid } from "../errors/errors";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

export const getPoll = async (req: Request, res: Response, next: NextFunction) => {
    const tokenInfo: PrismaUserType = req.body.userInfo;

    const pollId = req.params.id;

    try {
        if (tokenInfo.role === 'ADMIN') {
            return res.status(200).json({ data: (await getPollAsUser(Number(pollId))) });
        } else {
            return res.status(200).json({ data: (await getPollAsUser(Number(pollId))) });
        }
    } catch (error) {
        next(error);
    }
};

export const getPolls = async (req: Request, res: Response, next: NextFunction) => {
    const tokenInfo: PrismaUserType = req.body.userInfo;

    try {
        const limit = parseInt(req.query.limit as string) || 5;
        const offset = parseInt(req.query.offset as string) || 0;
        const sortingMethod = req.query.sort as SortingMethod || 'newest';
        const filterMethod = req.query.filter as Filter || 'undefined';

        const page = await getPrismaPolls(offset, limit, sortingMethod, filterMethod);

        const totalPolls = await countPolls();

        return res.status(200).json({
            total: totalPolls,
            limit,
            offset,
            data: page
        });
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

                if (await getPollFromDiscordId(discordId)) {
                    throw new PrismaClientKnownRequestError("A unique constraint would be violated", { code: "P2002", clientVersion: "", meta: {} });
                }

                const endsAt: Date = new Date((new Date()).getTime() + (60 * 60 * 24 * 1000));

                const userInfo: DiscordUserType = await getUserInfo(discordId);

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

export const createVote = async (req: Request, res: Response, next: NextFunction) => {
    const tokenInfo: PrismaUserType = req.body.userInfo;

    try {
        const { option } = req.body;

        const pollId = Number(req.params.id);

        const prismaPoll = await getPollFromId(pollId);

        if (prismaPoll.options.indexOf(option) == -1) {
            throw new OptionNotValid(option, prismaPoll.options);
        }

        if (await getVote(tokenInfo, prismaPoll)) {
            return res.status(201).json({ data: await editVote(tokenInfo, prismaPoll, option) });
        } else {
            return res.status(201).json({ data: await createPrismaVote(tokenInfo, prismaPoll, option) });
        }
    } catch (error) {
        next(error);
    }
};