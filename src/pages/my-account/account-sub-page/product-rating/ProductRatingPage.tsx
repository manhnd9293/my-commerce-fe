import PageTitle from "@/pages/common/PageTitle.tsx";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import RatingDialog from "@/pages/my-account/account-sub-page/product-rating/RatingDialog.tsx";
import { QueryKey } from "@/common/constant/query-key.ts";
import ProductRatingService from "@/services/product-rating.service.ts";

function ProductRatingPage() {
  const [showRatingDialog, setShowRatingDialog] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(
    null,
  );

  const { data: pendingRating, isLoading } = useQuery({
    queryKey: [QueryKey.RatingPending],
    queryFn: ProductRatingService.getPending,
  });

  const selectedProduct = pendingRating
    ? pendingRating.find((p) => p.id === selectedProductId)
    : null;

  return (
    <>
      <PageTitle>Product Rating</PageTitle>

      <div className={"mt-4"}>
        {isLoading && <div>Loading rating products ...</div>}
        {pendingRating && pendingRating.length > 0 && (
          <div className={"grid grid-cols-4 gap-5"}>
            {pendingRating.map((p) => {
              return (
                <div
                  key={p.id}
                  className={
                    "cursor-pointer shadow-md p-2 rounded-md hover:shadow-xl hover:scale-110 transition max-w-[240px] bg-white"
                  }
                  onClick={() => {
                    setSelectedProductId(p.id as number);
                    setShowRatingDialog(true);
                  }}
                >
                  <div
                    className={"aspect-[1/1] flex justify-center items-center"}
                  >
                    <img
                      className={"text-center w-full aspect-[1/1] object-cover"}
                      src={p.thumbnailUrl}
                    />
                  </div>
                  <div
                    className={"mt-4 overflow-ellipsis truncate font-semibold"}
                  >
                    {p.name}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      {showRatingDialog && (
        <RatingDialog
          selectedProduct={selectedProduct}
          showRatingDialog={showRatingDialog}
          setShowRatingDialog={setShowRatingDialog}
        />
      )}
    </>
  );
}

export default ProductRatingPage;
