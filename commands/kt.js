const kt = [
  'https://i.imgur.com/LigPTvN.png',
  'https://i.imgur.com/55N94SN.png',
  'https://i.imgur.com/zKKurX4.png',
  'https://i.imgur.com/ogel93h.png',
  'https://media1.tenor.com/images/e58cdfa83c18bbe02c5d5dd70fe13052/tenor.gif?itemid=15270199',
  'https://i.imgur.com/50uJYc6.png',
  'https://i.imgur.com/SDMkKvR.png',
  'https://i.imgur.com/z8BKcTs.gif',
  'https://i.imgur.com/wtY1TRg.gif',
  'https://i.imgur.com/drNpGgG.gif',
  'https://i.imgur.com/fpFguvU.gif',
  'https://i.imgur.com/0Lpj0Lz.gif',
  'https://i.imgur.com/1JISkGa.gif',
  'https://i.ytimg.com/vi/RhluS3_dIS0/maxresdefault.jpg',
  'https://i.ytimg.com/vi/sr3H2G7DEpw/maxresdefault.jpg',
  'https://i.ytimg.com/vi/NXqGVIylHwY/maxresdefault.jpg',
  'https://i.ytimg.com/vi/N61u3Ugom8I/maxresdefault.jpg'
];

module.exports = {
	name: 'kt',
	description: 'jos ranga',
  cooldown: 10,
	execute(message, args) {
    message.channel.send(kt[Math.floor(Math.random() * kt.length)]);
	}
};