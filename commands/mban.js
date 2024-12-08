const { SlashCommandBuilder, EmbedBuilder, Embed } = require('discord.js');
const { post } = require("superagent");
const { TeamSpeak } = require('ts3-nodejs-library');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('mb')
    .setDescription(`Mass ban a user from all ${config.SN} assets.`)
    .addUserOption(option =>
      option.setName('user')
        .setDescription('The Discord ID of the user to ban')
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName('reason')
        .setDescription('The reason for the ban (This will be displayed on the website as well as TeamSpeak)')
        .setRequired(true)
    ),

  async execute(interaction, client, config, con) {
    if (interaction.guild.id !== config.mainGuild)
      return interaction.reply({ content: config.mainGuildMsg, ephemeral: true });

    const user = interaction.options.getMember('user')
    const reason = interaction.options.getString('reason');
    const logChannel = client.channels.cache.get(config.modLogs);
    const reqRole = interaction.guild.roles.cache.find(r => r.id === config.JAdmin);
    const permission = reqRole.position <= interaction.member.roles.highest.position;
    if(!permission) return interaction.reply({content: config.noPermMsg, ephemeral: true})
    const userId = (user.id)

    
    // Build Log Embed
            const log = new EmbedBuilder()
            .setTitle('User Mass-Banned')
            .setColor(`${config.embedcolor}`)
            .addFields(
                { name: 'User', value: `<@${userId}>` },
                { name: 'Moderator', value: `<@${interaction.member.id}>` },
                { name: 'Reason', value: `${reason} (Banned by <@${interaction.member.id}>)` },
                { name: 'Channel used in', value: `<#${interaction.channel.id}>` },
            )
            .setImage(config.logo)
            .setTimestamp()
            .setFooter({ text: config.embedfooter, iconURL: config.logo });
    
            logChannel.send({ embeds: [log] });
    
            const userdmembed = new EmbedBuilder()
            .setTitle(`You have been banned from ${config.SN}`)
            .setDescription(`You can find the details below.`)
            .addFields(
              { name: 'User', value: `<@${userId}>` },
              { name: 'Moderator', value: `<@${interaction.member.id}>` },
              { name: 'Reason', value: `${reason}` },
            )
            .setThumbnail(config.logo)
            .setColor(config.embedcolor)
            .setTimestamp()
            .setFooter({ text: config.embedfooter, iconURL: config.logo });
          
            user.send({ embeds: [userdmembed] });

           // Iterate over each server the bot is in
        client.guilds.cache.forEach(async (guild) => {
        try {
          await guild.members.ban(userId, { reason: `${reason} (Banned by ${interaction.member})` });
        } catch (error) {
          console.error(`Error banning user <@${userId}> in server ${guild.id}:`, error);
        }
      });

      interaction.reply(`<@${userId}> has been banned from all ${config.SN} Assets.`)
    
  
      // Ban the user from the website, reset website roles to applicant, and ban user from Teamspeak.
      con.query('SELECT * FROM users WHERE discId = ?', [userId], async (err, rows) => {
        if (err) return interaction.reply({ content: 'Failed to retrieve user information from database.', ephemeral: true });
        if (!rows[0]) return interaction.reply({ content: 'User information not found in database.', ephemeral: true });
  
        const usercache = rows[0];
        post(`https://${config.invisionDomain}/api/core/members/${usercache.webId}/warnings?moderator=1&suspendPermanent&points=100&key=${config.invisionAPI}`) // bans the user from the website
        .set('User-Agent', 'ECRP_Bot/1.0')
        .end((err, res) => {
            if(err) {
                console.log(err)
                return interaction.reply({content: config.errMsg, ephemeral: true})
            }
        })
        post(`https://${config.invisionDomain}/api/core/members/${usercache.webId}?group=3&key=${config.invisionAPI}`) // sets their group ID to the default (applicant role for most)
        .set('User-Agent', 'ECRP_Bot/1.0')
        .end((err, res) => {
            if(err) {
                console.log(err)
                return interaction.reply({content: config.errMsg, ephemeral: true})
            }
        })
        const ts3 = new TeamSpeak({
          host: `${config.TSHost}`,
          queryport: `${config.TSQueryPort}`,
          serverport: `${config.TSServerPort}`,
          username: `${config.TSQueryUsername}`,
          password: `${config.TSQueryPassword}`,
          nickname: `${config.TSNickname}`,
          protocol: 'raw'
      });
    
      try {
          await ts3.connect();
    
          await ts3.execute('banadd', {
              uid: usercache.ts3,
              time: 0, // Permanent ban
              banreason: reason
          });
    
      } finally {
          await ts3.logout();
          ts3.quit();
      }  
    })   
    },
  };
