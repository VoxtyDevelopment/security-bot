const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('lookup')
    .setDescription(`Lookup user information from the ${config.SN} database.`)
    .addUserOption(option =>
      option.setName('user')
        .setDescription('The Discord ID of the user to lookup')
        .setRequired(true)
    ),

  async execute(interaction, client, config, con) {
    const usera = interaction.options.getMember('user');
    const userId = (usera.id)
    
    con.query('SELECT * FROM users WHERE discId = ?', [userId], async (err, rows) => {
      if (err) return interaction.reply({ content: 'Failed to retrieve user information from database.', ephemeral: true });
      if (!rows[0]) return interaction.reply({ content: 'User information not found in database.', ephemeral: true });

      const user = rows[0];
      const embed = new EmbedBuilder()
        .setTitle('User Lookup')
        .setColor(`${config.embedcolor}`)
        .setThumbnail(config.logo)
        .setTimestamp()
        .setFooter({ text: config.embedfooter, iconURL: config.logo });

      if (user.name) embed.addFields({ name: 'Name', value: user.name });
      if (user.discId) embed.addFields({ name: 'Discord ID', value: `${user.discId} + <@${user.discId}>` });
      if (user.webId) embed.addFields({ name: 'Web ID', value: user.webId });
      if (user.ts3) embed.addFields({ name: 'Teamspeak UID', value: user.ts3 });
      if (user.callsign) embed.addFields({ name: 'Callsign', value: user.callsign });
      if (user.communityID) embed.addFields({ name: 'Community ID', value: user.communityID });
      
      embed.setTimestamp().setFooter({ text: config.embedfooter, iconURL: config.logo });
      interaction.reply({ embeds: [embed] });
    });
  },
};
