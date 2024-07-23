# Blogify
This is a simple blogging website and clone of Medium, allowing users to share their thoughts and ideas through blog posts and interact with others' blog posts.

## Tech Stack

- **Backend**: Hono.js
- **Frontend**: React.js
- **Database**: PostgreSQL
- **Deployment**: Cloudflare Workers and Vercel
- **Styling**: Tailwind CSS
- **Image Handling**: Cloudinary
- **State Management**: Zustand

## Setup on Your Local Machine

To set up the project on your local machine, follow these steps:

1. **Clone the repository:**

   ```bash
   git clone https://github.com/VaibhavArora314/blogging-website.git
   cd blogging-website
   ```
2. **Setup environment variables in backend**
   
   a. Get a PostgreSQL database URL from an online provider or create a docker container for it.

   b. Create an account on Cloudinary and get the Cloudinary cloud name.
       Go to Settings > Upload > Add Upload Preset and create a new unsigned upload preset.
       ![image](https://github.com/user-attachments/assets/4f8abfd2-2e10-473c-a107-b46871b068d7)
   c. Create a .env file similar to the .env.example file
       https://github.com/VaibhavArora314/blogging-website/blob/10c3420ceae155125507caa4fdc9ac091fd84f38/backend/.env.example#L1
   d. Create a wrangler.toml file similar to the wrangler.toml.example file
       https://github.com/VaibhavArora314/blogging-website/blob/10c3420ceae155125507caa4fdc9ac091fd84f38/backend/wrangler.toml.example#L1-L8
4. **Install dependencies and start backend**
   ```bash
   cd backend
   npm install
   npx prisma generate --no-engine
   npm run dev
   ```
5. **Environment Variables in frontend**
   Create a .env file similar to the .env.example file and add backend url on your local machine
   https://github.com/VaibhavArora314/blogging-website/blob/10c3420ceae155125507caa4fdc9ac091fd84f38/frontend/.env.example#L1
6. **Install dependencies and start frontend**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

## Contributing
If you would like to contribute to the project, please fork the repository and create a pull request. We welcome all contributions!

## License
This project is licensed under the MIT License. See the [LICENSE](https://github.com/VaibhavArora314/blogging-website/blob/main/LICENSE) file for details.
