import { LayoutGrid, List, type LucideIcon, User } from "lucide-react";

export enum Resource {
  User = "user",
  List = "list",
  Card = "card",
}

export const RESOURCES: Record<Resource, { icon: LucideIcon }> = {
  [Resource.User]: { icon: User },
  [Resource.List]: { icon: List },
  [Resource.Card]: { icon: LayoutGrid },
};
