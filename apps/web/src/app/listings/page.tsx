"use client";

import React, { Suspense } from "react";
import ListingsContent from "./listings-content";
import { NavigationLayout } from "../../components/navigation";

export default function ListingsPage() {
  return (
    <Suspense fallback={
      <NavigationLayout>
        <div className="py-20 text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      </NavigationLayout>
    }>
      <ListingsContent />
    </Suspense>
  );
}