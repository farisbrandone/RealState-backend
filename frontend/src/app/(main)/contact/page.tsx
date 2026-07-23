"use client";

import { useState } from "react";
import { Button } from "@/shared/ui/components/Button/Button";
import { Input } from "@/shared/ui/components/Input/Input";
import { Card } from "@/shared/ui/components/Card/Card";
import { toast } from "react-hot-toast";
import {
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulation d'envoi
    await new Promise((resolve) => setTimeout(resolve, 1000));
    toast.success("Message envoyé avec succès !");
    setName("");
    setEmail("");
    setSubject("");
    setMessage("");
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen">
      <section className="bg-ink py-16 px-4 text-center">
        <h1 className="text-4xl font-heading font-bold text-white mb-4">
          Contactez-nous
        </h1>
        <p className="text-white/70 max-w-2xl mx-auto">
          Une question ? Un projet ? Notre équipe est à votre écoute.
        </p>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Informations de contact */}
          <div className="space-y-6">
            <Card className="text-center">
              <PhoneIcon className="h-8 w-8 text-accent mx-auto mb-2" />
              <h3 className="font-heading text-lg mb-1">Téléphone</h3>
              <p className="text-primary-600">+237 6 00 00 00 00</p>
            </Card>
            <Card className="text-center">
              <EnvelopeIcon className="h-8 w-8 text-accent mx-auto mb-2" />
              <h3 className="font-heading text-lg mb-1">Email</h3>
              <p className="text-primary-600">contact@luxhorizon.com</p>
            </Card>
            <Card className="text-center">
              <MapPinIcon className="h-8 w-8 text-accent mx-auto mb-2" />
              <h3 className="font-heading text-lg mb-1">Adresse</h3>
              <p className="text-primary-600">Douala, Cameroun</p>
            </Card>
            <Card className="text-center">
              <ClockIcon className="h-8 w-8 text-accent mx-auto mb-2" />
              <h3 className="font-heading text-lg mb-1">Horaires</h3>
              <p className="text-primary-600">Lun-Ven : 8h-18h</p>
              <p className="text-primary-600">Sam : 9h-14h</p>
            </Card>
          </div>

          {/* Formulaire */}
          <div className="lg:col-span-2">
            <Card>
              <h2 className="text-xl font-heading mb-6">
                Envoyez-nous un message
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                </div>
                <Input
                  label="Sujet"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  required
                />
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Message
                  </label>
                  <textarea
                    title="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={6}
                    className="w-full rounded-lg border border-primary-200 p-3 focus:ring-2 focus:ring-accent"
                    required
                  />
                </div>
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Envoi..." : "Envoyer le message"}
                </Button>
              </form>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
