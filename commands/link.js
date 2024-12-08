const { SlashCommandBuilder } = require('discord.js');
const mysql = require('mysql2');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('link')
    .setDescription('Link your account with the database')
    .addStringOption(option =>
      option.setName('ts3')
        .setDescription('Your TS3 UID')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('web')
        .setDescription('Your Web ID')
        .setRequired(true)),

  async execute(interaction, client, config) {
    if (config.linkCommandDisabled) {
      return interaction.reply({ content: 'Link your account with the database.', ephemeral: true });
    }

    const reqRole = interaction.guild.roles.cache.find(r => r.id === config.Membership);
    const permission = reqRole.position <= interaction.member.roles.highest.position;
    if(!permission) return interaction.reply({content: config.noPermMsg, ephemeral: true})

    const discId = interaction.user.id;
    const ts3 = interaction.options.getString('ts3');
    const web = interaction.options.getString('web');

    const pool = mysql.createPool({
        connectionLimit: `${config.connectionLimit}`,
        user: `${config.dbuser}`,
        password: `${config.dbpassword}`,
        host: `${config.dbhost}`,
        port: `${config.port}`,
        database: `${config.database}`,
    });

    pool.getConnection((err, connection) => {
      if (err) {
        console.error('Error getting MySQL connection:', err);
        return interaction.reply({ content: 'Failed to link your account with the database.', ephemeral: true });
      }

      // Check if the user's Discord ID already exists in the database
      connection.query('SELECT * FROM users WHERE discId = ?', [discId], (error, results) => {
        if (error) {
          connection.release();
          console.error('Error checking if Discord ID exists in database:', error);
          return interaction.reply({ content: 'Failed to link your account with the database.', ephemeral: true });
        }

        if (results.length > 0) {
          connection.release();
          return interaction.reply({ content: 'Your account is already linked with the database.', ephemeral: true });
        }

        // Insert new record if Discord ID doesn't exist
        connection.query('INSERT INTO users (discId, webId, ts3) VALUES (?, ?, ?)', [discId, web, ts3], (insertError, insertResults) => {
          connection.release();

          if (insertError) {
            console.error('Error linking Discord ID with TS3 and Web ID:', insertError);
            return interaction.reply({ content: 'Failed to link your account with the database.', ephemeral: true });
          }

          interaction.reply({ content: 'Successfully linked your account with the database.', ephemeral: true });
        

        
        });});
    });
  },
};