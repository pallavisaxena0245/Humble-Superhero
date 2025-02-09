import json
import requests
import sys

# Set Upstash Redis credentials
# Either load these from environment variables or replace with your actual values.
upstash_url = "https://better-snipe-12845.upstash.io"
upstash_token =  "ATItAAIjcDEyMzhmZDRmZWQ4OGQ0YTZkYWUwN2NjYTczYzU0ZWZhN3AxMA"

if not upstash_url or not upstash_token:
    print("Please set UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN environment variables.")
    sys.exit(1)

# Dummy superhero data with image URLs pointing to Cloudflare R2.
superheroes = [
    {
        "id": 1,
        "name": "Captain Kind",
        "superpower": "Super Strength",
        "humility": 9,
        "image": "https://pub-8e08087028fb4eb9b469a0853f7a9fc6.r2.dev/hero-1.png"
    },
    {
        "id": 2,
        "name": "Humble Flash",
        "superpower": "Speed",
        "humility": 8,
        "image": "https://pub-8e08087028fb4eb9b469a0853f7a9fc6.r2.dev/hero-2.png"
    },
    {
        "id": 3,
        "name": "Zen Master",
        "superpower": "Telepathy",
        "humility": 10,
        "image": "https://pub-8e08087028fb4eb9b469a0853f7a9fc6.r2.dev/hero-3.png"
    },
    {
        "id": 4,
        "name": "Guardian Light",
        "superpower": "Energy Beams",
        "humility": 7,
        "image": "https://pub-8e08087028fb4eb9b469a0853f7a9fc6.r2.dev/hero-4.png"
    }
]

# The key under which the data will be stored in Redis.
# The key under which the data will be stored in Redis
key = "superheroes"
# Use the Upstash REST API endpoint for setting a key.
# When using header-based authentication, omit the token from the URL.
url = f"{upstash_url}/set/{key}"

# Convert the dummy data to JSON.
data = json.dumps(superheroes)

# Use the Authorization header to send your token.
headers = {
    "Authorization": f"Bearer {upstash_token}",
    "Content-Type": "application/json"
}

# Send the POST request to Upstash Redis.
response = requests.post(url, data=data, headers=headers)

if response.ok:
    print("✅ Dummy superhero data seeded successfully!")
    print(response.text)
else:
    print("❌ Failed to seed data:", response.status_code, response.text)