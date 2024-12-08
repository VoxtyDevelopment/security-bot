const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js')
const { get } = require("superagent");
const { config } = require('../config');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('status')
        .setDescription("Shows the current status of the servers.")
        .addStringOption(option =>
            option.setName('server')
            .setDescription('Select the server to check the status.')
            .setRequired(true)
            .addChoices(
                { name: 'Server 1', value: '1' },
            )
        ),

    async execute(interaction, client, config, con) {
        const server = interaction.options.getString('server');
        const reqRole = interaction.guild.roles.cache.find(r => r.id === config.Membership);
        const permission = reqRole.position <= interaction.member.roles.highest.position;
        const logChannel = client.channels.cache.get(config.modLogs);
        let players = null;
        const serverName = `${config.SN} | Server ${server}`;

        let url;
        if (server === '1') {
            url = `http://${config.FiveMIP}/players.json`;
        }
        
        get(url)
            .set('User-Agent', 'ECRP_Bot/1.0')
            .end((err, res) => {
                if (err) {
                    console.log(err);
                    return interaction.reply({ content: config.errMsg, ephemeral: true });
                }
                const data = JSON.parse(res.text);
                players = data.length;
                const statusEmbed = new EmbedBuilder()
                .setTitle(serverName)
                .setColor(`${config.embedcolor}`)
                .setDescription(`This is the current server status for \`${serverName}\`\n\n**Player Count**: \`${players}/64\`\n**Player List**:\n\n`)
                .setImage(config.logo)
    			.setTimestamp()
				.setFooter({ text: config.embedfooter, iconURL: config.logo });

                if (players === 0) {
                    statusEmbed.addFields(
                        { name: "There Are No Players", value: `There are currently no players on \`${serverName}\`` }
                    );
                } else {
                    data.forEach(player => {
                        statusEmbed.addFields(
                            { name: `[${player.id}] ${player.name}`, value: `**Player Ping**: ${player.ping}` }
                        );
                    });
                }

                const log = new EmbedBuilder()
                .setImage(config.logo)
                .setTimestamp()
                .setFooter({ text: config.embedfooter, iconURL: config.logo })
                .setTitle('Status Command Utilized!')
                .setColor(`${config.embedcolor}`)
                .addFields(
                    { name: 'Used by', value: `<@${interaction.member.id}>` },
                    { name: 'Channel used in', value: `<#${interaction.channel.id}>` },
                )
        
                logChannel.send({ embeds: [log] });
            
                return interaction.reply({ embeds: [statusEmbed] });
            });
    }
}
