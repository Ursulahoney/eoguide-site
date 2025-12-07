import React, { useState, useEffect } from 'react';
import {
  Search,
  Clock,
  DollarSign,
  ChevronDown,
  ChevronUp,
  Mail,
  MapPin,
  X,
  Bookmark,
  BookmarkCheck
} from 'lucide-react';

import EosLogo from './eos-logo.png';

// Sample data from the CSV
const sampleOpportunities = [
  {
    id: "OPENCLASSACTIONS_00001",
    title: "Mid America Pet Food Recall $5.5M Class Action",
    description:
      "Class action settlement for Mid America Pet Food recall. Claim up to $20 without proof or up to $100K with proof of purchase.",
    amount: "$20-$100K",
    deadline: "2/5/2026",
    category: "Legal settlements & enforcement",
    difficulty: "Medium",
    state: "MT",
    status: "open",
    daysLeft: 60,
    url: "https://openclassactions.com/settlements/mid-america-pet-food-class-action-settlement.php"
  },
  {
    id: "OPENCLASSACTIONS_00002",
    title: "$4M TreeHouse Foods Waffle Recall Class Action",
    description:
      "Settlement for TreeHouse Foods waffle recall. Claim 2 products without proof or unlimited with proof.",
    amount: "2 Products",
    deadline: "12/16/2025",
    category: "Legal settlements & enforcement",
    difficulty: "Medium",
    state: "MT",
    status: "open",
    daysLeft: 9,
    url: "https://openclassactions.com/settlements/treehouse-foods-waffle-recall-settlement.php"
  },
  {
    id: "OPENCLASSACTIONS_00003",
    title: "$12.5M AARP Facebook Video Privacy Settlement",
    description:
      "Privacy settlement for AARP Facebook video tracking. Eligible members can claim $47-$237.",
    amount: "$47-$237",
    deadline: "12/31/2025",
    category: "Legal settlements & enforcement",
    difficulty: "Medium",
    state: "MT",
    status: "open",
    daysLeft: 24,
    url:
      "https://openclassactions.com/settlements/aarp-facebook-privacy-tracking-class-action-settlement.php"
  },
  {
    id: "OPENCLASSACTIONS_00006",
    title: "$177M AT&T Data Breach Class Action",
    description:
      "AT&T data breach settlement. Claims vary based on documentation, up to $5,000 with proof.",
    amount: "Up to $5,000",
    deadline: "12/18/2025",
    category: "Legal settlements & enforcement",
    difficulty: "Medium",
    state: "MT",
    status: "open",
    daysLeft: 11,
    url: "https://openclassactions.com/settlements/att-data-breach-settlement.php"
  },
  {
    id: "RAILROAD_RETIREMENT_RRB_BENEFITS_OVERVIEW",
    title: "Railroad Retirement Board – Benefits Overview",
    description:
      "Railroad retirement, disability, and survivor benefits for eligible railroad workers and families.",
    amount: "Varies",
    deadline: "Ongoing",
    category: "Unclaimed money & refunds",
    difficulty: "Medium",
    state: "MT",
    status: "open",
    daysLeft: 999,
    url: "https://www.rrb.gov/Benefits"
  },
  {
    id: "TRIBAL_EXAMPLE",
    title: "Tribal Benefits & Services Programs",
    description:
      "Various tribal programs offering financial assistance, healthcare, and education benefits to eligible members.",
    amount: "Varies",
    deadline: "Ongoing",
    category: "Tribal programs",
    difficulty: "Medium",
    state: "MT",
    status: "open",
    daysLeft: 999,
    url: "#"
  }
];

