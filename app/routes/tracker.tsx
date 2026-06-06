import {type FormEvent, useEffect, useState} from 'react'
import Navbar from "~/components/Navbar";
import {usePuterStore} from "~/lib/puter";
import {useNavigate} from "react-router";
import {generateUUID} from "~/lib/utils";

export const meta = () => {
    return [
        { title: 'CareerForge AI | Job Tracker' },
        { name: 'description', content: 'Track your job applications and interviews' },
    ];
};

const Tracker = () => {
    const { auth, isLoading, kv } = usePuterStore();
    const navigate = useNavigate();
    const [isProcessing, setIsProcessing] = useState(false);
    const [jobs, setJobs] = useState<TrackerItem[]>([]);
    const [loadingJobs, setLoadingJobs] = useState(true);

    useEffect(() => {
        if(!isLoading && !auth.isAuthenticated) navigate('/auth?next=/tracker');
    }, [isLoading, auth.isAuthenticated, navigate]);

    useEffect(() => {
        const loadJobs = async () => {
            setLoadingJobs(true);
            try {
                const items = await kv.list('tracker:*', true);
                const parsedJobs = items?.map((item: any) => JSON.parse(item.value) as TrackerItem);
                setJobs(parsedJobs || []);
            } catch (e) {
                console.error(e);
            }
            setLoadingJobs(false);
        }
        if (auth.isAuthenticated) loadJobs();
    }, [auth.isAuthenticated, kv]);

    const handleAddJob = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget;
        const formData = new FormData(form);

        const companyName = formData.get('company-name') as string;
        const position = formData.get('position') as string;
        const status = formData.get('status') as TrackerItem['status'];
        const notes = formData.get('notes') as string;

        if (!companyName || !position) return;

        setIsProcessing(true);
        const uuid = generateUUID();
        const newJob: TrackerItem = {
            id: uuid,
            companyName,
            position,
            status,
            notes,
            dateApplied: new Date().toISOString()
        };

        try {
            await kv.set(`tracker:${uuid}`, JSON.stringify(newJob));
            setJobs([...jobs, newJob]);
            form.reset();
        } catch (e) {
            console.error(e);
        }
        setIsProcessing(false);
    }

    const handleDeleteJob = async (id: string) => {
        try {
            await kv.delete(`tracker:${id}`);
            setJobs(jobs.filter(j => j.id !== id));
        } catch (e) {
            console.error(e);
        }
    }

    const handleStatusChange = async (id: string, newStatus: TrackerItem['status']) => {
        const job = jobs.find(j => j.id === id);
        if (!job) return;

        const updatedJob = { ...job, status: newStatus };
        try {
            await kv.set(`tracker:${id}`, JSON.stringify(updatedJob));
            setJobs(jobs.map(j => j.id === id ? updatedJob : j));
        } catch (e) {
            console.error(e);
        }
    }

    return (
        <main className="bg-[url('/images/bg-main.svg')] bg-cover min-h-screen">
            <Navbar />

            <section className="main-section">
                <div className="page-heading py-16">
                    <h1>Job Tracker</h1>
                    <h2>Keep track of your applications, interviews, and offers in one place.</h2>
                </div>

                <div className="flex flex-row gap-8 w-full max-w-[1200px] max-lg:flex-col mx-auto mb-16 px-4">
                    <div className="w-1/3 max-lg:w-full bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-fit sticky top-24">
                        <h3 className="text-xl font-bold text-primary mb-4">Add Application</h3>
                        <form onSubmit={handleAddJob} className="flex flex-col gap-4">
                            <div className="form-div">
                                <label htmlFor="company-name">Company Name</label>
                                <input type="text" name="company-name" placeholder="e.g. Google" required />
                            </div>
                            <div className="form-div">
                                <label htmlFor="position">Position</label>
                                <input type="text" name="position" placeholder="e.g. Frontend Engineer" required />
                            </div>
                            <div className="form-div">
                                <label htmlFor="status">Status</label>
                                <select name="status" className="border border-gray-200 rounded-lg p-2 focus:outline-accent" required>
                                    <option value="Applied">Applied</option>
                                    <option value="Interview Scheduled">Interview Scheduled</option>
                                    <option value="Interview Completed">Interview Completed</option>
                                    <option value="Offer Received">Offer Received</option>
                                    <option value="Rejected">Rejected</option>
                                </select>
                            </div>
                            <div className="form-div">
                                <label htmlFor="notes">Notes</label>
                                <textarea name="notes" rows={3} placeholder="Add any notes here..." />
                            </div>
                            <button className="primary-button" type="submit" disabled={isProcessing}>
                                {isProcessing ? 'Adding...' : 'Add Application'}
                            </button>
                        </form>
                    </div>

                    <div className="w-2/3 max-lg:w-full flex flex-col gap-4">
                        {loadingJobs ? (
                            <div className="flex justify-center p-12">
                                <img src="/images/resume-scan.gif" className="w-32" alt="Loading..." />
                            </div>
                        ) : jobs.length === 0 ? (
                            <div className="bg-white p-12 rounded-2xl shadow-sm border border-gray-100 text-center">
                                <h3 className="text-2xl font-bold text-primary mb-2">No applications yet</h3>
                                <p className="text-dark-200">Add your first job application using the form to start tracking your progress.</p>
                            </div>
                        ) : (
                            jobs.map((job) => (
                                <div key={job.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-4 relative transition-shadow hover:shadow-md">
                                    <button 
                                        onClick={() => handleDeleteJob(job.id)}
                                        className="absolute top-4 right-4 text-red-500 hover:text-red-700 p-2"
                                        title="Delete"
                                    >
                                        ✕
                                    </button>
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="text-2xl font-bold text-primary">{job.position}</h3>
                                            <p className="text-lg font-medium text-dark-200">{job.companyName}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4 items-center">
                                        <select 
                                            value={job.status} 
                                            onChange={(e) => handleStatusChange(job.id, e.target.value as TrackerItem['status'])}
                                            className="bg-gray-50 border border-gray-200 rounded-lg p-2 text-sm font-medium focus:outline-accent"
                                        >
                                            <option value="Applied">Applied</option>
                                            <option value="Interview Scheduled">Interview Scheduled</option>
                                            <option value="Interview Completed">Interview Completed</option>
                                            <option value="Offer Received">Offer Received</option>
                                            <option value="Rejected">Rejected</option>
                                        </select>
                                        <span className="text-sm text-gray-400">
                                            Applied: {new Date(job.dateApplied).toLocaleDateString()}
                                        </span>
                                    </div>
                                    {job.notes && (
                                        <div className="bg-gray-50 p-4 rounded-xl text-dark-200 text-sm">
                                            {job.notes}
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </section>
        </main>
    )
}

export default Tracker
