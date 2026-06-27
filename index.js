import { Client, GatewayIntentBits } from "discord.js";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

const PREFIX = "nrop";

client.once("ready", () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  if (message.content.toLowerCase() !== `${PREFIX} wordle`) return;

  try {
    const today = new Date().toISOString().split("T")[0];

    const res = await fetch(
      `https://www.nytimes.com/svc/wordle/v2/${today}.json`
    );

    const data = await res.json();

    await message.reply(
      `\`\`\`\n${today}\n${data.solution}\n\`\`\``
    );
  } catch (err) {
    console.error(err);
    await message.reply("Failed to fetch today's Wordle.");
  }
});

client.login(process.env.DISCORD_TOKEN);
