const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('post')
        .setDescription('Sends a video link to the media notification channel')
        .addStringOption(option => 
            option.setName('url')
            .setDescription('Enter your video URL (must start with https://)')
            .setRequired(true)
        ),
    async execute(interaction) {
        const reqRole = interaction.guild.roles.cache.find(r => r.id === config.Media);
        const permission = reqRole.position <= interaction.member.roles.highest.position;
        if (!permission) {
            return interaction.reply({ content: config.noPermMsg, ephemeral: true });
        }

        const url = interaction.options.getString('url');
        const validVideoServices = ['youtube.com', 'tiktok.com'];

        if (!url.startsWith('https://')) {
            await interaction.reply({ content: 'The URL must start with "https://". Please enter a valid link.', ephemeral: true });
            return;
        }

        const isValid = validVideoServices.some(service => url.includes(service));

        if (!isValid) {
            await interaction.reply({ content: 'Please enter a valid video service link (e.g., YouTube, TikTok).', ephemeral: true });
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
            .setTitle('📹 New Video!')
            .setDescription(`${username} just posted a new video! [Click here to watch](${url})`)
            .setColor(config.embedcolor)
            .setThumbnail(config.logo)
            .setTimestamp();

        await medianotiChannel.send({ content: `<@&${medianotiRole.id}>`, embeds: [embed] });
        await interaction.reply({ content: 'Your video link has been sent to the media notification channel!', ephemeral: true });
    },
};
