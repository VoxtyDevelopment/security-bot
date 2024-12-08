const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { TeamSpeak } = require('ts3-nodejs-library');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('tspass')
        .setDescription('Generate a Teamspeak temporary password and DM it to the user.')
        .addNumberOption(option =>
            option.setName('duration')
                .setDescription('Duration in minutes until the password expires')
                .setRequired(true))
        .addUserOption(option =>
            option.setName('user')
                .setDescription('User to send the temporary password to')
                .setRequired(false)),

    async execute(interaction, client, config) {
        const reqRole = interaction.guild.roles.cache.find(r => r.id === config.SIT);
        const permission = reqRole.position <= interaction.member.roles.highest.position;
        if(!permission) return interaction.reply({content: config.noPermMsg, ephemeral: true})
        const duration = interaction.options.getNumber('duration');
        const targetUser = interaction.options.getUser('user') || interaction.user;
        const password = generateRandomPassword();
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

            await ts3.execute('servertemppasswordadd', {
                pw: password,
                desc: `Temporary password for ${targetUser.tag}`,
                duration: duration * 60
            });

            const embed = new EmbedBuilder()
                .setTitle('Teamspeak Temporary Password')
                .setDescription('Your temporary password for Teamspeak has been generated.')
                .addFields(
                    { name: 'Password', value: password, inline: true },
                    { name: 'Duration', value: `${duration} minutes`, inline: true }
                )
                .setColor(`${config.embedcolor}`)
                .setThumbnail(config.logo)
    			.setTimestamp();

            try {
                await targetUser.send({ embeds: [embed] });
                await interaction.reply({ content: `Temporary password has been sent to ${targetUser.tag}'s DMs.`, ephemeral: true });
            } catch (error) {
                await interaction.reply({ content: `Failed to send a DM to ${targetUser.tag}. Please ensure their DMs are open.`, ephemeral: true });
            }

            const log = new EmbedBuilder()
            .setImage(config.logo)
            .setTimestamp()
            .setFooter({ text: config.embedfooter, iconURL: config.logo })
            .setTitle('Teamspeak Temporary Password Created!')
            .setColor('#e7c7ab')
            .addFields(
                { name: 'Used by', value: `<@${interaction.member.id}>` },
                { name: 'Channel used in', value: `<#${interaction.channel.id}>` },
                { name: 'Password', value: password },
                { name: 'User created for', value: `${targetUser.tag}`},
                { name: 'Duration', value: `${duration}`},

            )
    
            logChannel.send({ embeds: [log] });

        } finally {
            await ts3.logout();
            ts3.quit();
        }
    }
};

function generateRandomPassword() {
    const length = 8;
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let password = '';
    for (let i = 0; i < length; i++) {
        password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    return password;
}
