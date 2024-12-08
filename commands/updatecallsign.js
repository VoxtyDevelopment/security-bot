const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const mysql = require('mysql2/promise');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('updatecallsign')
        .setDescription('Updates a users callsign.')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('The users whos callsign is getting updated')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('callsign')
                .setDescription('The users new callsign')
                .setRequired(true)),

    async execute(interaction, client, config, con) {
        const reqRole = interaction.guild.roles.cache.find(r => r.id === config.SIT);
        const permission = reqRole.position <= interaction.member.roles.highest.position;
        if(!permission) return interaction.reply({content: config.noPermMsg, ephemeral: true })
        
        const logChannel = client.channels.cache.get(config.modLogs);
        if (!logChannel) {
            console.error(`Log channel with ID ${config.modLogs} not found.`);
            await interaction.reply({ content: "Log channel not found.", ephemeral: true });
            return;
        }

        const newcallsign = interaction.options.getString('callsign');

        const user = interaction.options.getUser('user');
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

        const connection = await pool.getConnection();
        
        try {
            con.query('SELECT * FROM users WHERE discId = ?', [user.id], async (err, rows) => {
                if (err) return interaction.reply({ content: 'Failed to retrieve user information from database.', ephemeral: true });
                if (!rows[0]) return interaction.reply({ content: 'User information not found in database.', ephemeral: true });
          
            const usercache = rows[0];
            await connection.query(`UPDATE users SET callsign = ? WHERE discId = ?`, [newcallsign, user.id]);
            connection.release();

            const member = await interaction.guild.members.fetch(user.id);

            await member.setNickname(`${usercache.name} ${newcallsign}`);
        })
        } catch (err) { 
            console.log(err);
            return interaction.reply({ content: config.errMsg, ephemeral: true });
        }

        const logembed = new EmbedBuilder()
        .setTitle('Callsign Updated')
        .setDescription('The users callsign has been updated.')
        .setFields(
            { name: 'User', value: `<@${user.id}>` },
            { name: 'Moderator', value: `<@${interaction.user.id}>` },
            { name: 'Channel used in', value: `<#${interaction.channel.id}>` },
        )
        .setColor(config.embedcolor)
        .setThumbnail(config.logo)
        .setTimestamp()
        .setFooter({ text: config.embedfooter, iconURL: config.logo });

        await logChannel.send({ embeds: [logembed] });

        await interaction.reply({ content: `<@${user.id}>'s callsign has been updated to ${newcallsign} in the ${config.SN} database.`});
}
}
