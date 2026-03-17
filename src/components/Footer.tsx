import {
  FaLinkedin,
  FaFacebook,
  FaTwitter,
  FaEnvelope,
  FaYoutube,
  FaOrcid,
} from "react-icons/fa";
import { FaGoogleScholar } from "react-icons/fa6";

export default function Footer() {
  return (
    <footer className="bg-linear-to-br from-slate-50 via-blue-50 to-indigo-100 text-slate-800 py-14 px-6 border-t border-slate-200">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-3 gap-10 mb-10">
          <div>
            <h3 className="text-2xl font-semibold text-slate-900 mb-3">
              Sharan Shrestha
            </h3>

            <p className="text-slate-700">
              Lecturer, Department of Management
              <br />
              Drabya Shah Multiple Campus, Gorkha
            </p>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-slate-900 mb-3">
              Contact
            </h4>

            <p className="text-slate-700">
              <a
                href="mailto:sharanshrestha255@gmail.com"
                className="cursor-pointer hover:text-indigo-600 transition"
              >
                📧 sharanshrestha255@gmail.com
              </a>
            </p>

            <p className="text-slate-700">📱 +977-9846378214</p>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-slate-900 mb-3">
              Connect
            </h4>

            <div className="flex gap-4 text-xl text-slate-700">
              <a
                href="https://www.linkedin.com/in/sharan-shrestha-31546414a/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-indigo-600 transition"
              >
                <FaLinkedin />
              </a>

              <a
                href="https://www.facebook.com/sharan.shrestha.568"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-indigo-600 transition"
              >
                <FaFacebook />
              </a>

              <a
                href="https://twitter.com/ShresthaSharan?lang=en"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-indigo-600 transition"
              >
                <FaTwitter />
              </a>

              <a
                href="mailto:sharanshrestha255@gmail.com"
                className="hover:text-indigo-600 transition"
              >
                <FaEnvelope />
              </a>

              <a
                href="https://youtube.com/@stha-shrestha?si=bXAgLQFU66PrdmJd"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-indigo-600 transition"
              >
                <FaYoutube />
              </a>

              <a
                href="https://scholar.google.com/citations?user=qAzvzhAAAAAJ&hl=en"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-indigo-600 transition"
              >
                <FaGoogleScholar />
              </a>

              <a
                href="https://orcid.org/my-orcid?orcid=0009-0006-5984-2933"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-indigo-600 transition"
              >
                <FaOrcid />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-300 pt-6 text-center">
          <p className="text-slate-600 text-sm">
            © {new Date().getFullYear()} Sharan Shrestha. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
