'use client';

import { ChatSidebar } from '@/widgets/ChatSidebar/ChatSidebar';

export default function MessagesLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-[calc(100vh-73px)] flex">
      <div className="w-80 lg:w-96 flex-shrink-0">
        <ChatSidebar />
      </div>
      <div className="flex-1 flex flex-col">{children}</div>
    </div>
  );
}
