# GearChecker
A Discord bot for the World of Warcraft server Warmane used by thousands of people worldwide.

This bot is a fork of [Snuske](https://github.com/mortenmoulder/Snuske) with some minor improvements.

Thread on Warmane can be found [here](https://forum.warmane.com/showthread.php?t=370139). 

## Description
A small Discord bot for [Warmane's](https://www.warmane.com/) World of Warcraft that inspects the players' gear and 
lets them know certain stats and which gems/enchants they are missing.

## Installation
To run this on your own server, you need a few things installed first.

* [NodeJS](https://nodejs.org/en/download).
* [The latest version of this repository](https://github.com/kikchan/Snuske/archive/refs/heads/main.zip).
* Any text editor.


Then you need to create a Discord application. These are the steps:
* Go to the [Discord's Developer Portal](https://discord.com/developers/applications).
* Login.
* Click on **New Application**.
* Give it a name, maybe add an app icon and write a description.
* Grab the token from this page:

![image](https://github.com/kikchan/Snuske/assets/26814080/4804d5d3-7fe8-4fb5-9d49-980947455bfb)


After that, you're ready to run it. For that, you have to do follow these steps:
* Rename the *.env_example* file to *.env*
* Edit the *.env* file and paste your token ID like this: discord_bot_id=MTIxMjE2NDQ0NTA0NDg3MTMx...
* Open the Windows console/Linux terminal from the root folder of the project.
* Run the command ```npm i```. This will install all the packages of the project.
* Run GearChecker with this command ```node app.js```.
* [OPTIONAL] If you want to run this as a service (in the background), you can check out [this package](https://pm2.keymetrics.io/docs/usage/quick-start/).

## Generate a link to invite the bot to your server
* Head back to the Discord's Developer Portal and navigate to the **Bot** page and activate the *Message content intent*:
![image](https://github.com/kikchan/Snuske/assets/26814080/43b0a2fe-5838-4028-aa29-f7e8d03ab119)

* Now go to the **OAuth2** page and change the authorization method of the bot to this:
![image](https://github.com/kikchan/Snuske/assets/26814080/333dd03e-96f3-4f3d-96a9-53e70d69fb3f)

* Save the changes.
* Mark the following checkboxes:
![image](https://github.com/kikchan/Snuske/assets/26814080/6ffd217a-cb24-4dcf-8422-3e0cf590885f)

* Voilà! Spread it like Necrotic Plague with your friends!
![image](https://github.com/kikchan/Snuske/assets/26814080/6136cbd2-c276-4e02-a6d3-7fbd91096933)

## Bot usage

Supported commands:
* !help: Displays this help text.
* !guild [player_name] [realm?]: Displays the gild of the player.
* !gs [player_name] [realm?]: Displays the GearScore of the player.
* !ench [player_name] [realm?]: Displays which enchants are missing from the player's currently equipped items.
* !gems [player_name] [realm?]: Displays which gems are missing from the player's currently equipped items.
* !armory [player_name] [realm?]: Returns a link to the player's armory.
* !summary [player_name] [realm?]: Lists all the details regarding the given player.
* !achievements or !achi [player_name] [realm?]: Lists all the details regarding the given player.

[realm?] is an optional parameter. By default = Icecrown.

Example of usage:
* !summary Metalforce Icecrown
* !guild Metalforce
* !gs Metalforce
* !summary Koch Lordaeron
* !gs Koch Lordaeron
* !achievements Metalforce
* !achi Metalforce