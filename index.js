  ////////////////////////////////////////////////////
 //// This bot belongs to Nymo Games Productions ////
////////////////////////////////////////////////////

//// Coded By: ////
// Crany#6596
// People from stackoverflow

// FF5733
// FF3C00

// Discord Declaration //
const Discord = require('discord.js');
const client  = new Discord.Client();

// Other Declarations //
const fs = require('fs');
const { send, report, config } = require('process');
const { Interface } = require('readline');
const { description } = require('./commands/example');


// Variable Declaration //
const ConfigData = require('./config.json');

const prefix = ConfigData.PREFIX;

const AdminRole = "680397530676068365";
const StaffRole = "680180666549141588";
const ModsRoles = "856834038815916052";
const AdminPerm = "860431100337324062";
const compeople = "680397965285654551";
const AdancedRole = "696001274423803994";
const punishChannel = "857336677461655562";

const guildID = '680154842316275834';

client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command)
}

const getApp = (guildID) => {
    const app = client.api.applications(client.user.id)
    if (guildID) {
        app.guilds(guildID);
    }
    return app;
}

/**
 * 
 * @param {interactions} interaction Interaction Variable
 * @param {String} response This is what will be sent as the command response. 
 */

const reply = async (interaction, response) => {
    let data = {
        content: response
    }

    // Check for embeds
    if (typeof response === 'object') {
        data = await createAPIMessage(interaction, response)
    }

    client.api.interactions(interaction.id, interaction.token).callback.post({
        data: {
            type: 4,
            data,
        }
    })
}

const createAPIMessage = async (interaction, content) => {
    const {data, files} = await Discord.APIMessage.create(
        client.channels.resolve(interaction.channel_id),
        content
    )
    .resolveData()
    .resolveFiles()

    return { ...data, files }
}

client.once('ready', async (message) => {
    console.log("The bot is online :D Please don't turn me off unless you're debugging or restarting me.");
    //discord_terminal("I was just turned on! Hello world of Discord!", 1, message)

    // Slash Command Thingys //
    const commands = await getApp(guildID).commands.get()
    //console.log(commands)

    // Main Slashcommands //
    await getApp(guildID).commands.post({
        data: {
            name: "ping",
            description: "A hello command."
        }
    })

    await getApp(guildID).commands.post({
        data: {
            name: 'embed',
            description: 'A simple Embeded text',
            options: [
                {
                    name: 'name',
                    description: 'Your name',
                    required: true,
                    type: 3 // Represents a String //
                },
                {
                    name: 'age',
                    description: 'you age',
                    required: true,
                    type: 4 // Integer //

                }
            ]
        }
    })

    client.ws.on('INTERACTION_CREATE', async (interaction) => {
        const { name, options } = interaction.data;
        const commands = name.toLowerCase();

        console.log(options);

        const args = {};

        if (options) {
            for (const option of options) {
                const {name, value} = option
                args[name] = value
            }
        }

        console.log(args)

        if (commands === 'ping') {
            reply(interaction, `I see you're using a slash command. There'll be more coming soon! (Hold your horses bukaroo!)`)
        } else if (commands === 'embed') {
            const embed = new Discord.MessageEmbed()
                .setTitle("Example of an embed")
                .setColor("FF5733")

            for (const arg in args) {
                const value = args[arg]
                embed.addField(arg, value)
            }

            reply(interaction, embed)
        }
    })
});

client.on('ready', () => {
    client.user.setPresence({
        status: 'online',
        activity: {
            name: "!help | Nymo's Cavern",
            type: 'LISTENING',
        }
    })
});

