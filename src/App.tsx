import {
  Route,
  createRoutesFromElements,
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom';
import RootLayout from './layouts/RootLayout';
import React from 'react';
import { RouteError } from './components/RouteError';

const Login = React.lazy(() => import('./pages/Login'));
const AuthCallback = React.lazy(() => import('./pages/AuthCallback'));
const Join = React.lazy(() => import('./pages/Join'));

const AdminDashboard = React.lazy(() => import('./pages/Admin/Dashboard'));

const Clients = React.lazy(() => import('./pages/Coach/Clients'));
const ClientDetails = React.lazy(() => import('./pages/Coach/ClientDetails'));
const Exercises = React.lazy(() => import('./pages/Coach/Exercises'));
const ExerciseForm = React.lazy(() => import('./pages/Coach/ExerciseForm'));

const ClientLayout = React.lazy(() => import('./pages/Client/ClientLayout'));
const Today = React.lazy(() => import('./pages/Client/Today'));
const Program = React.lazy(() => import('./pages/Client/Program'));
const SessionScreen = React.lazy(() => import('./pages/Client/SessionScreen'));
const History = React.lazy(() => import('./pages/Client/History'));

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<RootLayout />} errorElement={<RouteError />}>
      <Route path="login" element={<Login />} />
      <Route path="auth/callback" element={<AuthCallback />} />
      <Route path="join" element={<Join />} />

      {/* Routes Coach */}
      <Route path="coach" element={<Clients />} />
      <Route path="coach/clients/:clientId" element={<ClientDetails />} />
      <Route path="coach/exercises" element={<Exercises />} />
      <Route path="coach/exercises/new" element={<ExerciseForm />} />
      <Route path="coach/exercises/:exerciseId" element={<ExerciseForm />} />
      <Route
        path="coach/exercises/:exerciseId/edit"
        element={<ExerciseForm />}
      />

      {/* Routes Client */}
      <Route path="client" element={<ClientLayout />}>
        <Route index element={<Today />} />
        <Route path="programme" element={<Program />} />
        <Route path="seance" element={<SessionScreen />} />
        <Route path="historique" element={<History />} />
      </Route>

      {/* Routes Admin */}
      <Route path="admin" element={<AdminDashboard />} />
    </Route>
  )
);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
