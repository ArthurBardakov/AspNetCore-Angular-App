import { OperationType } from 'src/enums/operation-type.enum';

export class PatchOperation {
    public op: OperationType;
    public path: string;
    public value: any;

    constructor(op: OperationType, path: string, value?: any) {
        this.op = op;
        this.path = path;
        this.value = value;
    }
}
