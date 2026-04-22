import AuthForm from "./components/AuthForm";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    // <main className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
    <main
      style={{ fontFamily: "cursive" }}
      className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 z-0">
        {/* <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-800 via-blue-900 to-black" /> */}
        <div className="absolute inset-0 bg-[url('/weather.jpg')] bg-cover bg-center" />
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-gray-500/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-500/20 rounded-full blur-[120px]" />
      </div>
      <div className="z-10 w-full max-w-md">
        <div className="text-center mb-8">
          {/* <h1 className="text-5xl font-bold text-white mb-2 tracking-tight"> */}
          <h1 className="text-5xl font-semibold text-white mb-2 tracking-tight">
            MAUSAM
          </h1>
          {/* <p className="text-white/120 font-bold text-lg"> */}
          <p className="text-white/80 font-medium text-lg">
            Weather Intelligence
          </p>
        </div>
        <AuthForm />
      </div>
    </main>
  );
}
