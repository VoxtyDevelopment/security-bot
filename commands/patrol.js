const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('patrol')
        .setDescription('Create a patrol notification')
        .addStringOption(option =>
            option.setName("type")
                .setDescription("The type of patrol (normal or beta)")
                .setRequired(true)
                .addChoices(
                    { name: 'Normal', value: 'normal' },
                    { name: 'Beta', value: 'beta' }
                ))
        .addIntegerOption(option =>
            option.setName("time")
                .setDescription("The Time of the patrol in unix")
                .setRequired(true))
        .addStringOption(option =>
            option.setName("aop")
                .setDescription("The area of patrol example (Los Santos)")
                .setRequired(true)),

    async execute(interaction, client, config) {
        const reqRole = interaction.guild.roles.cache.find(r => r.id === config.SStaff);
        const permission = reqRole.position <= interaction.member.roles.highest.position;
        const type = interaction.options.getString('type');
        const unixTime = interaction.options.getInteger('time');
        const time = `<t:${unixTime}:F>`; 
        const aop = interaction.options.getString('aop');

        if (!permission) return interaction.reply({ content: config.noPermMsg, ephemeral: true });

        let attendingCount = 0;
        const userLogs = new Map();
        const attendingUsers = new Set();

        let embed;

        if (type === 'normal') {
            embed = new EmbedBuilder()
                .setTitle('Patrol Notify Announcement')
                .setDescription(`Attention members of ${config.SN}!\n\nWe are hosting a community patrol. Below you'll find all the required information. Keep your eye out for any new information on this activity.`)
                .addFields(
                    { name: 'Patrol Details', value: `Patrol Time: ${time}\nArea of Patrol: ${aop}` },
                    { name: 'Connection Details', value: `Production Server: ||${config.productionServer}||\nTeamspeak Password: ||${config.teamspeakPassword}||\nTeamspeak Server IP: ||${config.teamspeakServerIP}||` },
                    { name: 'Members Attending', value: `0` }
                )
                .setColor(config.embedcolor)
                .setThumbnail(config.logo)
                .setTimestamp()
                .setFooter({ text: config.embedfooter, iconURL: config.logo });
        } else if (type === 'beta') {
            embed = new EmbedBuilder()
                .setTitle('Beta Patrol Notification')
                .setDescription(`Attention members of ${config.SN}!\n\nWe are hosting a Beta Patrol. Below you'll find all the required information. If you encounter any bugs, please report them in the "bug reports" channel.`)
                .addFields(
                    { name: 'Patrol Time', value: time },
                    { name: 'Area of Patrol', value: aop },
                    { name: 'Members Attending', value: `0` }
                )
                .setColor(config.embedcolor)
                .setThumbnail(config.logo)
                .setTimestamp()
                .setFooter({ text: config.embedfooter, iconURL: config.logo });
        }

        const buttons = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('attend')
                    .setLabel('✅ Attend')
                    .setStyle(ButtonStyle.Success),
                new ButtonBuilder()
                    .setCustomId('not_attend')
                    .setLabel('❌ Not Attend')
                    .setStyle(ButtonStyle.Danger),
                new ButtonBuilder()
                    .setCustomId('remind')
                    .setLabel('⏰ Remind')
                    .setStyle(ButtonStyle.Secondary)
            );

        const message = await interaction.reply({ embeds: [embed], components: [buttons], fetchReply: true });

        const collector = message.createMessageComponentCollector({ componentType: ComponentType.Button, time: 60000 });

        collector.on('collect', async i => {
            const patrolLogsChannel = interaction.guild.channels.cache.get(config.modLogs);

            if (userLogs.has(i.user.id) && userLogs.get(i.user.id).length >= 3) {
                return i.reply({ content: 'Attendance was not recorded due to the API detecting you as spam.', ephemeral: true });
            }

            let reaction;
            if (i.customId === 'attend') {
                if (!userLogs.has(i.user.id)) {
                    userLogs.set(i.user.id, []);
                }
                if (!attendingUsers.has(i.user.id)) {
                    attendingUsers.add(i.user.id);
                    attendingCount++;
                }
                userLogs.get(i.user.id).push('attend');
                reaction = 'Attending';
            } else if (i.customId === 'not_attend') {
                if (!userLogs.has(i.user.id)) {
                    userLogs.set(i.user.id, []);
                }
                if (attendingUsers.has(i.user.id)) {
                    attendingUsers.delete(i.user.id);
                    attendingCount--;
                }
                userLogs.get(i.user.id).push('not_attend');
                reaction = 'Not Attending';
            } else if (i.customId === 'remind') {
                if (!userLogs.has(i.user.id)) {
                    userLogs.set(i.user.id, []);
                }
                userLogs.get(i.user.id).push('remind');
                reaction = 'Reminder';
            }

            const logEmbed = new EmbedBuilder()
                .setTitle('User Attendance to the Patrol')
                .setColor(config.embedcolor)
                .setThumbnail(config.logo)
                .setFooter({ text: config.embedfooter, iconURL: config.logo })
                .setTimestamp()
                .addFields(
                    { name: 'User', value: `<@${i.user.id}>`, inline: true },
                    { name: 'Date', value: new Date().toLocaleString(), inline: true },
                    { name: 'Reaction', value: reaction, inline: true }
                );

            if (patrolLogsChannel) {
                await patrolLogsChannel.send({ embeds: [logEmbed] });
            }

            const updatedEmbed = new EmbedBuilder(embed)
                .setFields(
                    { name: 'Patrol Time', value: time },
                    { name: 'Area of Patrol', value: aop },
                    { name: 'Members Attending', value: `${attendingCount}` }
                );

            await i.update({ embeds: [updatedEmbed] });

            await i.followUp({ content: 'Patrol Attendance Noted', ephemeral: true });
        });
    }
};
