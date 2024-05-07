import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from 'src/typeorm/entities/order.entity';
import { AuthModule } from 'src/auth/auth.module';
import { OrderItem } from 'src/typeorm/entities/order-item.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Order, OrderItem]), AuthModule],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
