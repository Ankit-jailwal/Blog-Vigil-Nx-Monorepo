import { UnauthorizedException } from '@nestjs/common';
import * as crypto from 'crypto';

export function slackRequestVerification(payload: any, req: any): any {
    try {
        const slackSigningSecret = 'c81d3e0d27bc5b7db8811c6664332cde';
        const requestBody = req.rawBody; // Assuming req.rawBody contains the entire JSON object
        const timestamp = req.headers['x-slack-request-timestamp'];
        const requestSignature = req.headers['x-slack-signature'];
        const requestBodyStr = typeof requestBody === 'string' ? requestBody : JSON.stringify(requestBody);
        
        console.log(requestBodyStr);
        
        const sigBaseString = `v0:${timestamp}:${requestBodyStr}`;
        const sha256Hex = crypto.createHmac('sha256', slackSigningSecret)
          .update(sigBaseString, 'utf8')
          .digest('hex');
        const mySignature = `v0=${sha256Hex}`;
        
        console.log(sigBaseString);
        console.log(mySignature);
        console.log(requestSignature);
        
        if (crypto.timingSafeEqual(Buffer.from(mySignature, 'utf8'), Buffer.from(requestSignature, 'utf8'))) {
          return {
            success: true,
          };
        }
      throw new UnauthorizedException('Something went wrong!');
      return {
        success: false,
      };
    //   const requestSignature = req.headers['x-slack-signature']?.toLowerCase(); // Case-insensitive comparison
    //   const requestBody = JSON.stringify(req.body);
    //   const timestamp = req.headers['x-slack-request-timestamp'];
  
    //   const hmac = crypto.createHmac('sha256', process.env['SLACK_SIGNING_SECRET']);
    //   const [version, hash] = requestSignature.split('=');
    //   hmac.update(`${version}:${timestamp}:${requestBody}`);
  
    //   const calculatedSignature = `${version}=${hmac.digest('hex')}`.toLowerCase();
  
    //   if (crypto.timingSafeEqual(Buffer.from(calculatedSignature), Buffer.from(requestSignature))) {
    //     return true;
    //   } else {
    //     throw new UnauthorizedException('Invalid Slack request signature');
    //   }
    } catch (error) {
      console.error(error); // Log error details
      throw error; // Rethrow for better debugging
    }
  }
