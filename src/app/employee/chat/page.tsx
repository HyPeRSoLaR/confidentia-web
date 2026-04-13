'use client';
import { AiChatView } from '@/components/features/AiChatView';

export default function EmployeeChatPage() {
  return (
    <AiChatView
      title="Chat IA Bien-être"
      subtitle="Soutien confidentiel — votre employeur ne peut pas voir vos conversations"
      privacyNote="Vos conversations sont chiffrées de bout en bout. Votre employeur reçoit uniquement des tendances agrégées et anonymisées — jamais de messages individuels."
    />
  );
}
