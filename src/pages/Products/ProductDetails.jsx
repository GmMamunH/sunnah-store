import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Typography,
} from "@material-tailwind/react";
import { useParams } from "react-router-dom";
import Loading from "../../components/Shared/Loading";
import { Helmet } from "react-helmet-async";
import { axiosInstance } from "../../api/axios_instance";
import { useQuery } from "@tanstack/react-query";
import { useContext } from "react";
import { WishlistContext } from "../../contexts/WishlistContext";
import { CartContext } from "../../contexts/CartContext";

const ProductDetails = () => {
  const { id } = useParams();

  const { data: product, isLoading } = useQuery({
    queryKey: [id],
    queryFn: async () => {
      const res = await axiosInstance.get(`product/${id}`);
      return res.data;
    },
    staleTime: 5 * 60 * 1000,
  });

  const { addToCart } = useContext(CartContext);
  const { removeFromWishlist, addToWishlist, wishlistItems } = useContext(WishlistContext);

  const isWishlisted = wishlistItems.find((item) => item._id === id);

  if (isLoading) {
    return <Loading />;
  }

  // Safely handle product and keyFeatures
  const {
    image,
    name,
    description,
    category,
    price,
    status,
    individualRating,
    averageRating,
    keyFeatures = {},
  } = product || {};

  // if no product found or empty object (server returns a empty value attached with {id})
  if (!name) {
    throw new Error(`Invalid Product Id: ${id}`);
  }

  return (
    <div className="flex relative justify-center items-center mt-44 py-10 px-4">
      <Helmet>
        <title>{`Sunnah Store | ${name}`}</title>
      </Helmet>
      <Card className="relative border p-6 shadow-lg w-full max-w-6xl lg:flex-row bg-white">
        <CardHeader
          shadow={false}
          floated={false}
          className="flex-1 flex justify-center items-center"
        >
          <div className="group w-80 overflow-hidden cursor-zoom-in">
            <img
              loading="lazy"
              src={image}
              alt={name}
              className="w-full h-full object-cover transition-transform duration-300 ease-in-out transform group-hover:scale-150"
            />
          </div>
        </CardHeader>
        <CardBody className="flex-1 lg:ml-8 p-0 pt-6 lg:pt-0 lg:p-6">
          <Typography
            variant="h2"
            color="blue-gray"
            className="mb-4 text-2xl sm:text-3xl font-bold"
          >
            {name}
          </Typography>
          <Typography className="absolute top-4 right-5 mb-4 text-lg">
            {product?.status ? (
              <span className="text-primary bg-gray-200 py-1 px-2.5 rounded">
                In stock
              </span>
            ) : (
              <span className="text-red-600 bg-gray-200 py-1 px-2.5 rounded">
                Out of stock
              </span>
            )}
          </Typography>

          <Typography color="gray" className="mb-4 text-sm sm:text-base">
            {description}
          </Typography>
          {/* Dynamic Key Features */}
          <div className="mb-2 space-y-2">
            <Typography variant="h5" color="blue-gray" className="font-bold">
              Key Features:
            </Typography>
            {Object.entries(keyFeatures).length > 0 ? (
              Object.entries(keyFeatures).map(
                (
                  [featureKey, featureValue] //keyFeatures=[[key,value]]
                ) => (
                  <Typography
                    key={featureKey}
                    variant="h6"
                    color="gray"
                    className="flex items-center text-sm sm:text-base"
                  >
                    <span className="capitalize mr-2">{featureKey}:</span>{" "}
                    <span className="text-green-500 font-medium">
                      {featureValue}
                    </span>
                  </Typography>
                )
              )
            ) : (
              <Typography color="gray" className="text-sm">
                No specific key features available.
              </Typography>
            )}
          </div>

          <Typography
            variant="h6"
            color="gray"
            className="mb-2 text-sm sm:text-base"
          >
            Category:{" "}
            <span className="text-green-500 font-medium">{category}</span>
          </Typography>

          <div className="mb-2 space-y-2">
            <Typography color="gray" className="text-sm sm:text-base font-bold">
              Individual Rating:{" "}
              <span className="text-green-500 font-medium">
                {individualRating}
              </span>
            </Typography>
            <Typography color="gray" className="text-sm sm:text-base font-bold">
              Average Rating:{" "}
              <span className="text-green-500 font-medium">
                {averageRating}
              </span>
            </Typography>
          </div>

          <Typography
            color="blue-gray"
            variant="h4"
            className="mb-2 font-normal text-lg sm:text-2xl"
          >
            Price:{" "}
            <span className="text-green-500 font-semibold">৳ {price}</span>
          </Typography>
          <Typography className="text-xs text-gray-400 mb-4">
            *Shipping and taxes extra
          </Typography>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              size="md"
              variant="outlined"
              className="border-green-500 text-green-500 hover:bg-green-50 transition duration-500"
              onClick={() => {
                addToWishlist(product);
              }}
            >
              {isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
            </Button>

            <button
              className={`py-3 px-6 rounded-lg text-white uppercase text-sm ${
                status
                  ? "bg-green-600 hover:bg-green-400 cursor-pointer"
                  : "cursor-not-allowed bg-gray-400"
              }`}
              disabled={!status}
              onClick={() => {
                addToCart(product);
                removeFromWishlist(product._id);
              }}
            >
              Add to Cart
            </button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default ProductDetails;
