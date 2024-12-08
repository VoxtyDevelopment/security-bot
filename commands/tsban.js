const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { TeamSpeak } = require('ts3-nodejs-library');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('tsban')
        .setDescription('Ban a user from the TeamSpeak server.')
        .addStringOption(option =>
            option.setName('tsuid')
                .setDescription('User TSUID')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('Reason for the ban')
                .setRequired(true)),

    async execute(interaction, client, config) {
        await interaction.reply({ content: 'Banning user from TeamSpeak server...', ephemeral: true });

        const reqRole = interaction.guild.roles.cache.find(r => r.id === config.JAdmin);
        const permission = reqRole.position <= interaction.member.roles.highest.position;
        if(!permission) return interaction.reply({content: config.noPermMsg, ephemeral: true})
        const tsuid = interaction.options.getString('tsuid');
        const reason = interaction.options.getString('reason');
        const logChannel = client.channels.cache.get(config.modLogs);

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
                uid: tsuid,
                time: 0, // Permanent ban
                banreason: reason
            });

            await interaction.editReply(`User banned successfully from TeamSpeak server for the reason: ${reason}`);
        } catch (error) {
            console.error('Error banning user from TeamSpeak server:', error);
            await interaction.editReply('Failed to ban user from TeamSpeak server.');

        } finally {
            await ts3.logout();
            ts3.quit();
        }
            const log = new EmbedBuilder()
            .setImage(config.logo)
            .setTimestamp()
            .setFooter({ text: config.embedfooter, iconURL: config.logo })
            .setTitle('Teamspeak User ID Banned!')
            .setColor(`${config.embedcolor}`)
            .addFields(
                { name: 'Used by', value: `<@${interaction.member.id}>` },
                { name: 'Channel used in', value: `<#${interaction.channel.id}>` },
                { name: 'Teamspeak UID', value: `${tsuid}`},

            )
    
            logChannel.send({ embeds: [log] });
    }
};
