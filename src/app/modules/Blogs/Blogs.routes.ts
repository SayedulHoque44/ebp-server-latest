import express from "express";
import { BlogControllers } from "./Blogs.controller";
const router = express.Router();

router.post("/", BlogControllers.createBlog);
router.patch("/:blogId", BlogControllers.updateBlog);
router.get("/:blogId", BlogControllers.getSingleBlogById);
router.get("/", BlogControllers.getBlogsByQuery);
router.delete("/:blogId", BlogControllers.deleteBlog);

export const BlogRoutes = router;
