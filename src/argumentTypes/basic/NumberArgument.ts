import {ArgumentType, registerArgumentType} from '../../Yuuko';

/** An argument that represents a floating-pointer number. */
type NumberArgument = ArgumentType<{
    type: 'number';
	/** The lower bound of accepted integers. Defaults to `-Infinity`. */
	lowerBound?: number;
	/** The upper bound of accepted integers. Defaults to `Infinity`. */
	upperBound?: number;
}, number>;

registerArgumentType<NumberArgument>('number', (args, {
	lowerBound = -Infinity,
	upperBound = Infinity,
}) => {
	// shift()! is appropriate here solely because `parseFloat(undefined)` is `NaN`
	const num = parseFloat(args.shift()!);
	if (num < lowerBound || num > upperBound) {
		throw new RangeError(`${num} is not between ${lowerBound} and ${upperBound}`);
	}
	return num;
});
