import { AxiosError } from 'axios';

const Utils = {
  getErrorMessage(error: Error) {
    if (error instanceof AxiosError) {
      return error.response?.data?.message;
    } else {
      return error.message;
    }
  },
}

export default Utils;