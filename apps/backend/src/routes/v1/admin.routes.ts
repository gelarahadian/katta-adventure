import { Router } from "express";

import { asyncHandler } from "../../lib/async-handler.js";
import { getAdminOverview } from "../../modules/admin/admin.controller.js";

export const adminRouter = Router();

adminRouter.get("/overview", asyncHandler(getAdminOverview));
