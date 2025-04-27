import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { QueryKey } from "@/common/constant/query-key.ts";
import ProductRatingService from "@/services/product-rating.service.ts";
import { ProductRatingQueryDto } from "@/dto/product-rating/product-rating-query.dto.ts";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar.tsx";
import { Rating } from "@smastrom/react-rating";
import { DateTime } from "luxon";
import { Separator } from "@/components/ui/separator.tsx";
import { PaginationGroup } from "@/components/common/PaginationGroup.tsx";

export interface ProductReviewProps {
  productId: string;
}

function ProductReview({ productId }: ProductReviewProps) {
  const [page, setPage] = useState(1);
  const [rate, setRate] = useState(null);

  const { data: ratingPage, isLoading } = useQuery({
    queryKey: [QueryKey.RatingList, productId, page, rate],
    queryFn: () => {
      const queryData: ProductRatingQueryDto = {
        page,
        rate,
      };
      return ProductRatingService.getRatingList(productId, queryData);
    },
  });
  return (
    <div className={"bg-white p-4 rounded-lg shadow-sm"}>
      <div className={"text-lg font-semibold mb-4"}>Product Review</div>
      {isLoading && <div>Loading product reviews ...</div>}
      <div className={"space-y-3"}>
        {ratingPage && ratingPage.data.length === 0 && (
          <div>This product currently has no review yet ! </div>
        )}
        {ratingPage &&
          ratingPage.data.length > 0 &&
          ratingPage.data.map((rating, index) => {
            return (
              <div key={rating.id} className={"flex gap-4"}>
                <Avatar className={"size-10"}>
                  <AvatarImage src={rating.user.avatarUrl!} />
                  <AvatarFallback>A</AvatarFallback>
                </Avatar>
                <div>
                  <div className={"mb-1"}>{rating.user.fullName}</div>
                  <Rating
                    value={rating.rate}
                    style={{ maxWidth: 100 }}
                    readOnly={true}
                  />
                  <div className={"text-sm text-gray-500 mt-1"}>
                    {DateTime.fromISO(String(rating.createdAt)).toFormat(
                      "yyyy-MM-dd-HH:mm",
                    )}
                  </div>
                  <div className={"mt-2"}>{rating.textContent}</div>
                  <div className={"mt-3"}>
                    {rating.ratingMedia && rating.ratingMedia.length > 0 && (
                      <div className={"flex justify-start gap-2"}>
                        {rating.ratingMedia.map((media) => {
                          return (
                            <img className={"size-20"} src={media.mediaUrl} />
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
                {index !== ratingPage.data.length - 1 && (
                  <Separator className={"my-4"} />
                )}
              </div>
            );
          })}
        <div className={"mt-4"}>
          {ratingPage && ratingPage.data && ratingPage?.data?.length > 0 && (
            <PaginationGroup
              currentPage={page || 1}
              onChangePage={setPage}
              pageData={ratingPage}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductReview;
