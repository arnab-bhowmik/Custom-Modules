import amqp from 'amqplib';
import { Subjects } from './subjects';

interface Event {
  subject: Subjects;
  data: any;
}

export abstract class Listener<T extends Event> {
  abstract subject: T['subject'];
  abstract onMessage(data: T['data']): boolean;
  private connection: amqp.Connection | null = null;
  private channel: amqp.Channel | null = null;
  private queue: string;

  constructor(connection: amqp.Connection, queue: string) {
    // Initialize properties
    this.connection = connection;
    this.queue      = queue;
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

  listen(): Promise<void> {
    return new Promise(async (resolve, reject) => {
      try {
        if (!this.channel) {
          await this.openChannel();
        }
        let eventName = this.subject;
        let channel   = this.channel!;
        let onMessage = this.onMessage;
        this.channel!.consume(this.queue, function(msg) {
          // Invoke the abstract onMessage() method implementation specific to the event
          const eventData = JSON.parse(msg!.content.toString());
          const processMessage = onMessage(eventData);
          if (processMessage) {
            console.log(`[x] Received Event ${eventName}, ${msg!.content.toString()}`);
            channel.ack(msg!);
          } else {
            console.log(`[x] Listener corresponds to Event ${eventName} but the Event message is of type ${msg!.properties.type}`);
          }
        }, { 
          noAck: false
        });
        resolve();
      } catch (err) {
        console.log('Error while executing listen() method: ', err);
        reject(err);
      }
    });
  }

}