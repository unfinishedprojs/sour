import { Client, ActivityTypes, BotCustomActivity } from "oceanic.js";
import { env } from "../server";

export const oceanic = new Client({ auth: env.BOT_AUTH });

oceanic.on("ready", async () => {
  console.log("Ready as", oceanic.user.tag);
  oceanic.editStatus("idle", [
    {
      name: "you explod",
      state: "blowing up",
      type: ActivityTypes.LISTENING,
    } as unknown as BotCustomActivity,
  ]);
});