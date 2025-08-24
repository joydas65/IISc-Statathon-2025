import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import Playground from "./pages/Playground";
import Datasets from "./pages/Datasets";
import Usage from "./pages/Usage";
import { cn } from "./lib/cn";

export default function App() {
  return (
    <BrowserRouter>
      <div className="h-screen flex flex-col">
        <TopNav />
        <div className="flex-1 overflow-hidden">
          <Routes>
            <Route path="/" element={<Playground />} />
            <Route path="/datasets" element={<Datasets />} />
            <Route path="/usage" element={<Usage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

function TopNav() {
  const base =
    "px-3 py-1.5 rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-300";
  const idle = "text-gray-800 hover:bg-gray-100";
  const active = "bg-black text-white shadow";

  const Item = (props: { to: string; end?: boolean; children: React.ReactNode }) => (
    <NavLink
      to={props.to}
      end={props.end}
      className={({ isActive }) => cn(base, isActive ? active : idle)}
    >
      {props.children}
    </NavLink>
  );

  return (
    <div className="sticky top-0 z-20 border-b bg-white px-4 py-2 flex items-center gap-3">
      <div className="text-base font-semibold">Survey SQL Gateway</div>
      <Item to="/" end>Playground</Item>
      {/* Datasets is restored here and will highlight when active */}
      <Item to="/datasets">Datasets</Item>
      <Item to="/usage">Usage</Item>
      <div className="flex-1" />
      <span className="text-xs text-gray-600">
        API: {import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000"}
      </span>
    </div>
  );
}

function NotFound() {
  return (
    <div className="p-6 text-sm text-gray-600">
      Page not found. <NavLink to="/" className="underline">Go to Playground</NavLink>.
    </div>
  );
}
