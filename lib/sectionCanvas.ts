let request: () => void = () => {};

export const setRequestFrame = (fn: () => void) => {
  request = fn;
};
export const requestFrame = () => request();
