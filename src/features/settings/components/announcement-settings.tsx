"use client";

import { useMemo, useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Loader2,
  Plus,
  RotateCcw,
  TriangleAlert,
} from "lucide-react";
import { toast } from "react-toastify";

import { AnnouncementTicker } from "@/components/shared/announcement-ticker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

import {
  useGetSiteSettingQuery,
  useUpdateSiteSettingMutation,
} from "../api/settings.api";
import type { SiteSetting } from "../types/settings.types";

const MAX_NOTICES = 10;
const MAX_NOTICE_LENGTH = 200;

export function AnnouncementSettings() {
  const { data, isLoading, isError, refetch } = useGetSiteSettingQuery();

  if (isLoading) {
    return (
      <div className="space-y-3">
        <div className="h-14 animate-pulse rounded-xl bg-muted/60" />
        <div className="h-11 animate-pulse rounded-xl bg-muted/60" />
        <div className="h-11 animate-pulse rounded-xl bg-muted/60" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/5 p-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="flex items-center gap-2 text-sm font-medium text-destructive">
          <TriangleAlert className="size-4 shrink-0" />
          সেটিংস লোড করা যায়নি। সার্ভার চালু আছে কিনা দেখে আবার চেষ্টা করুন।
        </p>
        <Button variant="outline" size="sm" onClick={() => refetch()}>
          আবার চেষ্টা করুন
        </Button>
      </div>
    );
  }

  if (!data?.data) return null;

  return (
    <AnnouncementSettingsForm
      key={data.data.updatedAt}
      setting={data.data}
    />
  );
}

