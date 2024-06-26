import { PollType } from "@prisma/client";
import { prisma } from "../client";

export async function createPoll(type: PollType, question: string, endsAt: Date, options?: string[], data?: object) {
    return await prisma.poll.create({
        data: {
            type,
            question,
            endsAt,
            options,
            extraData: data
        },
        select: {
            pollId: true,
            question: true,
            type: true,
            options: true,
            extraData: true
        }
    });
}

export async function getPollAsUser(pollId: number) {
    return await prisma.poll.findUniqueOrThrow({
        where: {
            pollId
        },
        select: {
            pollId: true,
            type: true,
            question: true,
            options: true,
            createdAt: true,
            endsAt: true,
            extraData: true,
            _count: {
                select: {
                    votes: true
                }
            }
        },
    });
}

export async function getPollFromId(discordId: string) {
    return await prisma.poll.findFirst({
        where: {
            extraData: {
                path: ['discordId'],
                equals: discordId
            }
        }
    });
}