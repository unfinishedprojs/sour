import { Poll, PollType, User } from "@prisma/client";
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

export enum SortingMethod {
    ASCENDINGVOTES = 'ascendingvotes',
    DESCENDINGVOTES = 'descendingvotes',
    NEWEST = 'newest',
    OLDEST = 'oldest'
}

export enum Filter {
    VOTED = 'voted',
    NOTVOTED = 'notvoted',
    ENDED = 'ended',
    NOTENDED = 'notended'
}

export async function getPolls(offset: number, limit: number, sorting: SortingMethod, filter: Filter) {
    const orderBy: { [key: string]: any; }[] = [];
    switch (sorting) {
        case SortingMethod.ASCENDINGVOTES:
            orderBy.push({ votes: { _count: 'asc' } });
            break;
        case SortingMethod.DESCENDINGVOTES:
            orderBy.push({ votes: { _count: 'desc' } });
            break;
        case SortingMethod.NEWEST:
            orderBy.push({ createdAt: 'desc' });
            break;
        case SortingMethod.OLDEST:
            orderBy.push({ createdAt: 'asc' });
            break;
        default:
            throw new Error('Invalid sorting method');
    }

    const where: { [key: string]: any; } = {};
    switch (filter) {
        case Filter.VOTED:
            where.votes = { some: {} }; // adjust according to your schema
            break;
        case Filter.NOTVOTED:
            where.votes = { none: {} }; // adjust according to your schema
            break;
        case Filter.ENDED:
            where.endDate = { lte: new Date() }; // assuming endDate is the field to check
            break;
        case Filter.NOTENDED:
            where.endDate = { gt: new Date() }; // assuming endDate is the field to check
            break;
        default:
            break;
    }

    return await prisma.poll.findMany({
        orderBy,
        where,
        skip: offset,
        take: limit,
        include: {
            _count: {
                select: {
                    votes: true
                }
            }
        }
    });
}

export async function countPolls() {
    return await prisma.poll.count();
}

export async function getPollFromId(pollId: number) {
    return await prisma.poll.findUniqueOrThrow({
        where: {
            pollId
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

export async function getPollFromDiscordId(discordId: string) {
    return await prisma.poll.findFirst({
        where: {
            extraData: {
                path: ['discordId'],
                equals: discordId
            }
        }
    });
}

export async function createVote(user: User, poll: Poll, vote: string) {
    return await prisma.vote.create({
        data: {
            userId: user.discordId,
            pollId: poll.pollId,
            option: vote
        }
    });
}

export async function editVote(user: User, poll: Poll, vote: string) {
    return await prisma.vote.update({
        where: {
            userId_pollId: {
                userId: user.discordId,
                pollId: poll.pollId
            }
        },
        data: {
            option: vote
        }
    });
}

export async function getVote(user: User, poll: Poll) {
    return await prisma.vote.findUnique({
        where: {
            userId_pollId: {
                userId: user.discordId,
                pollId: poll.pollId
            }
        }
    });
}