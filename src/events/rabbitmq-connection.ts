import amqp from 'amqplib';

export const rabbitmqConnection = async (rabbitmqUsername: string, rabbitmqPassword: string, rabbitmqService: string, rabbitmqServicePort: number) => {
    try {
        console.log('Creating a new RabbitMQ connection!');
        const rabbitmqUrl = `amqp://${rabbitmqUsername}:${rabbitmqPassword}@${rabbitmqService}:${rabbitmqServicePort}`;
        console.log('Connection URL: ', rabbitmqUrl);
        const connection = await amqp.connect(rabbitmqUrl);
        console.log('Connection Object: ', connection);
        return connection;
    } catch (err) {
        console.log('Error while creating a new RabbitMQ connection: ', err);
    }
}

// export abstract class Connection {
//     private connection: amqp.Connection | null = null;
//     private rabbitmqUsername: string;
//     private rabbitmqPassword: string;
//     private rabbitmqService: string;
//     private rabbitmqServicePort: number;
  
//     constructor(rabbitmqUsername: string, rabbitmqPassword: string, rabbitmqService: string, rabbitmqServicePort: number) {
//       // Initialize properties  
//       this.rabbitmqUsername     = rabbitmqUsername;
//       this.rabbitmqPassword     = rabbitmqPassword;
//       this.rabbitmqService      = rabbitmqService;
//       this.rabbitmqServicePort  = rabbitmqServicePort;
//     }
  
//     async createConnection(): Promise<void> {
//         try {
//             console.log('Creating a new RabbitMQ connection!');
//             const rabbitmqUrl = `amqp://${this.rabbitmqUsername}:${this.rabbitmqPassword}@${this.rabbitmqService}:${this.rabbitmqServicePort}`;
//             this.connection = await amqp.connect(rabbitmqUrl);
//             // return connection;
//         } catch (err) {
//             console.log('Error while creating a new RabbitMQ connection: ', err);
//         }
//     }
  
//     async closeConnection(): Promise<void> {
//         try {
//             if (this.connection) {
//             await this.connection.close();
//             }     
//         } catch (err) {
//             console.log('Error while closing the RabbitMQ connection: ', err);
//         }
//     }  
// }