client.on('message', async (message) => {
    if (!message.content.startsWith(prefix)) {
        if (message.author.bot) {
            if (message.channel.id === "685036523317625048" || message.channel.id === "696010902196977784") {
                message.delete({timeout: 1})
                return;
            } else {
                return;
            }
        } else if (message.channel.type === 'dm') {
            message.channel.send("Sorry! You can't DM me!")
        } else if (message.mentions.members.first() === client.user.id) {
            message.channel.send("Did somebody call for me?")
        } else if (message.channel.id === "685036523317625048"){
            if (!message.member.roles.cache.has(AdminRole) || !message.member.roles.cache.has(AdminPerm)) {
                if (message.content === "accept" || message.content === "Accept") {
                    if (!message.member.roles.cache.has(compeople)) {
                        message.author.send("Welcome to **Nymo's Community**, " + message.author.username + "!").catch(() => discord_terminal(`Error: Could not send a DM to <@${message.author.id}>.`, 1, message));
                        message.member.roles.add("680397965285654551");
                        message.delete({timeout: 1})
                        client.channels.cache.get("697426937047678997").send(`Please welcome <@${message.author.id}> to the server!`);
                        discord_terminal("<@" + message.author.id + "> has just entered the Server!", 1);
                        return;
                    } else message.delete({timeout: 1})
                } else message.delete({timeout: 1});
            }
        } else if (message.mentions.members.first() == client.user.id) {
            message.reply("Did you call for me?");
        } else if (message.channel.id === "696010902196977784") {
            if (message.content == "Gamer" || message.content == "gamer") {
                if(!message.member.roles.cache.has("850008425046999101")) {
                    message.member.roles.add("850008425046999101")
                    message.author.send("You have been given the **Gamer** role!").catch(() => discord_terminal(`Error: Could not send a DM to <@${message.author.id}>.`, 1, message, null));
                    discord_terminal("Just gave <@" + message.author.id + "> the Gamer role.", 1)
                } else if (message.member.roles.cache.has("850008425046999101")) {
                    message.member.roles.remove("850008425046999101");
                    message.author.send("The **Gamer** role has been removed!").catch(() => discord_terminal(`Error: Could not send a DM to <@${message.author.id}>.`, 1, message, null));
                    discord_terminal("Just removed <@" + message.author.id + ">'s Gamer role.", 1)
                }
            } else if (message.content == "Helper" || message.content == "helper") {
                if(!message.member.roles.cache.has("850029942539419708")) {
                    message.member.roles.add("850029942539419708")
                    message.author.send("Why did you chose the **Helper** role?").catch(() => discord_terminal(`Error: Could not send a DM to <@${message.author.id}>.`, 1, message, null));
                    discord_terminal("Just gave <@" + message.author.id + "> the Helper role.", 1)
                } else if (message.member.roles.cache.has("850029942539419708")) {
                    message.member.roles.remove("850029942539419708");
                    message.author.send("Thank god you removed your **Helper** role.", 1).catch(() => discord_terminal(`Error: Could not send a DM to <@${message.author.id}>.`, 1, message, null));
                    discord_terminal("Just removed <@" + message.author.id + ">'sHelper role.")
                }
            } else if (message.content == "Artist" || message.content == "artist") {
                if(!message.member.roles.cache.has("850032711908720670")) {
                    message.member.roles.add("850032711908720670")
                    message.author.send("You have been given the **Artist** role!").catch(() => discord_terminal(`Error: Could not send a DM to <@${message.author.id}>.`, 1, message, null));
                    discord_terminal("Just gave <@" + message.author.id + "> the Artist role.")
                } else if (message.member.roles.cache.has("850032711908720670")) {
                    message.member.roles.remove("850032711908720670");
                    message.author.send("The **Artist** role has been removed!").catch(() => discord_terminal(`Error: Could not send a DM to <@${message.author.id}>.`, 1, message, null));
                    discord_terminal("Just removed <@" + message.author.id + ">'s Artist role.")
                }
            } else if (message.content == "Programmer" || message.content == "programmer") {
                if(!message.member.roles.cache.has("850033986481946724")) {
                    message.member.roles.add("850033986481946724")
                    message.author.send("You have been given the **Programmer** role!").catch(() => discord_terminal(`Error: Could not send a DM to <@${message.author.id}>.`, 1, message, null));
                    discord_terminal("Just gave <@" + message.author.id + "> the Programmer role.")
                } else if (message.member.roles.cache.has("850033986481946724")) {
                    message.member.roles.remove("850033986481946724");
                    message.author.send("The **Programmer** role has been removed!").catch(() => discord_terminal(`Error: Could not send a DM to <@${message.author.id}>.`, 1, message, null));
                    discord_terminal("Just removed <@" + message.author.id + ">'s Programmer role.")
                }
            } else {
                message.author.send("\"" + message.content + "\" is an unknown role! Please check you spelt it right!").catch(() => discord_terminal(`Error: Could not send a DM to <@${message.author.id}>.`, 1, message, null));
                discord_terminal("Couldn't find **\"" + message.content + "\"** in **Role Reciever!**\nThe request was by **" + message.author.tag + ".**");
            }
        }
    }

    const args = message.content.slice(prefix.length).trim().split(" ");
    const command = args.shift().toLowerCase();

    console.log(`${message.author.tag} said "${message.content}"`)

    let splitCommand = message.content.split(" ");

    if (message.channel.id != "685036523317625048" && message.channel.id != "696010902196977784" && message.channel.type != 'dm' && message.content.startsWith(prefix)) {
        if (command == 'ping') {
            let msg = await message.channel.send("Pong!");
            var ping = Math.round(client.ws.ping)
            msg.edit(`Pong \`${ping}\``)
        } else if (command == 'abt' || command == 'about'){
            not_done_yet(message, command);
        } else if (command == 'role') {
            if (message.member.roles.cache.has("680397530676068365") || message.member.roles.cache.has("680180666549141588")){
                let role   = message.mentions.roles.first()
                let member = message.mentions.members.first();

                try {
                    if (member != null && role != null) {
                        if (role.id == AdminPerm || role.id == AdminRole || member.roles.cache.has(AdminRole) || member.roles.cache.has(AdminPerm)) { 
                            authorsend(`Sorry! I can't do that! The **${role.name.toUpperCase()}** role has to be given manually.`, message)
                        } else {
                            if (role.id == ModsRoles) {
                                if (message.member.roles.cache.has(ModsRoles || AdminPerm || AdminRole)) {
                                    if (member.roles.cache.has(ModsRoles && !AdminPerm || !AdminRole)) {
                                        authorsend("Sorry! I can't do that! If you think they are abusing their role, report it to and admin.", message)
                                        return
                                    } else if (message.member.roles.cache.has(AdminRole || AdminPerm)) {
                                        if (!member.roles.cache.has(ModsRoles)) {
                                            member.roles.add(ModsRoles);
                                            discord_terminal(`<@${message.author.id}> just gave ${member} the <@&${ModsRoles}> role!`)
                                            member.send(`${message.author.tag} just gave you the **MODERATORS** Role!`).catch(() => discord_terminal(`Error: Could not send a DM to ${member}.`, 1, message))
                                        } else if (member.roles.cache.has(ModsRoles)) {
                                            member.roles.remove(ModsRoles)
                                            discord_terminal(`<@${message.author.id}> just gave ${member} the <@&${ModsRoles}> role!`)
                                            member.send(`${message.author.tag} just removed your **MODERATORS** Role!`).catch(() => discord_terminal(`Error: Could not send a DM to <@${member}.`, 1, message))
                                        }
                                    } else if (!member.roles.cache.has(ModsRoles)) {
                                        member.roles.add(ModsRoles);
                                        member.send(`${message.author.tag} just gave you the **MODERATORS** Role!`).catch(() => discord_terminal(`Error: Could not send a DM to ${member}.`, 1, message))
                                    }
                                } else {
                                    authorsend("Sorry! You have to be a Moderator or higher to have this role!", message)
                                }
                            } else {
                                if (member.id == message.author.id) {
                                    if (!member.roles.cache.has(role.id)) {
                                        member.roles.add(role.id)
                                        discord_terminal(`${member} just gave themselfs the <@&${role.id}> role!`, 1, message, null)
                                    } else if (member.roles.cache.has(role.id)) {
                                        member.roles.remove(role.id)
                                        discord_terminal(`${member} just removed their <@&${role.id}> role!`, 1, message, null)
                                    }
                                } else if (member.id != message.author.id) {
                                    if (!member.roles.cache.has(role.id)) {
                                        member.roles.add(role.id)
                                        discord_terminal(`<@${message.author.id}> just gave ${member} the <@&${role.id}> role!`, 1, message, null)
                                        member.send(message.author.tag + " just gave you the " + role.name + " role!").catch(() => discord_terminal(`Error: Could not send a DM to ${member}.`, 1, message))
                                    } else if (member.roles.cache.has(role.id)) {
                                        member.roles.remove(role.id)
                                        discord_terminal(`<@${message.author.id}> just removed ${member}'s <@&${role.id}> role!`, 1, message, null)
                                        member.send(message.author.tag + " just removed your " + role.name + " role!").catch(() => discord_terminal(`Error: Could not send a DM to ${member}.`, 1, message))
                                    }
                                }
                            }
                            
                            if (role.id == ModsRoles) {
                                if (!member.roles.cache.has(ModsRoles)) member.setNickname("[Mod] " + member.user.username)
                                else if (member.roles.cache.has(ModsRoles)) member.setNickname("[Staff] " + member.user.username);
                            } else if (role.id == StaffRole) {
                                if (!member.roles.cache.has(StaffRole)) member.setNickname("[Staff] " + member.user.username)
                                else if (member.roles.cache.has(StaffRole)) member.setNickname("[Advanced] " + member.user.username);
                            } else if (role.id == AdancedRole) {
                                if (!member.roles.cache.has(AdancedRole)) member.setNickname("[Advanced] " + member.user.username)
                                else if (member.roles.cache.has(AdancedRole)) member.setNickname(member.user.username);
                            }
                        }
                    } else if (member == null || role == null) {
                        message.delete({timeout: 1})
                        message.author.send("Please specify both the **TAG** and the **ROLE** you'd like to asign/remove from the person.").catch(() => discord_terminal(`Error: Could not send a DM to <@${message.author.id}>.`, 1, message, null))
                    }
                } catch (err) {
                    message.author.send("Sorry! **There was an error doing that!** Try again.\nIf you were doing it to a admin, that was sadly disabled.").catch(() => discord_terminal(`Error: Could not send a DM to <@${message.author.id}>.`, 1, message, null));
                    console.log(err)
                }

            } else {
                message.author.send("Sorry but you don't meet the requirements to do that action!").catch(() => discord_terminal(`Error: Could not send a DM to <@${message.author.id}>.`, 1, message, null));
                discord_terminal("<@" +  message.author.id + "> tried to give somebody a role but didn't meet the requirements.");
            }

        } else if (command == "r" || command == "report") {
        
            let member = message.mentions.members.first();

            if (member != null) {
                if (message.author.id != member.id) {
                    if (!member.user.bot) {
                        let reason = message.content.split(" ").slice(2).join(" ");

                        if (reason == "" || reason == " ") {
                            reason = "None";
                        }

                        let reportID = Date.now().toString();

                        let reportEmbed = new Discord.MessageEmbed()
                        .setColor("47a9a8")
                        .setTitle(`${member.user.tag} was reported.`)
                        .setFooter(`Report ID: ${reportID} • Reported By: ${message.author.tag}`)
                        .addFields(
                            {name: "REASON", value: reason, inline: true},
                            {name: "LAST MESSAGE", value: "null (Could not locate last message.)", inline: true}
                        )
                        client.channels.cache.get(punishChannel).send(reportEmbed)

                        try {
                            const reportfileName = './data/json/reporteddata.json'
                            const reportfile = require('./data/json/reporteddata.json');

                            let count = reportfile.count + 1

                            if (member.id != reportfile.user1.userid) {
                                reportfile.user1.reportid = reportID;
                                reportfile.user1.userid = member.id;
                                reportfile.user1.reason = reason;
                            } else {
                                reportfile.user1.reportid = reportID;
                                reportfile.user1.reason = reason;
                            }

                            fs.writeFile(reportfileName, JSON.stringify(reportfile, null, 2), function writeJSON(err) {
                                if (err) return console.log(err);
                            });
                            
                        } catch (err) {console.error(err); process.exit(1)}
                    } else {
                        message.channel.send("What did us bots do now??")
                    }
                } else {
                    message.reply("You can't report yourself! Surprising?")
                }
            } else {
                message.reply("Please specify the person you'd like to report.")
            }

        } else if (command == "event" || command == "e") {

            let tname;
            let tterminalembed;
            let thostid;
            let thosttag;
            let tid;

            let tconfiguation = [];
            
            const tfile = "./data/json/tournamentdata.json"
            const tdata = require("./data/json/tournamentdata.json")
            

            try {
              tname = message.content.split(" ").slice(2).join(" ")  
            } catch (err) {console.error(err)};

            let mod = message.content.split(" ").slice(1)
            
            if (mod[0] == null) {
                message.reply("please enter in a modfier.")
            } else {
                if (mod[0] == "start") {
                    if (message.member.roles.cache.has(AdminRole) || message.member.roles.cache.has(ModsRoles) || message.member.roles.cache.has(StaffRole)) {

                        if (tname != null) {
                            if (tdata.on == false) {
                                tname = tname;
                                thostid = message.author.id;
                                thosttag = message.author.tag;
                                tid = createID(1);

                                tdata.on = true
                                tdata.config.name = tname;
                                tdata.config.hostid = thostid;
                                tdata.config.hosttag = thosttag;
                                tdata.config.id = tid;

                                tconfiguation.push(`NAME: ${tdata.config.name}`);
                                tconfiguation.push(`HOST-TAG: ${tdata.config.hosttag}`);
                                tconfiguation.push(`HOST-ID: ${tdata.config.hostid}`);
                                tconfiguation.push(`EVENT-ID: ${tdata.config.id}`);

                                fs.writeFile(tfile, JSON.stringify(tdata, null, 2), function writeJSON(err) {
                                    if (err) return console.log(err);
                                });

                                tterminalembed = new Discord.MessageEmbed()
                                .setColor("#3b86ff")
                                .setTitle(`${message.author.tag} just started a tournament!`)
                                .addFields(
                                    {name: `**Configuation: **`, value: tconfiguation}
                                );

                                discord_terminal(tterminalembed, 1, message)
                            } else {
                                message.channel.send(`A tournament has already been started by <@${tdata.config.hostid}>`)
                            }
                        } else {
                            message.channel.send("Please provide a name for the tournament.")
                        }   
                    }
                } else if (mod[0] == "end") {
                    if (message.author.id == tdata.config.hostid || message.member.roles.cache.has(AdminRole) || message.member.roles.cache.has(ModsRoles)) {
                        if (tdata.on == true) {
                            let name = tdata.config.name;

                            tdata.on = false;
                            tdata.config.name = "";
                            tdata.config.hostid = "";
                            tdata.config.hosttag = "";
                            tdata.config.id = "";

                            JSONwrite(tfile)

                            let tembed = new Discord.MessageEmbed()
                            .setColor("#3b86ff")
                            .setTitle(`${message.author.tag} just ended the "${name}" tournament and all of its data has been erased!`)

                            discord_terminal(tembed, 1, message)
                        } else {
                            message.reply("There is currently no tournament already on.");
                        }
                    } else {
                        message.reply(`You can't do that since you didn't start the tournament or have <@${ModsRoles} or higher.`)
                    }
                } else if (mod[0] == "p" || mod[0] == "participate") {
                    if (tdata.on == true) {
                        if (!message.member.roles.cache.has("857529243667005480")) {
                            message.member.roles.add("857529243667005480")
                            authorsend(`You have just joined the **${tdata.config.name}** event!`, message)
                            discord_terminal(`<@${message.author.id}> just joined the **${tdata.config.name} event!`, 1, message)
                        } else if (message.member.roles.cache.has("857529243667005480")) {
                            message.member.roles.remove("857529243667005480")
                            authorsend(`You have just left the **${tdata.config.name}** event!`)
                            discord_terminal(`<@${message.author.id}> just left the **${tdata.config.name} event!`, 1, message)
                        }
                    } else if (tdata.on == false) {
                        authorsend("You can't join any event since there aren't any currently on.", message)
                    }
                    
                }
            }
        } else if (command == "update") {

            if (args[0] == null) {
                message.reply("Please add the modifier to what you'd want to update.")
            } else if (args[0] == "nick" || args[0] == "nickname") {
                if (message.member.roles.cache.has(AdminRole) || message.member.roles.cache.has(AdminPerm) || message.member.roles.cache.has(ModsRoles) || message.member.roles.cache.has(StaffRole)) {
                    let member = message.mentions.members.first()

                    let newargs = args.slice(2).join(" ");
                    console.log(newargs)

                    if (newargs == "") {
                        if (member == "") {
                            if (message.member.roles.cache.has(AdminRole)) {
                                message.reply("Sorry, I'm not allowed to comeplete this action.");
                            } else if (message.member.roles.cache.has(ModsRoles)) {
                                message.member.setNickname("[Mod] " + message.member.user.username)
                            } else if (message.member.roles.cache.has(StaffRole)) {
                                message.member.setNickname("[Staff] " + message.member.user.username)
                            } else if (message.member.roles.cache.has(AdancedRole)) {
                                message.member.setNickname("[Advanced] " + message.member.user.username)
                            } else {
                                message.member.setNickname(member.user.username)
                            }
                        } else if (member != null) {
                            if (member.roles.cache.has(AdminRole)) {
                                message.reply("Sorry, I'm not allowed to comeplete this action.")
                            } else if (member.roles.cache.has(ModsRoles)) {
                                member.setNickname("[Mod] " + member.user.username)
                            } else if (member.roles.cache.has(StaffRole)) {
                                member.setNickname("[Staff] " + member.user.username)
                            } else if (member.roles.cache.has(AdancedRole)) {
                                member.setNickname("[Advanced] " + member.user.username)
                            } else {
                                member.setNickname(member.user.username)
                            }
                        }
                    } else if (newargs != "") {
                        if (member == "") {
                            if (message.member.roles.cache.has(AdminRole)) {
                                message.reply("Sorry, I'm not allowed to comeplete this action.");
                            } else if (message.member.roles.cache.has(ModsRoles)) {
                                message.member.setNickname("[Mod] " + newargs)
                            } else if (message.member.roles.cache.has(StaffRole)) {
                                message.member.setNickname("[Staff] " + newargs)
                            } else if (message.member.roles.cache.has(AdancedRole)) {
                                message.member.setNickname("[Advanced] " + newargs)
                            } else {
                                message.member.setNickname(newargs)
                            }
                        } else if (member != null) {
                            if (member.roles.cache.has(AdminRole)) {
                                message.reply("Sorry, I'm not allowed to comeplete this action.")
                            } else if (member.roles.cache.has(ModsRoles)) {
                                member.setNickname("[Mod] " + newargs)
                            } else if (member.roles.cache.has(StaffRole)) {
                                member.setNickname("[Staff] " + newargs)
                            } else if (member.roles.cache.has(AdancedRole)) {
                                member.setNickname("[Advanced] " + newargs)
                            } else {
                                member.setNickname(newargs)
                            }
                        }
                    }

                    
                }
            } else {
                message.reply("sorry but that isn't one of the the applicable modifiers.")
            }

        } else if (command == "invite") {

            message.channel.send("Here's the link for the server! https://discord.gg/EudUY68.")
        
        } else if (command == "off") {
            if (message.member.roles.cache.has("680397530676068365")) {
                message.reply("Turing off the bot.");
                console.log(`Bot was turned off by: ${message.author.tag}`)
                discord_terminal(`I was just turned off by ${message.author.tag}`, 1, message)
                process.exit(1);
            } else {
                message.delete({timeout: 1})
                message.reply("Sorry. you don't have the required permission to comeplete that action.")
            }
        
        } else if (command == "a") {

            message.channel.send("This isn't a real command, fool.")
        
        } else if (command == "kick") {

            let sentenceargs = args.splice(1).join(" ")

            if (message.member.roles.cache.has(AdminPerm || AdminRole || StaffRole || ModsRoles)) {
                let member = message.mentions.members.first()

                if (sentenceargs == null) {
                    sentenceargs = "Unspecified - Reason was not provided.";
                }

                if (member == null) {
                    message.channel.send(`Please specify the person you'd like to kick, <@${message.author.id}>`)
                    return
                } else if (member.id == message.author.id) {
                    message.channel.send(`You can't kick yourself, <@${message.author.id}>.`)
                    return
                } else if (member.roles.cache.has(AdminPerm || AdminRole || StaffRole || ModsRoles)) {
                    message.channel.send("You can't kick these people since they have staff or higher.")
                    return
                } else if (member.user.bot) {
                    message.channel.send("No. I don't think i will. :angry:")
                    return
                } else {
                    try {
                        member.send(
                            `**You have been kicked by ${message.author.tag}.**\n` +
                            `*Reason:* ${sentenceargs}\n` +
                            `**If you think this may have been accidental or for and incorrect reason, rejoin the server and DM Crany#6596 or a staff/mod member.**`
                        ).catch(() => discord_terminal(`Error: Could not send a DM to ${member}.`, 1, message))
                        member.kick()
                        message.reply(`${member.user.tag} was kicked.`)
                        let kickembed = new Discord.MessageEmbed()
                        .addField("REASON", sentenceargs, true)
                        .addField("MODERATOR/STAFF: ", `<@${message.author.id}>`, true)
                        .setColor("FF2500")
                        .setTitle(`${member.user.tag} was kicked`)
                        .setFooter(`${time()} ${day()} • UTC Time Zone`)

                        client.channels.cache.get(punishChannel).send(kickembed)
                    } catch (err) {
                        message.reply("There was an error! This was up to the dev team so don't worry :D")
                        console.log(err);
                    }
                }
            } else {
                message.channel.send(`Sorry but you don't have the required permissions to do that ${message.author}!`)
            }
        } else if (command == '') {
            
        } else {
            discord_terminal("<@" + message.author.id + "> tried an unkown command: \"" + message.content + "\"", 1, message)
            message.reply("Speak of a real command, fool.")
        }
    } else if (message.channel.type === 'dm' && message.content.startsWith(prefix)) {
        message.channel.send("Sorry! You can't DM me!")
    } else if (message.content.startsWith(prefix) && message.channel.id == "685036523317625048" || message.channel.id == "696010902196977784") {
        message.delete({timeout: 1});
    }
});

