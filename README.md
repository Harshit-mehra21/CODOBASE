# CODOBASE

CodeBase (CODOBASE) is a real, persistent, authenticated multiplayer coding and collaboration platform where developers worldwide can collaborate in real time, practice DSA problems across 6 programming languages, build fullstack projects side-by-side, and grow their engineering network.

---

## 🚀 Key Features

- **Permanent Room & World History**: Append-only audit logs track every code change, object movement, and file update.
- **6 Specialized AI Mentors**: Historian, CS Tutor, Code Reviewer, Architecture Roadmap, AST Refactorer, and Team Collaborator.
- **3,000+ Algorithmic Practice Problems**: Spanning 22 DSA topics in TypeScript, JavaScript, Python, C++, Java, and Rust with authoritative coin rewards and streak tracking.
- **Real Verified Profiles & 1-on-1 Direct Messaging**: Verified links to GitHub, LinkedIn, and LeetCode, with direct messaging between engineers.
- **Side-by-Side Monaco Editor & Live Preview**: Real-time dev execution runner with instant console logs.
- **3-Strike Moderation & Permanent Blacklist**: Built-in protection against abusive language with automatic account suspension and admin moderation registry.
- **Sub-Rooms & 20-Builder Cap**: Dynamic Version 2.0 room spawning for large teams.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router with Turbopack)
- **Frontend**: React 19, Tailwind CSS v4, Lucide Icons
- **Code Editor**: Monaco Editor
- **Authentication**: JWT (`jose`), `bcryptjs`, Role-Based Access Control (DEVELOPER, ADMIN, USER)
- **Database**: Persistent JSON storage with append-only audit logging (Vercel serverless-ready)

---

## 💻 Getting Started Locally

1. Clone the repository:
   ```bash
   git clone https://github.com/Harshit-mehra21/CODOBASE.git
   cd CODOBASE
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🌐 Deploy to Vercel

1. Import the repository in [Vercel](https://vercel.com).
2. The framework will automatically be detected as **Next.js**.
3. Click **Deploy**.
