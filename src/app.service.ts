import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';


@Injectable()
export class AppService {


  getHello(): string {
    return 'Hello World!';
  }


 
  

}
