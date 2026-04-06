import { useState, useCallback } from 'react';
import { speakRomanian } from '../speech';

export const useSpeech = () => {
  const [speaking, setSpeaking] = useState(false);

  const speak = useCallback(async (text: string) => {
    setSpeaking(true);
    try {
      await speakRomanian(text);
    } catch (error) {
      console.error('Speech error:', error);
    } finally {
      setSpeaking(false);
    }
  }, []);

  return { speak, speaking };
};