export type Validator = {
  errors: { [key: string]: string }[] | null;
  transformedValues: any | null;
  validate: (input: any) => void;
};
