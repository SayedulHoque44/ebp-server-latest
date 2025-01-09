export type TBlog = {
  title: string;
  imageUrl?: string;
  description: string;
  type: "Announcement" | "Congratulate" | "Blog";
  tags: string;
  pin: boolean;
};
