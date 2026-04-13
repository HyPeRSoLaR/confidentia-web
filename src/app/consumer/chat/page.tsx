'use client';
import { AiChatView } from '@/components/features/AiChatView';

export default function ChatPage() {
  return (
    <AiChatView
      title="Conversation IA"
      subtitle="Privé et confidentiel — vos conversations ne sont jamais partagées"
      privacyNote="Vos conversations sont chiffrées de bout en bout et ne sont jamais consultées par des humains."
    />
  );
}
