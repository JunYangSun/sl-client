"use client";
import { Bell } from "lucide-react";

interface AnnouncementBarProps {
  announcements?: string[];
}


export default function AnnouncementBar({ 
  announcements = [
    "示规则",
    "关于成长值停止累计通知",
    "海底捞线上订 >"
  ]
}: AnnouncementBarProps) {
  return (
    <>
      <div className="px-4 mb-4">
        <div className="bg-gray-50 rounded-lg px-3 py-2 flex items-center gap-2">
          <Bell className="h-4 w-4 text-red-500 shrink-0" />
          <div className="flex-1 overflow-hidden">
            <div className="text-xs text-gray-600 whitespace-nowrap">
              <div className="flex gap-4 animate-scroll">
                {announcements.flatMap((announcement, index) => [
                  <span key={index}>{announcement}</span>,
                  ...(index < announcements.length - 1 ? [<span key={`separator-${index}`}>•</span>] : [])
                ])}
                {/* 重复内容以实现无缝滚动 */}
                {announcements.flatMap((announcement, index) => [
                  <span key={`duplicate-${index}`}>{announcement}</span>,
                  ...(index < announcements.length - 1 ? [<span key={`duplicate-separator-${index}`}>•</span>] : [])
                ])}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 添加滚动动画样式 */}
      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-scroll {
          animation: scroll 15s linear infinite;
          will-change: transform;
        }
        .animate-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
    </>
  );
}

