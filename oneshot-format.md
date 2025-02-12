<TEMPLATE>
<INSTRUCTIONS>
Use the <CODEBASE> code as reference, and convert the high-level <TASK> into a set of very detailed step-by-step instructions that an AI coding agent can complete. 
Only includes steps an AI coding agent can take. Do not include testing or any other work a human would do to confirm the task has been completed. 
ALWAYS have the agent run a build when it is complete. Be specific and decisive about what the agent should do. 
Do not include any additional meta instructions to the user. Use markdown formatting.
</INSTRUCTIONS>
<TASK>

Below is an updated, detailed task list that reflects the latest documentation and tech stack (Next.js, TypeScript, Tailwind CSS, shadcn/ui, Firebase, and pnpm). Each task is roughly one story point and organized by theme.

---

## 2. Database & Data Modeling (Firebase Firestore)

- **2.1. Create Firestore Collections**

  - Create a **Projects** collection with fields such as `name`, `description`, `repoUrl`, `tags`, `createdAt`, etc.
  - Create a **ForkIdeas** collection with fields like `projectId`, `ideaText`, `userId`, `createdAt`.
  - _(Optional)_ Create a **Comments** collection if you plan to allow threaded discussions on fork ideas.

- **2.2. Define Data Relationships & Indexing**
  - Document relationships (e.g., how fork ideas relate to projects).
  - Configure Firestore indexes if needed for queries (e.g., filtering by language or date).

---

## 3. Project Listing & GitHub API Integration

- **3.1. Develop GitHub API Service**

  - Create a dedicated service/module that wraps GitHub’s REST or GraphQL API.
  - Implement queries to search for open source projects (e.g., using criteria like license, language, and stars).

- **3.2. Implement Data Fetching & Caching**

  - Write a function to fetch popular open source projects from GitHub.
  - _(Optional)_ Cache data in Firestore to help mitigate GitHub API rate limits.

- **3.3. Create Home Page for Project Listing**

  - Build a Next.js page that displays a list of projects fetched from either GitHub or Firestore.
  - Use shadcn/ui components along with Tailwind CSS for a polished design.
  - Display essential project details (name, description, link to repository).

- **3.4. Add Search & Filter Functionality**
  - Implement a search bar and filters (e.g., by language, license) to allow users to refine the project list.
  - Update the project list in real time based on user input.

---

## 4. Project Detail Page & Fork Idea Integration

- **4.1. Implement Dynamic Routing for Project Details**

  - Create a dynamic Next.js route (e.g., `pages/projects/[id].tsx`) to display individual project details.
  - Fetch project-specific data from Firestore (or combine with GitHub API data).

- **4.2. Display Detailed Repository Information**

  - Show project details, including a description, repository URL, and any additional metadata.
  - Use shadcn/ui components to present information clearly.

- **4.3. Integrate Fork Idea Listing & Submission**
  - Retrieve and display all fork ideas related to the project.
  - Create a submission form on the project detail page to allow users to add a new fork idea.
  - Validate the form input and write new fork ideas to Firestore.
- **4.4. Implement Error Handling & Loading States**
  - Add loading indicators for data fetching.
  - Display appropriate error messages if API calls or Firestore interactions fail.

---

## 6. UI & Styling with Tailwind CSS & shadcn/ui

- **6.1. Global Styling Setup**

  - Set up Tailwind CSS configuration.
  - Ensure global styles are applied across all pages.

- **6.2. Implement Component Styling with shadcn/ui**

  - Use shadcn/ui components where appropriate (e.g., buttons, forms, cards).
  - Customize components to match the desired design and branding.

- **6.3. Responsive Design & UI Enhancements**
  - Test and refine the responsive design across various screen sizes.
  - Add visual enhancements such as animations or interactive feedback (e.g., loading spinners, notifications).

---

Following this task list will help ensure that the project is built in a modular, scalable way while leveraging all aspects of the updated tech stack. Happy coding!

</TASK>
<CODEBASE>

<file_contents>
File: /Users/nichnarmada/Documents/projects/opensource-catalog/app/globals.css

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --background: #ffffff;
  --foreground: #171717;
}

@media (prefers-color-scheme: dark) {
  :root {
    --background: #0a0a0a;
    --foreground: #ededed;
  }
}

