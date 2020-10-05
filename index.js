const Discord = require("discord.js");
const client = new Discord.Client();
require("dotenv").config();
const axios = require("axios");

client.on("ready", () => {
  console.log(`${client.user.username} でログインしています。`);
});

async function slack(payload) {
  const webhookUrl = process.env.SLACK_URL;
  const res = await axios.post(webhookUrl, JSON.stringify(payload));
  return res.data;
}

client.on("message", async (msg) => {
  if (msg.content.startsWith("/transfer")) {
    const content = msg.content.replace(/\/transfer/, "");
    const discriminator = msg.author.discriminator;
    const discordChannel = msg.channel.name;
    let name;
    let icon;
    const channel = discordChannel === '一般' ? 'general' : `#${discordChannel}`;
    switch (discriminator) {
      case process.env.FIRST_USER_ID:
        name = process.env.FIRST_USER_NAME;
        icon = process.env.FIRST_USER_ICON;
        break;
      case process.env.SECOND_USER_ID:
        name = process.env.SECOND_USER_NAME;
        icon = process.env.SECOND_USER_ICON;
        break;
      case process.env.THIRD_USER_ID:
        name = process.env.THIRD_USER_NAME;
        icon = process.env.THIRD_USER_ICON;
        break;
      default:
        name = "discord bot";
        icon =
          "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcSUMIW2OWB9xlVW19xZ3UGevsZFv48S-JTnVw&usqp=CAU";
        break;
    }

    slack({
      username: name,
      icon_url: icon,
      text: content,
      channel: channel
    }).then(() => {
      msg.reply("Slackへの送信に成功しました");
    }).catch(() => {
      msg.reply('Slackへの送信に失敗しました。');
    });
  }
});

client.login(process.env.DISCORD_TOKEN);
