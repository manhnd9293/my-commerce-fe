import { AxiosError } from "axios";
import Notification from "@/utils/notification.tsx";
import { RoutePath } from "@/router/RoutePath.ts";
import { router } from "@/router/router.tsx";
import { BaseQueryDto } from "@/dto/query/base-query.dto.ts";
import {
  DashboardPeriod,
  DetailPeriod,
} from "@/dto/analytic/dashboard/dashboard-query.dto.ts";
import { ProductVariant } from "@/dto/product/product-variant.ts";
import { KeyboardEvent } from "react";

const Utils = {
  getErrorMessage(error: Error) {
    if (error instanceof AxiosError) {
      return error.response?.data?.message;
    } else {
      return error.message;
    }
  },

  handleError(error: Error) {
    if (error instanceof AxiosError) {
      if (error.response?.status === 401 || error.response?.status === 403) {
        router.navigate(RoutePath.SignIn);
      }
    }
    console.log({ error });
    Notification.error(this.getErrorMessage(error));
  },

  /**
   * Merges two FileList objects and returns a new FileList object
   * @param fileListA The first FileList object
   * @param fileListB The second FileList object
   */
  mergeFileLists(
    fileListA: FileList | undefined | null,
    fileListB: FileList | undefined | null,
  ): FileList {
    const dataTransfer = new DataTransfer();

    if (fileListA) {
      for (let i = 0; i < fileListA.length; i++) {
        dataTransfer.items.add(fileListA[i]);
      }
    }
    if (fileListB) {
      for (let i = 0; i < fileListB.length; i++) {
        dataTransfer.items.add(fileListB[i]);
      }
    }

    return dataTransfer.files;
  },

  createFileList(list: File[]) {
    const dataTransfer = new DataTransfer();
    for (let i = 0; i < list.length; i++) {
      dataTransfer.items.add(list[i]);
    }
    return dataTransfer.files;
  },

  getMoneyNumber(n: number) {
    return new Intl.NumberFormat().format(n);
  },

  getQueryString(query: BaseQueryDto) {
    const queryArray = [];
    for (const key of Object.keys(query)) {
      // @ts-ignore
      const queryValue = query[key];
      queryValue && queryArray.push(`${key}=${queryValue}`);
    }
    return queryArray.join("&");
  },

  getDetailPeriod(period: DashboardPeriod): DetailPeriod {
    const record: Record<DashboardPeriod, DetailPeriod> = {
      [DashboardPeriod.Month]: "DAY",
      [DashboardPeriod.Year]: "MONTH",
      [DashboardPeriod.Day]: "HOUR",
      [DashboardPeriod.Week]: "DAY OF WEEK",
    };

    return record[period];
  },

  getProductVariantSpecsString(pv: ProductVariant) {
    return pv.specs
      .map((s) => `${s.optionName}:${s.optionValueName}`)
      .join("-");
  },

  handleKeyDownAllowNumberOnly(e: KeyboardEvent<HTMLInputElement>) {
    if (!/\d/.test(e.key) && e.key !== "Backspace") {
      e.preventDefault();
    }
  },
};

export default Utils;
