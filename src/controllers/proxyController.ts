import { NextFunction, Request, Response } from "express";
import { ParameterNotValid } from "../errors/errors";
import { getProfilePicture as getDiscordProfilePicture } from "../oceanic/utils/users";

export const getProfilePicture = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.params.url) {
            throw new ParameterNotValid('URL is absent (make sure it is also Base64!)');
        }

        const imageUrl = Buffer.from(req.params.url, 'base64').toString('utf-8');

        const image = await (await fetch(imageUrl)).blob();

        res.type(image.type);
        const buffer = await image.arrayBuffer();
        return res.send(Buffer.from(buffer));
    } catch (error) {
        next(error);
    }
};

export const getProfilePictureFromId = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.params.url) {
            throw new ParameterNotValid('DiscordID is absent');
        }

        const imageUrl = await getDiscordProfilePicture(req.params.url);

        console.log(imageUrl);

        const image = await (await fetch(imageUrl)).blob();

        res.type(image.type);
        const buffer = await image.arrayBuffer();
        return res.send(Buffer.from(buffer));
    } catch (error) {
        next(error);
    }
};