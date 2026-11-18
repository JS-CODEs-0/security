"use client";

import React, { useState, useEffect } from "react";
import { CyberBook, BookPage, CYBER_BOOKS } from "@/data/cybersecurityBooks";
import { AiAssistantDrawer } from "./AiAssistantDrawer";
import {
  ChevronLeft,
  ChevronRight,
  X,
  BookOpen,
  Sparkles,
  Shield,
  FileCode,
  AlertOctagon,
  Copy,
  Check,
  ZoomIn,
  ZoomOut,
} from "lucide-react";

interface BookReaderModalProps {
  book: CyberBook;
  initialPageNumber?: number;
  isOpen: boolean;
  onClose: () => void;
  onSelectBook: (book: CyberBook) => void;
}

export function BookReaderModal({
  book,
  initialPageNumber = 1,
  isOpen,
  onClose,
  onSelectBook,
}: BookReaderModalProps) {
  const [currentPageIndex, setCurrentPageIndex] = useState(
    Math.max(0, Math.min(4, initialPageNumber - 1))
  );
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [fontSizeMultiplier, setFontSizeMultiplier] = useState(1);
  const [isTocOpen, setIsTocOpen] = useState(false);
  const [copiedSnippet, setCopiedSnippet] = useState<string | null>(null);

  // Sync initialPageNumber when changed
  useEffect(() => {
    setCurrentPageIndex(Math.max(0, Math.min(4, initialPageNumber - 1)));
  }, [initialPageNumber, book.id]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (isAiOpen) setIsAiOpen(false);
        else onClose();
      } else if (e.key === "ArrowLeft") {
        setCurrentPageIndex((prev) => Math.max(0, prev - 1));
      } else if (e.key === "ArrowRight") {
        setCurrentPageIndex((prev) => Math.min(book.pages.length - 1, prev + 1));
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isAiOpen, book.pages.length, onClose]);

  if (!isOpen) return null;

  const currentPage = book.pages[currentPageIndex] || book.pages[0];

  const handleCopyCode = (id: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedSnippet(id);
    setTimeout(() => setCopiedSnippet(null), 2000);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-[#09060e]/96 backdrop-blur-2xl flex flex-col overflow-hidden text-zinc-100"
      role="dialog"
      aria-modal="true"
      aria-label={`Reading ${book.title}`}
    >
      {/* Top Reader Navigation Bar */}
      <header className="flex items-center justify-between px-4 sm:px-8 py-3.5 border-b border-[#c084fc]/20 bg-[#0c0818]/90 shrink-0 shadow-lg">
        <div className="flex items-center gap-4">
          <button
            onClick={onClose}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-mono text-zinc-300 hover:text-white bg-[#140b26] hover:bg-[#1f103d] border border-[#c084fc]/30 transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-3.5 h-3.5 text-[#f472b6]" />
            <span>Return to Shelf</span>
          </button>

          <div className="h-4 w-px bg-white/10 hidden sm:block" />

          {/* Volume Switcher Dropdown */}
          <div className="relative group hidden sm:block">
            <button className="flex items-center gap-2 text-xs font-mono text-zinc-300 hover:text-white transition-colors cursor-pointer">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: book.foil }} />
              <span className="font-semibold text-[#f472b6]">0{book.number}:</span>
              <span className="text-white font-medium">{book.title}</span>
            </button>
            <div className="absolute top-full left-0 mt-2 w-72 bg-[#0e091c] border border-[#c084fc]/30 rounded-2xl shadow-2xl p-2 hidden group-hover:block z-50 backdrop-blur-2xl">
              <div className="px-3 py-1.5 text-[10px] font-mono text-zinc-400 uppercase tracking-wider">
                Select Digital Safety Book
              </div>
              {CYBER_BOOKS.map((b) => (
                <button
                  key={b.id}
                  onClick={() => {
                    onSelectBook(b);
                    setCurrentPageIndex(0);
                  }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-left transition-colors cursor-pointer ${
                    b.id === book.id
                      ? "bg-[#c084fc]/20 text-[#f472b6] font-semibold border border-[#c084fc]/40"
                      : "text-zinc-300 hover:bg-white/5"
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: b.foil }} />
                  <span className="font-mono text-[11px] text-[#c084fc]">0{b.number}</span>
                  <span className="truncate">{b.title}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Center Page Progress Indicator */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-zinc-400 hidden md:inline">
            Page {currentPage.pageNumber} of {book.pages.length}
          </span>
          <div className="flex items-center gap-1.5 bg-[#140b26] p-1 rounded-full border border-[#c084fc]/25">
            {book.pages.map((p, idx) => (
              <button
                key={p.pageNumber}
                onClick={() => setCurrentPageIndex(idx)}
                className={`w-2.5 h-2.5 rounded-full transition-all cursor-pointer ${
                  idx === currentPageIndex
                    ? "bg-gradient-to-r from-[#c084fc] to-[#f472b6] w-6"
                    : "bg-white/20 hover:bg-white/40"
                }`}
                title={`Go to Page ${p.pageNumber}: ${p.title}`}
                aria-label={`Go to page ${p.pageNumber}`}
              />
            ))}
          </div>
        </div>

        {/* Right Tools & AI Launcher */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Font Controls */}
          <div className="hidden lg:flex items-center gap-1 bg-[#140b26] border border-[#c084fc]/25 rounded-xl p-0.5">
            <button
              onClick={() => setFontSizeMultiplier((prev) => Math.max(0.85, prev - 0.1))}
              className="p-1.5 text-zinc-400 hover:text-white transition-colors cursor-pointer"
              title="Decrease text size"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-[10px] font-mono text-[#c084fc] px-1">
              {Math.round(fontSizeMultiplier * 100)}%
            </span>
            <button
              onClick={() => setFontSizeMultiplier((prev) => Math.min(1.35, prev + 0.1))}
              className="p-1.5 text-zinc-400 hover:text-white transition-colors cursor-pointer"
              title="Increase text size"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* AI Copilot Trigger Button */}
          <button
            onClick={() => setIsAiOpen(!isAiOpen)}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
              isAiOpen
                ? "bg-gradient-to-r from-[#8b5cf6] to-[#f472b6] text-[#0b0714] font-bold border-transparent shadow-[0_0_16px_rgba(244,114,182,0.4)]"
                : "bg-[#140b26] text-zinc-200 hover:text-white border-[#c084fc]/30 hover:border-[#f472b6]/60"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#f472b6]" />
            <span className="hidden sm:inline">AI Copilot</span>
          </button>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
            aria-label="Close reader"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Reading Frame */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Table of Contents Sidebar */}
        <aside
          className={`w-72 bg-[#0c0818] border-r border-[#c084fc]/15 flex flex-col shrink-0 transition-all ${
            isTocOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
          } absolute md:relative z-20 h-full`}
        >
          <div className="p-4 border-b border-white/5">
            <span className="text-[10px] font-mono tracking-widest text-[#f472b6] uppercase block mb-1">
              Book 0{book.number} · 5 Pages
            </span>
            <h3 className="text-sm font-bold text-white font-serif tracking-tight">
              {book.title}
            </h3>
            <p className="text-[11px] text-zinc-400 mt-0.5 line-clamp-1">{book.discipline}</p>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
            {book.pages.map((p, idx) => (
              <button
                key={p.pageNumber}
                onClick={() => {
                  setCurrentPageIndex(idx);
                  setIsTocOpen(false);
                }}
                className={`w-full text-left p-3 rounded-xl transition-all flex items-start gap-3 group cursor-pointer ${
                  idx === currentPageIndex
                    ? "bg-[#c084fc]/15 border border-[#c084fc]/40 text-white shadow-[0_0_12px_rgba(192,132,252,0.15)]"
                    : "hover:bg-white/5 text-zinc-400 border border-transparent"
                }`}
              >
                <span
                  className={`w-6 h-6 rounded-lg flex items-center justify-center font-mono text-[11px] shrink-0 font-bold ${
                    idx === currentPageIndex
                      ? "bg-gradient-to-br from-[#c084fc] to-[#f472b6] text-[#0b0714]"
                      : "bg-[#140b26] text-zinc-400 group-hover:text-zinc-200"
                  }`}
                >
                  0{p.pageNumber}
                </span>
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-mono uppercase tracking-wider block text-zinc-500">
                    {p.category}
                  </span>
                  <p
                    className={`text-xs font-medium leading-snug truncate ${
                      idx === currentPageIndex ? "text-white" : "group-hover:text-zinc-200"
                    }`}
                  >
                    {p.title}
                  </p>
                </div>
              </button>
            ))}
          </div>

          {/* Book Metadata Footer */}
          <div className="p-4 border-t border-white/5 bg-black/40 text-[10px] font-mono text-zinc-400 space-y-1.5">
            <div className="flex justify-between">
              <span className="text-zinc-500">BINDING:</span>
              <span className="truncate max-w-[130px]">{book.binding}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">PALETTE:</span>
              <span className="text-[#c084fc] truncate max-w-[130px]">{book.paletteLabel}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">TOTAL:</span>
              <span className="text-[#f472b6]">5 Interactive Pages</span>
            </div>
          </div>
        </aside>

        {/* Center Editorial Reading Surface */}
        <main
          className="flex-1 overflow-y-auto px-4 sm:px-12 md:px-20 py-8 sm:py-12 bg-gradient-to-b from-[#0e091c] via-[#09060e] to-[#07040d]"
          style={{ fontSize: `${fontSizeMultiplier}rem` }}
        >
          <div className="max-w-3xl mx-auto space-y-8">
            {/* Page Header */}
            <div className="space-y-3 pb-6 border-b border-[#c084fc]/15">
              <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
                <span className="flex items-center gap-2">
                  <Shield className="w-3.5 h-3.5 text-[#f472b6]" />
                  <span>
                    DIGITAL SAFETY INTELLIGENCE // BOOK 0{book.number} · PAGE {currentPage.pageNumber} OF 5
                  </span>
                </span>
                <span className="px-2 py-0.5 rounded-full bg-[#c084fc]/15 border border-[#c084fc]/30 uppercase tracking-widest text-[9px] text-[#c084fc]">
                  {currentPage.category}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-white tracking-tight leading-tight">
                {currentPage.title}
              </h1>
              <p className="text-sm sm:text-base font-serif italic text-zinc-400">
                {currentPage.subtitle}
              </p>
            </div>

            {/* Lead Directive Box */}
            <div className="p-4 sm:p-5 rounded-2xl bg-[#140b26]/70 border border-[#c084fc]/25 text-zinc-200 text-sm sm:text-base leading-relaxed font-serif shadow-lg">
              <span className="font-semibold text-[#f472b6]">Directive: </span>
              {currentPage.content.lead}
            </div>

            {/* Page Sections */}
            <div className="space-y-8">
              {currentPage.content.sections.map((section, sIdx) => (
                <section key={sIdx} className="space-y-4">
                  <h2 className="text-lg sm:text-xl font-serif font-bold text-white tracking-tight flex items-center gap-2">
                    <span className="text-[#c084fc] font-mono text-sm">§{sIdx + 1}</span>
                    {section.heading}
                  </h2>

                  <p className="text-xs sm:text-sm leading-relaxed text-zinc-300 font-sans whitespace-pre-line">
                    {section.body}
                  </p>

                  {/* Operational Callouts */}
                  {section.callout && (
                    <div
                      className={`p-4 rounded-xl border flex items-start gap-3.5 ${
                        section.callout.type === "critical"
                          ? "bg-rose-950/30 border-rose-800/50 text-rose-200"
                          : section.callout.type === "mitre"
                          ? "bg-purple-950/30 border-purple-800/50 text-purple-200"
                          : "bg-indigo-950/30 border-indigo-800/50 text-indigo-200"
                      }`}
                    >
                      <AlertOctagon className="w-5 h-5 shrink-0 mt-0.5 text-current" />
                      <div>
                        <h4 className="text-xs font-bold font-mono tracking-wider uppercase mb-1">
                          {section.callout.title}
                        </h4>
                        <p className="text-xs leading-relaxed text-zinc-300">
                          {section.callout.text}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Syntax Highlighted Code Blocks */}
                  {section.codeBlock && (
                    <div className="rounded-xl overflow-hidden border border-[#c084fc]/20 bg-[#080510]">
                      <div className="flex items-center justify-between px-4 py-2 bg-[#10091d] border-b border-white/5 text-[11px] font-mono text-zinc-400">
                        <div className="flex items-center gap-2">
                          <FileCode className="w-3.5 h-3.5 text-[#c084fc]" />
                          <span>{section.codeBlock.filename || "Security Directive"}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-[10px] text-[#f472b6] uppercase font-bold">
                            {section.codeBlock.language}
                          </span>
                          <button
                            onClick={() =>
                              handleCopyCode(`code-${sIdx}`, section.codeBlock!.code)
                            }
                            className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer"
                          >
                            {copiedSnippet === `code-${sIdx}` ? (
                              <>
                                <Check className="w-3 h-3 text-emerald-400" />
                                <span className="text-emerald-400">Copied</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" />
                                <span>Copy</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                      <pre className="p-4 text-xs font-mono text-[#d8b4fe] overflow-x-auto leading-relaxed bg-[#080510]">
                        <code>{section.codeBlock.code}</code>
                      </pre>
                    </div>
                  )}

                  {/* Bulleted Points */}
                  {section.bulletPoints && (
                    <ul className="space-y-2 pl-2">
                      {section.bulletPoints.map((point, ptIdx) => (
                        <li
                          key={ptIdx}
                          className="flex items-start gap-2.5 text-xs sm:text-sm text-zinc-300"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-[#f472b6] shrink-0 mt-2" />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </section>
              ))}
            </div>

            {/* Bottom Page Navigation Controls */}
            <div className="pt-8 pb-12 border-t border-[#c084fc]/20 flex flex-col sm:flex-row items-center justify-between gap-4">
              <button
                onClick={() => setCurrentPageIndex((prev) => Math.max(0, prev - 1))}
                disabled={currentPageIndex === 0}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-mono bg-[#140b26] hover:bg-[#1e1039] border border-[#c084fc]/30 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4 text-[#f472b6]" />
                <span>Previous Page (P{Math.max(1, currentPage.pageNumber - 1)})</span>
              </button>

              <button
                onClick={() => setIsAiOpen(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono text-[#f472b6] bg-[#f472b6]/10 hover:bg-[#f472b6]/20 border border-[#f472b6]/30 transition-colors cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Consult Copilot on Page {currentPage.pageNumber}</span>
              </button>

              <button
                onClick={() =>
                  setCurrentPageIndex((prev) => Math.min(book.pages.length - 1, prev + 1))
                }
                disabled={currentPageIndex === book.pages.length - 1}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-mono bg-gradient-to-r from-[#8b5cf6] to-[#f472b6] text-[#0b0714] font-bold disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer shadow-lg shadow-[#f472b6]/20"
              >
                <span>Next Page (P{Math.min(book.pages.length, currentPage.pageNumber + 1)})</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </main>

        {/* Dedicated AI Assistant Drawer */}
        <AiAssistantDrawer
          book={book}
          currentPage={currentPage}
          isOpen={isAiOpen}
          onClose={() => setIsAiOpen(false)}
        />
      </div>
    </div>
  );
}
