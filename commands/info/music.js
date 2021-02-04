const { MessageEmbed } = require('discord.js');
const {
  NAME,
  BUILD
} = require('../../config.json');

module.exports = {
  name: 'musichelp',
  aliases: ['mhelp', 'music'],
  category: 'info',
  description: 'VigiMusic help Command',
  usage: 'music',
  run: async (client, message, args) => {
    let embed = new MessageEmbed()
    .setColor(0xffed2a)
    .setTimestamp()
    .setThumbnail(client.user.displayAvatarURL())
    .setFooter(`${NAME} | ${BUILD}`, client.user.displayAvatarURL());
    
    if (args[0]) {
      const command = await client.commands.get(args[0]);

      if (!command) return message.channel.send("Command Salah");
      embed.setTitle(`${command.name} Help Command`);
      embed.addField("Alias", command.aliases || "Tidak Ada");
      embed.addField("Description", command.description || "Tidak Ada");
      embed.addField("Usage", command.usage || "Tidak Ada");
      return message.channel.send(embed);
    } else {
      const commands = await client.commands;

      let com = {};
      for (let comm of commands.array()) {
        let category = comm.category || "Tidak diketahui";
        let name = comm.name;

        if (!com[category]) {
          com[category] = [];
        }
        com[category].push(name);
      }

      for (const [key, value] of Object.entries(com)) {
        let category = key;
        let desc = "`" + value.join("`, `") + "`";
        embed.setTitle(`${NAME} Help Command`);
        embed.addField(`${category.toUpperCase()}[${value.length}]`, desc);
      }
      return message.channel.send(embed);
    }
  }
}