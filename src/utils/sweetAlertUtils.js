// src/utils/sweetAlertUtils.js
import Swal from 'sweetalert2';

export const confirmDelete = async (itemName = 'item') => {
    return await Swal.fire({
        title: 'Are you sure?',
        text: `This will permanently delete the ${itemName}!`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, delete it!'
    });
};

export const showSuccess = (message = 'Action completed successfully!') => {
    return Swal.fire('Success!', message, 'success');
};

export const showError = (message = 'Something went wrong!') => {
    return Swal.fire('Error!', message, 'error');
};
