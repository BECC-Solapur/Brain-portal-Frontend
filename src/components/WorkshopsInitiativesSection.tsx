"use client";

import { useState } from "react";
import {
  Calendar,
  User,
  Tag,
  ArrowRight,
  X,
  Sparkles,
  BookOpen,
  Image as ImageIcon,
  GraduationCap,
} from "lucide-react";

export interface InitiativeItem {
  _id: string;
  title: string;
  content: string;
  summary: string;
  category: "Counselling" | "Workshop" | "Education" | string;
  imageUrl: string;
  author: string;
  createdAt: string;
  updatedAt: string;
}

export const INITIATIVES_DATA: InitiativeItem[] = [
  {
    _id: "69735c899a24ad9ed500dfed",
    title: "Free Career Counselling Workshop for Students",
    content:
      "<p>Brain Education is organizing a free career counselling workshop aimed at helping students choose the right academic and professional path. The session will cover career planning, stream selection, higher education opportunities, and skill development. Our expert counsellors will provide one-on-one guidance and answer students' questions. The workshop is open to students from all streams and will be conducted both online and offline.</p>",
    summary:
      "Brain Education is hosting a free career counselling workshop to guide students in choosing the right academic and career path.",
    category: "Counselling",
    imageUrl:
      "https://res.cloudinary.com/drd5iver7/image/upload/v1769168008/brain_images/ti8xwe585eqybmadukuj.png",
    author: "Tanzila",
    createdAt: "2026-01-23T11:33:29.567Z",
    updatedAt: "2026-01-23T11:33:29.567Z",
  },
  {
    _id: "69735db09a24ad9ed500dff7",
    title: "Workshop on Effective Study Techniques Announced",
    content:
      "<p>Brain Education successfully conducted an interactive workshop on effective study techniques for students. The session was led by an experienced instructor who guided participants on active learning methods, memory improvement strategies, and time management skills. Students actively engaged in discussions and practical exercises designed to enhance their academic performance. The workshop aimed to empower learners with tools to study smarter, reduce stress, and achieve better results in exams and daily learning routines.</p>",
    summary:
      "Brain Education organized a workshop on effective study techniques, focusing on active learning, memory tips, and time management to help students improve academic performance.",
    category: "Workshop",
    imageUrl:
      "https://res.cloudinary.com/drd5iver7/image/upload/v1769168303/brain_images/hhebeolm0lmksweeiljo.png",
    author: "Tanzila",
    createdAt: "2026-01-23T11:38:24.055Z",
    updatedAt: "2026-01-23T11:38:53.644Z",
  },
  {
    _id: "6a3a5af11e624e22ad978fe5",
    title: "Jain gurukul school yoga day",
    content:
      '<div><span style="font-size: 16px;">१२ वा आंतरराष्ट्रीय योग दिनानिमित्त आमच्या श्री दिगंबर जैन गुरुकुल प्रशाला व कनिष्ठ महाविद्यालय, सोलापूर येथील कलाशिक्षक श्री.अरविंद गोटिमुकुल सर यांनी आपल्या कुशल हस्ताक्षर व कलात्मकतेच्या माध्यमातून आकर्षक व प्रभावी फलक लेखन साकारले आहे.</span></div><div><br></div><div>मनःपूर्वक अभिनंदन सर! 🌹 विद्यार्थ्यांमध्ये सर्जनशीलता, संस्कार आणि कलात्मकतेची आवड निर्माण करण्याचे आपले कार्य खरोखर प्रेरणादायी आहे. आपल्या पुढील वाटचालीस Brain Educational Consultancy, Solapur तर्फे हार्दिक शुभेच्छा. 💐👏"</div>',
    summary: "21 jun yoga day celebrations in jain gurukul school",
    category: "Education",
    imageUrl:
      "https://res.cloudinary.com/dju3gdeid/image/upload/v1782209264/brain_images/vtdsacn3ae054qzzaija.jpg",
    author: "Arpita Kulkarni",
    createdAt: "2026-06-23T10:07:45.637Z",
    updatedAt: "2026-06-23T10:07:45.637Z",
  },
  {
    _id: "6a686e715a152294c34f92e9",
    title: "Aashadhi dindhi ",
    content:
      "<div>Butterfly pre school arranged this ashadi dindi on occasion of Aashadhi ekadshi. Principal vaishali kale madam &amp; Teachers alongwith parents celebrate this program.</div>",
    summary: "Butterfly pre school ",
    category: "Education",
    imageUrl:
      "https://res.cloudinary.com/dju3gdeid/image/upload/v1785228912/brain_images/s9kc5eq7hvskl7j1inoo.jpg",
    author: "Arpita Kulkarni",
    createdAt: "2026-07-28T08:55:13.812Z",
    updatedAt: "2026-07-28T08:55:13.812Z",
  },
  {
    _id: "6a69ac5e3219cf7d32266019",
    title: "गरीब व गरजू २५ विद्यार्थ्यांना शैक्षणिक साहित्याचे वाटप",
    content:
      "<div>ब्रेन एज्युकेशनल कन्सल्टन्सी, सोलापूर व लायन्स मेट्रो क्लब यांच्या संयुक्त विद्यमाने गरीब व गरजू २५ विद्यार्थ्यांना शैक्षणिक साहित्याचे वाटप करण्यात आले. या सामाजिक उपक्रमातून विद्यार्थ्यांना शैक्षणिक साहित्य उपलब्ध करून देत त्यांच्या शिक्षणाला प्रोत्साहन देण्याचा प्रयत्न करण्यात आला. शिक्षणाच्या माध्यमातून विद्यार्थ्यांचे उज्ज्वल भविष्य घडावे, या उद्देशाने हा उपक्रम राबविण्यात आला. समाजाप्रती असलेली बांधिलकी जपत ब्रेन एज्युकेशनल कन्सल्टन्सी व लायन्स मेट्रो क्लब भविष्यातही असे सामाजिक उपक्रम सातत्याने राबवतील.</div>",
    summary:
      "ब्रेन एज्युकेशनल कन्सल्टन्सी, सोलापूर व लायन्स मेट्रो क्लब यांच्या संयुक्त विद्यमाने २५ गरीब व गरजू विद्यार्थ्यांना शैक्षणिक साहित्याचे वाटप करण्यात आले.",
    category: "Education",
    imageUrl:
      "https://res.cloudinary.com/dju3gdeid/image/upload/v1785310300/brain_images/yhzax8hd4rqr5tc5maph.jpg",
    author: "Arpita Kulkarni",
    createdAt: "2026-07-29T07:31:42.553Z",
    updatedAt: "2026-07-29T07:31:42.553Z",
  },
  {
    _id: "6a69afa03219cf7d32266021",
    title: "आषाढी दिंडी उत्साहात संपन्न",
    content:
      '<div>आषाढी एकादशीच्या पावन निमित्ताने Unique Blossom Preschool मध्ये आषाढी दिंडीचे आयोजन करण्यात आले. विद्यार्थ्यांनी पारंपरिक वारकरी वेशभूषा परिधान करून टाळ-मृदंगाच्या गजरात आणि "ज्ञानोबा-तुकाराम" च्या जयघोषात दिंडीत उत्साहाने सहभाग घेतला. या उपक्रमातून विद्यार्थ्यांना महाराष्ट्राची समृद्ध सांस्कृतिक परंपरा, भक्तीभाव आणि सामाजिक मूल्यांची ओळख करून देण्यात आली. पालक आणि शिक्षकांच्या उपस्थितीत हा कार्यक्रम आनंददायी वातावरणात संपन्न झाला.</div>',
    summary:
      "Unique Blossom Preschool मध्ये आषाढी एकादशी निमित्त पारंपरिक आषाढी दिंडी उत्साहात साजरी करण्यात आली. चिमुकल्या विद्यार्थ्यांनी वारकरी वेशभूषेत सहभागी होत विठ्ठल भक्तीचा आणि संस्कारांचा संदेश दिला.",
    category: "Education",
    imageUrl:
      "https://res.cloudinary.com/dju3gdeid/image/upload/v1785311135/brain_images/g9cg5xar4sut3saceoit.png",
    author: "Arpita Kulkarni",
    createdAt: "2026-07-29T07:45:36.422Z",
    updatedAt: "2026-07-29T07:45:36.422Z",
  },
  {
    _id: "6a9bbd87ec57d0a1df52f881",
    title: "🌸 Butterfly Pre School मध्ये श्रीकृष्ण जन्माष्टमी उत्सव उत्साहात साजरा 🌸",
    content:
      "<div>🌸🦋 Butterfly Pre School 🦋🌸</div><div><strong>श्रीकृष्ण जन्माष्टमी उत्सव 2026</strong></div><div>Butterfly Pre School मध्ये श्रीकृष्ण जन्माष्टमीचा उत्सव मोठ्या उत्साहात आणि भक्तिमय वातावरणात साजरा करण्यात आला.</div><div>चिमुकल्या विद्यार्थ्यांनी श्रीकृष्ण, राधा, गोपी आणि इतर पारंपरिक वेशभूषा परिधान करून उत्सवात आनंदाने सहभाग घेतला. त्यांच्या निरागस हास्याने, सुंदर सादरीकरणाने आणि भक्तिमय वातावरणाने संपूर्ण शाळा आनंदाने फुलून गेली.</div><div>या प्रसंगी विद्यार्थ्यांना श्रीकृष्ण जन्माष्टमीचे महत्त्व सांगण्यात आले तसेच विविध सांस्कृतिक उपक्रमांचे आयोजन करण्यात आले.</div><div><strong>– Butterfly Pre School 🦋</strong></div><div><br></div>",
    summary:
      "Butterfly Pre School मध्ये श्रीकृष्ण जन्माष्टमीचा उत्सव भक्तिमय आणि आनंददायी वातावरणात साजरा करण्यात आला. विद्यार्थ्यांनी श्रीकृष्ण, राधा आणि गोपी यांच्या वेशभूषेत सुंदर सहभाग घेतला.",
    category: "Education",
    imageUrl:
      "https://res.cloudinary.com/dju3gdeid/image/upload/v1788591494/brain_images/zy1r0sj6kqpbxrms4ftf.jpg",
    author: "Arpita Kulkarni",
    createdAt: "2026-09-05T06:58:15.215Z",
    updatedAt: "2026-09-05T06:58:15.215Z",
  },
  {
    _id: "6a9fb2ebca71d4d2fdb3da57",
    title: "Gokulashtami Celebration at Unique Blossom Preschool ",
    content:
      "<div>Unique Blossom Preschool Celebrates Gokulashtami</div><div>Unique Blossom Preschool celebrated Gokulashtami with great joy and enthusiasm on 3 September 2026. Children dressed as Lord Krishna, Radha, Gopikas, and other traditional characters, making the celebration colourful and memorable.</div><div>A special puppet show brought the story of Lord Krishna and Govardhan Mountain to life, helping children learn about Indian culture and values in a fun and engaging way. The celebration was filled with devotion, learning, and happiness.</div>",
    summary:
      "Unique Blossom Preschool celebrated Gokulashtami on 3 September 2026 with joy and enthusiasm. Children dressed as Lord Krishna, Radha and Gopikas, and enjoyed a special puppet show depicting the story of Lord Krishna and Govardhan Mountain.",
    category: "Education",
    imageUrl:
      "https://res.cloudinary.com/dju3gdeid/image/upload/v1788850919/brain_images/vosysbbpceojxwddplih.jpg",
    author: "Arpita Kulkarni",
    createdAt: "2026-09-08T07:02:03.714Z",
    updatedAt: "2026-09-08T07:02:03.714Z",
  },
  {
    _id: "6aa11127de1d7ad833536dae",
    title: "Krishna Janmashtami Celebration 2026 Celebrated with Joy at Global Village Public School, Solapur",
    content:
      "<div>Global Village Public School, Solapur celebrated the auspicious festival of Krishna Janmashtami with immense joy, enthusiasm, and devotion.</div><div>Students from Playgroup to UKG participated wholeheartedly in the celebration. The little ones looked adorable in colourful traditional attire as Lord Krishna, Radha, Gopikas, Balram, and other mythological characters. Their innocent smiles and vibrant costumes added a divine charm to the event.</div><div>The celebration included devotional songs, dance performances, Krishna-themed activities, and joyful festive moments that helped children understand the values and stories associated with Lord Krishna in a fun and engaging way.</div><div>The school campus was filled with happiness, spirituality, and festive spirit, making the celebration a memorable experience for students, teachers, and parents alike. 🌸🦚</div>",
    summary:
      "Global Village Public School, Solapur celebrated Krishna Janmashtami 2026 with great joy and devotion. Students from Playgroup to UKG participated in the celebration dressed as Lord Krishna, Radha, and Gopikas.",
    category: "Education",
    imageUrl:
      "https://res.cloudinary.com/dju3gdeid/image/upload/v1788940579/brain_images/xgfyjprmb294jwuxxzil.jpg",
    author: "Arpita Kulkarni",
    createdAt: "2026-09-09T07:56:23.755Z",
    updatedAt: "2026-09-09T07:56:23.755Z",
  },
  {
    _id: "6aa8fd9502c884bc5d7f66e0",
    title: "Social school ",
    content:
      "<div>Social school arranged the parents meeting for 8th, 9th 10th std.brain counsellor kulkarni guidance to the parents.100 parents present 💐 </div>",
    summary: "Parents meeting ",
    category: "Education",
    imageUrl:
      "https://res.cloudinary.com/dju3gdeid/image/upload/v1789459860/brain_images/tabvpw6kgypfszbpc5bi.png",
    author: "Arpita Kulkarni",
    createdAt: "2026-09-15T08:11:01.124Z",
    updatedAt: "2026-09-15T08:11:01.124Z",
  },
  {
    _id: "6aaba138875fcc563606072b",
    title:
      "लायन्स क्लब ऑफ सोलापूर मेट्रो व ब्रेन एज्युकेशनल कन्सल्टन्सी यांच्या संयुक्त विद्यमाने प्रज्ञावंत शिक्षक पुरस्कार सोहळा संपन्न",
    content:
      "<div>लायन्स क्लब ऑफ सोलापूर मेट्रो व Brain Educational Consultancy यांच्या संयुक्त विद्यमाने प्रज्ञावंत शिक्षक पुरस्कार व क्रियाशील अभियंता पुरस्कार सोहळा रविवार, १३ सप्टेंबर २०२६ रोजी हॉटेल सेंटर पॉईंट, सात रस्ता, सोलापूर येथे उत्साहात संपन्न झाला.</div><div>कार्यक्रमाच्या अध्यक्षस्थानी ला. डॉ. श्रीशैलप्पा ता. पाटील उपस्थित होते. प्रमुख उपस्थिती म्हणून MJF ला. श्री. राजेंद्र शहा (कांसवा), श्री. आनंदजी तानवडे तसेच मेंटर श्री. किरण कुलकर्णी सर उपस्थित होते. Brain Educational Consultancy च्या अध्यक्षा सौ. शलाका कुलकर्णी यांचीही विशेष उपस्थिती लाभली.</div><div>या सोहळ्यात शिक्षण व अभियांत्रिकी क्षेत्रात उल्लेखनीय कार्य करणाऱ्या व्यक्तींचा गौरव करण्यात आला. शिक्षक, पालक आणि विविध क्षेत्रातील मान्यवरांच्या उत्स्फूर्त उपस्थितीत कार्यक्रम यशस्वीरीत्या पार पडला.</div>",
    summary:
      "लायन्स क्लब ऑफ सोलापूर मेट्रो व Brain Educational Consultancy",
    category: "Education",
    imageUrl:
      "https://res.cloudinary.com/dju3gdeid/image/upload/v1789632823/brain_images/db62ouomduk2euwwghic.jpg",
    author: "Arpita Kulkarni",
    createdAt: "2026-09-17T08:13:44.999Z",
    updatedAt: "2026-09-17T08:19:33.836Z",
  },
];

