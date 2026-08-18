import { CLIENT_ROUTES } from '@/config/routes';
import { LuHouse, LuListChecks, LuHistory } from 'react-icons/lu';

export const CLIENT_NAV_ITEMS = [
  { to: CLIENT_ROUTES.today, label: "Aujourd'hui", icon: LuHouse, end: true },
  { to: CLIENT_ROUTES.programme, label: 'Programme', icon: LuListChecks },
  { to: CLIENT_ROUTES.historique, label: 'Historique', icon: LuHistory },
];
