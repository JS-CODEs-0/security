"use client";

import React from "react";
import { Shield, BookOpen, Sparkles } from "lucide-react";

interface TopHeaderProps {
  onOpenReader: () => void;
  onOpenAi: () => void;
  // Optional props for backward compatibility with parent call sites
  activeBook?: any;
  onSelectVolume?: (index: number) => void;
}

export function TopHeader({ onOpenReader, onOpenAi }: TopHeaderProps) {
  return (
    <header className="absolute top-0 left-0 right-0 z-40 h-13 sm:h-14 flex items-center justify-between px-2.5 xs:px-3 sm:px-8 bg-[#09060e]/90 sm:bg-[#09060e]/85 backdrop-blur-xl border-b border-[#c084fc]/15 pointer-events-auto shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
      {/* Left side: Brand Identity & Status */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-gradient-to-br from-[#8b5cf6] via-[#c084fc] to-[#f472b6] p-[1px] shadow-lg shadow-[#c084fc]/25 shrink-0">
          <div className="w-full h-full bg-[#0d091a] rounded-[10px] sm:rounded-[11px] flex items-center justify-center">
            <Shield className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#f472b6]" />
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2.5 min-w-0">
          <span className="text-[10px] xs:text-xs sm:text-sm font-bold tracking-[0.1em] sm:tracking-[0.16em] text-white uppercase font-sans whitespace-nowrap truncate">
            DIGITAL SAFETY <span className="text-[#c084fc]">INTELLIGENCE</span>
          </span>
          <span className="hidden min-[370px]:inline-flex items-center gap-1 sm:gap-1.5 px-1.5 sm:px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[8px] sm:text-[9px] font-mono text-emerald-400 shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="hidden sm:inline">GRID ACTIVE</span>
            <span className="sm:hidden">ACTIVE</span>
          </span>
        </div>
      </div>

      {/* Right side: Two Action Buttons */}
      <div className="flex items-center gap-1.5 xs:gap-2 sm:gap-3 shrink-0 ml-1">
        {/* Dedicated Reader button (Rose-Gold) */}
        <button
          onClick={onOpenReader}
          className="flex items-center gap-1 xs:gap-1.5 px-2.5 xs:px-3 sm:px-3.5 py-1.5 sm:py-1.5 min-h-[34px] sm:min-h-0 rounded-xl bg-gradient-to-r from-[#c084fc] via-[#f472b6] to-[#fb7185] text-[#09060e] font-bold text-[11px] sm:text-xs shadow-[0_0_16px_rgba(244,114,182,0.35)] hover:shadow-[0_0_22px_rgba(244,114,182,0.55)] transition-all cursor-pointer shrink-0"
          title="Open Dedicated Reader for currently selected book"
        >
          <BookOpen className="w-3.5 h-3.5 text-[#09060e] shrink-0" />
          <span className="hidden md:inline">Dedicated Reader</span>
          <span className="hidden xs:inline md:hidden">Reader</span>
          <span className="xs:hidden">Read</span>
        </button>

        {/* AI Copilot button (Subtle Outlined Glass) */}
        <button
          onClick={onOpenAi}
          className="flex items-center gap-1 xs:gap-1.5 px-2.5 xs:px-3 sm:px-3.5 py-1.5 sm:py-1.5 min-h-[34px] sm:min-h-0 rounded-xl bg-[#140b26]/70 hover:bg-[#1f103d]/90 border border-[#c084fc]/30 hover:border-[#f472b6]/50 text-[11px] sm:text-xs font-mono text-zinc-200 hover:text-white transition-all backdrop-blur-md cursor-pointer shrink-0"
          title="Open AI Intelligence Copilot"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#f472b6] shrink-0" />
          <span className="hidden md:inline">AI Copilot</span>
          <span className="hidden xs:inline md:hidden">Copilot</span>
          <span className="xs:hidden">AI</span>
        </button>
      </div>
    </header>
  );
}
