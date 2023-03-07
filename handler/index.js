const fs = require("fs");

/**
 * Load Events
 */
const loadEvents = async function (client) {
    const eventFolders = fs.readdirSync("./events");
    for (const folder of eventFolders) {
        const eventFiles = fs
        .readdirSync(`./events/${folder}`)
        .filter((file) => file.endsWith(".js"));
        
        for (const file of eventFiles) {
            const event = require(`../events/${folder}/${file}`);
            
            if (event.name) {
                console.log(` ✔️ => F1N EVENT  ${file} is being loaded `);
            } else {
                console.log(` ❌ => F1N EVENT ${file} missing a help.name or help.name is not in string `);
                continue;
            }
            
            if (event.once) {
                client.once(event.name, (...args) => event.execute(...args, client));
            } else {
                client.on(event.name, (...args) => event.execute(...args, client));
            }
        }
    }
}

/**
 * Load SlashCommands
 */
const loadSlashCommands = async function (client) {
    let slash = []

    const commandFolders = fs.readdirSync("./slashCommands");
    for (const folder of commandFolders) {
        const commandFiles = fs
        .readdirSync(`./slashCommands/${folder}`)
        .filter((file) => file.endsWith(".js"));
        
        for (const file of commandFiles) {
            const command = require(`../slashCommands/${folder}/${file}`);
            
            if (command.name) {
                client.slash.set(command.name, command);
                slash.push(command)
                console.log(` ✔️ => F1N COMMANDS ${file} is being loaded `);
            } else {
                console.log(` ❌ => F1N COMMANDS ${file} missing a help.name or help.name is not in string `);
                continue;
            }
        }
    }
    
    client.on("ready", async() => {
        await client.application.commands.set(slash).then(() => console.log(`Client SlashCommand (/) Registered.`)).catch((e) => console.log(e));
    });
}

module.exports = {
    loadEvents,
    loadSlashCommands
}