// All events types described at
// https://developer.mozilla.org/en-US/docs/Web/Events

export type ResourceEvents =
  'cached' | 'error' | 'abort' | 'load' | 'beforeunload' | 'unload';

export type NetworkEvents = 'online' | 'offline';

export type FocusEvents = 'focus' | 'blur';

export type WebsocketEvents = 'open' | 'message' | 'error' | 'close';

export type SessionHistoryEvents = 'pagehide' | 'pageshow' | 'popstate';

export type CssAnimationEvents =
  'animationstart' | 'animationend' | 'animationiteration';

export type FormEvents = 'reset' | 'submit' | 'invalid';

export type PrintingEvents = 'beforeprint' | 'afterprint';

export type TextCompositionEvents =
  'compositionstart' | 'compositionupdate' | 'compositionend';

export type ViewEvents =
  'fullscreenchange' | 'fullscreenerror' | 'resize' | 'scroll';

export type KeyboardEvents = 'keydown' | 'keypress' | 'keyup';

export type MouseEvents =
  'mouseenter' | 'mouseover' | 'mousemove' | 'mousedown' | 'mouseup' | 'click' |
  'dblclick' | 'contextmenu' | 'wheel' | 'mouseleave' | 'mouseout' | 'select' |
  'pointerlockchange' | 'pointerlockerror';

export type DragAndDropEvents =
  'dragstart' | 'drag' | 'dragend' | 'dragend' |  'dragenter' | 'dragover' |
  'dragleave' | 'drop';

export type MediaEvents =
  'durationchange' | 'loadedmetadata' | 'loadeddata' | 'canplay' |
  'canplaythrough' | 'ended' | 'emptied' | 'stalled' | 'suspend' | 'play' |
  'playing' | 'pause' | 'waiting' | 'seeking' | 'ratechange' | 'timeupdate' |
  'volumechange' | 'complete' | 'ended' | 'audioprocess';

export type ProgressEvents =
  'loadstart' | 'progress' | 'error' | 'timeout' | 'abort' | 'load' | 'loaded';

export type StorageEvents =
  'change' | 'storage';

export type UpdateEvents =
  'checking' | 'downloading' | 'error' | 'noupdate' | 'obsolete' | 'updateready';

export type ValueChangeEvents =
  'broadcast' | 'CheckboxStateChange' | 'hashchange' | 'input' |
  'RadioStateChange' | 'readystatechange' | 'ValueChange';

export type LocalizationEvents = 'localized';

export type WebWorkerEvents = 'message';

export type ContextMenuEvents = 'show';

export type SvgEvents =
  'SVGAbort' | 'SVGError' | 'SVGLoad' | 'SVGResize' | 'SVGScroll' |
  'SVGUnload' | 'SVGZoom';

export type DatabaseEvents =
  'abort' | 'blocked' | 'complete' | 'error' | 'success' | 'upgradeneeded' |
  'versionchange';

export type NotificationEvents = 'AlertActive' | 'AlertClose';

export type CSSEvents =
  'CssRuleViewRefreshed' | 'CssRuleViewChanged' | 'CssRuleViewCSSLinkClicked' |
  'transitionend';

export type ScriptEvents =
  'afterscriptexecute' | 'beforescriptexecute';

export type MenuEvents = 'DOMMenutItemActive' | 'DOMMenutItemInactive';

export type WindowEvents =
  'DOMWindowCreated' | 'DOMTitleChanged' | 'DOMWindowClose' |
  'SSWindowClosing' | 'SSWindowStateReady' | 'SSWindowStateBusy' | 'close';

export type DocumentEvents =
  'DOMLinkAdded' | 'DOMLinkRemoved' | 'DOMMetaAdded' | 'DOMMetaRemoved' |
  'DOMWillOpenModalDialog' | 'DOMModalDialogClosed';

export type PopupEvents =
  'popuphidden' | 'popuphiding' | 'popupshowing' |
  'popupshown' | 'DOMPopupBlocked';

export type TabEvents =
  'TabOpen' | 'TabClose' | 'TabSelect' | 'TabShow' | 'TabHide' | 'TabPinned' |
  'TabUnpinned' | 'SSTabClosing' | 'SSTabRestoring' | 'SSTabRestored' |
  'visibilitychange';

export type BatteryEvents =
  'chargingchange' | 'chargingtimechange' |
  'dischargingtimechange' | 'levelchange';

export type CallEvents =
  'alerting' | 'busy' | 'callschanged' | 'connected' | 'connecting' |
  'dialing' | 'disconnected' | 'disconnecting' | 'error' | 'held' |
  'holding' | 'incoming' | 'resuming' | 'statechange';

