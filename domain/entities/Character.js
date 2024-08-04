const request = require("request-promise");

class Character {
    constructor(realm, charName) {
        this.request = request(`http://armory.warmane.com/api/character/${charName}/${realm}/`, (err, response, body) => {
            body = JSON.parse(body);

            this.valid = false;
            this.name = body.name;
            this.realm = body.realm;
            this.online = body.online;
            this.level = body.level;
            this.faction = body.faction;
            this.gender = body.gender;
            this.class = body.class;
            this.honorablekills = body.honorablekills;
            this.guild = body.guild;
            this.achievementpoints = body.achievementpoints;
            this.equipment = body.equipment;
            this.race = body.race;
            this.talents = body.talents;
            this.professions = body.professions;

            if (body && body.name) this.valid = true;

            // Calculated
            this.GearScore = 0;
            this.Enchants = null;
            this.Gems = null;
            this.Armory = `[${charName}](http://armory.warmane.com/character/${charName}/${realm})`;
            this.Talents = null;
            this.Summary = null;
            this.GuildLink = this.guild ?
                `[${this.guild}](http://armory.warmane.com/guild/${this.guild.replaceAll(" ", "+")}/${realm})` :
                null;
            this.PVPGear = [];
            this.Achievements = null;
        });
    }
}

module.exports = { Character }