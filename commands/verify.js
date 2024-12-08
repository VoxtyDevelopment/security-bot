const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
const mysql = require('mysql2/promise');
const { TeamSpeak } = require('ts3-nodejs-library');

// really cant be asked to make it so they can have their own department names so suck on my big black penis nihha
const departmentRoles = { // yeah I think this is enough if you seriously need more than this **K**uwu **Y**olo **S**hack
    'LSPD': `${config.LSPD}`,
    'BCSO': `${config.BCSO}`,
    'SASP': `${config.SASP}`,
    'SAFR': `${config.SAFR}`,
    'CIV': `${config.CIV}`,
    'COMMS': `${config.COMMS}`,
    'lspd': `${config.LSPD}`,
    'bcso': `${config.BCSO}`,
    'sasp': `${config.SASP}`,
    'safr': `${config.SAFR}`,
    'civ': `${config.CIV}`,
    'comms': `${config.COMMS}`,
    'Los Santos Police Department': `${config.LSPD}`,
    'Blaine County Sheriffs Office': `${config.BCSO}`,
    'San Andreas State Police': `${config.SASP}`,
    'San Andreas Fire Rescue': `${config.SAFR}`,
    'San Andreas Civilian Operations': `${config.CIV}`,
    'San Andreas Communications Department': `${config.COMMS}`,
    'Blaine County Sheriffs Office': `${config.BCSO}`,
    'San Andreas Highway Patrol': `${config.SASP}`,
    'sahp': `${config.SASP}`,
    'SAHP': `${config.SASP}`,
    'Highway Patrol': `${config.SASP}`,
    'Fire Rescue': `${config.SAFR}`,
    'Civilian Operations': `${config.CIV}`,
    'Civilian': `${config.CIV}`,
    'Communications': `${config.COMMS}`,
    'State Police': `${config.SASP}`,
    'Police Department': `${config.LSPD}`,
    'Sheriff\'s Office': `${config.BCSO}`,
    'Blaine County Sheriff\`s Office': `${config.BCSO}`,
    'Police': `${config.LSPD}`,
    'Sheriff': `${config.BCSO}`,
  };

  const tsroles = {
    'LSPD': `${config.TSProbieLSPD}`,
    'BCSO': `${config.TSProbieBCSO}`,
    'SASP': `${config.TSProbieSAHP}`,
    'SAFR': `${config.TsProbieSAFR}`,
    'CIV': `${config.TsProbieCiv}`,
    'COMMS': `${config.TsProbieCOMMS}`,
    'lspd': `${config.TSProbieLSPD}`,
    'bcso': `${config.TSProbieBCSO}`,
    'sasp': `${config.TSProbieSAHP}`,
    'comms': `${config.TsProbieSAFR}`,
    'civ': `${config.TsProbieCiv}`,
    'comms': `${config.TsProbieCOMMS}`,
    'Los Santos Police Department': `${config.TSProbieLSPD}`,
    'Blaine County Sheriffs Office': `${config.TSProbieBCSO}`,
    'San Andreas State Police': `${config.TSProbieSAHP}`,
    'San Andreas Fire Rescue': `${config.TsProbieSAFR}`,
    'San Andreas TsProbieCivilian Operations': `${config.TsProbieCiv}`,
    'San Andreas Communications Department': `${config.TsProbieCOMMS}`,
    'Blaine County Sheriffs Office': `${config.TSProbieBCSO}`,
    'San Andreas Highway Patrol': `${config.TSProbieSAHP}`,
    'sahp': `${config.TSProbieSAHP}`,
    'SAHP': `${config.TSProbieSAHP}`,
    'Highway Patrol': `${config.TSProbieSAHP}`,
    'Fire Rescue': `${config.TsProbieSAFR}`,
    'Civilian Operations': `${config.TsProbieCiv}`,
    'Civilian': `${config.TsProbieCiv}`,
    'Communications': `${config.TsProbieCOMMS}`,
    'State Police': `${config.TSProbieSAHP}`,
    'Police Department': `${config.TSProbieLSPD}`,
    'Sheriff\'s Office': `${config.TSProbieBCSO}`,
    'Blaine County Sheriff\`s Office': `${config.TSProbieBCSO}`,
    'Police': `${config.TSProbieLSPD}`,
    'Sheriff': `${config.TSProbieBCSO}`,
  }

  const tsdeptroles = {
    'LSPD': `${config.TSLSPD}`,
    'BCSO': `${config.TSBCSO}`,
    'SASP': `${config.TSSAHP}`,
    'SAFR': `${config.TSSAFR}`,
    'CIV': `${config.TSCiv}`,
    'COMMS': `${config.TSCOMMS}`,
    'lspd': `${config.TSLSPD}`,
    'bcso': `${config.TSBCSO}`,
    'sasp': `${config.TSSAHP}`,
    'comms': `${config.TSSAFR}`,
    'civ': `${config.TSCiv}`,
    'comms': `${config.TSCOMMS}`,
    'Los Santos Police Department': `${config.TSLSPD}`,
    'Blaine County Sheriffs Office': `${config.TSBCSO}`,
    'San Andreas State Police': `${config.TSSAHP}`,
    'San Andreas Fire Rescue': `${config.TSSAFR}`,
    'San Andreas TsCivilian Operations': `${config.TSCIV}`,
    'San Andreas Communications Department': `${config.TSCOMMS}`,
    'Blaine County Sheriffs Office': `${config.TSBCSO}`,
    'San Andreas Highway Patrol': `${config.TSSAHP}`,
    'sahp': `${config.TSSAHP}`,
    'SAHP': `${config.TSSAHP}`,
    'Highway Patrol': `${config.TSSAHP}`,
    'Fire Rescue': `${config.TSSAFR}`,
    'Civilian Operations': `${config.TSCIV}`,
    'Civilian': `${config.TSCIV}`,
    'Communications': `${config.TSCOMMS}`,
    'State Police': `${config.TSSAHP}`,
    'Police Department': `${config.TSLSPD}`,
    'Sheriff\'s Office': `${config.TSBCSO}`,
    'Blaine County Sheriff\`s Office': `${config.TSBCSO}`,
    'Police': `${config.TSLSPD}`,
    'Sheriff': `${config.TSBCSO}`,
  }



