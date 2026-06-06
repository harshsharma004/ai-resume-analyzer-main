import {useEffect, useState} from 'react'
import Navbar from "~/components/Navbar";
import {usePuterStore} from "~/lib/puter";
import {useNavigate} from "react-router";
import {normalizeFeedback} from "../../constants";
import ScoreGauge from '~/components/ScoreGauge';

export const meta = () => {
    return [
        { title: 'CareerForge AI | Career Insights' },
        { name: 'description', content: 'View aggregate statistics from all your resume analyses' },
    ];
};

const CareerInsights = () => {
    const { auth, isLoading, kv } = usePuterStore();
    const navigate = useNavigate();
    const [loadingData, setLoadingData] = useState(true);
    const [resumes, setResumes] = useState<Resume[]>([]);

    useEffect(() => {
        if(!isLoading && !auth.isAuthenticated) navigate('/auth?next=/career-insights');
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
            } catch (e) {
                console.error(e);
            }
            setLoadingData(false);
        }
        if (auth.isAuthenticated) loadData();
    }, [auth.isAuthenticated, kv]);

    const calculateAverages = () => {
        if (resumes.length === 0) return null;

        const totalATS = resumes.reduce((acc, curr) => acc + (curr.feedback.ATS?.score || 0), 0);
        const totalOverall = resumes.reduce((acc, curr) => acc + (curr.feedback.overallScore || 0), 0);
        const totalJobMatch = resumes.reduce((acc, curr) => acc + (curr.feedback.jobMatchScore || 0), 0);
        const totalIndustryReadiness = resumes.reduce((acc, curr) => acc + (curr.feedback.industryReadiness || 0), 0);

        // Aggregate missing skills
        const allMissingSkills = resumes.flatMap(r => r.feedback.missingSkills || []);
        const skillFrequency: { [key: string]: number } = {};
        allMissingSkills.forEach(skill => {
            if (!skill) return;
            skillFrequency[skill] = (skillFrequency[skill] || 0) + 1;
        });
        const topMissingSkills = Object.entries(skillFrequency)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10);

        return {
            avgATS: Math.round(totalATS / resumes.length),
            avgOverall: Math.round(totalOverall / resumes.length),
            avgJobMatch: Math.round(totalJobMatch / resumes.length),
            avgIndustryReadiness: Math.round(totalIndustryReadiness / resumes.length),
            topMissingSkills
        };
    };

    const stats = calculateAverages();

    return (
        <main className="bg-[url('/images/bg-main.svg')] bg-cover min-h-screen">
            <Navbar />

            <section className="main-section">
                <div className="page-heading py-16">
                    <h1>Career Insights</h1>
                    <h2>Aggregate statistics across all your analyzed resumes to identify trends.</h2>
                </div>

                <div className="flex flex-col gap-8 w-full max-w-[1200px] mx-auto mb-16 px-4">
                    {loadingData ? (
                        <div className="flex justify-center p-12">
                            <img src="/images/resume-scan.gif" className="w-32" alt="Loading..." />
                        </div>
                    ) : resumes.length === 0 ? (
                        <div className="bg-white p-12 rounded-2xl shadow-sm border border-gray-100 text-center">
                            <h3 className="text-2xl font-bold text-primary mb-2">No data available</h3>
                            <p className="text-dark-200">Upload and analyze some resumes to unlock career insights.</p>
                        </div>
                    ) : stats ? (
                        <div className="flex flex-col gap-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center gap-4 hover:shadow-md transition-shadow">
                                    <h3 className="text-xl font-bold text-primary text-center">Avg Overall Score</h3>
                                    <div className="w-32 h-32">
                                        <ScoreGauge score={stats.avgOverall} />
                                    </div>
                                </div>
                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center gap-4 hover:shadow-md transition-shadow">
                                    <h3 className="text-xl font-bold text-primary text-center">Avg ATS Score</h3>
                                    <div className="w-32 h-32">
                                        <ScoreGauge score={stats.avgATS} />
                                    </div>
                                </div>
                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center gap-4 hover:shadow-md transition-shadow">
                                    <h3 className="text-xl font-bold text-primary text-center">Avg Job Match</h3>
                                    <div className="text-5xl font-extrabold text-secondary mt-2">{stats.avgJobMatch}%</div>
                                </div>
                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center gap-4 hover:shadow-md transition-shadow">
                                    <h3 className="text-xl font-bold text-primary text-center">Industry Readiness</h3>
                                    <div className="text-5xl font-extrabold text-accent mt-2">{stats.avgIndustryReadiness}%</div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                    <h3 className="text-xl font-bold text-primary mb-4 border-b border-gray-100 pb-2">Most Frequently Missing Skills</h3>
                                    {stats.topMissingSkills.length > 0 ? (
                                        <ul className="flex flex-col gap-3">
                                            {stats.topMissingSkills.map(([skill, count]) => (
                                                <li key={skill} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                                                    <span className="font-medium text-dark-200">{skill}</span>
                                                    <span className="bg-badge-red text-badge-red-text px-3 py-1 rounded-full text-xs font-bold">
                                                        Missed {count} times
                                                    </span>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className="text-dark-200">No recurring missing skills found.</p>
                                    )}
                                </div>
                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                    <h3 className="text-xl font-bold text-primary mb-4 border-b border-gray-100 pb-2">Resume History</h3>
                                    <p className="text-dark-200 mb-4">You have analyzed <strong>{resumes.length}</strong> resumes.</p>
                                    <div className="flex flex-col gap-3 max-h-[300px] overflow-y-auto pr-2">
                                        {resumes.map(r => (
                                            <div key={r.id} className="p-3 border border-gray-100 rounded-lg flex justify-between">
                                                <div>
                                                    <span className="font-medium block text-primary">{r.jobTitle || 'Resume'}</span>
                                                    <span className="text-xs text-gray-500">{r.companyName || 'Unknown Company'}</span>
                                                </div>
                                                <span className="text-secondary font-bold">{r.feedback.overallScore || 0}%</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : null}
                </div>
            </section>
        </main>
    )
}

export default CareerInsights
