import { Button } from "@/components/ui/button.tsx";
import { v4 } from "uuid";
import httpClient from "@/http-client/http-client.ts";

function TestPage(props) {
  function createProduct() {
    const id = v4();
    return httpClient.post(`/products/test-create/${id}`);
  }

  return (
    <div>
      <Button onClick={createProduct}>Create</Button>
    </div>
  );
}

export default TestPage;
