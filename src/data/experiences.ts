import experiencesJson from "../../content/experiences.json";
import { ExperiencesFileSchema, type Experience } from "@/lib/schemas";

export type { Experience } from "@/lib/schemas";

export const experiences: Experience[] = ExperiencesFileSchema.parse(experiencesJson);
