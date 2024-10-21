import { AxiosError } from "axios";
import Notification from "@/utils/notification.tsx";
import { RoutePath } from "@/router/RoutePath.ts";
import { router } from "@/router/router.tsx";
import { BaseQueryDto } from "@/dto/query/base-query.dto.ts";

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

  getQueryParams(query: BaseQueryDto) {
    const { pageSize, page, search, order, sortBy } = query;
    const queryArray = [];
    search && queryArray.push(`search=${search}`);
    page && queryArray.push(`page=${page}`);
    pageSize && queryArray.push(`pageSize=${pageSize}`);
    order && queryArray.push(`order=${order}`);
    sortBy && queryArray.push(`sortBy=${sortBy}`);

    return queryArray.join("&");
  },
};

export default Utils;
