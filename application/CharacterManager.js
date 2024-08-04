const cheerio = require("cheerio");
const request = require("request-promise");
const { GetItems } = require('../infrastructure/ItemManager')
const { Character } = require('../domain/entities/Character')
const { ItemTypeEnum, ItemTypeEnumToString } = require('../domain/enums/ItemTypeEnum')
const { WarmaneItemTypeEnum } = require('../domain/enums/WarmaneItemTypeEnum')
const { GetCamelToe, GetParams } = require('../common/helpers/GenericHelper')
const Achievements = require('../common/constants/Achievements');
const handler = require('../handler');

async function GetCharacter(realm, name) {
    return new Promise(async (resolve, reject) => {
        let character = await new Character(GetCamelToe(realm), GetCamelToe(name));

        character.request
            .then(async _ => {
                if (character.valid) {
                    await GetGearScore(character);
                    await GetEnchants(character);
                    await GetGems(character);
                    await GetTalents(character);
                    await GetSummary(character);

                    resolve(character);
                }
                else reject(`Unfortunately, Warmane's API didn't return any information about ${name} from realm ${realm}. Try again, please.`);
            })
            .catch(err => {
                console.log(err);
            });
    })
}

async function GetGearScore(character) {
    let gearScore = 0;

    if (character && character.equipment && character.equipment.length > 0) {
        return new Promise((resolve) => {
            let equippedItems = [];

            character.equipment.forEach(item => {
                equippedItems.push(Number(item.item));
            });

            GetItems(equippedItems, (err, itemsDB) => {
                if (err) {
                    console.log("Error:", err);
                    return;
                }

                const hunterWeaponTypes =
                    [
                        ItemTypeEnum["OneHand"],
                        ItemTypeEnum["TwoHand"],
                        ItemTypeEnum["MainHand"],
                        ItemTypeEnum["OffHand"]
                    ];
                let weapons = [];

                equippedItems.forEach(equippedItem => {
                    const item = itemsDB.find(element => element.itemID === equippedItem);

                    if (item.PVP === 1) {
                        character.PVPGear.push(ItemTypeEnumToString(item.type) + ":\n\t\t\t\t\t" + item.name);
                    }

                    if (character.class === "Hunter" && item.type === 26) {
                        gearScore += item.GearScore * 5.3224;
                    } else if (character.class === "Hunter" && hunterWeaponTypes.indexOf(item.type) > -1) {
                        gearScore += item.GearScore * 0.3164;
                    } else if (item.class === 2 && (item.subclass === 1 || item.subclass === 5 || item.subclass === 8)) {
                        weapons.push(item.GearScore);
                    } else {
                        gearScore += item.GearScore;
                    }
                });

                // Probably a warrior with Titan's Grip
                if (weapons.length === 2) {
                    gearScore += Math.floor(((weapons[0] + weapons[1]) / 2));
                } else if (weapons.length === 1) {
                    gearScore += weapons[0];
                }
                character.GearScore = Math.ceil(gearScore);

                resolve(character);
            });
        });
    }
}

async function GetGems(character) {
    const options = {
        uri: `http://armory.warmane.com/character/${character.name}/${character.realm}/`,
        transform: function (body) {
            return cheerio.load(body);
        }
    };

    return new Promise((resolve, reject) => {
        let equippedItems = [];
        let actualItems = [];
        let i = 0;
        let missingGems = [];

        request(options)
            .then(($) => {
                $(".item-model a").each(function () {
                    let amount = 0;
                    let rel = $(this).attr("rel");

                    if (rel) {
                        var params = GetParams(rel);

                        if (params["gems"]) amount = params["gems"].split(":").filter(x => x != 0).length;

                        equippedItems.push(Number(params["item"]));

                        actualItems.push({
                            "itemID": Number(params["item"]),
                            "gems": amount,
                            "type": WarmaneItemTypeEnum[i]
                        });
                    }

                    i++;
                })

                GetItems(equippedItems, (err, itemsDB) => {
                    if (err) {
                        console.log("Error:", err);
                        return;
                    }

                    itemsDB.forEach(item => {
                        let foundItem = actualItems.filter(x => x.itemID === item.itemID)[0];
                        let hasBlacksmithing = character && character.professions && character.professions.length > 0 ?
                            character.professions.map(prof => prof.name).includes("Blacksmithing") :
                            false;
                        let itsGlovesOrBracer = (foundItem.type === "Gloves" || foundItem.type === "Bracer");

                        if (foundItem.type === "Belt" || (itsGlovesOrBracer && hasBlacksmithing)) {
                            if ((item.gems + 1) !== foundItem.gems) {
                                missingGems.push(foundItem.type);
                            }
                        } else if (item.gems > foundItem.gems) {
                            missingGems.push(foundItem.type);
                        }

                    });
                    if (missingGems.length === 0) character.Gems = `${character.name} has gemmed all his items! :white_check_mark:`;
                    else character.Gems = `${character.name} needs to gem ${missingGems.join(", ")} :x:`;

                    resolve(character.Gems);
                });
            })
            .catch(err => {
                console.log(err.message);

                reject(new Error("Couldn't connect to the armory"));
            });
    });
}

