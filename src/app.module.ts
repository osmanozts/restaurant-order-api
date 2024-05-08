import { Module } from '@nestjs/common';
import { OrdersModule } from './orders/orders.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Order } from './typeorm/entities/order.entity';
import { AuthModule } from './auth/auth.module';
import { OrderItem } from './typeorm/entities/order-item.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`.env.${process.env.STAGE}.local`],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => {
        return {
          type: 'postgres',
          autoLoadEntities: true,
          synchronize: true,
          host: config.get('DATABASE_HOST'),
          port: config.get('DATABASE_PORT'),
          username: config.get('DATABASE_USERNAME'),
          password: config.get('DATABASE_PASSWORD'),
          database: config.get('DATABASE_NAME'),
          entities: [Order, OrderItem],
        };
      },
    }),
    OrdersModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
