export function createNavigation(stories, type) {
  return {
    type,
    storyInfo: stories.map((story) => ({
      storyId: story.id,
      title: story.title,
    })),
  };
}
