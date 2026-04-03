import { speakRomanian } from '../speech';

export const useSpeech = () => {
  const speak = (text: string) => speakRomanian(text);
  return { speak };
};