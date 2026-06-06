export const resumes: Resume[] = [
    {
        id: "1",
        companyName: "Google",
        jobTitle: "Frontend Developer",
        imagePath: "/images/resume_01.png",
        resumePath: "/resumes/resume-1.pdf",
        feedback: {
            overallScore: 85,
            ATS: {
                score: 90,
                tips: [],
            },
            toneAndStyle: {
                score: 90,
                tips: [],
            },
            content: {
                score: 90,
                tips: [],
            },
            structure: {
                score: 90,
                tips: [],
            },
            skills: {
                score: 90,
                tips: [],
            },
        } as unknown as Feedback,
    },
    {
        id: "2",
        companyName: "Microsoft",
        jobTitle: "Cloud Engineer",
        imagePath: "/images/resume_02.png",
        resumePath: "/resumes/resume-2.pdf",
        feedback: {
            overallScore: 55,
            ATS: {
                score: 90,
                tips: [],
            },
            toneAndStyle: {
                score: 90,
                tips: [],
            },
            content: {
                score: 90,
                tips: [],
            },
            structure: {
                score: 90,
                tips: [],
            },
            skills: {
                score: 90,
                tips: [],
            },
        } as unknown as Feedback,
    },
    {
        id: "3",
        companyName: "Apple",
        jobTitle: "iOS Developer",
        imagePath: "/images/resume_03.png",
        resumePath: "/resumes/resume-3.pdf",
        feedback: {
            overallScore: 75,
            ATS: {
                score: 90,
                tips: [],
            },
            toneAndStyle: {
                score: 90,
                tips: [],
            },
            content: {
                score: 90,
                tips: [],
            },
            structure: {
                score: 90,
                tips: [],
            },
            skills: {
                score: 90,
                tips: [],
            },
        } as unknown as Feedback,
    },
    {
        id: "4",
        companyName: "Google",
        jobTitle: "Frontend Developer",
        imagePath: "/images/resume_01.png",
        resumePath: "/resumes/resume-1.pdf",
        feedback: {
            overallScore: 85,
            ATS: {
                score: 90,
                tips: [],
            },
            toneAndStyle: {
                score: 90,
                tips: [],
            },
            content: {
                score: 90,
                tips: [],
            },
            structure: {
                score: 90,
                tips: [],
            },
            skills: {
                score: 90,
                tips: [],
            },
        } as unknown as Feedback,
    },
    {
        id: "5",
        companyName: "Microsoft",
        jobTitle: "Cloud Engineer",
        imagePath: "/images/resume_02.png",
        resumePath: "/resumes/resume-2.pdf",
        feedback: {
            overallScore: 55,
            ATS: {
                score: 90,
                tips: [],
            },
            toneAndStyle: {
                score: 90,
                tips: [],
            },
            content: {
                score: 90,
                tips: [],
            },
            structure: {
                score: 90,
                tips: [],
            },
            skills: {
                score: 90,
                tips: [],
            },
        } as unknown as Feedback,
    },
    {
        id: "6",
        companyName: "Apple",
        jobTitle: "iOS Developer",
        imagePath: "/images/resume_03.png",
        resumePath: "/resumes/resume-3.pdf",
        feedback: {
            overallScore: 75,
            ATS: {
                score: 90,
                tips: [],
            },
            toneAndStyle: {
                score: 90,
                tips: [],
            },
            content: {
                score: 90,
                tips: [],
            },
            structure: {
                score: 90,
                tips: [],
            },
            skills: {
                score: 90,
                tips: [],
            },
        } as unknown as Feedback,
    },
];

export const AIResponseFormat = `
      interface Feedback {
      overallScore: number; //max 100
      ATS: {
        score: number; //rate based on ATS suitability
        tips: {
          type: "good" | "improve";
          tip: string; //give 3-4 tips
        }[];
      };
      toneAndStyle: {
        score: number; //max 100
        tips: {
          type: "good" | "improve";
          tip: string; //make it a short "title" for the actual explanation
          explanation: string; //explain in detail here
        }[]; //give 3-4 tips
      };
      content: {
        score: number; //max 100
        tips: {
          type: "good" | "improve";
          tip: string; //make it a short "title" for the actual explanation
          explanation: string; //explain in detail here
        }[]; //give 3-4 tips
      };
      structure: {
        score: number; //max 100
        tips: {
          type: "good" | "improve";
          tip: string; //make it a short "title" for the actual explanation
          explanation: string; //explain in detail here
        }[]; //give 3-4 tips
      };
      skills: {
        score: number; //max 100
        tips: {
          type: "good" | "improve";
          tip: string; //make it a short "title" for the actual explanation
          explanation: string; //explain in detail here
        }[]; //give 3-4 tips
      };
      jobMatchScore: number; // 0-100 based on job description match
      missingSkills: string[]; // List of critical skills missing
      strengths: string[]; // List of candidate strengths
      weaknesses: string[]; // List of candidate weaknesses
      industryReadiness: number; // 0-100 score for industry readiness
      careerRecommendations: string[]; // Actionable career recommendations
      interviewQuestions: string[]; // Potential interview questions
      coverLetterSummary: string; // A short intro paragraph for a cover letter
      recommendedProjects: string[]; // Recommended projects to build
      recommendedCertifications: string[]; // Recommended certifications to get
      careerLevel: string; // e.g., Junior, Mid-Level, Senior
    }`;

export const prepareInstructions = ({jobTitle, jobDescription, industry, experienceLevel}: { jobTitle: string; jobDescription: string; industry?: string; experienceLevel?: string; }) =>
    `You are an expert in ATS (Applicant Tracking System) and resume analysis for the ${industry || 'Tech'} industry.
      Please analyze and rate this resume and suggest how to improve it.
      The candidate's experience level is: ${experienceLevel || 'Unknown'}.
      The rating can be low if the resume is bad.
      Be thorough and detailed. Don't be afraid to point out any mistakes or areas for improvement.
      If there is a lot to improve, don't hesitate to give low scores. This is to help the user to improve their resume.
      Calculate a jobMatchScore based on how well the resume matches the job description.
      Identify missing skills, strengths, and weaknesses.
      Estimate industry readiness.
      Provide career recommendations, interview questions, recommended projects, certifications, and a cover letter summary.
      Determine the candidate's career level based on the resume.
      The job title is: ${jobTitle}
      The job description is: ${jobDescription}
      Provide the feedback using the following format:
      ${AIResponseFormat}
      Return the analysis as an JSON object, without any other text and without the backticks.
      Do not include any other text or comments.`;

export const normalizeFeedback = (feedback: any): Feedback => {
    return {
        overallScore: feedback?.overallScore || 0,
        ATS: feedback?.ATS || { score: 0, tips: [] },
        toneAndStyle: feedback?.toneAndStyle || { score: 0, tips: [] },
        content: feedback?.content || { score: 0, tips: [] },
        structure: feedback?.structure || { score: 0, tips: [] },
        skills: feedback?.skills || { score: 0, tips: [] },
        jobMatchScore: feedback?.jobMatchScore || 0,
        missingSkills: feedback?.missingSkills || [],
        strengths: feedback?.strengths || [],
        weaknesses: feedback?.weaknesses || [],
        industryReadiness: feedback?.industryReadiness || 0,
        careerRecommendations: feedback?.careerRecommendations || [],
        interviewQuestions: feedback?.interviewQuestions || [],
        coverLetterSummary: feedback?.coverLetterSummary || "",
        recommendedProjects: feedback?.recommendedProjects || [],
        recommendedCertifications: feedback?.recommendedCertifications || [],
        careerLevel: feedback?.careerLevel || "Unknown",
    };
};
