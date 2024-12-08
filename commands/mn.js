//
const { SlashCommandBuilder, EmbedBuilder, userMention, messageLink, PermissionFlagsBits} = require('discord.js')
module.exports = {
    data: new SlashCommandBuilder()
        .setName('mn')
        .setDescription("Mass Nickname. It will change the users name in all servers")
        .addUserOption(option => 
            option.setName("user")
                .setDescription("The user you want to change the name of")
                .setRequired(true))
        .addStringOption(option => 
            option.setName("name")
            .setDescription("The new name you want to be set")
            .setRequired(true)),

    async execute(interaction, client, config) {
        const permission = interaction.member.permissions.has(PermissionFlagsBits.ManageNicknames)
        const user = interaction.options.getMember('user')
        const logChannel = client.channels.cache.get(config.modLogs);
        const nName = interaction.options.getString('name')

        if(!user) {
            return interaction.reply({content: "Please provide a valid user ID", ephemeral: true})
        }

        if(user !== interaction.member && !permission) {
            return interaction.reply({content: config.noPermMsg, ephemeral: true})
        }

        if(!user.kickable) {
            return interaction.reply({content: "I am unable to rename that user as they have a higher permission level than me!", ephemeral: true})
        }

        client.guilds.cache.forEach(async guild => {
            const gUser = guild.members.cache.get(user.id)

            if(!gUser) return;

            if(!gUser.bannable) return;
            
            await gUser.setNickname(nName)
        })

        const log = new EmbedBuilder()
        .setTitle("User Nickname Updated")
        .setColor(`${config.embedcolor}`)
        .addFields(
            { name: "User", value: `<@${user.id}>` },
            { name: "Moderator", value: `<@${interaction.member.id}>` },
            { name: "New Nickname", value: `${nName}` },
            { name: 'Channel used in', value: `<#${interaction.channel.id}>` },
        )

        logChannel.send({ embeds: [log] });

        return interaction.reply({content: `I have renamed <@${user.id}> to \`${nName}\` on all servers`})
    }
}
