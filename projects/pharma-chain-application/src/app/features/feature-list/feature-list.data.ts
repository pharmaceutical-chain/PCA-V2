export interface Feature {
  label: string;
  icon: string;
  link: string;
  total?: string;
  roles: Array<string>;
  color?: string;
}

export const features: Feature[] = [
  {
    label: 'pca.menu.tenant.overview',
    icon: 'clinic-medical',
    link: '/tenant/overview-tenant',
    roles: ['admin'],
    total: '22',
  },
  {
    label: 'pca.menu.tenant.enter',
    icon: 'clinic-medical',
    link: '/tenant/enter-tenant',
    roles: ['admin'],
    color: 'green'
  },
  {
    label: 'pca.menu.medicine.overview',
    icon: 'capsules',
    link: '/medicine/overview-medicine',
    roles: ['admin', 'manufacturer'],
    total: '13'
  },
  {
    label: 'pca.menu.medicine.enter',
    icon: 'capsules',
    link: '/medicine/enter-medicine',
    roles: ['admin', 'manufacturer'],
    color: 'green'
  },
  {
    label: 'pca.menu.batch.overview',
    icon: 'swatchbook',
    link: '/batch/overview-batch',
    roles: ['admin', 'manufacturer'],
    total: '77'
  },
  {
    label: 'pca.menu.batch.enter',
    icon: 'swatchbook',
    link: '/batch/enter-batch',
    roles: ['admin', 'manufacturer'],
    color: 'green'
  },
  {
    label: 'pca.menu.transfer.overview',
    icon: 'exchange-alt',
    link: '/transfer/overview-transfer',
    roles: ['admin', 'manufacturer', 'distributor', 'retailer'],
    total: '102'
  },
  {
    label: 'pca.menu.transfer.enter',
    icon: 'exchange-alt',
    link: '/transfer/enter-transfer',
    roles: ['admin', 'manufacturer', 'distributor'],
    color: 'green'
  },
  {
    label: 'pca.menu.report',
    icon: 'chart-line',
    link: '/examples/stock-market',
    roles: ['admin', 'manufacturer', 'distributor'],
    color: 'purple'
  },
  {
    label: 'pca.menu.request',
    icon: 'bell',
    link: '/examples/todos',
    roles: ['admin'],
    color: 'mediumpurple'
  }
]