import { Router } from "express";
import { authenticate, authorize } from "../../middleware/auth.js";
import { asyncHandler } from "../../utils/async-handler.js";
import { Complaint } from "../complaints/complaint.model.js";

const router = Router();
router.use(authenticate, authorize("admin"));

router.get("/overview", asyncHandler(async (_req, res) => {
  const activeComplaints = { archivedAt: null };
  const [byStatus, byCategory, totals] = await Promise.all([
    Complaint.aggregate([
      { $match: activeComplaints },
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]),
    Complaint.aggregate([
      { $match: activeComplaints },
      { $group: { _id: "$category", count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]),
    Complaint.aggregate([
      { $match: activeComplaints },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          overdue: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $lt: ["$deadline", new Date()] },
                    { $not: [{ $in: ["$status", ["resolved", "closed", "rejected"]] }] }
                  ]
                },
                1,
                0
              ]
            }
          }
        }
      }
    ])
  ]);

  res.json({
    success: true,
    data: { byStatus, byCategory, totals: totals[0] ?? { total: 0, overdue: 0 } }
  });
}));

export default router;
