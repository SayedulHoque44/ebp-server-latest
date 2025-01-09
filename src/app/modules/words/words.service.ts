import httpStatus from "http-status";
import AppError from "../../error/AppError";
import { TWords } from "./words.interface";
import { WordsModel } from "./words.model";
import https from "https";

// translate create word
const translateCreateWord = async (payload: TWords) => {
  if (payload.sourceLang !== "it" || payload.translatedLang !== "bn") {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "For now only Italian to Bangla translation is supported",
    );
  }

  // Check if the word already exists
  const existingWord = await WordsModel.findOne({
    sourceWords: payload.sourceWords,
    sourceLang: payload.sourceLang,
    translatedLang: payload.translatedLang,
  });

  if (existingWord) {
    return existingWord;
  }

  if (payload.sourceWords && payload.sourceLang && payload.translatedLang) {
    const options = {
      method: "POST",
      hostname: "deep-translate1.p.rapidapi.com",
      path: "/language/translate/v2",
      headers: {
        "x-rapidapi-key": "32ac7b8134mshefbf35d78a8c3d7p109611jsn074ba77adde0",
        "x-rapidapi-host": "deep-translate1.p.rapidapi.com",
        "Content-Type": "application/json",
      },
    };

    try {
      const translated: any = await new Promise((resolve, reject) => {
        const translationReq = https.request(options, apiRes => {
          let data = "";

          apiRes.on("data", (chunk: string) => {
            data += chunk;
          });

          apiRes.on("end", () => {
            try {
              const response = JSON.parse(data);

              resolve(response);
            } catch (error) {
              reject(
                new AppError(
                  httpStatus.BAD_GATEWAY,
                  "Failed to parse translation response",
                ),
              );
            }
          });
        });

        // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, no-unused-vars
        translationReq.on("error", (err: any) => {
          reject(
            new AppError(
              httpStatus.BAD_GATEWAY,
              "Failed to connect to the translation service",
            ),
          );
        });

        translationReq.write(
          JSON.stringify({
            q: payload.sourceWords,
            source: payload.sourceLang,
            target: payload.translatedLang,
          }),
        );

        translationReq.end();
      });

      // console.log({translated:translated.data.translations.translatedText});
      // Save the new word to the database

      if (translated?.data?.translations?.translatedText) {
        const createdWord = await WordsModel.create({
          sourceWords: payload.sourceWords,
          sourceLang: payload.sourceLang,
          translated: translated.data.translations.translatedText,
          translatedLang: payload.translatedLang,
        });
        return createdWord;
      } else {
        throw new Error("Failed to translate the word 1");
      }
    } catch (error: any) {
      throw new AppError(httpStatus.BAD_REQUEST, error.message);
    }

    // return createdWord;
  } else {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Please provide all the required fields: sourceWords, sourceLang, and translatedLang are required.",
    );
  }
};

// create word
const createWord = async (payload: TWords) => {
  const exitsWord = await WordsModel.findOne({ word: payload.sourceWords });

  //   if already exits
  if (exitsWord) {
    return exitsWord;
  }

  //   if not exits and need to create the need to check the required fields
  if (
    payload.sourceWords &&
    payload.sourceLang &&
    payload.translated &&
    payload.translatedLang
  ) {
    return await WordsModel.create(payload);
  } else {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Please provide all the required fields",
    );
  }
};

export const WordsService = {
  createWord,
  translateCreateWord,
};