body {
  color: var(--foreground);
  background: var(--background);
  font-family: Arial, Helvetica, sans-serif;
}

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;
    --primary: 222.2 47.4% 11.2%;
    --primary-foreground: 210 40% 98%;
    --secondary: 210 40% 96.1%;
    --secondary-foreground: 222.2 47.4% 11.2%;
    --muted: 210 40% 96.1%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --accent: 210 40% 96.1%;
    --accent-foreground: 222.2 47.4% 11.2%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 222.2 84% 4.9%;
    --chart-1: 12 76% 61%;
    --chart-2: 173 58% 39%;
    --chart-3: 197 37% 24%;
    --chart-4: 43 74% 66%;
    --chart-5: 27 87% 67%;
    --radius: 0.5rem;
  }
  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    --card: 222.2 84% 4.9%;
    --card-foreground: 210 40% 98%;
    --popover: 222.2 84% 4.9%;
    --popover-foreground: 210 40% 98%;
    --primary: 210 40% 98%;
    --primary-foreground: 222.2 47.4% 11.2%;
    --secondary: 217.2 32.6% 17.5%;
    --secondary-foreground: 210 40% 98%;
    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;
    --accent: 217.2 32.6% 17.5%;
    --accent-foreground: 210 40% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 40% 98%;
    --border: 217.2 32.6% 17.5%;
    --input: 217.2 32.6% 17.5%;
    --ring: 212.7 26.8% 83.9%;
    --chart-1: 220 70% 50%;
    --chart-2: 160 60% 45%;
    --chart-3: 30 80% 55%;
    --chart-4: 280 65% 60%;
    --chart-5: 340 75% 55%;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}
```

File: /Users/nichnarmada/Documents/projects/opensource-catalog/app/layout.tsx

```tsx
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  )
}
```

File: /Users/nichnarmada/Documents/projects/opensource-catalog/app/page.tsx

```tsx
import Image from "next/image"

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />
        <ol className="list-inside list-decimal text-sm text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
          <li className="mb-2">
            Get started by editing{" "}
            <code className="bg-black/[.05] dark:bg-white/[.06] px-1 py-0.5 rounded font-semibold">
              app/page.tsx
            </code>
            .
          </li>
          <li>Save and see your changes instantly.</li>
        </ol>

        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <a
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              className="dark:invert"
              src="/vercel.svg"
              alt="Vercel logomark"
              width={20}
              height={20}
            />
            Deploy now
          </a>
          <a
            className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:min-w-44"
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Read our docs
          </a>
        </div>
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Learn
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Examples
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Go to nextjs.org →
        </a>
      </footer>
    </div>
  )
}
```

File: /Users/nichnarmada/Documents/projects/opensource-catalog/config/firebase.ts

```ts
import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

export { db }
```

File: /Users/nichnarmada/Documents/projects/opensource-catalog/documentation/overview.md

```md
# Open Source Brainstorm App Overview

**What is this app?**

Open Source Brainstorm is a collaborative web platform designed to help developers and enthusiasts explore, discuss, and ideate on existing open source projects. It serves as a centralized hub where users can browse a curated list of projects (sourced from GitHub), view detailed project information, and share their own ideas for forking or enhancing these projects.

---

**Key Features:**

- **Project Listing:**  
  Browse a curated list of open source projects with essential information such as name, description, and GitHub repository link.

- **Project Details:**  
  View comprehensive details about each project, including metadata from GitHub and user-submitted fork ideas.

- **Fork Ideas:**  
  Contribute ideas on how to fork or improve a project, and engage with ideas submitted by others.

- **User Authentication:**  
  Secure sign-up and login via Firebase Authentication, ensuring that only authenticated users can submit and manage fork ideas.

- **Search & Filter:**  
  Quickly search for projects and apply filters (e.g., by programming language or license) to narrow down the list.

---

**Why Use Open Source Brainstorm?**

- **Collaborative Innovation:**  
  Leverage community insights to identify potential improvements in open source projects.

- **Curated Content:**  
  Discover high-quality projects without the hassle of manual searches.

- **Community Engagement:**  
  Share your ideas and interact with like-minded developers to spark new initiatives and enhance existing projects.

---

