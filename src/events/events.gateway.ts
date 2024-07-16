import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect, ConnectedSocket } from '@nestjs/websockets';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Socket, Server } from 'socket.io';

const instructions = [
  "前往微博首页",
  "搜索关键词微博'AI'",
  "点击第一条搜索结果微博，查看详情",
  "评论这条微博'so coooool'，并点击评论按钮发送评论"
]

@WebSocketGateway({
  cors: {
    origin: '*'
  },
  path: '/v1/ws/task'
})
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
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

  @SubscribeMessage('ready')
  onClientReady(@MessageBody() data: { next: number }, @ConnectedSocket() client: Socket): void {
    client.emit('task', { message: instructions[0] });
  }

  @SubscribeMessage('next')
  onClientNext(@MessageBody() data: { next: number }, @ConnectedSocket() client: Socket): void {
    try {
      const next = data.next;
      if (next < 0 || next >= instructions.length) {
        throw new Error('Invalid instruction index');
      }
      client.emit('task', { message: instructions[data.next] });
    } catch (error) {
      client.emit('error', { message: error.message });
    }
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
