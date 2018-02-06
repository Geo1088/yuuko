'use strict'

const Command = require('../src/Command')
const moment = require('moment-timezone')
const childProcess = require('child_process')
const packageJson = require.main.require('./package.json')

let versionTag
childProcess.exec('git describe --abbrev=0 --tags', (err, tag) => {
	if (err) {
		versionTag = '???'
		console.log(err)
	} else {
		versionTag = '``' + tag.replace('\n', '') + '``'
	}
})
let versionSha
childProcess.exec('git rev-parse --short HEAD', (err, sha) => {
	if (err) {
		versionSha = 'Unknown'
		console.log(err)
	} else {
		versionSha = '`' + sha.replace('\n', '') + '`'
	}
})

module.exports = new Command(['about', 'uptime', 'info'], function (msg, args, prefix) {
	const uptimeDuration = moment.duration(this.uptime).humanize()
	const uptimeStart = moment().subtract(this.uptime).tz('America/New_York').format('YYYY-DD-mm kk:mm z')
	const link = packageJson.homepage
	const owner = this.app ? `\`\`${this.app.owner.username}#${this.app.owner.discriminator}\`\`` : `Owner information unavailable, try again in a bit`

	const content = `**=== About Yuuko ===**
*Use \`${prefix}help\` to get help using the bot.*
**Server:** https://discord.gg/a2N2YCx
**Project:** ${link}
**Owner:** ${owner}
**Version:** ${versionTag} (Commit: ${versionSha})
**Uptime:** ${uptimeDuration} (since ${uptimeStart})
**Ping:** Wait for it...`

	const then = Date.now()
	msg.channel.createMessage(content).then(newmsg => {
		const diff = Date.now() - then
		newmsg.edit(newmsg.content.replace('Wait for it...', `${diff}ms`))
	})
})
module.exports.help = {
	desc: 'Displays information about the bot, including running version, time since last crash, and a link to its source code.',
	args: ''
}
