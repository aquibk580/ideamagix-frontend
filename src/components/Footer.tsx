import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";

const Footer = () => {
  const theme = useSelector((state: RootState) => state.theme.theme);
  const bgClass = theme === "light" ? "bg-gray-100" : "bg-gray-900";
  const textClass = theme === "light" ? "text-black" : "text-white";
  const shadow = theme === "light" ? "border-t-[2px] border-gray-300 " : "";
  return (
    <footer
      className={`footer ${bgClass} ${textClass} ${shadow} text-base-content sm:p-10 p-5 shadow-md grid grid-cols-1 lg:grid-cols-4  sm:grid-cols-3 gap-6`}
    >
      <nav>
        <h6 className="footer-title">Services</h6>
        <a className="link link-hover">Branding</a>
        <a className="link link-hover">Design</a>
        <a className="link link-hover">Marketing</a>
        <a className="link link-hover">Advertisement</a>
      </nav>
      <nav>
        <h6 className="footer-title">Company</h6>
        <a className="link link-hover">About us</a>
        <a className="link link-hover">Contact</a>
        <a className="link link-hover">Jobs</a>
        <a className="link link-hover">Press kit</a>
      </nav>
      <nav>
        <h6 className="footer-title">Legal</h6>
        <a className="link link-hover">Terms of use</a>
        <a className="link link-hover">Privacy policy</a>
        <a className="link link-hover">Cookie policy</a>
      </nav>
      <form>
        <h6 className="footer-title">Newsletter</h6>
        <fieldset className="form-control w-full sm:w-60">
          <label className="label">
            <span className="label-text">Enter your email address</span>
          </label>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              placeholder="username@site.com"
              className="input input-bordered sm:flex-1"
            />
            <button className="btn btn-primary flex-none">Subscribe</button>
          </div>
        </fieldset>
      </form>
    </footer>
  );
};

export default Footer;
