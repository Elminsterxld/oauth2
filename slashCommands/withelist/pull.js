const discord = require("discord.js");
const { EmbedBuilder, codeBlock } = require("@discordjs/builders");
const { userdb, stopList } = require("../..");
async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

module.exports = {
  name: "pull",
  description: "Girilen sayıda kullanıcıyı sunucuya çeker",
  default_permission: true,
  options: [
    {
      name: "id",
      type: discord.ApplicationCommandOptionType.String,
      description: "Sunucu id.",
      required: true,
    },
    {
      name: "amount",
      type: discord.ApplicationCommandOptionType.Integer,
      description: "Kaç kişiyi sunucuya girdirmek istiyorsun ?",
      required: true,
    },
  ],
  category: "whitelist",
  userPerms: [discord.PermissionFlagsBits.SendMessages],
  ownerOnly: true,

  run: async (client, interaction, args) => {
    try {
      const sunucuid = interaction.options.getString("id");
      const amount = interaction.options.getInteger("amount");
      const data = await userdb.find();

      let error = 0;
      let success = 0;
      let already_joined = 0;
      const array_of_members = data;
      let server_limit = 0;
      let canceled = false;
      let sunucu = await client.guilds.cache.get(sunucuid);

      const message = await interaction.reply({content:`Starting...`,fetchReply:true});
      var inter = setInterval(async () => {
        const embed = new EmbedBuilder()
          .setAuthor({ name: "In Progress.." })
          .setColor(discord.Colors.Yellow)
          .setFooter({
            text: "Elminsterxld#0001 & Bladrun#1000",
          })
          .addFields([
            {
              name: "`👨‍👨‍👦` Total Users",
              value: codeBlock(array_of_members.length.toString()),
              inline: true,
            },
            {
              name: "`🤝` Desired Users",
              value: codeBlock(amount.toString()),
              inline: true,
            },
            {
              name: "`🚀`Success",
              value: codeBlock(success.toString()),
              inline: true,
            },
            {
              name: "`🎭` Already on Server",
              value: codeBlock(already_joined.toString()),
              inline: true,
            },
            {
            name:"`🌕` Server Limit",
            value:codeBlock(server_limit.toString()),
            inline:true
          },
            {
              name: "`❌` Error",
              value: codeBlock(error.toString()),
              inline: true,
            },
          ]);
        message.edit({
          embeds: [embed],
          content: "",
        }).catch(() => interaction.message.edit({
          embeds: [embed],
          content: "",
        }))
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
        if (sunucu.members.cache.get(array_of_members[i].userId)) {
          already_joined++;
          console.log(`✔️ ${user.tag}`);
        } else {
          await sunucu.members
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
      .setColor(canceled ? discord.Colors.Red :discord.Colors.Green)
        .setFooter({
          text: "F1N",
        })
        .addFields([
          {
            name: "Total Users <:member:1072525548934414386> ",
            value: codeBlock(array_of_members.length.toString()),
            inline: true,
          },
          {
            name: "Desired Users 🤝",
            value: codeBlock(amount.toString()),
            inline: true,
          },
          {
            name: "Success <:success:1072521724060512296>",
            value: codeBlock(success.toString()),
            inline: true,
          },
          {
            name: "Already on Server <:unsuccess:1072522523645853807>",
            value: codeBlock(already_joined.toString()),
            inline: true,
          },
          {
            name:"Server limit <a:serverlimit:1073945026729611396>",
            value:codeBlock(server_limit.toString()),
            inline:true
          },
          {
            name: "Error <:error:1072521725960523806>",
            value: codeBlock(error.toString()),
            inline: true,
          },
        ]);
      await message.edit({
        embeds: [embed],
      });
    } catch (e) {
      console.log(e)
      await interaction.channel.send({
        embeds: [
          new discord.EmbedBuilder().setTitle("Bir hata olustu").setFooter({
            text: "F1N",
          }),
        ],
        ephemeral: true,
      });
    }
  },
};
