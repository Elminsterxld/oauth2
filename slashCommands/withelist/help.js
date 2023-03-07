const discord = require("discord.js");
const finitto = require("../../finitto");

module.exports = {
  name: "help",
  description: "Bot hakkında bilgi verir",
  default_permission: true,
  category: "whitelist",
  userPerms: [discord.PermissionFlagsBits.SendMessages],
  ownerOnly: false,

  run: async (client, interaction, args) => {
    await interaction.reply({
      embeds: [
        new discord.EmbedBuilder()
          .setTitle(`Bot Komutları`)
          .setDescription(`/user kullanıcı sayısını gösterir
/refresh kullanıcıları tazeler taptazeeeeeeeeeeeeeeeeeeeee
/clean db yi temizler mis gibi yapar
/join ve /pull misler gibi üyeleri sunucuya gönderme falan fistan işi
/ping de bilmeyen siktirsin gitsin beybi ❤️
/wl add /wl remove /wl list anlarsın ya <:shy:1073927510028464139>
/server da sw ekle cıkar editle falan fıstık iyi komuttur
/stop da durduruyo qnq daha neyini anlamadım sıtop işte`)
          .setFooter({
            text: "Elminsterxld#0001 & Bladrun#1000",
          }),
      ],
      ephemeral: false,
    });
  },
};
