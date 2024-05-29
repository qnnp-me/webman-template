import log from 'loglevel';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import zustandUtils from '@common/basic/utils/zustandUtils.ts';

type AppStoreDataType = {
  loglevel: log.LogLevel[keyof typeof log.levels];
}
type AppStoreActionType = {
  setLogLevel: (level: log.LogLevel[keyof typeof log.levels]) => void;
}
type AppStoreType = AppStoreDataType & AppStoreActionType;

const useAppStorage = create(
  persist<AppStoreType>(
    (setState) => {
      const setLogLevel: AppStoreType['setLogLevel'] = (level) => {
        setState({ loglevel: level });
        log.setLevel(level);
        printLogLevel(level);
      };

      return {
        loglevel: import.meta.env.DEV ? log.levels.TRACE : log.levels.ERROR,
        setLogLevel,
      };
    },
    {
      name: 'app-store',
      onRehydrateStorage: () =>
        (state) => {
          const level = state?.loglevel !== undefined ? state.loglevel : log.levels.SILENT;
          log.setLevel(level);
          printLogLevel(level);
        },
    },
  ),
);
export default useAppStorage;
zustandUtils.withStorageDOMEvents(useAppStorage as never);

const getLogLevelNames = (levelValue: log.LogLevel[keyof typeof log.levels]) => {
  const levels: { name: keyof log.LogLevel; value: log.LogLevel[keyof log.LogLevel] }[] = [];
  for (const levelName in log.levels) {
    levels.push({
      name: levelName as keyof log.LogLevel,
      value: log.levels[levelName as never],
    });
  }
  return levels
    .filter((level) => level.value >= levelValue)
    .sort((a, b) => a.value - b.value)
    .map(e => e.name);
};
const printLogLevel = (level: log.LogLevel[keyof typeof log.levels]) => {
  const levelName = getLogLevelNames(level);
  console.log('[Log level]', ...levelName);
};
