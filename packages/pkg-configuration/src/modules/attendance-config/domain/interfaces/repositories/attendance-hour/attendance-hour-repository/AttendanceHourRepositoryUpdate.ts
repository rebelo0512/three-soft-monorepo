export type AttendanceHourRepositoryUpdateInput = {
  id: number;
  name: string;
  monday: boolean | null;
  tuesday: boolean | null;
  wednesday: boolean | null;
  thursday: boolean | null;
  friday: boolean | null;
  saturday: boolean | null;
  sunday: boolean | null;
  message: string;
  start: string;
  end: string;
  status: boolean;
};
