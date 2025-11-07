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

  // for (const doc of snapshot.docs) {
  //   await db
  //     .collection("stories")
  //     .doc(doc.id)
  //     .update({
  //       likesCount: doc.likes.length > 0 ? doc.likes.length : 0,
  //     });

  //   console.log(`✅ Updated story ${doc.id} with random number`);
  // }

  // for (const doc of snapshot.docs) {
  //   const data = doc.data();
  //   const likes = Array.isArray(data.likes) ? data.likes : [];
  //   const likesCount = likes.length;

  //   await db.collection("stories").doc(doc.id).update({ likesCount });

  //   console.log(`✅ Updated story ${doc.id} with likesCount = ${likesCount}`);
  // }
  for (const doc of snapshot.docs) {
    const data = doc.data();

    // Only set hidden to false if it doesn't exist
    // If hidden is already true, leave it unchanged
    if (data.hidden === undefined) {
      await db.collection("stories").doc(doc.id).update({
        hidden: false,
      });
      console.log(`✅ Updated story ${doc.id} with hidden = false`);
    } else {
      console.log(
        `ℹ️ Story ${doc.id} already has hidden = ${data.hidden}, skipping`
      );
    }
  }

  console.log("🎉 All stories updated successfully!");
}

updateStories().catch((err) => {
  console.error("❌ Error updating stories:", err);
});
