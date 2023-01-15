import { createApi } from 'unsplash-js';

const unsplashApi = createApi({
  accessKey: process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY,
});
const getUrlForCoffeeStores=(latLong,query,limit)=>{
    return `https://api.foursquare.com/v3/places/search?query=${query}&ll=${latLong}&limit=${limit}`
}
const getListOfCoffeeStoresPhotos= async()=>{
  const photos = await unsplashApi.search.getPhotos({
  query: "coffee shop",
  perPage: 30,
});

const unsplashResults=photos.response.results

return unsplashResults.map((result)=>result.urls["small"])
}

export const fetchCoffeeStores=async (
  latLong="23.877532362982823%2C90.39113845303231",
  limit=6,
  )=>{
const photos=await getListOfCoffeeStoresPhotos()
const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: process.env.NEXT_PUBLIC_FOURSQUARE_API_KEY,
  },
};

const response = await fetch( 
  getUrlForCoffeeStores(
  latLong,
  "coffee",
  limit,
  ),
  options
  )
const data = await response.json()
return data.results.map((result,idx)=>{
 const address=result.location.address
 const locality=result.location.locality
  return{
    id: result.fsq_id, 
    address: address?.length>0? address:"Not provided",
    locality: locality?.length>0? locality:"Not provided",
    name:result.name,
    imgUrl:photos.length>0?photos[idx]:null,
  }
})
  // .catch(err => console.error(err));
}  