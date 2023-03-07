const { Client } = require("discord.js");

module.exports = {
  name: 'ready',
  once: true,

  /**
   * @param {Client} client 
   */
  async execute(client) {

let ayarlar = require("../../finitto")
    
client.user.setPresence({ activities: [{ name: ayarlar.durum, type: ayarlar.type}], status: ayarlar.status})

   console.log(`[LOG] ${client.user.tag} is now online!\n[LOG] Bot serving on Ready to serve in ${client.guilds.cache.size} servers\n[LOG] Bot serving ${client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0).toLocaleString()} users`);
  }
}