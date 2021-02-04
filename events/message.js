const {
  PREFIX,
  NAME,
  BUILD
} = require('./../config.json');

module.exports.run = async (client, message) => {
  if (!message.guild || message.author.bot) return;

  const prefix = message.content.slice(PREFIX.length);
  if (!prefix) return;
  if (!message.member) message.member = await message.guild.members.fetch(message);
  const args = prefix.trim().split(/ +/g);
  const cmd = args.shift().toLowerCase();

  if (cmd.length === 0) return;
  let command = client.commands.get(cmd);
  if (!command) command = client.commands.get(client.aliases.get(cmd));
  if (!command) return;
  if (command) {
    try {
      command.run(client, message, args);
      console.log(`${message.guild.name}: ${message.author.tag} memakai ${command.name} di #${message.channel.name}`);
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
}