const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('serverinfo')
        .setDescription('Displays information about the server.'),

    async execute(interaction) {
        const { guild } = interaction;

        const embed = new EmbedBuilder()
            .setTitle(`${guild.name} Server Information`)
            .setThumbnail(guild.iconURL({ dynamic: true }))
            .addFields(
                { name: 'Server Name', value: guild.name, inline: true },
                { name: 'Server ID', value: guild.id, inline: true },
                { name: 'Owner', value: `<@${guild.ownerId}>`, inline: true },
                { name: 'Total Members', value: `${guild.memberCount}`, inline: true },
                { name: 'Total Channels', value: `${guild.channels.cache.size}`, inline: true },
                { name: 'Created On', value: `<t:${Math.floor(guild.createdTimestamp / 1000)}:F>`, inline: true },
            )
            .setColor(config.embedcolor)
            .setFooter({ text: 'Server Info', iconURL: guild.iconURL({ dynamic: true }) })
            .setTimestamp();
            

        await interaction.reply({ embeds: [embed] });
    },
};
