// Удобная обёртка для румынского языка
export function speakRomanian(text: string) {
  return speak(text, 'ro-RO');
}
// TTS — Google Web Speech API
export async function speak(text: string, lang: 'ro-RO' | 'ru-RU' = 'ro-RO') {
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = 0.9;
    utterance.pitch = 1;
    speechSynthesis.speak(utterance);
  }
}

export function stopSpeech() {
  speechSynthesis.cancel();
}

export function isSpeechSupported() {
  return 'speechSynthesis' in window;
}

