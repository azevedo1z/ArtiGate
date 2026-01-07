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
