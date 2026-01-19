export interface ResumeAnalysis {
    name: string;
    years_of_experience: number;
    skills: string[];
    projects: string[];
    strengths: string[];
    weaknesses: string[];
}

export interface RoleRequirements {
    required_skills: string[];
    expected_experience: string;
    common_tools: string[];
    role_summary: string;
}

export interface SkillGap {
    skill_name: string;
    current_level: number;
    required_level: number;
    priority: "low" | "medium" | "high";
    reasoning: string;
}

export interface RoadmapStep {
    week_number: number;
    learning_goal: string;
    recommended_resources: string[];
    estimated_hours: number;
}

export interface InterviewQuestion {
    question: string;
    difficulty: "easy" | "medium" | "hard";
    expected_answer_points: string[];
}

export interface CareerCompanionReport {
    resume_analysis: ResumeAnalysis;
    role_requirements: RoleRequirements;
    skill_gaps: SkillGap[];
    roadmap: RoadmapStep[];
    interview_questions: InterviewQuestion[];
}
