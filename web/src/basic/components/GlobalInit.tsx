import useAppStorage from '@basic/store/useAppStorage.ts';

export const GlobalInit = ({children}: { children: React.ReactNode }) => {
  useAppStorage();
  return children;
};
