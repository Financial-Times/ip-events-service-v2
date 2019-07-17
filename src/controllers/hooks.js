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
			console.log(messageBody)
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
	// if (selectn('MessageType', baseEvent) === "SubscriptionPurchased" || "SubscriptionCancelRequestProcessed") {
		// const uuid = selectn('body.subscription.userId', baseEvent)
		// const context = {
		// 	messageId: selectn('MessageID', baseEvent),
		// 	timestamp: selectn('MessageTimestamp', baseEvent),
		// 	messageType: selectn('MessageType', baseEvent),
		// 	invoiceId: selectn('body.subscription.invoiceId', baseEvent),
		// 	invoiceNumber: selectn('body.subscription.invoiceNumber', baseEvent),
		// 	offerId: selectn('body.subscription.offerId', baseEvent),
		// 	paymentType: selectn('body.subscription.paymentType', baseEvent),
		// 	productRatePlanId: selectn('body.subscription.productRatePlanId', baseEvent),
		// 	subscriptionId: selectn('body.subscription.subscriptionId', baseEvent),
		// 	subscriptionNumber: selectn('body.subscription.subscriptionNumber', baseEvent),
		// 	segmentId: selectn('body.subscription.segmentId', baseEvent),
		// 	userId: uuid,
		// 	cancellationReason: selectn('body.subscription.cancellationReason', baseEvent)
		// }
		// removeUndefined(context)
		// const user = {
		// 	ft_guid: uuid,
		// 	uuid: uuid
		// }
		// const formattedEvent = {
		// 	user: user,
		// 	context: context,
		// 	category: "membership",
		// 	action: "change",
		// 	system: {
		// 		source: "internal-products"
		// 	}
		// }
		// logger.info({ event: 'MEMBERSHIP_DATA_FORMATTED', uuid: uuid, formattedEvent: formattedEvent})
		// console.log(formattedEvent)
		// return res.json(formattedEvent)
		//return res.json('ok')
	// }
	// return res.json('wrong event')
};

function removeUndefined(obj) {
	Object.keys(obj).forEach(key => obj[key] === undefined || obj[key] === null ? delete obj[key] : '')
	return obj
}

module.exports = { formatMembership };