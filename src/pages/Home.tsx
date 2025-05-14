import { DoctorGrid } from "../components/DoctorGrid.js";
import { useSelector } from "react-redux";
import type { RootState } from "../redux/store.js";

const Home = () => {
  const theme = useSelector((state: RootState) => state.theme.theme);
  const bgClass = theme === "light" ? "bg-gray-100" : "bg-[#26313f]";
  const textClass = theme === "light" ? "text-black" : "text-white";
  return (
    <main className={`mx-auto py-12 pb-32 sm:px-7 px-5  ${bgClass} ${textClass}`}>
      <h1 className="text-3xl font-bold mb-8">Welcome to Health Care Clinic</h1>
      <DoctorGrid />
    </main>
  );
};

export default Home;
