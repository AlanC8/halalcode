import axios from "axios";

const searchImages = async (query: string): Promise<string[]> => {
  const key = process.env.VITE_GOOGLE_SEARCH_API_KEY;
  console.log(key);
  const cx = process.env.VITE_BROWSER_ENGINE_ID;
  const url = `https://www.googleapis.com/customsearch/v1?key=${key}&cx=${cx}&searchType=image&q=${query}`;

  try {
    const response = await axios.get(url);
    const items = response.data.items;
    if (items && items.length > 0) {
      return items.slice(0, 5).map((item: any) => item.link);
    } else {
      return [];
    }
  } catch (error) {
    console.error("Error fetching image links:", error);
    return [];
  }
};

export default searchImages;
