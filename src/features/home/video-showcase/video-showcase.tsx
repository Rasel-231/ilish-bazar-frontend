"use client";

import { useState } from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { Fish, Play } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";

type VideoItem = {
  id: string; // YouTube video ID (youtube.com/watch?v=<ID>)
  tag: string;
  title: string;
  description: string;
  duration?: string;
};

// Real footage from the ghats and the sea — update the IDs whenever newer clips are available.
const VIDEOS: VideoItem[] = [
  {
    id: "PFx30p6Kth8",
    tag: "ঘাট থেকে",
    title: "মধ্যরাতের মাওয়া ঘাটে ইলিশ",
    description: "পদ্মার ডিমওয়ালা ইলিশসহ মধ্যরাতের মাওয়া ঘাটের ব্যস্ত দৃশ্য।",
  },
  {
    id: "-jE4vyk8Jh0",
    tag: "বাজারদর",
    title: "চাঁদপুরে ইলিশের বাজার",
    description: "চাঁদপুর বড় স্টেশন মাছঘাটে ইলিশের দাম ও বেচাকেনার চিত্র।",
  },
  {
    id: "t6MoSyVjlCE",
    tag: "জেলেদের জালে",
    title: "সাগরে জালে ঝাঁকে ঝাঁকে ইলিশ",
    description: "বঙ্গোপসাগরে ট্রলারের জালে ধরা পড়ছে টন টন ইলিশ।",
  },
];

const getThumbnailUrl = (id: string) =>
  `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;

type VideoCardProps = {
  video: VideoItem;
  onOpen: () => void;
};

function VideoCard({ video, onOpen }: VideoCardProps) {
  const [thumbnailFailed, setThumbnailFailed] = useState(false);

  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label={`ভিডিও চালান: ${video.title}`}
      className="group block w-full rounded-sm border border-slate-200 bg-white  text-left transition-all duration-300 hover:-translate-y-1 hover:border-teal-600/40 hover:shadow-[0_18px_40px_-18px_rgba(15,118,110,0.35)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2"
    >
      {/* Thumbnail */}
      <div className="relative aspect-video overflow-hidden  bg-slate-900">
        {thumbnailFailed ? (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-teal-800 to-slate-900">
            <Fish className="size-10 text-teal-200/60" />
          </div>
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={getThumbnailUrl(video.id)}
            alt=""
            loading="lazy"
            onError={() => setThumbnailFailed(true)}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        )}

        {/* Soft bottom shade */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/55 via-transparent to-transparent" />

        {/* Tag */}
        <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-teal-800 backdrop-blur">
          {video.tag}
        </span>

        {/* Duration */}
        {video.duration && (
          <span className="absolute bottom-3 right-3 rounded-md bg-slate-950/70 px-1.5 py-0.5 text-[11px] font-medium text-white">
            {video.duration}
          </span>
        )}

        {/* Play */}
        <span className="absolute inset-0 flex items-center justify-center">
          <span className="flex size-14 items-center justify-center rounded-full bg-white/95 text-teal-700 shadow-lg transition-transform duration-300 group-hover:scale-110">
            <Play className="ml-0.5 size-6 fill-current" />
          </span>
        </span>
      </div>

      {/* Text */}
      <div className="px-2.5 pb-2 pt-4">
        <h3 className="text-[15px] font-bold leading-snug text-slate-900">
          {video.title}
        </h3>
        <p className="mt-1 text-[13px] leading-relaxed text-slate-600">
          {video.description}
        </p>
      </div>
    </button>
  );
}

export function VideoShowcase() {
  const reduce = useReducedMotion();
  const [activeVideo, setActiveVideo] = useState<VideoItem | null>(null);

  const containerVariants: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: reduce ? 0 : 0.12 } },
  };
  const itemVariants: Variants = {
    hidden: reduce ? { opacity: 0 } : { opacity: 0, y: 24 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
    },
  };

  return (
    <section className="py-2 mt-5">
      <div className="container-page">
        <div className="mb-10 text-center sm:mb-12">
          <p className="text-xs font-semibold text-teal-700">ভিডিও</p>
          <h2 className="mt-1 text-2xl font-extrabold text-slate-900 sm:text-3xl">
            ভিডিওতে দেখুন: ঘাট থেকে আপনার রান্নাঘর
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-sm text-slate-600">
            মাওয়া, চাঁদপুর ও বরিশালের ঘাট থেকে তাজা ইলিশ কীভাবে আপনার দরজায়
            পৌঁছায়, নিজের চোখে দেখে নিন।
          </p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="grid gap-5 md:grid-cols-3"
        >
          {VIDEOS.map((video) => (
            <motion.div key={video.id} variants={itemVariants}>
              <VideoCard video={video} onOpen={() => setActiveVideo(video)} />
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Player modal: the iframe only loads once opened, keeping the page fast */}
      <Dialog
        open={!!activeVideo}
        onOpenChange={(open: boolean) => !open && setActiveVideo(null)}
      >
        <DialogContent
          className={cn(
            "max-w-4xl overflow-hidden rounded-2xl border-0 bg-black p-0 sm:rounded-2xl",
          )}
        >
          <DialogTitle className="sr-only">{activeVideo?.title}</DialogTitle>
          <DialogDescription className="sr-only">
            {activeVideo?.description}
          </DialogDescription>
          {activeVideo && (
            <div className="aspect-video w-full">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${activeVideo.id}?autoplay=1&rel=0&modestbranding=1`}
                title={activeVideo.title}
                allow="accelerometer; autoplay; encrypted-media; picture-in-picture; fullscreen"
                allowFullScreen
                className="h-full w-full"
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
