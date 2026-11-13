export interface ToastType {
  id: number;
  message: string;
  icon?: string;
}

export interface toastType {
  toast: ToastType | null;
  showToast: (message: string, icon?: string) => void;
}
