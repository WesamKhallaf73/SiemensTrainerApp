export interface Lesson {
    id: string;
    type?: 'STL' | 'LAD'; // Default to STL
    title: string;
    description: string;
    initialCode: string;
    solutionCode: string;
    objectives: string[];
}
