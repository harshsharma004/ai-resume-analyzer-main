import {type FormEvent, useEffect, useState} from 'react'
import Navbar from "~/components/Navbar";
import {usePuterStore} from "~/lib/puter";
import {useNavigate} from "react-router";
import {generateUUID} from "~/lib/utils";
import {normalizeFeedback} from "../../constants";

export const meta = () => {
    return [
        { title: 'CareerForge AI | Interview Prep' },
        { name: 'description', content: 'Generate personalized interview questions and tips' },
    ];
};

interface InterviewQA {
    id: string;
    companyName: string;
    jobTitle: string;
    content: string;
    dateGenerated: string;
}

const getAIResponseText = (response: AIResponse): string => {
    const content = response?.message?.content;

    if (typeof content === 'string') return content;
    if (!Array.isArray(content)) return '';

    const textPart = content.find((part) => typeof part?.text === 'string');
    return textPart?.text || '';
};

const getErrorMessage = (error: unknown) => {
    if (error instanceof Error) return error.message;
    if (typeof error === 'string') return error;

    try {
        return JSON.stringify(error);
    } catch {
        return 'An error occurred during generation.';
    }
};

const buildResumeContext = (resume: Resume) => {
    const feedback = normalizeFeedback(resume.feedback);

    return [
        `Resume target role: ${resume.jobTitle || 'Unknown'}`,
        `Target company: ${resume.companyName || 'Unknown'}`,
        `Overall score: ${feedback.overallScore}`,
        `ATS score: ${feedback.ATS.score}`,
        `Job match score: ${feedback.jobMatchScore}`,
        `Career level: ${feedback.careerLevel}`,
        `Strengths: ${feedback.strengths.join(', ') || 'Not available'}`,
        `Weaknesses: ${feedback.weaknesses.join(', ') || 'Not available'}`,
        `Missing skills: ${feedback.missingSkills.join(', ') || 'Not available'}`,
        `Recommended projects: ${feedback.recommendedProjects.join(', ') || 'Not available'}`,
        `Recommended certifications: ${feedback.recommendedCertifications.join(', ') || 'Not available'}`
    ].join('\n');
};

