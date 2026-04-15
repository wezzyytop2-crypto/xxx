// public/push-notifications.js

export async function requestNotificationPermission() {
  if (!('Notification' in window)) return false;
  if (Notification.permission === 'granted') return true;
  if (Notification.permission === 'denied') return false;
  const result = await Notification.requestPermission();
  return result === 'granted';
}

export function showReviewReminder() {
  if (Notification.permission === 'granted') {
    new Notification('Время повторения!', {
      body: 'Есть карточки для повторения. Откройте LIMBI и закрепите знания!',
      icon: '/icons/icon-192x192.png',
      tag: 'limbi-review-reminder'
    });
  }
}

export function scheduleReviewReminder(minutes = 60) {
  if ('setTimeout' in window) {
    setTimeout(() => {
      showReviewReminder();
    }, minutes * 60 * 1000);
  }
}
