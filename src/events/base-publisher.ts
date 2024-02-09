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
  private exchange: string;
  private routingKey: string;
  // private rabbitmq_username: string;
  // private rabbitmq_password: string;
  // private rabbitmq_k8s_service: string;
  // private rabbitmq_k8s_service_port: number;

  constructor(connection: amqp.Connection, exchange: string, routingKey: string) {
    // Initialize properties 
    this.connection = connection; 
    this.exchange   = exchange;
    this.routingKey = routingKey;
    // this.rabbitmq_username          = rabbitmq_username;
    // this.rabbitmq_password          = rabbitmq_password;
    // this.rabbitmq_k8s_service       = rabbitmq_k8s_service;
    // this.rabbitmq_k8s_service_port  = rabbitmq_k8s_service_port;
  }

  // async createConnection(): Promise<void> {
  //   try {
  //     console.log('Connection does not exist, need to create a new one!');
  //     const rabbitmqUrl = `amqp://${this.rabbitmq_username}:${this.rabbitmq_password}@${this.rabbitmq_k8s_service}:${this.rabbitmq_k8s_service_port}`;
  //     this.connection = await amqp.connect(rabbitmqUrl);  
  //   } catch (err) {
  //     console.log('Error while executing createConnection() method: ', err);
  //   }
  // }

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
      console.log('Closing the RabbitMQ connection!');
      if (this.channel) {
        await this.channel.close();
      }
      // if (this.connection) {
      //   await this.connection.close();
      // }     
    } catch (err) {
      console.log('Error while closing the RabbitMQ channel: ', err);
    }
  }

  publish(data: T['data']): Promise<void> {
    return new Promise(async (resolve, reject) => {
      try {
        // if (!this.connection) {
        //   await this.createConnection();
        // }
        if (!this.channel) {
          await this.openChannel();
        }
        this.channel!.publish(this.exchange, this.routingKey, Buffer.from(JSON.stringify(data)));
        console.log(`[x] Sent Event ${this.routingKey}: ${JSON.stringify(data)}`);
        resolve();
      } catch (err) {
        console.log('Error while executing publish() method: ', err);
        reject(err);
      }
    });
  }

}
