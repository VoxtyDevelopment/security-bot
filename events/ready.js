const { Client, ActivityType } = require('discord.js');
const config = require('../config');

const roleconfig = {
    fanServerGuildId: config.mainGuild,
    mainServerGuildId: config.fanGuild,
    roleMappings: [
        {
            fanServerRoleId: `${config.Admin}`, // Admin
            mainServerRoleId: `${config.AdminFan}`,
        },
        {
            fanServerRoleId: `${config.JAdmin}`, // Jr. Admin
            mainServerRoleId: `${config.JAdminFan}`
        },
        {
            fanServerRoleId: `${config.SStaff}`, // Senior Staff
            mainServerRoleId: `${config.SStaffFan}`
        },
        {
            fanServerRoleId: `${config.Staff}`, // Staff
            mainServerRoleId: `${config.StaffFan}`
        },
        {
            fanServerRoleId: `${config.SIT}`, // Staff in Training
            mainServerRoleId: `${config.SITFan}`
        },
        {
            fanServerRoleId: `${config.Membership}`, // Community Member
            mainServerRoleId: `${config.MembershipFan}`
        }
    ]

}

module.exports = {
    once: true,
    name: 'ready',
    async execute(client) {

            client.on('guildMemberUpdate', async (oldMember, newMember) => {
                if (oldMember.roles.cache !== newMember.roles.cache) {
                    if (Array.isArray(roleconfig.roleMappings)) {
                        for (const mapping of roleconfig.roleMappings) {
                            if (newMember.roles.cache.has(mapping.fanServerRoleId)) {
                                try {
                                    const mainServerGuild = client.guilds.cache.get(roleconfig.mainServerGuildId);
                                    const mainServerRole = mainServerGuild.roles.cache.find(role => role.id === mapping.mainServerRoleId);
            
                                    if (mainServerRole) {
                                        await mainServerGuild.members.fetch(newMember.user.id).then(member => {
                                            member.roles.add(mainServerRole);
                                        });
                                    } else {
                                        console.log('Main server role not found.');
                                    }
                                } catch (error) {
                                    console.error('Error assigning role:', error);
                                }
                            }
                        }
                    } else {
                        console.error('roleMappings is not an array.');
                    }
                }
            });
            

            const activities = [
              { name: config.botstatus, type: ActivityType.Playing }
          ];
          let i = 0;
          client.user.setPresence({
              status: 'online',
              activities: [activities[i % activities.length]],
          });
          setInterval(() => {
              i++;
              client.user.setPresence({
                  status: 'online',
                  activities: [activities[i % activities.length]],
              });
          }, 300000);

          console.log("Services Are Running");
      }
};
