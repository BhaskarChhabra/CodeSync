// hooks/useCurrentQuestionId.ts
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export function useCurrentQuestionId(interviewId?: string) {
  const enabled = Boolean(interviewId);
  return useQuery(
    api.interviews.getCurrentQuestionId,
    enabled ? { id: interviewId } : undefined
  );
}

