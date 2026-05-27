import admin from "firebase-admin";
import { readFileSync } from "fs";
import { faker } from "@faker-js/faker";

const serviceAccount = JSON.parse(
  readFileSync("./serviceAccountKey.json", "utf8"),
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

// 20 large/developed countries - i could use the api for this but i want to avoid lesser known countries being used to ensure its instantly recognisable to users.
const countries = [
  "US",
  "GB",
  "CA",
  "AU",
  "DE",
  "FR",
  "JP",
  "KR",
  "IT",
  "ES",
  "NL",
  "SE",
  "NO",
  "DK",
  "CH",
  "NZ",
  "IE",
  "SG",
  "CN",
  "IN",
];

function getRandomCountry() {
  return countries[Math.floor(Math.random() * countries.length)];
}

async function updateUsers() {
  console.log("🔍 Fetching users...");

  const usersSnap = await db.collection("users").get();

  console.log(`👥 Found ${usersSnap.size} users`);

  for (const userDoc of usersSnap.docs) {
    const uid = userDoc.id;

    const updateData = {
      country: getRandomCountry(),
      photoURL: faker.image.personPortrait(),
      editedAt: new Date(),
    };

    await db.collection("users").doc(uid).update(updateData);

    console.log(`✅ Updated user ${uid}`);
  }

  console.log("🎉 Done updating all users!");
}

updateUsers().catch(console.error);
