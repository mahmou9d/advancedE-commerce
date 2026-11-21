import React from "react";

type CategoryIconProps = {
  name?: string;
  className?: string;
};

export const CategoryIcon: React.FC<CategoryIconProps> = ({
  name = "tag",
  className = "w-5 h-5",
}) => {
  const normalized = (name || "").toLowerCase().trim();

  // Shoes
  if (normalized === "shoes" || normalized === "shoe") {
    return (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 17a4 4 0 004 4h10a4 4 0 004-4v-3a2 2 0 00-2-2h-3l-2.5-4.5A2 2 0 0013.75 6.5H10a2 2 0 00-2 2V12H5a2 2 0 00-2 2v3z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M10 12l2 2m-2-2l-1.5 3M7 21v-4" />
      </svg>
    );
  }

  // Electronics
  if (normalized === "electronics" || normalized === "tech" || normalized === "laptop") {
    return (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    );
  }

  // Sport
  if (normalized === "sport" || normalized === "sports" || normalized === "fitness") {
    return (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <circle cx="12" cy="12" r="9" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3a14.95 14.95 0 000 18M3 12a14.95 14.95 0 0018 0" />
      </svg>
    );
  }

  // Kids
  if (normalized === "kids" || normalized === "toys" || normalized === "child") {
    return (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    );
  }

  // Women
  if (normalized === "women" || normalized === "woman" || normalized === "female") {
    return (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
      </svg>
    );
  }

  // Men
  if (normalized === "men" || normalized === "man" || normalized === "male") {
    return (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    );
  }

  // Default Tag
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
    </svg>
  );
};

