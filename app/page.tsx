import AuthForm from "./components/AuthForm";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    // <main className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
    <main
      // style={{ fontFamily: "cursive" }}
      className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 z-0">
        {/* <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-800 via-blue-900 to-black" /> */}
        <div className="absolute inset-0 bg-[url('/weather.jpg')] bg-cover bg-center" />
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-gray-500/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-500/20 rounded-full blur-[120px]" />
      </div>
      <div className="z-10 w-full flex flex-col items-center">
        {/* HEADER */}
        <div className="flex justify-center mt-10 mb-6">
          <div className="glass-header text-center px-24 py-6 rounded-2xl">
            <h1 className="title-stroke nowrap font-[Montserrat]">
              GLOBAL CAST
            </h1>

            <div className="flex items-center justify-center gap-6 mt-4">
              <div className="line"></div>

              <p className="subtitle">Weather Intelligence</p>

              <div className="line"></div>
            </div>
          </div>
        </div>

        {/* LOGIN BOX */}
        <div className="w-full max-w-md flex justify-center">
          <AuthForm />
        </div>
      </div>
    </main>
  );
}
