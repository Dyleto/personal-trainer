import { useQuery } from '@tanstack/react-query';
import { adminService } from '@/services/adminService';
import { queryKeys } from '@/config/queryKeys';

export const useAdminCoaches = () =>
  useQuery({
    queryKey: queryKeys.admin.coaches(),
    queryFn: adminService.getCoaches,
  });
