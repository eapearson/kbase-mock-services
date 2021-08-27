export type ControlledFieldKey = string;

export interface FieldGroup {
    name: string;
    title: string;
    fields: Array<ControlledFieldKey>;
}

export type FieldGroups = Array<FieldGroup>;