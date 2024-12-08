const { SlashCommandBuilder, EmbedBuilder, messageLink, ChannelType, PermissionFlagsBits } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('mute')
        .setDescription("Mute a user in all discords.")
        .addUserOption(option =>
            option.setName("user")
            .setDescription("The user to mute")
            .setRequired(true))
        .addStringOption(option => 
            option.setName("mutereason")
            .setDescription("The reason for muting this user")
            .setRequired(true)),
    async execute(interaction, client, config, con) {
        if(interaction.guild.id !== config.mainGuild) return interaction.reply({content: config.mainGuildMsg, ephemeral: true})
        const reqRole = interaction.guild.roles.cache.find(r => r.id === config.Staff);
        const permission = reqRole.position <= interaction.member.roles.highest.position;
        if(!permission) return interaction.reply({content: config.noPermMsg, ephemeral: true})
        const user = interaction.options.getMember('user')
        const reason = interaction.options.getString("mutereason")
        const logChannel = client.channels.cache.get(config.muteLogs);
        const userId = user.id

        if(!user.kickable) {
            return interaction.reply({content: "I can not mute that user", ephemeral: true}) 
        }

        con.query("SELECT * FROM activemutes WHERE discId = ?", [userId], async(err, rows) => {
            if(err) {
                console.log(err)
                return interaction.reply({content: config.errMsg, ephemeral: true})
            }

            if(rows.length > 0) {
                return interaction.reply({content: "That user is already muted!", ephemeral: true})
            }

            const muteEmbed = new EmbedBuilder()
                .setTitle("Muted Channel - " + userId)
                .setDescription(`Hello <@${user.id}>, you have been muted by <@${interaction.member.id}> for the reason \`${reason}\`. Please do not share any messages / media from this channel as it can result in further action being taken. Please wait patiently as you will be reached out to ASAP.`)
                .setTimestamp()
                .setColor(`${config.embedcolor}`)
                .setImage(config.logo)
    			.setTimestamp()
				.setFooter({ text: config.embedfooter, iconURL: config.logo });

            const muteLogEmbed = new EmbedBuilder()
                .setTitle("User Mass Muted")
                .addFields(
                    { name: "User", value: `<@${userId}>` },
                    { name: "Moderator", value: `<@${interaction.member.id}>` },
                    { name: "Reason", value: reason },
                    { name: 'Channel used in', value: `<#${interaction.channel.id}>` },
                )
                .setColor(`${config.embedcolor}`)
                .setImage(config.logo)
    			.setTimestamp()
				.setFooter({ text: config.embedfooter, iconURL: config.logo });
            
            await interaction.reply(`Muting <@${user.id}>...`)
            
            const muteChannel = await interaction.guild.channels.create({
                name: `muted-staff-${userId}`,
                type: ChannelType.GuildText,
                parent: config.muteCatagory,
                permissionOverwrites: [
                    {
                        id: interaction.guild.id,
                        deny: [PermissionFlagsBits.SendMessages, PermissionFlagsBits.ViewChannel]
                    },
                    {
                        id: userId,
                        allow: [PermissionFlagsBits.SendMessages, PermissionFlagsBits.ViewChannel]
                    },
                    {
                        id: config.SIT,
                        allow: [PermissionFlagsBits.SendMessages, PermissionFlagsBits.ViewChannel]
                    },
                    {
                        id: config.Staff,
                        allow: [PermissionFlagsBits.SendMessages, PermissionFlagsBits.ViewChannel]
                    },
                    {
                        id: config.SStaff,
                        allow: [PermissionFlagsBits.SendMessages, PermissionFlagsBits.ViewChannel]
                    },
                    {
                        id: config.JAdmin,
                        allow: [PermissionFlagsBits.SendMessages, PermissionFlagsBits.ViewChannel]
                    },
                    {
                        id: config.Admin,
                        allow: [PermissionFlagsBits.SendMessages, PermissionFlagsBits.ViewChannel]
                    },
                    {
                        id: config.BOD,
                        allow: [PermissionFlagsBits.SendMessages, PermissionFlagsBits.ViewChannel]
                    },
                ]
            })

            client.guilds.cache.forEach(async guild => {
                var gUser = guild.members.cache.get(userId)
                if(!gUser) return;
                if(gUser.moderatable) {
                
                    var allRoles = {
                        removedRoles: []
                    }

                    gUser.roles.cache.forEach(async role => {
                        if(role.name === "@everyone") return;

                        allRoles.removedRoles.push(role.id)
                        try {
                            await gUser.roles.remove(role)
                        } catch(err) {
                            return console.log(err);
                        }
                    })

                    con.query("INSERT INTO activemutes(guildId, discId, muteReason, roles, muteChannel) VALUES(?, ?, ?, ?, ?)", [guild.id, userId, reason, JSON.stringify(allRoles), muteChannel.id], async(err, rows) => {
                        if(err) {
                            console.log(err)
                            return interaction.reply({content: config.errMsg, ephemeral: true})
                        }
                    })

                    
                    const rMuteRole = guild.roles.cache.find(r => r?.name?.includes(config.MutedRoleName))                            

                    return gUser.roles.add(rMuteRole)
                    
                }
            })


            await muteChannel.send({content: `<@${user.id}>`, embeds: [muteEmbed]});
            await logChannel.send({embeds: [muteLogEmbed]});
            con.query("UPDATE users SET isMuted = 1 WHERE uid = ?", [userId], async (err, rows) => {
                return interaction.channel.send(`<@${userId}> has been muted.`);
            })
        })
    }
}
