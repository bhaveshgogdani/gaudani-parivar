export interface Result {
  _id: string;
  studentName: string;
  standardId?: Standard | string;
  otherStandardName?: string;
  medium: 'gujarati' | 'english';
  totalMarks?: number;
  obtainedMarks?: number;
  percentage: number;
  villageId: Village | string;
  contactNumber?: string;
  resultImageUrl?: string;
  resultImageFileName?: string;
  submittedAt: string;
  isVerified: boolean;
  isApproved: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Village {
  _id: string;
  villageName: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Standard {
  _id: string;
  standardName: string;
  standardCode: string;
  displayOrder: number;
  isActive: boolean;
  isCollegeLevel: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateResultData {
  studentName: string;
  standardId?: string;
  otherStandardName?: string;
  medium: 'gujarati' | 'english';
  totalMarks?: number;
  obtainedMarks?: number;
  percentage: number;
  villageId: string;
  contactNumber?: string;
  resultImage?: File;
  isApproved?: boolean;
}

export interface ResultFilters {
  page?: number;
  limit?: number;
  medium?: 'gujarati' | 'english';
  standardId?: string;
  villageId?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

