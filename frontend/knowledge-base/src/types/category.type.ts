export interface ICategory {
  id: number;
  parentId: number | null;
  name: string;
  isTicket?: boolean;
  children: ICategory[];
  group: string;
}
