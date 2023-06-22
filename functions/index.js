const functions = require("firebase-functions");
const admin = require("firebase-admin");
const express = require("express");


const serviceAccount = require("./serviceAccountKey.json");

// Initialize Firebase Admin SDK
admin.initializeApp({

  credential: admin.credential.cert(serviceAccount),

});


// Create an Express.js app
const app = express();

// Middleware to parse request bodies as JSON
app.use(express.json());

// CRUD operations

// Create a new event
app.post("/events", async (req, res) => {
  try {
    const event = req.body;
    const docRef = await admin.firestore().collection("events").add(event);
    const newEvent = {id: docRef.id, ...event};
    res.status(201).json(newEvent);
  } catch (error) {
    console.error("Error creating event:", error);
    res.status(500).send("Internal server error");
  }
});

// Read an event by ID
app.get("/events/:id", async (req, res) => {
  try {
    const eventId = req.params.id;
    const docSnapshot = await admin
        .firestore()
        .collection("events")
        .doc(eventId)
        .get();

    if (docSnapshot.exists) {
      const event = {id: docSnapshot.id, ...docSnapshot.data()};
      res.json(event);
    } else {
      res.status(404).send("Event not found");
    }
  } catch (error) {
    console.error("Error getting event:", error);
    res.status(500).send("Internal server error");
  }
});

// Update an event by ID
app.put("/events/:id", async (req, res) => {
  try {
    const eventId = req.params.id;
    const event = req.body;
    await admin.firestore().collection("events").doc(eventId).update(event);
    res.sendStatus(200);
  } catch (error) {
    console.error("Error updating event:", error);
    res.status(500).send("Internal server error");
  }
});

// Delete an event by ID
app.delete("/events/:id", async (req, res) => {
  try {
    const eventId = req.params.id;
    await admin.firestore().collection("events").doc(eventId).delete();
    res.sendStatus(204);
  } catch (error) {
    console.error("Error deleting event:", error);
    res.status(500).send("Internal server error");
  }
});

// Get the last event ID
// Get the last event ID
// Get the last event ID
app.get("/events/lastId", async (req, res) => {
  try {
    const querySnapshot = await admin
        .firestore()
        .collection("events")
        .orderBy(admin.firestore.FieldPath.documentId(), "desc")
        .limit(1)
        .get();

    if (!querySnapshot.empty) {
      const lastEventId = querySnapshot.docs[0].id;
      res.json({lastId: lastEventId});
    } else {
      res.status(404).send("No events found");
    }
  } catch (error) {
    console.error("Error getting last event ID:", error);
    res.status(500).send("Internal server error");
  }
});

// Last Doc Size
app.get("/last-document-id", async (req, res) => {
  try {
    const collectionRef = admin.firestore().collection("events");
    const snapshot = await collectionRef.get();

    if (snapshot.empty) {
      // Collection is empty
      return res.status(404).send("No documents found in the collection");
    }

    const lastDocumentIndex = snapshot.size - 1;
    const lastDocumentId = snapshot.docs[lastDocumentIndex].id;

    res.send({lastDocumentId});
  } catch (error) {
    console.error("Error retrieving last document ID:", error);
    res.status(500).send("An error occurred");
  }
});

// DOCUMENT ID LAST TEST 2

app.get("/last-docid", async (req, res) => {
  try {
    const collectionRef = admin.firestore().collection("events");
    const snapshot = await collectionRef.orderBy("id", "desc").limit(1).get();

    if (snapshot.empty) {
      // Collection is empty
      return res.status(404).send("No documents found in the collection");
    }

    const lastDocument = snapshot.docs[0];
    const lastDocumentId = lastDocument.id;

    res.send({lastDocumentId});
  } catch (error) {
    console.error("Error retrieving last document ID:", error);
    res.status(500).send("An error occurred ");
  }
});


// List all events
app.get("/events", async (req, res) => {
  try {
    const querySnapshot = await admin.firestore().collection("events").get();
    const events = [];
    querySnapshot.forEach((doc) => {
      events.push({id: doc.id, ...doc.data()});
    });
    res.json(events);
  } catch (error) {
    console.error("Error listing events:", error);
    res.status(500).send("Internal server error");
  }
});

// Find events by location
app.get("/events/location", async (req, res) => {
  try {
    const latitude = req.query.latitude;
    const longitude = req.query.longitude;
    const querySnapshot = await admin
        .firestore()
        .collection("events")
        .where("Latitude", "==", latitude)
        .where("Longitude", "==", longitude)
        .get();
    const events = [];
    querySnapshot.forEach((doc) => {
      events.push({id: doc.id, ...doc.data()});
    });
    res.json(events);
  } catch (error) {
    console.error("Error finding events by location:", error);
    res.status(500).send("Internal server error");
  }
});

// Export the Express.js app as a Cloud Function
exports.api = functions.https.onRequest(app);
