import React from 'react';

const ExtendedFeedback = ({ feedback }: { feedback: any }) => {
    return (
        <div className="flex flex-col gap-6 w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="text-xl font-bold text-primary mb-2">Job Match Score</h3>
                    <div className="text-4xl font-extrabold text-secondary">{feedback.jobMatchScore || 0}%</div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="text-xl font-bold text-primary mb-2">Industry Readiness</h3>
                    <div className="text-4xl font-extrabold text-accent">{feedback.industryReadiness || 0}%</div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="text-xl font-bold text-primary mb-2">Career Level</h3>
                    <div className="text-xl font-medium text-dark-200">{feedback.careerLevel || 'Unknown'}</div>
                </div>
            </div>

            {feedback.missingSkills?.length > 0 && (
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="text-xl font-bold text-primary mb-4">Missing Skills</h3>
                    <div className="flex flex-wrap gap-2">
                        {feedback.missingSkills.map((skill: string, index: number) => (
                            <span key={index} className="px-3 py-1 bg-badge-red text-badge-red-text rounded-full text-sm font-medium">
                                {skill}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {feedback.strengths?.length > 0 && (
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="text-xl font-bold text-primary mb-4">Strengths</h3>
                    <ul className="list-disc pl-5 flex flex-col gap-2">
                        {feedback.strengths.map((item: string, index: number) => (
                            <li key={index} className="text-dark-200">{item}</li>
                        ))}
                    </ul>
                </div>
            )}

            {feedback.weaknesses?.length > 0 && (
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="text-xl font-bold text-primary mb-4">Weaknesses</h3>
                    <ul className="list-disc pl-5 flex flex-col gap-2">
                        {feedback.weaknesses.map((item: string, index: number) => (
                            <li key={index} className="text-dark-200">{item}</li>
                        ))}
                    </ul>
                </div>
            )}

            {feedback.careerRecommendations?.length > 0 && (
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="text-xl font-bold text-primary mb-4">Career Recommendations</h3>
                    <ul className="list-disc pl-5 flex flex-col gap-2">
                        {feedback.careerRecommendations.map((item: string, index: number) => (
                            <li key={index} className="text-dark-200">{item}</li>
                        ))}
                    </ul>
                </div>
            )}

            {feedback.recommendedProjects?.length > 0 && (
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="text-xl font-bold text-primary mb-4">Recommended Projects</h3>
                    <ul className="list-disc pl-5 flex flex-col gap-2">
                        {feedback.recommendedProjects.map((item: string, index: number) => (
                            <li key={index} className="text-dark-200">{item}</li>
                        ))}
                    </ul>
                </div>
            )}

            {feedback.recommendedCertifications?.length > 0 && (
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="text-xl font-bold text-primary mb-4">Recommended Certifications</h3>
                    <ul className="list-disc pl-5 flex flex-col gap-2">
                        {feedback.recommendedCertifications.map((item: string, index: number) => (
                            <li key={index} className="text-dark-200">{item}</li>
                        ))}
                    </ul>
                </div>
            )}

            {feedback.interviewQuestions?.length > 0 && (
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="text-xl font-bold text-primary mb-4">Interview Questions</h3>
                    <ul className="list-disc pl-5 flex flex-col gap-2">
                        {feedback.interviewQuestions.map((item: string, index: number) => (
                            <li key={index} className="text-dark-200">{item}</li>
                        ))}
                    </ul>
                </div>
            )}

            {feedback.coverLetterSummary && (
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="text-xl font-bold text-primary mb-4">Cover Letter Summary</h3>
                    <p className="text-dark-200 leading-relaxed">{feedback.coverLetterSummary}</p>
                </div>
            )}
        </div>
    );
};

export default ExtendedFeedback;
