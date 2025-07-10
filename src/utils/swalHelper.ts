// src/utils/swalHelper.ts
import Swal, { SweetAlertOptions } from "sweetalert2";

type SiiCustomClass = {
  popup?: string;
  header?: string;
  icon?: string;
  title?: string;
  confirmButton?: string;
  cancelButton?: string;
  closeButton?: string;
};

export function showSwal(options: SweetAlertOptions) {
  // Tus clases SII por defecto
  const siiCustomClass: SiiCustomClass = {
    popup: "sii-swal-popup",
    header: "sii-swal-header-info",
    icon: "sii-swal-icon",
    title: "sii-swal-title",
    confirmButton: "sii-swal-confirm-btn",
    cancelButton: "sii-swal-cancel-btn",
    closeButton: "sii-swal-close-btn",
  };

  // Si el usuario pasa customClass, lo fusionamos (sobreescribe si repite alguna)
  const mergedOptions: SweetAlertOptions = {
    ...options,
    customClass: {
      ...siiCustomClass,
      ...(typeof options.customClass === "object" ? options.customClass : {}),
    }
  };

  return Swal.fire(mergedOptions);
}
