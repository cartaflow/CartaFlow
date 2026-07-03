import { List, type LucideIcon, User } from "lucide-react";

export enum Resource {
  User = "user",
  List = "list",
}

export const RESOURCES: Record<Resource, { icon: LucideIcon }> = {
  [Resource.User]: { icon: User },
  [Resource.List]: { icon: List },
};
