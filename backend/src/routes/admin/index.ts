import { Router } from "express";
import authRouter from "./auth.js";
import {
  faqRouter,
  logosRouter,
  teamRouter,
  testimonialsRouter,
} from "./content.js";
import dashboardRouter from "./dashboard.js";
import leadsRouter from "./leads.js";
import projectsRouter from "./projects.js";
import postsRouter from "./posts.js";
import servicesRouter from "./services.js";
import settingsRouter from "./settings.js";
import siteContentRouter from "./siteContent.js";
import uploadRouter from "./upload.js";

const router = Router();

router.use(authRouter);
router.use("/dashboard", dashboardRouter);
router.use("/projects", projectsRouter);
router.use("/posts", postsRouter);
router.use("/services", servicesRouter);
router.use("/testimonials", testimonialsRouter);
router.use("/team", teamRouter);
router.use("/logos", logosRouter);
router.use("/faq", faqRouter);
router.use("/site-content", siteContentRouter);
router.use("/leads", leadsRouter);
router.use("/settings", settingsRouter);
router.use("/upload", uploadRouter);

export default router;