export type SensorEvents =
  'devicelight' | 'devicemotion' | 'deviceorientation' | 'deviceproximity' |
  // 'MozOrientation' |
  'orientationchange' | 'userproximity';

export type SmartcardEvents = 'smartcard-insert' | 'smartcard-remove';

export type SMSAndUSSDEvents = 'delivered' | 'received' | 'sent';

export type FrameEvents =
  // 'mozbrowserclose' | 'mozbrowsercontextmenu' | 'mozbrowsererror' |
  // 'mozbrowsericonchange' | 'mozbrowserlocationchange' | 'mozbrowserloadend' |
  // 'mozbrowserloadstart' | 'mozbrowseropenwindow' | 'mozbrowsersecuritychange'
  // | 'mozbrowsershowmodalprompt' | 'mozbrowsertitlechange' |
  'DOMFrameContentLoaded';

export type DOMMutationEvents =
  'DOMAttributeNameChanged' | 'DOMAttrModified' |
  'DOMCharacterDataModified' | 'DOMContentLoaded' | 'DOMElementNamedChanged' |
  'DOMNodeInserted' | 'DOMNodeInsertedIntoDocument' | 'DOMNodeRemoved' |
  'DOMNodeRemovedFromDocument' | 'DOMSubtreeModified';

export type TouchEvents =
  // 'MozEdgeUiGestor' | 'MozMagnifyGesture' | 'MozMagnifyGestureStart' |
  // 'MozMagnifyGestureUpdate' | 'MozPressTapGesture' | 'MozRotateGesture' |
  // 'MozRotateGestureStart' | 'MozRotateGestureUpdate' | 'MozSwipeGesture' |
  // 'MozTapGesture' | 'MozTouchDown' | 'MozTouchMove' | 'MozTouchUp' |
  'touchcancel' | 'touchend' | 'touchenter' | 'touchleave' | 'touchmove' |
  'touchstart';

export type PointerEvents =
  'pointerover' | 'pointerenter' | 'pointerdown' | 'pointermove' | 'pointerup' |
  'pointercancel' | 'pointerout' | 'pointerleave' |
  'gotpointercapture' | 'lostpointercapture';

