import { cookies, headers } from "next/headers";
import type { ReviewerIdentity } from "./types";

const REVIEWER_COOKIE = "ai_ceo_reviewer";

const reviewers: ReviewerIdentity[] = [
  { id: "reviewer-1", displayName: "Alex Reviewer", role: "reviewer" },
  { id: "reviewer-2", displayName: "Morgan Governance", role: "governance-admin" },
];

export function listReviewers(): ReviewerIdentity[] {
  return reviewers;
}

export async function getActiveReviewer(): Promise<ReviewerIdentity> {
  const headerStore = await headers();
  const headerId = headerStore.get("x-ai-ceo-reviewer-id");
  if (headerId) {
    const reviewer = reviewers.find((entry) => entry.id === headerId);
    if (reviewer) return reviewer;
  }

  const cookieStore = await cookies();
  const cookieId = cookieStore.get(REVIEWER_COOKIE)?.value;
  const reviewer = reviewers.find((entry) => entry.id === cookieId);
  return reviewer ?? reviewers[0];
}

export function canApprove(kind: "memory" | "expertise", reviewer: ReviewerIdentity): boolean {
  if (reviewer.role === "governance-admin") return true;
  return kind === "memory";
}

export function requiresSecondReview(kind: "memory" | "expertise"): boolean {
  return kind === "expertise";
}
