import React, { useState } from 'react';
import { MarkerPoint, getCategoryTheme } from '../data';
import { useMapStore } from '../store/useMapStore';
import {
  X,
  Link2,
  Share2,
  Check,
  Sparkles,
  Play,
  Youtube,
  ArrowRightLeft,
  ArrowDownCircle,
  ArrowUpCircle,
  ChevronRight,
  MapPin,
  Gem,
  Gift,
  Info,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface MarkerPopoverProps {
  marker: MarkerPoint;
  onClose: () => void;
}

// Parse markdown inline links [text](url) and **bold**
function parseMarkdownTokens(line: string): React.ReactNode {
  if (!line) return null;
  const regex = /(\[[^\]]+\]\([^)]+\)|\*\*[^*]+\*\*)/g;
  const parts = line.split(regex);

  return parts.map((part, i) => {
    // Markdown link: [text](url)
    const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (linkMatch) {
      return (
        <a
          key={i}
          href={linkMatch[2]}
          target="_blank"
          rel="noopener noreferrer"
          className="text-totk-zonai hover:underline inline-flex items-center gap-0.5"
          onClick={(e) => e.stopPropagation()}
        >
          {linkMatch[1]}
        </a>
      );
    }

    // Markdown bold: **bold**
    const boldMatch = part.match(/^\*\*([^*]+)\*\*$/);
    if (boldMatch) {
      return (
        <strong key={i} className="text-white font-bold">
          {boldMatch[1]}
        </strong>
      );
    }

    return part;
  });
}

// Render multiline markdown with bullet lists and paragraphs
function renderMarkdownContent(content: string): React.ReactNode {
  if (!content) return null;

  const lines = content.split('\n');
  return (
    <div className="space-y-1.5 text-xs text-gray-300 leading-relaxed">
      {lines.map((line, idx) => {
        const trimmed = line.trim();
        if (!trimmed) return <div key={idx} className="h-0.5" />;

        // Bullet point: "- text" or "* text"
        const isBullet = trimmed.startsWith('- ') || trimmed.startsWith('* ');
        const cleanLine = isBullet ? trimmed.slice(2) : trimmed;

        const formatted = parseMarkdownTokens(cleanLine);

        if (isBullet) {
          return (
            <div key={idx} className="flex items-start gap-2 pl-1">
              <span className="text-totk-gold shrink-0">•</span>
              <span className="flex-1 text-gray-200">{formatted}</span>
            </div>
          );
        }

        return (
          <p key={idx} className="text-gray-200">
            {formatted}
          </p>
        );
      })}
    </div>
  );
}

