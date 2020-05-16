export class FilterOption {
    public Key: string;
    public Value: string;
    public Index: number;

    constructor(key: string, value: string, index: number) {
        this.Key = key;
        this.Value = value;
        this.Index = index;
    }
}

export const FilterOptions: FilterOption[] = [
    new FilterOption('lastName', 'Last name', 0),
    new FilterOption('firstName', 'First name', 1),
    new FilterOption('userName', 'Email', 2),
    new FilterOption('specialization', 'Specialization', 3)
];
