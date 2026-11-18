"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { CompleteShelfLandingPage } from "@/shaders/landing-pages/CompleteShelfLandingPage";
import { CYBER_BOOKS } from "@/data/cybersecurityBooks";
import { TopHeader } from "@/components/TopHeader";
import { BookReaderModal } from "@/components/BookReaderModal";
import { AiAssistantDrawer } from "@/components/AiAssistantDrawer";

export default function Home() {
  const [activeBookIndex, setActiveBookIndex] = useState(0);
  const [isReaderOpen, setIsReaderOpen] = useState(false);
  const [isStandaloneAiOpen, setIsStandaloneAiOpen] = useState(false);
  const [initialReaderPage, setInitialReaderPage] = useState(1);
  const frameContainerRef = useRef<HTMLDivElement>(null);

  const activeBook = CYBER_BOOKS[activeBookIndex] || CYBER_BOOKS[0];

  // Post messages to the Three.js iframe inside CompleteShelfLandingPage
  const postToShelfIframe = useCallback((payload: Record<string, any>) => {
    if (!frameContainerRef.current) return;
    const iframe = frameContainerRef.current.querySelector("iframe");
    if (iframe?.contentWindow) {
      iframe.contentWindow.postMessage(payload, "*");
    }
  }, []);

  // Listen for iframe events
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (!event.data || typeof event.data !== "object") return;

      if (event.data.type === "SHELF_VOLUME_CHANGED") {
        if (typeof event.data.index === "number" && CYBER_BOOKS[event.data.index]) {
          setActiveBookIndex(event.data.index);
        }
      } else if (event.data.type === "OPEN_READER") {
        if (typeof event.data.index === "number" && CYBER_BOOKS[event.data.index]) {
          setActiveBookIndex(event.data.index);
        }
        setInitialReaderPage(1);
        setIsReaderOpen(true);
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  // Handle header volume selection
  const handleSelectVolume = (index: number) => {
    setActiveBookIndex(index);
    postToShelfIframe({
      type: "OPEN_VOLUME",
      index,
    });
  };

  const handleOpenReader = () => {
    setIsReaderOpen(true);
  };

  const handleOpenAi = () => {
    setIsStandaloneAiOpen(true);
  };

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-[#09060e] flex flex-col">
      {/* Top Floating Cyber Intelligence Header */}
      <TopHeader
        activeBook={activeBook}
        onSelectVolume={handleSelectVolume}
        onOpenReader={handleOpenReader}
        onOpenAi={handleOpenAi}
      />

      {/* The Exact ThreeUI Complete Shelf Landing Page Component */}
      <div ref={frameContainerRef} className="shader-frame w-full h-full relative flex-1">
        <CompleteShelfLandingPage
          headingFont="iowan-old-style"
          bodyFont="inter"
          headingWeight="400"
          bodyWeight="400"
          primaryColor="#c084fc"
          headingSize={60}
          bodySize={12}
          headingLetterSpacing={-0.055}
          style={{ width: "100%", height: "100%", background: "#09060e" }}
        />
      </div>

      {/* Dedicated Reading Interface (All 7 Books · Exactly 5 Pages Each) */}
      <BookReaderModal
        book={activeBook}
        initialPageNumber={initialReaderPage}
        isOpen={isReaderOpen}
        onClose={() => setIsReaderOpen(false)}
        onSelectBook={(selectedBook) => {
          const idx = CYBER_BOOKS.findIndex((b) => b.id === selectedBook.id);
          if (idx !== -1) {
            handleSelectVolume(idx);
          }
        }}
      />

      {/* Standalone AI Intelligence Assistant Triggered from Header */}
      <AiAssistantDrawer
        book={activeBook}
        currentPage={activeBook.pages[0]}
        isOpen={isStandaloneAiOpen}
        onClose={() => setIsStandaloneAiOpen(false)}
      />
    </main>
  );
}
