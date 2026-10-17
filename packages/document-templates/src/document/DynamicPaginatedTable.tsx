import React from "react";
import { DocumentTable } from "./DocumentTable";

export interface PageLimitConfig {
  firstPage: number;
  middle: number;
  lastPage: number;
}

export const DEFAULT_LIMITS: PageLimitConfig = {
  firstPage: 12,
  middle: 18,
  lastPage: 8,
};

export const LANDSCAPE_LIMITS: PageLimitConfig = {
  firstPage: 6,
  middle: 9,
  lastPage: 4,
};

export function paginateData<T>(
  data: T[],
  limits: PageLimitConfig,
  minLastPageRows: number = 2
): T[][] {
  if (data.length === 0) return [[]];

  if (data.length <= limits.lastPage) {
    return [data];
  }

  const pages: T[][] = [];
  let currentIndex = 0;

  let firstPageSize = Math.min(data.length, limits.firstPage);

  if (data.length > limits.lastPage && firstPageSize === data.length) {
    const leaveForNext = Math.min(Math.max(minLastPageRows, 3), limits.lastPage);
    firstPageSize = Math.max(1, data.length - leaveForNext);
  } else if (data.length > limits.firstPage) {
    const remainingAfterFirst = data.length - firstPageSize;
    if (remainingAfterFirst > 0 && remainingAfterFirst < minLastPageRows) {
      const borrow = minLastPageRows - remainingAfterFirst;
      firstPageSize = Math.max(1, firstPageSize - borrow);
    }
  }

  pages.push(data.slice(0, firstPageSize));
  currentIndex += firstPageSize;

  while (currentIndex < data.length) {
    const remainingCount = data.length - currentIndex;

    if (remainingCount <= limits.lastPage) {
      pages.push(data.slice(currentIndex));
      break;
    }

    if (remainingCount <= limits.middle) {
      let lastPageCount = Math.min(Math.ceil(remainingCount / 2), limits.lastPage);
      if (lastPageCount < minLastPageRows && remainingCount >= minLastPageRows) {
        lastPageCount = minLastPageRows;
      }
      const middlePageCount = remainingCount - lastPageCount;

      pages.push(data.slice(currentIndex, currentIndex + middlePageCount));
      pages.push(data.slice(currentIndex + middlePageCount));
      break;
    }

    let middlePageSize = limits.middle;
    const remainingAfterMiddle = remainingCount - middlePageSize;
    if (remainingAfterMiddle > 0 && remainingAfterMiddle < minLastPageRows) {
      const borrow = minLastPageRows - remainingAfterMiddle;
      middlePageSize = Math.max(1, middlePageSize - borrow);
    }

    pages.push(data.slice(currentIndex, currentIndex + middlePageSize));
    currentIndex += middlePageSize;
  }

  return pages;
}
