const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { post } = require("superagent");

// no way if testing if this actually works so :(

module.exports = {
    data: new SlashCommandBuilder()
        .setName('websync')
        .setDescription('Syncs your discord roles with your IPS roles.')
        .addStringOption(option =>
            option.setName('webid')
                .setDescription('User WebID')
                .setRequired(false)),

    async execute(interaction, client, config, con) {
        const logChannel = client.channels.cache.get(config.modLogs);
        if (!logChannel) {
            console.error(`Log channel with ID ${config.modLogs} not found.`);
            await interaction.reply({ content: "Log channel not found.", ephemeral: true });
            return;
        }

        const websiteid = interaction.options.getString('webid');

        const userId = interaction.member.id;

        if (websiteid) {
            try {
                const mguild = client.guilds.cache.get(config.mainGuild);
            
                const member = await mguild.members.fetch(interaction.user.id)

                if (member.roles.cache.has(config.Membership)) {
                    post(`http://${config.invisionDomain}/api/core/members/${websiteid}?group=${config.invMember}&key=${config.invisionAPI}`)
                    .set('User-Agent', 'ECRP_Bot/1.0')
                    .end((err, res) => {
                        if(err) {
                            console.log(err)
                            return interaction.reply({content: config.errMsg, ephemeral: true})
                        }                    
                    })
                }

                if (member.roles.cache.has(config.SIT)) {
                    post(`http://${config.invisionDomain}/api/core/members/${websiteid}?group=${config.invSIT}&key=${config.invisionAPI}`)
                    .set('User-Agent', 'ECRP_Bot/1.0')
                    .end((err, res) => {
                        if(err) {
                            console.log(err)
                            return interaction.reply({content: config.errMsg, ephemeral: true})
                        }                    
                    })
                }

                if (member.roles.cache.has(config.Staff)) {
                    post(`http://${config.invisionDomain}/api/core/members/${websiteid}?group=${config.invStaff}&key=${config.invisionAPI}`)
                    .set('User-Agent', 'ECRP_Bot/1.0')
                    .end((err, res) => {
                        if(err) {
                            console.log(err)
                            return interaction.reply({content: config.errMsg, ephemeral: true})
                        }                    
                    })
                }

                if (member.roles.cache.has(config.SStaff)) {
                    post(`http://${config.invisionDomain}/api/core/members/${websiteid}?group=${config.invSStaff}&key=${config.invisionAPI}`)
                    .set('User-Agent', 'ECRP_Bot/1.0')
                    .end((err, res) => {
                        if(err) {
                            return interaction.reply({content: config.errMsg, ephemeral: true})
                        }                    
                    })
                }

                if (member.roles.cache.has(config.JAdmin)) {
                    post(`http://${config.invisionDomain}/api/core/members/${websiteid}?group=${config.invJAdmin}&key=${config.invisionAPI}`)
                    .set('User-Agent', 'ECRP_Bot/1.0')
                    .end((err, res) => {
                        if(err) {
                            console.log(err)
                            return interaction.reply({content: config.errMsg, ephemeral: true})
                        }                    
                    })
                }

                if (member.roles.cache.has(config.Admin)) {
                    post(`http://${config.invisionDomain}/api/core/members/${websiteid}?group=${config.invAdmin}&key=${config.invisionAPI}`)
                    .set('User-Agent', 'ECRP_Bot/1.0')
                    .end((err, res) => {
                        if(err) {
                            console.log(err)
                            return interaction.reply({content: config.errMsg, ephemeral: true})
                        }                    
                    })
                }

                const logembed = new EmbedBuilder()
                .setTitle('User synced roles with IPS')
                .setColor(`${config.embedcolor}`)
                .addFields(
                    { name: 'Discord Id', value: `${interaction.user.id} + <@${interaction.user.id}>`},
                    { name: 'Website Link', value: `http://${config.invisionDomain}/profile/${websiteid}-${config.SN}/`},
                )
                .setImage(config.logo)
                .setTimestamp()
                .setFooter({ text: config.embedfooter, iconURL: config.logo });

                logChannel.send({ embeds: [logembed] });        
            } catch (error) { // don't be mad if niggas start screening this :)
                console.error(`Tom Yankton is a fat fuck! There was an error.`, error);
                interaction.reply({ content: 'There was an erorr executing this command.', ephemeral: true })
            }
        } else {
            try {

                con.query('SELECT * FROM users WHERE discId = ?', [userId], async (err, rows) => {
                    if (err) return interaction.reply({ content: 'Failed to retrieve user information from database.', ephemeral: true });
                    if (!rows[0]) return interaction.reply({ content: 'User information not found in database.', ephemeral: true });
    
                    const usercache = rows[0];
    
                    const mguild = client.guilds.cache.get(config.mainGuild);
                
                    const member = await mguild.members.fetch(interaction.user.id)
    
                    if (member.roles.cache.has(config.Membership)) {
                        post(`http://${config.invisionDomain}/api/core/members/${usercache.webid}?group=${config.invMember}&key=${config.invisionAPI}`)
                        .set('User-Agent', 'ECRP_Bot/1.0')
                        .end((err, res) => {
                            if(err) {
                                console.log(err)
                                return interaction.reply({content: config.errMsg, ephemeral: true})
                            }                    
                        })
                    }
    
                    if (member.roles.cache.has(config.SIT)) {
                        post(`http://${config.invisionDomain}/api/core/members/${usercache.webid}?group=${config.invSIT}&key=${config.invisionAPI}`)
                        .set('User-Agent', 'ECRP_Bot/1.0')
                        .end((err, res) => {
                            if(err) {
                                console.log(err)
                                return interaction.reply({content: config.errMsg, ephemeral: true})
                            }                    
                        })
                    }
    
                    if (member.roles.cache.has(config.Staff)) {
                        post(`http://${config.invisionDomain}/api/core/members/${usercache.webid}?group=${config.invStaff}&key=${config.invisionAPI}`)
                        .set('User-Agent', 'ECRP_Bot/1.0')
                        .end((err, res) => {
                            if(err) {
                                console.log(err)
                                return interaction.reply({content: config.errMsg, ephemeral: true})
                            }                    
                        })
                    }
    
                    if (member.roles.cache.has(config.SStaff)) {
                        post(`http://${config.invisionDomain}/api/core/members/${usercache.webid}?group=${config.invSStaff}&key=${config.invisionAPI}`)
                        .set('User-Agent', 'ECRP_Bot/1.0')
                        .end((err, res) => {
                            if(err) {
                                return interaction.reply({content: config.errMsg, ephemeral: true})
                            }                    
                        })
                    }
    
                    if (member.roles.cache.has(config.JAdmin)) {
                        post(`http://${config.invisionDomain}/api/core/members/${usercache.webid}?group=${config.invJAdmin}&key=${config.invisionAPI}`)
                        .set('User-Agent', 'ECRP_Bot/1.0')
                        .end((err, res) => {
                            if(err) {
                                console.log(err)
                                return interaction.reply({content: config.errMsg, ephemeral: true})
                            }                    
                        })
                    }
    
                    if (member.roles.cache.has(config.Admin)) {
                        post(`http://${config.invisionDomain}/api/core/members/${usercache.webid}?group=${config.invAdmin}&key=${config.invisionAPI}`)
                        .set('User-Agent', 'ECRP_Bot/1.0')
                        .end((err, res) => {
                            if(err) {
                                console.log(err)
                                return interaction.reply({content: config.errMsg, ephemeral: true})
                            }                    
                        })
                    }
    
                    const logembed = new EmbedBuilder()
                    .setTitle('User synced roles with IPS')
                    .setColor(`${config.embedcolor}`)
                    .addFields(
                        { name: 'Discord Id', value: `${interaction.user.id} + <@${interaction.user.id}>`},
                        { name: 'Website Link', value: `http://${config.invisionDomain}/profile/${usercache.webid}-${config.SN}/`},
                    )
                    .setImage(config.logo)
                    .setTimestamp()
                    .setFooter({ text: config.embedfooter, iconURL: config.logo });
    
                    logChannel.send({ embeds: [logembed] });
            
                })
            } catch (error) { // don't be mad if niggas start screening this :)
                console.error(`Tom Yankton is a fat fuck! There was an error.`, error);
                interaction.reply({ content: 'There was an error executing this command.', ephemeral: true })
            }
        }
        await interaction.reply(`Your website roles have sucessfully been updated.`)
    }
}
