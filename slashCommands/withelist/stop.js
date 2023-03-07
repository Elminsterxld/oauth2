const { PermissionFlagsBits, ApplicationCommandOptionType, Client, ChatInputCommandInteraction } = require("discord.js")
const { stopList } = require("../..")

module.exports = {
  name: "stop",
  description: "Sunucudan ayrılır.",
  default_permission: true,
  category: "whitelist",
  userPerms: [PermissionFlagsBits.SendMessages],
  ownerOnly: true,
  options: [
    {
      name: "id",
      type: ApplicationCommandOptionType.String,
      description: "Server id",
      required: false,
    },
  ],

  /**
   * 
   * @param {Client} client 
   * @param {ChatInputCommandInteraction} interaction 
   * @param {*} args 
   */
  run: async (client, interaction, args) => {
    await interaction.reply(`Member submission stopped`)
    stopList.set(interaction.options.getString("id",false) ?? interaction.guildId,true)
  }
}
