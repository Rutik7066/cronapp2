
export const getCronExpression = (date: string): string => {
  const dateObj = new Date(date);
  const minutes = dateObj.getMinutes();
  const hours = dateObj.getHours();
  const days = dateObj.getDate();
  const months = dateObj.getMonth() + 1;
  const dayOfWeek = dateObj.getDay();
  return `${minutes} ${hours} ${days} ${months} ${dayOfWeek}`;
};

export const fetchAndConvertToBase64 = async (
  url: string
): Promise<string | undefined> => {
  try {
    const response = await fetch(url);

    const blob = await response.arrayBuffer();

    const contentType = response.headers.get("content-type");
    
    const buffer = Buffer.from(blob).toString("base64")
    
    const base64String = `data:${contentType};base64,${buffer}`;
    console.log(response.headers);
    console.log(contentType);
    return base64String;
  } catch (error) {
    console.log(error);
    return undefined;
  }
};

export const pauseLoop = async () => {
  const delay = Math.floor(Math.random() * 5000) + 2000;
  return new Promise((resolve) => setTimeout(resolve, delay));
};
