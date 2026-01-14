import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import multer from "multer";
import pdfParse from "pdf-parse";
import { setupAuth, registerAuthRoutes } from "./replit_integrations/auth";
import { registerChatRoutes } from "./replit_integrations/chat";
import { registerImageRoutes } from "./replit_integrations/image";
import { registerAudioRoutes } from "./replit_integrations/audio";
import { openai } from "./replit_integrations/image/client"; // Use the client from image integration which exports a configured instance

const upload = multer({ storage: multer.memoryStorage() });

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Auth setup
  await setupAuth(app);
  registerAuthRoutes(app);
  
  // Register integration routes (optional but good to have)
  registerChatRoutes(app);
  registerImageRoutes(app);
  registerAudioRoutes(app);

  // Job Routes
  app.get(api.jobs.list.path, async (req, res) => {
    const jobs = await storage.getJobs();
    res.json(jobs);
  });

  app.get(api.jobs.get.path, async (req, res) => {
    const job = await storage.getJob(Number(req.params.id));
    if (!job) return res.status(404).json({ message: "Job not found" });
    res.json(job);
  });

  app.post(api.jobs.create.path, async (req, res) => {
    try {
      const input = api.jobs.create.input.parse(req.body);
      const job = await storage.createJob(input);
      res.status(201).json(job);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Candidate Routes
  app.get(api.candidates.list.path, async (req, res) => {
    const candidates = await storage.getCandidates(Number(req.params.id));
    res.json(candidates);
  });

  // Upload Candidate Resume
  app.post("/api/jobs/:id/candidates", upload.single("resume"), async (req, res) => {
    try {
      if (!req.file) return res.status(400).json({ message: "No resume file uploaded" });
      
      const jobId = Number(req.params.id);
      const name = req.body.name || "Unknown Candidate";
      const email = req.body.email || "unknown@example.com";
      
      // Parse PDF
      let resumeText = "";
      try {
        const data = await pdfParse(req.file.buffer);
        resumeText = data.text;
      } catch (e) {
        console.error("PDF Parse Error", e);
        resumeText = "Could not parse PDF text.";
      }

      const candidate = await storage.createCandidate({
        jobId,
        name,
        email,
        resumeText,
        filePath: "stored_in_memory", // For MVP we don't save file to disk to avoid complexity
      });
      
      res.status(201).json(candidate);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Failed to upload candidate" });
    }
  });

  // Analyze Candidate
  app.post(api.candidates.analyze.path, async (req, res) => {
    try {
      const candidateId = Number(req.params.id);
      const candidate = await storage.getCandidate(candidateId);
      if (!candidate) return res.status(404).json({ message: "Candidate not found" });
      
      const job = await storage.getJob(candidate.jobId);
      if (!job) return res.status(404).json({ message: "Job not found" });

      // AI Analysis
      const prompt = `
        You are an expert HR Recruiter. 
        Job Description: "${job.title} - ${job.description}"
        
        Candidate Resume: "${candidate.resumeText.substring(0, 5000)}"
        
        Analyze the candidate's suitability for this job.
        1. Give a score from 0 to 100.
        2. Extract key skills.
        3. Provide brief feedback (pros/cons).
        
        Return JSON format: { "score": number, "skills": ["skill1", "skill2"], "feedback": "string" }
      `;

      const completion = await openai.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        model: "gpt-4o-mini",
        response_format: { type: "json_object" },
      });

      const result = JSON.parse(completion.choices[0].message.content || "{}");
      
      const updated = await storage.updateCandidateScore(
        candidateId, 
        result.score || 0, 
        result.feedback || "No feedback generated", 
        result.skills || []
      );

      res.json(updated);
    } catch (error) {
      console.error("Analysis failed", error);
      res.status(500).json({ message: "AI Analysis failed" });
    }
  });

  return httpServer;
}
