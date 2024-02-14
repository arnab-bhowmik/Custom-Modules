import amqp from 'amqplib';
import { Subjects } from './subjects';

interface Event {
  subject: Subjects;
  data: any;
}

export abstract class Listener<T extends Event> {
  abstract subject: T['subject'];
  abstract processMessage(data: T['data'], msg: amqp.ConsumeMessage): Promise<boolean>;
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
        // Instantiating the following attributes for use within the channel.consume() method as this.{attribute} won't work 
        let eventName = this.subject;
        let channel   = this.channel!;
        let processMessage = this.processMessage;
        this.channel!.consume(this.queue, async function(msg) {
          // Invoke the processMessage() method implementation specific to the event listener processing the message
          const eventData = JSON.parse(msg!.content.toString());
          const messageProcessed = await processMessage(eventData, msg!);
          if (messageProcessed) {
            console.log(`[x] Received Event ${eventName}, ${msg!.content.toString()}`);
            channel.ack(msg!);
          } else {
            console.log(`[x] Listener corresponds to Event ${eventName} but the Event message is of type ${msg!.properties.type.toString()}`);
            console.log(`[x] Event will be picked up by any other available listeners and will get processed if listener type is ${msg!.properties.type.toString()}`);
            channel.nack(msg!, false, true); // Requeue the message
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