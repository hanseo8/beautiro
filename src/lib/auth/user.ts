import type { User } from "@prisma/client";

export type PublicUser = {
  id: string;
  email: string;
  name: string;
  phone: string | null;
  locale: string;
  createdAt: string;
};

export function toPublicUser(user: User): PublicUser {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    phone: user.phone,
    locale: user.locale,
    createdAt: user.createdAt.toISOString(),
  };
}
