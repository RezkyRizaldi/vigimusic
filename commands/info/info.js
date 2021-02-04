const { MessageEmbed } = require('discord.js');
const {
  NAME,
  BUILD
} = require('../../config.json');
const ms = require('ms');

module.exports = {
  name: 'info',
  aliases: ['botinfo', 'vigimusic'],
  category: 'info',
  description: 'VigiMusic Bot Info',
  usage: 'info',
  run: async (client, message) => {
    // console.log(client.queue.size);
    console.log(client.user.presence);
    let embed = new MessageEmbed()
      .setColor(0xffed2a)
      .setTitle(`${NAME} Bot Info`)
      .setTimestamp()
      .setThumbnail(client.user.displayAvatarURL())
      .addField("SERVER", message.guild.name, true)
      // .addField("PRESENCE", client.user.activities[0].name, true)
      .addField("ID", client.user.id, true)
      .addField("UPTIME", ms(client.uptime), true)
      .addField("STATUS", client.user.presence.status, true)
      .addField("TOTAL MEMBERS", client.users.cache.size, true)
      .setFooter(`${NAME} | ${BUILD}`, client.user.displayAvatarURL());
    return message.channel.send(embed);
  }
}