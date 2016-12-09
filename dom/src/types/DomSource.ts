import { Stream } from 'most';
import { VNode } from './virtual-dom';
import { StandardEvents } from './Events';

export interface EventsFnOptions {
  useCapture?: boolean;
}

export interface DomSource {

  select(selector: string): DomSource;
  elements<T extends Element>(): Stream<Array<T>>;

  events<T extends Event>(eventType: StandardEvents, options?: EventsFnOptions): Stream<T>;
  events<T extends Event>(eventType: string, options?: EventsFnOptions): Stream<T>;

  namespace(): Array<string>;
  isolateSource(source: DomSource, scope: string): DomSource;
  isolateSink(sink: Stream<VNode>, scope: string): Stream<VNode>;

  // TODO: implement these because strings suck

  // abort<T extends Event>(options?: EventsFnOptions): Stream<T> // UIEvent, ProgressEvent, Event
  // afterprint(options?: EventsFnOptions): Stream<Event>;
  // animationend(options?: EventsFnOptions): Stream<AnimationEvent>;
  // animationiteration(options?: EventsFnOptions): Stream<AnimationEvent>;
  // animationstart(options?: EventsFnOptions): Stream<AnimationEvent>;
  // audioprocess(options?: EventsFnOptions): Stream<AudioProcessingEvent>;
  // audioend(options?: EventsFnOptions): Stream<Event>;
  // audiostart(options?: EventsFnOptions): Stream<Event>;
  // beforprint(options?: EventsFnOptions): Stream<Event>;
  // beforeunload(options?: EventsFnOptions): Stream<BeforeUnloadEvent>;
  // beginEvent(options?: EventsFnOptions): Stream<Event>; // TimeEvent
  // blocked(options?: EventsFnOptions): Stream<Event>;
  // blur(options?: EventsFnOptions): Stream<FocusEvent>; // FocusEvent
  // boundary(options?: EventsFnOptions): Stream<Event>; // SpeechsynthesisEvent
  // cached(options?: EventsFnOptions): Stream<Event>;
  // canplay(options?: EventsFnOptions): Stream<Event>;
  // canplaythrough(options?: EventsFnOptions): Stream<Event>;
  // change(options?: EventsFnOptions): Stream<Event>;
  // chargingchange(options?: EventsFnOptions): Stream<Event>;
  // chargingtimechange(options?: EventsFnOptions): Stream<Event>;
  // checking(options?: EventsFnOptions): Stream<Event>;
  // click(options?: EventsFnOptions): Stream<MouseEvent>;
  // close(options?: EventsFnOptions): Stream<Event>;
  // complete<T extends Event>(options?: EventsFnOptions): Stream<T>; // OfflineAudioCompletionEvent
  // compositionend(options?: EventsFnOptions): Stream<CompositionEvent>;
  // compositionstart(options?: EventsFnOptions): Stream<CompositionEvent>;
  // compositionupdate(options?: EventsFnOptions): Stream<CompositionEvent>;
  // contextmenu(options?: EventsFnOptions): Stream<MouseEvent>;
  // copy(options?: EventsFnOptions): Stream<ClipboardEvent>;
  // cut(options?: EventsFnOptions): Stream<ClipboardEvent>;
  // dblclick(options?: EventsFnOptions): Stream<MouseEvent>;
  // devicechange(options?: EventsFnOptions): Stream<Event>;
  // devicelight(options?: EventsFnOptions): Stream<DeviceLightEvent>;
  // devicemotion(options?: EventsFnOptions): Stream<DeviceMotionEvent>;
  // deviceorientation(options?: EventsFnOptions): Stream<DeviceOrientationEvent>;
  // deviceproximity(options?: EventsFnOptions): Stream<Event>; // DeviceProximityEvent
  // dischargingtimechange(options?: EventsFnOptions): Stream<Event>;
  // DOMActivate(options?: EventsFnOptions): Stream<UIEvent>;
  // DOMAttributeNameChanged(options?: EventsFnOptions): Stream<Event>; // MutationNameEvent
  // DOMAttrModified(options?: EventsFnOptions): Stream<MutationEvent>;
  // DOMCharacterDataModified(options?: EventsFnOptions): Stream<MutationEvent>;
  // DOMContentLoaded(options?: EventsFnOptions): Stream<Event>;
  // DOMElementNamedChanged(options?: EventsFnOptions): Stream<Event>; // MutationNameEvent
  // DOMNodeInserted(options?: EventsFnOptions): Stream<MutationEvent>;
  // DOMNodeInsertedIntoDocument(options?: EventsFnOptions): Stream<MutationEvent>;
  // DOMNodeRemoved(options?: EventsFnOptions): Stream<MutationEvent>;
  // DOMNodeRemovedFromDocument(options?: EventsFnOptions): Stream<MutationEvent>;
  // DOMSubtreeModified(options?: EventsFnOptions): Stream<MutationEvent>;
  // downloaded(options?: EventsFnOptions): Stream<Event>;
  // drag(options?: EventsFnOptions): Stream<DragEvent>;
  // dragend(options?: EventsFnOptions): Stream<DragEvent>;
  // dragenter(options?: EventsFnOptions): Stream<DragEvent>;
  // dragleave(options?: EventsFnOptions): Stream<DragEvent>;
  // dragover(options?: EventsFnOptions): Stream<DragEvent>;
  // dragstart(options?: EventsFnOptions): Stream<DragEvent>;
  // drop(options?: EventsFnOptions): Stream<DragEvent>;
  // durationchange(options?: EventsFnOptions): Stream<Event>;
  // emptied(options?: EventsFnOptions): Stream<Event>;
  // end(options?: EventsFnOptions): Stream<Event>;
  // ended(options?: EventsFnOptions): Stream<Event>;
  // endEvent(options?: EventsFnOptions): Stream<Event>; // TimeEvent
  // error(options?: EventsFnOptions): Stream<Event>;
  // focus(options?: EventsFnOptions): Stream<FocusEvent>;
  // fullscreenchange(options?: EventsFnOptions): Stream<Event>;
  // fullscreenerror(options?: EventsFnOptions): Stream<Event>;
  // gamepadconnected(options?: EventsFnOptions): Stream<GamepadEvent>;
  // gamepaddisconnected(options?: EventsFnOptions): Stream<GamepadEvent>;
  // gotpointercapture(options?: EventsFnOptions): Stream<PointerEvent>;
  // hashchange(options?: EventsFnOptions): Stream<HashChangeEvent>;
  // lostpointercapture(options?: EventsFnOptions): Stream<PointerEvent>;
  // input(options?: EventsFnOptions): Stream<Event>;
  // invalid(options?: EventsFnOptions): Stream<Event>;
  // keydown(options?: EventsFnOptions): Stream<KeyboardEvent>;
  // keypress(options?: EventsFnOptions): Stream<KeyboardEvent>;
  // keyup(options?: EventsFnOptions): Stream<KeyboardEvent>;
  // languagechange(options?: EventsFnOptions): Stream<Event>;
  // levelchange(options?: EventsFnOptions): Stream<Event>;
  // load<T extends Event>(options?: EventsFnOptions): Stream<T>; // UIEvent, ProgressEvent
  // loadeddata(options?: EventsFnOptions): Stream<Event>;
  // loadedmetadata(options?: EventsFnOptions): Stream<Event>;
  // loadend(options?: EventsFnOptions): Stream<ProgressEvent>;
  // loadstart(options?: EventsFnOptions): Stream<ProgressEvent>;
  // mark(options?: EventsFnOptions): Stream<Event>; // SpeechSynthesisEvent
  // message<T extends Event>(options?: EventsFnOptions): Stream<T>; // MessageEvent, ServiceWorkerMessageEvent, ExtendableMessageEvent
  // mousedown(options?: EventsFnOptions): Stream<MouseEvent>;
  // mouseenter(options?: EventsFnOptions): Stream<MouseEvent>;
  // mouseleave(options?: EventsFnOptions): Stream<MouseEvent>;
  // mousemove(options?: EventsFnOptions): Stream<MouseEvent>;
  // mouseout(options?: EventsFnOptions): Stream<MouseEvent>;
  // mouseover(options?: EventsFnOptions): Stream<MouseEvent>;
  // nomatch(options?: EventsFnOptions): Stream<Event>; // SpeechRecognitionEvent
  // notificationclick(options?: EventsFnOptions): Stream<Event>; // NotificationEvent
  // noupdate(options?: EventsFnOptions): Stream<Event>;
  // obsolete(options?: EventsFnOptions): Stream<Event>;
  // offline(options?: EventsFnOptions): Stream<Event>;
  // online(options?: EventsFnOptions): Stream<Event>;
  // open(options?: EventsFnOptions): Stream<Event>;
  // orientationchange(options?: EventsFnOptions): Stream<Event>;
  // pagehide(options?: EventsFnOptions): Stream<PageTransitionEvent>;
  // pageshow(options?: EventsFnOptions): Stream<PageTransitionEvent>;
  // paste(options?: EventsFnOptions): Stream<ClipboardEvent>; // ClipboardEvent
  // pause(options?: EventsFnOptions): Stream<Event>; // SpeechSynthesisEvent
  // pointercancel(options?: EventsFnOptions): Stream<PointerEvent>;
  // pointerdown(options?: EventsFnOptions): Stream<PointerEvent>;
  // pointerenter(options?: EventsFnOptions): Stream<PointerEvent>;
  // pointerleave(options?: EventsFnOptions): Stream<PointerEvent>;
  // pointerlockchange(options?: EventsFnOptions): Stream<Event>;
  // pointerlockerror(options?: EventsFnOptions): Stream<Event>;
  // pointermove(options?: EventsFnOptions): Stream<PointerEvent>;
  // pointerout(options?: EventsFnOptions): Stream<PointerEvent>;
  // pointerover(options?: EventsFnOptions): Stream<PointerEvent>;
  // pointerup(options?: EventsFnOptions): Stream<PointerEvent>;
  // play(options?: EventsFnOptions): Stream<Event>;
  // playing(options?: EventsFnOptions): Stream<Event>;
  // popstate(options?: EventsFnOptions): Stream<PopStateEvent>; // PopStateEvent
  // progress(options?: EventsFnOptions): Stream<PopStateEvent>; // ProgressEvent
  // push(options?: EventsFnOptions): Stream<Event>; // PushEvent
  // pushsubscriptionchange(options?: EventsFnOptions): Stream<Event>; // PushEvent
  // ratechange(options?: EventsFnOptions): Stream<Event>;
  // readystatechange(options?: EventsFnOptions): Stream<Event>;
  // repeatEvent(options?: EventsFnOptions): Stream<Event>; // TimeEvent
  // reset(options?: EventsFnOptions): Stream<Event>;
  // resize(options?: EventsFnOptions): Stream<UIEvent>;
  // resourcetimingbufferfull(options?: EventsFnOptions): Stream<Performance>;
  // result(options?: EventsFnOptions): Stream<Event>; // SpeechRecognitionEvent
  // resume(options?: EventsFnOptions): Stream<Event>; // SpeechSynthesisEvent
  // scroll(options?: EventsFnOptions): Stream<UIEvent>;
  // seeked(options?: EventsFnOptions): Stream<Event>;
  // seeking(options?: EventsFnOptions): Stream<Event>;
  // selectstart(options?: EventsFnOptions): Stream<UIEvent>;
  // selectionchange(options?: EventsFnOptions): Stream<Event>;
  // show(options?: EventsFnOptions): Stream<MouseEvent>;
  // soundend(options?: EventsFnOptions): Stream<Event>;
  // soundstart(options?: EventsFnOptions): Stream<Event>;
  // speechend(options?: EventsFnOptions): Stream<Event>;
  // speechstart(options?: EventsFnOptions): Stream<Event>;
  // stalled(options?: EventsFnOptions): Stream<Event>;
  // start(options?: EventsFnOptions): Stream<Event>; // SpeechSynthesisEvent
  // storage(options?: EventsFnOptions): Stream<StorageEvent>;
  // submit(options?: EventsFnOptions): Stream<Event>;
  // success(options?: EventsFnOptions): Stream<Event>;
  // suspend(options?: EventsFnOptions): Stream<Event>;
  // SVGAbort(options?: EventsFnOptions): Stream<Event>; // SvgEvent
  // SVGError(options?: EventsFnOptions): Stream<Event>; // SvgEvent
  // SVGLoad(options?: EventsFnOptions): Stream<Event>; // SvgEvent
  // SVGResize(options?: EventsFnOptions): Stream<Event>; // SvgEvent
  // SVGScroll(options?: EventsFnOptions): Stream<Event>; // SvgEvent
  // SVGUnload(options?: EventsFnOptions): Stream<Event>; // SvgEvent
  // SVGZoom(options?: EventsFnOptions): Stream<Event>; // SvgEvent
  // timeout(options?: EventsFnOptions): Stream<ProgressEvent>;
  // timeupdate(options?: EventsFnOptions): Stream<Event>;
  // touchcancel(options?: EventsFnOptions): Stream<TouchEvent>;
  // touchend(options?: EventsFnOptions): Stream<TouchEvent>;
  // touchenter(options?: EventsFnOptions): Stream<TouchEvent>;
  // touchleave(options?: EventsFnOptions): Stream<TouchEvent>;
  // touchmove(options?: EventsFnOptions): Stream<TouchEvent>;
  // touchstart(options?: EventsFnOptions): Stream<TouchEvent>;
  // transitionend(options?: EventsFnOptions): Stream<TransitionEvent>;
  // unload(options?: EventsFnOptions): Stream<UIEvent>;
  // updateready(options?: EventsFnOptions): Stream<Event>;
  // upgradeneeded(options?: EventsFnOptions): Stream<Event>;
  // userproximity(options?: EventsFnOptions): Stream<Event>; // UserProximityEvent
  // voiceschanged(options?: EventsFnOptions): Stream<Event>;
  // versionchange(options?: EventsFnOptions): Stream<Event>;
  // visibilitychange(options?: EventsFnOptions): Stream<Event>;
  // volumechange(options?: EventsFnOptions): Stream<Event>;
  // vrdisplayconnected(options?: EventsFnOptions): Stream<Event>;
  // vrdisplaydisconnected(options?: EventsFnOptions): Stream<Event>;
  // vrdisplaypresentchange(options?: EventsFnOptions): Stream<Event>;
  // waiting(options?: EventsFnOptions): Stream<Event>;
  // wheel(options?: EventsFnOptions): Stream<WheelEvent>;
}