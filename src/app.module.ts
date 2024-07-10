// app.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Order } from './typeorm/entities/order.entity';
import { OrderItem } from './typeorm/entities/order-item.entity';
import { OrdersModule } from './orders/orders.module';
import { AuthModule } from './auth/auth.module'; // AuthModule importieren
import { configValiationSchema } from './config.schema';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`.env.${process.env.STAGE}.local`],
      validationSchema: configValiationSchema,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        ssl: config.get('STAGE') === 'production',
        extra: {
          ssl:
            config.get('STAGE') === 'production'
              ? { rejectUnauthorized: false }
              : null,
        },
        type: 'postgres',
        autoLoadEntities: true,
        synchronize: true,
        url: config.get('DATABASE_URL'),
        host: config.get('DATABASE_HOST'),
        port: config.get('DATABASE_PORT'),
        username: config.get('DATABASE_USERNAME'),
        password: config.get('DATABASE_PASSWORD'),
        database: config.get('DATABASE_NAME'),
        entities: [Order, OrderItem],
      }),
    }),
    OrdersModule,
    AuthModule, // AuthModule hier importieren
  ],
  controllers: [],
  providers: [], // Keine Strategies direkt im AppModule als Provider hinzufügen
})
export class AppModule {}
