import httpError from 'http-errors';
import DepositContract from '../models/DepositContract.js';
import apq from 'api-query-params';
import transferContract from '../models/TransferContract.js';

export const createDepositContract = async (req, res, next) => {
	try {
		const { value, expires, propertyId, customerId } = req.body;

		if (!value || !expires || !propertyId || !customerId) {
			return res.status(200).json({
				statusCode: 400,
				statusMessage: 'failed',
				message: 'Please complete all information',
			});
		}

		if (isNaN(value)) {
			return res.status(200).json({
				statusCode: 400,
				statusMessage: 'failed',
				message: 'Value must be a number',
			});
		}

		const expiresDate = new Date(expires);
		expiresDate.setDate(expiresDate.getDate() + 1);
		expiresDate.setHours(0, 0, 0, 0);

		const depositContract = new DepositContract({
			value,
			propertyId,
			customerId,
			expires: expiresDate,
		});
		await depositContract.save();
		return res.status(200).json({
			statusCode: 201,
			statusMessage: 'success',
			message: 'Successfully created deposit contract',
		});
	} catch (error) {
		console.log(error);
		return next(httpError(400, error));
	}
};

export const getAllDepositContract = async (req, res, next) => {
	const { filter, limit, sort } = apq(req.query);

	if (typeof filter.status !== 'boolean') delete filter.status;

	try {
		const result = await DepositContract.find(filter)
			.populate({
				path: 'customerId',
				select: 'name',
			})
			.populate({
				path: 'propertyId',
				select: 'name',
			});
		return res.status(200).json({
			statusCode: 200,
			statusMessage: 'success',
			data: result,
		});
	} catch (error) {
		console.error(error);
		return next(httpError(500, error));
	}
};

export const getDepositContractByPropertyId = async (req, res, next) => {
	const { id } = req.body;

	const result = await DepositContract.findOne({ propertyId: id });
	if (!result) {
		return res.status(200).json({
			statusCode: 404,
			statusMessage: 'failed',
			message: 'Deposit contract not found',
		});
	}
	return res.status(200).json({
		statusCode: 200,
		statusMessage: 'success',
		data: result,
	});
};

export const getDepositContractById = async (req, res, next) => {
	const { id } = req.body;

	const result = await DepositContract.findOne({ _id: id })
		.populate({
			path: 'customerId',
			select: 'name',
		})
		.populate({
			path: 'propertyId',
			select: 'name',
		});
	if (!result) {
		return res.status(200).json({
			statusCode: 404,
			statusMessage: 'failed',
			message: 'Deposit contract not found',
		});
	}
	return res.status(200).json({
		statusCode: 200,
		statusMessage: 'success',
		data: result,
	});
};
