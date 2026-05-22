import Layout from '@/components/Layout';
import HomePage from '@/pages/HomePage';
import RoutesPage from '@/pages/RoutesPage';
import AddRoutePage from '@/pages/AddRoutePage';
import EditRoutePage from '@/pages/EditRoutePage';
import PlannerPage from '@/pages/PlannerPage';
import SettingsPage from '@/pages/SettingsPage';

const Index = () => {
  return (
    <Layout>
      {(page, setPage) => {
        switch (page) {
          case 'home': return <HomePage setPage={setPage} />;
          case 'planner': return <PlannerPage />;
          case 'routes': return <RoutesPage />;
          case 'add': return <AddRoutePage />;
          case 'edit': return <EditRoutePage />;
          case 'settings': return <SettingsPage />;
          default: return <HomePage setPage={setPage} />;
        }
      }}
    </Layout>
  );
};

export default Index;