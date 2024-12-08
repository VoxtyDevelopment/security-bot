const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const discordTranscripts = require('discord-html-transcripts');
const { con } = require('..');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('unmute')
        .setDescription("Unmute a specified user.")
        .addUserOption(option => 
            option.setName("user")
            .setDescription("The user to unmute.")
            .setRequired(true)),
    async execute(interaction, client, config, con) {
        if(interaction.guild.id !== config.mainGuild) return interaction.reply({content: config.mainGuildMsg, ephemeral: true})
        const reqRole = interaction.guild.roles.cache.find(r => r.id === config.Staff);
        const permission = reqRole.position <= interaction.member.roles.highest.position;
        if(!permission) return interaction.reply({content: config.noPermMsg, ephemeral: true})
        const user = interaction.options.getMember('user')
        const logChannel = client.channels.cache.get(config.muteLogs);


        const unmuteLogEmbed = new EmbedBuilder()
            .setTitle("User unmuted")
            .addFields(
                { name: "User", value: `<@${user.id}>` },
                { name: "Moderator", value: `<@${interaction.member.id}>` },
                { name: 'Channel used in', value: `<#${interaction.channel.id}>` },
            )
                .setColor(`${config.embedcolor}`)
                .setImage(config.logo)
    			.setTimestamp()
				.setFooter({ text: config.embedfooter, iconURL: config.logo });        

        con.query("SELECT * FROM activemutes WHERE discId = " + user.id, async (err, rows) => {
            if(err) {
                console.log(err);
                return interaction.reply({content: config.errMsg, ephemeral: true})
            }

            if(!rows[0]) {
                return interaction.reply("This user is not muted.");
            }

            i = 0;
            while(i < rows.length) {
                const mGuild = await client.guilds.cache.get(rows[i].guildId);
                const gUser = await mGuild.members.cache.get(user.id)
                var parsedData = JSON.parse(rows[i].roles);

                try {
                    await parsedData.removedRoles.forEach(role => {
                        gUser.roles.add(role)
                    })
                } catch(err) {
                    if(err.code === "10011") {
                        console.log(err);
                        return interaction.reply({content: config.errMsg, ephemeral: true})
                    }

                    console.log(err);
                    return interaction.reply({content: config.errMsg, ephemeral: true})
                }
                    // define the mute role for the guild then remove it from the user

                    client.guilds.cache.forEach(async guild => {

                    const muteRole = guild.roles.cache.find(r => r?.name?.includes(config.MutedRoleName))

                    return gUser.roles.remove(muteRole)
                })
            i++;
            }
            try{
                const muteChannel = await interaction.guild.channels.fetch(rows[0].muteChannel);
                transcript = await discordTranscripts.createTranscript(muteChannel)
                await muteChannel.delete();
            } catch(err) {
                console.log(err)
            }
            
            await logChannel.send({embeds: [unmuteLogEmbed], files: [transcript]})
            con.query("DELETE FROM activemutes WHERE discId =" + user.id, async (err, rows) => {
                if(err) {
                    console.log(err);
                    return interaction.reply({content: config.errMsg, ephemeral: true})
                }

                con.query("UPDATE users SET isMuted = 0 WHERE uid = ?", [user.id], async(err, rows) => {
                    return console.log(`${user.displayName} has been set to unmuted in the user database`)
                })
            })

            return interaction.reply({ content: `<@${user.id}> has been sucessfully unmuted.`})
        })
    }
}
