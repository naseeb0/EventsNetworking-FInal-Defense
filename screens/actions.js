// actions.js

export const addToFavorites = (workshop) => {
    return {
      type: 'ADD_TO_FAVORITES',
      payload: workshop,
    };
  };
  
  