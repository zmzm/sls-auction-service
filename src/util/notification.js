import AWS from 'aws-sdk';

const sqs = new AWS.SQS();

export async function notifyAuctionParticipants({ name, seller, highestBid }) {
  const { amount, bidder } = highestBid;

  if (amount === 0) {
    await sqs
      .sendMessage({
        QueueUrl: process.env.MAIL_QUEUE_URL,
        MessageBody: JSON.stringify({
          subject: 'No bids on your auction item :(',
          recipient: seller,
          body: `Oh no! Your item "${name}" didn't get any bids. Better luck next time!`,
        }),
      })
      .promise();
    return;
  }

  const notifySeller = sqs
    .sendMessage({
      QueueUrl: process.env.MAIL_QUEUE_URL,
      MessageBody: JSON.stringify({
        subject: 'Your item has been sold!',
        recipient: seller,
        body: `Woohoo! Your item "${name}" has been sold for $${amount}.`,
      }),
    })
    .promise();

  const notifyBidder = sqs
    .sendMessage({
      QueueUrl: process.env.MAIL_QUEUE_URL,
      MessageBody: JSON.stringify({
        subject: 'You won an auction!',
        recipient: bidder,
        body: `What a great deal! You got yourself a "${name}" for $${amount}.`,
      }),
    })
    .promise();

  Promise.all([notifySeller, notifyBidder]);
}
