import { environment as env } from '../../../environments/environment';

export interface Feature {
  name: string;
  icon: string;
  link: string;
  total?: string;
  roles?: Array<string>;
}

export const features: Feature[] = [
  {
    name: 'Overview tenants',
    icon: '',
    link: '/tenant/overview-tenant',
    roles: ['admin'],
    total: '22'
  },
  {
    name: 'Overview medicines',
    icon: '',
    link: '/medicine/overview-medicine',
    roles: ['admin', 'manufacturer'],
    total: '13'
  },
  {
    name: 'Overview batches',
    icon: '',
    link: '/batch/overview-batch',
    roles: ['admin', 'manufacturer'],
    total: '77'
  },
  {
    name: 'Overview transfers',
    icon: '',
    link: '/transfer/overview-transfer',
    roles: ['admin', 'manufacturer', 'distributor', 'retailer'],
    total: '102'
  },
  {
    name: 'Enter tenant',
    icon: '',
    link: '/tenant/enter-tenant',
    roles: ['admin']
  },
  {
    name: 'Enter medicine',
    icon: '',
    link: '/medicine/enter-medicine',
    roles: ['admin', 'manufacturer']
  },
  {
    name: 'Enter batch',
    icon: '',
    link: '/batch/enter-batch',
    roles: ['admin', 'manufacturer']
  },
  {
    name: 'Enter transfer',
    icon: '',
    link: '/transfer/enter-transfer',
    roles: ['admin', 'manufacturer', 'distributor']
  }
]