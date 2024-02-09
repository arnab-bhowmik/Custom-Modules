import amqp from 'amqplib';
import { Subjects } from './subjects';

interface Event {
  subject: Subjects;
  data: any;
}

export abstract class Listener<T extends Event> {
  abstract subject: T['subject'];
  private connection: amqp.Connection | null = null;
  private channel: amqp.Channel | null = null;

  constructor(public exchange: string, public key: string, public queue: string, public rabbitmq_username: string, public rabbitmq_password: string, public rabbitmq_k8s_service: string, public rabbitmq_k8s_service_port: number) {
    // Initialize properties  
    this.exchange                   = exchange;
    this.key                        = key;
    this.queue                      = queue;
    this.rabbitmq_username          = rabbitmq_username;
    this.rabbitmq_password          = rabbitmq_password;
    this.rabbitmq_k8s_service       = rabbitmq_k8s_service;
    this.rabbitmq_k8s_service_port  = rabbitmq_k8s_service_port;
  }

  async processChannel(): Promise<void> {
    try {
      this.channel = await this.connection!.createChannel();
      await this.channel.assertExchange(this.exchange, 'topic', { durable: true });
      await this.channel.assertQueue(this.queue, { durable: true, arguments: { 'x-queue-type': 'quorum' } });
      await this.channel.bindQueue(this.queue, this.exchange, this.key);
    } catch (err) {
      console.log('Error while executing processChannel() method: ', err);
    }
  }

  async closeConnection(): Promise<void> {
    try {
      if (this.channel) {
        await this.channel.close();
      }
      if (this.connection) {
        await this.connection.close();
      }     
    } catch (err) {
      console.log('Error while executing closeConnection() method: ', err);
    }
  }

  listen(): Promise<void> {
    return new Promise(async (resolve, reject) => {
      try {
        if (!this.connection) {
          console.log('Connection does not exist, need to create a new one!');
          const rabbitmqUrl = `amqp://${this.rabbitmq_username}:${this.rabbitmq_password}@${this.rabbitmq_k8s_service}:${this.rabbitmq_k8s_service_port}`;
          this.connection = await amqp.connect(rabbitmqUrl);
        }
        if (!this.channel) {
          console.log('Channel does not exist, need to create a new one!');
          await this.processChannel();
        }
        this.channel!.consume(this.queue, function(msg) {
          console.log("[x] Received Event Data '%s'", JSON.parse(msg!.content.toString()));
        }, { 
          noAck: true 
        });
        resolve();
      } catch (err) {
        console.log('Error while executing listen() method: ', err);
        reject(err);
      // } finally {
      //   await this.closeConnection();
      }
    });
  }

}
