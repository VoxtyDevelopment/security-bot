const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
const {post, get} = require("superagent");
module.exports = {
    data: new SlashCommandBuilder()
        .setName('webrole')
        .setDescription("Update the website role of a member.")
        .addStringOption(option =>
            option.setName("id")
            .setDescription("The Website ID of the user who's roles you want to change")
            .setRequired(true))
        .addStringOption(option => 
            option.setName("role")
            .setDescription("The new primary web role to assign to this user.")
            .setChoices(
                {name: `Recruit`, value: `${config.invRecruit}`},
                {name: `Member`, value: `${config.invMember}`},
                {name: `Staff in Training`, value: `${config.invSIT}`},
                {name: `Staff`, value: `${config.invStaff}`},
                {name: `Senior Staff`, value: `${config.invSStaff}`},
                {name: `Junior Admin`, value: `${config.invJAdmin}`},
                {name: `Admin`, value: `${config.invAdmin}`},
            )
            .setRequired(true)),
   async execute(interaction, client, config, con) {
        if(interaction.guild.id !== config.mainGuild) return interaction.reply({content: config.mainGuildMsg, ephemeral: true})
       const newrole = interaction.options.getString('role');
       const webid = interaction.options.getString("id");
       const logChannel = client.channels.cache.get(config.modLogs);
       const reqRole = interaction.guild.roles.cache.find(r => r.id === config.JAdmin);
       const permission = reqRole.position <= interaction.member.roles.highest.position || interaction.member.roles.cache.has(config.Admin);
       if(!permission) return interaction.reply({content: "You are either lacking permission to use this command, or you do not have the required permission to assign that web role!", ephemeral: true})



        const log = new EmbedBuilder()
        .setImage(config.logo)
        .setTimestamp()
        .setFooter({ text: config.embedfooter, iconURL: config.logo })
        .setTitle('Website Roles Updated')
        .setColor(`${config.embedcolor}`)
        .addFields(
            { name: 'Admin updating roles', value: `<@${interaction.member.id}>` },
            { name: 'Website ID utilized on', value: `${webid}` },
            { name: 'Web role given', value: `${newrole}`},
            { name: 'Channel used in', value: `<#${interaction.channel.id}>` },
        )

        logChannel.send({ embeds: [log] });

        
        post(`https://${config.invisionDomain}/api/core/members/${webid}?group=${newrole}&key=${config.invisionAPI}`)
            .set('User-Agent', 'ECRP_Bot/1.0')
            .end((err, res) => {
                if(err) {
                    console.log(err)
                    return interaction.reply({content: config.errMsg, ephemeral: true})
                }
                return interaction.reply(`I have changed Web ID \`${webid}\`'s primary web role to role ID: \`${newrole}\``)
            })

    }
}
