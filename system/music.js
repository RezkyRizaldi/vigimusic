const ytdl = require('ytdl-core');
const { MessageEmbed } = require('discord.js');
const { QUEUE_LIMIT } = require('../config.json');

module.exports = {
  async play (song, message) {
    const queue = message.client.queue.get(message.guild.id);
    let embed = new MessageEmbed()
    .setColor("RED");
    if (!song) {
      queue.channel.leave();
      message.client.queue.delete(message.guild.id);
      embed.setAuthor("TES");
      return queue.textChannel
        .send(embed)
        .catch(console.error);
    }
    try {
      var stream = await ytdl(song.url, {
        highWaterMark: 1 << 25
      });
    } catch (err) {
      if (queue) {
        queue.songs.shift();
        module.exports.play(queue.songs[0], message);
      }

      if (err.message.includes === "copyright") {
        return message.channel.send("Copyright euy");
      } else {
        console.log(err);
      }
    }

    const dispatcher = queue.connection
      .play(stream)
      .on("finish", () => {
        if (queue.loop) {
          let lastSong = queue.songs.shift();
          queue.song.push(lastSong);
          module.exports.play(queue.songs[0], message);
        } else {
          queue.songs.shift();
          module.exports.play(queue.songs[0], message);
        }
      })
      .on("error", console.error);

    dispatcher.setVolumeLogarithmic(queue.volume / 100);
    embed.setAuthor("Jalan", message.client.user.displayAvatarURL())
         .setDescription(`**[${song.title}](${song.url})**`);

    queue.textChannel
      .send(embed)
      .catch(err => message.channel.send("Teu Jalan"));
  }
}