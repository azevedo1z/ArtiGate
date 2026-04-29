import { SignUpFormData } from '../shared/types/types.shared';

export const stripMask = (value: string) =>
  value ? value.replace(/\D/g, '') : '';

export const prepareUserData = (
  formData: SignUpFormData,
  roleIds: string[]
) => {
  return {
    name: formData.name.trim(),
    email: formData.email.trim().toLowerCase(),
    phone: stripMask(formData.phone),
    password: formData.password,
    roleIds: roleIds,
    homeAddress: {
      zipCode: stripMask(formData.homeZipCode),
      street: formData.homeStreet.trim(),
      complement: formData.homeComplement,
      neighborhood: formData.homeNeighborhood.trim(),
      city: formData.homeCity.trim(),
      state: formData.homeState.trim(),
    },
    jobAddress: {
      zipCode: stripMask(formData.jobZipCode),
      street: formData.jobStreet.trim(),
      complement: formData.jobComplement,
      neighborhood: formData.jobNeighborhood.trim(),
      city: formData.jobCity.trim(),
      state: formData.jobState.trim(),
    },
    badgeUrl: '',
  };
};

export const formatBytes = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
};

export const validatePdfFile = (file: File): string | null => {
  if (!/\.pdf$/i.test(file.name)) return 'The file extension must be .pdf.';
  if (file?.type !== 'application/pdf') return 'Only PDF files are accepted.';
  if (file.size === 0) return 'The PDF file is empty.';
  return null;
};
