// validator.ts
export function validateUpload(file: { name: string; size: number; type: string }): boolean {
    const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    const maxSize = 5 * 1024 * 1024; // 5 MB

    if (!allowedTypes.includes(file.type)) {
        console.error('Invalid file type');
        return false;
    }

    if (file.size > maxSize) {
        console.error('File size exceeds the limit');
        return false;
    }

    return true;
}