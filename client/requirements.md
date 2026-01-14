## Packages
framer-motion | Smooth page transitions and UI animations
recharts | Visualizing candidate scores and metrics
date-fns | Formatting dates for jobs and candidates

## Notes
Tailwind Config - extend fontFamily:
fontFamily: {
  display: ["var(--font-display)"],
  body: ["var(--font-body)"],
}
File uploads handled via standard FormData multipart/form-data to /api/jobs/:id/candidates
Auth handled via Replit Auth (useAuth hook)
