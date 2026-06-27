import discord
from discord import app_commands
import aiohttp
from datetime import datetime, timezone
import os

TOKEN = os.environ["DISCORD_TOKEN"]

intents = discord.Intents.default()
client = discord.Client(intents=intents)
tree = app_commands.CommandTree(client)


@tree.command(name="wordle", description="Get today's Wordle answer")
async def wordle(interaction: discord.Interaction):
    today = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    url = f"https://www.nytimes.com/svc/wordle/v2/{today}.json"

    try:
        async with aiohttp.ClientSession() as session:
            async with session.get(url) as response:
                if response.status == 200:
                    data = await response.json()
                    solution = data["solution"].upper()

                    await interaction.response.send_message(
                        f"```\n{today}\n{solution}\n```",
                        ephemeral=True
                    )
                else:
                    await interaction.response.send_message(
                        "❌ Failed to fetch today's Wordle answer.", ephemeral=True
                    )
    except Exception as e:
        await interaction.response.send_message(
            f"❌ Error: {str(e)}", ephemeral=True
        )


@client.event
async def on_ready():
    await tree.sync()
    print(f"Bot is online as {client.user}")


client.run(TOKEN)
