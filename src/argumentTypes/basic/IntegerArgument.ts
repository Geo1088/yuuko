import {ArgumentType, registerArgumentType} from '../../Yuuko';

/** An argument that represents an integer number. */
type NumberArgument = ArgumentType<{
    type: 'number';
	/**
	 * The lower bound of accepted integers. Defaults to
	 * `Number.MIN_SAFE_INTEGER`.
	 */
	lowerBound?: number;
	/**
	 * The upper bound of accepted integers. Defaults to
	 * `Number.MAX_SAFE_INTEGER`.
	 */
	upperBound?: number;
	/** The radix/base used for parsing. Defaults to `10`. */
	radix?: number;
}, number>;

registerArgumentType<NumberArgument>('number', (args, {
	lowerBound = Number.MIN_SAFE_INTEGER,
	upperBound = Number.MAX_SAFE_INTEGER,
	radix = 10,
}) => {
	// shift()! is appropriate here solely because `parseFloat(undefined)` is `NaN`
	const num = parseInt(args.shift()!, radix);
	if (num < lowerBound || num > upperBound) {
		throw new RangeError(`${num} is not between ${lowerBound} and ${upperBound}`);
	}
	return num;
});