const InterviewPrep = () => {
    const { auth, isLoading, kv, ai } = usePuterStore();
    const navigate = useNavigate();
    const [isProcessing, setIsProcessing] = useState(false);
    const [resumes, setResumes] = useState<Resume[]>([]);
    const [interviews, setInterviews] = useState<InterviewQA[]>([]);
    const [loadingData, setLoadingData] = useState(true);
    const [statusText, setStatusText] = useState('');

    useEffect(() => {
        if(!isLoading && !auth.isAuthenticated) navigate('/auth?next=/interview');
    }, [isLoading, auth.isAuthenticated, navigate]);

    useEffect(() => {
        const loadData = async () => {
            setLoadingData(true);
            try {
                const resumeItems = await kv.list('resume:*', true);
                const parsedResumes = resumeItems?.map((item: any) => {
                    const parsed = JSON.parse(item.value) as Resume;
                    if (parsed.feedback) parsed.feedback = normalizeFeedback(parsed.feedback);
                    return parsed;
                });
                setResumes(parsedResumes || []);

                const qaItems = await kv.list('interview:*', true);
                const parsedQA = qaItems?.map((item: any) => JSON.parse(item.value) as InterviewQA);
                
                parsedQA?.sort((a, b) => new Date(b.dateGenerated).getTime() - new Date(a.dateGenerated).getTime());
                setInterviews(parsedQA || []);
            } catch (e) {
                console.error(e);
            }
            setLoadingData(false);
        }
        if (auth.isAuthenticated) loadData();
    }, [auth.isAuthenticated, kv]);

    const handleGenerate = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget;
        const formData = new FormData(form);

        const resumeId = formData.get('resume-id') as string;
        const companyName = formData.get('company-name') as string;
        const jobTitle = formData.get('job-title') as string;
        const questionType = formData.get('question-type') as string;

        if (!resumeId || !companyName || !jobTitle) return;

        const selectedResume = resumes.find(r => r.id === resumeId);
        if (!selectedResume) return;

        setIsProcessing(true);
        setStatusText('Generating interview questions...');

        try {
            const prompt = `You are an expert technical interviewer and HR manager at ${companyName}. I am applying for the ${jobTitle} role.
            Generate a realistic mock interview focusing heavily on ${questionType} questions.
            Use this stored resume analysis context to personalize the questions:

            ${buildResumeContext(selectedResume)}

            Format the output nicely. Include 8 to 10 questions and provide brief tips on what the interviewer is looking for in the answer.`;

            const response = await ai.chat(prompt);
            
            if (!response) {
                setStatusText('Error: Failed to generate interview questions');
                setIsProcessing(false);
                return;
            }

            const content = getAIResponseText(response);

            if (!content) {
                setStatusText('Error: The AI returned an empty response. Please try again.');
                setIsProcessing(false);
                return;
            }

            const uuid = generateUUID();
            const newInterview: InterviewQA = {
                id: uuid,
                companyName,
                jobTitle,
                content,
                dateGenerated: new Date().toISOString()
            };

            await kv.set(`interview:${uuid}`, JSON.stringify(newInterview));
            setInterviews([newInterview, ...interviews]);
            form.reset();
            setStatusText('Questions generated successfully!');
            setTimeout(() => setStatusText(''), 3000);
        } catch (e) {
            console.error(e);
            setStatusText(`Error: ${getErrorMessage(e)}`);
        }
        setIsProcessing(false);
    }

    const handleDelete = async (id: string) => {
        try {
            await kv.delete(`interview:${id}`);
            setInterviews(interviews.filter(c => c.id !== id));
        } catch (e) {
            console.error(e);
        }
    }

    return (
        <main className="bg-[url('/images/bg-main.svg')] bg-cover min-h-screen">
            <Navbar />

            <section className="main-section">
                <div className="page-heading py-16">
                    <h1>Interview Preparation</h1>
                    <h2>Generate personalized technical, behavioral, and HR questions based on your resume.</h2>
                </div>

                <div className="flex flex-row gap-8 w-full max-w-[1200px] max-lg:flex-col mx-auto mb-16 px-4">
                    <div className="w-1/3 max-lg:w-full bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-fit sticky top-24">
                        <h3 className="text-xl font-bold text-primary mb-4">Generate Mock Interview</h3>
                        {resumes.length === 0 ? (
                            <div className="p-4 bg-gray-50 rounded-lg text-dark-200 text-sm">
                                Please upload and analyze a resume first to generate questions.
                            </div>
                        ) : (
                            <form onSubmit={handleGenerate} className="flex flex-col gap-4">
                                <div className="form-div">
                                    <label htmlFor="resume-id">Select Resume</label>
                                    <select name="resume-id" className="border border-gray-200 rounded-lg p-2 focus:outline-accent" required>
                                        <option value="">-- Choose a resume --</option>
                                        {resumes.map(r => (
                                            <option key={r.id} value={r.id}>
                                                {r.jobTitle || 'Resume'} {r.companyName ? `at ${r.companyName}` : ''}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-div">
                                    <label htmlFor="company-name">Company Name</label>
                                    <input type="text" name="company-name" placeholder="e.g. Meta" required />
                                </div>
                                <div className="form-div">
                                    <label htmlFor="job-title">Job Title</label>
                                    <input type="text" name="job-title" placeholder="e.g. Backend Developer" required />
                                </div>
                                <div className="form-div">
                                    <label htmlFor="question-type">Focus Area</label>
                                    <select name="question-type" className="border border-gray-200 rounded-lg p-2 focus:outline-accent" required>
                                        <option value="Technical and System Design">Technical / System Design</option>
                                        <option value="Behavioral (STAR Method)">Behavioral (STAR Method)</option>
                                        <option value="HR and Cultural Fit">HR / Cultural Fit</option>
                                        <option value="Mixed">Mixed</option>
                                    </select>
                                </div>
                                <button className="primary-button" type="submit" disabled={isProcessing}>
                                    {isProcessing ? 'Generating...' : 'Generate Questions'}
                                </button>
                                {statusText && <p className="text-center text-sm font-medium mt-2">{statusText}</p>}
                            </form>
                        )}
                    </div>

                    <div className="w-2/3 max-lg:w-full flex flex-col gap-6">
                        {loadingData ? (
                            <div className="flex justify-center p-12">
                                <img src="/images/resume-scan.gif" className="w-32" alt="Loading..." />
                            </div>
                        ) : interviews.length === 0 ? (
                            <div className="bg-white p-12 rounded-2xl shadow-sm border border-gray-100 text-center">
                                <h3 className="text-2xl font-bold text-primary mb-2">No interviews generated</h3>
                                <p className="text-dark-200">Start practicing by generating your first set of questions.</p>
                            </div>
                        ) : (
                            interviews.map((qa) => (
                                <div key={qa.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-4">
                                    <div className="flex justify-between items-start border-b border-gray-100 pb-4">
                                        <div>
                                            <h3 className="text-2xl font-bold text-primary">{qa.jobTitle} Questions</h3>
                                            <p className="text-lg font-medium text-dark-200">{qa.companyName}</p>
                                        </div>
                                        <button 
                                            onClick={() => handleDelete(qa.id)}
                                            className="px-3 py-1 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg text-sm font-medium transition-colors"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                    <div className="text-dark-200 whitespace-pre-wrap leading-relaxed text-sm p-4 bg-gray-50 rounded-xl max-h-[500px] overflow-y-auto">
                                        {qa.content}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </section>
        </main>
    )
}

export default InterviewPrep
