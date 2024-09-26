import AuthImage from "@/components/auth-image";
import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function NotAuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex bg-white">
      <div className="hidden sm:block w-1/2 h-[100vh]">
        <AuthImage></AuthImage>
      </div>
      <div className=" sm:w-1/2 w-full text-black">{children}</div>
    </div>
  );
}
