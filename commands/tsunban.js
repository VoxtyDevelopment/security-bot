const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { TeamSpeak } = require('ts3-nodejs-library');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('tsunban')
        .setDescription('Unban a user from the TeamSpeak server.')
        .addStringOption(option =>
            option.setName('tsuid')
                .setDescription('User TSUID')
                .setRequired(true)),

    async execute(interaction, client, config) {
        await interaction.reply({ content: 'Unbanning user from TeamSpeak server...', ephemeral: true });

        const reqRole = interaction.guild.roles.cache.find(r => r.id === config.JAdmin);
        const permission = reqRole.position <= interaction.member.roles.highest.position;
        if(!permission) return interaction.reply({content: config.noPermMsg, ephemeral: true})
        const tsuid = interaction.options.getString('tsuid');
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

            await ts3.execute('banDel', { 
                id: tsuid 
            });

            await interaction.editReply('User unbanned successfully from TeamSpeak server.');
        } catch (error) {
            console.error('Error unbanning user from TeamSpeak server:', error);
            await interaction.editReply('Failed to unban user from TeamSpeak server.');

            const log = new EmbedBuilder()
            .setImage(config.logo)
            .setTimestamp()
            .setFooter({ text: config.embedfooter, iconURL: config.logo })
            .setTitle('Teamspeak UID Unbanned!')
            .setColor(`${config.embedcolor}`)
            .addFields(
                { name: 'Used by', value: `<@${interaction.member.id}>` },
                { name: 'Channel used in', value: `<#${interaction.channel.id}>` },
                { name: 'UID Unbanned', value: `${tsuid}` },

            );
    
            logChannel.send({ embeds: [log] });

        } finally {
            await ts3.logout();
            ts3.quit();
        }
    }
};
