const { isNum, isStr } = require('x-is-type');
/**
 * @param {Number} code
 * @param {String} message
 */
const createErrorResponse = (code, message) => {
	return {
		responseCode: isNum(code) ? code : 500,
		responseMessage: isStr(message) ? message : 'An Unknown Error Occurred',
	};
};

const isErrorResponse = (error) => {
	return error && isNum(error.responseCode) && isStr(error.responseMessage);
};

const sendErrorResponse = (res, error) => {
	if (!isErrorResponse(error)) {
		return res.status(500).json({ error: 'An Unknown Error Occurred' });
	}
	res.status(error.responseCode).json({ error: error.responseMessage });
};

module.exports = {
	createErrorResponse,
	isErrorResponse,
	sendErrorResponse,
};