function formatDate(isoString: string): string {
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return isoString;
    return d.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return isoString;
  }
}

function getCategoryColor(category: string) {
  switch (category.toLowerCase()) {
    case "counselling":
      return "bg-[#f6f3fb] text-[#3f2f7a] border-[#d8d5e6]";
    case "workshop":
      return "bg-amber-50 text-amber-800 border-amber-200";
    case "education":
    default:
      return "bg-emerald-50 text-emerald-800 border-emerald-200";
  }
}

/**
 * Clean visual container for card preview without browser URL or dots
 */
function ImageArea({
  imageUrl,
  title,
  category,
  className = "h-48 sm:h-52 w-full",
}: {
  imageUrl?: string;
  title: string;
  category: string;
  className?: string;
}) {
  const [hasError, setHasError] = useState(false);

  return (
    <div
      className={`relative overflow-hidden rounded-xl bg-[#f0f2f6] flex items-center justify-center ${className}`}
    >
      {/* Actual Image if available */}
      {imageUrl && !hasError ? (
        <img
          src={imageUrl}
          alt={title}
          referrerPolicy="no-referrer"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={() => setHasError(true)}
        />
      ) : (
        <div className="relative z-10 flex flex-col items-center justify-center p-4 text-center w-full h-full bg-gradient-to-br from-slate-100 via-[#f4f2fa] to-indigo-50/50">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-xs border border-[#d8d5e6] text-[#3f2f7a] mb-2 transition-transform group-hover:scale-110">
            <Sparkles className="h-6 w-6 stroke-[1.75]" />
          </div>
          <span className="text-[11px] font-semibold tracking-wide text-[#3f2f7a] uppercase">
            {category}
          </span>
        </div>
      )}
    </div>
  );
}

export default function WorkshopsInitiativesSection() {
  const [activeModalItem, setActiveModalItem] = useState<InitiativeItem | null>(null);

  const displayedItems = INITIATIVES_DATA.slice(2, 8);

  return (
    <section className="w-full rounded-none bg-white px-5 py-14 sm:px-8 lg:px-12 border-b border-slate-200/80">
      {/* Header */}
      <div className="border-b border-slate-100 pb-6">
        <div className="mb-2 flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#f6f3fb] text-[#3f2f7a]">
            <Sparkles className="h-3.5 w-3.5" />
          </span>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#3f2f7a]">
            Workshops & Initiatives
          </p>
        </div>
        <h2 className="text-2xl font-medium tracking-tight text-[#171717] sm:text-3xl">
          Community Programs & Educational Highlights
        </h2>
      </div>

      {/* Grid of 6 Cards - structured exactly as modern product feature cards */}
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {displayedItems.map((item) => (
          <article
            key={item._id}
            onClick={() => setActiveModalItem(item)}
            className="group flex flex-col justify-between rounded-2xl border border-slate-200/85 bg-white p-3.5 sm:p-4 transition-all duration-300 hover:shadow-lg hover:border-slate-300 hover:-translate-y-1 cursor-pointer"
          >
            <div>
              {/* Clean rounded visual frame */}
              <ImageArea
                imageUrl={item.imageUrl}
                title={item.title}
                category={item.category}
              />

              {/* Text Information: Title + Description */}
              <div className="pt-4 px-1 pb-1">
                <h3 className="line-clamp-2 text-base sm:text-[17px] font-semibold leading-snug text-[#171717] group-hover:text-[#3f2f7a] transition-colors">
                  {item.title}
                </h3>
                <p className="mt-2 line-clamp-3 text-xs sm:text-[13px] leading-relaxed text-[#64748b]">
                  {item.summary}
                </p>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Detailed Modal for Complete HTML Content */}
      {activeModalItem && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setActiveModalItem(null)}
        >
          <div
            className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white shadow-2xl border border-slate-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setActiveModalItem(null)}
              className="absolute top-4 right-4 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-slate-700 shadow-md hover:bg-slate-100 hover:text-black transition-colors"
              aria-label="Close modal"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Modal Image Area */}
            <div className="relative">
              <ImageArea
                imageUrl={activeModalItem.imageUrl}
                title={activeModalItem.title}
                category={activeModalItem.category}
                className="h-64 sm:h-72 w-full"
              />
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-8">
              {/* Category, Date & Author Badges */}
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 mb-3">
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-3 py-1 font-semibold border ${getCategoryColor(
                    activeModalItem.category
                  )}`}
                >
                  <GraduationCap className="h-3.5 w-3.5" />
                  {activeModalItem.category}
                </span>
                <span className="flex items-center gap-1 text-[#737373]">
                  <Calendar className="h-3.5 w-3.5 text-[#3f2f7a]" />
                  {formatDate(activeModalItem.createdAt)}
                </span>
                <span className="flex items-center gap-1 text-[#737373]">
                  <User className="h-3.5 w-3.5 text-slate-400" />
                  Author: <strong className="text-slate-800 font-medium">{activeModalItem.author}</strong>
                </span>
              </div>

              {/* Title */}
              <h2 className="text-xl sm:text-2xl font-semibold text-[#171717] leading-snug">
                {activeModalItem.title}
              </h2>

              {/* Summary Highlight Box */}
              {activeModalItem.summary && (
                <div className="mt-4 rounded-xl bg-[#f6f3fb] border border-[#d8d5e6] p-4 text-xs sm:text-sm text-[#3f2f7a] font-medium leading-relaxed">
                  {activeModalItem.summary}
                </div>
              )}

              {/* Rich HTML Content */}
              <div className="mt-6 border-t border-slate-100 pt-6">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                  Full Details
                </h4>
                <div
                  className="prose prose-sm max-w-none text-[#333333] leading-relaxed [&>p]:mb-3 [&>div]:mb-3 [&_strong]:font-semibold"
                  dangerouslySetInnerHTML={{ __html: activeModalItem.content }}
                />
              </div>

              {/* Modal Footer */}
              <div className="mt-8 pt-4 border-t border-slate-100 flex justify-end">
                <button
                  type="button"
                  onClick={() => setActiveModalItem(null)}
                  className="rounded-xl bg-[#2c2159] px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#3f2f7a]"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
