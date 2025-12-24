import React, { Suspense } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { Spin } from 'antd';
import MainLayout from '@/layouts/MainLayout';
import Login from '@/pages/Auth/Login';

// Lazy Load
const CodeTutor = React.lazy(() => import('@/pages/Study/CodeTutor'));
const Syllabus = React.lazy(() => import('@/pages/Teaching/Syllabus'));
const ExamDesign = React.lazy(() => import('@/pages/Teaching/ExamDesign'));
const MajorConstruct = React.lazy(() => import('@/pages/Management/MajorConstruct'));
const PolicyResponse = React.lazy(() => import('@/pages/Management/PolicyResponse'));
const Collaboration = React.lazy(() => import('@/pages/Research/Collaboration'));

const LazyLoad = (comp: JSX.Element) => (
  <Suspense fallback={<Spin size='large' style={{ display:'flex', justifyContent:'center', marginTop: 50 }} />}>{comp}</Suspense>
);

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { path: '/', element: <Navigate to='/study/code-tutor' replace /> },
      { path: 'study/code-tutor', element: LazyLoad(<CodeTutor />) },
      { path: 'teaching/syllabus', element: LazyLoad(<Syllabus />) },
      { path: 'teaching/exam', element: LazyLoad(<ExamDesign />) },
      { path: 'management/major', element: LazyLoad(<MajorConstruct />) },
      { path: 'management/policy', element: LazyLoad(<PolicyResponse />) },
      { path: 'research/collaboration', element: LazyLoad(<Collaboration />) },
    ]
  },
  { path: '/login', element: <Login /> }
]);
export default router;
