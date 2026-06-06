import {Link} from "react-router";

const Navbar = () => {
    return (
        <nav className="navbar flex flex-wrap gap-4 justify-between items-center bg-white rounded-full p-4 w-full px-10 max-w-[1400px] mx-auto mb-8 shadow-sm">
            <Link to="/">
                <p className="text-2xl font-bold text-gradient">CareerForge AI</p>
            </Link>
            <div className="flex flex-wrap gap-4 items-center font-medium text-sm text-dark-200">
                <Link to="/" className="hover:text-primary transition-colors">Dashboard</Link>
                <Link to="/upload" className="hover:text-primary transition-colors">Resume Analyzer</Link>
                <Link to="/cover-letter" className="hover:text-primary transition-colors">Cover Letter</Link>
                <Link to="/interview" className="hover:text-primary transition-colors">Interview Prep</Link>
                <Link to="/tracker" className="hover:text-primary transition-colors">Job Tracker</Link>
                <Link to="/career-insights" className="hover:text-primary transition-colors">Insights</Link>
                <Link to="/career-coach" className="hover:text-primary transition-colors">AI Coach</Link>
            </div>
            <Link to="/upload" className="primary-button w-fit text-sm">
                Upload Resume
            </Link>
        </nav>
    )
}
export default Navbar
