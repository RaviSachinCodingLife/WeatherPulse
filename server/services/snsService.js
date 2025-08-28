// server/services/snsService.js
const {
  SNSClient,
  PublishCommand,
  SubscribeCommand,
} = require("@aws-sdk/client-sns");

// Create SNS client. The SDK automatically reads AWS_* env vars, but we'll explicitly pass them if present.
const sns = new SNSClient({
  region: process.env.AWS_REGION || "us-east-1",
  // credentials will be read from env by default; explicitly set only if provided
  credentials: process.env.AWS_ACCESS_KEY_ID
    ? {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      }
    : undefined,
});

async function publishAlert(alert) {
  try {
    const cmd = new PublishCommand({
      TopicArn: process.env.SNS_TOPIC_ARN,
      Subject: `WeatherPulse: ${alert.type} - ${alert.title}`,
      Message: JSON.stringify({ alert }, null, 2),
    });
    const resp = await sns.send(cmd);
    return resp;
  } catch (err) {
    // bubble up or log — calling code should catch
    throw err;
  }
}

async function subscribe(topicArn, protocol, endpoint) {
  const cmd = new SubscribeCommand({
    TopicArn: topicArn,
    Protocol: protocol, // 'email' | 'sms' | 'https' | ...
    Endpoint: endpoint,
  });
  const resp = await sns.send(cmd);
  return resp;
}

module.exports = { publishAlert, subscribe };
