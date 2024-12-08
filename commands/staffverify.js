const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('staffverify')
    .setDescription('Verify yourself in the staff discord'),

    async execute(interaction, client, config) {
        if (interaction.guild.id !== config.staffGuild) return interaction.reply({ content: "This command can only be used in the staff discord.", ephemeral: true })

        const mainGuild = client.guilds.cache.get(config.mainGuild);

        const member = await mainGuild.members.fetch(interaction.user.id);

        const logChannel = mainGuild.channels.cache.get(config.modLogs);
        if (!logChannel) {
            console.error(`Log channel with ID ${config.modLogs} not found.`);
            await interaction.reply({ content: "Log channel not found.", ephemeral: true });
            return;
        }


        try {

        const sguild = client.guilds.cache.get(config.staffGuild);

        const smember = await sguild.members.fetch(interaction.user.id)

        if (member.roles.cache.has(config.SIT)) { 
           await smember.roles.add(config.SGSIT)
           interaction.reply({ content: `You have sucessfully been verified in the ${config.SN} staff discord.`})
        }

        if (member.roles.cache.has(config.Staff)) {
            await smember.roles.add(config.SGStaff)
            interaction.reply({ content: `You have sucessfully been verified in the ${config.SN} staff discord.`})
        }

        if (member.roles.cache.has(config.SStaff)) {
            await smember.roles.add(config.SGSStaff)
            interaction.reply({ content: `You have sucessfully been verified in the ${config.SN} staff discord.`})
        }

        if (member.roles.cache.has(config.JAdmin)) {
            await smember.roles.add(config.SGJAdmin)
            interaction.reply({ content: `You have sucessfully been verified in the ${config.SN} staff discord.`})
        }

        if (member.roles.cache.has(config.Admin)) {
            await smember.roles.add(config.SGAdmin)
            interaction.reply({ content: `You have sucessfully been verified in the ${config.SN} staff discord.`})
        }
    } catch (error) {
        console.error('Fat fuck there was an error', error);
        interaction.reply({ content: 'There was an erorr executing this command.', ephemeral: true })
    }

        const userverified = new EmbedBuilder()
        .setTitle('User verified in staff discord.')
        .setDescription(`**Staff Member:** ${interaction.user.username}\nHas verified in the staff discord.`)
        .addFields(
            { name: 'Discord Id', value: `${interaction.user.id} + <@${interaction.user.id}>`}
        )
        .setColor(config.embedcolor)
        .setThumbnail(config.logo)
        .setTimestamp()
        .setFooter({ text: config.embedfooter, iconURL: config.logo })

        logChannel.send({ embeds: [userverified] });
    }
}