Happy coding and brainstorming!
```

File: /Users/nichnarmada/Documents/projects/opensource-catalog/documentation/tech-stack.md

```md
# Tech Stack

This project leverages a modern web technology stack to build a robust, scalable, and maintainable application. Below is an overview of the key technologies used:

---

## Frontend

- **Next.js**  
  A React framework that supports server-side rendering (SSR) and static site generation (SSG), making it ideal for building fast, SEO-friendly web applications.

- **TypeScript**  
  A strongly-typed superset of JavaScript that enhances code quality and developer productivity by catching errors during development.

- **Tailwind CSS**  
  A utility-first CSS framework that accelerates UI development with pre-defined classes. It provides a highly customizable and responsive design system.

- **shadcn/ui**  
  A component library built to work seamlessly with Tailwind CSS. It provides pre-designed, customizable components that speed up the development process while maintaining a consistent design language.

---

## Backend & Services

- **Firebase**  
  A comprehensive app development platform by Google. In this project, Firebase is used for:
  - **Firebase Authentication:** Secure user authentication and authorization.
  - **Firebase Firestore:** A NoSQL document database for storing and syncing app data in real time.
  - **Firebase Hosting:** Fast and secure hosting for web applications.
  - _(Optional)_ **Firebase Functions:** For implementing serverless backend logic if needed.

---

## Deployment & Tooling

- **Vercel**  
  A platform optimized for Next.js deployments, offering features like serverless functions, continuous integration, and automatic deployments.

- **pnpm**  
  A fast, disk space efficient package manager that is used to manage the project's dependencies.

- **ESLint & Prettier**  
  Tools for maintaining consistent code style and quality through linting and formatting.

- **Git & GitHub**  
  Version control (Git) and repository hosting (GitHub) for managing and collaborating on the project codebase.

---

This tech stack ensures a modern development workflow, enhances developer experience, and provides a solid foundation for building a high-quality application.
```

File: /Users/nichnarmada/Documents/projects/opensource-catalog/documentation/user-stories.md

```md
# Open Source Brainstorm App User Stories

Below is a collection of user stories to guide the development of the app. Each story represents a small, incremental piece of functionality (approximately one story point each).

---

## As a Visitor

- **US1: Browse Projects**  
  _As a visitor, I want to view a list of open source projects so that I can discover interesting projects to explore._

- **US2: View Project Details**  
  _As a visitor, I want to click on a project to view detailed information (description, repository link, and fork ideas) so that I can understand its context and potential._

- **US3: Read Fork Ideas**  
  _As a visitor, I want to read fork ideas submitted by other users so that I can see various suggestions for improvements or new features._

---

## As an Authenticated User

- **US4: User Authentication**  
  _As a user, I want to sign up and log in securely using Firebase Authentication so that I can contribute fork ideas and participate in the community._

- **US5: Submit Fork Ideas**  
  _As an authenticated user, I want to submit my own fork ideas for a project so that I can share my perspective and contribute to potential improvements._

- **US6: Edit/Delete Fork Ideas**  
  _As an authenticated user, I want to edit or delete my submitted fork ideas so that I can update or remove my contributions as needed._

- **US7: Search & Filter Projects**  
  _As an authenticated user, I want to search and filter projects by criteria (e.g., language, license) so that I can quickly find projects that interest me._

- **US8: Engage with the Community**  
  _As an authenticated user, I want to comment on or react to fork ideas so that I can participate in discussions and share feedback._

---

## As an Administrator (Optional)

- **US9: Moderate Content**  
  _As an admin, I want to review, edit, or remove fork ideas and comments so that I can ensure the platform maintains a constructive and positive environment._

- **US10: Manage Projects**  
  _As an admin, I want to curate the list of projects displayed on the platform to ensure only high-quality and relevant projects are showcased._

---

These user stories form the basis for the features and functionality of the Open Source Brainstorm app, guiding the incremental development and ensuring that the needs of all stakeholders are met.
```

File: /Users/nichnarmada/Documents/projects/opensource-catalog/lib/utils.ts

```ts
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

File: /Users/nichnarmada/Documents/projects/opensource-catalog/types/project.ts

```ts
export interface Project {
  id?: string
  name: string
  description: string
  githubUrl: string
  programmingLanguage: string
  license: string
  stars: number
  forks: number
  lastUpdated: Date
  topics: string[]
}
```

