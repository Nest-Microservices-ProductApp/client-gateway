import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Inject,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PRODUCT_SERVICE } from 'src/config';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { PaginationDto } from 'src/common';
import { catchError, firstValueFrom } from 'rxjs';

@Controller('products')
export class ProductsController {
  constructor(
    @Inject(PRODUCT_SERVICE) private readonly productsClient: ClientProxy,
  ) {}

  @Post('create')
  async create(@Body() createProductDto: CreateProductDto) {
    try {
      return await firstValueFrom(
        this.productsClient.send({ cmd: 'create-product' }, createProductDto),
      );
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @Get('all')
  async findAll(@Query() paginationDto: PaginationDto) {
    return await firstValueFrom(
      this.productsClient.send(
        { cmd: 'all-product' },
        { limit: paginationDto.limit, page: paginationDto.page },
      ),
    );
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    // return this.productsClient.send({ cmd: 'find-one-product' }, { id }).pipe(
    //   catchError((err) => {
    //     throw new RpcException(err);
    //   }),
    // );

    try {
      return await firstValueFrom(
        this.productsClient.send({ cmd: 'find-one-product' }, { id }),
      );
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @Patch('edit/:id')
  async update(
    @Param('id',ParseIntPipe) id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    try {
      const product = await firstValueFrom(
        this.productsClient.send(
          { cmd: 'edit-product' },
          { id, ...updateProductDto },
        ),
      );
      return product;
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @Delete('delete/:id')
  async remove(@Param('id',) id: string) {
    console.log(id);
    
    try {
      return await firstValueFrom(
        this.productsClient.send({ cmd: 'delete-product' }, { id }),
      );

    } catch (error) {
      throw new RpcException(error);
    }
  }
}
