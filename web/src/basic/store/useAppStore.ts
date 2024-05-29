import { create } from 'zustand';

const useAppStore = create<AppStoreType>(
  () => {
    return {};
  },
);
export default useAppStore;

type AppToreDataType = NonNullable<unknown>;
type AppStoreActionType = NonNullable<unknown>;
type AppStoreType = AppToreDataType & AppStoreActionType;
