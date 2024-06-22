import { oceanic } from "../client";

export async function getUserInfo(discordId: string) {
    return await oceanic.rest.users.get(discordId);
}