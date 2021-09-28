/**
 * Logger module
 * The logger has two functions, info for printing normal log messages, and error for all error messages.
*/

const info:(...params:string[])=>void = (...params) => {
	if (process.env.NODE_ENV !== 'test') console.info(...params);
};

const error:(...params:string[])=>void = (...params) => {
	if (process.env.NODE_ENV !== 'test') console.error(...params);
};

export  {
	info, error
};