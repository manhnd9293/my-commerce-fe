import { AxiosError } from 'axios';
import Notification from '@/utils/notification.tsx';
import { RoutePath } from '@/router/RoutePath.ts';
import { router } from '@/router/router.tsx';

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
      console.log({error})
      if (error.response?.status === 401 || error.response?.status === 403) {
        router.navigate(RoutePath.SignIn);
      }
    }
    console.log({error});
    Notification.error(this.getErrorMessage(error));
  },

  /**
   * Merges two FileList objects and returns a new FileList object
   * @param fileListA The first FileList object
   * @param fileListB The second FileList object
   */
  mergeFileLists (fileListA: FileList | undefined, fileListB: FileList | undefined): FileList  {
    const dataTransfer = new DataTransfer();

    if(fileListA !== null && fileListA !== undefined) {
      for (let i = 0; i < fileListA.length; i++) {
        dataTransfer.items.add(fileListA[i]);
      }
    }
    if(fileListB !== null && fileListB !== undefined) {
      for (let i = 0; i < fileListB.length; i++) {
        dataTransfer.items.add(fileListB[i]);
      }
    }

    return dataTransfer.files;
  }
}

export default Utils;