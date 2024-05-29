import log from 'loglevel';

import { StoreMutators } from 'zustand';

const withStorageDOMEvents = <T, S extends StoreMutators<T, T>['zustand/persist'] = StoreMutators<T, T>['zustand/persist']>(store: S) => {
  log.debug('withStorageDOMEvents:', store.persist.getOptions().name);
  const storageEventCallback = (e: StorageEvent) => {
    if (e.key === store.persist.getOptions().name && e.newValue) {
      store.persist.rehydrate();
    }
  };
  window.addEventListener('storage', storageEventCallback);

  return () => {
    window.removeEventListener('storage', storageEventCallback);
  };
};
const zustandUtils = {
  withStorageDOMEvents,
};
export default zustandUtils;
