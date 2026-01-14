import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";

export function useCandidates(jobId: number) {
  return useQuery({
    queryKey: [api.candidates.list.path, jobId],
    queryFn: async () => {
      // Note: The actual path has :id parameter but key uses generic path string
      // We manually construct the URL here since the generic path in routes.ts might be abstract
      // Assuming route definition: path: '/api/jobs/:id/candidates'
      const url = buildUrl(api.candidates.list.path, { id: jobId });
      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch candidates");
      return api.candidates.list.responses[200].parse(await res.json());
    },
    enabled: !!jobId,
  });
}

export function useUploadCandidate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ jobId, formData }: { jobId: number; formData: FormData }) => {
      // Upload endpoint usually constructed manually if not in routes manifest or generic
      // Based on implementation notes: POST /api/jobs/:id/candidates
      const res = await fetch(`/api/jobs/${jobId}/candidates`, {
        method: "POST",
        body: formData,
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to upload candidate");
      return res.json(); 
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [api.candidates.list.path, variables.jobId] });
    },
  });
}

export function useAnalyzeCandidate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, jobId }: { id: number; jobId: number }) => {
      const url = buildUrl(api.candidates.analyze.path, { id });
      const res = await fetch(url, {
        method: "POST",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Analysis failed");
      return api.candidates.analyze.responses[200].parse(await res.json());
    },
    onSuccess: (_, variables) => {
      // Invalidate the list so the new score shows up
      queryClient.invalidateQueries({ queryKey: [api.candidates.list.path, variables.jobId] });
    },
  });
}
