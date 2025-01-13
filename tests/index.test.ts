import { Notifier } from '../src/notifier';
import { validateUpload } from '../src/utils/validator';

describe('Secure Upload Notifier', () => {
    let notifier: Notifier;

    beforeEach(() => {
        notifier = new Notifier();
    });

    test('should send success notification', () => {
        const result = notifier.sendNotification('success', 'File uploaded successfully.');
        expect(result).toBe('Notification sent: success - File uploaded successfully.');
    });

    test('should send failure notification', () => {
        const result = notifier.sendNotification('error', 'File upload failed.');
        expect(result).toBe('Notification sent: error - File upload failed.');
    });

    test('should validate upload file', () => {
        const file = { name: 'test.txt', size: 1024, type: 'text/plain' };
        const isValid = validateUpload(file);
        expect(isValid).toBe(true);
    });

    test('should invalidate upload file with missing name', () => {
        const file = { size: 1024, type: 'text/plain' };
        const isValid = validateUpload(file);
        expect(isValid).toBe(false);
    });
});