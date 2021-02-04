// Discord.js Classes
const {
  Client,
  Collection,
  MessageEmbed
} = require('discord.js');

// Packages
const { readdirSync } = require('fs');
const { join } = require('path');

// env
const client = new Client({
  disableEveryone: true,
  disabledEvents: ["TYPING_START"]
});
client.commands = new Collection();
client.queue = new Map();
client.vote = new Map();
const cmdFiles = readdirSync(join(__dirname, "commands")).filter(file => file.endsWith(".js"));
for (const file of cmdFiles) {
  const command = require(join(__dirname, "commands", file));
  client.commands.set(command.name, command)
}

// BOT Config
const {
  TOKEN,
  PREFIX,
  NAME,
  BUILD
} = require('./config.json');

// Events
client.on("ready", () => {
  console.log(`${NAME} ${BUILD} hurung bos!`);
  client.user.setActivity(`[${PREFIX}music] | ${BUILD}`, {
    type: "PLAYING"
  }).catch(console.error);
});

client.on("message", message => {
  if (!message.guild || message.author.bot) return;

  if (message.content.startsWith(PREFIX)) {
    const args = message.content.slice(PREFIX.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    if (!client.commands.has(command)) return;
    try {
      client.commands.get(command).execute(client, message, args)
      console.log(`${message.guild.name}: ${message.author.tag} memakai ${client.commands.get(command).name} di #${message.channel.name}`);
    } catch (err) {
      console.log(err);
      let embed = new MessageEmbed()
        .setTitle("Command Tidak Ditemukan")
        .setColor(0xffed2a)
        .setTimestamp()
        .setDescription(`**${message.member.displayName}**, Command tidak tersedia!`)
        .setFooter(`${NAME} | ${BUILD}`, client.user.displayAvatarURL());
      return message.channel.send(embed);
    }
  }
});

client.on("warn", info => console.log(info));

client.on("error", console.error);

process.stdout.on('error', function( err ) {
  if (err.code == "EPIPE") {
    process.exit(0);
  }
});

client.login(TOKEN);