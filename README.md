# Humble Superhero API
## Overview

The Humble Superhero API lets users:

- **Add a new superhero:**  
  - Endpoint: `POST /superhero`
  - Accepts: Superhero name, superpower, humility score (1-10), and an image file.
  - The image is uploaded to a Cloudflare R2 bucket and its public URL is stored with the superhero data in Redis.
  
- **Fetch superheroes:**  
  - Endpoint: `GET /superhero`
  - Returns: A list of superheroes sorted by humility score (highest first).

The frontend (built with Next.js and styled with Tailwind CSS) also supports user authentication (using NextAuth for Google and Guest sign-in) and features a visually engaging interface with animations from Framer Motion.

---

## Tech Stack

- **Next.js:** Full-stack framework for both server (API routes) and frontend.
- **Redis (Upstash):** Used as a persistent key-value store for superhero data.
- **Cloudflare R2:** S3-compatible object storage for superhero images.
- **NextAuth:** Provides secure user authentication.
- **Tailwind CSS:** For building responsive and modern UI designs.
- **Framer Motion:** For adding dynamic animations to the UI.
- **Jest:** For testing API endpoints and ensuring functionality.

You can view the deployed project [here](https://humble-superhero.vercel.app).

---
## Installation

Clone the repository:

```bash
git clone https://github.com/yourusername/humble-superhero-api.git
cd humble-superhero-api
```
Install all dependencies 
```bash
npm install
```

Add all the environment variable
```python
# Cloudflare R2 Credentials
CF_R2_BUCKET_NAME=superhero
CF_R2_ENDPOINT=https://your-r2-endpoint.r2.cloudflarestorage.com
CF_R2_ACCESS_KEY_ID=your_access_key_id
CF_R2_SECRET_ACCESS_KEY=your_secret_access_key

# Upstash Redis Credentials
UPSTASH_REDIS_REST_URL=https://your-upstash-redis-url
UPSTASH_REDIS_REST_TOKEN=your_upstash_redis_token

# NextAuth Secret
NEXTAUTH_SECRET=your_nextauth_secret

# Google OAuth Credentials
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```
Build the environment(Optional)
```bash
npm run build
```
Start the development derver
```bash
npm run dev
```



## System Design Considerations
--- add system design diagram this is the link https://pub-8e08087028fb4eb9b469a0853f7a9fc6.r2.dev/Readme_img/system-design.png

### CIA Model

We have applied the **CIA** (Confidentiality, Integrity, Availability) model to our design with the following priorities:

- **Integrity**:  
  - All users see the same, consistent leaderboard ratings.
  - Data consistency is ensured across GET and POST requests.
  
- **Availability**:  
  - The app is designed to be up and running at all times.
  - High availability is achieved through robust API design and redundancy considerations.
  
- **Confidentiality**:  
  - Since the app does not handle a lot of sensitive information, confidentiality is less of a priority in this context.

### API Design

- **GET Requests**:  
  - Retrieve the necessary information such as current leaderboard data.
  
- **POST Requests**:  
  - Allow users to submit new scores or updates.
  - Ensure data integrity by validating and updating the leaderboard accordingly.
  
- **Endpoint Structure**:  
  - We focus on having dedicated endpoints for GET and POST actions, minimizing complexity while ensuring reliability.

### Data Storage

- **In-Memory Database**:  
  - Uses an array to store leaderboard data for fast access.
  - Ideal for a simple and fast application where persistent storage is not a primary concern.

- **Static Assets & Images**:  
  - Images and other public data are stored on a public endpoint.
  - Utilizes Cloudflare R2, which is compatible with S3, to handle storage of static assets efficiently.

-----

## Working with a Colleague to Expand This Task

To expand and improve this project, we can effectively divide responsibilities based on our individual strengths while also collaborating on overlapping areas. For example:

- **Division of Labor:**
  - **My Responsibilities:** SQL querying, database design, and management.
  - **Colleague's Responsibilities:** Frontend design, API calls, and routing.
  
- **Overlapping Tasks:**
  - **Security Protocols & Firewalls:** Both of us can work together on implementing robust security measures.
  - **Testing & Code Reviews:** Regular pair programming sessions and code reviews to maintain high code quality and consistency.
  - **Documentation & Continuous Improvement:** Collaborate on updating documentation and brainstorming future improvements.

- **Additional Collaboration Inputs:**
  - **Communication:** Use tools like GitHub Issues, Slack, or Zoom for regular updates and discussions.
  - **Agile Practices:** Organize regular stand-up meetings and retrospectives to discuss progress and potential improvements.
  - **Feature Planning:** Jointly plan and prototype new features, ensuring alignment and shared ownership of the project roadmap.

---

## What Could Have Been Done Better With More Time?

### Orchestration

- **New Feature:**
  - Develop a weekly algorithm that randomly rates superheroes, dynamically adjusting the ratings based on user interactions.
  - Integrate user feedback by allowing users to influence the humility score—leveraging AI (such as OpenAI) to analyze the superhero's popularity and overall user sentiment.

- **Docker:**
  - Implement Docker for containerization to eliminate hardware dependencies.
  - This would simplify deployment, improve scalability, and ensure a consistent environment across different stages (development, testing, and production).

### Session Management

- **JWT Tokens:**
  - Use JSON Web Tokens for managing sessions.
  - This approach ensures secure user authentication and maintains session validity efficiently.

### Security Enhancements

- **Access Controls:**
  - Implement role-based access controls where necessary to protect sensitive endpoints.
  
- **Rate Limiting:**
  - Enforce rate limiting on API endpoints to prevent abuse and ensure fair usage among all users.
  
- **Other Security Measures:**
  - Validate input data rigorously.
  - Adopt practices to protect against common web vulnerabilities, such as SQL injection, XSS, and CSRF attacks.

---

## Snapshots

1. **Login Page:**  
   The login page where users can sign in as authenticated users or continue as guests.  
   ![Login Page](https://pub-8e08087028fb4eb9b469a0853f7a9fc6.r2.dev/Readme_img/login.png)

2. **Home Page:**  
   The home page greets users with a random superhero trivia.  
   ![Home Page](https://pub-8e08087028fb4eb9b469a0853f7a9fc6.r2.dev/Readme_img/home.png)

3. **Leaderboard:**  
   Check out the leaderboard to see the ratings of various superheroes.  
   ![Leaderboard](https://pub-8e08087028fb4eb9b469a0853f7a9fc6.r2.dev/Readme_img/leaderboard.png)

4. **Add Superhero:**  
   Users can add their own superhero and see the updated score on the leaderboard.  
   ![Add Superhero](https://pub-8e08087028fb4eb9b469a0853f7a9fc6.r2.dev/Readme_img/add_superhero.png)  
   ![Superhero Added](https://pub-8e08087028fb4eb9b469a0853f7a9fc6.r2.dev/Readme_img/superhero_added.png)

---
