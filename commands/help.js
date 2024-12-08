const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription("Shows the help menu."),

        async execute(interaction, client, config, con) {
            const reqRole = interaction.guild.roles.cache.find(r => r.id === config.Membership);
            const permission = reqRole.position <= interaction.member.roles.highest.position;
            const logChannel = client.channels.cache.get(config.modLogs);

            if(!permission) return interaction.reply({content: config.noPermMsg, ephemeral: true})
        
        // build help embed
        const embed = new EmbedBuilder()
        .setTitle(`${config.SN} Help Menu`)
        .setDescription(`Commands are listed below, there is a guide on how to use them`)
        .setThumbnail(config.logo)
        .setColor(`${config.embedcolor}`)
        .setTimestamp()
        .setFooter({ text: config.embedfooter, iconURL: config.logo })
        .addFields(
            { name: '/mb **[@USER]**', value: `Massbans the mentioned user in all ${config.SN} guilds.` },
            { name: '/mub **[@USER]**', value: `Massunbans the mentioned user in all ${config.SN} guilds.` },
            { name: '/mk **[@USER]**', value: `Kicks the mentioned use user from all ${config.SN} guilds.` },
            { name: '/mute **[@USER]**', value: `Mutes the mentioned user from all ${config.SN} guilds.` },
            { name: '/unmute **[@USER]**', value: `Unmutes the mentioned user from all ${config.SN} guilds.` },
            { name: '/mn **[@USER]** **[NAME]**', value: `Sets the mentioned user's username in all of the ${config.SN} guilds.` },
            { name: '/status ', value: `Shows the player count of the ${config.SN} server.` },
            { name: '/patrol **[TIME]** **[DATE]** **[AOP]**', value: `Creates a patrol notification for the server.` },
            { name: '/onboard **[@USER] [NAME] [TS3] [WEBID] [DEPARTMENT]**', value: `Onboards a member into the ${config.SN} database.` },
            { name: '/webrole **[@WEB ID]** **[WEB ROLE]**', value: `Changes the website role on the mentioned website ID.` },
            { name: '/webname **[@WEB ID]** **[WEB NAME]**', value: `Changes the website name on the mentioned website ID.` },
            { name: '/lookup **[DISC ID]**', value: `Lookups the Discord ID in the ${config.SN} database and gives you their respected information.`},
            { name: `/link **[TS3 UID]** **[WEBSITE ID]**`, value: `Links your account with the ${config.SN} database.`},
            { name: `/verify`, value: `Verify yourself into the ${config.SN} community.`},
            { name: `/updatecallsign **[@USER]** **[CALLSIGN]**`, value: `Updates the callsign of the mentioned user.`},
            { name: `/suggestion **[DESCRIPTION]**`, value: `Sends a suggestion to the ${config.SN} community.`},
            { name: `/bugreport **[TYPE]** **[DESCRIPTION]**`, value: `Sends a bug report to the ${config.SN} community.`},
            { name: `/invite **[TIME IN MINUTES]** **[USES]**`, value: `Sends an invite link to the ${config.SN} community.`},
            { name: `/resign **[@USER]** **[REASON]**`, value: `Resigns the mentioned user.`},
            { name: `/staffverify`, value: `Verify yourself in the staff discord.`},
            { name: `/tsban **[TSUID]** **[REASON]**`, value: `Bans a user from the ${config.SN} TS3 server.`},
            { name: `/tspass **[DURATION]** **[@USER]**`, value: `Generates a Teamspeak temporary password and DMs it to the user.`},
            { name: `/tsunban **[TSUID]**`, value: `Unbans a user from the ${config.SN} TS3 server.`},
            { name: `/clear **[AMOUNT]**`, value: `Deletes the given amount of messages.`},
        )


        // build log embed
        const log = new EmbedBuilder()
        .setImage(config.logo)
        .setTimestamp()
        .setFooter({ text: config.embedfooter, iconURL: config.logo })
        .setTitle('Help Command Utilized!')
        .setColor(`${config.embedcolor}`)
        .addFields(
            { name: 'Used by', value: `<@${interaction.member.id}>` },
            { name: 'Channel used in', value: `<#${interaction.channel.id}>` },
        )

        logChannel.send({ embeds: [log] });

        return interaction.reply({ embeds: [embed]});

    }
}
