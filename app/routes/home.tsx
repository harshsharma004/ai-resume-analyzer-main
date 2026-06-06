import type { Route } from "./+types/home";
import Navbar from "~/components/Navbar";
import ResumeCard from "~/components/ResumeCard";
import {usePuterStore} from "~/lib/puter";
import {Link, useNavigate} from "react-router";
import {useCallback, useEffect, useMemo, useState} from "react";
import {normalizeFeedback} from "../../constants";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "CareerForge AI | Career Dashboard" },
    { name: "description", content: "Smart feedback and career tools for your dream job!" },
  ];
}

export default function Home() {
  const { auth, kv } = usePuterStore();
  const navigate = useNavigate();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [metrics, setMetrics] = useState({ tracking: 0, covers: 0, interviews: 0 });
  const [loadingResumes, setLoadingResumes] = useState(true);

  useEffect(() => {
    if(!auth.isAuthenticated) navigate('/auth?next=/');
  }, [auth.isAuthenticated, navigate])

  const loadDashboardData = useCallback(async (isMounted: () => boolean) => {
    setLoadingResumes(true);

    try {
      const [resumeItems, trackerItems, coverItems, interviewItems] = await Promise.all([
        kv.list('resume:*', true),
        kv.list('tracker:*', false),
        kv.list('coverletter:*', false),
        kv.list('interview:*', false)
      ]);

      if (!isMounted()) return;

      const parsedResumes = (resumeItems as KVItem[])?.map((resume) => {
          const parsed = JSON.parse(resume.value) as Resume;
          if (parsed.feedback) {
              parsed.feedback = normalizeFeedback(parsed.feedback);
          }
          return parsed;
      });

      setResumes(parsedResumes || []);
      setMetrics({
        tracking: (trackerItems as string[])?.length || 0,
        covers: (coverItems as string[])?.length || 0,
        interviews: (interviewItems as string[])?.length || 0
      });
    } catch (e) {
      console.error(e);
    } finally {
      if (isMounted()) setLoadingResumes(false);
    }
  }, [kv]);

  const resumeCount = useMemo(() => resumes.length, [resumes.length]);
  const dashboardCounts = useMemo(() => ({
    resumes: resumeCount,
    tracking: metrics.tracking,
    covers: metrics.covers,
    interviews: metrics.interviews
  }), [resumeCount, metrics.tracking, metrics.covers, metrics.interviews]);

  useEffect(() => {
    if (!auth.isAuthenticated) return;

    let isMounted = true;

    loadDashboardData(() => isMounted);

    return () => { isMounted = false; };
  }, [auth.isAuthenticated, loadDashboardData]);

  return <main className="bg-[url('/images/bg-main.svg')] bg-cover">
    <Navbar />

    <section className="main-section">
      <div className="page-heading py-16">
        <h1>Career Dashboard</h1>
        {!loadingResumes && dashboardCounts.resumes === 0 ? (
            <h2>Welcome to CareerForge AI! Use our tools to build a better career.</h2>
        ): (
          <h2>Track your applications, review resume analysis, and use AI career tools.</h2>
        )}
      </div>

      {!loadingResumes && (
        <div className="flex gap-4 max-w-[1200px] w-full justify-center mb-10 max-sm:flex-col px-4">
          <div className="bg-white px-6 py-4 rounded-xl shadow-sm border border-gray-100 flex-1 text-center">
            <span className="text-3xl font-bold text-primary block">{dashboardCounts.resumes}</span>
            <span className="text-sm font-medium text-dark-200">Resumes Analyzed</span>
          </div>
          <div className="bg-white px-6 py-4 rounded-xl shadow-sm border border-gray-100 flex-1 text-center">
            <span className="text-3xl font-bold text-primary block">{dashboardCounts.tracking}</span>
            <span className="text-sm font-medium text-dark-200">Jobs Tracked</span>
          </div>
          <div className="bg-white px-6 py-4 rounded-xl shadow-sm border border-gray-100 flex-1 text-center">
            <span className="text-3xl font-bold text-primary block">{dashboardCounts.covers}</span>
            <span className="text-sm font-medium text-dark-200">Cover Letters</span>
          </div>
          <div className="bg-white px-6 py-4 rounded-xl shadow-sm border border-gray-100 flex-1 text-center">
            <span className="text-3xl font-bold text-primary block">{dashboardCounts.interviews}</span>
            <span className="text-sm font-medium text-dark-200">Interviews Prepped</span>
          </div>
        </div>
      )}

      <div className="flex flex-wrap max-lg:flex-col gap-6 items-start w-full max-w-[1200px] justify-center mb-16">
        <Link to="/upload" className="flex flex-col gap-2 p-6 bg-white rounded-2xl shadow-sm border border-gray-100 w-full lg:w-[350px] hover:shadow-md transition-shadow">
            <h3 className="text-xl font-bold text-primary">Resume Analyzer</h3>
            <p className="text-dark-200">Analyze resumes using AI.</p>
        </Link>
        <Link to="/upload" className="flex flex-col gap-2 p-6 bg-white rounded-2xl shadow-sm border border-gray-100 w-full lg:w-[350px] hover:shadow-md transition-shadow">
            <h3 className="text-xl font-bold text-primary">ATS Score Checker</h3>
            <p className="text-dark-200">Improve ATS compatibility.</p>
        </Link>
        <Link to="/cover-letter" className="flex flex-col gap-2 p-6 bg-white rounded-2xl shadow-sm border border-gray-100 w-full lg:w-[350px] hover:shadow-md transition-shadow">
            <h3 className="text-xl font-bold text-primary">Cover Letter Generator</h3>
            <p className="text-dark-200">Generate personalized cover letters.</p>
        </Link>
        <Link to="/interview" className="flex flex-col gap-2 p-6 bg-white rounded-2xl shadow-sm border border-gray-100 w-full lg:w-[350px] hover:shadow-md transition-shadow">
            <h3 className="text-xl font-bold text-primary">Interview Preparation</h3>
            <p className="text-dark-200">Generate interview questions.</p>
        </Link>
        <Link to="/tracker" className="flex flex-col gap-2 p-6 bg-white rounded-2xl shadow-sm border border-gray-100 w-full lg:w-[350px] hover:shadow-md transition-shadow">
            <h3 className="text-xl font-bold text-primary">Job Tracker</h3>
            <p className="text-dark-200">Track applications and interviews.</p>
        </Link>
        <Link to="/career-coach" className="flex flex-col gap-2 p-6 bg-white rounded-2xl shadow-sm border border-gray-100 w-full lg:w-[350px] hover:shadow-md transition-shadow">
            <h3 className="text-xl font-bold text-primary">AI Career Coach</h3>
            <p className="text-dark-200">Get career guidance and resume advice.</p>
        </Link>
      </div>
      {loadingResumes && (
          <div className="flex flex-col items-center justify-center">
            <img src="/images/resume-scan-2.gif" className="w-[200px]" />
          </div>
      )}

      {!loadingResumes && dashboardCounts.resumes > 0 && (
        <div className="resumes-section">
          {resumes.map((resume) => (
              <ResumeCard key={resume.id} resume={resume} />
          ))}
        </div>
      )}

      {!loadingResumes && dashboardCounts.resumes === 0 && (
          <div className="flex flex-col items-center justify-center mt-10 gap-4">
            <Link to="/upload" className="primary-button w-fit text-xl font-semibold">
              Upload Resume
            </Link>
          </div>
      )}
    </section>
  </main>
}