const categories = [
  {
    key: "all",
    name: "All Opportunities",
    icon: "✨",
    color: "from-cyan-400 to-blue-500",
    description: "Browse all available opportunities across every category"
  },
  {
    key: "saved",
    name: "My Saved",
    icon: "🔖",
    color: "from-pink-400 to-rose-500",
    description: "Your bookmarked opportunities for easy access"
  },
  {
    key: "ending",
    name: "Ending Soon",
    icon: "⏰",
    color: "from-red-400 to-pink-500",
    description: "Urgent opportunities with deadlines in the next 30 days"
  },
  {
    key: "Legal settlements & enforcement",
    name: "Legal Settlements",
    icon: "⚖️",
    color: "from-blue-400 to-cyan-500",
    description:
      "Class action settlements, recalls, and legal enforcement opportunities"
  },
  {
    key: "Unclaimed money & refunds",
    name: "Unclaimed Money",
    icon: "💰",
    color: "from-green-400 to-emerald-500",
    description: "Unclaimed property, refunds, credits, and forgotten money"
  },
  {
    key: "Social services & safety net",
    name: "Social Services",
    icon: "🤝",
    color: "from-purple-400 to-indigo-500",
    description:
      "Safety net programs, victim compensation, and social support services"
  },
  {
    key: "Tribal programs",
    name: "Tribal Programs",
    icon: "🪶",
    color: "from-orange-400 to-red-500",
    description:
      "Benefits and services for tribal members and indigenous communities"
  },
  {
    key: "Utilities & energy",
    name: "Utilities & Energy",
    icon: "⚡",
    color: "from-yellow-400 to-amber-500",
    description: "Utility assistance, energy credits, and bill payment programs"
  },
  {
    key: "Agriculture & rural",
    name: "Agriculture",
    icon: "🌾",
    color: "from-lime-400 to-green-500",
    description:
      "Farm assistance, rural development, and agricultural programs"
  },
  {
    key: "Business & jobs",
    name: "Business & Jobs",
    icon: "💼",
    color: "from-slate-400 to-gray-500",
    description:
      "Business grants, job training, and employment opportunities"
  },
  {
    key: "Education & student help",
    name: "Education",
    icon: "🎓",
    color: "from-indigo-400 to-blue-500",
    description:
      "Student aid, scholarships, loan forgiveness, and education grants"
  },
  {
    key: "Health & medical debt",
    name: "Health & Medical",
    icon: "🏥",
    color: "from-rose-400 to-pink-500",
    description:
      "Medical debt relief, healthcare assistance, and health programs"
  },
  {
    key: "Tax & property relief",
    name: "Tax & Property",
    icon: "🏠",
    color: "from-cyan-400 to-teal-500",
    description:
      "Property tax relief, tax credits, and homeowner assistance"
  }
];

const states = ["MT", "WY", "ID", "ND", "SD"];

export default function EosGuide() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedState, setSelectedState] = useState("MT");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showNewsletter, setShowNewsletter] = useState(false);
  const [email, setEmail] = useState("");
  const [scrollY, setScrollY] = useState(0);
  const [categoriesExpanded, setCategoriesExpanded] = useState(false);
  const [savedOpportunities, setSavedOpportunities] = useState(() => {
    const saved = localStorage.getItem("eosguide-saved");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    localStorage.setItem("eosguide-saved", JSON.stringify(savedOpportunities));
  }, [savedOpportunities]);

  const toggleSaved = (oppId) => {
    setSavedOpportunities((prev) =>
      prev.includes(oppId)
        ? prev.filter((id) => id !== oppId)
        : [...prev, oppId]
    );
  };

  const isSaved = (oppId) => savedOpportunities.includes(oppId);

  const filteredOpportunities = sampleOpportunities.filter((opp) => {
    const matchesSearch =
      opp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      opp.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesState = opp.state === selectedState;
    const matchesCategory =
      selectedCategory === "all" ||
      (selectedCategory === "saved" ? isSaved(opp.id) : false) ||
      (selectedCategory === "ending"
        ? opp.daysLeft < 30 && opp.daysLeft > 0
        : false) ||
      opp.category === selectedCategory;

    return matchesSearch && matchesState && matchesCategory;
  });

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    alert(`Thanks for subscribing! We'll send updates to ${email}`);
    setEmail("");
    setShowNewsletter(false);
  };

  const currentCategoryInfo =
    categories.find((cat) => cat.key === selectedCategory) || categories[0];
  const visibleCategories = categoriesExpanded
    ? categories
    : categories.slice(0, 6);

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-purple-50 to-pink-50 relative overflow-hidden">
      {/* Animated background blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute w-96 h-96 bg-gradient-to-br from-cyan-300/20 to-blue-400/20 rounded-full blur-3xl"
          style={{
            top: "10%",
            left: "5%",
            transform: `translateY(${scrollY * 0.3}px)`
          }}
        />
        <div
          className="absolute w-80 h-80 bg-gradient-to-br from-purple-300/20 to-fuchsia-400/20 rounded-full blur-3xl"
          style={{
            top: "60%",
            right: "10%",
            transform: `translateY(${scrollY * -0.2}px)`
          }}
        />
        <div
          className="absolute w-72 h-72 bg-gradient-to-br from-pink-300/20 to-rose-400/20 rounded-full blur-3xl"
          style={{
            bottom: "5%",
            left: "50%",
            transform: `translateY(${scrollY * 0.15}px)`
          }}
        />
      </div>

      {/* Header */}
      <header className="relative z-10 px-4 py-4 sm:px-6 lg:px-8">
        <nav className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3 group cursor-pointer">
            <div className="relative">
             <img
  src={EosLogo}
  alt="Eos Guide Logo"
  className="w-20 h-20 sm:w-24 sm:h-24 transform group-hover:scale-110 transition-transform duration-300"
