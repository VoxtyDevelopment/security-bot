const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
module.exports = {
    data: new SlashCommandBuilder()
        .setName('mub')
        .setDescription("Mass un-ban a user from all assets.")
        .addUserOption(option =>
            option.setName('user')
            .setDescription('The user to un-ban')
            .setRequired(true)),
    async execute(interaction, client, config, con) {
        if(interaction.guild.id !== config.mainGuild) return interaction.reply({content: config.mainGuildMsg, ephemeral: true})
        const reqRole = interaction.guild.roles.cache.find(r => r.id === config.JAdmin);
        const permission = reqRole.position <= interaction.member.roles.highest.position;
        const user = interaction.options.getUser('user')
        if(!permission) return interaction.reply({content: config.noPermMsg, ephemeral: true})
        const logChannel = client.channels.cache.get(config.modLogs);



        await client.guilds.fetch();
        client.guilds.cache.forEach(async guild => {

            const isBan = guild.bans.fetch(user.id)
            if(!isBan) return


            await guild.bans.remove(user.id)
        })
        
        // embeds
    const log = new EmbedBuilder()
    .setTitle('User Mass-Unbanned')
    .setColor(`${config.embedcolor}`)
    .addFields(
        { name: 'User', value: `<@${user.id}>` },
        { name: 'Moderator', value: `<@${interaction.member.id}>` },
        { name: 'Channel used in', value: `<#${interaction.channel.id}>` },
    )
.setImage(config.logo)
.setTimestamp()
.setFooter({ text: config.embedfooter, iconURL: config.logo });

        logChannel.send({ embeds: [log] });

        return interaction.reply(`<@${user.id}> has been un-banned from all assets.`)
    }
}
