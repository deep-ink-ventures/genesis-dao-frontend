import dayjs from 'dayjs';

export const formatISOTimestamp = (
  date: string,
  format = 'MMM DD, YYYY hh:mm A'
) => {
  const parsedDate = dayjs(date, {
    format: 'YYYY-MM-DDTHH:mm:ss.SSSSSSZ',
  });

  const formattedDate = parsedDate.format(format);

  return formattedDate;
};
