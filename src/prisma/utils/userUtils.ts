import { Invite, User as PrismaUser } from "@prisma/client";
import { User as DiscordUser } from "oceanic.js";
import { prisma } from "../client";


export async function createUser(discord: DiscordUser, invite: Invite, password: string) {
    return await prisma.user.create({
        data: {
            discordId: discord.id,
            discordSlug: discord.username,
            discordUser: discord.globalName ? discord.globalName : discord.username,
            discordProfilePicture: discord.avatarURL(),
            password: password,
            inviteString: invite.invite
        },
        select: {
            discordId: true,
            discordProfilePicture: true,
            discordSlug: true,
            discordUser: true,
            role: true,
        }
    });
}

export async function deleteUser(user: PrismaUser) {
    await prisma.user.delete({
        where: {
            discordId: user.discordId
        }
    });
}

export async function getUser(discordId: string) {
    return await prisma.user.findUniqueOrThrow({
        where: {
            discordId: discordId
        }
    });
}

export async function getCleanUser(discordId: string) {
    return await prisma.user.findUniqueOrThrow({
        where: {
            discordId
        },
        select: {
            discordId: true,
            discordProfilePicture: true,
            discordSlug: true,
            discordUser: true,
            role: true,
            votes: {
                select: {
                    pollId: true,
                    option: true,
                    poll: {
                        select: {
                            question: true,
                            type: true,
                            options: true,
                            createdAt: true
                        }
                    }
                }
            }
        }
    });
}