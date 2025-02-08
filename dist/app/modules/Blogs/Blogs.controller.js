"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogControllers = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const Blogs_service_1 = require("./Blogs.service");
const createBlog = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const createdBlog = yield Blogs_service_1.BlogServices.createBlogIntoDB(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 201,
        success: true,
        message: "Blog created Successfully!",
        data: createdBlog,
    });
}));
const updateBlog = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const updatedBlog = yield Blogs_service_1.BlogServices.updateBlogIntoDB(req.params.blogId, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 201,
        success: true,
        message: "Blog updated Successfully!",
        data: updatedBlog,
    });
}));
const getSingleBlogById = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const blog = yield Blogs_service_1.BlogServices.getSingleBlogByIdFromDb(req.params.blogId);
    (0, sendResponse_1.default)(res, {
        statusCode: 201,
        success: true,
        message: "Blog retrive Successfully!",
        data: blog,
    });
}));
const getBlogsByQuery = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const blogs = yield Blogs_service_1.BlogServices.getBlogsQueryFromDb(req.query);
    (0, sendResponse_1.default)(res, {
        statusCode: 201,
        success: true,
        message: "Blogs are retrive Successfully!",
        data: blogs,
    });
}));
const deleteBlog = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
    const blog = yield Blogs_service_1.BlogServices.deleteBlogFromDB(req.params.blogId);
    (0, sendResponse_1.default)(res, {
        statusCode: 201,
        success: true,
        message: "Blog Deleted Successfully!",
        data: null,
    });
}));
exports.BlogControllers = {
    createBlog,
    updateBlog,
    getSingleBlogById,
    getBlogsByQuery,
    deleteBlog,
};
