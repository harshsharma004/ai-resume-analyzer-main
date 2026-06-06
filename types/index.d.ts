interface Resume {
    id: string;
    companyName?: string;
    jobTitle?: string;
    imagePath: string;
    resumePath: string;
    feedback: Feedback;
}

interface Feedback {
    overallScore: number;
    ATS: {
        score: number;
        tips: {
            type: "good" | "improve";
            tip: string;
        }[];
    };
    toneAndStyle: {
        score: number;
        tips: {
            type: "good" | "improve";
            tip: string;
            explanation: string;
        }[];
    };
    content: {
        score: number;
        tips: {
            type: "good" | "improve";
            tip: string;
            explanation: string;
        }[];
    };
    structure: {
        score: number;
        tips: {
            type: "good" | "improve";
            tip: string;
            explanation: string;
        }[];
    };
    skills: {
        score: number;
        tips: {
            type: "good" | "improve";
            tip: string;
            explanation: string;
        }[];
    };
    jobMatchScore: number;
    missingSkills: string[];
    strengths: string[];
    weaknesses: string[];
    industryReadiness: number;
    careerRecommendations: string[];
    interviewQuestions: string[];
    coverLetterSummary: string;
    recommendedProjects: string[];
    recommendedCertifications: string[];
    careerLevel: string;
}

interface TrackerItem {
    id: string;
    companyName: string;
    position: string;
    dateApplied: string;
    status: 'Applied' | 'Interview Scheduled' | 'Interview Completed' | 'Rejected' | 'Offer Received';
    notes: string;
}

interface CoverLetterItem {
    id: string;
    companyName: string;
    jobTitle: string;
    content: string;
    dateGenerated: string;
}
