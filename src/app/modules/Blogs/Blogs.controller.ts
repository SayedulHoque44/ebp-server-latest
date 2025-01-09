import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { BlogServices } from "./Blogs.service";

const createBlog = catchAsync(async (req, res) => {
  const createdBlog = await BlogServices.createBlogIntoDB(req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Blog created Successfully!",
    data: createdBlog,
  });
});

const updateBlog = catchAsync(async (req, res) => {
  const updatedBlog = await BlogServices.updateBlogIntoDB(
    req.params.blogId,
    req.body,
  );

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Blog updated Successfully!",
    data: updatedBlog,
  });
});

const getSingleBlogById = catchAsync(async (req, res) => {
  const blog = await BlogServices.getSingleBlogByIdFromDb(req.params.blogId);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Blog retrive Successfully!",
    data: blog,
  });
});

const getBlogsByQuery = catchAsync(async (req, res) => {
  const blogs = await BlogServices.getBlogsQueryFromDb(req.query);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Blogs are retrive Successfully!",
    data: blogs,
  });
});

const deleteBlog = catchAsync(async (req, res) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
  const blog = await BlogServices.deleteBlogFromDB(req.params.blogId);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Blog Deleted Successfully!",
    data: null,
  });
});

export const BlogControllers = {
  createBlog,
  updateBlog,
  getSingleBlogById,
  getBlogsByQuery,
  deleteBlog,
};
