const { Collection }=require('discord.js')

const cooldowns=require('../json/cooldowns.json');

class commandCooldownManager {
    #lastTimeCommandUsed = new Collection();

    setTime(commandName, guildId) {
    if (!this.#lastTimeCommandUsed.has(guildId)) 
        this.#lastTimeCommandUsed.set(guildId, new Collection());

    this.#lastTimeCommandUsed.get(guildId).set(commandName, Date.now());
    }

    canUse(commandName, guildId) {
        const guildData = this.#lastTimeCommandUsed.get(guildId);
        if (!guildData || !guildData.has(commandName)) return true;

        const lastTime = guildData.get(commandName);
        return (Date.now() - lastTime) >= cooldowns.commands_cooldown;
    }

    getRemainingTime(commandName, guildId) {
        const guildData = this.#lastTimeCommandUsed.get(guildId);
        if (!guildData || !guildData.has(commandName)) return 0;

        const lastTime = guildData.get(commandName);
        const remaining = (lastTime + cooldowns.commands_cooldown - Date.now())/1000;
        return remaining > 0 ? remaining : 0; // milliseconds
    }
}

module.exports={commandCooldownManager}