const discord = require('discord.js')
const index = require('../..')
const { userdb } = require('../..')
module.exports = {
  name: "users",
  description: "total users",
  default_permission: true,
  category: "whitelist",
  userPerms: [discord.PermissionFlagsBits.SendMessages],
  ownerOnly: false,

  run: async (client, interaction, args) => {

    const data = await userdb.find()
    const datatr = await userdb.find({ country_code: "TR" })
    interaction.reply({
      embeds: [new discord.EmbedBuilder()
        .setAuthor({
          name:"List of the users"
        })
        .addFields([
          {
            name:"`👨‍👨‍👦` Total Users",
            value:discord.codeBlock(data.length.toString())
          }
        ])
        .setFooter({
          text:"Elminsterxld#0001 & Bladrun#1000"
        })
      ]
    })
    //:flag_tr: \`${datatr.length}\`
  }
}
