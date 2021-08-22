/** @module Yuuko */

// Export all things from other files

// Main classes
export * from './Client';
export * from './Command';
export * from './EventListener';

// Argument parsing core
export * from './argumentParsing';

// Argument types for basic values
export * from './argumentTypes/basic/IntegerArgument';
export * from './argumentTypes/basic/NumberArgument';

// Argument types for Discord stuff
export * from './argumentTypes/discord/MemberArgument';

// Also export plain Eris for convenience working with its types/etc
import * as Eris from 'eris';
export {Eris};
