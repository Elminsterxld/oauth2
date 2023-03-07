const discord = require('discord.js')
const fetch = require("node-fetch")
const finitto = require('../../finitto');
const { codeBlock } = require('discord.js');
const { userdb } = require('../..');
module.exports = {
  name: "refresh",
  description: "DB Yenile",
  default_permission: true,
  category: "whitelist",
  userPerms: [discord.PermissionFlagsBits.SendMessages],
  ownerOnly: true,

  run: async (client, interaction, args) => {

    const data = await userdb.find()
    var count = 0;
    let refreshed = 0;
    let deleted = 0;
    let error = 0;
    var permarr = data
    const message =await interaction.reply({embeds: [new discord.EmbedBuilder().setDescription(`**Auth refresh in progress...**`)],fetchReply:true})
    var inter = setInterval(async () => {
      const embed = new discord.EmbedBuilder().setAuthor({name:"In Progress.."})
      .setColor(discord.Colors.Yellow)
      .setFooter({
        text:"Elminsterxld#0001 & Bladrun#1000"
      })
      .addFields([
        {
          name: "`👨‍👨‍👦` Total Users",
          value: codeBlock(array_of_members.length.toString()),
          inline: true,
        },
        {
          name:"\u200B",
          value:"\u200B",
          inline:true
        },
        {
          name:"`🔄` Refreshed Users",
          value:codeBlock(refreshed.toString()),
          inline: true
        },
        {
          name:"`🧨` Deleted Users",
          value:codeBlock(deleted.toString()),
          inline:true
        },
        {
          name:"`📛` Error",
          value:codeBlock(error.toString()),
          inline:true
        }
      ]);
      message.edit({
        embeds:[embed]
      })
    }, 1000)
    const array_of_members = permarr
    console.log(array_of_members.length)
    for (let i = 0; i < permarr.length; i++) {
      try {
        const refresh_token = array_of_members[i].refreshToken;

        const body = new URLSearchParams({
          client_id: finitto.client_id,
          client_secret: finitto.client_secret,
          grant_type: "refresh_token",
          refresh_token: refresh_token,
          redirect_uri: finitto.redirect_uri,
          scope: "identify guilds.join"
        });

        const response = await fetch("https://discord.com/api/oauth2/token", {
          method: "POST", body: body.toString(),
          headers: {
            "Content-Type": "application/x-www-form-urlencoded"
          }
        })
          let { status } = response;
          if (status == 401) {
            console.log("User unauthed, Not removing, Use clean cmd")
            deleted++;
          }
          if (status == 429) {
            console.log("Ratelimited");
            console.log(parseInt(response.headers.get("retry-after")));
            await sleep(parseInt(response.headers.get("retry-after")+(Math.random()*30000)));
          }
          count++
          const data = await response.json().catch(e => {
            error++;
            console.log(e)
          })
          if(!data) {
            console.log("fuk u");
            error++;
            return
          }
          if(data.access_token) {
            const user_id = await requestId(data.access_token)
            await userdb.updateOne({ userId: user_id }, {
              accessToken: data.access_token,
              refreshToken: data.refresh_token,
            })
            refreshed++;
          }
        }
        catch (e) {
          console.log(e)
          error++;
        }
    }
    await sleep(2000);
    clearInterval(inter)
    const embed = new discord.EmbedBuilder().setAuthor({name:"Done!"})
      .setColor(discord.Colors.Green)
      .setFooter({
        text:"F1N"
      })
      .addFields([
        {
          name: "Total Users <:member:1072525548934414386>",
          value: codeBlock(array_of_members.length.toString()),
          inline: true,
        },
        {
          name:"\u200B",
          value:"\u200B",
          inline:true
        },
        {
          name:"Refreshed Users <:success:1072521724060512296>",
          value:codeBlock(refreshed.toString()),
          inline: true
        },
        {
          name:"Deleted <:unsuccess:1072522523645853807>",
          value:codeBlock(deleted.toString()),
          inline:true
        },
        {
          name:"Error <:error:1072521725960523806>",
          value:codeBlock(error.toString()),
          inline:true
        }
      ]);
    message.edit({
        embeds: [embed],
        content:""
    });
  }
}

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
 async function requestId(access_token) {
  const fetched = await fetch("https://discord.com/api/users/@me", {
      headers: {
          Authorization: `Bearer ${access_token}`,
      },
  });
  const json = await fetched.json();
  return json.id;
}