/>

            </div>
            <div>
              <h1
                className="text-3xl font-black tracking-tight bg-gradient-to-r from-cyan-600 via-purple-600 to-pink-600 bg-clip-text text-transparent"
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                eosguide
              </h1>
              <p className="text-sm sm:text-xs font-medium text-purple-700 tracking-wide">
                We search so you don't have to pretend you like it
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowNewsletter(true)}
            className="hidden sm:flex items-center space-x-2 px-5 py-2.5 text-white rounded-full font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300"
            style={{
              background: "linear-gradient(135deg, #FF6B35 0%, #FF8C42 100%)"
            }}
          >
            <Mail className="w-4 h-4" />
            <span>Get Alerts</span>
          </button>
        </nav>
      </header>

      {/* Hero */}
      <section className="relative z-10 px-4 pt-4 pb-10 sm:px-6 sm:pt-8 sm:pb-12 lg:px-8 lg:pt-12 lg:pb-16">
        <div className="max-w-7xl mx-auto text-center">
          <h2
            className="text-4xl sm:text-5xl lg:text-6xl font-black mb-4 leading-tight"
            style={{ fontFamily: "Montserrat, sans-serif" }}
          >
            <span className="bg-gradient-to-r from-cyan-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Your Money Clearinghouse
            </span>
          </h2>

          <p className="text-lg sm:text-xl text-gray-700 mb-8 max-w-3xl mx-auto font-normal">
  Track opportunities in one searchable place.{" "}
  <span className="text-purple-600 font-semibold">
    Settlements, refunds, benefits, and more.
  </span>
  {" "}
  Save what matters, never miss a deadline.
