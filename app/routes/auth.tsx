import {usePuterStore} from "~/lib/puter";
import {useEffect} from "react";
import {useLocation, useNavigate} from "react-router";

export const meta = () => {
    return [
        { title: 'CareerForge AI | Auth' },
        { name: 'description', content: 'Log into your career dashboard' },
    ];
};

const Auth = () => {
    const { isLoading, auth } = usePuterStore();
    const location = useLocation();
    const next = new URLSearchParams(location.search).get('next') || '/dashboard';
    const navigate = useNavigate();

    useEffect(() => {
        if(auth.isAuthenticated) navigate(next);
    }, [auth.isAuthenticated, navigate, next])

    return (
        <main className="bg-[url('/images/bg-auth.svg')] bg-cover min-h-screen flex items-center justify-center">
            <div className="gradient-border shadow-lg">
                <section className="flex flex-col gap-8 bg-white rounded-2xl p-10">
                    <div className="flex flex-col items-center gap-2 text-center">
                        <h1 className="text-4xl font-bold">CareerForge AI</h1>
                        <h2 className="text-xl">Build ATS-Optimized Resumes and Accelerate Your Career.</h2>
                        <div className="flex flex-col items-start gap-2 mt-4 text-left w-full text-dark-200">
                            <p>✓ Resume Analysis</p>
                            <p>✓ ATS Score Checker</p>
                            <p>✓ Cover Letter Generator</p>
                            <p>✓ Interview Preparation</p>
                            <p>✓ Job Tracker</p>
                        </div>
                    </div>
                    <div>
                        {isLoading ? (
                            <button className="auth-button animate-pulse">
                                <p>Signing you in...</p>
                            </button>
                        ) : (
                            <>
                                {auth.isAuthenticated ? (
                                    <button className="auth-button" onClick={auth.signOut}>
                                        <p>Log Out</p>
                                    </button>
                                ) : (
                                    <button className="auth-button" onClick={auth.signIn}>
                                        <p>Log In</p>
                                    </button>
                                )}
                            </>
                        )}
                    </div>
                </section>
            </div>
        </main>
    )
}

export default Auth
