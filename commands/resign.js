const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { post } = require("superagent");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('resign')
        .setDescription('Resign a member with either proper or improper reason')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('The member you want to resign')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('The reason for resignation')
                .addChoices(
                    { name: 'Proper', value: 'proper'},
                    { name: 'Proper 15 Day', value: 'properban'},
                    { name: 'Improper', value: 'improper'}
                )
                .setRequired(true)),

    async execute(interaction, client, config, con) {
        const reqRole = interaction.guild.roles.cache.find(r => r.id === config.SStaff);
        const permission = reqRole.position <= interaction.member.roles.highest.position;
        const user = interaction.options.getMember('user');
        const reason = interaction.options.getString('reason');
        const logChannel = client.channels.cache.get(config.modLogs);
        const userId = (user.id)

        if (!permission) return interaction.reply({ content: config.noPermMsg, ephemeral: true });

        if (reason === 'proper') {
            // Give role
            const retireRole = interaction.guild.roles.cache.find(role => role.id === config.RetiredRole);
            await user.roles.add(retireRole);
            /*
            con.query('SELECT * FROM users WHERE discId = ?', [userId], async (err, rows) => {
                if (err) return interaction.reply({ content: 'Failed to retrieve user information from database.', ephemeral: true });
                if (!rows[0]) return interaction.reply({ content: 'User information not found in database.', ephemeral: true });
          
                const usercache = rows[0];
                post(`https://${config.invisionDomain}/api/core/members/${usercache.webId}?group=${config.invRetired}&key=${config.invisionAPI}`) // bans the user from the website
                .set('User-Agent', 'ECRP_Bot/1.0')
                .end((err, res) => {
                    if(err) {
                        console.log(err)
                        return interaction.reply({content: config.errMsg, ephemeral: true})
                    }
                        */
        } else if (reason == 'properban') { // WIP
            await user.ban({ reason: `Proper resignation (Processed by <@${interaction.member.id}>)`, days: 15 });
            /*
            con.query('SELECT * FROM users WHERE discId = ?', [userId], async (err, rows) => {
                if (err) return interaction.reply({ content: 'Failed to retrieve user information from database.', ephemeral: true });
                if (!rows[0]) return interaction.reply({ content: 'User information not found in database.', ephemeral: true });
            const usercache = rows[0];
            post(`https://${config.invisionDomain}/api/core/members/${usercache.webId}/warnings?moderator=1&suspendTemporary&suspensionEnd=&points=100&key=${config.invisionAPI}`) // bans the user from the website
            .set('User-Agent', 'ECRP_Bot/1.0')
            .end((err, res) => {
                if(err) {
                    console.log(err)
                    return interaction.reply({content: config.errMsg, ephemeral: true})
                }
            })
            */
        } 
        else if (reason === 'improper') { // WIP for the SQL
            await user.ban({ reason: `Improper resignation (Processed by <@${interaction.member.id}>)`, days: 30 });
            /*
            con.query('SELECT * FROM users WHERE discId = ?', [userId], async (err, rows) => { // WIP on days to suspend from website
                if (err) return interaction.reply({ content: 'Failed to retrieve user information from database.', ephemeral: true });
                if (!rows[0]) return interaction.reply({ content: 'User information not found in database.', ephemeral: true });
            const usercache = rows[0];
            post(`https://${config.invisionDomain}/api/core/members/${usercache.webId}/warnings?moderator=1&suspendTemporary&suspensionEnd=&points=100&key=${config.invisionAPI}`) // bans the user from the website
            .set('User-Agent', 'ECRP_Bot/1.0')
            .end((err, res) => {
                if(err) {
                    console.log(err)
                    return interaction.reply({content: config.errMsg, ephemeral: true})
                }
            })
        }) 
        */
            return interaction.reply({ content: 'Invalid reason for resignation.', ephemeral: true });
        }


        // Build Log Embed
        const log = new EmbedBuilder()
        .setTitle('User Resigned')
        .setColor(`${config.embedcolor}`)
        .addFields(
            { name: 'User Who Resigned', value: `<@${user.id}>` },
            { name: 'Moderator', value: `<@${interaction.member.id}>` },
            { name: 'Resignation Type', value: `${reason}` },
            { name: 'Channel used in', value: `<#${interaction.channel.id}>` },
        )
        .setImage(config.logo)
        .setTimestamp()
        .setFooter({ text: config.embedfooter, iconURL: config.logo });
    
        logChannel.send({ embeds: [log] });

        await interaction.reply({ content: `<@${user.id}>'s resignation processed successfully.` });
    }
};
