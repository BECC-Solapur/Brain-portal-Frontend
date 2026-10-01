export interface TestimonialItem {
  _id: string;
  name: string;
  role: string;
  handle?: string;
  content: string;
  quote: string;
  imageUrl: string;
  author: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export const TESTIMONIALS_DATA: TestimonialItem[] = [
  {
    _id: "697ca0900a799ffa8e0e9d22",
    name: "Sourabh Mohole",
    role: "Senior Consultant @ TCS Group",
    handle: "@sourabh_tcs",
    content:
      '<div><em style="font-size: 16px; color: oklch(0.446 0.043 257.281);">I am working at a higher position in TCS group due to proper Counselling and Study method guidance received at Brain Counselling centre. Their way of Counselling is very Scientific and Precise.</em></div>',
    quote:
      "I am working at a higher position in TCS group due to proper counselling and study method guidance received at Brain Counselling centre. Their way of counselling is very scientific and precise.",
    imageUrl:
      "https://res.cloudinary.com/drd5iver7/image/upload/v1769775242/brain_images/shlysx9ofudorwpbekp2.png",
    author: "Tanzila",
    isActive: true,
    createdAt: "2026-01-30T12:14:08.011Z",
    updatedAt: "2026-01-30T12:14:08.011Z",
  },
  {
    _id: "697ca0c10a799ffa8e0e9d27",
    name: "Swapnil Bagdure",
    role: "MBBS Gold Medalist, China",
    handle: "@swapnil_md",
    content:
      '<div><em style="font-size: 16px; color: oklch(0.446 0.043 257.281);">I was nervous as I Could not get admission to MBBS in India but Counsellors from Brain Education Consultancy, not only helped me in getting admission in ZenZhou University China, but also guided in such a way that I secured gold medal in MBBS in University &amp; they offered me Scholarship for MD.</em></div>',
    quote:
      "I was nervous when I couldn't get MBBS admission in India, but counsellors from Brain Education Consultancy not only helped me get into ZenZhou University China, but also guided me to secure a gold medal in MBBS and earn a full scholarship for MD.",
    imageUrl:
      "https://res.cloudinary.com/drd5iver7/image/upload/v1769775297/brain_images/mmxdlitnuuqkllwpua9q.png",
    author: "Tanzila",
    isActive: true,
    createdAt: "2026-01-30T12:14:57.633Z",
    updatedAt: "2026-01-30T12:14:57.633Z",
  },
  {
    _id: "697dcc4bc666d4f74a7e1e61",
    name: "Laxmi Kandikatla",
    role: "Principal, SVCS English Medium",
    handle: "@laxmi_svcs",
    content:
      '<div><em style="font-size: 16px; color: oklch(0.446 0.043 257.281);">I would highly recommend it to every school to experience Education counselling done by Brain Consultancy.I have included it in my school Academic Curriculum to guide the student to excel in their career. This is an Excellent Brain mapping programme provided by Brain Education Consultancy.</em></div>',
    quote:
      "I would highly recommend every school to experience educational counselling by Brain Consultancy. We integrated their Brain mapping into our academic curriculum to help students excel in their careers.",
    imageUrl:
      "https://res.cloudinary.com/drd5iver7/image/upload/v1769851978/brain_images/vqpxzwytjwvjajb76ob5.png",
    author: "BECCC",
    isActive: true,
    createdAt: "2026-01-31T09:32:59.947Z",
    updatedAt: "2026-01-31T09:32:59.947Z",
  },
  {
    _id: "697dcc97c666d4f74a7e1e68",
    name: "Rohini Sura",
    role: "Headmaster, Raj Memorial School",
    handle: "@rohini_raj",
    content:
      '<div><em style="font-size: 16px; color: oklch(0.446 0.043 257.281);">Teachers Training Workshop and counseling Students by Brain Consultancy was very useful in improving result &amp; educational environment in Highschool.</em></div>',
    quote:
      "Teachers training workshops and student counselling by Brain Consultancy were immensely useful in improving academic results and elevating our school environment.",
    imageUrl:
      "https://res.cloudinary.com/drd5iver7/image/upload/v1769852055/brain_images/tyqn9vlz4lm103fulkyk.png",
    author: "BECCC",
    isActive: true,
    createdAt: "2026-01-31T09:34:15.595Z",
    updatedAt: "2026-01-31T09:34:15.595Z",
  },
  {
    _id: "aditya-coep",
    name: "Aditya Kulkarni",
    role: "Engineering Student, COEP Pune",
    handle: "@aditya_coep",
    content: "<div>The AI CMT assessment gave me crystal-clear direction on stream selection and engineering specialization.</div>",
    quote:
      "The AI CMT assessment gave me crystal-clear direction on stream selection and specialization. Saved me from months of confusion!",
    imageUrl: "",
    author: "Brain Team",
    isActive: true,
    createdAt: "2026-02-05T10:00:00.000Z",
    updatedAt: "2026-02-05T10:00:00.000Z",
  },
  {
    _id: "pooja-parent",
    name: "Pooja Deshmukh",
    role: "Parent of Grade 10 Student",
    handle: "@pooja_deshmukh",
    content: "<div>Brain Education Consultancy helped our child overcome study anxiety and build a personalized revision routine.</div>",
    quote:
      "Brain Education Consultancy helped our child overcome exam anxiety and build a personalized study routine that improved her marks tremendously.",
    imageUrl: "",
    author: "Brain Team",
    isActive: true,
    createdAt: "2026-02-12T10:00:00.000Z",
    updatedAt: "2026-02-12T10:00:00.000Z",
  },
  {
    _id: "legacy-sr-joshi",
    name: "Principal S. R. Joshi",
    role: "Senior Educator, Solapur High School",
    handle: "@srjoshi_edu",
    content:
      "<div>BECC has conducted student assessment seminars for over 600 students in our institution. Their IQ-EQ-SQ methodology is scientifically unmatched in Maharashtra.</div>",
    quote:
      "BECC has conducted student assessment seminars for over 600 students in our institution. Their IQ-EQ-SQ methodology is scientifically unmatched in Maharashtra.",
    imageUrl: "/images/testimonial4.png",
    author: "Brain Team",
    isActive: true,
    createdAt: "2026-01-15T10:00:00.000Z",
    updatedAt: "2026-01-15T10:00:00.000Z",
  },
  {
    _id: "tanvi-shah",
    name: "Tanvi Shah",
    role: "Medical Aspirant, Solapur",
    handle: "@tanvishah_",
    content: "<div>Study technique workshops gave me the exact tools to retain difficult biology concepts.</div>",
    quote:
      "Scientific study techniques from BRAIN counsellors completely transformed how I prepare for competitive entrance exams.",
    imageUrl: "",
    author: "Brain Team",
    isActive: true,
    createdAt: "2026-02-15T10:00:00.000Z",
    updatedAt: "2026-02-15T10:00:00.000Z",
  },
  {
    _id: "dr-mv-patil",
    name: "Dr. M. V. Patil",
    role: "Educational Trustee, Solapur",
    handle: "@mvpatil_trust",
    content: "<div>A comprehensive psychometric platform that every institution should adopt.</div>",
    quote:
      "A comprehensive, scientific guidance platform that every school and student should experience. Truly impactful work.",
    imageUrl: "",
    author: "Brain Team",
    isActive: true,
    createdAt: "2026-02-20T10:00:00.000Z",
    updatedAt: "2026-02-20T10:00:00.000Z",
  },
];

