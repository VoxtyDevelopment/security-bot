// fuck this command :) i can already tell you this is gonna take me until 3:00am

const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const { TeamSpeak } = require('ts3-nodejs-library');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('tssync')
        .setDescription('Syncs your discord roles with your Teamspeak roles.')
        .addStringOption(option =>
            option.setName('tsuid')
                .setDescription('User TSUID')
                .setRequired(false)),

        async execute(interaction, client, config, con) {
            const reqRole = interaction.guild.roles.cache.find(r => r.id === config.Membership);
            const permission = reqRole.position <= interaction.member.roles.highest.position;

            if (!permission) return interaction.reply({ content: config.noPermMsg, ephemeral: true });

            const logChannel = client.channels.cache.get(config.modLogs);
            if (!logChannel) {
                console.error(`Log channel with ID ${config.modLogs} not found.`);
                await interaction.reply({ content: "Log channel not found.", ephemeral: true });
                return;
            }

            const ts3uid = interaction.options.getString('tsuid');

            // I GET NOOO KICK FROM CHAMPAGNE MERE ALCOHOL DOESN'T THRILL ME AT ALL SO TELL ME WHY SHOULDN'T IT BE TRUE? I GET A KICK OUT OF BREW
            
            const userId = interaction.member.id;

            const ts3 = new TeamSpeak({
                host: `${config.TSHost}`,
                queryport: `${config.TSQueryPort}`,
                serverport: `${config.TSServerPort}`,
                username: `${config.TSQueryUsername}`,
                password: `${config.TSQueryPassword}`,
                nickname: `${config.TSNickname}`,
                protocol: 'raw'
            });

            try {
                con.query('SELECT * FROM users WHERE discId = ?', [userId], async (err, rows) => {
                    if (err) return interaction.reply({ content: 'Failed to retrieve user information from database.', ephemeral: true });
                    if (!rows[0]) return interaction.reply({ content: 'User information not found in database.', ephemeral: true });
    
                    const usercache = rows[0];

                    const mguild = client.guilds.cache.get(config.mainGuild);
            
                    const member = await mguild.members.fetch(interaction.user.id)

                    if(ts3uid) {
                        const tsclient = await ts3.getClientByUid(ts3uid)

                        if (member.roles.cache.has(config.Membership)) {
                            tsclient.addGroups(config.TSMember);
                        }
                        
                        if (member.roles.cache.has(config.SIT)) {
                            tsclient.addGroups(config.TSSIT);
                        }
                        
                        if (member.roles.cache.has(config.Staff)) {
                            tsclient.addGroups(config.TSStaff);
                        }
                        
                        if (member.roles.cache.has(config.SStaff)) {
                            tsclient.addGroups(config.TSSStaff);
                        }
                        
                        if (member.roles.cache.has(config.JAdmin)) {
                            tsclient.addGroups(config.TSJAdmin);
                        }
                        
                        if (member.roles.cache.has(config.Admin)) {
                            tsclient.addGroups(config.TSAdmin);
                        }
                        
                        if (member.roles.cache.has(config.BCSO)) {
                            tsclient.addGroups(config.TSBCSO);
                        }
                        
                        if (member.roles.cache.has(config.LSPD)) {
                            tsclient.addGroups(config.TSLSPD);
                        }
                        
                        if (member.roles.cache.has(config.SASP)) {
                            tsclient.addGroups(config.TSSAHP);
                        }
                        
                        if (member.roles.cache.has(config.SAFR)) {
                            tsclient.addGroups(config.TSSAFR);
                        }
                        
                        if (member.roles.cache.has(config.CIV)) {
                            tsclient.addGroups(config.TSSAFR);
                        }
                        
                        if (member.roles.cache.has(config.COMMS)) {
                            tsclient.addGroups(config.TSCOMMS);
                        }
                        
                        if (member.roles.cache.has(config.Media)) {
                            tsclient.addGroups(config.TSMedia);
                        }
                        
                        if (member.roles.cache.has(config.Dev)) {
                            tsclient.addGroups(config.TSDev);
                        }
                        
                        if (member.roles.cache.has(config.Membership) && member.roles.cache.has(config.BCSO)) {
                            tsclient.addGroups(config.TSProbieBCSO);
                        }
                        
                        if (member.roles.cache.has(config.Membership) && member.roles.cache.has(config.SASP)) {
                            tsclient.addGroups(config.TSProbieSAHP);
                        }
                        
                        if (member.roles.cache.has(config.Membership) && member.roles.cache.has(config.LSPD)) {
                            tsclient.addGroups(config.TSProbieLSPD);
                        }
                        
                        if (member.roles.cache.has(config.Membership) && member.roles.cache.has(config.Civ)) {
                            tsclient.addGroups(config.TSProbieCiv);
                        }
                        
                        if (member.roles.cache.has(config.Membership) && member.roles.cache.has(config.SAFR)) {
                            tsclient.addGroups(config.TSProbieSAFR);
                        }
                        
                        if (member.roles.cache.has(config.Membership) && member.roles.cache.has(config.COMMS)) {
                            tsclient.addGroups(config.TSProbieCOMMS);
                        }
                        
                        if (member.roles.cache.has(config.Membership) && member.roles.cache.has(config.Media)) {
                            tsclient.addGroups(config.TSProbieMedia);
                        }
                        
                        if (member.roles.cache.has(config.Membership) && member.roles.cache.has(config.Dev)) {
                            tsclient.addGroups(config.TSProbieDev);
                        }
                    }

                    if (!ts3uid) {
                        const tsclient = await ts3.getClientByUid(usercache.ts3)

                        if (member.roles.cache.has(config.Membership)) {
                            tsclient.addGroups(config.TSMember);
                        }
                        
                        if (member.roles.cache.has(config.SIT)) {
                            tsclient.addGroups(config.TSSIT);
                        }
                        
                        if (member.roles.cache.has(config.Staff)) {
                            tsclient.addGroups(config.TSStaff);
                        }
                        
                        if (member.roles.cache.has(config.SStaff)) {
                            tsclient.addGroups(config.TSSStaff);
                        }
                        
                        if (member.roles.cache.has(config.JAdmin)) {
                            tsclient.addGroups(config.TSJAdmin);
                        }
                        
                        if (member.roles.cache.has(config.Admin)) {
                            tsclient.addGroups(config.TSAdmin);
                        }
                        
                        if (member.roles.cache.has(config.BCSO)) {
                            tsclient.addGroups(config.TSBCSO);
                        }
                        
                        if (member.roles.cache.has(config.LSPD)) {
                            tsclient.addGroups(config.TSLSPD);
                        }
                        
                        if (member.roles.cache.has(config.SASP)) {
                            tsclient.addGroups(config.TSSAHP);
                        }
                        
                        if (member.roles.cache.has(config.SAFR)) {
                            tsclient.addGroups(config.TSSAFR);
                        }
                        
                        if (member.roles.cache.has(config.CIV)) {
                            tsclient.addGroups(config.TSSAFR);
                        }
                        
                        if (member.roles.cache.has(config.COMMS)) {
                            tsclient.addGroups(config.TSCOMMS);
                        }
                        
                        if (member.roles.cache.has(config.Media)) {
                            tsclient.addGroups(config.TSMedia);
                        }
                        
                        if (member.roles.cache.has(config.Dev)) {
                            tsclient.addGroups(config.TSDev);
                        }
                        
                        if (member.roles.cache.has(config.Membership) && member.roles.cache.has(config.BCSO)) {
                            tsclient.addGroups(config.TSProbieBCSO);
                        }
                        
                        if (member.roles.cache.has(config.Membership) && member.roles.cache.has(config.SASP)) {
                            tsclient.addGroups(config.TSProbieSAHP);
                        }
                        
                        if (member.roles.cache.has(config.Membership) && member.roles.cache.has(config.LSPD)) {
                            tsclient.addGroups(config.TSProbieLSPD);
                        }
                        
                        if (member.roles.cache.has(config.Membership) && member.roles.cache.has(config.Civ)) {
                            tsclient.addGroups(config.TSProbieCiv);
                        }
                        
                        if (member.roles.cache.has(config.Membership) && member.roles.cache.has(config.SAFR)) {
                            tsclient.addGroups(config.TSProbieSAFR);
                        }
                        
                        if (member.roles.cache.has(config.Membership) && member.roles.cache.has(config.COMMS)) {
                            tsclient.addGroups(config.TSProbieCOMMS);
                        }
                        
                        if (member.roles.cache.has(config.Membership) && member.roles.cache.has(config.Media)) {
                            tsclient.addGroups(config.TSProbieMedia);
                        }
                        
                        if (member.roles.cache.has(config.Membership) && member.roles.cache.has(config.Dev)) {
                            tsclient.addGroups(config.TSProbieDev);
                        }
                    }

                    // prolly a lot easier way to do this :) im too lazy to find it out
                })
            } catch (error) { // don't be mad if niggas start screening this :)
                console.error(`Tom Yankton is a fat fuck! There was an error.`, error);
                interaction.reply({ content: 'There was an erorr executing this command.', ephemeral: true })
            }

            const logembed = new EmbedBuilder()
            .setTitle(`User synced roles with Teamspeak`)
            .addFields(
                { name: 'Discord Id', value: `${interaction.user.id} + <@${interaction.user.id}>`},
            )
            .setImage(config.logo)
            .setColor(`${config.embedcolor}`)
            .setTimestamp()
            .setFooter({ text: config.embedfooter, iconURL: config.logo });

            logChannel.send({ embeds: [logembed] });

            await interaction.reply(`Your teamspeak roles have been sucessfully updated.`)
    }
}
