import { create } from 'zustand';

const useAppStore = create<AppStoreType>(
  () => {
    return {};
  },
);
export default useAppStore;

type AppToreDataType = NonNullable<unknown>;
type AppStoreActionType = NonNullable<unknown>;
// eslint-disable-next-line @typescript-eslint/no-duplicate-type-constituents
type AppStoreType = AppToreDataType & AppStoreActionType;
