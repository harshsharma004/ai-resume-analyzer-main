import {type FormEvent, useEffect, useState} from 'react'
import Navbar from "~/components/Navbar";
import {usePuterStore} from "~/lib/puter";
import {useNavigate} from "react-router";
import {generateUUID} from "~/lib/utils";

export const meta = () => {
    return [
        { title: 'CareerForge AI | Cover Letter Generator' },
        { name: 'description', content: 'Generate tailored cover letters instantly' },
    ];
};

const CoverLetter = () => {
    const { auth, isLoading, kv, ai } = usePuterStore();
    const navigate = useNavigate();
    const [isProcessing, setIsProcessing] = useState(false);
    const [resumes, setResumes] = useState<Resume[]>([]);
    const [coverLetters, setCoverLetters] = useState<CoverLetterItem[]>([]);
    const [loadingData, setLoadingData] = useState(true);
    const [statusText, setStatusText] = useState('');

    useEffect(() => {
        if(!isLoading && !auth.isAuthenticated) navigate('/auth?next=/cover-letter');
    }, [isLoading, auth.isAuthenticated, navigate]);

    useEffect(() => {
        const loadData = async () => {
            setLoadingData(true);
            try {
                // Load resumes
                const resumeItems = await kv.list('resume:*', true);
                const parsedResumes = resumeItems?.map((item: any) => JSON.parse(item.value) as Resume);
                setResumes(parsedResumes || []);

                // Load cover letters
                const clItems = await kv.list('coverletter:*', true);
                const parsedCL = clItems?.map((item: any) => JSON.parse(item.value) as CoverLetterItem);
                
                // Sort by date generated descending
                parsedCL?.sort((a, b) => new Date(b.dateGenerated).getTime() - new Date(a.dateGenerated).getTime());
                setCoverLetters(parsedCL || []);
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
        const jobDescription = formData.get('job-description') as string;

        if (!resumeId || !companyName || !jobTitle) return;

        const selectedResume = resumes.find(r => r.id === resumeId);
        if (!selectedResume) return;

        setIsProcessing(true);
        setStatusText('Generating cover letter...');

        try {
            const prompt = `You are an expert career coach. Write a professional, compelling, and concise cover letter for the position of ${jobTitle} at ${companyName}.
            Here is the job description to tailor the letter to: ${jobDescription || 'N/A'}.
            Use my attached resume to highlight relevant experience and skills. 
            Do not include placeholders like [Your Name] if the resume contains my name. Do not wrap the response in backticks or markdown formatting. Just return the raw text of the cover letter.`;

            const response = await ai.feedback(selectedResume.resumePath, prompt);
            
            if (!response) {
                setStatusText('Error: Failed to generate cover letter');
                setIsProcessing(false);
                return;
            }

            const content = typeof response.message.content === 'string'
                ? response.message.content
                : response.message.content[0].text;

            const uuid = generateUUID();
            const newCL: CoverLetterItem = {
                id: uuid,
                companyName,
                jobTitle,
                content,
                dateGenerated: new Date().toISOString()
            };

            await kv.set(`coverletter:${uuid}`, JSON.stringify(newCL));
            setCoverLetters([newCL, ...coverLetters]);
            form.reset();
            setStatusText('Cover letter generated successfully!');
            setTimeout(() => setStatusText(''), 3000);
        } catch (e) {
            console.error(e);
            setStatusText('An error occurred during generation.');
        }
        setIsProcessing(false);
    }

    const handleDelete = async (id: string) => {
        try {
            await kv.delete(`coverletter:${id}`);
            setCoverLetters(coverLetters.filter(c => c.id !== id));
        } catch (e) {
            console.error(e);
        }
    }

    const handleCopy = (content: string) => {
        navigator.clipboard.writeText(content);
        alert('Copied to clipboard!');
    }

    return (
        <main className="bg-[url('/images/bg-main.svg')] bg-cover min-h-screen">
            <Navbar />

            <section className="main-section">
                <div className="page-heading py-16">
                    <h1>Cover Letter Generator</h1>
                    <h2>Create tailored cover letters in seconds based on your resume and target job.</h2>
                </div>

                <div className="flex flex-row gap-8 w-full max-w-[1200px] max-lg:flex-col mx-auto mb-16 px-4">
                    <div className="w-1/3 max-lg:w-full bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-fit sticky top-24">
                        <h3 className="text-xl font-bold text-primary mb-4">Generate New</h3>
                        {resumes.length === 0 ? (
                            <div className="p-4 bg-gray-50 rounded-lg text-dark-200 text-sm">
                                Please upload and analyze a resume first in the Resume Analyzer before generating a cover letter.
                            </div>
                        ) : (
                            <form onSubmit={handleGenerate} className="flex flex-col gap-4">
                                <div className="form-div">
                                    <label htmlFor="resume-id">Select Resume</label>
                                    <select name="resume-id" className="border border-gray-200 rounded-lg p-2 focus:outline-accent" required>
                                        <option value="">-- Choose a resume --</option>
                                        {resumes.map(r => (
                                            <option key={r.id} value={r.id}>
                                                {r.jobTitle || 'Resume'} {r.companyName ? `at ${r.companyName}` : ''} ({new Date().toLocaleDateString()})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-div">
                                    <label htmlFor="company-name">Company Name</label>
                                    <input type="text" name="company-name" placeholder="e.g. Google" required />
                                </div>
                                <div className="form-div">
                                    <label htmlFor="job-title">Job Title</label>
                                    <input type="text" name="job-title" placeholder="e.g. Frontend Engineer" required />
                                </div>
                                <div className="form-div">
                                    <label htmlFor="job-description">Job Description (Optional)</label>
                                    <textarea name="job-description" rows={4} placeholder="Paste the job description for better personalization..." />
                                </div>
                                <button className="primary-button" type="submit" disabled={isProcessing}>
                                    {isProcessing ? 'Generating...' : 'Generate Cover Letter'}
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
                        ) : coverLetters.length === 0 ? (
                            <div className="bg-white p-12 rounded-2xl shadow-sm border border-gray-100 text-center">
                                <h3 className="text-2xl font-bold text-primary mb-2">No cover letters yet</h3>
                                <p className="text-dark-200">Generate your first personalized cover letter using the form.</p>
                            </div>
                        ) : (
                            coverLetters.map((cl) => (
                                <div key={cl.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-4">
                                    <div className="flex justify-between items-start border-b border-gray-100 pb-4">
                                        <div>
                                            <h3 className="text-2xl font-bold text-primary">{cl.jobTitle}</h3>
                                            <p className="text-lg font-medium text-dark-200">{cl.companyName}</p>
                                            <span className="text-sm text-gray-400 mt-1 block">
                                                Generated: {new Date(cl.dateGenerated).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <div className="flex gap-2">
                                            <button 
                                                onClick={() => handleCopy(cl.content)}
                                                className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors"
                                            >
                                                Copy
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(cl.id)}
                                                className="px-3 py-1 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg text-sm font-medium transition-colors"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                    <div className="text-dark-200 whitespace-pre-wrap leading-relaxed text-sm p-4 bg-gray-50 rounded-xl">
                                        {cl.content}
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

export default CoverLetter
