export const EBP_Images_CDN_BaseUrl = "https://d1vstek0gf8y4r.cloudfront.net/";

export const getObjectKeyFromUrl = (cdnUrl: string, imageUrl: string) => {
  if (imageUrl) {
    return imageUrl?.substring(imageUrl?.indexOf(cdnUrl) + cdnUrl.length);
  }
  return "";
};
