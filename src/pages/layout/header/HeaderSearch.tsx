import { Input } from "@/components/ui/input.tsx";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { useRef, useState } from "react";
import Autosuggest from "react-autosuggest";
import ProductsService from "@/services/products.service.ts";
import { Product } from "@/dto/product/product.ts";
import { useNavigate } from "react-router-dom";
import debounce from "debounce";
import { LoaderIcon } from "lucide-react";
import { cn } from "@/lib/utils.ts";

export function HeaderSearch() {
  const navigate = useNavigate();

  const [value, setValue] = useState("");
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [clearRequest, setClearRequest] = useState(true);
  const searchRef = useRef<string>();

  const onChange = (event, { newValue }) => {
    setLoading(true);
    setValue(newValue);
    searchRef.current = newValue;
  };

  const inputProps = {
    placeholder: "Type a programming language",
    value,
    onChange,
  };

  async function getSuggestions(search: string) {
    const inputValue = search.trim().toLowerCase();

    const productPage = await ProductsService.getAll({ search: inputValue });
    return productPage.data;
  }

  async function onSuggestionsFetchRequested({ value: searchValue, reason }) {
    if (searchValue !== searchRef.current) {
      return;
    }
    if (reason === "input-changed") {
      const updateSuggestion = await getSuggestions(searchValue);
      setSuggestions(updateSuggestion);
      setLoading(false);
      setClearRequest(false);
    }
  }

  function onSuggestionsClearRequested() {
    setLoading(false);
    setClearRequest(true);
    setSuggestions([]);
  }

  function onSuggestionSelected(event, { suggestion }) {
    suggestion.id && navigate(`/product/${suggestion.id}`);
  }
  return (
    <div
      className={
        "hidden md:block md:relative md:w-[300px] lg:w-[500px] md:ml-24"
      }
    >
      <Autosuggest
        suggestions={suggestions}
        onSuggestionsFetchRequested={debounce(onSuggestionsFetchRequested, 600)}
        onSuggestionsClearRequested={onSuggestionsClearRequested}
        getSuggestionValue={(suggestion: Product) => suggestion.name}
        onSuggestionSelected={onSuggestionSelected}
        onSuggestionHighlighted={() => {
          setLoading(false);
        }}
        inputProps={inputProps}
        renderInputComponent={({ key, ...restProps }) => (
          <Input {...restProps} placeholder={"Search products ..."} />
        )}
        renderSuggestion={(suggestion: Product) => (
          <div
            key={suggestion.id}
            className={cn(
              "hover:bg-sky-500 hover:text-white cursor-pointer truncate h-10 flex items-center gap-2 p-2",
            )}
            onClick={() => navigate(`product/${suggestion.id}`)}
          >
            <span>{suggestion.name}</span>
          </div>
        )}
        renderSuggestionsContainer={({ containerProps, children, query }) => {
          return (
            <div
              {...containerProps}
              className={
                "absolute top-10 w-full bg-white z-10 flex flex-col gap-1"
              }
              key={"suggestion-container"}
            >
              {children}
              {!clearRequest && suggestions.length === 0 && (
                <div className={"truncate h-10 flex items-center gap-2 p-2"}>
                  No result match !
                </div>
              )}
            </div>
          );
        }}
      />
      {!loading && (
        <MagnifyingGlassIcon className={"size-5 absolute top-3  right-2"} />
      )}
      {loading && (
        <LoaderIcon className="animate-spin size-5 absolute top-3  right-2" />
      )}
    </div>
  );
}