export const MarkerPopover: React.FC<MarkerPopoverProps> = ({ marker, onClose }) => {
  const { completedItems, toggleCompleted, jumpToTwin } = useMapStore();
  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState(false);

  const isDone = completedItems[marker.id] || false;

  const handleCopyCoords = (e: React.MouseEvent) => {
    e.stopPropagation();
    const text = `${Math.round(marker.position.x)}, ${Math.round(marker.position.z)}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareLink = (e: React.MouseEvent) => {
    e.stopPropagation();
    const url = new URL(window.location.href);
    url.searchParams.set('layer', marker.layer);
    url.searchParams.set('lat', String(Math.round(marker.lat)));
    url.searchParams.set('lng', String(Math.round(marker.lng)));
    url.searchParams.set('zoom', '6');
    url.searchParams.set('marker', marker.id);
    navigator.clipboard.writeText(url.toString());
    window.history.replaceState({}, '', url.toString());
    setShared(true);
    setTimeout(() => setShared(false), 2000);
  };

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleCompleted(marker.id);
    if (!isDone) {
      confetti({
        particleCount: 35,
        spread: 55,
        origin: { y: 0.75 },
        colors: ['#00f0ff', '#e5c158', '#10b981'],
      });
    }
  };

  const handleOpenYoutube = (e: React.MouseEvent) => {
    e.stopPropagation();
    const url =
      marker.media?.youtubeUrl ||
      `https://www.youtube.com/results?search_query=${encodeURIComponent(
        `Zelda Tears of the Kingdom ${marker.name} walkthrough`
      )}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  // Structured field extraction from description
  const isShrine = marker.category === 'shrine';
  const desc = marker.description || '';

  let trialName = '';
  const trialMatch = desc.match(/^_([^_]+)_/m) || desc.match(/^\*([^*]+)\*/m);
  if (trialMatch) trialName = trialMatch[1].trim();

  let locationText = '';
  const locMatch = desc.match(/\*\*Location:\*\*\s*([^\n]+)/i);
  if (locMatch) locationText = locMatch[1].trim();

  let solutionText = '';
  const solMatch = desc.match(/\*\*Solution:\*\*([\s\S]*?)(?=\*\*(?:Treasure|Reward|Note):|\n\n\*\*|\n\*\*|$)/i);
  if (solMatch) solutionText = solMatch[1].trim();

  let treasureText = '';
  const treasMatch = desc.match(/\*\*(?:Treasure|Reward):\*\*([\s\S]*?)(?=\n\n\*\*|\n\*\*|$)/i);
  if (treasMatch) treasureText = treasMatch[1].trim();

  let bubbulfrogText = '';
  const frogMatch = desc.match(/\*\*(?:Bubbulfrog|Bubblefrog):\*\*\s*([^\n]+(?:\n(?!\*\*|-)[^\n]+)*)/i);
  if (frogMatch) bubbulfrogText = frogMatch[1].trim();

  let noteText = '';
  const noteMatch = desc.match(/\*\*(?:Note|Side Note):\*\*\s*([^\n]+(?:\n(?!\*\*|-)[^\n]+)*)/i);
  if (noteMatch) noteText = noteMatch[1].trim();

  // Deduplicate and clean general description so extracted fields don't repeat
  let generalDesc = desc;
  if (locationText) {
    generalDesc = generalDesc.replace(/\*\*Location:\*\*\s*[^\n]+(\n+|$)/i, '');
  }
  if (solutionText) {
    generalDesc = generalDesc.replace(/\*\*Solution:\*\*[\s\S]*?(?=\*\*(?:Treasure|Reward|Note):|\n\n\*\*|\n\*\*|$)/i, '');
  }
  if (treasureText) {
    generalDesc = generalDesc.replace(/\*\*(?:Treasure|Reward):\*\*[\s\S]*?(?=\n\n\*\*|\n\*\*|$)/i, '');
  }
  if (bubbulfrogText) {
    generalDesc = generalDesc.replace(/\*\*(?:Bubbulfrog|Bubblefrog):\*\*\s*[^\n]+(?:\n(?!\*\*|-)[^\n]+)*(\n+|$)/i, '');
  }
  if (noteText) {
    generalDesc = generalDesc.replace(/\*\*(?:Note|Side Note):\*\*\s*[^\n]+(?:\n(?!\*\*|-)[^\n]+)*(\n+|$)/i, '');
  }
  if (trialName) {
    generalDesc = generalDesc.replace(/^_[^_]+_(\n+|$)/m, '').replace(/^\*[^*]+\*(\n+|$)/m, '');
  }
  if (isShrine && (trialName || solutionText)) {
    generalDesc = '';
  }
  generalDesc = generalDesc.trim();

  return (
    <div className="w-[min(340px,calc(100vw-32px))] sm:w-[360px] max-w-[calc(100vw-24px)] bg-[#1c1714] border border-[#443a32] rounded-xl shadow-2xl overflow-hidden text-gray-100 flex flex-col font-sans select-text">
      {/* 1. Hero Media Banner (Shrines, Bosses, Towers) */}
      {marker.media?.imageUrl && (
        <div className="relative w-full h-28 sm:h-36 bg-black/60 group overflow-hidden">
          <img
            src={marker.media.imageUrl}
            alt={marker.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1c1714] via-black/20 to-black/40" />

          {/* YouTube Video Play Button Overlay */}
          <button
            onClick={handleOpenYoutube}
            title="Watch Walkthrough on YouTube"
            className="absolute inset-0 m-auto w-12 h-12 rounded-full bg-black/60 hover:bg-red-600/90 text-white flex items-center justify-center transition-all duration-200 shadow-xl backdrop-blur-sm group-hover:scale-110"
          >
            <Play className="w-5 h-5 ml-0.5 fill-white" />
          </button>

          {/* Close Button on Banner */}
          <button
            onClick={onClose}
            className="absolute top-2.5 right-2.5 p-1 rounded-full bg-black/60 hover:bg-black/90 text-gray-300 hover:text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 2. Header Content Row */}
      <div className="p-4 pb-2">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-lg font-bold text-white tracking-wide leading-snug">
            {marker.name}
          </h3>

          <div className="flex items-center space-x-1 shrink-0">
            {/* Share Deeplink URL */}
            <button
              onClick={handleShareLink}
              className="p-1 rounded text-gray-400 hover:text-cyan-300 hover:bg-cyan-500/10 transition relative"
              title="Copy Shareable Map Link"
            >
              {shared ? (
                <Check className="w-4 h-4 text-cyan-400" />
              ) : (
                <Share2 className="w-4 h-4 text-gray-300" />
              )}
            </button>

            {/* Copy Coordinates Link */}
            <button
              onClick={handleCopyCoords}
              className="p-1 rounded text-gray-400 hover:text-white hover:bg-white/10 transition relative"
              title="Copy Coordinates"
            >
              {copied ? (
                <Check className="w-4 h-4 text-emerald-400" />
              ) : (
                <Link2 className="w-4 h-4 text-gray-300" />
              )}
            </button>

            {/* Twin Teleport / Chasm Dive Icon */}
            {marker.twin && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (marker.twin) jumpToTwin(marker.twin);
                }}
                className={`p-1 rounded transition ${
                  marker.category === 'chasm'
                    ? marker.layer === 'surface'
                      ? 'text-rose-400 hover:text-white hover:bg-rose-500/20'
                      : 'text-teal-400 hover:text-white hover:bg-teal-500/20'
                    : 'text-totk-zonai hover:text-white hover:bg-totk-zonai/20'
                }`}
                title={
                  marker.category === 'chasm'
                    ? marker.layer === 'surface'
                      ? `Dive into ${marker.twin.name}`
                      : `Ascend to ${marker.twin.name}`
                    : `Switch layer to ${marker.twin.name}`
                }
              >
                {marker.category === 'chasm' ? (
                  marker.layer === 'surface' ? (
                    <ArrowDownCircle className="w-4 h-4" />
                  ) : (
                    <ArrowUpCircle className="w-4 h-4" />
                  )
                ) : (
                  <ArrowRightLeft className="w-4 h-4" />
                )}
              </button>
            )}

            {/* Close Button (if no image banner) */}
            {!marker.media?.imageUrl && (
              <button
                onClick={onClose}
                className="p-1 rounded text-gray-400 hover:text-white hover:bg-white/10 transition ml-1"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Subtitle Row (Category in italic + In-Game Coordinates) */}
        <div className="flex items-center justify-between text-xs text-[#b8a793] mt-1 border-b border-[#362e27] pb-2.5">
          <div className="flex items-center gap-1.5">
            <span
              className="w-2.5 h-2.5 rounded-full inline-block shadow-sm"
              style={{ backgroundColor: getCategoryTheme(marker.category).hex }}
            />
            <span
              className="italic font-medium capitalize tracking-wide"
              style={{ color: getCategoryTheme(marker.category).badgeText }}
            >
              {marker.category.replace(/_/g, ' ')}
            </span>
          </div>
          <span className="font-mono text-[#a39482]">
            {Math.round(marker.position.x)}, {Math.round(marker.position.z)}
          </span>
        </div>
      </div>

      {/* 3. Scrollable Body Content */}
      <div className="px-3.5 sm:px-4 pb-3 max-h-[220px] sm:max-h-[300px] overflow-y-auto space-y-2.5 text-xs leading-relaxed text-gray-300 custom-scrollbar">
        {/* Shrine Trial Name */}
        {trialName && (
          <div className="text-sm italic font-serif text-[#e5c158] font-medium">
            "{trialName}"
          </div>
        )}

        {/* Location Text Card */}
        {locationText && (
          <div className="flex items-start gap-2 text-gray-300 bg-black/25 p-2 rounded-lg border border-[#382f28]">
            <MapPin className="w-3.5 h-3.5 text-totk-gold shrink-0 mt-0.5" />
            <div className="text-xs leading-snug">
              <strong className="text-white">Location:</strong>{' '}
              <span>{parseMarkdownTokens(locationText)}</span>
            </div>
          </div>
        )}

        {/* Bubbulfrog Card */}
        {bubbulfrogText && (
          <div className="bg-cyan-950/25 p-2.5 rounded-lg border border-cyan-500/30 space-y-1">
            <div className="font-bold text-cyan-300 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <Gem className="w-3.5 h-3.5 text-cyan-400" />
              <span>Bubbulfrog Location</span>
            </div>
            <div className="text-gray-200 text-xs leading-relaxed">
              {parseMarkdownTokens(bubbulfrogText)}
            </div>
          </div>
        )}

        {/* Shrine Solution Steps */}
        {solutionText && (
          <div className="bg-black/25 p-2.5 rounded-lg border border-[#382f28] space-y-1.5">
            <div className="font-bold text-[#e5c158] uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-totk-gold" />
              <span>Solution / Walkthrough</span>
            </div>
            <div className="whitespace-pre-line text-gray-200 text-[11.5px] leading-relaxed">
              {solutionText}
            </div>
          </div>
        )}

        {/* Treasure / Reward Card */}
        {treasureText && (
          <div className="bg-amber-950/20 p-2.5 rounded-lg border border-amber-600/30 space-y-1">
            <div className="font-bold text-amber-400 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <Gift className="w-3.5 h-3.5 text-amber-400" />
              <span>Treasure / Reward</span>
            </div>
            <div className="text-gray-200 text-xs leading-relaxed">
              {renderMarkdownContent(treasureText)}
            </div>
          </div>
        )}

        {/* Note Card */}
        {noteText && (
          <div className="bg-amber-950/15 p-2.5 rounded-lg border border-[#44382e] space-y-1">
            <div className="font-bold text-[#d4b996] uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-totk-gold" />
              <span>Note</span>
            </div>
            <div className="text-gray-200 text-xs leading-relaxed">
              {parseMarkdownTokens(noteText)}
            </div>
          </div>
        )}

        {/* Formatted General Description (Caves, Quests, NPCs, Weapons, etc.) */}
        {generalDesc && (
          <div className="bg-black/15 p-2.5 rounded-lg border border-[#302822]">
            {renderMarkdownContent(generalDesc)}
          </div>
        )}

        {/* Korok Tutorial Card */}
        {marker.tutorial && (
          <div className="bg-lime-950/30 border border-lime-500/35 rounded-lg p-2.5 text-xs space-y-1.5">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center space-x-1.5 text-lime-300 font-bold">
                <span className="text-sm leading-none">{marker.tutorial.icon}</span>
                <span>{marker.tutorial.title}</span>
              </div>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-lime-500/20 text-lime-300 border border-lime-500/30 font-mono font-semibold">
                {marker.tutorial.reward}
              </span>
            </div>
            {marker.tutorial.shortDesc && (
              <div className="text-[11px] text-lime-200/75 italic">
                {marker.tutorial.shortDesc}
              </div>
            )}
            <div className="bg-black/25 rounded p-2 border border-lime-500/20 text-gray-200 leading-relaxed text-[11.5px]">
              <span className="font-bold text-lime-400 mr-1">Solusi:</span>
              {marker.tutorial.instruction}
            </div>
          </div>
        )}

        {/* Zonai Dispenser Capsule List */}
        {marker.items && marker.items.length > 0 && (
          <div className="pt-1">
            <div className="text-[10px] uppercase tracking-wider font-semibold text-gray-400 mb-1.5">
              Available Zonai Capsules:
            </div>
            <div className="flex flex-wrap gap-1">
              {marker.items.map((item) => (
                <span
                  key={item}
                  className="text-[11px] px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Chasm Direct Dive / Ascend Portal Card */}
        {marker.category === 'chasm' && marker.twin && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (marker.twin) jumpToTwin(marker.twin);
            }}
            className={`w-full group relative overflow-hidden rounded-xl p-3 border text-left transition-all duration-300 shadow-lg ${
              marker.layer === 'surface'
                ? 'bg-gradient-to-r from-red-950/80 via-[#2a1015] to-purple-950/70 border-red-500/40 hover:border-red-400/80 hover:shadow-red-950/60'
                : 'bg-gradient-to-r from-teal-950/80 via-[#0e2422] to-cyan-950/70 border-teal-500/40 hover:border-teal-400/80 hover:shadow-teal-950/60'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center border shadow-sm group-hover:scale-105 transition-transform ${
                    marker.layer === 'surface'
                      ? 'bg-red-500/20 border-red-500/40 text-rose-300'
                      : 'bg-teal-500/20 border-teal-500/40 text-teal-300'
                  }`}
                >
                  {marker.layer === 'surface' ? (
                    <ArrowDownCircle className="w-5 h-5 animate-pulse text-rose-400" />
                  ) : (
                    <ArrowUpCircle className="w-5 h-5 animate-pulse text-teal-300" />
                  )}
                </div>
                <div>
                  <div
                    className={`text-[10px] font-bold tracking-widest uppercase ${
                      marker.layer === 'surface' ? 'text-rose-300/90' : 'text-teal-300/90'
                    }`}
                  >
                    {marker.layer === 'surface' ? 'CHASM PORTAL' : 'ASCEND PILLAR'}
                  </div>
                  <div className="text-xs font-bold text-white group-hover:text-amber-200 transition-colors">
                    {marker.layer === 'surface' ? 'Dive into The Depths 🕳️' : 'Ascend to Surface ⛰️'}
                  </div>
                </div>
              </div>
              <div
                className={`flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-md border tracking-wider uppercase ${
                  marker.layer === 'surface'
                    ? 'bg-red-950/60 text-rose-200 border-red-500/40'
                    : 'bg-teal-950/60 text-teal-200 border-teal-500/40'
                }`}
              >
                <span>{marker.layer === 'surface' ? 'DIVE' : 'ASCEND'}</span>
                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
            <div className="mt-1.5 text-[11px] text-gray-300/90 pl-0.5">
              {marker.layer === 'surface' ? 'Plunge down to: ' : 'Emerge upward to: '}
              <strong className="text-white">{marker.twin.name}</strong>
            </div>
          </button>
        )}

        {/* Shrine Twin Lightroot Teleport Link */}
        {marker.category !== 'chasm' && marker.twin && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (marker.twin) jumpToTwin(marker.twin);
            }}
            className="w-full flex items-center justify-between p-2 rounded bg-totk-zonai/10 hover:bg-totk-zonai/20 border border-totk-zonai/30 text-totk-zonai transition text-xs"
          >
            <span className="flex items-center gap-1.5">
              <ArrowRightLeft className="w-3.5 h-3.5" />
              <span>Mirror: <strong>{marker.twin.name}</strong></span>
            </span>
            <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-totk-zonai/20">
              Jump to {marker.twin.layer}
            </span>
          </button>
        )}

        {/* Video Walkthrough YouTube Button */}
        {(isShrine || marker.media?.youtubeUrl) && (
          <button
            onClick={handleOpenYoutube}
            className="w-full py-2 px-3 rounded bg-red-950/40 hover:bg-red-900/60 border border-red-500/40 text-red-200 transition text-xs flex items-center justify-center gap-2 font-medium"
          >
            <Youtube className="w-4 h-4 text-red-400" />
            <span>Watch Video Walkthrough on YouTube</span>
          </button>
        )}
      </div>

      {/* 4. Bottom Action Button (Track / Complete) */}
      <button
        onClick={handleToggle}
        className={`w-full min-h-[44px] py-2.5 px-4 text-xs font-bold tracking-widest uppercase transition flex items-center justify-center gap-2 border-t active:scale-[0.99] touch-manipulation cursor-pointer ${
          isDone
            ? 'bg-emerald-950/80 hover:bg-emerald-900/90 text-emerald-300 border-emerald-600/50'
            : 'bg-[#231e1a] hover:bg-[#2c2520] text-[#c8b293] hover:text-white border-[#382f28]'
        }`}
      >
        {isDone ? (
          <>
            <Check className="w-3.5 h-3.5 text-emerald-400" />
            <span>FOUND & COMPLETED</span>
          </>
        ) : (
          <span>MARK AS FOUND / COMPLETED</span>
        )}
      </button>
    </div>
  );
};