File: /Users/nichnarmada/Documents/projects/opensource-catalog/documentation/roadmap.md

```md
# Open Source Brainstorm App Roadmap

This roadmap outlines the planned phases for development and feature enhancements.

---

## Phase 1: MVP (Minimum Viable Product)

- **Project Setup & Environment**
  - Initialize Next.js project and configure Firebase.
  - Establish basic project folder structure.
- **Core Features**
  - **Project Listing:** Integrate with GitHub API to display a list of open source projects.
  - **Project Detail Page:** Create dynamic routing to show detailed information for each project.
  - **Fork Idea Submission:** Implement a form to allow users to submit fork ideas.
  - **User Authentication:** Set up Firebase Authentication for user sign-up and login.
- **Basic UI/UX**
  - Create simple, responsive layouts for the project list and detail pages.
- **Testing**
  - Implement basic unit tests and perform manual testing of core features.

---

## Phase 2: Enhanced Functionality & UI Improvements

- **Advanced Search & Filter**
  - Add search functionality to filter projects by keywords, language, license, etc.
- **User Interaction Enhancements**
  - Implement real-time updates for fork idea submissions.
  - Enable user commenting on fork ideas.
- **UI/UX Refinements**
  - Integrate a CSS framework (e.g., Tailwind CSS, Material-UI) for a polished look.
  - Improve overall responsiveness and accessibility.
- **Performance Optimization**
  - Introduce caching strategies for API calls.
  - Optimize Firebase queries and indexing.

---

## Phase 3: Community & Collaboration Features

- **User Profiles**
  - Allow users to manage profiles and track their contributions.
- **Notifications**
  - Set up real-time notifications for new fork ideas and comments.
- **Administrative Tools**
  - Develop moderation tools for admins to manage content and ensure community guidelines are met.
- **Analytics & Reporting**
  - Implement basic analytics to monitor user engagement and project popularity.

---

## Phase 4: Future Enhancements

- **Mobile App Version**
  - Explore the development of a companion mobile application.
- **Platform Integrations**
  - Consider integration with other source control platforms (e.g., GitLab).
- **Community Events**
  - Introduce features for hosting community events or hackathons within the platform.

---

This roadmap is a living document and will be updated as new ideas and requirements emerge.
```

File: /Users/nichnarmada/Documents/projects/opensource-catalog/utils/firestore.ts

```ts
import {
  collection,
  getDocs,
  addDoc,
  doc,
  getDoc,
  query,
  where,
  QuerySnapshot,
  DocumentData,
} from "firebase/firestore"
import { db } from "../config/firebase"
import { Project } from "../types/project"

// Collection name for projects
const PROJECTS_COLLECTION = "projects"

// Get all projects
export const getAllProjects = async (): Promise<Project[]> => {
  try {
    const querySnapshot: QuerySnapshot<DocumentData> = await getDocs(
      collection(db, PROJECTS_COLLECTION)
    )
    return querySnapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        } as Project)
    )
  } catch (error) {
    console.error("Error getting projects:", error)
    throw error
  }
}

// Get a single project by ID
export const getProjectById = async (
  projectId: string
): Promise<Project | null> => {
  try {
    const docRef = doc(db, PROJECTS_COLLECTION, projectId)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data(),
      } as Project
    } else {
      return null
    }
  } catch (error) {
    console.error("Error getting project:", error)
    throw error
  }
}

// Add a new project
export const addProject = async (
  projectData: Omit<Project, "id">
): Promise<string> => {
  try {
    const docRef = await addDoc(
      collection(db, PROJECTS_COLLECTION),
      projectData
    )
    return docRef.id
  } catch (error) {
    console.error("Error adding project:", error)
    throw error
  }
}

// Filter projects by programming language
export const getProjectsByLanguage = async (
  language: string
): Promise<Project[]> => {
  try {
    const q = query(
      collection(db, PROJECTS_COLLECTION),
      where("programmingLanguage", "==", language)
    )
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        } as Project)
    )
  } catch (error) {
    console.error("Error filtering projects:", error)
    throw error
  }
}
```

</file_contents>

</CODEBASE>

Use the information above to perform the instructions in the <INSTRUCTIONS> tag.
</TEMPLATE>
