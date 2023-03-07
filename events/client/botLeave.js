
const discord = require('discord.js');
const finitto = require("../../finitto")

module.exports = {
  name: 'guildDelete',

  async execute(guild, client) {

    const welcomer = new discord.WebhookClient({
      url: finitto.webhooks.general
    })

    welcomer.send({ embeds: [new discord.EmbedBuilder().setTitle('Sunucudan ayrıldı').setColor(discord.Colors.Red).setDescription(`• **ID
** \`${guild.id}\`\n• **Name** \`${guild.name}\`\n• **Bot** \`${client.user.username}\``)]})
  }
}