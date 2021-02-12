const { MessageEmbed } = require('discord.js');
const { readdirSync } = require('fs');
const {
  NAME,
  BUILD
} = require('../config.json');

module.exports = {
  name: 'music',
  description: 'VigiMusic help Command',
  execute(client, message) {
    let embed = new MessageEmbed()
      .setColor(0xffed2a)
      .setTitle(`${NAME} Help Command`)
      .setTimestamp()
      .setThumbnail(client.user.displayAvatarURL())
      .setFooter(`${NAME} | ${BUILD}`, client.user.displayAvatarURL());

    let command = readdirSync("./commands");

    for (let i = 0; i < command.length; i++) {
      console.log(command[i]);
      const cmd = client.commands.get(command[i].replace(".js", ""));
      embed.addField(`**${cmd.name}**`, cmd.description, true)
    }
    return message.channel.send(embed);
  }
}