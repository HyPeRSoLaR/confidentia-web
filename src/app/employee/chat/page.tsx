'use client';
import { AiChatView } from '@/components/features/AiChatView';

export default function EmployeeChatPage() {
  return (
    <AiChatView
      title="AI Well-being Chat"
      subtitle="Confidential support — your employer cannot see your conversations"
      privacyNote="Your conversations are end-to-end encrypted. Your employer only receives anonymized, aggregated well-being trends — never individual messages."
    />
  );
}
