import { useEffect } from 'react';

export const useKeyboardShortcuts = (shortcuts) => {
    useEffect(() => {
        const handleKeyDown = (event) => {
            // Loop through shortcuts and check if keys match
            for (const shortcut of shortcuts) {
                const isCtrlOrCmd = event.ctrlKey || event.metaKey;

                if (shortcut.ctrl && !isCtrlOrCmd) continue;
                if (!shortcut.ctrl && isCtrlOrCmd) continue;

                if (event.key.toLowerCase() === shortcut.key.toLowerCase()) {
                    event.preventDefault();
                    shortcut.action();
                    return;
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [shortcuts]);
};
