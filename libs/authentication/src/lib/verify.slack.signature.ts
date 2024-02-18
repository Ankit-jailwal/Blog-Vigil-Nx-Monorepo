import * as crypto from 'crypto';

export function slackRequestVerification(req: any) {
  const signature = req.headers['x-slack-signature']
  const timestamp = req.headers['x-slack-request-timestamp']
  const hmac = crypto.createHmac('sha256', `${process.env['SLACK_SIGNING_SECRET']}`)
  const [version, hash] = signature.split('=')

  hmac.update(`${version}:${timestamp}:${req.rawBody}`)
  
  console.log(hash);
  console.log(timestamp);
  console.log(signature);
  return hmac.digest('hex') === hash;
}
