const { EmbedBuilder, codeBlock } = require("@discordjs/builders");
const { Colors, ApplicationCommandOptionType, PermissionFlagsBits, ChatInputCommandInteraction } = require("discord.js");
const { userdb, stopList } = require("../..");
async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

module.exports = {
  name: "join",
  description: "Girilen sayıda kullanıcıyı sunucuya çeker",
  default_permission: true,
  options: [
    {
      name: "amount",
      type: ApplicationCommandOptionType.Integer,
      description: "Kaç kişiyi sunucuya girdirmek istiyorsun ?",
      required: true,
    },
  ],
  category: "whitelist",
  userPerms: [PermissionFlagsBits.SendMessages],
  ownerOnly: true,
  /**
   * 
   * @param {*} client 
   * @param {ChatInputCommandInteraction} interaction 
   * @param {*} args 
   */
  run: async (client, interaction, args) => {
    const amount = interaction.options.getInteger("amount");
    const data = await userdb.find();

    let error = 0;
    let success = 0;
    let already_joined = 0;
    let server_limit = 0
    const array_of_members = data;
    let canceled = false
    const message = await interaction.reply({content:`Starting...`,fetchReply:true});
    var inter = setInterval(async () => {
      const embed = new EmbedBuilder().setAuthor({name:"In Progress.."})
      .setColor(Colors.Yellow)
      .addFields([
        {
          name: "`👨‍👨‍👦` Total Users",
          value: codeBlock(array_of_members.length.toString()),
          inline: true,
        },
        {
          name:"`🤝` Desired Users",
          value:codeBlock(amount.toString()),
          inline: true
        },
        {
          name:"`🚀`Success",
          value:codeBlock(success.toString()),
          inline: true
        },
        {
          name:"`🎭` Already on Server",
          value:codeBlock(already_joined.toString()),
          inline:true
        },
        {
          name:"`🌕` Server Limit",
          value:codeBlock(server_limit.toString()),
          inline:true
        },
        {
          name:"`❌` Error",
          value:codeBlock(error.toString()),
          inline:true
        }
      ]);
      message.edit({embeds:[embed],content:""})
    }, 1000);
    for (let i = 0; i < parseInt(amount); i++) {
      if (stopList.has(interaction.guild.id)) {
        stopList.delete(interaction.guild.id)
        canceled = true
        break
      }
      if (!array_of_members[i]) {
        await new Promise(res => setTimeout(res,100))
        continue
      }
      const user = await client.users
        .fetch(array_of_members[i].userId)
        .catch(() => {});
      if (interaction.guild.members.cache.get(array_of_members[i].userId)) {
        already_joined++;
        console.log(`✔️ ${user.tag}`);
      } else {
        await interaction.guild.members
          .add(user, { accessToken: array_of_members[i].accessToken })
          .then(() => {
            success++;
            console.log(`✔️ ${user.tag}`);
          })
          .catch((e) => {
            if (e.code == 30001) {
              server_limit++;
            }
            else {
              error++;
            }
            console.log(`❌ ${user.tag}`,e);
          });
      }
    }

    await clearInterval(inter);
    const embed = new EmbedBuilder().setAuthor({name:canceled ? "Canceled" : "Done!"})
    .setColor(canceled ? Colors.Red :Colors.Green)
    .addFields([
      {
        name: "`👨‍👨‍👦` Total Users",
        value: codeBlock(array_of_members.length.toString()),
        inline: true,
      },
      {
        name:"`🤝` Desired Users",
        value:codeBlock(amount.toString()),
        inline: true
      },
      {
        name:"🚀`Success",
        value:codeBlock(success.toString()),
        inline: true
      },
      {
        name:"`🎭` Already on Server",
        value:codeBlock(already_joined.toString()),
        inline:true
      },
      {
        name:"`🌕` Server Limit",
        value:codeBlock(server_limit.toString()),
        inline:true
      },
      {
        name:"`❌` Error",
        value:codeBlock(error.toString()),
        inline:true
      }
    ]);
    await message.edit({
      content: "",
      embeds: [embed],
    });
  },
};
