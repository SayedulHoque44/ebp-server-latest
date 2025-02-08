"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const arguments_routes_1 = require("../modules/Arguments/arguments.routes");
const Blogs_routes_1 = require("../modules/Blogs/Blogs.routes");
const QNAPdf_routes_1 = require("../modules/QNAPdf/QNAPdf.routes");
const user_routes_1 = require("../modules/User/user.routes");
const courseTime_routes_1 = require("../modules/courseTime/courseTime.routes");
const quizImage_routes_1 = require("../modules/QuizImage/quizImage.routes");
const argTopics_routes_1 = require("../modules/ArgTopics/argTopics.routes");
const topicQuizzes_routes_1 = require("../modules/TopicQuizzes/topicQuizzes.routes");
const YTVideo_routes_1 = require("../modules/YTVideo/YTVideo.routes");
const UniContent_routes_1 = require("../modules/UniContent/UniContent.routes");
const FileUplodeOperation_1 = require("../modules/FileUplodeOperation");
const words_routes_1 = require("../modules/words/words.routes");
const system_routes_1 = require("../modules/system/system.routes");
const router = (0, express_1.Router)();
const moduleRoutes = [
    {
        path: "/users",
        route: user_routes_1.userRoutes,
    },
    {
        path: "/courseTimes",
        route: courseTime_routes_1.courseTimeRoutes,
    },
    {
        path: "/QNAPdf",
        route: QNAPdf_routes_1.QNAPdfRoutes,
    },
    {
        path: "/blogs",
        route: Blogs_routes_1.BlogRoutes,
    },
    {
        path: "/quizImages",
        route: quizImage_routes_1.QuizImagesRoutes,
    },
    {
        path: "/arguments",
        route: arguments_routes_1.argumentsRoutes,
    },
    {
        path: "/argTopics",
        route: argTopics_routes_1.argTopicRoutes,
    },
    {
        path: "/Quizzes",
        route: topicQuizzes_routes_1.topicQuizzes,
    },
    {
        path: "/YTVideo",
        route: YTVideo_routes_1.YTVideoRoutes,
    },
    // {
    //   path: "/trucchi",
    //   route: trucchiRoutes,
    // },
    // {
    //   path: "/stdNote",
    //   route: stdNoteRoutes,
    // },
    {
        path: "/UniContent",
        route: UniContent_routes_1.UniContentRoutes,
    },
    {
        path: "/media",
        route: FileUplodeOperation_1.mediaRoutes,
    },
    {
        path: "/words",
        route: words_routes_1.wordsRoutes,
    },
    {
        path: "/system",
        route: system_routes_1.systemRoutes,
    },
];
moduleRoutes.forEach(route => router.use(route.path, route.route));
exports.default = router;
