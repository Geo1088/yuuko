/** An argument type's options object. */
export interface ArgumentSpecifier {
    type: string;
}

/** An argument's options interface and its return type inside a type tuple. */
export type ArgumentType<A extends ArgumentSpecifier = ArgumentSpecifier, R = any> = [A, R];

/**
 * A function that takes an args array and the options for the argument and
 * returns a value that matches the expected type of the argument.
 */
export type ArgumentResolver<A extends ArgumentType = ArgumentType> = (args: string[], opts: A[0]) => A[1] | Promise<A[1]>;

// A map containing all argument parsers registered
const argResolvers = new Map<string, ArgumentResolver>();

/** Registers a custom argument type for use with `parseArgs` */
export function registerArgumentType<T extends ArgumentType> (id: T[0]['type'], func: ArgumentResolver<T>): void {
	// We're storing parsers as generic ArgumentResolvers, rather than their
	// more specific "true" types. Type safety is still guaranteed since we've
	// checked the type string here and we check the type string again when
	// calling `parseArgs`, ensuring that the "true" type of the resolver here
	// will always match the type expected by the parsing code.
	argResolvers.set(id, func as unknown as ArgumentResolver);
}

/** Parses command arguments according to a list of argument types. */
// There is still no good way to handle array types like this
export async function parseArgs<T extends ArgumentType[]> (args: string[], specifiers: [T[0][0]]): Promise<[T[0][1]]>;
export async function parseArgs<T extends ArgumentType[]> (args: string[], specifiers: [T[0][0], T[1][0]]): Promise<[T[0][1], T[1][1]]>;
export async function parseArgs<T extends ArgumentType[]> (args: string[], specifiers: [T[0][0], T[1][0], T[2][0]]): Promise<[T[0][1], T[1][1], T[2][1]]>;
export async function parseArgs<T extends ArgumentType[]> (args: string[], specifiers: [T[0][0], T[1][0], T[2][0], T[3][0]]): Promise<[T[0][1], T[1][1], T[2][1], T[3][1]]>;
export async function parseArgs<T extends ArgumentType[]> (args: string[], specifiers: [T[0][0], T[1][0], T[2][0], T[3][0], T[4][0]]): Promise<[T[0][1], T[1][1], T[2][1], T[3][1], T[4][1]]>;
export async function parseArgs<T extends ArgumentType[]> (args: string[], specifiers: [T[0][0], T[1][0], T[2][0], T[3][0], T[4][0], T[5][0]]): Promise<[T[0][1], T[1][1], T[2][1], T[3][1], T[4][1], T[5][1]]>;
export async function parseArgs<T extends ArgumentType[]> (args: string[], specifiers: [T[0][0], T[1][0], T[2][0], T[3][0], T[4][0], T[5][0], T[6][0]]): Promise<[T[0][1], T[1][1], T[2][1], T[3][1], T[4][1], T[5][1], T[6][1]]>;
export async function parseArgs<T extends ArgumentType[]> (args: string[], specifiers: [T[0][0], T[1][0], T[2][0], T[3][0], T[4][0], T[5][0], T[6][0], T[7][0]]): Promise<[T[0][1], T[1][1], T[2][1], T[3][1], T[4][1], T[5][1], T[6][1], T[7][1]]>;
export async function parseArgs<T extends ArgumentType[]> (args: string[], specifiers: [T[0][0], T[1][0], T[2][0], T[3][0], T[4][0], T[5][0], T[6][0], T[7][0], T[8][0]]): Promise<[T[0][1], T[1][1], T[2][1], T[3][1], T[4][1], T[5][1], T[6][1], T[7][1], T[8][1]]>;
export async function parseArgs<T extends ArgumentType[]> (args: string[], specifiers: [T[0][0], T[1][0], T[2][0], T[3][0], T[4][0], T[5][0], T[6][0], T[7][0], T[8][0], T[9][0]]): Promise<[T[0][1], T[1][1], T[2][1], T[3][1], T[4][1], T[5][1], T[6][1], T[7][1], T[8][1], T[9][1]]>;
export async function parseArgs (args: string[], specifiers: ArgumentSpecifier[]): Promise<any[]> {
	const returnValues: any[] = [];
	for (const specifier of specifiers) {
		const resolver = argResolvers.get(specifier.type);
		if (!resolver) {
			throw new Error(`No resolver for type ${specifier.type}`);
		}

		try {
			// Resolvers must be processed serially since they modify the `args`
			// array, and changes need to be reflected for the next resolver
			// eslint-disable-next-line no-await-in-loop
			returnValues.push(await resolver(args, specifier));
		} catch (error) {
			// The resolver threw - re-throw the error, adding context
			error.specifier = specifier;
			error.argIndex = specifiers.indexOf(specifier);
			throw error;
		}
	}
	return returnValues;
}
