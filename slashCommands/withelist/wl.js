const discord = require('discord.js')
const { admins } = require('../..')
module.exports = {
  name: "wl",
  description: "Whitelist",
  default_permission: true,
  options: [{
    name: 'add',
    description: "Whitelist ekler.",
    type: 1,
    options: [{
      name: 'user',
      description: "kullanıcı",
      type: discord.ApplicationCommandOptionType.User,
      required: true
    }]
  }, {
    name: 'remove',
    description: "Whitelistten kaldırır.",
    type: 1,
    options: [{
      name: "user",
      description: 'kullanıcı',
      required: true,
      type: discord.ApplicationCommandOptionType.User,
    }]
  }, {
    name: 'list',
    description: "Whitelistleri listeler",
    type: 1,
  },
  ],
  category: "whitelist",
  userPerms: [discord.PermissionFlagsBits.SendMessages],
  ownerOnly: true,

  run: async (client, interaction, args) => {

    let subCommand = interaction.options.getSubcommand()

    if (subCommand === 'add') {
      const user = interaction.options.get("user").user
    
      let users = await admins.findOne({ userId: user.id })
      if(!users) {
        await admins.create({ userId: user.id })
        interaction.reply({embeds: [new discord.EmbedBuilder().setDescription(`**${client.users.resolve(user.id).tag}** added to the whitelist`)]})
      } else {
        interaction.reply({embeds: [new discord.EmbedBuilder().setDescription(`This user is already in whitelist !`).setColor(discord.Colors.Red)]})
      }
    } else if(subCommand === 'remove') {
      const user = interaction.options.get("user").user
    
      let users = await admins.findOne({ userId: user.id })
      if (!users) return interaction.reply({
        embeds: [new discord.EmbedBuilder()
          .setTitle("⛔ ǀ ERROR")
          .setDescription(`I couldnt add this user to the whitelist.`)
          .setFooter({
            text:"F1N"
          })
        ]
      })
      await admins.deleteOne({ userId: user.id })
      return interaction.reply({
        embeds: [new discord.EmbedBuilder()
          .setDescription(` ${client.users.resolve(user.id).tag} removed from whitelist.`)
          .setFooter({
            text:"F1N"
          })
        ]
      })
    } else if(subCommand === 'list') {
      const total = await admins.find()

      var content = ""
      const blrank = total.filter((data) => data.userId).sort((a, b) => b.data - a.data);
      
      for(let i in blrank) {
        if(blrank[i].data === null) blrank[i].data = 0;
        content +=  `\`${blrank.indexOf(blrank[i]) + 1}\` ${client.users.resolve(blrank[i].userId).tag} (\`${client.users.resolve(blrank[i].userId).id}\`)\n`
      }

      interaction.reply({embeds: [{
        title: "Whitelist Users",
        description: `${content}`,
        foother:"F1N"
    }]})
    }
  }
}