import { Invite, User as PrismaUser } from "@prisma/client";
import { User as DiscordUser } from "oceanic.js";
import { prisma } from "../client";

export async function createUser(discord: DiscordUser, invite: Invite, password: string) {
    const newUser = await prisma.user.create({
        data: {
            discordId: discord.id,
            discordSlug: discord.username,
            discordUser: discord.globalName ? discord.globalName : discord.username,
            discordProfilePicture: discord.avatarURL(),
            password: password,
            inviteString: invite.invite
        }
    });

    return newUser as PrismaUser;
}

export async function deleteUser(user: PrismaUser) {
    await prisma.user.delete({
        where: {
            discordId: user.discordId
        }
    });
}