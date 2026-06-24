export type CollegeType = "GOVERNMENT" | "PRIVATE" | "DEEMED" | "AUTONOMOUS";

export interface Course {
  id: string;
  name: string;
  duration: number;
  fees: number;
  seats: number | null;
}

export interface CollegeSummary {
  id: string;
  name: string;
  slug: string;
  location: string;
  city: string;
  state: string;
  type: CollegeType;
  rating: number;
  reviewCount: number;
  totalFees: number;
  ranking: number | null;
  nirf: number | null;
  accreditation: string | null;
  avgPackage: number | null;
  placementRate: number | null;
  examsAccepted: string[];
  logo: string | null;
}

export interface CollegeDetail extends CollegeSummary {
  establishedIn: number;
  description: string | null;
  website: string | null;
  phone: string | null;
  affiliation: string | null;
  highestPackage: number | null;
  topRecruiters: string[];
  courses: Course[];
  reviews: Review[];
}

export interface Review {
  id: string;
  rating: number;
  title: string;
  body: string;
  batch: number | null;
  createdAt: string;
  user: { name: string | null };
}

export interface FiltersState {
  q: string;
  type: string;
  state: string;
  exam: string;
  minFees: string;
  maxFees: string;
  minRating: string;
  sort: string;
}
