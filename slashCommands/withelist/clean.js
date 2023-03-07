const discord = require('discord.js')
const {userdb} = require("../../index")
const fetch = require("node-fetch");

module.exports = {
  name: "clean",
  description: "DB temizle",
  default_permission: true,
  category: "whitelist",
  userPerms: [discord.PermissionFlagsBits.SendMessages],
  ownerOnly: true,
  /**
   * 
   * @param {*} client 
   * @param {discord.ChatInputCommandInteraction} interaction 
   * @param {*} args 
   */
  run: async (client, interaction, args) => {

    const data = await userdb.find()
    var count = 0;
    var permarr = data
    const array_of_members = permarr;

    const messsage = await interaction.reply({ embeds: [new discord.EmbedBuilder().setDescription(`**Cleaning invalid users**`)],fetchReply:true })

    for (let i = 0; i < array_of_members.length; i++) {
      try {
        const access_token = array_of_members[i].accessToken;
        fetch("https://discord.com/api/users/@me", { headers: { Authorization: `Bearer ${access_token}` } }).then(async (response) => {
          await response.json().catch((err) => { });
          let { status } = response;
          if (status === 401) {
            count++;
            await userdb.deleteOne({ accessToken: access_token });
          }
          if (status === 429) {
            console.log("Ratelimited");
            console.log(parseInt(response.headers.get("retry-after")));
            await sleep(parseInt(response.headers.get("retry-after")+(Math.random()*10000)));
          }
        })

      } catch (e) {

      }
    }
    await sleep(10000)
    const embed = new discord.EmbedBuilder()
    .setAuthor({name:"Cleaned Users"})
    .setColor(discord.Colors.Green)
    .setFields([
      {
        name:"`🔃` Remaining Users",
        value:discord.codeBlock((array_of_members.length-count).toString())
      },
      {
        name:"`📛` Deleted Users",
        value:discord.codeBlock(count.toString())
      }
    ])
    messsage.edit({
      embeds: [embed],
    });
  }
}

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}