/**
 * 
 * @param {String} write This is what will be sent to the terminal.
 * @param {Number} mode This is the method that it will use to send to the terminal. 1 - Send it as it is. 2 - Will send that the sender did that command. 
 * @param {Discord} message This is the message variable.
 */

function discord_terminal(write, mode, message) {
    switch (mode) {
        case 1:
            client.channels.cache.get("863851605891743754").send(write)
            break;
        case 2:
            client.channels.cache.get("863851605891743754").send(message.author.tag + " did the command " + write)
            break;
    }
}

/**
 * 
 * @param {String} send 
 * @param {Discord} message 
 */

function authorsend(send, message) {message.author.send(send).catch(() => discord_terminal(`Error: Could not send a DM to <@${message.author.id}>.`, 1, message, null))} 

function not_done_yet(message, command) {
    let random = Math.floor(Math.random() * 4);

    switch (random) {
        case 0:
            message.channel.send("Are you ready to recive a overdose amount of a *~CRINGE?~* Obviously not.")
            break;
        case 1:
            message.channel.send("I think you misspelled that command it surely can't be \"" + command + "\"")
            break;
        case 2:
            message.channel.send("Lmao look at this. What a typo!")
            break;
    }

    message.channel.send("That's just another way of us saying that we haven't finished this command yet.")
}

function time() {
    var clock = new Date();
    var hour = clock.getHours();
    var min = clock.getMinutes();
    
    if (hour < 10) {
        hour = "0" + hour;
    }
    else {
        hour = hour;
    }

    if (min < 10) {
        min = "0" + min;
    }
    else {
        min = min;
    }

    return hour + ":" + min;
}

function day() {
    var clock = new Date();
    var day = clock.getDate()
    var month = clock.getMonth()
    var year = clock.getFullYear()

    return `${day}/${month}/${year}`

}

/**
 * 
 * @param {number} mode This is the type of unique ID generated 1 - 2
 * @returns {String} This is the unique ID to put into any variable of a string.
 */

function createID (mode) {
    switch (mode) {
        case 1:
            return Math.random().toString(36).substr(2, 9);
        case 2:
            return Date.now().toString();
        default:
            return "Unidentified Value: Could not create ID due to unkown \"case\""
    }
}

/**
 * 
 * @param {File} filename This is the JSON file that will be edited.
 */

function JSONwrite(filename) {
    fs.writeFile(filename, JSON.stringify(require(filename), null, 2), (err) => {if (err) return console.log(err)});
}

client.login(ConfigData.TOKEN)