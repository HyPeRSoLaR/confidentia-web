'use client';
import { AiChatView } from '@/components/features/AiChatView';

export default function ChatPage() {
  return (
    <AiChatView
      title="AI Conversation"
      subtitle="Private, confidential — your conversations are never shared"
      privacyNote="Your conversations are end-to-end encrypted and never reviewed by humans."
    />
  );
}
