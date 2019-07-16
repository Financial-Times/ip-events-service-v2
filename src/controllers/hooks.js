const logger = require('@financial-times/n-logger').default;
const uuidv4 = require('uuid/v4');
const selectn = require('selectn');

const formatMembership = async (req, res) => {
	const uuid = uuidv4()
	const baseEvent = req.body
	//logger.info({ event: 'MEMBERSHIP_DATA_RECEIVED', body: baseEvent})
	if (baseEvent.messages[0].messageType === 'UserCreated') {
		console.log('user created')
		return res.json('ok')
	}
	console.log(uuid, JSON.parse(baseEvent.messages[0].body))
	console.log(uuid, baseEvent.messages[0].messageType)
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
		return res.json('ok')
	// }
	// return res.json('wrong event')
};

function removeUndefined(obj) {
	Object.keys(obj).forEach(key => obj[key] === undefined || obj[key] === null ? delete obj[key] : '')
	return obj
}

module.exports = { formatMembership };