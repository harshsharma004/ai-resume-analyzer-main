import {type FormEvent, useEffect, useState} from 'react'
import Navbar from "~/components/Navbar";
import FileUploader from "~/components/FileUploader";
import {usePuterStore} from "~/lib/puter";
import {useNavigate} from "react-router";
import {convertPdfToImage, extractPdfText} from "~/lib/pdf2img";
import {generateUUID} from "~/lib/utils";
import {prepareInstructions, normalizeFeedback} from "../../constants";

export const meta = () => {
    return [
        { title: 'CareerForge AI | Resume Analyzer' },
        { name: 'description', content: 'Analyze your resume against real job requirements' },
    ];
};

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
        return 'An error occurred during analysis.';
    }
};

const parseFeedbackJson = (text: string) => {
    const cleaned = text
        .replace(/^```(?:json)?/i, '')
        .replace(/```$/i, '')
        .trim();

    try {
        return JSON.parse(cleaned);
    } catch {
        const start = cleaned.indexOf('{');
        const end = cleaned.lastIndexOf('}');

        if (start === -1 || end === -1 || end <= start) {
            throw new Error('AI response did not contain valid JSON.');
        }

        return JSON.parse(cleaned.slice(start, end + 1));
    }
};

const Upload = () => {
    const { auth, isLoading, fs, ai, kv } = usePuterStore();
    const navigate = useNavigate();
    const [isProcessing, setIsProcessing] = useState(false);
    const [statusText, setStatusText] = useState('');
    const [file, setFile] = useState<File | null>(null);

    const handleFileSelect = (file: File | null) => {
        setFile(file)
    }

    useEffect(() => {
        if(!isLoading && !auth.isAuthenticated) navigate('/auth?next=/upload');
    }, [isLoading, auth.isAuthenticated, navigate]);

    const handleAnalyze = async ({ companyName, jobTitle, jobDescription, industry, experienceLevel, file }: { companyName: string, jobTitle: string, jobDescription: string, industry: string, experienceLevel: string, file: File  }) => {
        setIsProcessing(true);

        try {
            setStatusText('Preparing resume file...');
            const [uploadedFile, imageFile, extractedText] = await Promise.all([
                fs.upload([file]),
                convertPdfToImage(file),
                extractPdfText(file)
            ]);

            if(!uploadedFile) throw new Error('Failed to upload file');
            if(!imageFile.file) throw new Error(imageFile.error || 'Failed to convert PDF to image');

            setStatusText('Uploading resume preview...');
            const uploadedImage = await fs.upload([imageFile.file]);
            if(!uploadedImage) throw new Error('Failed to upload image');

            let resumeText = extractedText;
            if (resumeText.length < 200) {
                setStatusText('Reading scanned resume...');
                resumeText = await ai.img2txt(imageFile.file) || '';
            }

            if (resumeText.length < 100) {
                throw new Error('Could not read enough text from this resume. Please try a text-based PDF.');
            }

            setStatusText('Preparing data...');
            const uuid = generateUUID();
            const data: Resume = {
                id: uuid,
                resumePath: uploadedFile.path,
                imagePath: uploadedImage.path,
                companyName, jobTitle,
                feedback: normalizeFeedback({}),
            }
            await kv.set(`resume:${uuid}`, JSON.stringify({
                ...data,
                jobDescription,
                industry,
                experienceLevel
            }));

            setStatusText('Analyzing resume...');
            const prompt = `${prepareInstructions({ jobTitle, jobDescription, industry, experienceLevel })}

      Resume text:
      ${resumeText.slice(0, 18000)}`;

            const feedback = await ai.chat(prompt);
            if (!feedback) throw new Error('Failed to analyze resume');

            const feedbackText = getAIResponseText(feedback);
            if (!feedbackText) throw new Error('The AI returned an empty response.');

            const rawJson = parseFeedbackJson(feedbackText);
            data.feedback = normalizeFeedback(rawJson);

            await kv.set(`resume:${uuid}`, JSON.stringify({
                ...data,
                jobDescription,
                industry,
                experienceLevel
            }));
            setStatusText('Analysis complete, redirecting...');
            navigate(`/resume/${uuid}`);
        } catch(e) {
            console.error(e);
            setStatusText(`Error: ${getErrorMessage(e)}`);
            setIsProcessing(false);
        }
    }

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget.closest('form');
        if(!form) return;
        const formData = new FormData(form);

        const companyName = formData.get('company-name') as string;
        const jobTitle = formData.get('job-title') as string;
        const industry = formData.get('industry') as string;
        const experienceLevel = formData.get('experience-level') as string;
        const jobDescription = formData.get('job-description') as string;

        if(!file) return;

        handleAnalyze({ companyName, jobTitle, jobDescription, industry, experienceLevel, file });
    }

    return (
        <main className="bg-[url('/images/bg-main.svg')] bg-cover">
            <Navbar />

            <section className="main-section">
                <div className="page-heading py-16">
                    <h1>Analyze Your Resume Against Real Job Requirements</h1>
                    {isProcessing ? (
                        <>
                            <h2>{statusText}</h2>
                            <img src="/images/resume-scan.gif" className="w-full" />
                        </>
                    ) : (
                        <h2>Drop your resume for an ATS score and improvement tips</h2>
                    )}
                    {!isProcessing && (
                        <form id="upload-form" onSubmit={handleSubmit} className="flex flex-col gap-4 mt-8">
                            <div className="form-div">
                                <label htmlFor="company-name">Company Name</label>
                                <input type="text" name="company-name" placeholder="Company Name" id="company-name" />
                            </div>
                            <div className="form-div">
                                <label htmlFor="job-title">Job Title</label>
                                <input type="text" name="job-title" placeholder="Job Title" id="job-title" />
                            </div>
                            <div className="flex flex-row gap-4 w-full max-sm:flex-col">
                                <div className="form-div w-1/2 max-sm:w-full">
                                    <label htmlFor="industry">Industry</label>
                                    <input type="text" name="industry" placeholder="e.g. Technology, Finance" id="industry" />
                                </div>
                                <div className="form-div w-1/2 max-sm:w-full">
                                    <label htmlFor="experience-level">Experience Level</label>
                                    <input type="text" name="experience-level" placeholder="e.g. Junior, Senior" id="experience-level" />
                                </div>
                            </div>
                            <div className="form-div">
                                <label htmlFor="job-description">Job Description</label>
                                <textarea rows={5} name="job-description" placeholder="Job Description" id="job-description" />
                            </div>

                            <div className="form-div">
                                <label htmlFor="uploader">Upload Resume</label>
                                <FileUploader onFileSelect={handleFileSelect} />
                            </div>

                            <button className="primary-button" type="submit">
                                Generate Career Report
                            </button>
                        </form>
                    )}
                </div>
            </section>
        </main>
    )
}
export default Upload
