export interface YouTubeClipItem {
  _id: string;
  title: string;
  youtubeId: string;
  category: string;
  description: string;
  author: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  thumbnailUrl: string;
  videoUrl: string;
  embedUrl: string;
}

export const YOUTUBE_CLIPS_DATA: YouTubeClipItem[] = [
  {
    _id: "6a084761c3e7fa5d367f847c",
    title:
      "ब्रेन शैक्षणिक सल्ला व समुपदेशन केंद्र...भरारी करिअर मार्गदर्शन मेळाव्याचे आयोजन.| SHAIKSHANIK SALLA",
    youtubeId: "fNvaqoy0RCI",
    category: "Career Counselling",
    description:
      "<div>ब्रेन शैक्षणिक सल्ला व समुपदेशन केंद्र...भरारी करिअर मार्गदर्शन मेळाव्याचे आयोजन.| SHAIKSHANIK SALLA</div>",
    author: "BECCC",
    isPublished: true,
    createdAt: "2026-05-16T10:30:57.774Z",
    updatedAt: "2026-05-16T10:30:57.774Z",
    thumbnailUrl: "https://img.youtube.com/vi/fNvaqoy0RCI/hqdefault.jpg",
    videoUrl: "https://www.youtube.com/watch?v=fNvaqoy0RCI",
    embedUrl: "https://www.youtube.com/embed/fNvaqoy0RCI",
  },
  {
    _id: "6a10181534e96064060496e7",
    title: "Bharari Education Fair",
    youtubeId: "4x6X4u-gZqk",
    category: "Career Counselling",
    description: "<div>Education Fair Program Details</div>",
    author: "BECCC",
    isPublished: true,
    createdAt: "2026-05-22T08:47:17.850Z",
    updatedAt: "2026-05-22T08:47:17.850Z",
    thumbnailUrl: "https://img.youtube.com/vi/4x6X4u-gZqk/hqdefault.jpg",
    videoUrl: "https://www.youtube.com/watch?v=4x6X4u-gZqk",
    embedUrl: "https://www.youtube.com/embed/4x6X4u-gZqk",
  },
];
