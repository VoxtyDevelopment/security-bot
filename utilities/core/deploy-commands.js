async function deploy() {
	const { REST, Routes } = require('discord.js');
	const path = require('path')
	const { config } = require('../../config');
	const fs = require('node:fs');
	const token = "" // Token
	const clientId = "" // Bot Client ID
	
	const commands = [];
	const commandFiles = fs.readdirSync('commands').filter(file => file.endsWith('.js'));
	
	for (const file of commandFiles) {
		const command = require(path.join(`../../commands/${file}`));
		commands.push(command.data.toJSON());
	}
	
	const rest = new REST({ version: '10' }).setToken(token);
	
	(async () => {
		try {
			console.log(`Started refreshing ${commands.length} application (/) commands.`);
	
			const data = await rest.put(
				Routes.applicationCommands(clientId),
				{ body: commands },
			);
	
			console.log(`Successfully reloaded ${data.length} application (/) commands.`);
		} catch (error) {
			console.error(error);
		}
	})();
}

module.exports = {deploy}