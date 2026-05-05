export const ROLE_OPTIONS = [
  { value: 'AUTHOR', label: 'Author', disabled: true },
  { value: 'REVIEWER', label: 'Reviewer' },
];

export const PAYMENT_STATUS_OPTIONS = [
  { value: 'pending', label: 'Pending' },
  { value: 'in_process', label: 'In Process' },
  { value: 'authorized', label: 'Authorized' },
  { value: 'approved', label: 'Approved' },
  { value: 'rejected', label: 'Rejected' },
  { value: 'cancelled', label: 'Cancelled' },
  { value: 'refunded', label: 'Refunded' },
  { value: 'charged_back', label: 'Charged Back' },
] as const;

export const IDENTIFICATION_TYPE_OPTIONS = [
  { value: '', label: 'None' },
  { value: 'CPF', label: 'CPF (BR)' },
  { value: 'CNPJ', label: 'CNPJ (BR)' },
  { value: 'DNI', label: 'DNI (AR/PE)' },
  { value: 'CUIT', label: 'CUIT (AR)' },
  { value: 'CUIL', label: 'CUIL (AR)' },
  { value: 'RUT', label: 'RUT (CL)' },
  { value: 'CC', label: 'CC (CO)' },
  { value: 'CE', label: 'CE (CO)' },
  { value: 'NIT', label: 'NIT (CO)' },
  { value: 'CURP', label: 'CURP (MX)' },
  { value: 'RFC', label: 'RFC (MX)' },
  { value: 'RUC', label: 'RUC (PE)' },
  { value: 'OTRO', label: 'Other' },
];
