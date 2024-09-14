"use client";
import Categories from "@/components/categories";
import Morning from "@/components/morning";
import Recommendations, { categstype } from "@/components/recommendations";
import recs1 from "../../../data/reccomendations.json";
import recs2 from "../../../data/reccomendationsjapan.json";
import Image from "next/image";
import { trpc } from "@/app/_trpc/client";
import { useEffect, useState } from "react";
import { createClient } from "../../../../utils/supabase/client";

export default function StoreAuth() {
  const supabase = createClient();

  const [imgUrl, setImgUrl] = useState<string | null>();

  const products = trpc.getTodos.useQuery();
  const isLoading = products.isLoading;
  const recs3 = products.data;
  console.log(recs3, isLoading);

  return (
    <div className="mb-28">
      <Morning></Morning>
      <h1 className="my-11 text-4xl font-bold ml-[5%]">Top Categories</h1>
      <Categories></Categories>
      <div className="my-11  ml-[5%]">
        <h1 className="text-4xl font-bold">Stuff You Might Like (Allegedly)</h1>
        <p className="mt-2 font-light">
          Personally Picked from your taste and by spying on you.
        </p>
      </div>
      <Recommendations categs={recs3}></Recommendations>
      <div className="my-11  mx-[5%]">
        <Image
          src="/elara.png"
          alt=""
          width={1550}
          height={1550}
          className="w-full rounded-[5%]"
        ></Image>
        <div className=" mb-20 mt-12 flex justify-between text-sm text-gray-400 italic">
          <p>From Hassaan’s 2023 Art Gallery Collection</p>
          <p>Copyright 2024 - Hassaan</p>
        </div>
      </div>

      <div className="my-11  ml-[5%]">
        <h1 className="text-4xl font-bold">Acedia x Tri-Box Collection</h1>
        <p className="mt-2 font-light w-1/2">
          Lorem Ipsum is simply dummy text of the printing and typesetting
          industry. Lorem Ipsum has been the industry's standard dummy text ever
          since the 1500s, when an unknown printer took a galley of type and
          scrambled it to make a type specimen book.
        </p>
      </div>
      <Recommendations categs={recs3}></Recommendations>
      <div className="my-20 hidden md:block  mx-[5%] relative text-black">
        <Image
          src="/japanart.png"
          alt=""
          width={1550}
          height={500}
          className="w-full"
        ></Image>
      </div>
      <div className="mt-4">
        <Recommendations categs={recs3}></Recommendations>
      </div>
    </div>
  );
}
