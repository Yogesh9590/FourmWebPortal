
import { Request, Response, NextFunction } from "express";

export let defaultRoute = (req: Request, res: Response) => {
  res.json({
    message: 'This is default Route.....'
  })
};

