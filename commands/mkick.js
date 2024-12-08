const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
const { post } = require("superagent");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('mk')
        .setDescription("Kicks a specified user from all Guilds.")
        .addUserOption(option => 
            option.setName('user')
            .setDescription('The user to kick.')
            .setRequired(true))
        .addStringOption(option =>
            option.setName("reason")
            .setDescription("Provide a reason to kick the user")
            .setRequired(true)),
    async execute(interaction, client, config, con) {
        const user = interaction.options.getMember('user')
        const reason = interaction.options.getString('reason')
        const logChannel = client.channels.cache.get(config.modLogs);
        const reqRole = interaction.guild.roles.cache.find(r => r.id === config.JAdmin);
        const permission = reqRole.position <= interaction.member.roles.highest.position;
        if(!permission) return interaction.reply({content: config.noPermMsg, ephemeral: true})
        const userId = (user.id)
   
        // Build Log Embed
        const logEmbed = new EmbedBuilder()
            .setTitle("User Mass-Kicked")
            .setDescription("An Administrator as mass-kicked a user")
            .addFields(
                { name: 'Moderator', value: "<@" + interaction.member.id + ">" },
                { name: 'Member', value: `<@${userId}>` },
                { name: 'Reason', value: `${reason}` },
		{ name: 'Guild initiated', value: `${interaction.guild.name}` },
                { name: 'Channel used in', value: `<#${interaction.channel.id}>` },
            )
            .setColor(`${config.embedcolor}`)
            .setImage(config.logo)
            .setTimestamp()
	        .setFooter({ text: config.embedfooter, iconURL: config.logo });
        
        // Sets the users roles back to applicant on the website
        con.query('SELECT * FROM users WHERE discId = ?', [userId], async (err, rows) => {
            if (err) return interaction.reply({ content: 'Failed to retrieve user information from database.', ephemeral: true });
            if (!rows[0]) return interaction.reply({ content: 'User information not found in database.', ephemeral: true });
          
            const usercache = rows[0];
            post(`https://${config.invisionDomain}/api/core/members/${usercache.webId}?group=3&key=${config.invisionAPI}`) // bans the user from the website
            .set('User-Agent', 'ECRP_Bot/1.0')
            .end((err, res) => {
                if(err) {
                    console.log(err)
                    return interaction.reply({content: config.errMsg, ephemeral: true})
                }
            })})
        
        await logChannel.send({embeds: [logEmbed]})
        await client.guilds.fetch();
        await client.guilds.cache.forEach(async guild => {
        const gUser = guild.members.cache.get(user.id)
        await gUser.kick();
        })
        
        return interaction.reply(`<@${user.id}> has been kicked from all Guilds.`)
    }
}
