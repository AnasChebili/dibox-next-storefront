"use client";

import { ChangeEvent, ReactEventHandler, useState } from "react";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";

import { trpc } from "@/app/_trpc/client";
import { createClient } from "../../utils/supabase/client";
import { getQueryKey } from "@trpc/react-query";
import ImageUpload from "./ui/imageUpload";

type productUpload = {
  created_at: Date;
  image: string[];
  rating: number;
  title: string;
  date: string;
  author: string;
  tags: string[];
  description: string;
};

export default function DashUpload() {
  const [imageState, setImageState] = useState<string[]>([]);

  const supabase = createClient();

  const addTodoMutation = trpc.addTodo.useMutation();
  const utils = trpc.useUtils();

  function handleAddTodo(data: productUpload) {
    addTodoMutation.mutate(data, {
      onSuccess: () => {
        console.log("Todo added successfully!");
        utils.invalidate(undefined, { queryKey: getQueryKey(trpc.getProduct) });
      },
      onError: (error) => {
        console.error("Error adding todo:", error);
      },
    });
  }

  let imageId: string = "";

  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      title: "",
      description: "",
      tags: "",
    },
  });
  const [open, setOpen] = useState(false);

  const uploadFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files![0];
    imageId = `${Math.random()}.${file.name}`;

    const bucket = "documents";

    setImageState((prevvalue) => {
      prevvalue[parseInt(event.target.id)] = imageId;
      return prevvalue;
    });

    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(imageId, file);

    if (error) {
      alert("Error uploading file.");
      console.log(error);
      return;
    }

    alert("File uploaded successfully!");
  };

  const uploadData = (values: {
    title: string;
    description: string;
    tags: string;
  }) => {
    const transformedValues = {
      ...values,
      tags: values.tags.split(","),
    };

    const arr: string[] = [];
    imageState.forEach((element) => {
      if (element) {
        arr.push(element);
      }
    });

    const data = {
      ...transformedValues,
      created_at: new Date(),
      image: arr,
      rating: 4,
      date: "6/4/08",
      author: "abbas",
    };

    console.log(data);

    if (arr.length === 0) {
      alert("you need at least one picture");
    } else {
      handleAddTodo(data);
      setImageState([]);
      reset();
      setOpen(false);
    }
  };

  return (
    <div className=" py-[5%] px-[5%] ">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <button className="w-[150px] h-[150px] flex justify-center items-center  bg-gray-800 bg-opacity-50  text-gray-400 rounded-md">
            <div>
              <p>Add Product </p>
              <p>+</p>
            </div>
          </button>
        </DialogTrigger>
        <DialogContent className="max-w-md w-full border-0 p-6 bg-gray-900 bg-opacity-95 text-gray-400 rounded-lg shadow-md">
          <DialogTitle>Upload Product</DialogTitle>
          <form
            onSubmit={handleSubmit((values) => {
              uploadData(values);
            })}
            className="space-y-4 "
          >
            <div>
              <ImageUpload onChange={uploadFile} id="0"></ImageUpload>
              <ImageUpload onChange={uploadFile} id="1"></ImageUpload>
              <ImageUpload onChange={uploadFile} id="2"></ImageUpload>
              <ImageUpload onChange={uploadFile} id="3"></ImageUpload>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 ">
                Title
              </label>
              <input
                type="text"
                {...register("title", { required: true })}
                className="mt-1 block w-full border border-gray-800 rounded-md bg-transparent py-1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                {...register("description", { required: true })}
                className="mt-1 block w-full border rounded-md bg-transparent border-gray-800"
              ></textarea>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Tags (comma separated)
              </label>
              <input
                type="text"
                {...register("tags")}
                className="mt-1 block w-full border rounded-md bg-transparent border-gray-800 py-1"
              />
            </div>

            <div className="flex justify-end">
              <DialogClose asChild>
                <button
                  type="button"
                  className="mr-2 px-4 py-2 bg-gray-300 rounded-md bg-transparent border-2"
                >
                  Cancel
                </button>
              </DialogClose>
              <button
                type="submit"
                className="px-4 py-2 bg-white text-black font-bold rounded-md"
              >
                Submit
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
