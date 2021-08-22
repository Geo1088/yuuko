import Eris from 'eris';
import {ArgumentType, registerArgumentType} from '../../Yuuko';

export type MemberArgument = ArgumentType<{
	type: 'member';
	/** If provided, the word "me" will be interpreted the given member. */
	me?: Eris.Member;
	/** The guild to search for the member in. */
	guild: Eris.Guild;
}, Eris.Member>;

registerArgumentType<MemberArgument>('member', async (args, {
	me,
	guild,
}) => {
	if (!args.length) {
		throw new Error('Not enough arguments');
	}

	// The "me" keyword, if we're provided with a context for it
	if (me && args[0].toLowerCase() === 'me') {
		args.shift();
		return me;
	}

	let match;

	// Mentions and straight IDs
	match = args[0].match(/^(?:<@!?)?(\d+)>?(?:\s+|$)/);
	if (match) {
		const member = guild.members.get(match[1]) || await guild.getRESTMember(match[1]).catch(() => undefined);
		if (member) {
			args.shift();
			return member;
		}
	}

	// User tags (name#discrim)
	match = args[0].match(/^([^#]{2,32})#(\d{4})(?:\s+|$)/);
	if (match) {
		const member = guild.members.find(m => m.username === match[1] && m.discriminator === match[2]);
		if (member) {
			args.shift();
			return member;
		}
	}

	// Found nothing
	throw new Error('No member found');
});
