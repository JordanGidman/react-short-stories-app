import { faker } from "@faker-js/faker";

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
const stories = [];

genres.forEach((genre) => {
  stories.push(...createRandomStories(genre));
});

function validateImage(url) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(url);
    img.onerror = () =>
      resolve(
        faker.image.urlPicsumPhotos({
          category: "animals",
          blur: 0,
        })
      );
    img.src = url;
  });
}

async function createRandomStories(genre) {
  const randomStories = await Promise.all(
    Array.from({ length: 20 }, async () => {
      const fakerUrl = faker.image.urlLoremFlickr({ category: "book" });
      const validUrl = await validateImage(fakerUrl);

      return {
        id: faker.string.uuid(),
        creatorID: faker.string.uuid(),
        title: faker.word.words({ length: { min: 2, max: 5 } }),
        author: faker.person.fullName(),
        storyText: faker.lorem.paragraphs(),
        synopsis: faker.lorem.sentences(2),
        genre: genre,
        img: validUrl, // always valid
      };
    })
  );

  return randomStories;
}

console.log(stories);
