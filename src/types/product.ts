export type TProduct = {
  id: number | string; // يمكن أن يكون ID رقمي أو نصي
  title: string;
  price: number;
  cat_prefix?: string ;
  img: string;
  quantity?:number;
  max:number;
  isLiked?:boolean;
  isAutehnticated?:boolean;
  offer?:number
      showOffer ?:boolean
};