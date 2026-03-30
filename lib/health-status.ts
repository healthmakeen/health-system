import type {
  AbdomenStatus,
  BreathingStatus,
  LegSwellingStatus,
  OverallStatus,
} from "@/types/app";

type StatusInput = {
  abdomenStatus: AbdomenStatus;
  breathingStatus: BreathingStatus;
  legSwelling: LegSwellingStatus;
  pulse: number;
  systolic: number;
};

export function calculateOverallStatus({
  abdomenStatus,
  breathingStatus,
  legSwelling,
  pulse,
  systolic,
}: StatusInput): OverallStatus {
  const needsAttention =
    breathingStatus === "difficult" ||
    abdomenStatus === "tight" ||
    legSwelling === "yes" ||
    pulse < 50 ||
    pulse > 100 ||
    systolic < 90;

  return needsAttention ? "needs_attention" : "stable";
}
