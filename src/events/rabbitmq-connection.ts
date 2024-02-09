import amqp from 'amqplib';

export const openRabbitMQConnection = async (rabbitmqUsername: string, rabbitmqPassword: string, rabbitmqService: string, rabbitmqServicePort: number) => {
    try {
        console.log('Creating a new RabbitMQ connection!');
        const rabbitmqUrl = `amqp://${rabbitmqUsername}:${rabbitmqPassword}@${rabbitmqService}:${rabbitmqServicePort}`;
        const connection = await amqp.connect(rabbitmqUrl);
        return connection;
    } catch (err) {
        console.log('Error while creating a new RabbitMQ connection: ', err);
    }
}

export const closeRabbitMQConnection = async (connection: amqp.Connection) => {
    try {
        console.log('Closing the RabbitMQ connection!');
        await connection.close();     
      } catch (err) {
        console.log('Error while closing the RabbitMQ connection: ', err);
      }
}