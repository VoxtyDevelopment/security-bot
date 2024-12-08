const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
const mysql = require('mysql2/promise');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('edituser')
        .setDescription(`Edit a user in the ${config.SN} database.`),

        async execute(interaction, client, config, con) {
            if(interaction.guild.id !== config.mainGuild) return interaction.reply({content: config.mainGuildMsg, ephemeral: true})
            const reqRole = interaction.guild.roles.cache.find(r => r.id === config.JAdmin);
            const permission = reqRole.position <= interaction.member.roles.highest.position;
            if(!permission) return interaction.reply({content: config.noPermMsg, ephemeral: true})
            const logChannel = client.channels.cache.get(config.muteLogs);

            const modal = new ModalBuilder()
            .setCustomId('verify_modal')
            .setTitle('Verification Form')
            .addComponents(
                new ActionRowBuilder().addComponents(
                    new TextInputBuilder()
                        .setCustomId('discord_id')
                        .setLabel("Discord ID")
                        .setStyle(TextInputStyle.Short)
                        .setPlaceholder(`(ex, 1244850188745572384)`)
                        .setRequired(true)
                ),
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
                )
            );

            await interaction.showModal(modal)

            client.on('interactionCreate', async interaction => {
                if (!interaction.isModalSubmit() || interaction.customId !== 'verify_modal') return;
    
                const discordId = interaction.fields.getTextInputValue('discord_id');
                const roleplayName = interaction.fields.getTextInputValue('roleplay_name');
                const ts3Uid = interaction.fields.getTextInputValue('ts3_uid');
                const webId = interaction.fields.getTextInputValue('web_id');
                const sh = interaction.fields.getTextInputValue('steam_hex');

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

                const connection = await pool.getConnection();
                
                await connection.query(
                    `UPDATE users SET name = ?, webId = ?, ts3 = ?, steamHex = ? WHERE discId = ?`,
                    [roleplayName, webId, ts3Uid, sh, discordId]
                );
                connection.release();

            const logembed = new EmbedBuilder()
            .setTitle('User updated in the database.')
            .addFields(
                { name: `Moderator:`, value: `<@${interaction.user.id}>` },
                { name: `User updated:`, value: `<@${discordId}>` },
                { name: `Roleplay name:`, value: `${roleplayName}` },
                { name: `Teamspeak UID:`, value: `${ts3Uid}` },
                { name: `Web ID:`, value: `${webId}` },
                { name: `Steam Hex:`, value: `${sh}` },
            )
            .setColor(config.embedcolor)
            .setThumbnail(config.logo)
            .setTimestamp()
            .setFooter({ text: config.embedfooter, iconURL: config.logo });

            await logChannel.send({ embeds: [logembed] });
            await interaction.reply({content: `User <@${discordId}> has been updated in the database.`, ephemeral: true})
        })
        }
}
