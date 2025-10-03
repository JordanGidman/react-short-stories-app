// scripts/updateStories.js
import admin from "firebase-admin";
import { readFileSync } from "fs";

// Load Firebase service account key
const serviceAccount = JSON.parse(
  readFileSync("./serviceAccountKey.json", "utf8")
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

async function updateStories() {
  console.log("🔍 Fetching all stories...");

  const snapshot = await db.collection("stories").get();

  if (snapshot.empty) {
    console.log("⚠️ No stories found in Firestore.");
    return;
  }

  console.log(`Found ${snapshot.size} stories. Updating...`);

  for (const doc of snapshot.docs) {
    await db.collection("stories").doc(doc.id).update({
      randomNumber: Math.random(),
    });

    console.log(`✅ Updated story ${doc.id} with random number`);
  }

  console.log("🎉 All stories updated successfully!");
}

updateStories().catch((err) => {
  console.error("❌ Error updating stories:", err);
});
