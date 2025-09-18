// backend/routes/companies.js
import express from "express";
import Company from "../models/Company.js";
import { requireAuth, requireAdmin } from "../middleware/auth.js";

const router = express.Router();

/* helper: search query */
function buildSearchQuery(search) {
  if (!search) return {};
  return { name: { $regex: search, $options: "i" } };
}

/**
 * POST /api/companies
 * - User: creates as PENDING (goes to admin for approval)
 * - Admin: creates as APPROVED
 */
router.post("/", requireAuth, async (req, res) => {
  try {
    const { name, rounds = [], year, college } = req.body || {};
    if (!name || !String(name).trim())
      return res.status(400).json({ msg: "Name is required" });

    // sanitize year
    let yr = undefined;
    if (year !== undefined && year !== null && String(year).trim() !== "") {
      const y = parseInt(year, 10);
      const current = new Date().getFullYear() + 1; // allow next year
      if (isNaN(y) || y < 2000 || y > current) {
        return res.status(400).json({ msg: "Year must be between 2000 and " + current });
      }
      yr = y;
    }

    const doc = await Company.create({
      name: String(name).trim(),
      rounds: Array.isArray(rounds) ? rounds : [],
      status: "pending",                 // stays pending until admin approves
      createdBy: req.user.id,
      year: yr,
      college: (college || "").trim() || undefined,
    });

    res.status(201).json({
      msg: "Submitted for approval",
      company: { ...doc.toObject(), roundsCount: doc.rounds?.length || 0 },
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ msg: "Server error" });
  }
});
/**
 * GET /api/companies
 * - Admin: can filter by status (?status=pending/approved/rejected) and search
 * - User: sees ONLY APPROVED (public).  👈 IMPORTANT
 */
router.get("/", requireAuth, async (req, res) => {
  try {
    const { search = "", status } = req.query;
    const searchQ = buildSearchQuery(search);
    let query = {};

    if (req.user.role === "admin") {
      if (status && ["pending", "approved", "rejected"].includes(status)) {
        query = { ...searchQ, status };
      } else {
        query = { ...searchQ };
      }
    } else {
      // Non-admin users get ONLY approved companies in the public list
      query = { ...searchQ, status: "approved" };
    }

    const items = await Company.find(query).sort({ createdAt: -1 }).lean();
    const withCounts = items.map((c) => ({ ...c, roundsCount: c.rounds?.length || 0 }));
    return res.json(withCounts);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ msg: "Server error" });
  }
});

/**
 * GET /api/companies/mine
 * - User’s own submissions (any status)
 */
router.get("/mine", requireAuth, async (req, res) => {
  try {
    const { search = "" } = req.query;
    const items = await Company.find({
      ...buildSearchQuery(search),
      createdBy: req.user.id,
    })
      .sort({ createdAt: -1 })
      .lean();

    const withCounts = items.map((c) => ({ ...c, roundsCount: c.rounds?.length || 0 }));
    return res.json(withCounts);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ msg: "Server error" });
  }
});

/**
 * GET /api/companies/pending  (ADMIN)
 */
router.get("/pending", requireAuth, requireAdmin, async (req, res) => {
  try {
    const { search = "" } = req.query;
    const items = await Company.find({ ...buildSearchQuery(search), status: "pending" })
      .sort({ createdAt: -1 })
      .populate("createdBy", "name email")
      .lean();

    const withCounts = items.map((c) => ({ ...c, roundsCount: c.rounds?.length || 0 }));
    return res.json(withCounts);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ msg: "Server error" });
  }
});

/**
 * GET /api/companies/:id
 * - Admin: can open anything
 * - User: can open APPROVED; can open own even if pending/rejected (owner visibility)
 *   (Agar aap owner ko bhi block karna chahte hain pending me, batana — us hisab se 403 kar denge.)
 */
router.get("/:id", requireAuth, async (req, res) => {
  try {
    const c = await Company.findById(req.params.id).lean();
    if (!c) return res.status(404).json({ msg: "Not found" });

    const isOwner = String(c.createdBy) === String(req.user.id);
    if (req.user.role !== "admin") {
      if (c.status !== "approved" && !isOwner) {
        return res.status(403).json({ msg: "Not allowed" });
      }
    }
    return res.json({ ...c, roundsCount: c.rounds?.length || 0 });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ msg: "Server error" });
  }
});

/**
 * PATCH /api/companies/:id/approve   (ADMIN)
 */
router.patch("/:id/approve", requireAuth, requireAdmin, async (req, res) => {
  try {
    const c = await Company.findByIdAndUpdate(
      req.params.id,
      { $set: { status: "approved", rejectionReason: "" } },
      { new: true }
    ).lean();
    if (!c) return res.status(404).json({ msg: "Not found" });
    return res.json({ msg: "Approved", company: { ...c, roundsCount: c.rounds?.length || 0 } });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ msg: "Server error" });
  }
});

/**
 * PATCH /api/companies/:id/reject   (ADMIN)
 * body: { reason?: string }
 */
router.patch("/:id/reject", requireAuth, requireAdmin, async (req, res) => {
  try {
    const { reason = "" } = req.body || {};
    const c = await Company.findByIdAndUpdate(
      req.params.id,
      { $set: { status: "rejected", rejectionReason: reason } },
      { new: true }
    ).lean();
    if (!c) return res.status(404).json({ msg: "Not found" });
    return res.json({ msg: "Rejected", company: { ...c, roundsCount: c.rounds?.length || 0 } });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ msg: "Server error" });
  }
});

/**
 * DELETE /api/companies/:id   (ADMIN)
 */
router.delete("/:id", requireAuth, requireAdmin, async (req, res) => {
  try {
    const c = await Company.findByIdAndDelete(req.params.id).lean();
    if (!c) return res.status(404).json({ msg: "Not found" });
    return res.json({ msg: "Deleted" });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ msg: "Server error" });
  }
});

export default router;
