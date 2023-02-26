import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
// import { News } from '../news/news.interface';
import { NewsEntity } from 'src/news/news.entity';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}
  async sendTest() {
    console.log('Отправляется письмо установки');
    return this.mailerService
      .sendMail({
        to: 'egorlo059@gmail.com',
        subject: 'Первое тестовое письмо',
        template: './test',
      })
      .then((res) => {
        console.log('res', res);
      })
      .catch((err) => {
        console.log('err', err);
      });
  }
  async sendNewNewsForAdmins(
    emails: string[],
    news: NewsEntity,
  ): Promise<void> {
    console.log('news:', news);

    console.log('Отправляются письма о новой новости администрации ресурса');
    for (const email of emails) {
      await this.mailerService
        .sendMail({
          to: email,
          subject: `Создана новая новость: ${news.title}`,
          template: './new-news',
          context: news,
        })
        .then((res) => {
          console.log('res', res);
        })
        .catch((err) => {
          console.log('err', err);
        });
    }
  }

  // async sendEditNewsForAdmins(
  //   emails: string[],
  //   newNews: NewsEntity,
  //   previousNews: NewsEntity,
  // ): Promise<void> {
  //   console.log(
  //     'Отправляются письма о редактировании новости администрации ресурса',
  //   );
  //   const detailsEdit = {
  //     detailsEdit: {
  //       newNews: newNews,
  //       detailsUpdate: {
  //         title:
  //           previousNews.title === newNews.title
  //             ? undefined
  //             : {
  //                 previous: previousNews.title,
  //                 new: newNews.title,
  //               },
  //         description:
  //           previousNews.description === newNews.description
  //             ? undefined
  //             : {
  //                 previous: previousNews.description,
  //                 new: newNews.description,
  //               },
  //         author:
  //           previousNews.author === newNews.author
  //             ? undefined
  //             : {
  //                 previous: previousNews.author,
  //                 new: newNews.author,
  //               },
  //         cover:
  //           previousNews.cover === newNews.cover
  //             ? undefined
  //             : {
  //                 previous: previousNews.cover,
  //                 new: newNews.cover,
  //               },
  //       },
  //     },
  //   };

  //   for (const email of emails) {
  //     await this.mailerService
  //       .sendMail({
  //         to: email,
  //         subject: `Новость ${previousNews.title} отредактирована: `,
  //         template: './edit-news',
  //         context: detailsEdit,
  //       })
  //       .then((res) => {
  //         console.log('res', res);
  //       })
  //       .catch((err) => {
  //         console.log('err', err);
  //       });
  //   }
  // }
}
