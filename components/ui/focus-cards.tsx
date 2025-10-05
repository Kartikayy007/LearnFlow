"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import ButtonCrossArrow from "./ButtonCrossArrow";
import Link from "next/link";

export const Card = React.memo(
  ({
    card,
    index,
    hovered,
    setHovered,
  }: {
    card: any;
    index: number;
    hovered: number | null;
    setHovered: React.Dispatch<React.SetStateAction<number | null>>;
  }) => {
    const content = (
      <div
        onMouseEnter={() => setHovered(index)}
        onMouseLeave={() => setHovered(null)}
        className={cn(
          "rounded-lg relative bg-card overflow-hidden h-20 md:h-60 w-full transition-all duration-300 ease-out",
          hovered !== null && hovered !== index && "blur-sm scale-[0.98]"
        )}
      >
        <img
          src={card.src}
          alt={card.title}
          className="object-cover absolute inset-0"
        />
        <div
          className={cn(
            "absolute inset-0 bg-background/50 flex items-end justify-start p-4 transition-opacity duration-300",
            hovered === index ? "opacity-100" : "opacity-0"
          )}
        >
          <ButtonCrossArrow text={card.title} />
        </div>
      </div>
    );

    if (card.href) {
      return <Link href={card.href}>{content}</Link>;
    }

    return content;
  }
);

Card.displayName = "Card";

type Card = {
  title: string;
  src: string;
  href?: string;
};

export function FocusCards({ cards }: { cards: Card[] }) {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-5xl mx-auto w-full cursor-pointer rounded-2xl">
      {cards.map((card, index) => (
        <Card
          key={card.title}
          card={card}
          index={index}
          hovered={hovered}
          setHovered={setHovered}
        />
      ))}
    </div>
  );
}
