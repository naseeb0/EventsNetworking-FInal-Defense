import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { addWorkshop } from './actions';
import { fetchEvents } from './api';

const WorkshopComponent = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    fetchWorkshopDetails();
  }, []);

  const fetchWorkshopDetails = async () => {
    try {
      const events = await fetchEvents();
      if (events.length > 0) {
        // Assuming the first workshop is the one you want to add to favorites
        const workshop = events[0];
        dispatch(addWorkshop(workshop));
      } else {
        console.log('No workshops available.');
      }
    } catch (error) {
      console.error('Error fetching workshop details:', error);
    }
  };

  return <button>Add to Favorites</button>;
};

export default WorkshopComponent;
