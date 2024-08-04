const Commands = {
    help: "!help",
    guild: "!guild",
    gs: "!gs",
    ench: "!ench",
    gems: "!gems",
    armory: "!armory",
    summary: "!summary",
    achievements: "!achievements",
	achi: "!achi"
}

const Help =
`
**Info**:
            **Hello! I'm Snuske's child! I now officially support Lordaeron and other WotLK Warmane realms! 
            The usage is the same as before but you can add the realm after your character's name. 
            But if you don't I'll search in Icecrown as the default realm.**                
                
**Supported commands**:
            **!help**: Displays this help text.
            **!guild [player_name] [realm?]**: Displays the gild of the player.
            **!gs [player_name] [realm?]**: Displays the GearScore of the player. 
            **!ench [player_name] [realm?]**: Displays which enchants are missing from the player's currently equipped items.
            **!gems [player_name] [realm?]**: Displays which gems are missing from the player's currently equipped items.
            **!armory [player_name] [realm?]**: Returns a link to the player's armory.
            **!summary [player_name] [realm?]**: Lists all the details regarding the given player.
            **!achievements or !achi [player_name] [realm?]**: Displays a table with the achievement progress of the player.
            
            **[realm?]** is an optional parameter. By default = Icecrown.
            
**Example of usage**:
            !summary Metalforce Icecrown
            !guild Metalforce
            !gs Metalforce
            !summary Koch Lordaeron
            !gs Koch Lordaeron
            !achievements Metalforce
            !achi Metalforce
            
**Feel free to join the official Discord server of the bot [here](https://discord.gg/ZSDpeftAB7) and ask/suggest me anything!**
`;

const InvalidCommand =
`
**Invalid command**: 
                        
Please execute the !help command to see the list of supported commands and an example of usage.`;

module.exports = { Help, InvalidCommand, Commands }