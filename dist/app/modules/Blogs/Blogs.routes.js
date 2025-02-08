"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogRoutes = void 0;
const express_1 = __importDefault(require("express"));
const Blogs_controller_1 = require("./Blogs.controller");
const router = express_1.default.Router();
router.post("/", Blogs_controller_1.BlogControllers.createBlog);
router.patch("/:blogId", Blogs_controller_1.BlogControllers.updateBlog);
router.get("/:blogId", Blogs_controller_1.BlogControllers.getSingleBlogById);
router.get("/", Blogs_controller_1.BlogControllers.getBlogsByQuery);
router.delete("/:blogId", Blogs_controller_1.BlogControllers.deleteBlog);
exports.BlogRoutes = router;
