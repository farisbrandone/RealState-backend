"use client";

import { useState, useRef, useEffect } from "react";
import { useChatMessages } from "@/features/chat/hooks/useChatMessages";
import { useChatStore } from "@/features/chat/stores/chat.store";
import { useSendMessage } from "@/features/chat/hooks/useSendMessage";
import { useTyping } from "@/features/chat/hooks/useTyping";
import { useAuthStore } from "@/features/auth/stores/auth.store";
import { usePresence } from "@/features/user-profile/hooks/usePresence";
import { chatApi } from "@/features/chat/api/chat.api";
import { getMediaUrl } from "@/shared/lib/media/media-url";
import { toast } from "react-hot-toast";
import {
  PaperAirplaneIcon,
  PaperClipIcon,
  FaceSmileIcon,
  ArrowLeftIcon,
  PhoneIcon,
  VideoCameraIcon,
  CheckIcon,
  CheckCircleIcon,
  DocumentIcon,
} from "@heroicons/react/24/outline";

interface ChatWindowProps {
  conversationId: string;
  onBack?: () => void;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({
  conversationId,
  onBack,
}) => {
  const [input, setInput] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);
  const [isUploadingAttachment, setIsUploadingAttachment] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: messagesData, isLoading } = useChatMessages(conversationId);
  const messages = useChatStore((s) => s.messages[conversationId] || []);
  const typingUsers = useChatStore((s) => s.typingUsers[conversationId] || []);
  const currentUser = useAuthStore((s) => s.user);
  const sendMutation = useSendMessage();
  const { startTyping, stopTyping } = useTyping(conversationId);

  // Conversation et interlocuteur
  const conversation = useChatStore((s) =>
    s.conversations.find((c) => c.id === conversationId),
  );
  const otherParticipant = conversation?.participants.find(
    (p) => p.userId !== currentUser?.id,
  );
  const otherUser = otherParticipant?.user;
  const { online } = usePresence(otherUser?.id || "");

  // Scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    sendMutation.mutate(
      { conversationId, content: input, type: "TEXT" },
      { onSuccess: () => setInput("") },
    );
    stopTyping();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    if (e.target.value.trim()) startTyping();
    else stopTyping();
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    setIsUploadingAttachment(true);
    try {
      const { data: attachment } = await chatApi.uploadAttachment(file);
      sendMutation.mutate({
        conversationId,
        content: file.name,
        type: attachment.type === "file" ? "FILE" : "IMAGE",
        attachments: [attachment],
      });
    } catch {
      toast.error("Échec de l'envoi de la pièce jointe");
    } finally {
      setIsUploadingAttachment(false);
    }
  };

  // Grouper les messages par date
  const groupedMessages = messages.reduce((groups: any[], msg: any) => {
    const date = new Date(msg.sentAt).toLocaleDateString("fr-FR", {
      weekday: "long",
      day: "numeric",
      month: "long",
    });
    const lastGroup = groups[groups.length - 1];
    if (lastGroup?.date === date) {
      lastGroup.messages.push(msg);
    } else {
      groups.push({ date, messages: [msg] });
    }
    return groups;
  }, []);

  return (
    <div className="flex flex-col h-full bg-[#e8e2d9]">
      {/* En-tête */}
      <div className="px-4 py-3 bg-surface border-b border-primary-100 flex items-center gap-3 z-10">
        <button
          type="button"
          title="Retour"
          onClick={onBack}
          className="md:hidden p-1 hover:bg-primary-50 rounded-lg"
        >
          <ArrowLeftIcon className="h-5 w-5 text-primary-600" />
        </button>
        <img
          src={otherUser?.avatarUrl || "/images/avatar-placeholder.png"}
          alt=""
          className="w-10 h-10 rounded-full object-cover"
        />
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-primary-900 truncate">
            {otherUser?.firstName} {otherUser?.lastName}
          </h3>
          <p className="text-xs text-primary-400">
            {typingUsers.length > 0
              ? "En train d'écrire..."
              : online
                ? "En ligne"
                : "Hors ligne"}
          </p>
        </div>
        <div className="flex items-center gap-1">
          {/* Appels audio/vidéo : pas encore implémentés (nécessitent une
              infrastructure WebRTC dédiée) — désactivés plutôt que factices,
              pour ne pas laisser croire à une fonctionnalité qui n'agit pas. */}
          <button
            type="button"
            disabled
            className="p-2 rounded-lg cursor-not-allowed opacity-40"
            title="Appel audio — bientôt disponible"
          >
            <PhoneIcon className="h-5 w-5 text-primary-400" />
          </button>
          <button
            type="button"
            disabled
            className="p-2 rounded-lg cursor-not-allowed opacity-40"
            title="Appel vidéo — bientôt disponible"
          >
            <VideoCameraIcon className="h-5 w-5 text-primary-400" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className={`flex ${i % 2 === 0 ? "justify-start" : "justify-end"}`}
              >
                <div
                  className={`h-12 w-36 ${i % 2 === 0 ? "bg-surface" : "bg-accent/20"} rounded-2xl animate-pulse`}
                />
              </div>
            ))}
          </div>
        ) : (
          groupedMessages.map((group: any, groupIdx: number) => (
            <div key={groupIdx}>
              <div className="flex justify-center mb-6">
                <span className="text-xs bg-white/80 backdrop-blur-sm text-primary-500 px-3 py-1 rounded-full shadow-sm">
                  {group.date}
                </span>
              </div>
              <div className="space-y-1">
                {group.messages.map((msg: any) => {
                  const isMine = msg.senderId === currentUser?.id;
                  return (
                    <div
                      key={msg.id}
                      className={`flex ${isMine ? "justify-end" : "justify-start"} mb-1`}
                    >
                      <div
                        className={`max-w-[75%] px-4 py-2.5 shadow-sm ${
                          isMine
                            ? "bg-[#d9fdd3] rounded-t-2xl rounded-l-2xl rounded-br-md"
                            : "bg-surface rounded-t-2xl rounded-r-2xl rounded-bl-md"
                        }`}
                      >
                        {msg.attachments?.length > 0 && (
                          <div className="mb-1.5 space-y-1.5">
                            {msg.attachments.map(
                              (att: {
                                id: string;
                                url: string;
                                type: string;
                              }) =>
                                att.type === "image" ? (
                                  <a
                                    key={att.id}
                                    href={getMediaUrl(att.url) ?? att.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    <img
                                      src={getMediaUrl(att.url) ?? att.url}
                                      alt="Pièce jointe"
                                      className="max-h-48 rounded-lg object-cover"
                                    />
                                  </a>
                                ) : (
                                  <a
                                    key={att.id}
                                    href={getMediaUrl(att.url) ?? att.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 rounded-lg bg-black/5 px-3 py-2 text-xs text-primary-700 hover:bg-black/10"
                                  >
                                    <DocumentIcon className="h-4 w-4 shrink-0" />
                                    <span className="truncate">
                                      {msg.content || "Fichier joint"}
                                    </span>
                                  </a>
                                ),
                            )}
                          </div>
                        )}
                        {!msg.attachments?.length && (
                          <p className="text-sm text-primary-900 whitespace-pre-wrap break-words">
                            {msg.content}
                          </p>
                        )}
                        <div
                          className={`flex items-center gap-1 justify-end mt-0.5`}
                        >
                          <span className="text-[10px] text-primary-400">
                            {new Date(msg.sentAt).toLocaleTimeString("fr-FR", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                          {isMine &&
                            (msg.status === "READ" ? (
                              <CheckCircleIcon className="h-3.5 w-3.5 text-blue-500" />
                            ) : (
                              <CheckIcon className="h-3.5 w-3.5 text-primary-300" />
                            ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Barre de saisie */}
      <div className="px-4 py-3 bg-surface border-t border-primary-100">
        <div className="flex items-end gap-2">
          <button
            type="button"
            title="Émojis"
            onClick={() => setShowEmoji(!showEmoji)}
            className="p-2 hover:bg-primary-50 rounded-lg transition-colors"
          >
            <FaceSmileIcon className="h-5 w-5 text-primary-400" />
          </button>
          <input
            title="Joindre un fichier"
            ref={fileInputRef}
            type="file"
            onChange={handleFileUpload}
            className="hidden"
            accept="image/*,application/pdf"
          />
          <button
            type="button"
            title="Joindre un fichier"
            disabled={isUploadingAttachment}
            onClick={() => fileInputRef.current?.click()}
            className="p-2 hover:bg-primary-50 rounded-lg transition-colors disabled:opacity-50"
          >
            <PaperClipIcon
              className={`h-5 w-5 text-primary-400 ${isUploadingAttachment ? "animate-pulse" : ""}`}
            />
          </button>
          <textarea
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Message"
            className="flex-1 resize-none border-0 bg-primary-50 rounded-2xl px-4 py-2.5 focus:ring-2 focus:ring-accent text-sm max-h-32"
            rows={1}
          />
          <button
            type="button"
            title="Envoyer"
            onClick={handleSend}
            disabled={!input.trim() || sendMutation.isPending}
            className="bg-accent text-ink p-2.5 rounded-full hover:bg-accent-dark disabled:opacity-50 transition-colors"
          >
            <PaperAirplaneIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
