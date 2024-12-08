/*
 _____ _  _     _       _____ _     _____ ____ ___  _ _____  _     _  _      _____   ____  _     _____ 
/    // \/ \   / \     /  __// \ |\/  __//  __\\  \///__ __\/ \ /|/ \/ \  /|/  __/  /  _ \/ \ /\/__ __\
|  __\| || |   | |     |  \  | | //|  \  |  \/| \  /   / \  | |_||| || |\ ||| |  _  | / \|| | ||  / \  
| |   | || |_/\| |_/\  |  /_ | \// |  /_ |    / / /    | |  | | ||| || | \||| |_//  | \_/|| \_/|  | |  
\_/   \_/\____/\____/  \____\\__/  \____\\_/\_\/_/     \_/  \_/ \|\_/\_/  \|\____\  \____/\____/  \_/  
                                                                                                       
*/

module.exports = {

  // licenseKey: "", No Longer Required

  // Server Name
  SN: "Belleview/Vox Development",

  // Staff
  BOD: "",
  Admin: "",
  JAdmin: "",
  SStaff: "",
  Staff: "",
  SIT: "",
  IA: "",

  // Membership
  LSPD: "",
  BCSO: "",
  SASP: "",
  SAFR: "",
  Comms: "",
  CIV: "",
  Dev: "",
  Media: "",
  CAT: "", // Recruitment & Training Department
  Membership: "",
  Whitelist: "",
  AwaitingVerRole: "",
  RetiredRole: "",

   // Staff Guild Roles
  SGSIT: "",
  SGStaff: "",
  SGSStaff: "",
  SGJAdmin: "",
  SGAdmin: "",

 // Fan Server Ranks
  AdminFan: "",
  JAdminFan: "",
  SStaffFan: "",
  StaffFan: "",
  SITFan: "",
  MembershipFan: "",

   // Welcome
  "welcomeEnabled": true,
  welcomechannel: "",
  nameFormatformat: "T. Burns 101", // (ex. T. Burns 101, Tyler B. 101)

  // Verification Command
  verfiymanualapprove: true,

  // Guilds
  mainGuild: "",
  devGuild: "",
  fanGuild: "",
 
  // Sql connection
  connectionLimit: 100,
  dbuser: '',
  dbpassword: '',
  dbhost: '',
  database: '',
  port: '3306',
   
   // Invite Links
   LSPDGuild: "",
   BCSOGuild: "",
   SASPGuild: "",
   JudicialGuild: "",
   CommsGuild: "",
   SAFRGuild: "",
   MediaGuild: "",
   CivGuild: "",
 
 
 
   // mute settings
   muteCatagory: "",
   muteLogs: "",
   muteRole: "",
 
   // department callsigns
  LSPDCallsign: "",
  SASPCallsign: "",
  BCSOCallsign: "",
  SAFRCallsign: "",
  CivCallsign: "",
  COMMSCallsign: "",
 
   // Logging Channels
   modLogs: "",
   mutelog: "",
   verifylogs: "",
   patrolAttendance: "",
 
 
   // directories (dont edit these)
   eventDir: "./events/",
   commandDir: "./commands/",
   utilDir: "./utilites/",
   
   // FiveM Information (IP & Port (i.e. 15.204.209.196:6849))
   FiveMIP: "",
 
   // Teamspeak Information
   TSHost: "",
   TSQueryPort: "",
   TSServerPort: "",
   TSQueryUsername: "",
   TSQueryPassword: "",
   TSNickname: "",
 
   // Invsion -- replace all fields with the respective information from your invision community
   invisionAPI: "0c385fc020141a6571070d2b5147f1f8",
   invisionDomain: "localhost",
   invRecruit: "1",
   invMember: "12",
   invSIT: "1",
   invStaff: "1",
   invSStaff: "1",
   invJAdmin: "1",
   invAdmin: "1",
   invDev: "1",
   invMedia: "1",
   invRnT: "1",
   invRetired: "",
 
   // Messages
   noPermMsg: ":x: You don't have permissions to use this.",
   mainGuildMsg: ":x: Command can only be used in main server.",
   devGuildMsg: ":x: Access Denied",
   errMsg: ":x: API Error.",
   
   // Server Information (for patrol command)
   serverName: "",
   productionServer: "",
   teamspeakPassword: "",
   teamspeakServerIP: "",
 
   // Bot settings
   clientId: "",
   token: "",
   botstatus: "Belleview/Vox Development.",
   embedcolor: "#e17022",
   
    // Misc
   logo: '', // Image Link
   embedfooter: '©️ Belleview/Vox Development', // Embed Footers
   bugReportsChannelID: '',
   suggestionsChannelID: '',
   medianoti: '', 
   medianotirole: '',

     // Tickets
  ticketEmbedTitle: 'Open A Ticket',
  ticketEmbedDescription: 'Ticket',
  ticketButtonLabel: 'Open a Ticket',
  ticketEmbedReply: 'Your Ticket embed has been created.',
  ticketChannelPrefix: 'ticket',
  ticketExistingChannelMsg: 'You already have a ticket open.',
  ticketWelcomeMsg: 'Please wait for staff to get with you.',
  ticketCloseButtonLabel: 'Close Ticket',
  ticketCloseMsg: 'This Ticket has been closed.',
  ticketCreatedMsg: 'You have opened a ticket.',
  ticketcatagory: '1239489940166017034', // Catagory For Tickets
  transcriptsEnabled: true, // Ticket Transcripts
 }
