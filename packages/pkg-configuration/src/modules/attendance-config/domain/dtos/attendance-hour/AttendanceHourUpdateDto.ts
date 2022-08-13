export type AttendanceHourUpdateInputDto = {
  id: number;
  name: string;
  monday: boolean;
  tuesday: boolean;
  wednesday: boolean;
  thursday: boolean;
  friday: boolean;
  saturday: boolean;
  sunday: boolean;
  message: string;
  start: string;
  end: string;
  status: boolean;
};
