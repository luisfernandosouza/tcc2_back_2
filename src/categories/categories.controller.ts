import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  HttpCode,
  ConflictException,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ApiTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';

@ApiTags('Categorias') // Groups endpoints in Swagger UI
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED) // Explicitly set 201 Created status
  @ApiOperation({ summary: 'Create a new category' })
  @ApiResponse({ status: 201, description: 'The category has been successfully created.' })
  @ApiResponse({ status: 400, description: 'Invalid input data.' })
  @ApiResponse({ status: 409, description: 'Category with this name already exists.' }) // For unique constraint errors
  async create(@Body() createCategoryDto: CreateCategoryDto) {
    try {
      return await this.categoriesService.create(createCategoryDto);
    } catch (error) {
      // Handle unique constraint error specifically if 'categoria' is unique
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new ConflictException('Uma categoria com este nome já existe.');
      }
      throw error;
    }
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all categories' })
  @ApiResponse({ status: 200, description: 'Returns all categories.' })
  findAll() {
    return this.categoriesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a category by ID' })
  @ApiResponse({ status: 200, description: 'Returns the category.' })
  @ApiResponse({ status: 404, description: 'Category not found.' })
  findOne(@Param('id') id: string) {
    return this.categoriesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an existing category' })
  @ApiResponse({ status: 200, description: 'The category has been successfully updated.' })
  @ApiResponse({ status: 404, description: 'Category not found.' })
  @ApiResponse({ status: 400, description: 'Invalid input data.' })
  update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
    return this.categoriesService.update(id, updateCategoryDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT) // Explicitly set 204 No Content status for successful deletion
  @ApiOperation({ summary: 'Delete a category by ID' })
  @ApiResponse({ status: 204, description: 'The category has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Category not found.' })
  remove(@Param('id') id: string) {
    return this.categoriesService.remove(id);
  }
}