function AnnouncementSettingsForm({ setting }: { setting: SiteSetting }) {
  const [updateSetting, { isLoading: isSaving }] = useUpdateSiteSettingMutation();

  const [notices, setNotices] = useState<string[]>(setting.notices);
  const [marqueeEnabled, setMarqueeEnabled] = useState(setting.marqueeEnabled);

  const cleanedNotices = useMemo(
    () => notices.map((notice) => notice.trim()).filter(Boolean),
    [notices],
  );

  const isDirty =
    marqueeEnabled !== setting.marqueeEnabled ||
    JSON.stringify(cleanedNotices) !== JSON.stringify(setting.notices);

  const previewNotices = cleanedNotices.length > 0 ? cleanedNotices : null;

  const updateNotice = (index: number, value: string) => {
    setNotices((prev) => prev.map((n, i) => (i === index ? value : n)));
  };

  const moveNotice = (index: number, direction: -1 | 1) => {
    setNotices((prev) => {
      const target = index + direction;
      if (target < 0 || target >= prev.length) return prev;

      const next = [...prev];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  };

  const removeNotice = (index: number) => {
    setNotices((prev) => prev.filter((_, i) => i !== index));
  };

  const addNotice = () => {
    setNotices((prev) =>
      prev.length >= MAX_NOTICES ? prev : [...prev, ""],
    );
  };

  const resetChanges = () => {
    setNotices(setting.notices);
    setMarqueeEnabled(setting.marqueeEnabled);
  };

  const handleSave = async () => {
    try {
      await updateSetting({
        notices: cleanedNotices,
        marqueeEnabled,
      }).unwrap();

      toast.success("নোটিশ বার আপডেট হয়েছে!");
    } catch (error) {
      const message = (
        error as { data?: { message?: string } }
      )?.data?.message;
      toast.error(message || "নোটিশ বার আপডেট করা যায়নি।");
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-4 rounded-xl border border-border/70 bg-muted/30 px-4 py-3">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-navy">
            নোটিশ বার {marqueeEnabled ? "চালু" : "বন্ধ"} আছে
          </p>
          <p className="text-xs text-muted-foreground">
            বন্ধ করলে সাইটের নেভিগেশনের উপরে কোনো নোটিশ দেখানো হবে না।
          </p>
        </div>

        <button
          type="button"
          role="switch"
          aria-checked={marqueeEnabled}
          aria-label="নোটিশ বার চালু/বন্ধ"
          onClick={() => setMarqueeEnabled((value) => !value)}
          className={cn(
            "relative h-6 w-11 shrink-0 rounded-full outline-none transition-colors focus-visible:ring-3 focus-visible:ring-ring/50",
            marqueeEnabled ? "bg-primary" : "bg-muted-foreground/30",
          )}
        >
          <span
            className={cn(
              "absolute top-0.5 left-0 size-5 rounded-full bg-white shadow-sm transition-transform",
              marqueeEnabled ? "translate-x-5" : "translate-x-0.5",
            )}
          />
        </button>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between gap-3">
          <span className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
            লাইভ প্রিভিউ
          </span>
          {!marqueeEnabled ? (
            <span className="rounded-full bg-warning/10 px-2 py-0.5 text-[11px] font-semibold text-warning">
              বর্তমানে বন্ধ আছে
            </span>
          ) : null}
        </div>

        {previewNotices ? (
          <div className="overflow-hidden rounded-xl ring-1 ring-border/70">
            <AnnouncementTicker notices={previewNotices} />
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-border px-4 py-6 text-center text-sm text-muted-foreground">
            কোনো নোটিশ নেই — নিচের “নোটিশ যোগ করুন” বাটনে ক্লিক করুন।
          </div>
        )}
      </div>

      <div className="space-y-2.5">
        <div className="flex items-center justify-between gap-3">
          <span className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
            নোটিশ তালিকা
          </span>
          <span className="text-[11px] text-muted-foreground">
            {cleanedNotices.length}/{MAX_NOTICES}
          </span>
        </div>

        <ul className="space-y-2.5">
          {notices.map((notice, index) => (
            <li key={index} className="flex items-center gap-2">
              <span className="grid size-7 shrink-0 place-items-center rounded-lg bg-muted text-[11px] font-bold text-muted-foreground">
                {index + 1}
              </span>

              <Input
                value={notice}
                maxLength={MAX_NOTICE_LENGTH}
                onChange={(event) => updateNotice(index, event.target.value)}
                placeholder={`নোটিশ ${index + 1} লিখুন…`}
                className="h-10 flex-1 rounded-xl border-border/70 bg-muted/30 focus:border-primary"
              />

              <div className="flex shrink-0 items-center gap-0.5">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  aria-label="উপরে সরান"
                  disabled={index === 0 || isSaving}
                  onClick={() => moveNotice(index, -1)}
                >
                  <ChevronUp />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  aria-label="নিচে সরান"
                  disabled={index === notices.length - 1 || isSaving}
                  onClick={() => moveNotice(index, 1)}
                >
                  <ChevronDown />
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  size="icon-sm"
                  aria-label="নোটিশ মুছুন"
                  disabled={isSaving}
                  onClick={() => removeNotice(index)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M3 6h18" />
                    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                  </svg>
                </Button>
              </div>
            </li>
          ))}
        </ul>

        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={notices.length >= MAX_NOTICES || isSaving}
          onClick={addNotice}
        >
          <Plus />
          নোটিশ যোগ করুন
        </Button>
      </div>

      <div className="flex flex-col gap-3 border-t border-border/70 pt-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-muted-foreground">
          সর্বোচ্চ {MAX_NOTICES}টি নোটিশ, প্রতিটি সর্বোচ্চ{" "}
          {MAX_NOTICE_LENGTH} অক্ষর।{" "}
          {isDirty ? (
            <span className="font-semibold text-warning">
              সংরক্ষণ করা হয়নি।
            </span>
          ) : cleanedNotices.length === 0 ? (
            <span className="text-warning">
              খালি তালিকায় নোটিশ বার লুকানো থাকবে।
            </span>
          ) : null}
        </p>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={!isDirty || isSaving}
            onClick={resetChanges}
          >
            <RotateCcw />
            রিসেট
          </Button>
          <Button
            type="button"
            size="sm"
            disabled={!isDirty || isSaving}
            onClick={handleSave}
          >
            {isSaving ? <Loader2 className="animate-spin" /> : null}
            {isSaving ? "সেভ হচ্ছে…" : "সেভ করুন"}
          </Button>
        </div>
      </div>
    </div>
  );
}
