declare global {
  interface Window {
    Admin: {
      Account: AdminUserInfoType
    }
    setPageLoading: (loading: boolean, delay = 0, duration = 6000) => void
  }
}
export {};
