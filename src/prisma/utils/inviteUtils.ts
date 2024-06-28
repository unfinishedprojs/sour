import { Invite } from "@prisma/client";
import { prisma } from "../client";

export async function createInvite(invite: string, discordId?: string) {
    return await prisma.invite.create({
        data: {
            invite: invite,
            discordId: discordId
        }
    });
}

export async function deleteInvite(invite: Invite) {
    await prisma.invite.delete({
        where: {
            invite: invite.invite
        }
    });
}

export async function getInvite(inviteString: string) {
    return await prisma.invite.findUniqueOrThrow({
        where: {
            invite: inviteString
        }
    });
}