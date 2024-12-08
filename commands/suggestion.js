const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('suggestion')
        .setDescription('Submit a suggestion')
        .addStringOption(option =>
            option.setName('description')
                .setDescription('Describe your suggestion in detail')
                .setRequired(true)),

    async execute(interaction, client, config) {
        const description = interaction.options.getString('description');

        const suggestionEmbed = new EmbedBuilder()
            .setTitle('New Suggestion')
            .addFields(
                { name: 'Description', value: description },
                { name: 'Suggested by', value: `<@${interaction.user.id}>` }
            )
            .setColor(config.embedcolor)
            .setThumbnail(config.logo)
            .setTimestamp()
            .setFooter({ text: config.embedfooter, iconURL: config.logo });

        const suggestionsChannel = interaction.guild.channels.cache.get(config.suggestionsChannelID);
        if (suggestionsChannel) {
            const suggestionMessage = await suggestionsChannel.send({ embeds: [suggestionEmbed] });
            await suggestionMessage.react('👍');
            await suggestionMessage.react('👎');
        }

        await interaction.reply({ content: 'Thank you for your suggestion! Our team will review it shortly.', ephemeral: true });
    }
};