import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ErrorResponse } from '../../../commom/response/errorResponse';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) { }

  @Post()
  async create(@Body() createProductDto: CreateProductDto) {
    try {
      return await this.productService.create(createProductDto);

    } catch (error) {
      throw new ErrorResponse(error)
    }

  }

  @Get()
  async findAll() {
    try {
      return await this.productService.findAll();

    } catch (error) {
      throw new ErrorResponse(error)
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      return await this.productService.findOne(+id);

    } catch (error) {
      throw new ErrorResponse(error)
    }
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    try {
      return await this.productService.update(+id, updateProductDto);

    } catch (error) {
      throw new ErrorResponse(error)
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      return await this.productService.remove(+id);

    } catch (error) {
      throw new ErrorResponse(error)
    }
  }
}
