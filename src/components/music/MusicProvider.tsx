"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { wedding } from "@/config/wedding";
import { safeStorage } from "@/lib/utils";

/* Minimal typings for the YouTube IFrame Player API. */
interface YTPlayer {
  playVideo(): void;
  pauseVideo(): void;
  setVolume(volume: number): void;
  destroy(): void;
}
interface YTPlayerEvent {
  data: number;
}
declare global {
  interface Window {
    YT?: { Player: new (el: HTMLElement, options: object) => YTPlayer };
    onYouTubeIframeAPIReady?: () => void;
  }
}

const PLAYING = 1;
const PAUSED = 2;
const ENDED = 0;
const PREF_KEY = "wedding:music";

let apiPromise: Promise<void> | null = null;
function loadYouTubeApi() {
  apiPromise ??= new Promise<void>((resolve, reject) => {
    if (window.YT?.Player) return resolve();
    const previous = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      previous?.();
      resolve();
    };
    const script = document.createElement("script");
    script.src = "https://www.youtube.com/iframe_api";
    script.async = true;
    script.onerror = () => reject(new Error("YouTube player failed to load"));
    document.head.appendChild(script);
  });
  return apiPromise;
}

interface MusicState {
  /** False when no music is configured or the video cannot be played. */
  available: boolean;
  playing: boolean;
  /** Call from a tap/click: browsers only allow sound after a user gesture. */
  play: () => void;
  pause: () => void;
}

const MusicContext = createContext<MusicState>({ available: false, playing: false, play: () => {}, pause: () => {} });

/**
 * Background music from YouTube. The player is prepared shortly after load and
 * started by the guest's tap on the wax seal (or the music button), then fades in.
 */
export function MusicProvider({ children }: { children: React.ReactNode }) {
  const music = wedding.music;
  const hostRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YTPlayer | null>(null);
  const readyRef = useRef(false);
  const wantRef = useRef(false);
  const resumeRef = useRef(false);
  const fadeRef = useRef<number | null>(null);
  const playingRef = useRef(false);
  const [available, setAvailable] = useState(Boolean(music));
  const [playing, setPlaying] = useState(false);

  const fadeIn = useCallback(() => {
    const player = playerRef.current;
    if (!player || !music) return;
    const target = music.volume ?? 60;
    let volume = 0;
    player.setVolume(0);
    if (fadeRef.current) window.clearInterval(fadeRef.current);
    fadeRef.current = window.setInterval(() => {
      volume = Math.min(target, volume + target / 25);
      player.setVolume(volume);
      if (volume >= target && fadeRef.current) window.clearInterval(fadeRef.current);
    }, 100);
  }, [music]);

  const start = useCallback(() => {
    if (!playerRef.current || !readyRef.current || playingRef.current) return; // already playing: no re-fade
    fadeIn();
    playerRef.current.playVideo();
  }, [fadeIn]);

  const init = useCallback(() => {
    if (!music || playerRef.current || !hostRef.current) return;
    const mount = document.createElement("div");
    hostRef.current.appendChild(mount);
    loadYouTubeApi()
      .then(() => {
        if (!window.YT || playerRef.current) return;
        playerRef.current = new window.YT.Player(mount, {
          host: "https://www.youtube-nocookie.com",
          videoId: music.youtubeId,
          width: 200,
          height: 200,
          playerVars: {
            autoplay: 0,
            controls: 0,
            disablekb: 1,
            fs: 0,
            loop: 1,
            playlist: music.youtubeId,
            playsinline: 1,
            rel: 0,
            start: music.start ?? 0,
          },
          events: {
            onReady: () => {
              readyRef.current = true;
              if (wantRef.current) start();
            },
            onStateChange: (e: YTPlayerEvent) => {
              const now = e.data === PLAYING ? true : e.data === PAUSED || e.data === ENDED ? false : null;
              if (now === null) return;
              playingRef.current = now;
              setPlaying(now);
            },
            onError: () => setAvailable(false),
          },
        });
      })
      .catch(() => setAvailable(false));
  }, [music, start]);

  // Prepare the player shortly after load so the seal tap can start it at once.
  useEffect(() => {
    if (!music) return;
    const t = window.setTimeout(init, 1200);
    return () => window.clearTimeout(t);
  }, [music, init]);

  // Pause in background tabs; resume when the guest returns.
  useEffect(() => {
    const onVisibility = () => {
      const player = playerRef.current;
      if (!player || !readyRef.current) return;
      if (document.hidden && wantRef.current) {
        resumeRef.current = true;
        player.pauseVideo();
      } else if (!document.hidden && resumeRef.current) {
        resumeRef.current = false;
        player.playVideo();
      }
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  useEffect(
    () => () => {
      if (fadeRef.current) window.clearInterval(fadeRef.current);
      playerRef.current?.destroy();
    },
    [],
  );

  const play = useCallback(() => {
    if (!music) return;
    wantRef.current = true;
    safeStorage.set("session", PREF_KEY, "on");
    if (readyRef.current) start();
    else init();
  }, [music, start, init]);

  const pause = useCallback(() => {
    wantRef.current = false;
    resumeRef.current = false;
    safeStorage.set("session", PREF_KEY, "off");
    playerRef.current?.pauseVideo();
    playingRef.current = false;
    setPlaying(false);
  }, []);

  const value = useMemo(() => ({ available, playing, play, pause }), [available, playing, play, pause]);

  return (
    <MusicContext.Provider value={value}>
      {children}
      {music && <div ref={hostRef} aria-hidden="true" className="pointer-events-none fixed bottom-0 left-0 -z-10 size-[200px] overflow-hidden opacity-0" />}
    </MusicContext.Provider>
  );
}

export function useMusic() {
  return useContext(MusicContext);
}
