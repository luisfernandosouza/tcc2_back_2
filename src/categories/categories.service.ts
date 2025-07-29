import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Categoria, Prisma } from '@prisma/client';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  /**
   * Creates a new category.
   * @param data The data for the new category.
   * @returns The created category.
   */
  async create(data: CreateCategoryDto): Promise<Categoria> {
    // Prisma.CategoriaCreateInput is automatically compatible with CreateCategoryDto
    return this.prisma.categoria.create({ data });
  }

  /**
   * Finds all categories.
   * @returns A list of all categories.
   */
  async findAll(): Promise<Categoria[]> {
    return this.prisma.categoria.findMany();
  }

  /**
   * Finds a category by its unique ID.
   * @param id The ID of the category.
   * @returns The found category or throws NotFoundException.
   */
  async findOne(id: string): Promise<Categoria> {
    const category = await this.prisma.categoria.findUnique({
      where: { id },
    });
    if (!category) {
      throw new NotFoundException(`Categoria com ID "${id}" não encontrada.`);
    }
    return category;
  }

  /**
   * Updates an existing category.
   * @param id The ID of the category to update.
   * @param data The data to update.
   * @returns The updated category.
   */
  async update(id: string, data: UpdateCategoryDto): Promise<Categoria> {
    try {
      return await this.prisma.categoria.update({
        where: { id },
        data, // Prisma.CategoriaUpdateInput is automatically compatible with UpdateCategoryDto
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new NotFoundException(`Categoria com ID "${id}" não encontrada para atualização.`);
      }
      throw error; // Re-throw other errors
    }
  }

  /**
   * Deletes a category by its ID.
   * @param id The ID of the category to delete.
   * @returns The deleted category.
   */
  async remove(id: string): Promise<Categoria> {
    try {
      return await this.prisma.categoria.delete({
        where: { id },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new NotFoundException(`Categoria com ID "${id}" não encontrada para exclusão.`);
      }
      throw error;
    }
  }
}