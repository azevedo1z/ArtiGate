export class User {
    id: string;
    name: string;
    email: string;
    phone: string;
    badgeUrl: string;
    role: string;
    homeAddressId: string;
    jobAddressId: string;
  
    constructor(id: string, name: string, email: string, phone: string, badgeUrl: string, role: string,
        homeAddressId: string, jobAddressId: string) {
      this.id = id;
      this.name = name;
      this.email = email;
      this.phone = phone;
      this.badgeUrl = badgeUrl;
      this.role = role;
      this.homeAddressId = homeAddressId;
      this.jobAddressId = jobAddressId;
    }
}