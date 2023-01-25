// @ts-ignore
export const truncateMiddle = (str = '', start = 4, end = 4) => {
  if (str && str.length) {
    if (str.length <= start + end) {
      return str;
    }
    return `${str.substring(0, start)}...${
      end > 0 ? str.substring(str.length - end) : ''
    }`;
  }
  return null;
};

/* eslint-disable */
export async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
