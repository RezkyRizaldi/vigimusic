// Discord.js Classes
const {
  Client,
  Collection
} = require('discord.js');

// env
const client = new Client({
  disableEveryone: true,
  disabledEvents: ["TYPING_START"]
});
client.commands = new Collection();
client.aliases = new Collection();
["command", "events"].forEach(handler => {
  require(`./handlers/${handler}`)(client);
});

// BOT Config
const { TOKEN } = require('./config.json');

process.stdout.on('error', function( err ) {
  if (err.code == "EPIPE") {
    process.exit(0);
  }
});

client.login(TOKEN);