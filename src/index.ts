import { Client, TextChannel } from "discord.js";
import "dotenv/config";

import * as comparer from "./comparer";
import { getSinglePageDescription } from "./olx";
import { getCompletionInfo } from "./openai";

const client = new Client({ intents: "Guilds" });

client.login(process.env.TOKEN);

client.on("ready", async () => {
  console.log("Bot ready!");
  await comparer.init();
  const guild = await client.guilds.fetch(process.env.GUILD as string);
  const channel = (await guild.channels.fetch(
    process.env.CHANNEL as string,
  )) as TextChannel;
  if (channel === null) {
    throw "No channel with given ID";
  }

  console.log("Starting magic!");
  setInterval(
    async () => {
      const data = await comparer.dataToSend();
      if (data.length !== 0) {
        for await (const el of data) {
          const description = await getSinglePageDescription(el.link);
          let aiCompletion = "Opis nieznaleziony";

          if (description) {
            aiCompletion = await getCompletionInfo(description);
          }
          const formattedDate = el.date.format("YYYY-MM-DD HH:mm");
          const formattedMessage = `Nowa oferta! 🔥\n[${formattedDate}] ${el.title}\n${el.link}\n\n\n${aiCompletion}`;
          channel.send(formattedMessage);
        }
      }
    },
    1000 * 60 * 3,
  );
});
