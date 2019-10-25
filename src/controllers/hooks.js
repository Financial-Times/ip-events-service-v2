const logger = require('@financial-times/n-logger').default;
const uuidv4 = require('uuid/v4');
const selectn = require('selectn');

const formatMembership = async (req, res) => {
	const reqUUID = uuidv4()
	const baseEvent = req.body
	console.log(baseEvent)
	logger.info({ event: 'MEMBERSHIP_DATA_RECEIVED', body: baseEvent})
	baseEvent.messages.forEach((message) => {
		console.log(message)
		if (message.messageType === "SubscriptionPurchased" || message.messageType === "SubscriptionCancellationRequestReceived") {
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
			console.log('formatted event', formattedEvent)
		} else {
			console.log('non-sub event', message.messageType)
		}
	});
	return res.json('ok')
};

const formatSeat = async (req, res) => {
	const reqUUID = uuidv4()
	const baseEvent = req.body
	console.log(baseEvent)
	baseEvent.messages.forEach((message) => {
		console.log(message)
		if (message.messageType === "LicenceSeatAllocated" || message.messageType === "LicenceSeatDeallocated") {
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
			console.log('formatted event', formattedEvent)
		} else {
			console.log('non-sub event', message.messageType)
		}
	});
	return res.json('ok')
};

const formatPayment = async (req, res) => {
	const reqUUID = uuidv4()
	const baseEvent = req.body
	console.log(baseEvent)
	baseEvent.messages.forEach((message) => {
		console.log(message)
		if (message.messageType === "SubscriptionPaymentSuccess" || message.messageType === "SubscriptionPaymentFailure") {
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
			console.log('formatted event', formattedEvent)
		} else {
			console.log('non-sub event', message.messageType)
		}
	});
	return res.json('ok')
};

const formatUserPreferences = async (req, res) => {
	const reqUUID = uuidv4()
	const baseEvent = req.body
	console.log(baseEvent)
	logger.info({ event: 'USER_PREFS_DATA_RECEIVED', body: baseEvent})
	baseEvent.messages.forEach((message) => {
		console.log(message)
		if (message.messageType === "UserProductsChanged") {
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
			logger.info({ event: "PAYMENT_EVENT_FORMATTED", request: reqUUID, message: msgUUID, formattedEvent: formattedEvent })
			console.log('formatted event', formattedEvent)
		}
	});
	return res.json('ok')
};

function removeUndefined(obj) {
	Object.keys(obj).forEach(key => obj[key] === undefined || obj[key] === null ? delete obj[key] : '')
	return obj
}

module.exports = { formatMembership, formatSeat, formatPayment, formatUserPreferences };