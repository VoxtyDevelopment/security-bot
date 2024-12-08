const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('live')
        .setDescription('Sends a live stream link to the media notification channel')
        .addStringOption(option => 
            option.setName('url')
            .setDescription('Enter your live stream URL (must start with https://)')
            .setRequired(true)
        ),
    async execute(interaction) {
        const reqRole = interaction.guild.roles.cache.find(r => r.id === config.Media);
        const permission = reqRole.position <= interaction.member.roles.highest.position;
        if (!permission) {
            return interaction.reply({ content: config.noPermMsg, ephemeral: true });
        }

        const url = interaction.options.getString('url');
        const validStreamingServices = ['youtube.com', 'twitch.tv', 'kick.com'];

        if (!url.startsWith('https://')) {
            await interaction.reply({ content: 'The URL must start with "https://". Please enter a valid link.', ephemeral: true });
            return;
        }

        const isValid = validStreamingServices.some(service => url.includes(service));

        if (!isValid) {
            await interaction.reply({ content: 'Please enter a valid streaming service link (e.g., YouTube, Twitch, Kick).', ephemeral: true });
            return;
        }

        const username = interaction.user.username;
        const medianotiChannel = interaction.guild.channels.cache.get(config.medianoti);
        const medianotiRole = interaction.guild.roles.cache.get(config.medianotirole);

        if (!medianotiChannel || !medianotiRole) {
            await interaction.reply({ content: 'FILL OUT THE CONFIG RIGHT YOU IDIOT IF YOU WANT PEOPLE TO USE THIS HOLY SHIT.', ephemeral: true });
            return;
        }

        const embed = new EmbedBuilder()
            .setTitle('🔴 Live Now!')
            .setDescription(`${username} is live! [Click here to watch the stream](${url})`)
            .setColor(config.embedcolor)
            .setThumbnail(config.logo)
            .setTimestamp();

        await medianotiChannel.send({ content: `<@&${medianotiRole.id}>`, embeds: [embed] });
        await interaction.reply({ content: 'Your live stream link has been sent to the media notification channel!', ephemeral: true });
    },
};
