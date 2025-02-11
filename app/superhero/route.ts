import { NextResponse } from "next/server";
import redis from "@/lib/redis";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

type Superhero = {
  id: number;
  name: string;
  superpower: string;
  humility: number;
  image: string;
};

export async function GET() {
  try {
    const data = await redis.get("superheroes");

    if (!data) {
      return NextResponse.json([], { status: 200 });
    }

    let superheroes: Superhero[];
    if (typeof data === "string") {
      superheroes = JSON.parse(data);
    } else {
      superheroes = data as Superhero[];
    }

    const sortedHeroes = superheroes.sort((a, b) => b.humility - a.humility);

    return NextResponse.json(sortedHeroes);
  } catch (error) {
    console.error("Error in GET /superhero:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// Configure the S3 client to connect to Cloudflare R2
const s3 = new S3Client({
  endpoint: process.env.NEXT_PUBLIC_CF_R2_ENDPOINT, 
  region: "auto", 
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_CF_R2_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.NEXT_PUBLIC_CF_R2_SECRET_ACCESS_KEY || "",
  },
});

export async function POST(req: Request) {
    try {
      // Parse multipart/form-data using req.formData()
      const formData = await req.formData();
      const name = formData.get("name")?.toString();
      const superpower = formData.get("superpower")?.toString();
      const humilityStr = formData.get("humility")?.toString();
      const file = formData.get("image") as File;
    
      // Validate required fields
      if (!name || !superpower || !humilityStr || !file) {
        return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
      }
      const humility = Number(humilityStr);
      if (isNaN(humility) || humility < 1 || humility > 10) {
        return NextResponse.json({ error: "Invalid humility score" }, { status: 400 });
      }
    
      // Validate image file type (allow only PNG, JPEG, SVG)
      const allowedTypes = ["image/png", "image/jpeg", "image/svg+xml"];
      if (!allowedTypes.includes(file.type)) {
        return NextResponse.json({ error: "Invalid image format" }, { status: 400 });
      }
    
      // Retrieve current superhero data from Redis to determine new ID

      const redisdata = await redis.get("superheroes");
      if (!redisdata) {
        return NextResponse.json([], { status: 200 });
      }
  
      let superheroes: Superhero[] = [];
      if (typeof redisdata === "string") {
        superheroes = JSON.parse(redisdata);
      } else {
        superheroes = redisdata as Superhero[];
      }


      const newId = superheroes.length + 1;
    
      // Determine the file extension from the uploaded file name
      const dotIndex = file.name.lastIndexOf(".");
      const extension = dotIndex >= 0 ? file.name.substring(dotIndex) : "";
    
      // Construct the file key: "hero" + newId + extension, e.g., "hero5.png"
      const fileKey = `hero-${newId}${extension}`;
    
      // Convert the file to a Buffer for upload
      const fileBuffer = Buffer.from(await file.arrayBuffer());
    
      // Upload the file to Cloudflare R2
      const putCommand = new PutObjectCommand({
        Bucket: process.env.NEXT_PUBLIC_CF_R2_BUCKET_NAME, // e.g., "superhero"
        Key: fileKey,
        Body: fileBuffer,
        ContentType: file.type,
      });
      await s3.send(putCommand);
    
      // Construct the public URL for the uploaded image
      const imageUrl = `${process.env.NEXT_PUBLIC_CF_R2_UPLOAD_URL}/${fileKey}`;
    
      // Create a new superhero object with the incremental id and image URL
      const newSuperhero: Superhero = {
        id: newId,
        name,
        superpower,
        humility,
        image: imageUrl,
      };
    
      superheroes.push(newSuperhero);
    
      // Save the updated superhero array back to Redis as a JSON string
      await redis.set("superheroes", JSON.stringify(superheroes));
    
      return NextResponse.json(newSuperhero, { status: 201 });
    } catch (error) {
      console.error("Error in POST /superhero:", error);
      return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
  }


  /*
  Alternative Approach: Using an In-Memory Array as the "Database"
  
  // Uncomment the lines below and comment out Redis-related code if you prefer
  // to use a simple array for storage (e.g., during development).
  
  let superheroesDB: Superhero[] = [];

  // GET handler using the in-memory array
  export async function GET() {
    try {
      // Sort the superheroes from the array by humility (descending)
      const sortedHeroes = superheroesDB.sort((a, b) => b.humility - a.humility);
      return NextResponse.json(sortedHeroes);
    } catch (error) {
      console.error("Error in GET /superhero:", error);
      return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
  }

  // POST handler using the in-memory array
  export async function POST(req: Request) {
    try {
      // Parse the multipart/form-data using req.formData()
      const formData = await req.formData();
      const name = formData.get("name")?.toString();
      const superpower = formData.get("superpower")?.toString();
      const humilityStr = formData.get("humility")?.toString();
      const file = formData.get("image") as File;

      // Validate required fields
      if (!name || !superpower || !humilityStr || !file) {
        return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
      }
      const humility = Number(humilityStr);
      if (isNaN(humility) || humility < 1 || humility > 10) {
        return NextResponse.json({ error: "Invalid humility score" }, { status: 400 });
      }

      // Validate image file type (allow only PNG, JPEG, SVG)
      const allowedTypes = ["image/png", "image/jpeg", "image/svg+xml"];
      if (!allowedTypes.includes(file.type)) {
        return NextResponse.json({ error: "Invalid image format" }, { status: 400 });
      }

      // Determine new superhero ID based on the array length
      const newId = superheroesDB.length + 1;

      // Determine the file extension from the uploaded file name
      const dotIndex = file.name.lastIndexOf(".");
      const extension = dotIndex >= 0 ? file.name.substring(dotIndex) : "";

      // Construct the file key: e.g., "hero-5.png"
      const fileKey = `hero-${newId}${extension}`;

      // (Optionally, you can still upload the image to Cloudflare R2)
      // Convert the file to a Buffer for upload
      const fileBuffer = Buffer.from(await file.arrayBuffer());

      // Configure the S3 client to connect to Cloudflare R2
      const s3 = new S3Client({
        endpoint: process.env.NEXT_PUBLIC_CF_R2_ENDPOINT,
        region: "auto",
        credentials: {
          accessKeyId: process.env.NEXT_PUBLIC_CF_R2_ACCESS_KEY_ID || "",
          secretAccessKey: process.env.NEXT_PUBLIC_CF_R2_SECRET_ACCESS_KEY || "",
        },
      });

      // Upload the file to Cloudflare R2
      const putCommand = new PutObjectCommand({
        Bucket: process.env.NEXT_PUBLIC_CF_R2_BUCKET_NAME, // e.g., "superhero"
        Key: fileKey,
        Body: fileBuffer,
        ContentType: file.type,
      });
      await s3.send(putCommand);

      // Construct the public URL for the uploaded image
      const imageUrl = `${process.env.NEXT_PUBLIC_CF_R2_UPLOAD_URL}/${fileKey}`;

      // Create a new superhero object with the incremental id and image URL
      const newSuperhero: Superhero = {
        id: newId,
        name,
        superpower,
        humility,
        image: imageUrl,
      };

      // Add the new superhero to the in-memory array
      superheroesDB.push(newSuperhero);

      return NextResponse.json(newSuperhero, { status: 201 });
    } catch (error) {
      console.error("Error in POST /superhero:", error);
      return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
  }
*/
