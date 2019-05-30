---
layout: md
title: Quick Start
group: nav
order: 1
permalink: /quick-start/
header: ["Quick Start", "Get your first Yuuko bot up and running."]
---
# Prerequisites and installation

Yuuko requires Node version 8 or higher. You can install `yuuko` with your package manager of choice:

```bash
# If you're using yarn:
yarn add yuuko
# If you're using npm:
npm install yuuko
```

# The bare minimum

This code will get you a basic call-response bot up and running. Fill in your token, set it running, and send "!ping" in a channel you share with it. It'll respond "Pong!" as any good bot should.

```js
const {Client, Command} = require('yuuko');

const mybot = new Client({
	token: 'feed_me_credentials',
	prefix: '!',
});

const pingCommand = new Command('ping', message => {
	message.channel.createMessage('Pong!');
});

mybot.addCommand(pingCommand).connect();
```
```ts
import {Client, Command} from 'yuuko';

const mybot = new Client({
	token: 'feed_me_credentials',
	prefix: '!',
});

const pingCommand = new Command('ping', message => {
	message.channel.createMessage('Pong!');
});

mybot.addCommand(pingCommand).connect();
```

# Splitting off your commands

When you have lots of commands, it becomes impractical to store them all in one file. Luckily, Yuuko makes it easy to work with commands stored in other files. Here's an example:

```js
// index.js
const {Client} = require('yuuko');
const mybot = new Client({
	token: 'feed_me_credentials',
	prefix: '!',
});
mybot
	.addCommandDir(path.join(__dirname, 'commands'))
	.connect();

// commands/ping.js
const {Command} = require('yuuko');
module.exports = new Command('ping', message => {
	message.channel.createMessage('Pong!');
});
```
```ts
// index.js
import {Client} from 'yuuko';
const mybot = new Client({
	token: 'feed_me_credentials',
	prefix: '!',
});
mybot
	.addCommandDir(path.join(__dirname, 'commands'))
	.connect();

// commands/ping.js
import {Command} from 'yuuko';
export default new Command('ping', message => {
	message.channel.createMessage('Pong!');
});
```

# Command arguments

The function run when a command is executed takes a second parameter which contains an array of space-separated arguments to the command. You can use it like so:

```js
const addCommand = new Command('add', (message, args) => {
	// Convert the arguments to numbers
	args = args.map(number => parseInt(number, 10));
	// Add them all up!
	let sum = 0;
	for (const number of args) {
		sum += number;
	}
	msg.channel.createMessage(`The sum is ${sum}!`);
});
```

# The context argument

Additionally, commands take a third parameter, a *context object*. By default, this object contains the name of the command being called and a reference to the client object, but you can add custom properties to it through `Client#extendContext()` to easily share objects (database connections, etc.) among all your files.

```js
// index.js
const {Client} = require('yuuko');
const mybot = new CLient({...});
mybot.extendContext({
	myCustomThing: 'This is neat!',
});
mybot.addCommandDir(path.join(__dirname, 'commands')).run();

// commands/test.js
const {Command} = require('yuuko');
module.exports = new Command('test', (message, args, context) => {
	context.client // The same as mybot in the first file
	context.commandName // The name or alias used to call the command
	context.myCustomThing // The string 'This is neat!' that was set above
});
```

# Custom prefixes

You can set a function that's used to set a custom prefix on a per-message basis. This can be used to set per-guild prefixes. This function also receives a context object (minus the `prefix` and `commandName` properties) as its second argument.

```js
mybot.prefixes(message => {
	// If we're not in a guild, just use the default
	if (!message.channel.guild) return;
	// In guilds, allow two prefixes, "!" and "!!"
	return ['! ', '!!'];
});
```

# Everything Eris

Yuuko's client class extends Eris's, so you can use all the client methods directly.

```js
console.log(mybot.user.username);
```


<script>
document.querySelectorAll('.language-ts').forEach(element => {
	element.parentElement.removeChild(element);
})
</script>