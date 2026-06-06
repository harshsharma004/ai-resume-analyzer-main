import {type RouteConfig, index, route} from "@react-router/dev/routes";

export default [
    index("routes/landing.tsx"),
    route('/dashboard', 'routes/home.tsx'),
    route('/auth', 'routes/auth.tsx'),
    route('/profile', 'routes/profile.tsx'),
    route('/upload', 'routes/upload.tsx'),
    route('/resume/:id', 'routes/resume.tsx'),
    route('/tracker', 'routes/tracker.tsx'),
    route('/cover-letter', 'routes/cover-letter.tsx'),
    route('/interview', 'routes/interview.tsx'),
    route('/career-insights', 'routes/career-insights.tsx'),
    route('/career-coach', 'routes/career-coach.tsx'),
    route('/wipe', 'routes/wipe.tsx'),
] satisfies RouteConfig;
