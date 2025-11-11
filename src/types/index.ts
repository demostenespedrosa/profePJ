
export type Lesson = {
    id: string;
    institutionId: string;
    institutionName: string;
    startTime: string; // ISO 8601 string
    endTime: string; // ISO 8601 string
    totalValue: number;
    status: 'Scheduled' | 'Completed' | 'Cancelled';
};
