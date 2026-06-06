import type { Route } from "./+types/home";
import Navbar from "~/components/Navbar";
import ResumeCard from "~/components/ResumeCard";
import {usePuterStore} from "~/lib/puter";
import {Link, useNavigate} from "react-router";
import {useEffect, useState} from "react";
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
  const [loadingResumes, setLoadingResumes] = useState(false);

  useEffect(() => {
    if(!auth.isAuthenticated) navigate('/auth?next=/');
  }, [auth.isAuthenticated])

  useEffect(() => {
    const loadResumes = async () => {
      setLoadingResumes(true);

      const resumes = (await kv.list('resume:*', true)) as KVItem[];

      const parsedResumes = resumes?.map((resume) => {
          const parsed = JSON.parse(resume.value) as Resume;
          if (parsed.feedback) {
              parsed.feedback = normalizeFeedback(parsed.feedback);
          }
          return parsed;
      })

      setResumes(parsedResumes || []);
      setLoadingResumes(false);
    }

    loadResumes()
  }, []);

  return <main className="bg-[url('/images/bg-main.svg')] bg-cover">
    <Navbar />

    <section className="main-section">
      <div className="page-heading py-16">
        <h1>Career Dashboard</h1>
        {!loadingResumes && resumes?.length === 0 ? (
            <h2>Welcome to CareerForge AI! Use our tools to build a better career.</h2>
        ): (
          <h2>Track your applications, review resume analysis, and use AI career tools.</h2>
        )}
      </div>

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

      {!loadingResumes && resumes.length > 0 && (
        <div className="resumes-section">
          {resumes.map((resume) => (
              <ResumeCard key={resume.id} resume={resume} />
          ))}
        </div>
      )}

      {!loadingResumes && resumes?.length === 0 && (
          <div className="flex flex-col items-center justify-center mt-10 gap-4">
            <Link to="/upload" className="primary-button w-fit text-xl font-semibold">
              Upload Resume
            </Link>
          </div>
      )}
    </section>
  </main>
}
