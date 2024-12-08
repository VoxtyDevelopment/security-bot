const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('bugreport')
        .setDescription('Report a bug')
        .addStringOption(option =>
            option.setName('type')
                .setDescription('The type of bug')
                .setRequired(true)
                .addChoices(
                    { name: 'FiveM', value: 'fivem' },
                    { name: 'Bot', value: 'bot' },
                    { name: 'TeamSpeak', value: 'ts3' } 
                ))
        .addStringOption(option =>
            option.setName('description')
                .setDescription('Describe the bug in detail')
                .setRequired(true)),

    async execute(interaction, client, config) {
        const type = interaction.options.getString('type');
        const description = interaction.options.getString('description');

        const bugReportEmbed = new EmbedBuilder()
            .setTitle('Bug Report')
            .addFields(
                { name: 'Type', value: type, inline: true },
                { name: 'Description', value: description, inline: true },
                { name: 'Reported by', value: `<@${interaction.user.id}>`, inline: true }
            )
            .setColor(config.embedcolor)
            .setThumbnail(config.logo)
            .setTimestamp()
            .setFooter({ text: config.embedfooter, iconURL: config.logo });

        const bugReportsChannel = interaction.guild.channels.cache.get(config.bugReportsChannelID);
        if (bugReportsChannel) {
            await bugReportsChannel.send({ embeds: [bugReportEmbed] });
        } else {
            console.error('Bug Reports channel not found.');
        }

        await interaction.reply({ content: 'Thank you for your report! Our team will review it shortly.', ephemeral: true });
    }
};
