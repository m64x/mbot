const fetch = require('node-fetch');
const puppeteer = require('puppeteer');

module.exports = {
	name: 'ss',
	aliases: ['screenshot'],
	description: 'take a screenshot of a webpage',
	execute(message) {
		
		async function foo() {
			
			const browser = await puppeteer.launch();
			
			const page = await browser.newPage();
			await page.goto('https://quickbot.me/');	
			
			let screenshot = await page.screenshot(); 
			await browser.close();
			message.channel.send("Screenshot", {files: [screenshot]});
			
			
		};

		foo();
		
		
		
	}
};
