export const requestNotificationPermission = async (): Promise<boolean> => {
  if (!("Notification" in window)) {
    console.log("This browser does not support notifications");
    return false;
  }

  if (Notification.permission === "granted") {
    return true;
  }

  if (Notification.permission !== "denied") {
    const permission = await Notification.requestPermission();
    return permission === "granted";
  }

  return false;
};

export const showNotification = (
  title: string,
  options?: NotificationOptions
) => {
  if (Notification.permission === "granted") {
    const notification = new Notification(title, {
      icon: "/placeholder.svg",
      badge: "/placeholder.svg",
      ...options,
    });

    notification.onclick = () => {
      window.focus();
      notification.close();
    };

    return notification;
  }
};

export const registerServiceWorker = async () => {
  if ("serviceWorker" in navigator) {
    try {
      const registration = await navigator.serviceWorker.register("/sw.js");
      console.log("Service Worker registered:", registration);
      return registration;
    } catch (error) {
      console.error("Service Worker registration failed:", error);
      return null;
    }
  }
  return null;
};
