"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getObjectKeyFromUrl = exports.EBP_Images_CDN_BaseUrl = void 0;
exports.EBP_Images_CDN_BaseUrl = "https://d1vstek0gf8y4r.cloudfront.net/";
const getObjectKeyFromUrl = (cdnUrl, imageUrl) => {
    if (imageUrl) {
        return imageUrl === null || imageUrl === void 0 ? void 0 : imageUrl.substring((imageUrl === null || imageUrl === void 0 ? void 0 : imageUrl.indexOf(cdnUrl)) + cdnUrl.length);
    }
    return "";
};
exports.getObjectKeyFromUrl = getObjectKeyFromUrl;
