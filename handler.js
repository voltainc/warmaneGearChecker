const request = require('request-promise');
const cheerio = require('cheerio');

const scrapeFormResponse = async (charName,realm,achv) => {

switch(achv)
	{

		case "ICC10":
		
		var payload=
		{
			"raid" : "ICC10",
			"category" : "15041",
			"elemNormal" : "#ach4532 > div.date",
			"elemHeroic" : "#ach4636 > div.date",
		};
		
		break;
		
		case "RS10":
		
		var payload=
		{
			"raid" : "RS10",
			"category" : "14922",
			"elemNormal" : "#ach4817 > div.date",
			"elemHeroic" : "#ach4818 > div.date",
		};
		
		break;
		
		case "ICC25":
		
		var payload=
		{
			"raid" : "ICC25",
			"category" : "15042",
			"elemNormal" : "#ach4608 > div.date",
			"elemHeroic" : "#ach4637 > div.date",
		};
		
		break;
		
		case "RS25":
		
		var payload=
		{
			"raid" : "RS25",
			"category" : "14923",
			"elemNormal" : "#ach4815 > div.date",
			"elemHeroic" : "#ach4816 > div.date",
		};
		
		break;
	
	}

	const URL = String("https://armory.warmane.com/character/"+charName+"/"+realm+"/achievements");
	const options = {
		method: 'POST',
		url: URL,
		formData: {
			"category": payload['category'] 
		}
	};

try {
		
		const response = await request(options);

		const $ = cheerio.load(JSON.parse(response)['content']);
		
		const N = $(payload['elemNormal']).text();
		const HC = $(payload['elemHeroic']).text();
	
		var dtx = {
			"char" : charName,
			"realm" : realm,
			"Raid":payload['raid'],
			"N" : N ? "✅" : "❌",
			"HC" : HC ? "✅" : "❌",
			"NDT" : N,
			"HCDT" : HC
		};
		
		return dtx;

	} 
	catch (error) {
		console.log(error)
	}
}

module.exports = { scrapeFormResponse };


