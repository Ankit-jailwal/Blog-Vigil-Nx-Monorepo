import { LoggerService } from "@nestjs/common";

export class ArticleLoggerService implements LoggerService {
      log(message: string) {
        this.pushLog('Log: ' + message);
      }
    
      error(message: string, trace: string) {
        this.pushLog('Error: ' + message);
        this.pushLog('Stack Trace: ' + trace);
      }
    
      warn(message: string) {
        this.pushLog('Warn :' + message);
      }
    
      debug(message: string) {
        this.pushLog('Debug :' + message);
      }

      private pushLog(message: string) {
            console.log(message)
      }
}