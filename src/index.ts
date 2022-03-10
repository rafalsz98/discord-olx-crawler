import { Client, TextChannel } from "discord.js";
import "dotenv/config";

import * as comparer from "./comparer";

const client = new Client({ intents: "GUILDS" });

client.login(process.env.TOKEN);

client.on("ready", async () => {
  console.log("Bot ready!");
  await comparer.init();
  const guild = await client.guilds.fetch(process.env.GUILD as string);
  const channel = (await guild.channels.fetch(
    process.env.CHANNEL as string
  )) as TextChannel;
  if (channel === null) {
    throw "No channel with given ID";
  }

  console.log("Starting magic!");
  setInterval(async () => {
    const data = await comparer.dataToSend();
    if (data.length !== 0) {
      data.forEach((el) => {
        const formattedDate = el.date.format("YYYY-MM-DD HH:mm");
        const formattedMessage = `Nowa oferta! 🔥\n[${formattedDate}] ${el.title}\n${el.link}`;
        channel.send(formattedMessage);
      });
    }
  }, 1000 * 60 * 3);
});
