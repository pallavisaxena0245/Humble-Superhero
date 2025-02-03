// superhero.test.ts
import { GET, POST } from "../route"; 
import redis from "@/lib/redis";

// --- Mocks ---
jest.mock("@/lib/redis", () => ({
  get: jest.fn(),
  set: jest.fn(),
}));

const sendMock = jest.fn();
jest.mock("@aws-sdk/client-s3", () => {
  const originalModule = jest.requireActual("@aws-sdk/client-s3");
  return {
    ...originalModule,
    S3Client: jest.fn().mockImplementation(() => ({
      send: sendMock,
    })),
  };
});

describe("Superhero API Endpoints", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("GET /superhero", () => {
    it("returns superheroes sorted by humility descending", async () => {
      // Define unsorted heroes.
      const heroes = [
        { id: 1, name: "Hero1", superpower: "Flying", humility: 5, image: "url1" },
        { id: 2, name: "Hero2", superpower: "Strength", humility: 8, image: "url2" },
        { id: 3, name: "Hero3", superpower: "Invisibility", humility: 3, image: "url3" },
      ];
      // Simulate Redis returning the heroes array as a JSON string.
      (redis.get as jest.Mock).mockResolvedValue(JSON.stringify(heroes));

      // Create a sorted copy of heroes (descending by humility).
      const expectedSortedHeroes = [...heroes].sort((a, b) => b.humility - a.humility);

      const response = await GET();
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data).toEqual(expectedSortedHeroes);
    });
  });

  describe("POST /superhero", () => {
    // Helper to create a fake Request object with a formData() method.
    const createFakeRequest = (formDataValues: Record<string, FormDataEntryValue>): Request => ({
      async formData() {
        return { get: (key: string) => formDataValues[key] };
      },
    } as unknown as Request);

    it("returns an error if required fields are missing", async () => {
      // Minimal fake file object to simulate a File.
      const fakeFile = {
        name: "image.png",
        type: "image/png",
        size: 3, // Dummy size
        lastModified: Date.now(),
        webkitRelativePath: "",
        async arrayBuffer() {
          return new Uint8Array([1, 2, 3]).buffer;
        },
      } as unknown as File;
      
      
      // Omitting the "name" field.
      const req = createFakeRequest({
        superpower: "Flying",
        humility: "5",
        image: fakeFile,
      });
      const response = await POST(req);
      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data).toEqual({ error: "Missing required fields" });
    });
  });
});
