declare const Notification: any;

export function notify(message: string, closeAfter = 5000) {
  return new Promise<any>((resolve) => {
    if ('Notification' in window && Notification.permisson === 'granted')
      return resolve(new Notification(`Motorcycle Todos`, { body: message }));

    Notification.requestPermission((permission: string) => {
      if (permission === 'granted')
        return resolve(new Notification(`Motorcycle todos`, { body: message }));
      else
        alert(`Some errors may not be able to be reported with notifications disabled`);
    });
  }).then(notification => {
    if (notification)
      setTimeout(() => notification.close(), closeAfter);
  });
}
