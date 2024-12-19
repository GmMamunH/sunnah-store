import { useParams, useSearchParams } from "react-router-dom";
import ProductCard from "./ProductCard";
import ProductsPagination from "./ProductsPagination";
import { useState, useEffect } from "react";
import FilterSection from "./Filtering/FilterSection";
import { Switch } from "@material-tailwind/react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Loading from "../../components/Shared/Loading";
import { Helmet } from "react-helmet-async";

const Products = () => {
  const { key } = useParams();
  const [searchParams] = useSearchParams();
  const search = searchParams.get("search")?.toLowerCase() || "";

  const [sortBy, setSortBy] = useState(0);
  const [inStock, setInStock] = useState(false);
  const [sortedProducts, setSortedProducts] = useState([]);

  const { data: products, isLoading } = useQuery({
    queryKey: key ? ["products", key] : ["products"],
    queryFn: async () => {
      let url = "https://sunnah-store-server-azure.vercel.app/products";
      if (key) {
        url = `https://sunnah-store-server-azure.vercel.app/products/${key}`;
      }
      const res = await axios.get(url);
      return res.data.data;
    },
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (!products) return;

    let filtered = [...products];

    // Title Search Filtering
    if (search) {
      filtered = filtered.filter((product) =>
        product.name.toLowerCase().includes(search)
      );
    }

    // Sorting
    switch (sortBy) {
      case 1: // Price: Low to High
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 2: // Price: High to Low
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 3: // Rating
        filtered.sort((a, b) => b.averageRating - a.averageRating);
        break;
      case 4: // Top Sales
        filtered.sort((a, b) => b.individualRating - a.individualRating);
        break;
      default:
        // 0 : no additional sorting
        break;
    }

    // In Stock Filter
    if (inStock) {
      filtered = filtered.filter((product) => product.status === true);
    }

    setSortedProducts(filtered);
  }, [products, sortBy, inStock, search]);

  // Determine title and product count
  let title = "";

  if (search) {
    // If searching by title
    title = `Search results for "${search}" (${sortedProducts.length})`;
  } else {
    // No selectedCategory, check key
    if (key) {
      const displayKey = key === "groceries" ? "groceries & foods" : key;
      title = `${displayKey} (${sortedProducts.length})`;
    } else {
      title = `all products (${sortedProducts.length})`;
    }
  }

  return (
    <div className="mt-44">
      <Helmet>
        <title>Sunnah Store | Products</title>
      </Helmet>
      <FilterSection sortBy={sortBy} setSortBy={setSortBy} search={search} />

      <div className="flex items-center justify-between mt-3">
        <div className="flex w-1/2 justify-between items-center gap-5">
          <div>
            <h1 className="text-2xl border-b-4 border-primary w-fit capitalize">
              {title}
            </h1>
          </div>
        </div>

        <div className="flex items-center space-x-2 mt-3">
          <Switch
            id="in-stock"
            checked={inStock}
            onChange={(e) => setInStock(e.target.checked)}
          />
          <label htmlFor="in-stock" className="text-primary">
            In stock
          </label>
        </div>
      </div>

      {isLoading ? (
        <Loading />
      ) : (
        <div className="mb-8 mt-8 grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {sortedProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
      <div className="mx-auto mb-6">
        <ProductsPagination />
      </div>
    </div>
  );
};

export default Products;
