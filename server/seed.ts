import { db } from "./db";
import { jobs, candidates } from "@shared/schema";

async function seed() {
  const existingJobs = await db.select().from(jobs);
  if (existingJobs.length > 0) {
    console.log("Database already seeded");
    return;
  }

  const [job] = await db.insert(jobs).values({
    title: "Senior Full Stack Engineer",
    description: "We are looking for an experienced Full Stack Engineer with expertise in React, Node.js, and TypeScript. Experience with AI integrations is a plus. Must have 5+ years of experience.",
  }).returning();

  console.log("Seeded Job:", job.title);

  await db.insert(candidates).values([
    {
      jobId: job.id,
      name: "Alice Johnson",
      email: "alice@example.com",
      resumeText: "Experienced Senior Software Engineer with 7 years of experience in React, Node.js, and Python. Led a team of 5 developers. Built AI-powered applications using OpenAI API. Strong expertise in database design and cloud architecture.",
      score: 95,
      feedback: "Excellent candidate. Strong match for all requirements.",
      skills: ["React", "Node.js", "Python", "Team Leadership", "AI/LLM"],
    },
    {
      jobId: job.id,
      name: "Bob Smith",
      email: "bob@example.com",
      resumeText: "Junior Developer with 1 year of experience in HTML and CSS. Learning JavaScript. eager to learn new technologies. Looking for an internship.",
      score: 40,
      feedback: "Junior candidate. Lacks required experience for Senior role.",
      skills: ["HTML", "CSS", "JavaScript (Basic)"],
    },
  ]);

  console.log("Seeded Candidates");
}

seed().catch(console.error);
