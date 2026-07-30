import { useCallback, useEffect, useRef, useState } from 'react';

export function useRecorder() {
  const [state, setState] = useState('idle'); // idle | recording | error
  const [level, setLevel] = useState(0);      // 0..1, drives the live bar
  const [error, setError] = useState(null);

  const mediaRef = useRef(null);
  const chunksRef = useRef([]);
  const streamRef = useRef(null);
  const rafRef = useRef(null);
  const ctxRef = useRef(null);

  const cleanup = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    streamRef.current?.getTracks().forEach((t) => t.stop());
    ctxRef.current?.close().catch(() => {});
    streamRef.current = null;
    ctxRef.current = null;
    setLevel(0);
  }, []);

  useEffect(() => cleanup, [cleanup]);

  const start = useCallback(async () => {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      ctxRef.current = ctx;
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 512;
      ctx.createMediaStreamSource(stream).connect(analyser);
      const buf = new Uint8Array(analyser.frequencyBinCount);

      const tick = () => {
        analyser.getByteTimeDomainData(buf);
        let sum = 0;
        for (let i = 0; i < buf.length; i++) {
          const v = (buf[i] - 128) / 128;
          sum += v * v;
        }
        setLevel(Math.min(1, Math.sqrt(sum / buf.length) * 4));
        rafRef.current = requestAnimationFrame(tick);
      };
      tick();

      const mime = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
        ? 'audio/webm;codecs=opus'
        : 'audio/webm';
      const mr = new MediaRecorder(stream, { mimeType: mime });
      chunksRef.current = [];
      mr.ondataavailable = (e) => e.data.size > 0 && chunksRef.current.push(e.data);
      mr.start();
      mediaRef.current = mr;
      setState('recording');
    } catch (e) {
      setError('Microphone blocked. Allow mic access in your browser and try again.');
      setState('error');
    }
  }, []);

  const stop = useCallback(
    () =>
      new Promise((resolve) => {
        const mr = mediaRef.current;
        if (!mr || mr.state === 'inactive') return resolve(null);
        mr.onstop = () => {
          const blob = new Blob(chunksRef.current, { type: mr.mimeType });
          cleanup();
          setState('idle');
          resolve(blob);
        };
        mr.stop();
      }),
    [cleanup]
  );

  return { state, level, error, start, stop };
}