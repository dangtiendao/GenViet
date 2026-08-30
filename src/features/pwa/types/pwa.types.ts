export type PwaDisplayMode = "browser" | "standalone" | "minimal-ui" | "fullscreen";

export interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export type ServiceWorkerMessageType =
  | "SKIP_WAITING"
  | "CLEAR_PRIVATE_CACHES"
  | "GET_VERSION"
  | "PRIVATE_CACHES_CLEARED"
  | "VERSION_INFO";

export interface ServiceWorkerMessage<T = unknown> {
  type: ServiceWorkerMessageType;
  payload?: T;
}

export interface ServiceWorkerVersionPayload {
  version: string;
  cacheName: string;
}

export interface PwaNetworkState {
  isOnline: boolean;
  wasOffline: boolean;
}

export interface PwaInstallState {
  isInstallable: boolean;
  isInstalled: boolean;
  isStandalone: boolean;
  isIos: boolean;
}

export interface PwaUpdateState {
  isUpdateAvailable: boolean;
  isUpdating: boolean;
  waitingWorker: ServiceWorker | null;
}
