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
    link: '',
    roles: ['admin'],
    total: '22'
  },
  {
    name: 'Overview medicine batches',
    icon: '',
    link: '',
    roles: ['admin', 'manufacturer', 'distributor', 'retailer'],
    total: '77'
  },
  {
    name: 'Overview medicine transfers',
    icon: '',
    link: '',
    roles: ['admin', 'manufacturer', 'distributor', 'retailer'],
    total: '102'
  },
  {
    name: 'Enter tenant',
    icon: '',
    link: '',
    roles: ['admin']
  },
  {
    name: 'Enter medicine batches',
    icon: '',
    link: '',
    roles: ['admin', 'manufacturer']
  },
  {
    name: 'Enter medicine transfer',
    icon: '',
    link: '',
    roles: ['admin', 'manufacturer', 'distributor']
  }
]