import admin from "firebase-admin";
import { readFileSync } from "fs";
import { faker } from "@faker-js/faker";
import fetch from "node-fetch"; // npm install node-fetch
import placeholder from "../img/placeholder.jpg";

//I think a good option here would be to just seed the database with faker data than to generate new data on every reload. But i need to triple check this before running it, lest i ruin my db.

// Load Firebase service account key
const serviceAccount = JSON.parse(
  readFileSync("../../serviceAccountKey.json", "utf8")
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

// Genres to seed
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

//Validate image URL.
//Tries multiple URLs up to `maxAttempts`, then falls back to a guaranteed placeholder.

async function validateImage(initialUrl, maxAttempts = 10) {
  let url = initialUrl;
  let attempts = 0;

  while (attempts < maxAttempts) {
    try {
      const res = await fetch(url, { method: "HEAD" });
      if (res.ok && res.headers.get("content-type")?.startsWith("image/")) {
        return url; // ✅ valid image found
      }
    } catch (err) {
      // ignore errors, just retry
    }

    // Alternate between LoremFlickr and Picsum for retries
    url =
      attempts % 2 === 0
        ? faker.image.urlLoremFlickr({ category: "book" })
        : faker.image.urlPicsumPhotos({ category: "animals", blur: 0 });

    attempts++;
    console.log(`🔄 Retrying image... attempt ${attempts}`);
  }

  console.warn(
    "⚠️ Could not find valid image after max attempts. Using placeholder."
  );
  return placeholder; // guaranteed placeholder
}

//Create 20 random stories for a given genre

async function createRandomStories(genre) {
  const stories = [];

  for (let i = 0; i < 20; i++) {
    const fakerUrl = faker.image.urlLoremFlickr({ category: "book" });
    const validUrl = await validateImage(fakerUrl);

    stories.push({
      id: faker.string.uuid(),
      creatorID: faker.string.uuid(),
      title: faker.word.words({ length: { min: 2, max: 5 } }),
      author: faker.person.fullName(),
      storyText: faker.lorem.paragraphs(),
      synopsis: faker.lorem.sentences(2),
      genre,
      img: validUrl,
      createdAt: new Date(),
    });
  }

  return stories;
}

//Seed stories into Firestore

async function seedStories() {
  for (const genre of genres) {
    console.log(`🌱 Seeding ${genre}...`);
    const stories = await createRandomStories(genre);

    for (const story of stories) {
      await db.collection("stories").doc(story.id).set(story);
    }
  }
  console.log("✅ All fake stories seeded!");
}

seedStories().catch((err) => {
  console.error("❌ Error seeding:", err);
});
