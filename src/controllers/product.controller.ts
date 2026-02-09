import type { NextFunction, Request, Response } from "express";
import * as productService from "../services/product.services";
import { CreateProductTypeZ } from "../schemas/product.schemas";
import {
  capLimit,
  DEFAULT_LIMIT,
  DEFAULT_PAGE,
  toPositiveInt,
} from "../utils/query.utils";
import { ProductListQueryParams } from "../types/query.types";

export const createProduct = async (
  req: Request<{}, {}, CreateProductTypeZ>,
  res: Response,
) => {
  try {
    const { name, price, description, stock, category } = req.body;

    const newProduct = await productService.createProductService(
      name,
      price,
      description,
      stock,
      category,
    );

    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ message: "Error creating product", error });
  }
};

export const getProductById = (req: Request, res: Response) => {
  const productId = req.params.id;
  res.json({ id: productId });
};

export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const {
      page: pageParam,
      limit: limitParam,
      sort,
      fields,
      search,
      category,
      minPrice,
      maxPrice,
      inStock,
    } = req.query as ProductListQueryParams;

    const page = toPositiveInt(pageParam, DEFAULT_PAGE);
    const limit = capLimit(toPositiveInt(limitParam, DEFAULT_LIMIT));
    const options = {
      page,
      limit,
      sort,
      fields,
      search,
      category,
      minPrice,
      maxPrice,
      inStock,
    };
    const products = await productService.findAllProductsService(options);
    res.status(200).json({ products });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving products", error });
  }
};

export const updateProductById = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const changedProduct = await productService.updateProductById(
      req.params.id,
      req.body,
    );
    res.status(200).json(changedProduct);
  } catch (error) {
    next(error);
  }
};

export const deleteProductById = async (req: Request, res: Response) => {
  const productId = req.params.id as string;
  const product = await productService.deleteProductService(productId);

  res.json(product);
};
