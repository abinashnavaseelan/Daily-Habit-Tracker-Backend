import th from "zod/v4/locales/th.js";
import { ProductDocument, ProductModel } from "../models/product.model";
import { CreateProductTypeZ } from "../schemas/product.schemas";
import { ListResult, ProductListRequest } from "../types/query.types";
import { AppError } from "../utils/app.error";
import {
  buildSearchQuery,
  parseBoolean,
  parseProjection,
  parseSort,
} from "../utils/query.utils";
const allowedSortFields = [
  "createdAt",
  "price",
  "name",
  "stock",
  "updatedAt",
] as const;

const allowedProjectionFields = [
  "_id",
  "name",
  "price",
  "description",
  "stock",
  "category",
  "createdAt",
  "updatedAt",
] as const;

const allowedSearchFields = ["name", "description", "category"] as const;

export const createProductService = async (
  name: string,
  price: number,
  description: string,
  stock: number,
  category: string,
) => {
  const existingProduct = await ProductModel.findOne({ name });
  if (existingProduct) {
    throw new Error("Product with this name already exists");
  }

  const newProduct: ProductDocument = {
    name,
    price,
    description: "",
    stock: 0,
    category: "",
  };

  const created = await ProductModel.create(newProduct);
  return created;
};

export const findAllProductsService = async (
  params: ProductListRequest,
): Promise<ListResult<ProductDocument>> => {
  const {
    limit,
    category,
    page,
    fields,
    minPrice,
    maxPrice,
    inStock,
    search,
    sort,
  } = params;

  const filters: Record<string, unknown> = {};

  if (category) filters.category = category;

  const priceFilter: Record<string, number> = {};
  if (minPrice) {
    const parsed = Number(minPrice);
    if (!Number.isNaN(parsed)) priceFilter.$gte = parsed;
  }
  if (maxPrice) {
    const parsed = Number(maxPrice);
    if (!Number.isNaN(parsed)) priceFilter.$lte = parsed;
  }
  if (Object.keys(priceFilter).length > 0) filters.price = priceFilter;

  const inStockBool = parseBoolean(inStock);
  if (inStockBool !== undefined) {
    filters.stock = inStockBool ? { $gt: 0 } : { $lte: 0 };
  }

  const searchQuery = buildSearchQuery(search, [...allowedSearchFields]);
  const query: Record<string, unknown> = { ...filters, ...(searchQuery ?? {}) };

  const sortBy = parseSort(sort, [...allowedSortFields], "-createdAt");
  const projection = parseProjection(fields, [...allowedProjectionFields]);

  const skip = (page - 1) * limit;

  const findQuery = ProductModel.find(query)
    .sort(sortBy)
    .skip(skip)
    .limit(limit);
  if (projection) findQuery.select(projection);

  const [data, total] = await Promise.all([
    findQuery.exec(),
    ProductModel.countDocuments(query),
  ]);

  const totalPages = Math.ceil(total / limit) || 1;

  return {
    data,
    meta: {
      total,
      page,
      limit,
      totalPages,
    },
  };
};

export const updateProductById = async (
  id: string,
  updateData: Partial<CreateProductTypeZ>,
) => {
  const updatedProduct = await ProductModel.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });

  if (!updatedProduct) {
    throw new AppError("Product with the provided ID could not be found", 404);
  }
  return updatedProduct;
};

export const deleteProductService = async (id: string) => {
  const productToDelete = await ProductModel.findById(id);

  if (!productToDelete) {
    return { message: "Product not found" };
  }

  await ProductModel.findByIdAndDelete(productToDelete._id);
  return productToDelete;
};