function generateRandomNumber(length) {
    return Math.floor(Math.random() * Math.pow(10, length)).toString().padStart(length, '0');
}

function generateRandomPassword() {
    const length = 8;
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let password = '';
    for (let i = 0; i < length; i++) {
        password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    return password;
}

function generateCallsign(department) { 
    let prefix = '';
    switch (department.toLowerCase()) {
        case 'lspd':
            prefix = config.LSPDCallsign || '2L-';
            break;
        case 'bcso':
            prefix = config.BCSOCallsign || '3C-';
            break;
        case 'sasp':
            prefix = config.SASPCallsign || '1K-';
            break;
        case 'sahp':
            prefix = config.SASPCallsign || '1K-';
            break;
        case 'safr':
            prefix = config.SAFRCallsign || '5R-';
            break;
        case 'civ':
            prefix = config.CIVCallsign || '9C-';
            break;
        case 'comms':
            prefix = config.COMMSCallsign || '7M-';
            break;
        default:
            prefix = 'XX-';
    }
    const randomNumber = generateRandomNumber(3);
    return `${prefix}${randomNumber}`;
}

module.exports = {
    data: new SlashCommandBuilder()
    .setName('verify')
    .setDescription(`Verify yourself into the ${config.SN} community.`),

    async execute(interaction, client, config, con) {
        if(interaction.guild.id !== config.mainGuild) return interaction.reply({content: config.mainGuildMsg, ephemeral: true})
        const reqRole = interaction.guild.roles.cache.find(r => r.id === config.AwaitingVerRole);
        const permission = reqRole.position <= interaction.member.roles.highest.position;
        if(!permission) return interaction.reply({content: config.noPermMsg, ephemeral: true })
        
            const modal = new ModalBuilder()
            .setCustomId('verify_modal')
            .setTitle('Verification Form')
            .addComponents(
                new ActionRowBuilder().addComponents(
                    new TextInputBuilder()
                        .setCustomId('roleplay_name')
                        .setLabel("Roleplay Name")
                        .setStyle(TextInputStyle.Short)
                        .setPlaceholder(`(ex, T. Burns)`)
                        .setRequired(true)
                ),
                new ActionRowBuilder().addComponents(
                    new TextInputBuilder()
                        .setCustomId('ts3_uid')
                        .setLabel("Teamspeak UID")
                        .setStyle(TextInputStyle.Short)
                        .setPlaceholder(`(ex, Q2O4hh4vOeFszK28SZ2YghIXNCA=)`)
                        .setRequired(true)
                ),
                new ActionRowBuilder().addComponents(
                    new TextInputBuilder()
                        .setCustomId('web_id')
                        .setLabel("Web ID")
                        .setStyle(TextInputStyle.Short)
                        .setPlaceholder(`(ex, 248)`)
                        .setRequired(true)
                ),
                new ActionRowBuilder().addComponents(
                    new TextInputBuilder()
                        .setCustomId('steam_hex')
                        .setLabel("Steam Hex (steamid.pro)")
                        .setPlaceholder(`(ex, 1100001342334a4)`)
                        .setStyle(TextInputStyle.Short)
                        .setRequired(true)
                ),
                new ActionRowBuilder().addComponents(
                    new TextInputBuilder()
                        .setCustomId('department')
                        .setLabel("Department (ex. SAHP)")
                        .setStyle(TextInputStyle.Short)
                        .setPlaceholder(`(ex, SAHP)`)
                        .setRequired(true)
                )
            );

            await interaction.showModal(modal)

            client.on('interactionCreate', async interaction => {
            if (!interaction.isModalSubmit() || interaction.customId !== 'verify_modal') return;

            const roleplayName = interaction.fields.getTextInputValue('roleplay_name');
            const ts3Uid = interaction.fields.getTextInputValue('ts3_uid');
            const webId = interaction.fields.getTextInputValue('web_id');
            const sh = interaction.fields.getTextInputValue('steam_hex');
            const dept = interaction.fields.getTextInputValue('department');

            const logChannel = interaction.guild.channels.cache.get(config.verifylogs);
            if (!logChannel) {
                console.error(`Log channel with ID ${config.verifylogs} not found.`);
                await interaction.reply({ content: "Log channel not found.", ephemeral: true });
                return;
            }

            const pool = mysql.createPool(
                {
                connectionLimit: `${config.connectionLimit}`,
                user: `${config.dbuser}`,
                password: `${config.dbpassword}`,
                host: `${config.dbhost}`,
                port: `${config.port}`,
                database: `${config.database}`,
                }
            )

            const callsign = generateCallsign(dept);
            const communityID = generateRandomNumber(6);

            const verificationEmbed = new EmbedBuilder()
                .setTitle('New Verification Request')
                .setDescription(`**User:** ${interaction.user.username}\nPlease review the information and take action:`)
                .addFields(
                    { name: 'Discord Id', value: `${interaction.user.id} + <@${interaction.user.id}>` },
                    { name: 'Roleplay Name', value: roleplayName },
                    { name: 'Teamspeak UID', value: ts3Uid },
                    { name: 'Steam Hex', value: sh },
                    { name: 'Web ID', value: webId },                    
                    { name: 'Department', value: dept},
                    { name: 'Callsign', value: callsign },
                    { name: 'Community ID', value: communityID }
                )
                .setColor(config.embedcolor)
                .setThumbnail(config.logo)
                .setTimestamp()
                .setFooter({ text: config.embedfooter, iconURL: config.logo });

            if (config.verfiymanualapprove) {
                const acceptButton = new ButtonBuilder()
                .setCustomId(`accept_${interaction.user.id}`)
                .setLabel('✅ Accept Verification')
                .setStyle(ButtonStyle.Success);

            const denyButton = new ButtonBuilder()
                .setCustomId(`deny_${interaction.user.id}`)
                .setLabel('❌ Deny Verification')
                .setStyle(ButtonStyle.Danger);

            const actionRow = new ActionRowBuilder().addComponents(acceptButton, denyButton);

            try {
                const verificationMessage = await logChannel.send({ embeds: [verificationEmbed], components: [actionRow] });

                const buttonFilter = i => (i.customId === `accept_${interaction.user.id}` || i.customId === `deny_${interaction.user.id}`) && i.message.id === verificationMessage.id;
                const buttonCollector = verificationMessage.createMessageComponentCollector({ filter: buttonFilter, time: 60000 });

                const guild = client.guilds.cache.get(interaction.guildId);

                buttonCollector.on('collect', async i => {
                    const hasRole = i.member.roles.cache.has(config.SIT) || i.member.roles.cache.has(config.Staff) || i.member.roles.cache.has(config.SStaff) || i.member.roles.cache.has(config.JAdmin) || i.member.roles.cache.has(config.Admin) || i.member.roles.cache.has(config.BOD) || i.member.roles.cache.has(config.CAT);
                    if (!hasRole) {
                        await i.reply({ content: "You do not have the required roles to accept verifications.", ephemeral: true });
                        return;
                    }

                    if (i.customId === `accept_${interaction.user.id}`) {
                            const rpname = `${roleplayName} ${callsign}`
                            const member = await interaction.guild.members.fetch(interaction.user.id);
                            await member.roles.add([config.Whitelist, config.Membership]);
                            await member.setNickname(rpname)
                            await member.roles.remove(config.AwaitingVerRole);
                            await i.reply({ content: 'You have accepted the verification request and roles have been added.', ephemeral: true });

                            // generate temporary password
                            try {
                                const password1 = generateRandomPassword();
    
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
                                    await ts3.connect();
        
                                    const duration = `30`
        
                                    await ts3.execute('servertemppasswordadd', {
                                        pw: password1,
                                        desc: `Temporary password for ${rpname}`,
                                        duration: duration * 60 // generates a temporary password that is valid for 30 minutes.
                                    });

                                    // asign TS3 UID Member Role, Probationary Role & Department Role
                                    
                                    /*
                                    const tsclient = await ts3.getClientByUid(ts3Uid)

                                    tsclient.addGroups(`209`);

                                    if (dept && tsroles[dept]) {
                                        tsclient.addGroups(tsroles[dept]);
                                    }

                                    if (dept && tsdeptroles[dept]) {
                                        tsclient.addGroups(tsdeptroles[dept]);
                                    }
                                    */

                                    
                                } finally {
                                    await ts3.logout();
                                    ts3.quit();
                                }
    
                                // accepted embed for buttons
                                const aceceptedembed = new EmbedBuilder()
                                .setTitle(`Your verification in ${config.SN} has been accepted.`)
                                .setDescription(`Below is the information submitted into the database, take note of your Community ID & Temporary Callsign.`)
                                .addFields(
                                    { name: `Department`, value: `${dept}`, inline: true},
                                    { name: `Community Name` , value: `${roleplayName}`, inline: true},
                                    { name: `Callsign`, value: `${callsign}`, inline: true},
                                    { name: `Community ID`, value: `${communityID}`, inline: true},
                                    { name: `Steam Hex`, value: `${sh}`, inline: true},
                                    { name: `Discord ID`, value: `${interaction.user.id}`, inline: true},
                                    { name: `Web ID`, value: `${webId}`, inline: true},
                                    { name: `TS3 UID`, value: `${ts3Uid}`, inline: true},
                                    { name: `TS3 Pass`, value: `${password1}`, inline: true }
                                )
                                .setColor(config.embedcolor)
                                .setThumbnail(config.logo)
                                .setTimestamp()
                                .setFooter({ text: config.embedfooter, iconURL: config.logo });

                            await interaction.user.send({ embeds: [aceceptedembed] });
                            if (dept && departmentRoles[dept]) {
                                const deptrole = guild.roles.cache.get(departmentRoles[dept]);
                                if (deptrole) {
                                  await member.roles.add(deptrole);
                                }
                            }
                            const connection = await pool.getConnection();
                            await connection.query('INSERT INTO users (name, discId, webId, ts3, steamHex, department, communityID, callsign) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', [roleplayName, interaction.user.id, webId, ts3Uid, sh, dept, communityID, callsign]);
                            connection.release();

                        } catch (error) {
                            console.error('Failed to add roles or save to database:', error);
                            await i.reply({ content: 'An error occurred while processing the verification request.', ephemeral: true });
                        }
                    } else if (i.customId === `deny_${interaction.user.id}`) {
                        await i.reply({ content: 'You have denied the verification request.', ephemeral: true });
                        await interaction.user.send(`Your verification request in ${config.SN} has been denied.`);
                    }
                });

                buttonCollector.on('end', async collected => {
                    if (collected.size === 0) {
                        try {
                            await verificationMessage.edit({ components: [] });
                        } catch (error) {
                            console.error('Failed to edit verification message after collector end:', error);
                        }
                    }
                });

                
                await interaction.reply({ content: 'Your information has been submitted for verification.', ephemeral: true });
                if (!interaction.member) {
                    return interaction.reply({ content: "Member information not found.", ephemeral: true });
                }

                if (interaction.replied || interaction.deferred) {
                    console.error('Interaction already replied to or deferred.');
                    return;
                }
                                
            } catch (error) {
                console.error('Failed to send verification embed:', error);
            }
            } else {
                try {
                    const guild = client.guilds.cache.get(interaction.guildId);
                    await logChannel.send({ embeds: [verificationEmbed] });
                    const rpname = `${roleplayName} ${callsign}`
                    const member = await interaction.guild.members.fetch(interaction.user.id);
                    await member.roles.add([config.Whitelist, config.Membership]);
                    await member.setNickname(rpname)
                    await member.roles.remove(config.AwaitingVerRole);
                    const password = generateRandomPassword();

                    // TS3 Temp Password Generator
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
                            await ts3.connect();

                            const duration = `30`

                            await ts3.execute('servertemppasswordadd', {
                                pw: password,
                                desc: `Temporary password for ${rpname}`,
                                duration: duration * 60 // generates a temporary password that is valid for 30 minutes.
                            });
                            
                            // asign TS3 UID Member Role, Probationary Role & Department Role

                            /*
                                    
                            const tsclient1 = await ts3.getClientByUid(ts3Uid)

                            tsclient1.addGroups(config.TSMember);

                            if (dept && tsroles[dept]) {
                                tsclient1.addGroups(tsroles[dept]);
                            }

                            if (dept && tsdeptroles[dept]) {
                                tsclient1.addGroups(tsdeptroles[dept]);
                            }

                            */

                        } finally {
                            await ts3.logout();
                            ts3.quit();
                        }

                    // Embed

                    // accepted embed for non button
                    const aceceptedembed1 = new EmbedBuilder()
                    .setTitle(`Your verification in ${config.SN} has been accepted.`)
                    .setDescription(`Below is the information submitted into the database, take note of your Community ID & Temporary Callsign.`)
                    .addFields(
                        { name: `Department`, value: `${dept}`, inline: true},
                        { name: `Community Name` , value: `${roleplayName}`, inline: true},
                        { name: `Callsign`, value: `${callsign}`, inline: true},
                        { name: `Community ID`, value: `${communityID}`, inline: true},
                        { name: `Steam Hex`, value: `${sh}`, inline: true},
                        { name: `Discord ID`, value: `${interaction.user.id}`, inline: true},
                        { name: `Web ID`, value: `${webId}`, inline: true},
                        { name: `TS3 UID`, value: `${ts3Uid}`, inline: true},
                        { name: `TS3 Pass`, value: `${password}`, inline: true }
                    )
                    .setColor(config.embedcolor)
                    .setThumbnail(config.logo)
                    .setTimestamp()
                    .setFooter({ text: config.embedfooter, iconURL: config.logo });


                    await interaction.user.send({ embeds: [aceceptedembed1] });
                    if (dept && departmentRoles[dept]) {
                        const deptrole = guild.roles.cache.get(departmentRoles[dept]);
                        if (deptrole) {
                          await member.roles.add(deptrole);
                        }
                    }
                    const connection = await pool.getConnection();
                    await connection.query('INSERT INTO users (name, discId, webId, ts3, steamHex, department, communityID, callsign) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', [roleplayName, interaction.user.id, webId, ts3Uid, sh, dept, communityID, callsign]);
                    connection.release();
                } catch (error) {
                    console.error('Failed to add roles or save to database:', error);
                }
            }
            await interaction.reply({ content: 'Your information has been submitted for verification.', ephemeral: true });
        });    
    }
};
