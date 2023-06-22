import axios from 'axios';
import cosineSimilarity from 'cosine-similarity';

export const getRecommendations = async (workshop) => {
  try {
    const response = await axios.get(' https://us-central1-events-network-cc384.cloudfunctions.net/api/events');
    const workshops = response.data;

    // Find the selected workshop
    const selectedWorkshop = workshops.find((item) => item.Workshop === workshop);
    const selectedGenre = selectedWorkshop ? selectedWorkshop.Genre : '';
    const selectedRatings = selectedWorkshop ? selectedWorkshop.Ratings : 0;

    // Calculate cosine similarity for each workshop
    const workshopsWithSimilarity = workshops.map((item) => {
      if (item.Genre === selectedGenre) {
        const genreSimilarity = 1;
        const ratingsSimilarity = selectedRatings === item.Ratings ? 1 : 0;
        const similarity = cosineSimilarity([genreSimilarity, ratingsSimilarity], [1, 1]);
        return { ...item, similarity };
      } else {
        return { ...item, similarity: 0 };
      }
    });

    // Filter and sort workshops based on similarity and ratings
    const filteredWorkshops = workshopsWithSimilarity.filter((item) => {
      return item.similarity > 0 && item.Ratings >= 2;
    });

    if (filteredWorkshops.length === 0) {
      console.log('No recommendations found.');
      return [];
    }

    const sortedWorkshops = filteredWorkshops.sort((a, b) => {
      // Sort by similarity first, then by ratings
      if (a.similarity === b.similarity) {
        return b.Ratings - a.Ratings;
      }
      return b.similarity - a.similarity;
    });

    return sortedWorkshops;
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    return [];
  }
};
