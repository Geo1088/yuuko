import {emitWarning} from 'process';

// This function being unused is fine, it just means there's nothing deprecated
// to emit warnings about right now. There will be more in the future :V
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function warningEmitter (warning, code) {
	let hasWarned = false;
	return () => {
		if (hasWarned) return;
		hasWarned = true;
		emitWarning(warning, 'DeprecationWarning', code);
	};
}
