const { Client, Collection, GatewayIntentBits, Partials, Events, ActionRowBuilder, WebhookClient, StringSelectMenuOptionBuilder, StringSelectMenuBuilder, MessageSelectMenu, ButtonBuilder, ButtonStyle, ModalBuilder, Embed } = require('discord.js');
const { TextInputBuilder, TextInputStyle } = require('discord.js');
const fs = require('fs');
const config = require('./config');
const mysql = require("mysql2");
const path = require("path");
const axios = require('axios');
const { createPool } = require('mysql2/promise');
const {deploy} = require("./utilities/core/deploy-commands")
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildBans, GatewayIntentBits.GuildInvites, GatewayIntentBits.GuildPresences, GatewayIntentBits.GuildMembers, GatewayIntentBits.DirectMessages]});
global.config = config

// sql connection
const con = mysql.createPool(
    {
    connectionLimit: `${config.connectionLimit}`,
    user: `${config.dbuser}`,
    password: `${config.dbpassword}`,
    host: `${config.dbhost}`,
    port: `${config.port}`,
    database: `${config.database}`,
    }
)
console.log("SQL Services Started")

deploy()

con.query(`
    CREATE TABLE IF NOT EXISTS muterecords (
        id INT AUTO_INCREMENT PRIMARY KEY,
        discId VARCHAR(255),
        modId VARCHAR(255),
        muteReason TEXT,
        muteDate DATETIME
    )
`);

con.query(`
    CREATE TABLE IF NOT EXISTS activemutes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        guildId VARCHAR(255) NOT NULL,
        discId VARCHAR(255) NOT NULL,
        muteReason TEXT DEFAULT NULL,
        roles VARCHAR(255) NOT NULL,
        muteChannel VARCHAR(255) NOT NULL
    )
`);


con.query(`
    CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL DEFAULT '',
        discId VARCHAR(255) NOT NULL,
        webId VARCHAR(255) NOT NULL,
        ts3 VARCHAR(255) NOT NULL,
        steamHex VARCHAR(255) NOT NULL,
        department VARCHAR(255) NOT NULL,
        communityID VARCHAR(255) NOT NULL,
        callsign VARCHAR(255) NOT NULL
    )
`);

con.query(`
    CREATE TABLE IF NOT EXISTS patrols (
    id INT AUTO_INCREMENT PRIMARY KEY,
    type VARCHAR(255) NOT NULL,
    date VARCHAR(255) NOT NULL,
    time VARCHAR(255) NOT NULL,
    aop VARCHAR(255) NOT NULL,
    message_id VARCHAR(255) NOT NULL
)
`);


con.query(`
    CREATE TABLE IF NOT EXISTS patrol_attendance (
    id INT AUTO_INCREMENT PRIMARY KEY,
    patrol_id INT NOT NULL,
    user_id VARCHAR(255) NOT NULL,
    reaction VARCHAR(255) NOT NULL,
    FOREIGN KEY (patrol_id) REFERENCES patrols(id)
)
`);


client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;
});

if (config.welcomeEnabled) {
    client.on('guildMemberAdd', (member) => {

       
        const welcomeChannel = member.guild.channels.cache.get(config.welcomechannel);
    
        const welcomeRole = member.guild.roles.cache.find(r => r.id === config.AwaitingVerRole);
        member.roles.add(welcomeRole);
    
        const welcomeembed = new EmbedBuilder()
        .setTitle(`${config.SN} Verification`)
        .setDescription(`Welcome ${member.user}\n\nWelcome to the ${config.SN} discord\n\nPlease set your name format to the ${config.SN} standard \`${config.nameFormatformat}\`\n\nPlease do \`/verify\` to verify yourself into the community.\n\n**Have these ready**\n\n__**Website Profile Link**__\nex. (https://${config.invisionDomain}/profile/1-voxdev-verf)\n\n__**Teamspeak UID**__\n*Q2O4hh4vOeFszK28SZ2YghIXNCA=*\n\n__**Steam Hex**__\n110000101ad83ee`)
        .setColor(config.embedcolor)
        .setThumbnail(config.logo)
        .setTimestamp()
        .setFooter({ text: config.embedfooter, iconURL: config.logo });


        welcomeChannel.send({ content: `${member.user}` , embeds: [welcomeembed]});

    });   
}


client.commands = new Collection();

const commandPath = path.join(__dirname, config.commandDir);
const commandFiles = fs.readdirSync(commandPath).filter(file => file.endsWith('.js'));

for(const file of commandFiles) {
    const filePath = path.join(commandPath, file);
    const command = require(filePath);
    if ('data' in command && 'execute' in command) {
        client.commands.set(command.data.name, command);
    } else {
        console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property`)
    }
}


client.on(Events.InteractionCreate, async interaction => {
    if(!interaction.isChatInputCommand()) return;
    
    const command = interaction.client.commands.get(interaction.commandName);

    if(!command) {
        console.error(`No command matching ${interaction.commandName} was found.`)
        return;
    }

    try{
        await command.execute(interaction, client, config, con);
    } catch (err) {
        console.error(err);
        await interaction.reply({ content: "there was an error while executing this command!", ephemeral: true})
    }
})

const eventFiles = fs.readdirSync(path.join(__dirname, config.eventDir)).filter(file => file.endsWith('.js'));
for(const file of eventFiles) {
    const filePath = `./${config.eventDir}/${file}`
    const event = require(filePath)
    if(event.once) {
        client.once(event.name, (...args) => event.execute(...args));
    } else {
        client.on(event.name, (...args) => event.execute(...args));
    }
}

const { EmbedBuilder } = require('discord.js');
const channelId = '1189984333507854357';




client.on('messageCreate', (message) => {
    const prefix = '.';
  if (message.content.startsWith(prefix) && message.channel.id === '1189984333507854357') {
    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    if (command === 'sticky') {
      const stickyMessage = args.join(' ');

      message.channel.send(stickyMessage)
        .then(sentMessage => {
          const stickyMessageID = sentMessage.id;

          if (message.client.lastStickyMessageID) {
            const lastStickyMessage = message.channel.messages.cache.get(message.client.lastStickyMessageID);
            if (lastStickyMessage) {
              lastStickyMessage.delete();
            }
          }


          message.client.lastStickyMessageID = stickyMessageID;
        })
        .catch(console.error);
    }
  }
});

process.on('unhandledRejection', error => {
    console.error('Unhandled promise rejection:', error);
});

process.on('uncaughtException', error => {
    console.error('Uncaught exception:', error);
});

client.login(config.token)
console.log('Bot Started')
module.exports = { client, con, config };
