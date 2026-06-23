"use client";

import { useState } from "react";
import { Button } from "@/shared/ui/components/Button/Button";
import { Input } from "@/shared/ui/components/Input/Input";
import { PaperAirplaneIcon } from "@heroicons/react/24/outline";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-hot-toast";

interface PropertyContactFormProps {
  propertyId: string;
  agentEmail?: string;
  propertyTitle?: string;
}

export const PropertyContactForm: React.FC<PropertyContactFormProps> = ({
  propertyId,
  agentEmail,
  propertyTitle,
}) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  const sendMutation = useMutation({
    mutationFn: (data: any) => axios.post("/api/contact", data),
    onSuccess: () => {
      toast.success("Message envoyé avec succès !");
      setName("");
      setEmail("");
      setPhone("");
      setMessage("");
    },
    onError: () => {
      toast.error("Erreur lors de l'envoi du message.");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMutation.mutate({
      name,
      email,
      phone,
      message:
        message ||
        `Bonjour, je suis intéressé(e) par le bien "${propertyTitle}".`,
      propertyId,
      agentEmail,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="font-heading text-lg">Contacter l'agent</h3>
      <Input
        label="Votre nom"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <Input
        label="Votre email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <Input
        label="Téléphone (optionnel)"
        type="tel"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />
      <div>
        <label className="block text-sm font-medium mb-1">Message</label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={4}
          placeholder={`Bonjour, je suis intéressé(e) par le bien "${propertyTitle || ""}".`}
          className="w-full rounded-md border border-primary-200 p-2.5 text-sm focus:ring-2 focus:ring-accent"
        />
      </div>
      <Button
        type="submit"
        variant="primary"
        size="md"
        className="w-full"
        disabled={sendMutation.isPending}
      >
        <PaperAirplaneIcon className="h-4 w-4 mr-2" />
        {sendMutation.isPending ? "Envoi..." : "Envoyer le message"}
      </Button>
    </form>
  );
};
