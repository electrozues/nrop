import { Client, GatewayIntentBits, SlashCommandBuilder, REST, Routes } from "discord.js";

const TOKEN = process.env.DISCORD_TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
});

// Register the /wordle command
async function registerCommands() {
  const commands = [
    new SlashCommandBuilder()
      .setName("wordle")
      .setDescription("Get today's Wordle answer")
      .toJSON(),
  ];

  const rest = new REST({ version: "10" }).setToken(TOKEN);

  await rest.put(
    Routes.applicationCommands(CLIENT_ID),
    { body: commands }
  );

  console.log("Slash command registered.");
}

client.once("ready", () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === "wordle") {
    await interaction.deferReply();

    try {
      const today = new Date().toISOString().split("T")[0];

      const response = await fetch(
        `https://www.nytimes.com/svc/wordle/v2/${today}.json`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch Wordle.");
      }

      const data = await response.json();

      await interaction.editReply(
        `\`\`\`\n${today}\n${data.solution}\n\`\`\``
      );
    } catch (err) {
      console.error(err);
      await interaction.editReply("Failed to fetch today's Wordle.");
    }
  }
});

(async () => {
  await registerCommands();
  await client.login(TOKEN);
})();
