import { render, screen } from "@testing-library/vue";
import Show from "@/views/Show.vue";
import axios from "axios";
import { getConfig } from "@/config";

// Mock axios
jest.mock("axios");

// Mock the ListItem component with a render function
jest.mock("@/components/ListItem.vue", () => ({
  name: "ListItem",
  props: {
    title: String,
    link: String,
    score: Number,
    user: String,
    comment_link: String,
    comment_count: Number,
  },
  render(h) {
    return h(
      "div",
      {
        attrs: {
          "data-testid": "list-item",
        },
      },
      [
        h("a", { attrs: { href: this.link } }, this.title),
        h("span", `by ${this.user}`),
      ],
    );
  },
}));

describe("Show.vue", () => {
  const { apiUrl } = getConfig();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockStories = [
    {
      id: 1,
      title: "Show HN: First Project",
      url: "https://github.com/user1/project1",
      points: 100,
      submitted_by: "user1",
      comments: 50,
      comments_url: "https://example.com/comments/1"
    },
    {
      id: 2,
      title: "Show HN: Second Project",
      url: "https://github.com/user2/project2",
      points: 200,
      submitted_by: "user2",
      comments: 75,
      comments_url: "https://example.com/comments/2"
    },
    {
      id: 3,
      title: "Show HN: Third Project",
      url: "https://github.com/user3/project3",
      points: 300,
      submitted_by: "user3",
      comments: 25,
      comments_url: "https://example.com/comments/3"
    },
  ];

  it("renders the page title correctly", async () => {
    // Mock successful responses
    axios.get.mockResolvedValue({ data: [] });

    const { getByText } = render(Show);
    expect(getByText("Show HN")).toBeTruthy();
  });

  it("fetches and displays show posts correctly", async () => {
    // Mock the API call
    axios.get.mockResolvedValue({ data: mockStories });

    const { findAllByTestId, findByText } = render(Show);

    // Wait for all list items to be rendered
    const listItems = await findAllByTestId("list-item");
    expect(listItems).toHaveLength(3);

    // Verify some content is rendered
    expect(await findByText("Show HN: First Project")).toBeTruthy();
    expect(await findByText("by user1")).toBeTruthy();

    // Verify that API was called correctly
    expect(axios.get).toHaveBeenCalledWith(`${apiUrl}/stories/show`);
  });

  it("renders empty state when API fails", async () => {
    // Mock failed API call
    axios.get.mockRejectedValue(new Error("API Error"));

    const { container } = render(Show);
    await new Promise((resolve) => setTimeout(resolve, 0));

    // Verify only the container and title are rendered
    expect(container.querySelectorAll('[data-testid="list-item"]')).toHaveLength(0);
  });

  it("properly passes URLs to list items", async () => {
    const story = {
      id: 1,
      title: "Show HN: Test Project",
      url: "https://example.com/project",
      points: 100,
      submitted_by: "user1",
      comments: 50,
      comments_url: "https://example.com/comments/1"
    };

    axios.get.mockResolvedValue({ data: [story] });

    const { findByTestId } = render(Show);

    // Wait for the component to render
    const listItem = await findByTestId("list-item");
    const link = listItem.querySelector("a");
    expect(link.getAttribute("href")).toBe(story.url);
  });
});
