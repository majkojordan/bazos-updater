export const sendNotification = (text: string): void => global.log(text);

export const removeEllipsis = (str: string): string => str.replace(/\s*\.{3}$/, '');
