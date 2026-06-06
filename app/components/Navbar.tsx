import {useState} from "react";
import {Link, useNavigate} from "react-router";
import {usePuterStore} from "~/lib/puter";

const Navbar = () => {
    const { auth } = usePuterStore();
    const navigate = useNavigate();
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    const handleSignOut = async () => {
        await auth.signOut();
        setIsProfileOpen(false);
        navigate('/');
    };

    return (
        <nav className="navbar flex flex-wrap gap-4 justify-between items-center bg-white rounded-full p-4 w-full px-10 max-w-[1400px] mx-auto mb-8 shadow-sm">
            <Link to="/">
                <p className="text-2xl font-bold text-gradient">CareerForge AI</p>
            </Link>
            <div className="flex flex-wrap gap-4 items-center font-medium text-sm text-dark-200">
                <Link to="/dashboard" className="hover:text-primary transition-colors">Dashboard</Link>
                <Link to="/upload" className="hover:text-primary transition-colors">Resume Analyzer</Link>
                <Link to="/cover-letter" className="hover:text-primary transition-colors">Cover Letter</Link>
                <Link to="/interview" className="hover:text-primary transition-colors">Interview Prep</Link>
                <Link to="/tracker" className="hover:text-primary transition-colors">Job Tracker</Link>
                <Link to="/career-insights" className="hover:text-primary transition-colors">Insights</Link>
                <Link to="/career-coach" className="hover:text-primary transition-colors">AI Coach</Link>
            </div>
            <div className="relative">
                {auth.isAuthenticated ? (
                    <>
                        <button
                            type="button"
                            onClick={() => setIsProfileOpen((current) => !current)}
                            className="primary-button w-fit text-sm px-4"
                        >
                            {auth.user?.username || 'Account'}
                        </button>
                        {isProfileOpen && (
                            <div className="absolute right-0 top-12 z-20 w-48 rounded-lg border border-gray-100 bg-white shadow-lg p-2">
                                <Link
                                    to="/profile"
                                    onClick={() => setIsProfileOpen(false)}
                                    className="block rounded-md px-4 py-2 text-sm font-medium text-dark-200 hover:bg-gray-50 hover:text-primary"
                                >
                                    Profile
                                </Link>
                                <Link
                                    to="/dashboard"
                                    onClick={() => setIsProfileOpen(false)}
                                    className="block rounded-md px-4 py-2 text-sm font-medium text-dark-200 hover:bg-gray-50 hover:text-primary"
                                >
                                    Dashboard
                                </Link>
                                <button
                                    type="button"
                                    onClick={handleSignOut}
                                    className="w-full text-left rounded-md px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
                                >
                                    Sign Out
                                </button>
                            </div>
                        )}
                    </>
                ) : (
                    <Link to="/auth?next=/dashboard" className="primary-button w-fit text-sm">
                        Sign In
                    </Link>
                )}
            </div>
        </nav>
    )
}
export default Navbar
