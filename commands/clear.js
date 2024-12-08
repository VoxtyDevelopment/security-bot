const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('clear')
        .setDescription('Deletes the given amount of messages!')
        .addNumberOption(option => option
            .setName('amount')
            .setDescription('How many messages shall be deleted?')
            .setRequired(true)),

    async execute(interaction, client, config, con) {
        const amount = interaction.options.getNumber('amount');
        if(interaction.guild.id !== config.mainGuild) return interaction.reply({content: config.mainGuildMsg, ephemeral: true})
        const reqRole = interaction.guild.roles.cache.find(r => r.id === config.Staff);
        const permission = reqRole.position <= interaction.member.roles.highest.position;
        if(!permission) return interaction.reply({content: config.noPermMsg, ephemeral: true})

        // Check if the amount parameter is >= 1
        if (amount < 1) {
            return interaction.reply({
                content: 'I must delete one or more messages!',
                ephemeral: true
            });
        }

        // Delete the given amount of messages
        const deletedMessages = (
            await interaction.channel.bulkDelete(amount, true).catch(err => {
                console.error(err);
            })
        ).size;
        
        const DAM = deletedMessages.toString()

        // Reply with a confirmation
        interaction.reply({
            content: `I deleted ${deletedMessages} messages for you!`,
            ephemeral: true
        });
        const clearLogEmbed = new EmbedBuilder()
    .setTitle('Messages Cleared')
    .setColor(`${config.embedcolor}`)
    .addFields(
        { name: 'Moderator', value: `<@${interaction.member.id}>` },
        { name: 'Channel', value: `<#${interaction.channel.id}>` },
        { name: 'Amount Deleted', value: DAM },
    )
    .setImage(config.logo)
    .setTimestamp()
	.setFooter({ text: config.embedfooter, iconURL: config.logo });        

// Log the clear command
const logChannel = client.channels.cache.get(config.modLogs);
    logChannel.send({ embeds: [clearLogEmbed] });

    },
};
