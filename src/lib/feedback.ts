import Swal from 'sweetalert2';

const theme = {
  background: '#101827',
  color: '#eef4ff',
  confirmButtonColor: '#2f80ed',
  cancelButtonColor: '#273449',
};

export async function confirmDestructiveAction(options: {
  title: string;
  text: string;
  confirmText: string;
}): Promise<boolean> {
  const result = await Swal.fire({
    ...theme,
    title: options.title,
    text: options.text,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: options.confirmText,
    cancelButtonText: 'Cancel',
    reverseButtons: true,
    focusCancel: true,
  });

  return result.isConfirmed;
}

export function showSuccess(title: string, text?: string) {
  return Swal.fire({
    ...theme,
    title,
    text,
    icon: 'success',
    timer: 1800,
    timerProgressBar: true,
    showConfirmButton: false,
    toast: true,
    position: 'top-end',
  });
}

export function showInfo(title: string, text?: string) {
  return Swal.fire({
    ...theme,
    title,
    text,
    icon: 'info',
    timer: 1800,
    timerProgressBar: true,
    showConfirmButton: false,
    toast: true,
    position: 'top-end',
  });
}

export function showError(title: string, text?: string) {
  return Swal.fire({
    ...theme,
    title,
    text,
    icon: 'error',
    timer: 2600,
    timerProgressBar: true,
    showConfirmButton: false,
    toast: true,
    position: 'top-end',
  });
}
