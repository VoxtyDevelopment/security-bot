const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('invite')
    .setDescription(`Make an invite into the ${config.SN} community.`)
    .addStringOption(option =>
        option.setName('duration')
          .setDescription('The duration of the invite in minutes')
          .setRequired(true)
    )
    .addStringOption(option =>
        option.setName('uses')
        .setDescription('Max uses for the invite command')
        .setRequired(true)
    ),

    async execute(interaction, client, config) {
        if (interaction.guild.id !== config.mainGuild)
            return interaction.reply({ content: config.mainGuildMsg, ephemeral: true});

        const duration = interaction.options.getString('duration');
        const uses = interaction.options.getString('uses');
        const logChannel = client.channels.cache.get(config.modLogs);
        const reqRole = interaction.guild.roles.cache.find(r => r.id === config.CAT);
        const permission = reqRole.position <= interaction.member.roles.highest.position;
        if(!permission) return interaction.reply({content: config.noPermMsg, ephemeral: true})

            // Creates the invite
            const invite = await interaction.channel.createInvite({
                maxAge: duration * 60,
                maxUses: uses
            })       
        
            // Build Log Embed
            const log = new EmbedBuilder()
            .setTitle('Invite Link Generated')
            .setColor(config.embedcolor)
            .addFields(
                { name: 'Moderator', value: `<@${interaction.member.id}>`},
                { name: 'Duration', value: `${duration} minutes`},
                { name: 'Invite Link', value: `${invite.url}`}
            )
            .setImage(config.logo)
            .setTimestamp()
            .setFooter({ text: config.embedfooter, iconURL: config.logo });

            logChannel.send({ embeds: [log ]});

            interaction.reply(`The invited has been succesfully created and the duration is \`${duration} minutes\`\n\n${invite.url}`)
    }
}
