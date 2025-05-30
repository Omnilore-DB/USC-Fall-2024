export interface Member {
  id: number;
  first_name?: string;
  last_name?: string;
  alias?: string;
  street_address?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  phone?: string;
  email?: string;
  photo_link?: string;
}

export type FormattedKeysMember = {
  id: number;
  Name: string;
  Address: string;
  "Phone Number": string;
  Email: string;
  Photo?: string;
};
