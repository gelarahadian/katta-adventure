import type { Request, Response } from "express";

import { adminService } from "./admin.service.js";

export async function getAdminOverview(_request: Request, response: Response) {
  const result = await adminService.getOverview();
  response.status(200).json(result);
}
