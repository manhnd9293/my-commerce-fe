import PageTitle from "@/pages/common/PageTitle.tsx";
import {useParams} from "react-router-dom";
import {useState} from "react";
import {keepPreviousData, useQuery} from "@tanstack/react-query";
import httpClient from "@/http-client/http-client.ts";
import {Button} from "@/components/ui/button.tsx";


function CategoriesPaginate() {
  const params = useParams();

  const [page, setPage] = useState<number>(params['page'] ? Number(params['page']) : 0);

  const {data, isPlaceholderData} = useQuery({
    queryKey: ['cat', page],
    queryFn: async () => {
      const axiosResponse = await httpClient.get(`categories/paginate?page=${page}`);
      // @ts-ignore
      return axiosResponse as any[];
    },
    placeholderData: keepPreviousData
  });
  return (
    <div>
      <PageTitle>Categories paginates</PageTitle>
      <div className={'mt-4 flex flex-col gap-2'}>
        {
          data && data.map(cat => (
            <div key={cat.id}>{cat.name}</div>
          ))

        }
      </div>

      <div className={'mt-4 flex gap-2'}>
        <Button disabled={page === 0 || isPlaceholderData} onClick={()=> setPage(page => page - 1)}>Previous</Button>
        <Button disabled={isPlaceholderData} onClick={() => setPage(page => page + 1)}>Next</Button>
      </div>
    </div>
  );
}

export default CategoriesPaginate;