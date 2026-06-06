import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import Navbar from "~/components/Navbar";
import { usePuterStore } from "~/lib/puter";
import { normalizeFeedback } from "../../constants";

export const meta = () => {
    return [
        { title: 'CareerForge AI | Profile' },
        { name: 'description', content: 'View your CareerForge AI profile and usage metrics' },
    ];
};

const Profile = () => {
    const { auth, isLoading, kv } = usePuterStore();
    const navigate = useNavigate();
    const [resumes, setResumes] = useState<Resume[]>([]);
    const [applicationsTracked, setApplicationsTracked] = useState(0);
    const [coverLettersGenerated, setCoverLettersGenerated] = useState(0);
    const [loadingProfile, setLoadingProfile] = useState(true);

    useEffect(() => {
        if (!isLoading && !auth.isAuthenticated) navigate('/auth?next=/profile');
    }, [isLoading, auth.isAuthenticated, navigate]);

    useEffect(() => {
        const loadProfile = async () => {
            setLoadingProfile(true);

            try {
                const [resumeItems, trackerItems, coverItems] = await Promise.all([
                    kv.list('resume:*', true),
                    kv.list('tracker:*', false),
                    kv.list('coverletter:*', false)
                ]);

                const parsedResumes = (resumeItems as KVItem[] | undefined)?.map((item) => {
                    const parsed = JSON.parse(item.value) as Resume;
                    if (parsed.feedback) parsed.feedback = normalizeFeedback(parsed.feedback);
                    return parsed;
                });

                setResumes(parsedResumes || []);
                setApplicationsTracked((trackerItems as string[] | undefined)?.length || 0);
                setCoverLettersGenerated((coverItems as string[] | undefined)?.length || 0);
            } catch (error) {
                console.error(error);
            } finally {
                setLoadingProfile(false);
            }
        };

        if (auth.isAuthenticated) loadProfile();
    }, [auth.isAuthenticated, kv]);

    const averageATS = useMemo(() => {
        if (resumes.length === 0) return 0;

        const total = resumes.reduce((acc, resume) => acc + (resume.feedback.ATS?.score || 0), 0);
        return Math.round(total / resumes.length);
    }, [resumes]);

    const stats = [
        { label: 'Total resumes analyzed', value: resumes.length },
        { label: 'Average ATS score', value: `${averageATS}%` },
        { label: 'Applications tracked', value: applicationsTracked },
        { label: 'Cover letters generated', value: coverLettersGenerated }
    ];

    return (
        <main className="bg-[url('/images/bg-main.svg')] bg-cover min-h-screen">
            <Navbar />

            <section className="main-section">
                <div className="page-heading py-16">
                    <h1>Profile</h1>
                    <h2>Your CareerForge AI account and career activity summary.</h2>
                </div>

                <div className="w-full max-w-[1000px] mx-auto px-4 mb-16 flex flex-col gap-6">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                        <h3 className="text-2xl font-bold text-primary mb-6">User Information</h3>
                        {loadingProfile ? (
                            <p className="text-dark-200">Loading profile...</p>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-dark-200">
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <span className="text-sm font-semibold text-gray-500 block mb-1">Username</span>
                                    <span className="text-lg font-bold text-primary">{auth.user?.username || 'Unknown'}</span>
                                </div>
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <span className="text-sm font-semibold text-gray-500 block mb-1">User ID</span>
                                    <span className="text-lg font-bold text-primary break-all">{auth.user?.uuid || 'Unknown'}</span>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                        {stats.map((stat) => (
                            <div key={stat.label} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                                <span className="text-3xl font-extrabold text-secondary block mb-2">{stat.value}</span>
                                <span className="text-sm font-semibold text-dark-200">{stat.label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </main>
    );
};

export default Profile;
