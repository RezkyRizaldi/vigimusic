module.exports = {
  name: "ping",
  aliases: ["cekping", "cp"],
  category: 'info',
  description: "Cek ping",
  usage: "ping",
  run: async (client, message) => {
    return message.channel.send(`${client.ws.ping}ms`);
  }
}