// the events that are in the var browser specifications
// all browsers should have these implemented the same
export type StandardEvents =
  // name -    Event Types
  'abort' | // UIEvent, ProgressEvent, Event
  'afterprint' | // Event;
  'animationend' | // AnimationEvent
  'animationiteration' | // AnimationEvent
  'animationstart' | // AnimationEvent
  'audioprocess' | // AudioProcessingEvent
  'audioend' | // Event
  'audiostart' | // Event
  'beforprint' | // Event
  'beforeunload' | // BeforeUnloadEvent
  'beginEvent' | // TimeEvent
  'blocked' | // Event
  'blur' | // FocusEvent
  'boundary' | // SpeechsynthesisEvent
  'cached' | // Event
  'canplay' | // Event
  'canplaythrough' | // Event
  'change' | // Event
  'chargingchange' | // Event
  'chargingtimechange' | // Event
  'checking' | // Event
  'click' | // MouseEvent
  'close' | // Event
  'complete' | // Event, OfflineAudioCompletionEvent
  'compositionend' | // CompositionEvent
  'compositionstart' | // CompositionEvent
  'compositionupdate' | // CompositionEvent
  'contextmenu' | // MoustEvent
  'copy' | // ClipboardEvent
  'cut' | // ClipboardEvent
  'dblclick' | // MouseEvent
  'devicechange' | // Event
  'devicelight' | // DeviceLightEvent
  'devicemotion' | // DeviceMotionEvent
  'deviceorientation' | // DeviceOrientationEvent
  'deviceproximity' | // DeviceProximityEvent
  'dischargingtimechange' | // Event
  'DOMActivate' | // UIEvent
  'DOMAttributeNameChanged' | // MutationNameEvent
  'DOMAttrModified' | // Mutationevent
  'DOMCharacterDataModified' | // MutationEvent
  'DOMContentLoaded' |// Event
  'DOMElementNamedChanged' | // MutationNameEvent
  'DOMNodeInserted' | // MutationEvent
  'DOMNodeInsertedIntoDocument' | // MutationEvent
  'DOMNodeRemoved' | // MutationEvent
  'DOMNodeRemovedFromDocument' | // MutationEvent
  'DOMSubtreeModified' | // MutationEvent
  'downloaded' | // Event
  'drag' | // DragEvent
  'dragend' | // DragEvent
  'dragenter' | // DragEvent
  'dragleave' | // DragEvent
  'dragover' | // DragEvent
  'dragstart' | // DragEvent
  'drop' | // DragEvent
  'durationchange' | // Event
  'emptied' | // Event
  'end' | // Event, SpeechSynthesisEvent
  'ended' | // Event
  'endEvent' | // TimeEvent
  'error' | // UIEvent | ProgressEvent | Event
  'focus' | // FocusEvent
  'fullscreenchange' | // Event
  'fullscreenerror' | // Event
  'gamepadconnected' | // GamepadEvent
  'gamepaddisconnected' | // GamepadEvent
  'gotpointercapture' | // PointerEvent
  'hashchange' | // HashChangEvent
  'lostpointercapture' | // PointerEvent
  'input' | // event
  'invalid' | // Event
  'keydown' | // KeyboardEvent
  'keypress' | // KeyboardEvent
  'keyup' | // KeyboardEvent
  'languagechange' | // Event
  'levelchange' | // Event
  'load' | // UIEvent, ProgressEvent
  'loadeddata' | // Event
  'loadedmetadata' | // Event
  'loadend' | // ProgressEvent
  'loadstart' | // ProgressEvent
  'mark' | // SpeechSynthesisEvent
  'message' | // MessageEvent, ServiceWorkerMessageEvent, ExtendableMessageEvent
  'mousedown' | // MouseEvent
  'mouseenter' | // MouseEvent
  'mouseleave' | // MouseEvent
  'mousemove' | // MouseEvent
  'mouseout' | // MouseEvent
  'mouseover' | // Mouseevent
  'nomatch' | // SpeechRecognitionEvent
  'notificationclick' | // NotificationEvent
  'noupdate' | // event
  'obsolete' | // Event
  'offline' | // event
  'online' | // Event
  'open' | // event
  'orientationchange' | // Event
  'pagehide' | // PageTransitionEvent
  'pageshow' | // PageTransitionEvent
  'paste' | // ClipboardEvent
  'pause' | // Event, SpeechSynthesisEvent
  'pointercancel' | // PointerEvent
  'pointerdown' | //PointerEvent
  'pointerenter' | // PointerEvent
  'pointerleave' | // PointerEvent
  'pointerlockchange' | // Event
  'pointerlockerror' | // Event
  'pointermove' | // PointerEvent
  'pointerout' | // PointerEvent
  'pointerover' | // PointerEvent
  'pointerup' | // PointerEvent
  'play' | // Event
  'playing' | // Event
  'popstate' | // PopStateEvent
  'progress' | // ProgressEvent
  'push' | // PushEvent
  'pushsubscriptionchange' | // PushEvent
  'ratechange' | // Event
  'readystatechange' | // Event
  'repeatEvent' | // TimeEvent
  'reset' | // Event
  'resize' | // UIEvent
  'resourcetimingbufferfull' | // Performance
  'result' | // SpeechRecognitionEvent
  'resume' | // SpeechSynthesisEvent
  'scroll' | // UIEvent
  'seeked' | // Event
  'seeking' | // Event
  'select' | // UIEvent
  'selectstart' | // UIEvent
  'selectionchange' | // Event
  'show' | // MouseEvent
  'soundend' | //Event
  'soundstart' | // Event
  'speechend' | // Event
  'speechstart' | // Event
  'stalled' | // Event
  'start' | // SpeechSynthesisEvent
  'storage' | // StorageEvent
  'submit' | // Event
  'success' | // Event
  'suspend' | // Event
  'SVGAbort' | // SvgEvent
  'SVGError' | // SvgEvent
  'SVGLoad' | // SvgEvent
  'SVGResize' | // SvgEvent
  'SVGScroll' | // SvgEvent
  'SVGUnload' | // SvgEvent
  'SVGZoom' | // SvgEvent
  'timeout' | // ProgressEvent
  'timeupdate' | // Event
  'touchcancel' | // TouchEvent
  'touchend' | // TouchEvent
  'touchenter' | // TouchEvent
  'touchleave' | // TouchEvent
  'touchmove' | // TouchEvent
  'touchstart' | // TouchEvent ;
  'transitionend' | // Transitionevent
  'unload' | // UIEvent
  'updateready' | // Event
  'upgradeneeded' | // Event
  'userproximity' | // UserProximityEvent
  'voiceschanged' | // Event
  'versionchange' | // Event
  'visibilitychange' | // Event
  'volumechange' | // Event
  'vrdisplayconnected' | // Event
  'vrdisplaydisconnected' | // Event
  'vrdisplaypresentchange' | // Event
  'waiting' | // Event
  'wheel'; // WheelEvent