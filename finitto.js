const { ActivityType, PresenceUpdateStatus } = require("discord.js");

module.exports = {
  client: "",
  client_id: "", // client id du ",
  client_secret:"",
  redirect_uri: "", //redirect url
  footer: "Elminsterxld#0001 & Bladrun#1000", //Değiştirme
  support: "", //koymasan da olur
  owners: ["", "", "", ""], //örnek ["owner_1_id", "owner_2_id"])
  token:"",
  webhooks:{
    general:"",
    join:""
  },
  durum: "Verifying Users",
  type:ActivityType.Playing,
  status:PresenceUpdateStatus.DoNotDisturb,
}
