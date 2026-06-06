# CareerForge AI

![CareerForge AI hero](./public/readme/hero.webp)

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=111827)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=ffffff)
![React Router](https://img.shields.io/badge/React_Router-v7-CA4245?logo=reactrouter&logoColor=ffffff)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38BDF8?logo=tailwindcss&logoColor=ffffff)
![Puter.js](https://img.shields.io/badge/Puter.js-Auth_FS_KV_AI-14B8A6)

## Introduction

CareerForge AI is an intelligent, AI-powered career assistant platform built with React 19, TypeScript, React Router v7, Tailwind CSS, Zustand, and Puter.js. It helps users analyze resumes, improve ATS scores, generate cover letters, prepare for interviews, track job applications, and get conversational AI career coaching from a single synced workspace.

## Tech Stack

- React 19
- TypeScript
- React Router v7
- Tailwind CSS
- Zustand
- Puter.js: Auth, FS, KV, and AI

## Features

- Smart Resume Parsing & ATS Analysis
- Extended AI Feedback: Job Match Score, Industry Readiness, Missing Skills, Strengths/Weaknesses, Career Level, Recommended Projects & Certifications
- Cover Letter Generator: AI-powered letters stored in Puter KV
- Interview Prep: Technical, Behavioral, and HR questions
- Job Application Tracker: full CRUD with Puter KV
- Career Insights Dashboard: aggregate stats across all resumes
- AI Career Coach: conversational chatbot for career guidance
- Backward Compatibility Layer: `normalizeFeedback` for legacy resumes
- Cross-device sync via Puter KV with no `localStorage`

## Quick Start

Clone the repository:

```bash
git clone https://github.com/YOUR_USERNAME/careerforge-ai.git
cd careerforge-ai
```

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open:

```text
http://localhost:5173
```

Sign in with Puter.js to start using CareerForge AI.

## Project Structure

- `app/routes/home.tsx` - Career Dashboard
- `app/routes/upload.tsx` - Resume Upload & AI Analysis
- `app/routes/resume.tsx` - Career Analysis Report
- `app/routes/tracker.tsx` - Job Application Tracker
- `app/routes/cover-letter.tsx` - Cover Letter Generator
- `app/routes/interview.tsx` - Interview Prep
- `app/routes/career-insights.tsx` - Career Insights
- `app/routes/career-coach.tsx` - AI Career Coach
- `app/routes/auth.tsx` - Authentication
- `app/lib/puter.ts` - Puter.js Zustand Store
- `constants/index.ts` - AI Prompts and `normalizeFeedback`
- `types/index.d.ts` - TypeScript Interfaces
