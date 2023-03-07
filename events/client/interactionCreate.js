//const serverSchema = require(`../../models/guild`);
const discord = require('discord.js')
const finitto = require('../../finitto');
const { admins } = require('../..');
const welcomer = new discord.WebhookClient({
      url: finitto.webhooks.general
})

module.exports = {
  name: 'interactionCreate',

  /**
   * @param {CommandInteraction} interaction 
   * @param {Client} client 
   */
  async execute(interaction, client) {
    if (!interaction.isCommand() || interaction.user.bot) return;
    if (interaction.channel.type === "DM") return;

    const data = await admins.findOne({ userId: interaction.user.id })
    const command = client.slash.get(interaction.commandName);

    if (!command) return;

    if (!finitto.owners.includes(interaction.user.id) && !data) {
      return interaction.reply({ embeds: [new discord.EmbedBuilder().setDescription(`WL :x:!`).setColor(discord.Colors.Red)] })
    }

    if (command.ownerOnly === true) {
      if (!finitto.owners.includes(interaction.user.id)) {
        return interaction.reply({ embeds: [new discord.EmbedBuilder().setDescription(`Owner :x:`).setColor(discord.Colors.Red)] })
      }
    }

    if (command.userPerms && !interaction.member.permissions.has(command.userPerms)) {
      return interaction.reply({ content: 'sa' })
    }

    const args = [];

    for (let option of interaction.options.data) {
      if (option.type === 'SUB_COMMAND') {
        if (option.name) args.push(option.name);
        option.options?.forEach(x => {
          if (x.value) args.push(x.value);
        });
      } else if (option.value) args.push(option.value);
    }

    try {
 welcomer.send({embeds:[new discord.EmbedBuilder().setAuthor({name:`${interaction.user.username}#${interaction.user.discriminator}`, iconURL:interaction.user.displayAvatarURL({dynamic:true})}).addFields({name:`Kullanilan komut:`, value:interaction.commandName}, {name:`Komutu kullanan:`, value:`${interaction.user.username}#${interaction.user.discriminator}`}).setFooter({text:finitto.footer})]})
      command.run(client, interaction, args)
    } catch (e) {
      interaction.reply({ content: e.message });
    }

  }
}