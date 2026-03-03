import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { Connection } from 'mongoose';
import { BrandModule } from './brand/brand.module';
import { BrandController } from './brand/brand.controller';
import { BrandService } from './brand/brand.service';
import { CategoryModule } from './category/category.module';
import { CategoryController } from './category/category.controller';
import { CategoryService } from './category/category.service';
import { ProductModule } from './product/product.module';
import { ProductController } from './product/product.controller';
import { ProductService } from './product/product.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    BrandModule,
    CategoryModule,
    ProductModule,
    MongooseModule.forRoot(process.env.MODGODB_URI as string, {
      onConnectionCreate: (connection: Connection) => {
        connection.on('connected', () => console.log('connected'));
        connection.on('open', () => console.log('open'));
        connection.on('disconnected', () => console.log('disconnected'));
        connection.on('reconnected', () => console.log('reconnected'));
        connection.on('disconnecting', () => console.log('disconnecting'));

        return connection;
      },
    }),
  ],
  controllers: [
    AppController,
    BrandController,
    CategoryController,
    ProductController,
  ],
  providers: [AppService, BrandService, CategoryService, ProductService],
})
export class AppModule {}
