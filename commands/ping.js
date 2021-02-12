module.exports = {
  name: "ping",
  description: "Cek ping",
  execute(client, message) {
    return message.channel.send(`${client.ws.ping}ms`);
  }
}