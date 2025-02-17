'use client';

import { useAuth } from "@/lib/auth";
import Link from "next/link";

export function DashBoardLink() {
  const { user } = useAuth();

  if (!!user) {
    return (
      <Link href="/admin" className="text-2x text-gray-600 ml-auto mr-10">
        Dashboard
      </Link>
    );
  }

  return null;
}
