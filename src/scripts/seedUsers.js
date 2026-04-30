import admin from "firebase-admin";
import { readFileSync } from "fs";

// let COUNTER = 0;

const serviceAccount = JSON.parse(
  readFileSync("./serviceAccountKey.json", "utf8"),
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

async function syncUsersFromStories() {
  console.log("🔍 Fetching stories and users...");

  const [storiesSnap, usersSnap] = await Promise.all([
    db.collection("stories").get(),
    db.collection("users").get(),
  ]);

  const existingUserIDs = new Set(usersSnap.docs.map((doc) => doc.id));

  const userStoriesMap = {};

  for (const doc of storiesSnap.docs) {
    // if (COUNTER >= 3) break;
    // COUNTER++;
    const data = doc.data();
    const uid = data.creatorID;
    const authorName = data.author || "Unknown Author";

    if (!uid) continue;

    if (!userStoriesMap[uid]) {
      userStoriesMap[uid] = {
        stories: [],
        authorName,
      };
    }

    userStoriesMap[uid].stories.push(doc.id);
  }

  console.log("👥 Creating missing users...");

  for (const uid of Object.keys(userStoriesMap)) {
    if (existingUserIDs.has(uid)) {
      console.log(`⏭️ Skipping existing user ${uid}`);
      continue;
    }

    const { stories, authorName } = userStoriesMap[uid];

    await db.collection("users").doc(uid).set({
      displayName: authorName,
      uid: uid,
      drafts: [],
      favorites: [],
      editedAt: new Date(),
      fullName: authorName,
      stories: stories,
    });

    console.log(`✅ Created user ${uid}`);
  }

  console.log("🎉 Done!");
}

syncUsersFromStories().catch(console.error);
