import { CustomerReviews } from "@/features/home/customer-reviews/customer-reviews";
import { GhatSourceSection } from "@/features/home/ghat-source/ghat-source-section";
import { HeroCarousel } from "@/features/home/hero-carousel";
import { HowToOrder } from "@/features/home/how-to-order/how-to-order";
import { CategorySection } from "@/features/home/ilish-category/ilish-category";
import { IlishShowcase } from "@/features/home/ilish-showcase";
import { TodaysFreshIlish } from "@/features/home/todays-ilish/todays-fresh-ilish";
import { VideoShowcase } from "@/features/home/video-showcase/video-showcase";

export default function HomePage() {
  return (
    <div className="flex flex-1 flex-col">
      <h1 className="sr-only">
        ইলিশ বাজার — নদীর তাজা ইলিশ, সরাসরি জেলে ও আড়ত থেকে আপনার ঘরে
      </h1>
      <HeroCarousel />
      <CategorySection />
      <IlishShowcase />
      <TodaysFreshIlish />
      <GhatSourceSection />
      <HowToOrder />
      <VideoShowcase />
      <CustomerReviews />
    </div>
  );
}
