import { createClient } from "../../utils/supabase/server";
import { publicProcedure, router } from "./trpc";
import { z } from "zod";

const todoSchema = z.object({
  created_at: z.coerce.date(),
  image: z.array(z.string()),
  rating: z.number(),
  title: z.string(),
  date: z.string(),
  author: z.string(),
  tags: z.array(z.string()),
  description: z.string(),
});

const UpdateSchema = z.object({
  id: z.string().uuid(),
  data: z.object({
    image: z.array(z.string()).optional(),
    title: z.string().optional(),
    tags: z.array(z.string()).optional(),
    description: z.string().optional(),
  }),
});

const UserUpdateSchema = z.object({
  id: z.string().uuid(),
  data: z.object({
    username: z.string(),
    image: z.string().optional(),
    email: z.string(),
    name: z.string(),
    bio: z.string().optional(),
  }),
});

const UserAddSchema = z.object({
  id: z.string().uuid(),
  username: z.string(),
  email: z.string(),
  name: z.string(),
  image: z.string().optional(),
  bio: z.string().optional(),
});

export const appRouter = router({
  getTodos: publicProcedure.query(async () => {
    const supabase = createClient();
    const { data: products } = await supabase.from("products").select();
    console.log("data");

    console.log(products);

    return products;
  }),
  addTodo: publicProcedure.input(todoSchema).mutation(async ({ input }) => {
    const supabase = createClient();
    const { error } = await supabase.from("products").insert([
      {
        created_at: input.created_at,
        image: input.image,
        rating: input.rating,
        title: input.title,
        date: input.date,
        author: input.author,
        tags: input.tags,
        description: input.description,
      },
    ]);

    if (error) {
      console.error("Error inserting row:", error.message);
      throw new Error("Failed to add todo");
    }

    return { success: true };
  }),
  getProduct: publicProcedure
    .input(z.string().uuid())
    .query(async ({ input }) => {
      console.log(input);

      const supabase = createClient();
      const { data: product } = await supabase
        .from("products")
        .select()
        .eq("id", input);
      console.log("data");

      console.log(product);

      return product;
    }),
  deleteProduct: publicProcedure
    .input(z.string().uuid())
    .mutation(async ({ input }) => {
      const supabase = createClient();
      const response = await supabase.from("products").delete().eq("id", input);
      console.log(response);
    }),
  updateProduct: publicProcedure
    .input(UpdateSchema)
    .mutation(async ({ input }) => {
      const supabase = createClient();
      const { error } = await supabase
        .from("products")
        .update(input.data)
        .eq("id", input.id);
    }),
  getUser: publicProcedure.input(z.string().uuid()).query(async ({ input }) => {
    const supabase = createClient();
    const { data: user } = await supabase
      .from("users")
      .select()
      .eq("id", input);
    console.log("user");

    console.log(user);

    return user;
  }),
  getAuthUser: publicProcedure.query(async () => {
    const supabase = createClient();

    const { data, error } = await supabase.auth.getUser();
    if (error || !data?.user) {
      return error;
    }
    console.log(data.user);
    return data.user;
  }),
  getImage: publicProcedure.input(z.string()).query(async ({ input }) => {
    const supabase = createClient();

    const { data, error } = await supabase.storage
      .from("documents")
      .getPublicUrl(input);
    if (error) {
      console.log("Error getting public URL: ", error);
    }
    console.log(data.publicUrl);

    return data.publicUrl;
  }),
  updateUser: publicProcedure
    .input(UserUpdateSchema)
    .mutation(async ({ input }) => {
      const supabase = createClient();
      const { error } = await supabase
        .from("users")
        .update(input.data)
        .eq("id", input.id);
    }),
  logout: publicProcedure.mutation(async () => {
    const supabase = createClient();
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error logging out:", error.message);
      throw new Error("error logging out");
    }
    return { success: true };
  }),
  getUsers: publicProcedure.query(async () => {
    const supabase = createClient();
    const { data: users } = await supabase.from("users").select();
    console.log("data");

    console.log(users);

    return users;
  }),
  filterByTag: publicProcedure.input(z.string()).query(async ({ input }) => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .contains("tags", [input]);
    if (error) {
      console.log(error);
    }
    return data;
  }),
  addUser: publicProcedure.input(UserAddSchema).mutation(async ({ input }) => {
    const supabase = createClient();
    const { error } = await supabase.from("users").insert([input]);
    if (error) console.log("error adding userrr", error);
  }),
});

export type AppRouter = typeof appRouter;
