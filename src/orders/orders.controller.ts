import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Inject,
  ParseUUIDPipe,
  Query,
  Patch,
} from '@nestjs/common';

import { ORDER_SERVICE } from 'src/config';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { CreateOrderDto, OrderPaginationDto, StatusDto } from './dto';
import { PaginationDto } from 'src/common';

@Controller('orders')
export class OrdersController {
  constructor(
    @Inject(ORDER_SERVICE) private readonly ordersClient: ClientProxy,
  ) {}

  @Post('create')
  async create(@Body() createOrderDto: CreateOrderDto) {
    try {
      return await firstValueFrom(
        this.ordersClient.send('createOrder', createOrderDto),
      );
    } catch (error) {
      throw new RpcException(error);
    }
    // return this.ordersService.create(createOrderDto);
  }

  @Get('all')
  async findAll(@Query() orderPaginationDto: OrderPaginationDto) {
    try {
      // return orderPaginationDto
      return await firstValueFrom(
        this.ordersClient.send('findAllOrders', orderPaginationDto),
      );
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @Get('id/:id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    try {
      return await firstValueFrom(
        this.ordersClient.send('findOneOrder', { id }),
      );
    } catch (error) {
      throw new RpcException(error);
    }
  }
  @Get(':status')
  async findAllByStatus(
    @Param() statusDto: StatusDto,
    @Query() paginationDto: PaginationDto,
  ) {
    try {
      //*Opcion 1
      return this.ordersClient.send('findAllOrders', {
        ...paginationDto,
        status: statusDto.status,
      });

      //*Opcion 2
      return await firstValueFrom(
        this.ordersClient.send('findAllOrders', {
          ...paginationDto,
          status: statusDto.status,
        }),
      );
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @Patch(':id')
  changeStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() statusDto: StatusDto,
  ) {
    try {
      return this.ordersClient.send('changeOrderStatus', {
        id,
        status: statusDto.status,
      });
    } catch (error) {
      throw new RpcException(error);
    }
  }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   // return this.ordersService.remove(+id);
  // }
}
