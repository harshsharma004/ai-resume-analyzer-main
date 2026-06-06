import Navbar from "~/components/Navbar";
import { Link } from "react-router";
import { usePuterStore } from "~/lib/puter";

export const meta = () => {
    return [
        { title: 'CareerForge AI | AI Career Platform' },
        { name: 'description', content: 'Analyze resumes, optimize ATS scores, generate cover letters, prepare for interviews, and manage your job search.' },
    ];
};

const features = [
    {
        title: 'Resume Analyzer',
        description: 'Upload a resume and get clear AI feedback on structure, content, tone, skills, and overall quality.'
    },
    {
        title: 'ATS Optimization',
        description: 'Improve keyword coverage, formatting, and scanner readiness before you apply.'
    },
    {
        title: 'Cover Letter Generator',
        description: 'Create role-specific cover letters from your resume insights and target job details.'
    },
    {
        title: 'Interview Preparation',
        description: 'Generate mock interview questions for technical, behavioral, HR, and mixed interview rounds.'
    },
    {
        title: 'Job Tracker',
        description: 'Track applications, statuses, dates, notes, and next steps in one synced workspace.'
    },
    {
        title: 'Career Insights',
        description: 'See aggregate resume scores, missing skills, skill gaps, and progress across analyses.'
    },
    {
        title: 'AI Career Coach',
        description: 'Chat with an AI coach for resume advice, job search strategy, and career planning.'
    }
];

const Landing = () => {
    const { auth } = usePuterStore();
    const primaryHref = auth.isAuthenticated ? '/dashboard' : '/auth?next=/dashboard';

    return (
        <main className="bg-white min-h-screen">
            <Navbar />

            <section className="px-6 pt-10 pb-20">
                <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-12 items-center">
                    <div className="flex flex-col gap-7">
                        <span className="w-fit rounded-full border border-secondary/30 bg-secondary/10 px-4 py-2 text-sm font-semibold text-primary">
                            AI-powered career command center
                        </span>
                        <div className="flex flex-col gap-5">
                            <h1 className="text-6xl max-md:text-4xl font-semibold leading-tight text-primary">
                                Build stronger applications with CareerForge AI
                            </h1>
                            <p className="text-xl text-dark-200 leading-relaxed max-w-2xl">
                                Analyze resumes, improve ATS performance, generate tailored cover letters, prepare for interviews, and track every opportunity from one modern workspace.
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-4">
                            <Link to={primaryHref} className="primary-button w-fit px-6 py-3 font-semibold">
                                Get Started
                            </Link>
                            <Link to="/auth?next=/dashboard" className="w-fit rounded-full border border-gray-200 px-6 py-3 font-semibold text-primary hover:border-secondary hover:text-secondary transition-colors">
                                Sign In
                            </Link>
                        </div>
                    </div>

                    <div className="relative overflow-hidden rounded-[28px] border border-gray-100 shadow-xl bg-gray-50">
                        <img
                            src="/readme/hero.webp"
                            alt="CareerForge AI dashboard preview"
                            className="w-full h-full min-h-[420px] object-cover object-left"
                        />
                    </div>
                </div>
            </section>

            <section className="bg-gray-50 px-6 py-20">
                <div className="max-w-[1200px] mx-auto flex flex-col gap-10">
                    <div className="max-w-3xl">
                        <h2 className="text-4xl max-md:text-3xl font-semibold text-primary mb-4">Everything your job search needs</h2>
                        <p className="text-lg text-dark-200">
                            CareerForge AI brings resume intelligence, application tracking, interview prep, and coaching into a single workflow.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {features.map((feature) => (
                            <article key={feature.title} className="bg-white border border-gray-100 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                                <h3 className="text-xl font-bold text-primary mb-3">{feature.title}</h3>
                                <p className="text-dark-200 leading-relaxed">{feature.description}</p>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            <footer className="px-6 py-8 border-t border-gray-100">
                <div className="max-w-[1200px] mx-auto flex flex-wrap justify-between gap-4 text-sm text-dark-200">
                    <p className="font-semibold text-primary">CareerForge AI</p>
                    <p>Resume analysis, interview prep, and career tools powered by Puter.js.</p>
                </div>
            </footer>
        </main>
    );
};

export default Landing;
