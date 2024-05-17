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
}

export default Utils;