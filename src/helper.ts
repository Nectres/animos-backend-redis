
export const encodeString = (string) => {
    return Buffer.from(string).toString('base64');
};
