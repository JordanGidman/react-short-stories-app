// scripts/seedStories.js
import admin from "firebase-admin";
import { readFileSync } from "fs";
import { faker } from "@faker-js/faker";

// Load Firebase service account key
const serviceAccount = JSON.parse(
  readFileSync("./serviceAccountKey.json", "utf8")
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

const genres = [
  "Fantasy",
  "Thriller",
  "Gaming",
  "Horror",
  "Mystery",
  "Historical",
  "Comedy",
  "Crime",
  "Adventure",
  "Action",
  "Religious",
  "Political",
  "Existential",
  "War",
  "Drama",
  "Science Fiction",
  "Romance",
  "Educational",
  "Other",
];

//Create 20 random stories for a given genre

function createRandomStories(genre) {
  const stories = [];

  for (let i = 0; i < 15; i++) {
    const seed = faker.string.uuid(); // unique seed for image
    const imageUrl = `https://picsum.photos/seed/${seed}/600/400`;

    stories.push({
      creatorID: faker.string.uuid(), // still included ✅
      title: faker.word.words({ length: { min: 2, max: 5 } }),
      author: faker.person.fullName(),
      storyText: faker.lorem.paragraphs(),
      synopsis: faker.lorem.sentences(2),
      genre,
      img: imageUrl,
      createdAt: new Date(),
    });
  }

  return stories;
}

//Seed stories into Firestore with auto-generated IDs
async function seedStories() {
  for (const genre of genres) {
    console.log(`Seeding ${genre}...`);
    const stories = createRandomStories(genre);

    for (const story of stories) {
      const docRef = await db.collection("stories").add(story); // Firestore auto-ID
      console.log(`Added story with ID: ${docRef.id}`);
    }
  }
  console.log("All fake stories seeded with Firestore IDs!");
}

seedStories().catch((err) => {
  console.error("Error seeding:", err);
});
