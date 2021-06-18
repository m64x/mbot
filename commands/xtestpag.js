const Pagination = require('discord-paginationembed');

module.exports = {
  name: 'pag',
  execute(message) {


const FieldsEmbed = new Pagination.FieldsEmbed()
  // A must: an array to paginate, can be an array of any type
  .setArray([
    {word: 'they are'},
    {word: 'being treated'},
    {word: 'badly'}
  ])
  // Set users who can only interact with the instance. Default: `[]` (everyone can interact).
  // If there is only 1 user, you may omit the Array literal.
  .setAuthorizedUsers([message.author.id])
   // A must: sets the channel where to send the embed
  .setChannel(message.channel)
  // Elements to show per page. Default: 10 elements per page
  .setElementsPerPage(1)
   // Have a page indicator (shown on message content). Default: false
  .setPageIndicator(false)
   // Format based on the array, in this case we're formatting the page based on each object's `word` property
  .formatField('Continue...', el => el.word);

// Customise embed
FieldsEmbed.embed
  .setColor(0x00FFFF)
  .setTitle('Jesus Yamato Saves the Day by Obliterating a Swarm of Abyssal Bombers!')
  .setDescription('Akagi and Kaga give their thanks to their holy saviour today as...')
  .setImage('https://lh5.googleusercontent.com/-TIcwCxc7a-A/AAAAAAAAAAI/AAAAAAAAAAA/Hij7_7Qa1j0/s900-c-k-no/photo.jpg');

// Deploy embed
FieldsEmbed.build();

  }
};