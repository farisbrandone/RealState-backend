"use client";

import { useEffect, useState } from "react";
import { ShareIcon, ClipboardIcon } from "@heroicons/react/24/outline";
import { toast } from "react-hot-toast";

interface PropertyShareProps {
  propertyId: string;
  propertyTitle: string;
}

export const PropertyShare: React.FC<PropertyShareProps> = ({
  propertyId,
  propertyTitle,
}) => {
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState("");
  //const url = `${window.location.origin}/properties/${propertyId}`;
  const text = encodeURIComponent(
    `Découvrez "${propertyTitle}" sur LuxHorizon !`,
  );

  useEffect(() => {
    setUrl(window.location.origin + `/properties/${propertyId}`);
  }, [propertyId]);

  const shareLinks = [
    {
      label: "WhatsApp",
      href: `https://wa.me/?text=${text}%20${encodeURIComponent(url)}`,
      color: "bg-green-500",
      icon: "💬",
    },
    {
      label: "Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      color: "bg-blue-600",
      icon: "📘",
    },
    {
      label: "Twitter / X",
      href: `https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(url)}`,
      color: "bg-sky-500",
      icon: "🐦",
    },
    {
      label: "Copier le lien",
      onClick: () => {
        navigator.clipboard.writeText(url);
        toast.success("Lien copié !");
      },
      color: "bg-primary-500",
      icon: "🔗",
    },
  ];

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 text-sm text-primary-600 hover:text-accent transition-colors"
      >
        <ShareIcon className="h-5 w-5" />
        Partager
      </button>

      {open && (
        <div className="absolute bottom-full right-0 mb-2 bg-white shadow-card rounded-xl p-3 z-20 w-48">
          <div className="space-y-2">
            {shareLinks.map((link, idx) =>
              link.href ? (
                <a
                  key={idx}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-primary-50 text-sm"
                  onClick={() => setOpen(false)}
                >
                  <span>{link.icon}</span>
                  {link.label}
                </a>
              ) : (
                <button
                  key={idx}
                  onClick={() => {
                    link.onClick?.();
                    setOpen(false);
                  }}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-primary-50 text-sm w-full"
                >
                  <ClipboardIcon className="h-4 w-4" />
                  {link.label}
                </button>
              ),
            )}
          </div>
        </div>
      )}
    </div>
  );
};
