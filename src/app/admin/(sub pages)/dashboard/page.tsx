"use client";

import Link from "next/link";

export default function AdminDashboard() {
  const dashboardItems = [
    {
      title: "Manage Blogs",
      description: "Create, edit, or remove blog posts",
      icon: "📝",
      href: "/admin/blogs",
      color: "bg-purple-500",
    },
    {
      title: "Manage Online Classes",
      description: "Add, edit, or delete online class information",
      icon: "📚",
      href: "/admin/online-classes",
      color: "bg-green-500",
    },
    {
      title: "Manage Researches",
      description: "Add, edit, or manage research projects",
      icon: "🔬",
      href: "/admin/researches",
      color: "bg-blue-500",
    },
  ];

  return (
    <div className="min-h-screen bg-white text-black">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-black mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-600">
            Manage your website content and settings
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-black mb-6">
            Management Panels
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dashboardItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <div className="h-full bg-white border-2 border-gray-300 rounded-lg p-6 hover:shadow-lg hover:border-blue-500 transition cursor-pointer transform hover:scale-105">
                  <div
                    className={`${item.color} text-white text-4xl w-12 h-12 rounded-lg flex items-center justify-center mb-4`}
                  >
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-bold text-black mb-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 text-sm">{item.description}</p>
                  <div className="mt-4 text-blue-600 font-semibold text-sm">
                    Go to Panel →
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
