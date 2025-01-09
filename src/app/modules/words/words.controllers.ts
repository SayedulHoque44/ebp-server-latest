import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { WordsService } from "./words.service";

// create word
// const createdWord = catchAsync(async (req, res) => {
//   const wordData = req.body;
//   const createdWord = await WordsService.createWord(wordData);

//   sendResponse(res, {
//     statusCode: 201,
//     success: true,
//     message: "Translated Data retrive!",
//     data: createdWord,
//   });
// });
//translate create word
const translateCreateWord = catchAsync(async (req, res) => {
  const wordData = req.body;

  const createdWord = await WordsService.translateCreateWord(wordData);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Translated Data retrive!",
    data: createdWord,
  });
});

export const wordsControllers = {
  // createdWord,
  translateCreateWord,
};
