const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
const {post} = require("superagent");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('webname')
        .setDescription("Update the website name of a member.")
        .addStringOption(option =>
            option.setName("id")
            .setDescription("The Website ID of the user who's name you want to change")
            .setRequired(true))
        .addStringOption(option => 
            option.setName("name")
            .setDescription("The new website name of the member")
            .setRequired(true)),
    async execute(interaction, client, config, con) {
        if(interaction.guild.id !== config.mainGuild) return interaction.reply({content: config.mainGuildMsg, ephemeral: true})
        const reqRole = interaction.guild.roles.cache.find(r => r.id === config.SIT);
        const permission = reqRole.position <= interaction.member.roles.highest.position || interaction.member.roles.cache.has(config.FTO);

        if(!permission) return interaction.reply({content: config.noPermMsg, ephemeral: true})
        
        const id = interaction.options.getString("id");
        const newName = interaction.options.getString("name");
        const logChannel = client.channels.cache.get(config.modLogs);

        const log = new EmbedBuilder()
        .setImage(config.logo)
        .setTimestamp()
        .setFooter({ text: config.embedfooter, iconURL: config.logo })
        .setTitle('Website Name Updated')
        .setColor(`${config.embedcolor}`)
        .addFields(
            { name: 'Admin updating name', value: `<@${interaction.member.id}>` },
            { name: 'Website ID utilized on', value: `${id}` },
            { name: 'Web name given', value: `${newName}`},
            { name: 'Channel used in', value: `<#${interaction.channel.id}>` },
        )

        logChannel.send({ embeds: [log] });
        
       post(`https://${config.invisionDomain}/api/core/members/${id}?name=${newName}&key=${config.invisionAPI}`)
            .set('User-Agent', 'ECRP_Bot/1.0')
            .end((err, res) => {
                if(err) {
                    console.log(err)
                    return interaction.reply({content: config.errMsg, ephemeral: true})
                }

                return interaction.reply(`I have changed Web ID \`${id}\`'s name to \`${newName}\``)
           })

    }
}
