const logger = require('@financial-times/n-logger').default;
const uuidv4 = require('uuid/v4');
const selectn = require('selectn');
const { sendToSpoor } = require('../controllers/clients');

const formatSub = (reqUUID, message) => {
	const msgUUID = uuidv4()
	logger.info({ event: "SUB_EVENT_UNFORMATTED", request: reqUUID, message: msgUUID, messageType: message.messageType, unformattedEvent: message })
	const messageBody = JSON.parse(message.body)
	const ftUUID = selectn('subscription.userId', messageBody)
	const context = {
		messageId: selectn('messageId', message),
		timestamp: selectn('messageTimestamp', message),
		messageType: selectn('messageType', message),
		invoiceId: selectn('subscription.invoiceId', messageBody),
		invoiceNumber: selectn('subscription.invoiceNumber', messageBody),
		offerId: selectn('subscription.offerId', messageBody),
		paymentType: selectn('subscription.paymentType', messageBody),
		productRatePlanId: selectn('subscription.productRatePlanId', messageBody),
		subscriptionId: selectn('subscription.subscriptionId', messageBody),
		subscriptionNumber: selectn('subscription.subscriptionNumber', messageBody),
		segmentId: selectn('subscription.segmentId', messageBody),
		userId: ftUUID,
		cancellationReason: selectn('subscription.cancellationReason', messageBody)
	}
	removeUndefined(context)
	const user = {
		ft_guid: ftUUID,
		uuid: ftUUID
	}
	const formattedEvent = {
		user: user,
		context: context,
		category: "membership",
		action: "change",
		system: {
			source: "internal-products"
		}
	}
	logger.info({ event: "SUB_EVENT_FORMATTED", request: reqUUID, message: msgUUID, formattedEvent: formattedEvent })
	return formattedEvent
}

const formatSeat = (reqUUID, message) => {
	const msgUUID = uuidv4()
	const messageBody = JSON.parse(message.body)
	const ftUUID = selectn('licenceSeatAllocated.userId', messageBody)
	const context = {
		messageId: selectn('messageId', message),
		timestamp: selectn('messageTimestamp', message),
		messageType: selectn('messageType', message),
		licenceId: selectn('licenceSeatAllocated.licenceId', messageBody),
		userId: ftUUID
	}
	removeUndefined(context)
	const user = {
		ft_guid: ftUUID,
		uuid: ftUUID
	}
	const formattedEvent = {
		user: user,
		context: context,
		category: "membership",
		action: "change",
		system: {
			source: "internal-products"
		}
	}
	logger.info({ event: "LICENCE_EVENT_FORMATTED", request: reqUUID, message: msgUUID, formattedEvent: formattedEvent })
	return formattedEvent
};

const formatPayment = (reqUUID, message) => {
	const msgUUID = uuidv4()
	const messageBody = JSON.parse(message.body)
	const ftUUID = selectn('account.userId', messageBody)
	const context = {
		messageId: selectn('messageId', message),
		timestamp: selectn('messageTimestamp', message),
		messageType: selectn('messageType', message),
		payment: {
			id: selectn('payment.id', messageBody),
			type: selectn('payment.type', messageBody)
		},
		account: {
			id: selectn('account.id', messageBody),
			name: selectn('account.name', messageBody),
			userId: ftUUID
		}
	}
	removeUndefined(context)
	const user = {
		ft_guid: ftUUID,
		uuid: ftUUID
	}
	const formattedEvent = {
		user: user,
		context: context,
		category: "membership",
		action: "change",
		system: {
			source: "internal-products"
		}
	}
	logger.info({ event: "PAYMENT_EVENT_FORMATTED", request: reqUUID, message: msgUUID, formattedEvent: formattedEvent })
	return formattedEvent
};

const formatUserProducts = (reqUUID, message) => {
	const msgUUID = uuidv4()
	const messageBody = JSON.parse(message.body)
	const ftUUID = selectn('userProductsChanged.user.userId', messageBody)
	const context = {
		messageId: selectn('messageId', message),
		timestamp: selectn('messageTimestamp', message),
		messageType: selectn('messageType', message),
		products: selectn('userProductsChanged.user.products', messageBody),
		userId: ftUUID
	}
	removeUndefined(context)
	const user = {
		ft_guid: ftUUID,
		uuid: ftUUID
	}
	const formattedEvent = {
		user: user,
		context: context,
		category: "membership",
		action: "change",
		system: {
			source: "internal-products"
		}
	}
	logger.info({ event: "USER_PRODUCTS_EVENT_FORMATTED", request: reqUUID, message: msgUUID, formattedEvent: formattedEvent })
	return formattedEvent
};

function removeUndefined(obj) {
	Object.keys(obj).forEach(key => obj[key] === undefined || obj[key] === null ? delete obj[key] : '')
	return obj
}

module.exports = (req, res, next) => {
	const reqUUID = uuidv4()
	const baseEvent = req.body
	logger.info({ event: 'MEMBERSHIP_DATA_RECEIVED', body: baseEvent })
	baseEvent.messages.forEach((message) => {
		if (message.messageType === "SubscriptionPurchased" || message.messageType === "SubscriptionCancellationRequestReceived") {
			const formattedEvent = formatSub(reqUUID, message)
			sendToSpoor(formattedEvent)
		} else if (message.messageType === "LicenceSeatAllocated" || message.messageType === "LicenceSeatDeallocated") {
			const formattedEvent = formatSeat(reqUUID, message)
			sendToSpoor(formattedEvent)
		} else if (message.messageType === "SubscriptionPaymentSuccess" || message.messageType === "SubscriptionPaymentFailure") {
			const formattedEvent = formatPayment(reqUUID, message)
			sendToSpoor(formattedEvent)
		} else if (message.messageType === "UserProductsChanged") {
			const formattedEvent = formatUserProducts(reqUUID, message)
			sendToSpoor(formattedEvent)
		} else {
			console.log('Invalid message type')
		}
	});
	next();
}