async function GetEnchants(character) {
    const bannedItems = [1, 5, 6, 9, 14, 15];
    let missingEnchants = [];

    const options = {
        uri: `http://armory.warmane.com/character/${character.name}/${character.realm}/`,
        transform: function (body) {
            return cheerio.load(body);
        }
    };

    return new Promise((resolve) => {
        request(options).then(($) => {
            let items = [];
            let characterClass = $(".level-race-class").text().toLowerCase();
            let professions = [];
            $(".profskills").find(".text").each(function () {
                professions.push($(this).clone().children().remove().end().text().trim());
            });
            $(".item-model a").each(function () {
                $(this).attr("href");
                let rel = $(this).attr("rel");
                items.push(rel);
            });

            for (let i = 0; i < items.length; i++) {
                if (items[i]) {
                    if (!bannedItems.includes(i)) {
                        if (items[i].indexOf("ench") === -1) {
                            if (WarmaneItemTypeEnum[i] === "Ranged") {
                                if (characterClass.indexOf("hunter") >= 0) {
                                    missingEnchants.push(WarmaneItemTypeEnum[i]);
                                }
                            } else if (WarmaneItemTypeEnum[i] === "Ring #1" || WarmaneItemTypeEnum[i] === "Ring #2") {
                                if (professions.includes("Enchanting")) {
                                    missingEnchants.push(WarmaneItemTypeEnum[i]);
                                }
                            } else if (WarmaneItemTypeEnum[i] === "Off-hand") {
                                if (characterClass.indexOf("mage") < 0 && characterClass.indexOf("warlock") < 0 && characterClass.indexOf("druid") < 0 && characterClass.indexOf("priest") < 0) {
                                    missingEnchants.push(WarmaneItemTypeEnum[i]);
                                }
                            } else {
                                missingEnchants.push(WarmaneItemTypeEnum[i]);
                            }
                        }
                    }
                }
            }

            if (missingEnchants.length === 0) character.Enchants = `${character.name} has all enchants! :white_check_mark:`;
            else character.Enchants = `${character.name} is missing enchants from: ${missingEnchants.join(", ")} :x:`;

            resolve(character.Enchants);
        });
    });
}

async function GetTalents(character) {
    let res = "";

    if (character.talents != null) {
        for (let i=0; i < character.talents.length; i++) {
            if (i === 1) res += " and ";

            res += character.talents[i].tree;

            if (character.talents[i].points != null) {
                res += "(" + character.talents[i].points.map(p => p).join("/") + ")";
            }
        }
    }

    character.Talents = res;
}

async function GetAchievements(character) {

    
try {
	
	
	var getAchv = await GetSingleAchievement(character);

		character.Achievements = `\`\`\`fix
Raid   | 25HC 25NM 10HC 10NM
----------------------------
ICC    | ${getAchv['ICC25']['HC']}   ${getAchv['ICC25']['N']}   ${getAchv['ICC10']['HC']}   ${getAchv['ICC10']['N']}
RS     | ${getAchv['RS25']['HC']}   ${getAchv['RS25']['N']}   ${getAchv['RS10']['HC']}   ${getAchv['RS10']['N']}\`\`\``;
    
	} 
	catch (err) {
		console.log(err);
    }
	
}

async function GetSingleAchievement(character) {
        
		var ICC10 = await handler.scrapeFormResponse(character.name,character.realm,'ICC10');
		var ICC25 = await handler.scrapeFormResponse(character.name,character.realm,'ICC25');
		var RS10 = await handler.scrapeFormResponse(character.name,character.realm,'RS10');
		var RS25 = await handler.scrapeFormResponse(character.name,character.realm,'RS25');
		
		return {"ICC10":ICC10, "ICC25":ICC25, "RS10":RS10, "RS25":RS25};
}

async function GetSummary(character) {
    const listPattern = "\n\t\t";
    const pvpGearPattern = listPattern + ":exclamation:";

    character.Summary =
    `
    Here is a summary for **${character.name}**:
    **Status**: ${character.online ? "Online :green_circle:" : "Offline :red_circle:"}
    **Character**: ${"Level " + character.level + " " + character.race + " " + character.class + " - " + character.faction + " " + (character.faction === "Alliance" ? ":blue_heart:" : ":heart:")}
    **Guild**: ${character.guild ? character.GuildLink : `${character.name} doesn't have a guild`}
    **Specs**: ${character.Talents}
    **Professions**: ${character.professions ? character.professions.map(profession => (profession.skill + " " + profession.name)).join(" and ") + " :tools:" : "No professions to show"}
    **Achievement points**: ${character.achievementpoints} :trophy:
    **Honorable kills**: ${character.honorablekills} :skull_crossbones:
    **GearScore**: ${character.GearScore}
    **Enchants**: ${character.Enchants}
    **Gems**: ${character.Gems}
    **Armory**: ${character.Armory}
    **PVP items**: ${character.PVPGear.length === 0 ? "None" : pvpGearPattern + character.PVPGear.join(pvpGearPattern)}
    **Achievements**: Type !achievements ${character.name} or !achi ${character.name}
    `
}

module.exports = { GetCharacter, GetAchievements }