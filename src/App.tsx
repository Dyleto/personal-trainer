import {
  Route,
  createRoutesFromElements,
  createBrowserRouter,
  RouterProvider,
  Navigate,
  useParams,
} from 'react-router-dom';
import RootLayout from './layouts/RootLayout';
import React from 'react';
import { RouteError } from './components/RouteError';
import { COACH_ROUTES } from './config/routes';

const Login = React.lazy(() => import('./pages/Login'));
const AuthCallback = React.lazy(() => import('./pages/AuthCallback'));
const Join = React.lazy(() => import('./pages/Join'));

const AdminDashboard = React.lazy(() => import('./pages/Admin/Dashboard'));

const CoachLayout = React.lazy(() => import('./pages/Coach/CoachLayout'));
const Clients = React.lazy(() => import('./pages/Coach/Clients'));
const ClientDetails = React.lazy(() => import('./pages/Coach/ClientDetails'));
const ClientJournal = React.lazy(() => import('./pages/Coach/ClientJournal'));
const Exercises = React.lazy(() => import('./pages/Coach/Exercises'));
const ExerciseForm = React.lazy(() => import('./pages/Coach/ExerciseForm'));

const ClientLayout = React.lazy(() => import('./pages/Client/ClientLayout'));
const Today = React.lazy(() => import('./pages/Client/Today'));
const Program = React.lazy(() => import('./pages/Client/Program'));
const SessionScreen = React.lazy(() => import('./pages/Client/SessionScreen'));
const SessionRedirect = React.lazy(
  () => import('./pages/Client/SessionRedirect')
);
const History = React.lazy(() => import('./pages/Client/History'));

const ClientDetailsRedirect = () => {
  const { clientId } = useParams();
  return <Navigate to={COACH_ROUTES.clientSession(clientId!, 1)} replace />;
};

// `exercises/:id/edit` rendait exactement le même composant que
// `exercises/:id`. On garde une seule adresse par écran, mais on redirige
// plutôt que de laisser un ancien lien tomber sur la page d'erreur.
const ExerciseEditRedirect = () => {
  const { exerciseId } = useParams();
  return <Navigate to={COACH_ROUTES.exerciseDetails(exerciseId!)} replace />;
};

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<RootLayout />} errorElement={<RouteError />}>
      <Route path="login" element={<Login />} />
      <Route path="auth/callback" element={<AuthCallback />} />
      <Route path="join" element={<Join />} />

      {/* Routes Coach */}
      <Route path="coach" element={<CoachLayout />}>
        <Route index element={<Clients />} />
        <Route path="clients/:clientId" element={<ClientDetailsRedirect />} />
        <Route
          path="clients/:clientId/s/:sessionIndex"
          element={<ClientDetails />}
        />
        <Route path="clients/:clientId/journal" element={<ClientJournal />} />
        <Route path="exercises" element={<Exercises />} />
        <Route path="exercises/new" element={<ExerciseForm />} />
        <Route path="exercises/:exerciseId" element={<ExerciseForm />} />
        <Route
          path="exercises/:exerciseId/edit"
          element={<ExerciseEditRedirect />}
        />
      </Route>

      {/* Routes Client */}
      <Route path="client" element={<ClientLayout />}>
        <Route index element={<Today />} />
        <Route path="program" element={<Program />} />
        <Route path="session" element={<SessionRedirect />} />
        <Route path="session/:sessionId" element={<SessionScreen />} />
        <Route path="history" element={<History />} />
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
