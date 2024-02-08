import amqp from 'amqplib';
import { Subjects } from './subjects';

interface Event {
  subject: Subjects;
  data: any;
}

export abstract class Publisher<T extends Event> {
  abstract subject: T['subject'];
  private connection: amqp.Connection | null = null;
  private channel: amqp.Channel | null = null;

  constructor(public exchange: string, public key: string, public rabbitmq_k8s_service: string, public rabbitmq_username: string, public rabbitmq_password: string) {
    // Initialize properties  
    this.exchange             = exchange;
    this.key                  = key;
    this.rabbitmq_k8s_service = rabbitmq_k8s_service;
    this.rabbitmq_username    = rabbitmq_username;
    this.rabbitmq_password    = rabbitmq_password;
  }

  async createChannel(): Promise<void> {
    this.connection = await amqp.connect(`amqp://${this.rabbitmq_username}:${this.rabbitmq_password}@${this.rabbitmq_k8s_service}`);
    this.channel = await this.connection.createChannel();
    await this.channel.assertExchange(this.exchange, 'topic', { durable: false });
  }

  async closeConnection(): Promise<void> {
    if (this.channel) await this.channel.close();
    if (this.connection) await this.connection.close();
  }

  publish(data: T['data']): Promise<void> {
    return new Promise(async (resolve, reject) => {
      try {
        if (!this.channel) {
          await this.createChannel();
        }
        this.channel?.publish(this.exchange, this.key, Buffer.from(JSON.stringify(data)));
        console.log(`[x] Sent ${this.key}: ${data}`);
        resolve();
      } catch (err) {
        console.warn(err);
        reject(err);
      } finally {
        await this.closeConnection();
      }
    });
  }

}
