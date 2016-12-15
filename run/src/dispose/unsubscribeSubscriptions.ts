import { Subscription } from 'most';

export function unsubscribeSubscriptions(subscriptions: Array<Subscription<any>>) {
  subscriptions.forEach(unsubscribe);
}

function unsubscribe (subscription: Subscription<any>) {
  subscription.unsubscribe();
}
