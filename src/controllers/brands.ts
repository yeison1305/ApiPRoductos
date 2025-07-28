import { Request, Response } from 'express';
import { BrandModel } from '../models/brands';

export const getBrands = async (req: Request, res: Response) => {
  try {
    const brands = await BrandModel.getAll();
    res.status(200).json(brands);
  } catch (error) {
    res.status(500).json({
      msg: 'Error al obtener marcas',
      error: String(error),
    });
  }
};