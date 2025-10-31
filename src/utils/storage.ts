export function setWithExpiry(key: string, ttlHours = 48, userEmail?: string) {
    const now = new Date();
    const item = {
        expiry: now.getTime() + ttlHours * 60 * 60 * 1000, // 48h in ms
        userEmail
    };
    localStorage.setItem(key, JSON.stringify(item));
}

export function getWithExpiry(key: string) {
    const itemStr = localStorage.getItem(key);
    if (!itemStr) return null;

    const item = JSON.parse(itemStr);
    const now = new Date();

    // Compare current time with expiry
    if (now.getTime() > item.expiry) {
        localStorage.removeItem(key);
        return null;
    }
    return item;
}