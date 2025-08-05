import { Router } from "express";
import { argumentsRoutes } from "../modules/Arguments/arguments.routes";
import { BlogRoutes } from "../modules/Blogs/Blogs.routes";
import { QNAPdfRoutes } from "../modules/QNAPdf/QNAPdf.routes";
import { userRoutes } from "../modules/User/user.routes";
import { courseTimeRoutes } from "../modules/courseTime/courseTime.routes";
import { QuizImagesRoutes } from "../modules/QuizImage/quizImage.routes";
import { argTopicRoutes } from "../modules/ArgTopics/argTopics.routes";
import { topicQuizzes } from "../modules/TopicQuizzes/topicQuizzes.routes";
import { YTVideoRoutes } from "../modules/YTVideo/YTVideo.routes";
import { UniContentRoutes } from "../modules/UniContent/UniContent.routes";
import { mediaRoutes } from "../modules/FileUplodeOperation";
import { wordsRoutes } from "../modules/words/words.routes";
import { systemRoutes } from "../modules/system/system.routes";

const router = Router();

const moduleRoutes = [
  {
    path: "/users",
    route: userRoutes,
  },
  {
    path: "/courseTimes",
    route: courseTimeRoutes,
  },
  {
    path: "/QNAPdf",
    route: QNAPdfRoutes,
  },
  {
    path: "/blogs",
    route: BlogRoutes,
  },
  {
    path: "/quizImages",
    route: QuizImagesRoutes,
  },
  {
    path: "/arguments",
    route: argumentsRoutes,
  },
  {
    path: "/argTopics",
    route: argTopicRoutes,
  },
  {
    path: "/Quizzes",
    route: topicQuizzes,
  },
  // {
  //   path: "/YTVideo",
  //   route: YTVideoRoutes,
  // },
  {
    path: "/UniContent",
    route: UniContentRoutes,
  },
  {
    path: "/media",
    route: mediaRoutes,
  },
  {
    path: "/words",
    route: wordsRoutes,
  },
  {
    path: "/system",
    route: systemRoutes,
  },
];

moduleRoutes.forEach(route => router.use(route.path, route.route));

export default router;
