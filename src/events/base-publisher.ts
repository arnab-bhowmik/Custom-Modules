import amqp from 'amqplib';
import { Subjects } from './subjects';

interface Event {
  subject: Subjects;
  data: any;
}

export abstract class Publisher<T extends Event> {
  abstract subject: T['subject'];
  abstract routingKey: string;
  private connection: amqp.Connection | null = null;
  private channel: amqp.Channel | null = null;
  private exchange: string;

  constructor(connection: amqp.Connection, exchange: string) {
    // Initialize properties 
    this.connection = connection; 
    this.exchange   = exchange;
  }

  async openChannel(): Promise<void> {
    try {
      console.log('Creating a new RabbitMQ channel!');
      this.channel = await this.connection!.createChannel();    
    } catch (err) {
      console.log('Error while creating a new RabbitMQ channel: ', err);
    }
  }

  async closeChannel(): Promise<void> {
    try {
      console.log('Closing the RabbitMQ channel!');
      if (this.channel) {
        await this.channel.close();
      }     
    } catch (err) {
      console.log('Error while closing the RabbitMQ channel: ', err);
    }
  }

  publish(data: T['data']): Promise<void> {
    return new Promise(async (resolve, reject) => {
      try {
        if (!this.channel) {
          await this.openChannel();
        }
        this.channel!.publish(this.exchange, this.routingKey, Buffer.from(JSON.stringify(data)), { type: this.subject });
        console.log(`[x] Published Event ${this.subject}, ${JSON.stringify(data)}`);
        resolve();
      } catch (err) {
        console.log('Error while executing publish() method: ', err);
        reject(err);
      } finally {
        await this.closeChannel();
      }
    });
  }

}