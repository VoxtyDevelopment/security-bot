const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const mysql = require('mysql2/promise');

const departmentRoles = {
  'LSPD': `${config.LSPD}`,
  'BCSO': `${config.BCSO}`,
  'SASP': `${config.SASP}`,
  'SAFR': `${config.SAFR}`,
  'CIV': `${config.CIV}`,
  'COMMS': `${config.COMMS}`
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName('onboard')
    .setDescription('Save user information to the database and assign department roles')
    .addStringOption(option => 
      option.setName('name')
      .setDescription('Users roleplay name')
      .setRequired(true))
    .addStringOption(option =>
      option.setName('disc')
        .setDescription('Discord ID of the user')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('web')
        .setDescription('Web ID of the user')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('ts3')
        .setDescription('Teamspeak UID of the user')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('hex')
        .setDescription('Steam hex of the user')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('communityid')
        .setDescription('Community ID of the user')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('callsign')
        .setDescription('Callsign of the user')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('department')
        .setDescription('Department of the user')
        .setRequired(true)
        .addChoices(
        { name: 'LSPD', value: 'LSPD'},
        { name: 'BCSO', value: 'BCSO'},
        { name: 'SASP', value: 'SASP'},
        { name: 'SAFR', value: 'SAFR'},
        { name: 'CIV', value: 'CIV'},
        { name: 'COMMS', value: 'COMMS'},
        )),

  async execute(interaction, client, config) {
    const reqRole = interaction.guild.roles.cache.find(r => r.id === config.SIT);
    const permission = reqRole.position <= interaction.member.roles.highest.position;
    if(!permission) return interaction.reply({content: config.noPermMsg, ephemeral: true})
    const discId = interaction.options.getString('disc');
    const webId = interaction.options.getString('web');
    const ts3 = interaction.options.getString('ts3');
    const department = interaction.options.getString('department');
    const roleplayName = interaction.options.getString('name');
    const sh = interaction.options.getString('hex');
    const cid = interaction.options.getString('communityid');
    const callsign = interaction.options.getString('callsign');

    const pool = mysql.createPool(
      {
      connectionLimit: `${config.connectionLimit}`,
      user: `${config.dbuser}`,
      password: `${config.dbpassword}`,
      host: `${config.dbhost}`,
      port: `${config.port}`,
      database: `${config.database}`,
      }
  )

    try {
      const connection = await pool.getConnection();
      await connection.query('INSERT INTO users (name, discId, webId, ts3, steamHex, department, communityID, callsign) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', [roleplayName, discId, webId, ts3, sh, department, cid, callsign]);
      connection.release();

      const guild = client.guilds.cache.get(interaction.guildId);
      const member = guild.members.cache.get(discId);
      const memberRole = guild.roles.cache.get(config.Membership);
      const s1Role = guild.roles.cache.get(config.Whitelist);
      const awaitingVerificationRole = guild.roles.cache.get(config.AwaitingVerRole);
      
      if (memberRole && s1Role) {
        await member.roles.add(memberRole);
        await member.roles.remove(awaitingVerificationRole);
        await member.roles.add(s1Role);
      }

      if (department && departmentRoles[department]) {
        const role = guild.roles.cache.get(departmentRoles[department]);
        if (role) {
          await member.roles.add(role);
        }
      }

      const log = new EmbedBuilder()
        .setTitle('User Onboarded')
        .setColor(`${config.embedcolor}`)
        .addFields(
          { name: 'Discord ID', value: discId },
          { name: 'Web ID', value: webId },
          { name: 'Teamspeak UID', value: ts3 },
          { name: 'Department', value: department || 'Not provided' },
          { name: 'Moderator', value: `<@${interaction.member.id}>` },
        )
        .setTimestamp()
        .setFooter({ text: config.embedfooter, iconURL: config.logo });

      const logChannel = client.channels.cache.get(config.modLogs);
      logChannel.send({ embeds: [log] });

      interaction.reply({ content: 'Onboard successful.', ephemeral: true });
    } catch (error) {
      console.error('Error saving user information to database:', error);
      interaction.reply({ content: 'Failed to onboard user.', ephemeral: true });
    } finally {
      pool.end();
    }
  },
};