</p>


          {/* State selector + search */}
          <div className="max-w-3xl mx-auto space-y-4">
            <div className="flex justify-center">
              <div className="inline-flex items-center space-x-2 bg-white/90 backdrop-blur-sm rounded-2xl p-2 shadow-lg">
                <MapPin className="w-5 h-5 text-purple-600 ml-2" />
                <span className="text-sm font-semibold text-gray-700">
                  State:
                </span>
                <select
                  value={selectedState}
                  onChange={(e) => setSelectedState(e.target.value)}
                  className="px-4 py-2 text-white rounded-xl font-bold cursor-pointer hover:shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-purple-400"
                  style={{
                    background:
                      "linear-gradient(135deg, #06B6D4 0%, #8B5CF6 50%, #EC4899 100%)"
                  }}
                >
                  {states.map((state) => (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-300 via-purple-300 to-pink-300 rounded-3xl blur-xl opacity-25 group-hover:opacity-40 transition-opacity duration-300" />
              <div className="relative bg-white rounded-3xl shadow-2xl p-2 flex items-center">
                <Search className="w-6 h-6 text-gray-400 ml-4" />
                <input
                  type="text"
                  placeholder="Search any opportunity type..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1 px-4 py-4 text-lg focus:outline-none font-light"
                />
                <button
                  className="px-6 py-3 text-white rounded-2xl font-bold hover:shadow-lg hover:scale-105 transition-all duration-300"
                  style={{
                    background:
                      "linear-gradient(135deg, #FF6B35 0%, #FF8C42 100%)"
                  }}
                >
                  Search
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category quick links */}
      <section className="relative z-10 px-4 py-6 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <h3
              className="text-xl font-black text-gray-800"
              style={{ fontFamily: "Montserrat, sans-serif" }}
            >
              Browse by Category
            </h3>
            <button
              onClick={() => setCategoriesExpanded(!categoriesExpanded)}
              className="flex items-center space-x-1 text-sm font-semibold text-purple-600 hover:text-purple-700 transition-colors"
            >
              <span>{categoriesExpanded ? "Show Less" : "Show All"}</span>
              {categoriesExpanded ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {visibleCategories.map((category, index) => (
              <button
                key={category.key}
                onClick={() => setSelectedCategory(category.key)}
                className={`p-3 rounded-2xl transition-all duration-300 hover:scale-105 group text-left ${
                  selectedCategory === category.key
                    ? "bg-white shadow-xl ring-2 ring-purple-500"
                    : "bg-white/70 backdrop-blur-sm hover:bg-white hover:shadow-lg"
                }`}
                style={{
                  animation: `fadeInUp 0.5s ease-out ${index * 0.05}s both`
                }}
              >
                <div className="text-3xl mb-1 group-hover:scale-110 transition-transform duration-300">
                  {category.icon}
                </div>
                <div
                  className={`text-xs font-bold bg-gradient-to-r ${category.color} bg-clip-text text-transparent leading-tight`}
                >
                  {category.name}
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Category info */}
      {selectedCategory !== "all" && (
        <section className="relative z-10 px-4 pb-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 border-l-4 border-purple-500">
              <div className="flex items-start space-x-3">
                <div className="text-3xl">{currentCategoryInfo.icon}</div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">
                    {currentCategoryInfo.name}
                  </h4>
                  <p className="text-sm text-gray-600 font-light">
                    {currentCategoryInfo.description}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Opportunities list */}
      <section className="relative z-10 px-4 py-6 sm:px-6 lg:px-8 mb-20">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h3
              className="text-2xl font-black text-gray-800"
              style={{ fontFamily: "Montserrat, sans-serif" }}
            >
              <span className="text-purple-600">
                ({filteredOpportunities.length})
              </span>{" "}
              Opportunities
            </h3>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredOpportunities.map((opp, index) => {
              const catMeta =
                categories.find((c) => c.key === opp.category) || null;

              return (
                <div
                  key={opp.id}
                  className="group bg-white rounded-3xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 relative overflow-hidden"
                  style={{
                    animation: `fadeInUp 0.5s ease-out ${index * 0.1}s both`
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 to-pink-500/0 group-hover:from-purple-500/5 group-hover:to-pink-500/5 transition-all duration-300 rounded-3xl" />

                  <div className="relative">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="inline-flex items-center space-x-1 px-3 py-1 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full text-xs font-bold text-gray-700 mb-2">
                          <span>{catMeta?.icon || "📋"}</span>
                          <span className="truncate">
                            {catMeta?.name || opp.category}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => toggleSaved(opp.id)}
                        className="p-2 hover:bg-purple-50 rounded-full transition-colors flex-shrink-0"
                        title={
                          isSaved(opp.id)
                            ? "Remove from saved"
                            : "Save for later"
                        }
                      >
                        {isSaved(opp.id) ? (
                          <BookmarkCheck className="w-5 h-5 text-purple-600 fill-purple-600" />
                        ) : (
                          <Bookmark className="w-5 h-5 text-gray-400 group-hover:text-purple-600 transition-colors" />
                        )}
                      </button>
                    </div>

                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        {opp.daysLeft > 0 && opp.daysLeft < 30 && (
                          <div className="flex items-center space-x-1 px-3 py-1 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-full text-xs font-bold animate-pulse">
                            <Clock className="w-3 h-3" />
                            <span>{opp.daysLeft}d left</span>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center space-x-1 text-green-600">
                        <DollarSign className="w-5 h-5" />
                        <span className="font-black text-sm">{opp.amount}</span>
                      </div>
                    </div>

                    <h4 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-purple-600 transition-colors duration-300">
                      {opp.title}
                    </h4>

                    <p className="text-sm text-gray-600 mb-4 line-clamp-2 font-light">
                      {opp.description}
                    </p>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 font-normal">
                          Deadline:
                        </span>
                        <span className="font-bold text-gray-900">
                          {opp.deadline}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 font-normal">
                          Difficulty:
                        </span>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold ${
                            opp.difficulty === "Easy"
                              ? "bg-green-100 text-green-700"
                              : opp.difficulty === "Medium"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {opp.difficulty}
                        </span>
                      </div>
                    </div>

                    <a
                      href={opp.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full text-center px-6 py-3 text-white rounded-2xl font-bold hover:shadow-lg hover:scale-105 transition-all duration-300"
                      style={{
                        background:
                          "linear-gradient(135deg, #FF6B35 0%, #FF8C42 100%)"
                      }}
                    >
                      View Details →
                    </a>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredOpportunities.length === 0 && (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">
                {selectedCategory === "saved" ? "🔖" : "🔍"}
              </div>
              <h3 className="text-2xl font-bold text-gray-700 mb-2">
                {selectedCategory === "saved"
                  ? "No saved opportunities yet"
                  : "No opportunities found"}
              </h3>
              <p className="text-gray-600 font-light">
                {selectedCategory === "saved"
                  ? "Start saving opportunities to access them quickly later"
                  : "Try adjusting your search or filters"}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter modal */}
      {showNewsletter && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full relative shadow-2xl animate-scaleIn">
            <button
              onClick={() => setShowNewsletter(false)}
              className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-6">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
                style={{
                  background:
                    "linear-gradient(135deg, #06B6D4 0%, #8B5CF6 50%, #EC4899 100%)"
                }}
              >
                <Mail className="w-8 h-8 text-white" />
              </div>
              <h3
                className="text-3xl font-black mb-2"
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                Never Miss Out
              </h3>
              <p className="text-gray-600 font-normal">
                Get weekly alerts about new opportunities in {selectedState}
              </p>
            </div>

            <form onSubmit={handleNewsletterSubmit} className="space-y-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 focus:border-purple-500 focus:outline-none transition-colors font-light"
              />
              <button
                type="submit"
                className="w-full px-6 py-3 text-white rounded-2xl font-bold hover:shadow-lg hover:scale-105 transition-all duration-300"
                style={{
                  background:
                    "linear-gradient(135deg, #FF6B35 0%, #FF8C42 100%)"
                }}
              >
                Subscribe Free
              </button>
            </form>

            <p className="text-xs text-gray-500 text-center mt-4 font-light">
              Unsubscribe anytime. No spam, ever.
            </p>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="relative z-10 bg-gradient-to-br from-gray-900 to-gray-800 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4
                className="font-black text-xl mb-4 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent"
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                eosguide
              </h4>
              <p className="text-gray-400 text-sm font-light">
                Your clearinghouse for unclaimed money, settlements, and
                opportunities. We organize, you save.
              </p>
            </div>

            <div>
              <h5 className="font-bold mb-4">Quick Links</h5>
              <ul className="space-y-2 text-sm text-gray-400 font-light">
                <li>
                  <a
                    href="#"
                    className="hover:text-cyan-400 transition-colors"
                  >
                    About Us
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-cyan-400 transition-colors"
                  >
                    How It Works
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-cyan-400 transition-colors"
                  >
                    FAQ
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h5 className="font-bold mb-4">Categories</h5>
              <ul className="space-y-2 text-sm text-gray-400 font-light">
                <li>
                  <a
                    href="#"
                    className="hover:text-purple-400 transition-colors"
                  >
                    Legal Settlements
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-purple-400 transition-colors"
                  >
                    Unclaimed Money
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-pink-400 transition-colors"
                  >
                    Tribal Programs
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h5 className="font-bold mb-4">Legal</h5>
              <ul className="space-y-2 text-sm text-gray-400 font-light">
                <li>
                  <a
                    href="#"
                    className="hover:text-orange-400 transition-colors"
                  >
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-orange-400 transition-colors"
                  >
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-orange-400 transition-colors"
                  >
                    Disclaimer
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-700 pt-8 text-center text-sm text-gray-400 font-light">
            <p>
              © 2025 eosguide. All rights reserved. We are not affiliated with
              any settlements or government agencies.
            </p>
          </div>
        </div>
      </footer>

      {/* CSS animations */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700;800;900&display=swap');

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
