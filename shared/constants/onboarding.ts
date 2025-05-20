export interface OnboardingStep {
  step: number;
  title: string;
  body: string;
  action: string;
  skippable: boolean;
}

export const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    step: 1,
    title: "Welcome to KODΞX.WORLD",
    body: "Your journey toward digital sovereignty starts here. Earn XP. Build projects. Reflect with intention.",
    action: "Begin Tour",
    skippable: true
  },
  {
    step: 2,
    title: "Track Your Evolution",
    body: "This is your dashboard. See your current level, earned XP, active Labs, and recent progress. Each task moves you forward.",
    action: "Got It",
    skippable: true
  },
  {
    step: 3,
    title: "Explore the Labs",
    body: "Labs are guided learning journeys—hands-on, skill-building, and reflection-based. Complete tasks to gain XP and badges.",
    action: "Explore Labs",
    skippable: true
  },
  {
    step: 4,
    title: "Build with Projects",
    body: "Projects let you apply what you've learned in real-world builds. Submit your work, earn XP, and add to your portfolio.",
    action: "See Projects",
    skippable: true
  },
  {
    step: 5,
    title: "Join the Conversation",
    body: "The Community Forum is your space to reflect, ask questions, or share progress. Forum posts tied to Labs gain XP.",
    action: "Visit Forum",
    skippable: true
  },
  {
    step: 6,
    title: "Access the Vault",
    body: "Find tools, templates, guides, and curated reading in the KODΞX Resource Vault. Filter by topic or tech stack.",
    action: "View Resources",
    skippable: true
  },
  {
    step: 7,
    title: "You're Ready",
    body: "Every interaction is part of your transformation. Choose your first Lab or Project—or set an intention and begin.",
    action: "Begin Now",
    skippable: false
  }
];