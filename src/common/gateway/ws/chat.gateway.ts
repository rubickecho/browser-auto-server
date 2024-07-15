import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect, ConnectedSocket } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';

@WebSocketGateway(9527, {
  cors: {
    origin: '*',
  },
  namespace: 'task'
  // path: '/ws/v1/task'
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  // 处理消息
  @SubscribeMessage('privateMessage')
  handlePrivateMessage(@MessageBody() data: { recipientId: string; message: string }, @ConnectedSocket() client: Socket): void {
    // data 包含 recipientId 和 message
    // recipientId 是接收消息的客户端 ID
    // message 是要发送的消息内容

    // 使用 server.to(recipientId).emit(...) 向特定客户端发送消息
    this.server.to(data.recipientId).emit('privateMessage', { from: client.id, message: data.message });
  }

  @SubscribeMessage('Ready')
  onClientReady(@ConnectedSocket() client: Socket): void {
    // 客户端发送 "Ready" 事件后，开始每隔 30 秒向该客户端发送消息
    const intervalId = setInterval(() => {
      client.emit('message', { message: '这是定时发送的消息' });
    }, 30000);

    // 当客户端断开连接时，清除定时器
    client.on('disconnect', () => {
      clearInterval(intervalId);
    });
  }

  // 处理新的连接
  handleConnection(client: Socket, ...args: any[]): void {
    console.log(`客户端连接: ${client.id}`);
    // 这里可以添加自定义逻辑
  }

  // 处理断开连接
  handleDisconnect(client: Socket): void {
    console.log(`客户端断开连接: ${client.id}`);
    // 这里可以添加自定义逻辑
  }
}
