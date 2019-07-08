const logger = require('@financial-times/n-logger').default;
const uuidv4 = require('uuid/v4');

const formatMembership = async (req, res) => {
    try {
		if (req.body.MessageType === 'SubscriptionPurchased') {
			const {
				invoiceId,
				invoiceNumber,
				offerId,
				paymentType,
				productRatePlanId,
				subscriptionId,
				subscriptionNumber,
				userId
			} = req.body.body.subscription
			const struct = {
				invoiceId,
				invoiceNumber,
				messageId: req.body.MessageID,
				messageType: req.body.MessageType,
				offerId,
				paymentType,
				productRatePlanId,
				subscriptionId,
				subscriptionNumber,
				timestamp: req.body.MessageTimestamp,
				userId
			}
			console.log(struct)
			return res.json(struct)
		}
		return res.json('Message type not accepted yet')
    } catch(error) {
		logger.error({ event: 'FORMAT_ERROR', error });
    }
};

module.exports = { formatMembership };