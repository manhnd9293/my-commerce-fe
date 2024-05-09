import { toast } from '@/components/ui/use-toast.ts';

const notification = {
  success(message: string = 'Update success') {
    toast({
      description: (
        <div className={'flex gap-2 items-center'}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5"
               stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round"
                  d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
          </svg>

          <span>{message}</span></div>
      ),

    });
  },

  error(message: string = 'Update fail') {
    toast({
      description: (
        <div className={'flex gap-2 items-center'}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
               stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round"
                  d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
          </svg>
          <span>{message}</span>
        </div>
      ),

    });
  },
}

export default notification;