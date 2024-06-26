import client from "../client";

export async function getUserInfo(discordId: string) {
    return await client.rest.users.get(discordId);
}

export async function getProfilePicture(discordId: string) {
    return (await client.rest.users.get(discordId)).avatarURL();
}