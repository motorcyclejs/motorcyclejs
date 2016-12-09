const eventTypesThatDontBubble = [
  `blur`,
  `canplay`,
  `canplaythrough`,
  `change`,
  `durationchange`,
  `emptied`,
  `ended`,
  `focus`,
  `load`,
  `loadeddata`,
  `loadedmetadata`,
  `mouseenter`,
  `mouseleave`,
  `pause`,
  `play`,
  `playing`,
  `ratechange`,
  `reset`,
  `scroll`,
  `seeked`,
  `seeking`,
  `stalled`,
  `submit`,
  `suspend`,
  `timeupdate`,
  `unload`,
  `volumechange`,
  `waiting`,
];

export function shouldUseCapture(eventType: string, useCapture?: boolean): boolean {
  if (eventTypesThatDontBubble.indexOf(eventType) !== -1) return true;

  return typeof useCapture === 'boolean'
    ? useCapture
    : false;
}